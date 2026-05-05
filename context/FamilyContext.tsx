import { storage } from '../lib/storage';
// src/context/FamilyContext.tsx
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export type FamilyMember = {
  id: string;
  name: string;
  role: string;
  age: string;
  avatar: string;
  water: number;
  steps: number;
  sleep: number;
  mood: number;
  medicines: { name: string; dose: string; time: string; taken: boolean }[];
  vaccines: { name: string; date: string; done: boolean }[];
  joinedAt: number;
};

export type Family = {
  id: string;
  code: string;
  name: string;
  createdAt: number;
  members: FamilyMember[];
};

type FamilyContextType = {
  family: Family | null;
  currentMember: FamilyMember | null;
  createFamily: (familyName: string, member: Omit<FamilyMember, 'id' | 'joinedAt'>) => void;
  joinFamily: (code: string, member: Omit<FamilyMember, 'id' | 'joinedAt'>) => 'success' | 'not_found';
  updateMember: (data: Partial<FamilyMember>) => void;
  leaveFamily: () => void;
};

// ─── مفاتيح التخزين ─────────────────────────────────────────────────────────
const ALL_FAMILIES_KEY = 'all_families_db';

// مفتاح جلسة العائلة مرتبط بالمستخدم الحالي
const sessionKey = (username: string) => `family_session_${username}`;

// جلسة العائلة: تحتوي على familyId + memberId الخاصَّين بهذا المستخدم
type FamilySession = {
  familyId: string;
  memberId: string;
};

// ─── دوال مساعدة ────────────────────────────────────────────────────────────
const generateCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();
const generateId   = () => Date.now().toString(36) + Math.random().toString(36).substring(2, 6);

const getAll = (): Family[] => {
  try { return JSON.parse(storage.get(ALL_FAMILIES_KEY) || '[]'); }
  catch { return []; }
};

const saveAll = (list: Family[]) =>
  storage.set(ALL_FAMILIES_KEY, JSON.stringify(list));

const getSession = (username: string): FamilySession | null => {
  try { return JSON.parse(storage.get(sessionKey(username)) || 'null'); }
  catch { return null; }
};

const saveSession = (username: string, session: FamilySession | null) => {
  if (session) {
    storage.set(sessionKey(username), JSON.stringify(session));
  } else {
    storage.remove(sessionKey(username));
  }
};

// ─── Context ─────────────────────────────────────────────────────────────────
const FamilyContext = createContext<FamilyContextType | null>(null);

export function FamilyProvider({
  children,
  username, // ← اسم المستخدم الحالي (من AuthContext)
}: {
  children: ReactNode;
  username: string | null;
}) {
  const [family,        setFamily]        = useState<Family | null>(null);
  const [currentMember, setCurrentMember] = useState<FamilyMember | null>(null);

  // ─── تحميل الجلسة عند تغيير المستخدم ──────────────────────────────────────
  useEffect(() => {
    if (!username) {
      // لا يوجد مستخدم مسجّل → امسح الحالة
      setFamily(null);
      setCurrentMember(null);
      return;
    }

    const session = getSession(username);
    if (!session) {
      setFamily(null);
      setCurrentMember(null);
      return;
    }

    // ابحث عن العائلة في قاعدة البيانات المشتركة
    const allFamilies = getAll();
    const fam = allFamilies.find(f => f.id === session.familyId);
    if (!fam) {
      // العائلة محذوفة → امسح الجلسة
      saveSession(username, null);
      setFamily(null);
      setCurrentMember(null);
      return;
    }

    // ابحث عن العضو بـ memberId الخاص بهذا المستخدم
    const member = fam.members.find(m => m.id === session.memberId);
    if (!member) {
      saveSession(username, null);
      setFamily(null);
      setCurrentMember(null);
      return;
    }

    setFamily(fam);
    setCurrentMember(member);
  }, [username]);

  // ─── مزامنة كل 3 ثوانٍ — يُحدّث بيانات الأعضاء الآخرين ──────────────────
  useEffect(() => {
    if (!username || !family || !currentMember) return;

    const sync = () => {
      const allFamilies = getAll();
      const fresh = allFamilies.find(f => f.id === family.id);
      if (!fresh) return; // العائلة محذوفة

      // حدّث العضو الحالي من النسخة الأحدث
      const freshMember = fresh.members.find(m => m.id === currentMember.id);
      if (!freshMember) return;

      // هل هناك تغيير فعلي في الأعضاء؟
      const changed =
        fresh.members.length !== family.members.length ||
        JSON.stringify(fresh.members) !== JSON.stringify(family.members);

      if (changed) {
        setFamily({ ...fresh });
        setCurrentMember({ ...freshMember });
      }
    };

    const t = setInterval(sync, 3000);

    // استمع لـ storage event (تغيير من تبويب آخر)
    const onStorage = (e: StorageEvent) => {
      if (e.key === ALL_FAMILIES_KEY) sync();
    };
    window.addEventListener('storage', onStorage);

    return () => {
      clearInterval(t);
      window.removeEventListener('storage', onStorage);
    };
  }, [username, family, currentMember]);

  // ─── إنشاء عائلة جديدة ──────────────────────────────────────────────────────
  const createFamily = useCallback((
    familyName: string,
    memberData: Omit<FamilyMember, 'id' | 'joinedAt'>,
  ) => {
    if (!username) return;

    const memberId = generateId();
    const familyId = generateId();

    const newMember: FamilyMember = {
      ...memberData,
      id: memberId,
      joinedAt: Date.now(),
    };

    const newFamily: Family = {
      id: familyId,
      code: generateCode(),
      name: familyName,
      createdAt: Date.now(),
      members: [newMember],
    };

    // احفظ في قاعدة البيانات المشتركة
    const allFamilies = getAll();
    saveAll([...allFamilies, newFamily]);

    // احفظ الجلسة مرتبطة بـ username
    saveSession(username, { familyId, memberId });

    setFamily(newFamily);
    setCurrentMember(newMember);
  }, [username]);

  // ─── الانضمام لعائلة موجودة ───────────────────────────────────────────────
  const joinFamily = useCallback((
    code: string,
    memberData: Omit<FamilyMember, 'id' | 'joinedAt'>,
  ): 'success' | 'not_found' => {
    if (!username) return 'not_found';

    const allFamilies = getAll();
    const fam = allFamilies.find(f => f.code === code.trim().toUpperCase());
    if (!fam) return 'not_found';

    const memberId = generateId();

    const newMember: FamilyMember = {
      ...memberData,
      id: memberId,
      joinedAt: Date.now(),
    };

    // أضف العضو للعائلة
    const updatedFam: Family = {
      ...fam,
      members: [...fam.members, newMember],
    };

    const updatedAll = allFamilies.map(f => f.id === fam.id ? updatedFam : f);
    saveAll(updatedAll);

    // احفظ الجلسة مرتبطة بـ username
    saveSession(username, { familyId: fam.id, memberId });

    setFamily(updatedFam);
    setCurrentMember(newMember);

    return 'success';
  }, [username]);

  // ─── تحديث بيانات العضو الحالي ────────────────────────────────────────────
  const updateMember = useCallback((data: Partial<FamilyMember>) => {
    if (!username || !family || !currentMember) return;

    // اقرأ أحدث نسخة لتجنب تعارض التحديثات
    const allFamilies = getAll();
    const fam = allFamilies.find(f => f.id === family.id);
    if (!fam) return;

    const updatedMember: FamilyMember = { ...currentMember, ...data };
    const updatedFam: Family = {
      ...fam,
      members: fam.members.map(m => m.id === currentMember.id ? updatedMember : m),
    };

    const updatedAll = allFamilies.map(f => f.id === family.id ? updatedFam : f);
    saveAll(updatedAll);

    setFamily(updatedFam);
    setCurrentMember(updatedMember);
  }, [username, family, currentMember]);

  // ─── مغادرة العائلة ───────────────────────────────────────────────────────
  const leaveFamily = useCallback(() => {
    if (!username || !family || !currentMember) return;

    const allFamilies = getAll();
    const fam = allFamilies.find(f => f.id === family.id);
    if (!fam) return;

    const remaining = fam.members.filter(m => m.id !== currentMember.id);

    if (remaining.length === 0) {
      // لا يبقى أعضاء → احذف العائلة بالكامل
      saveAll(allFamilies.filter(f => f.id !== family.id));
    } else {
      const updatedFam: Family = { ...fam, members: remaining };
      saveAll(allFamilies.map(f => f.id === family.id ? updatedFam : f));
    }

    // احذف جلسة هذا المستخدم فقط
    saveSession(username, null);

    setFamily(null);
    setCurrentMember(null);
  }, [username, family, currentMember]);

  return (
    <FamilyContext.Provider value={{
      family, currentMember,
      createFamily, joinFamily, updateMember, leaveFamily,
    }}>
      {children}
    </FamilyContext.Provider>
  );
}

export const useFamily = () => {
  const ctx = useContext(FamilyContext);
  if (!ctx) throw new Error('useFamily must be used inside FamilyProvider');
  return ctx;
};

