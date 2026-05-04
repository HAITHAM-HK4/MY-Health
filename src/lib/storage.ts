// src/lib/storage.ts
import { supabase } from './supabaseClient';

let currentUserId: string | null = null;

// ─── استخرج userId بشكل صحيح ──────────────────────────────────────────────────
// 🔴 BUG FIX #1: current_user مخزنة double-serialized، نحتاج parse مرتين
const getUserId = (): string | null => {
  if (currentUserId) return currentUserId;
  try {
    const raw = localStorage.getItem('current_user');
    if (!raw) return null;

    let parsed = JSON.parse(raw);
    // إذا لا زالت string بعد parse أولى، نعمل parse ثانية (double-serialization)
    if (typeof parsed === 'string') {
      parsed = JSON.parse(parsed);
    }
    // الآن parsed يجب أن يكون { username: string }
    if (parsed && typeof parsed === 'object' && parsed.username) {
      return parsed.username as string;
    }
    return null;
  } catch {
    return null;
  }
};

// ─── تحقق من صحة القيمة ───────────────────────────────────────────────────────
const safeGetRaw = (key: string): string | null => {
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  if (raw === '[object Object]' || raw === 'undefined' || raw === 'null') {
    localStorage.removeItem(key);
    return null;
  }
  return raw;
};

// ─── مفاتيح لا ترفع لـ Supabase ──────────────────────────────────────────────
const skipSyncKeys = ['users_db', 'current_user', 'display_name'];

// ─── رفع لـ Supabase (fire-and-forget) ────────────────────────────────────────
const syncToSupabase = (key: string, value: string): void => {
  const uid = getUserId();
  if (!uid) return;
  if (skipSyncKeys.some((k) => key.startsWith(k))) return;

  supabase
    .from('user_data')
    .upsert({ user_id: uid, key, value }, { onConflict: 'user_id,key' })
    .then(({ error }) => {
      if (error) console.error('❌ Sync error [' + key + ']:', error.message);
    });
};

// ─── حذف من Supabase (fire-and-forget) ────────────────────────────────────────
const deleteFromSupabase = (key: string, uid?: string): void => {
  const userId = uid ?? getUserId();
  if (!userId) return;

  supabase
    .from('user_data')
    .delete()
    .eq('user_id', userId)
    .eq('key', key)
    .then(({ error }) => {
      if (error) console.error('❌ Delete error [' + key + ']:', error.message);
    });
};

// ─── تحميل بيانات المستخدم من Supabase ───────────────────────────────────────
// 🔴 BUG FIX #3: يُعيد كتابة البيانات من Supabase حتى لو الـ key موجود محلياً
export const initStorageForUser = async (userId: string): Promise<void> => {
  currentUserId = userId;

  try {
    // اختبار الاتصال
    const { error: testError } = await supabase
      .from('user_data')
      .upsert(
        { user_id: userId, key: '_init', value: new Date().toISOString() },
        { onConflict: 'user_id,key' }
      );

    if (testError) {
      console.error('❌ Supabase write FAILED:', testError.message);
    } else {
      console.log('✅ Supabase write OK for user:', userId);
    }

    // حمّل بيانات المستخدم
    const { data, error } = await supabase
      .from('user_data')
      .select('key, value')
      .eq('user_id', userId);

    if (error) {
      console.error('Supabase load error:', error.message);
      return;
    }

    if (data) {
      data.forEach(({ key, value }: { key: string; value: string }) => {
        // ✅ نُعيد الكتابة دائماً ما عدا _init والمفاتيح الحساسة
        if (key !== '_init' && value) {
          localStorage.setItem(key, value);
        }
      });
    }
  } catch (err) {
    console.error('initStorageForUser failed:', err);
  }
};

// ─── مسح متغير الجلسة فقط (لا يمسح البيانات من أي مكان) ──────────────────────
export const clearStorageForUser = (): void => {
  currentUserId = null;
};

// ─── واجهة storage ────────────────────────────────────────────────────────────
export const storage = {

  // ─── قراءة raw string من localStorage ────────────────────────────────────
  getItem(key: string): string | null {
    return safeGetRaw(key);
  },

  // ─── كتابة raw string + sync لـ Supabase ─────────────────────────────────
  setItem(key: string, value: string): void {
    const safeValue = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, safeValue);
    syncToSupabase(key, safeValue);
  },

  // ─── حذف من localStorage فقط (بدون Supabase) ─────────────────────────────
  // 🔴 BUG FIX #2: أضفنا removeLocalOnly لتجنب حذف Supabase عند switch/logout
  removeLocalOnly(key: string): void {
    localStorage.removeItem(key);
  },

  // ─── حذف من localStorage + Supabase ──────────────────────────────────────
  removeItem(key: string): void {
    localStorage.removeItem(key);
    deleteFromSupabase(key);
  },

  // ─── قراءة بـ JSON.parse (يرجع T أو fallback) ────────────────────────────
  // ملاحظة: set() يستدعي JSON.stringify → get() يستدعي JSON.parse → متوازنان
  get<T = unknown>(key: string, fallback?: T): T | undefined {
    const raw = safeGetRaw(key);
    if (raw === null) return fallback;
    try {
      return JSON.parse(raw) as T;
    } catch {
      localStorage.removeItem(key);
      return fallback;
    }
  },

  // ─── كتابة بـ JSON.stringify + sync لـ Supabase ───────────────────────────
  set<T>(key: string, value: T): void {
    const str = JSON.stringify(value);
    localStorage.setItem(key, str);
    syncToSupabase(key, str);
  },

  // ─── اختصار لـ removeItem (localStorage + Supabase) ──────────────────────
  remove(key: string): void {
    this.removeItem(key);
  },
};