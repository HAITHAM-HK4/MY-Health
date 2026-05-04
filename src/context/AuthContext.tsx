// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { storage } from '../lib/storage';
import { supabase } from '../lib/supabaseClient';
import { initStorageForUser, clearStorageForUser } from '../lib/storage';

type User = { username: string };
type AuthContextType = {
  user: User | null;
  displayName: string;
  setDisplayName: (name: string) => void;
  login:  (username: string, pass: string) => string | null;
  signup: (username: string, pass: string) => string | null;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

// ─── مفاتيح يجب عدم مسحها أبداً ─────────────────────────────────────────────
const PERSISTENT_PREFIXES = [
  'all_families_db',
  'family_session_',
  'reminders_',
  'app_reminders',
  'users_db',
  'user_data_',
];

const isPersistent = (key: string): boolean =>
  PERSISTENT_PREFIXES.some(prefix => key.startsWith(prefix));

// ─── مفتاح displayName خاص بكل مستخدم ──────────────────────────────────────
const displayNameKey = (username: string) => `display_name_${username}`;

// ─── قراءة جميع مفاتيح localStorage الحالية ─────────────────────────────────
const getAllLocalKeys = (): string[] => {
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) keys.push(key);
  }
  return keys;
};

// ─── حفظ بيانات المستخدم الحالي في localStorage snapshot ────────────────────
// 🔴 BUG FIX #4: نستخدم localStorage.getItem مباشرة (raw strings) لتجنب
//    تضخم التسلسل (triple-serialization)
const saveCurrentUserData = (username: string) => {
  const snapshot: Record<string, string> = {};
  getAllLocalKeys().forEach(key => {
    if (!isPersistent(key)) {
      const raw = localStorage.getItem(key);
      if (raw !== null) snapshot[key] = raw;
    }
  });
  // نحفظ snapshot كـ JSON عبر storage.set (double-serialized، متوافق مع get)
  storage.set(`user_data_${username}`, snapshot);
};

// ─── تحميل بيانات مستخدم من snapshot ────────────────────────────────────────
// 🔴 BUG FIX #2: نستخدم removeLocalOnly بدلاً من remove لتجنب مسح Supabase
const loadUserData = (username: string) => {
  // احفظ المفاتيح الدائمة أولاً
  const persistent: Record<string, string> = {};
  getAllLocalKeys().forEach(key => {
    if (isPersistent(key)) {
      const raw = localStorage.getItem(key);
      if (raw !== null) persistent[key] = raw;
    }
  });

  // امسح المفاتيح المؤقتة من localStorage فقط (لا من Supabase)
  getAllLocalKeys()
    .filter(k => !isPersistent(k))
    .forEach(k => storage.removeLocalOnly(k));

  // استعد snapshot المستخدم
  try {
    // storage.get يعمل JSON.parse → يرجع الـ object المحفوظ
    const snapshot = storage.get<Record<string, string>>(`user_data_${username}`, {});
    if (snapshot && typeof snapshot === 'object') {
      Object.entries(snapshot).forEach(([k, v]) => {
        if (!isPersistent(k) && v !== null && v !== undefined) {
          // v هي raw string كما حُفظت → نكتبها مباشرة
          localStorage.setItem(k, String(v));
        }
      });
    }
  } catch { /* ignore */ }

  // استعد المفاتيح الدائمة
  Object.entries(persistent).forEach(([k, v]) => {
    if (!localStorage.getItem(k)) {
      localStorage.setItem(k, v);
    }
  });
};

// ─── مسح البيانات المؤقتة من localStorage فقط ───────────────────────────────
// 🔴 BUG FIX #2: removeLocalOnly بدلاً من remove
const clearCurrentUserData = () => {
  getAllLocalKeys()
    .filter(key => !isPersistent(key))
    .forEach(k => storage.removeLocalOnly(k));
};

// ─── قاعدة بيانات المستخدمين ─────────────────────────────────────────────────
type UsersDB = Record<string, string>;

const getUsersDB = (): UsersDB => {
  try {
    // storage.get يرجع parsed object مباشرة
    const db = storage.get<UsersDB>('users_db', {});
    return db && typeof db === 'object' ? db : {};
  } catch {
    return {};
  }
};

const saveUsersDB = (db: UsersDB) =>
  storage.set('users_db', db); // storage.set يعمل JSON.stringify تلقائياً

// ─────────────────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [displayName, setDisplayNameState] = useState<string>('');

  // استعد الجلسة عند بدء التطبيق
  useEffect(() => {
    try {
      // storage.get يعمل JSON.parse → يرجع { username: string }
      const saved = storage.get<User>('current_user');
      if (saved && saved.username) {
        setUser(saved);
        const storedName = storage.get<string>(displayNameKey(saved.username));
        setDisplayNameState(storedName ?? saved.username);
        // استعد بيانات Supabase للمستخدم
        initStorageForUser(saved.username);
      }
    } catch { /* ignore */ }
  }, []);

  // ─── تعديل الاسم المعروض (reactive) ──────────────────────────────────────
  const setDisplayName = (name: string) => {
    if (!user) return;
    setDisplayNameState(name);
    storage.set(displayNameKey(user.username), name);
    storage.set('username', name);
  };

  // ─── تسجيل الدخول ────────────────────────────────────────────────────────
  const login = (username: string, pass: string): string | null => {
    if (!username.trim()) return 'أدخل اسم المستخدم';
    if (!pass.trim())     return 'أدخل كلمة المرور';

    const db = getUsersDB();
    if (!db[username])         return 'المستخدم غير موجود';
    if (db[username] !== pass) return 'كلمة المرور غير صحيحة';

    // احفظ بيانات المستخدم الحالي قبل التبديل
    const currentUser = storage.get<User>('current_user');
    if (currentUser?.username && currentUser.username !== username) {
      saveCurrentUserData(currentUser.username);
    }

    // حمّل بيانات المستخدم الجديد
    loadUserData(username);

    const loggedUser: User = { username };
    storage.set('current_user', loggedUser); // storage.set يعمل JSON.stringify
    setUser(loggedUser);

    // تحميل بيانات المستخدم من Supabase (async، لا توقف التطبيق)
    initStorageForUser(username);

    const storedName = storage.get<string>(displayNameKey(username));
    setDisplayNameState(storedName ?? username);

    return null;
  };

  // ─── إنشاء حساب ──────────────────────────────────────────────────────────
  const signup = (username: string, pass: string): string | null => {
    if (!username.trim()) return 'أدخل اسم المستخدم';
    if (username.length < 3) return 'الاسم 3 أحرف على الأقل';
    if (!pass.trim())     return 'أدخل كلمة المرور';
    if (pass.length < 4)  return 'كلمة المرور 4 أحرف على الأقل';

    const db = getUsersDB();
    if (db[username]) return 'اسم المستخدم مأخوذ';

    // احفظ بيانات المستخدم الحالي
    const currentUser = storage.get<User>('current_user');
    if (currentUser?.username) {
      saveCurrentUserData(currentUser.username);
    }

    db[username] = pass;
    saveUsersDB(db);

    clearCurrentUserData();

    storage.set(displayNameKey(username), username);
    storage.set('username', username);

    const newUser: User = { username };
    storage.set('current_user', newUser);
    setUser(newUser);
    setDisplayNameState(username);

    return null;
  };

  // ─── تسجيل الخروج ────────────────────────────────────────────────────────
  const logout = () => {
    // امسح متغير الجلسة (لا يمسح Supabase)
    clearStorageForUser();

    // احفظ بيانات المستخدم الحالي قبل الخروج
    const currentUser = storage.get<User>('current_user');
    if (currentUser?.username) {
      saveCurrentUserData(currentUser.username);
    }

    // امسح البيانات المؤقتة من localStorage فقط (لا Supabase)
    clearCurrentUserData();
    storage.removeLocalOnly('current_user'); // ← لا نمسح من Supabase
    setUser(null);
    setDisplayNameState('');
  };

  return (
    <AuthContext.Provider value={{ user, displayName, setDisplayName, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};