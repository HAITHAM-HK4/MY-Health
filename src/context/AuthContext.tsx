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
  login:  (username: string, pass: string) => Promise<string | null>;
  signup: (username: string, pass: string) => Promise<string | null>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

const PERSISTENT_PREFIXES = [
  'all_families_db', 'family_session_', 'reminders_',
  'app_reminders', 'users_db', 'user_data_',
];

const isPersistent = (key: string): boolean =>
  PERSISTENT_PREFIXES.some(prefix => key.startsWith(prefix));

const displayNameKey = (username: string) => `display_name_${username}`;

const getAllLocalKeys = (): string[] => {
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) keys.push(key);
  }
  return keys;
};

const saveCurrentUserData = (username: string) => {
  const snapshot: Record<string, string> = {};
  getAllLocalKeys().forEach(key => {
    if (!isPersistent(key)) {
      const raw = localStorage.getItem(key);
      if (raw !== null) snapshot[key] = raw;
    }
  });
  storage.set(`user_data_${username}`, snapshot);
};

const loadUserData = (username: string) => {
  const persistent: Record<string, string> = {};
  getAllLocalKeys().forEach(key => {
    if (isPersistent(key)) {
      const raw = localStorage.getItem(key);
      if (raw !== null) persistent[key] = raw;
    }
  });

  getAllLocalKeys()
    .filter(k => !isPersistent(k))
    .forEach(k => storage.removeLocalOnly(k));

  try {
    const snapshot = storage.get<Record<string, string>>(`user_data_${username}`, {});
    if (snapshot && typeof snapshot === 'object') {
      Object.entries(snapshot).forEach(([k, v]) => {
        if (!isPersistent(k) && v !== null && v !== undefined) {
          localStorage.setItem(k, String(v));
        }
      });
    }
  } catch { /* ignore */ }

  Object.entries(persistent).forEach(([k, v]) => {
    if (!localStorage.getItem(k)) localStorage.setItem(k, v);
  });
};

const clearCurrentUserData = () => {
  getAllLocalKeys()
    .filter(key => !isPersistent(key))
    .forEach(k => storage.removeLocalOnly(k));
};

// ─────────────────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [displayName, setDisplayNameState] = useState<string>('');

  useEffect(() => {
    try {
      const saved = storage.get<User>('current_user');
      if (saved && saved.username) {
        setUser(saved);
        const storedName = storage.get<string>(displayNameKey(saved.username));
        setDisplayNameState(storedName ?? saved.username);
        initStorageForUser(saved.username);
      }
    } catch { /* ignore */ }
  }, []);

  const setDisplayName = (name: string) => {
    if (!user) return;
    setDisplayNameState(name);
    storage.set(displayNameKey(user.username), name);
    storage.set('username', name);
  };

  // ─── تسجيل الدخول ────────────────────────────────────────────────────────
  const login = async (username: string, pass: string): Promise<string | null> => {
    if (!username.trim()) return 'أدخل اسم المستخدم';
    if (!pass.trim())     return 'أدخل كلمة المرور';

    try {
      const { data, error } = await supabase
        .from('users')
        .select('username, password, display_name')
        .eq('username', username.trim())
        .maybeSingle(); // ✅ يرجع null بدل error إذا غير موجود

      if (error) return 'حدث خطأ في الاتصال';
      if (!data)  return 'المستخدم غير موجود';
      if (data.password !== pass) return 'كلمة المرور غير صحيحة';

      const currentUser = storage.get<User>('current_user');
      if (currentUser?.username && currentUser.username !== username) {
        saveCurrentUserData(currentUser.username);
      }

      loadUserData(username);

      const loggedUser: User = { username };
      storage.set('current_user', loggedUser);
      setUser(loggedUser);
      initStorageForUser(username);

      const storedName = data.display_name || username;
      storage.set(displayNameKey(username), storedName);
      setDisplayNameState(storedName);

      return null;
    } catch {
      return 'حدث خطأ، تحقق من الاتصال';
    }
  };

  // ─── إنشاء حساب ──────────────────────────────────────────────────────────
  const signup = async (username: string, pass: string): Promise<string | null> => {
    if (!username.trim())    return 'أدخل اسم المستخدم';
    if (username.length < 3) return 'الاسم 3 أحرف على الأقل';
    if (!pass.trim())        return 'أدخل كلمة المرور';
    if (pass.length < 4)     return 'كلمة المرور 4 أحرف على الأقل';

    try {
      // تحقق إذا كان المستخدم موجوداً
      const { data: existing, error: checkError } = await supabase
        .from('users')
        .select('username')
        .eq('username', username.trim())
        .maybeSingle(); // ✅ يرجع null بدل error إذا غير موجود

      if (checkError) return 'حدث خطأ في الاتصال';
      if (existing)   return 'اسم المستخدم مأخوذ';

      // أنشئ المستخدم
      const { error: insertError } = await supabase
        .from('users')
        .insert({ username: username.trim(), password: pass, display_name: username.trim() });

      if (insertError) return 'حدث خطأ أثناء إنشاء الحساب';

      const currentUser = storage.get<User>('current_user');
      if (currentUser?.username) saveCurrentUserData(currentUser.username);

      clearCurrentUserData();
      storage.set(displayNameKey(username), username);
      storage.set('username', username);

      const newUser: User = { username };
      storage.set('current_user', newUser);
      setUser(newUser);
      setDisplayNameState(username);

      return null;
    } catch {
      return 'حدث خطأ، تحقق من الاتصال';
    }
  };

  // ─── تسجيل الخروج ────────────────────────────────────────────────────────
  const logout = () => {
    clearStorageForUser();
    const currentUser = storage.get<User>('current_user');
    if (currentUser?.username) saveCurrentUserData(currentUser.username);
    clearCurrentUserData();
    storage.removeLocalOnly('current_user');
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
