import { storage } from '../lib/storage';
// src/components/NotificationCenter.tsx
import { useState, useEffect, useCallback } from 'react';
import { useFamily } from '../context/FamilyContext';

export const REMINDERS_KEY = 'app_reminders';

export type Reminder = {
  id: string;
  toMemberId: string;
  fromName: string;
  fromAvatar: string;
  message: string;
  ts: number;
  read: boolean;
};

export const getReminders = (): Reminder[] => {
  try {
    return JSON.parse(storage.get(REMINDERS_KEY) || '[]');
  } catch {
    return [];
  }
};

export const saveReminders = (r: Reminder[]) => {
  storage.set(REMINDERS_KEY, JSON.stringify(r));
  window.dispatchEvent(new StorageEvent('storage', { key: REMINDERS_KEY }));
};

export function formatTimeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const sec  = Math.floor(diff / 1000);
  const min  = Math.floor(sec  / 60);
  const hr   = Math.floor(min  / 60);
  const day  = Math.floor(hr   / 24);
  const week = Math.floor(day  / 7);

  if (sec  <  60) return 'الآن';
  if (min  <  60) return `منذ ${min} دقيقة`;
  if (hr   <  24) return `منذ ${hr} ساعة`;
  if (day  <   7) return `منذ ${day} يوم`;
  if (week <   5) return `منذ ${week} أسبوع`;

  return new Date(ts).toLocaleDateString('ar-SA', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

export function useUnreadCount(memberId: string | undefined): number {
  const [count, setCount] = useState(0);

  const refresh = useCallback(() => {
    if (!memberId) { setCount(0); return; }
    const all = getReminders();
    setCount(all.filter(r => r.toMemberId === memberId && !r.read).length);
  }, [memberId]);

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 2000);
    const onStorage = (e: StorageEvent) => {
      if (e.key === REMINDERS_KEY) refresh();
    };
    window.addEventListener('storage', onStorage);
    return () => { clearInterval(t); window.removeEventListener('storage', onStorage); };
  }, [refresh]);

  return count;
}

type Props = { onClose: () => void };

export default function NotificationCenter({ onClose }: Props) {
  const { currentMember } = useFamily();
  const memberId = currentMember?.id;

  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [open, setOpen] = useState(false); // للأنيميشن
  const [, setTick] = useState(0);

  /* فتح بأنيميشن */
  useEffect(() => {
    const t = setTimeout(() => setOpen(true), 20);
    return () => clearTimeout(t);
  }, []);

  const handleClose = () => {
    setOpen(false);
    setTimeout(onClose, 350);
  };

  const load = useCallback(() => {
    if (!memberId) { setReminders([]); return; }
    const all = getReminders();
    const mine = all
      .filter(r => r.toMemberId === memberId)
      .sort((a, b) => b.ts - a.ts);
    setReminders(mine);
  }, [memberId]);

  useEffect(() => {
    load();
    const t = setInterval(load, 2000);
    const onStorage = (e: StorageEvent) => {
      if (e.key === REMINDERS_KEY) load();
    };
    window.addEventListener('storage', onStorage);
    const tickTimer = setInterval(() => setTick(v => v + 1), 60_000);
    return () => {
      clearInterval(t);
      clearInterval(tickTimer);
      window.removeEventListener('storage', onStorage);
    };
  }, [load]);

  const markRead = (id: string) => {
    const updated = getReminders().map(r =>
      r.id === id ? { ...r, read: true } : r,
    );
    saveReminders(updated);
    load();
  };

  const markAllRead = () => {
    if (!memberId) return;
    const updated = getReminders().map(r =>
      r.toMemberId === memberId ? { ...r, read: true } : r,
    );
    saveReminders(updated);
    load();
  };

  const deleteReminder = (id: string) => {
    saveReminders(getReminders().filter(r => r.id !== id));
    load();
  };

  const deleteAll = () => {
    if (!memberId) return;
    saveReminders(getReminders().filter(r => r.toMemberId !== memberId));
    load();
  };

  const unread = reminders.filter(r => !r.read).length;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={handleClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 800,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          opacity: open ? 1 : 0,
          transition: 'opacity .35s ease',
        }}
      />

      {/* Panel — يدخل من اليسار */}
      <div style={{
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        zIndex: 900,
        width: 'min(340px, 88vw)',
        background: 'linear-gradient(180deg,#1e293b 0%,#0f172a 100%)',
        borderRadius: '0 20px 20px 0',
        border: '1px solid rgba(99,102,241,0.3)',
        borderLeft: 'none',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '8px 0 40px rgba(0,0,0,0.5)',
        transform: open ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform .35s cubic-bezier(.22,1,.36,1)',
      }}>

        {/* Header */}
        <div style={{
          padding: '52px 16px 14px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'linear-gradient(180deg,rgba(99,102,241,0.12) 0%, transparent 100%)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 22 }}>🔔</span>
            <span style={{ color: '#e2e8f0', fontWeight: 700, fontSize: 17 }}>
              الإشعارات
            </span>
            {unread > 0 && (
              <span style={{
                background: '#ef4444', color: '#fff',
                fontSize: 11, fontWeight: 700,
                borderRadius: 99, padding: '2px 8px',
              }}>
                {unread} جديد
              </span>
            )}
          </div>

          {/* زر الإغلاق */}
          <button onClick={handleClose} style={{
            background: 'rgba(255,255,255,0.07)',
            border: 'none', borderRadius: 8,
            color: '#94a3b8', fontSize: 20,
            width: 34, height: 34, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>×</button>
        </div>

        {/* أزرار قراءة / مسح */}
        {(unread > 0 || reminders.length > 0) && (
          <div style={{
            display: 'flex', gap: 8, padding: '10px 12px',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
          }}>
            {unread > 0 && (
              <button onClick={markAllRead} style={{
                flex: 1,
                background: 'rgba(99,102,241,0.15)',
                color: '#a5b4fc',
                border: '1px solid rgba(99,102,241,0.3)',
                borderRadius: 8, padding: '6px 0',
                fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
              }}>
                ✓ قراءة الكل
              </button>
            )}
            {reminders.length > 0 && (
              <button onClick={deleteAll} style={{
                flex: 1,
                background: 'rgba(239,68,68,0.12)',
                color: '#fca5a5',
                border: '1px solid rgba(239,68,68,0.25)',
                borderRadius: 8, padding: '6px 0',
                fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
              }}>
                🗑️ مسح الكل
              </button>
            )}
          </div>
        )}

        {/* قائمة الإشعارات */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '8px 12px 24px' }}>
          {reminders.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '60px 20px',
              color: 'rgba(148,163,184,0.5)',
            }}>
              <div style={{ fontSize: 44, marginBottom: 12 }}>🔕</div>
              <p style={{ fontSize: 14, margin: 0 }}>لا توجد إشعارات</p>
            </div>
          ) : (
            reminders.map(r => (
              <div
                key={r.id}
                onClick={() => !r.read && markRead(r.id)}
                style={{
                  background: r.read
                    ? 'rgba(255,255,255,0.03)'
                    : 'rgba(99,102,241,0.1)',
                  border: `1px solid ${r.read
                    ? 'rgba(255,255,255,0.06)'
                    : 'rgba(99,102,241,0.25)'}`,
                  borderRadius: 14,
                  padding: '12px 14px',
                  marginBottom: 8,
                  display: 'flex', alignItems: 'flex-start', gap: 10,
                  cursor: r.read ? 'default' : 'pointer',
                  transition: 'all 0.2s',
                  position: 'relative',
                }}
              >
                <span style={{ fontSize: 28, flexShrink: 0 }}>{r.fromAvatar}</span>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    color: '#a5b4fc', fontSize: 12, fontWeight: 600,
                    margin: '0 0 3px',
                  }}>
                    {r.fromName} أرسل لك تذكيراً
                  </p>
                  <p style={{
                    color: r.read ? '#94a3b8' : '#e2e8f0',
                    fontSize: 13, fontWeight: r.read ? 400 : 600,
                    margin: '0 0 6px',
                    wordBreak: 'break-word',
                  }}>
                    {r.message}
                  </p>
                  <p style={{
                    color: '#64748b', fontSize: 11, margin: 0,
                    display: 'flex', alignItems: 'center', gap: 4,
                  }}>
                    🕐 {formatTimeAgo(r.ts)}
                  </p>
                </div>

                <div style={{
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: 6, flexShrink: 0,
                }}>
                  {!r.read && (
                    <span style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: '#6366f1',
                      boxShadow: '0 0 6px #6366f1',
                    }} />
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteReminder(r.id); }}
                    style={{
                      background: 'rgba(239,68,68,0.12)',
                      border: '1px solid rgba(239,68,68,0.2)',
                      borderRadius: 6,
                      color: '#fca5a5',
                      width: 26, height: 26,
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13,
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

