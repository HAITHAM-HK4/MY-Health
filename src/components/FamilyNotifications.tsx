import { storage } from '../lib/storage';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useFamily } from '../context/FamilyContext';
import type { FamilyMember } from '../context/FamilyContext';

type NotifPrefs = Record<string, boolean>;
type FiredMap   = Record<string, boolean>;

type InAppNotif = {
  id: string;
  memberName: string;
  memberAvatar: string;
  medName: string;
  medTime: string;
  ts: number;
  dismissed: boolean;
  /** animation state */
  visible: boolean;
};

const getPrefs = (): NotifPrefs => {
  try { return JSON.parse(storage.get('family_notif_prefs') || '{}'); }
  catch { return {}; }
};
const savePrefs = (p: NotifPrefs) =>
  storage.set('family_notif_prefs', JSON.stringify(p));

const getFired = (): FiredMap => {
  try { return JSON.parse(storage.get('family_notif_fired') || '{}'); }
  catch { return {}; }
};
const saveFired = (f: FiredMap) =>
  storage.set('family_notif_fired', JSON.stringify(f));

const todayKey = () => new Date().toISOString().slice(0, 10);

const requestPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  const res = await Notification.requestPermission();
  return res === 'granted';
};

const fireBrowserNotif = (member: FamilyMember, medName: string, medTime: string) => {
  if (Notification.permission !== 'granted') return;
  new Notification(`💊 تذكير دواء — ${member.name}`, {
    body: `حان وقت ${medName} — ${medTime}`,
    icon: '/logo192.png',
    tag: `med-${member.id}-${medName}`,
  });
};

/* ─────────── Toast Card (من الجانب) ─────────── */
function InAppToast({
  notif,
  onDismiss,
}: {
  notif: InAppNotif;
  onDismiss: (id: string) => void;
}) {
  const [exiting, setExiting] = useState(false);

  const dismiss = () => {
    setExiting(true);
    setTimeout(() => onDismiss(notif.id), 380);
  };

  /* auto-dismiss بعد 6 ثواني */
  useEffect(() => {
    const t = setTimeout(dismiss, 6000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        /* slide من اليمين */
        transform: exiting
          ? 'translateX(calc(100% + 24px))'
          : notif.visible
          ? 'translateX(0)'
          : 'translateX(calc(100% + 24px))',
        opacity: exiting ? 0 : notif.visible ? 1 : 0,
        transition: 'transform 0.38s cubic-bezier(.22,1,.36,1), opacity 0.32s ease',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        background: 'linear-gradient(135deg,rgba(30,27,75,.97) 0%,rgba(15,23,42,.97) 100%)',
        border: '1px solid rgba(99,102,241,.45)',
        boxShadow:
          '0 0 0 1px rgba(99,102,241,.15), 0 8px 32px rgba(0,0,0,.55), 0 0 20px rgba(99,102,241,.2)',
        borderRadius: 16,
        padding: '12px 14px',
        minWidth: 260,
        maxWidth: 310,
        cursor: 'pointer',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
      onClick={dismiss}
    >
      {/* Avatar */}
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: '50%',
          background: 'linear-gradient(135deg,#6366f1,#818cf8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 22,
          flexShrink: 0,
          boxShadow: '0 0 12px rgba(99,102,241,.6)',
        }}
      >
        {notif.memberAvatar}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            background: 'rgba(99,102,241,.18)',
            border: '1px solid rgba(99,102,241,.35)',
            borderRadius: 20,
            padding: '1px 8px',
            marginBottom: 4,
          }}
        >
          <span style={{ fontSize: 10, color: '#818cf8', fontWeight: 700, letterSpacing: 0.5 }}>
            💊 تذكير دواء
          </span>
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0', lineHeight: 1.3 }}>
          {notif.memberName}
        </div>
        <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
          {notif.medName} — {notif.medTime}
        </div>
      </div>

      {/* Close */}
      <button
        onClick={(e) => { e.stopPropagation(); dismiss(); }}
        style={{
          background: 'rgba(148,163,184,.12)',
          border: 'none',
          borderRadius: '50%',
          width: 22,
          height: 22,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: '#64748b',
          fontSize: 12,
          flexShrink: 0,
          marginTop: -2,
        }}
      >
        ✕
      </button>

      {/* Progress bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 2,
          borderRadius: '0 0 16px 16px',
          background: 'rgba(99,102,241,.25)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            background: 'linear-gradient(90deg,#6366f1,#818cf8)',
            animation: 'familyNotifShrink 6s linear forwards',
          }}
        />
      </div>

      <style>{`
        @keyframes familyNotifShrink {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
    </div>
  );
}

/* ─────────── Main Component ─────────── */
export default function FamilyNotifications() {
  const { family } = useFamily();
  const [notifs, setNotifs]   = useState<InAppNotif[]>([]);
  const [prefs, setPrefs]     = useState<NotifPrefs>(getPrefs);
  const firedRef              = useRef<FiredMap>(getFired());
  const permRef               = useRef(false);

  /* طلب الإذن مرة واحدة */
  useEffect(() => {
    requestPermission().then((ok) => { permRef.current = ok; });
  }, []);

  const dismissNotif = (id: string) =>
    setNotifs((prev) => prev.filter((n) => n.id !== id));

  const check = useCallback(() => {
    if (!family) return;
    const now  = new Date();
    const hhmm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const dk   = todayKey();

    family.members.forEach((m) => {
      /* تجاهل إذا كان الإشعار مُعطَّل لهذا العضو */
      if (prefs[m.id] === false) return;

      m.medicines.forEach((med) => {
        const key = `${dk}_${m.id}_${med.name}_${med.time}`;
        if (firedRef.current[key]) return;
        if (med.time !== hhmm) return;

        /* سجّل كـ مُطلَق */
        const fired = { ...firedRef.current, [key]: true };
        firedRef.current = fired;
        saveFired(fired);

        /* Browser notification */
        if (permRef.current) fireBrowserNotif(m, med.name, med.time);

        /* In-app toast */
        const id = `${key}_${Date.now()}`;
        const newNotif: InAppNotif = {
          id,
          memberName:   m.name,
          memberAvatar: m.avatar,
          medName:      med.name,
          medTime:      med.time,
          ts:           Date.now(),
          dismissed:    false,
          visible:      false,
        };

        setNotifs((prev) => [...prev, newNotif]);

        /* تأخير صغير لتشغيل الأنيميشن بعد الإضافة للـ DOM */
        setTimeout(() =>
          setNotifs((prev) =>
            prev.map((n) => (n.id === id ? { ...n, visible: true } : n))
          ), 30
        );
      });
    });
  }, [family, prefs]);

  /* فحص كل 30 ثانية */
  useEffect(() => {
    check();
    const interval = setInterval(check, 30_000);
    return () => clearInterval(interval);
  }, [check]);

  /* إعادة تحميل prefs عند التغيير */
  useEffect(() => {
    setPrefs(getPrefs());
  }, []);

  if (!family) return null;

  return (
    <>
      {/* ── حاوية الـ Toasts — الجانب الأيمن ── */}
      <div
        style={{
          position: 'fixed',
          top: 80,
          right: 16,
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          pointerEvents: 'none',
        }}
      >
        {notifs.map((n) => (
          <div key={n.id} style={{ pointerEvents: 'auto', position: 'relative' }}>
            <InAppToast notif={n} onDismiss={dismissNotif} />
          </div>
        ))}
      </div>

      {/* ── إعدادات الإشعارات لكل عضو (اختياري — اتركه إذا تريد) ── */}
      {family.members.map((m) => (
        <input
          key={m.id}
          type="checkbox"
          id={`notif-pref-${m.id}`}
          checked={prefs[m.id] !== false}
          style={{ display: 'none' }}
          onChange={(e) => {
            const updated = { ...prefs, [m.id]: e.target.checked };
            setPrefs(updated);
            savePrefs(updated);
          }}
        />
      ))}
    </>
  );
}

