// src/pages/FamilyHome.tsx
import { useState, useEffect, useCallback } from 'react';
import { useFamily } from '../context/FamilyContext';
import { useAuth } from '../context/AuthContext';
import type { FamilyMember } from '../context/FamilyContext';
import {
  REMINDERS_KEY,
  getReminders,
  saveReminders,
  type Reminder,
} from '../components/NotificationCenter';

type Props = { theme?: 'dark' | 'light' };

// ═══════════════════════════════════
//  StatBar
// ═══════════════════════════════════
function StatBar({
  icon, label, value, max, color, dark,
}: {
  icon: string; label: string; value: number; max: number; color: string; dark: boolean;
}) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 3,
      }}>
        <span style={{ fontSize: 11, color: dark ? 'rgba(148,163,184,0.9)' : '#475569', display: 'flex', alignItems: 'center', gap: 4 }}>
          <span>{icon}</span> {label}
        </span>
        <span style={{ fontSize: 11, fontWeight: 700, color: dark ? '#e2e8f0' : '#1e293b' }}>
          {value}<span style={{ fontSize: 10, fontWeight: 400, color: dark ? '#94a3b8' : '#64748b' }}>/{max}</span>
        </span>
      </div>
      <div style={{
        height: 6, borderRadius: 99,
        background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%', width: `${pct}%`,
          background: color,
          borderRadius: 99,
          transition: 'width 0.6s ease',
          boxShadow: `0 0 6px ${color}80`,
        }} />
      </div>
    </div>
  );
}

// ═══════════════════════════════════
//  ReminderModal
// ═══════════════════════════════════
function ReminderModal({
  target, fromMember, onClose, dark,
}: {
  target: FamilyMember;
  fromMember: FamilyMember;
  onClose: () => void;
  dark: boolean;
}) {
  const [msg, setMsg] = useState('');
  const [sent, setSent] = useState(false);

  const QUICK = ['اشرب الماء 💧', 'وقت الدواء 💊', 'تمرين خفيف 🏃', 'استرح قليلاً 😴', 'وجبتك جاهزة 🍽️'];

  const sendReminder = (text: string) => {
    const reminders = getReminders();
    const newReminder: Reminder = {
      id: Date.now().toString(),
      toMemberId: target.id,
      fromName: fromMember.name,
      fromAvatar: fromMember.avatar,
      message: text,
      ts: Date.now(),
      read: false,
    };
    saveReminders([newReminder, ...reminders]);
    setSent(true);
    setTimeout(onClose, 1200);
  };

  const overlayBg  = dark ? 'rgba(0,0,0,0.7)'   : 'rgba(0,0,0,0.45)';
  const modalBg    = dark ? '#1e293b'             : '#ffffff';
  const modalBord  = dark ? 'rgba(99,102,241,.3)' : 'rgba(99,102,241,.25)';
  const titleColor = dark ? '#e2e8f0'             : '#1e293b';
  const subColor   = dark ? '#94a3b8'             : '#475569';
  const inputBg    = dark ? 'rgba(255,255,255,.07)': '#f1f5f9';
  const inputColor = dark ? '#e2e8f0'             : '#1e293b';
  const inputBord  = dark ? 'rgba(255,255,255,.12)': '#cbd5e1';
  const quickBg    = dark ? 'rgba(99,102,241,.15)' : '#ede9fe';
  const quickColor = dark ? '#a5b4fc'              : '#4f46e5';
  const quickBord  = dark ? 'rgba(99,102,241,.3)'  : '#c4b5fd';

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: overlayBg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
    }} onClick={onClose}>
      <div style={{
        background: modalBg,
        border: `1px solid ${modalBord}`,
        borderRadius: 20,
        padding: 24,
        width: '100%', maxWidth: 360,
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }} onClick={e => e.stopPropagation()}>

        {sent ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
            <p style={{ color: titleColor, fontWeight: 700, fontSize: 16 }}>تم الإرسال!</p>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <span style={{ fontSize: 32 }}>{target.avatar}</span>
              <div>
                <p style={{ color: titleColor, fontWeight: 700, fontSize: 15, margin: 0 }}>
                  تذكير لـ {target.name}
                </p>
                <p style={{ color: subColor, fontSize: 12, margin: 0 }}>{target.role}</p>
              </div>
            </div>

            {/* رسائل سريعة */}
            <p style={{ color: subColor, fontSize: 12, marginBottom: 8 }}>رسائل سريعة:</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
              {QUICK.map(q => (
                <button key={q} onClick={() => sendReminder(q)} style={{
                  background: quickBg, color: quickColor,
                  border: `1px solid ${quickBord}`,
                  borderRadius: 20, padding: '5px 12px',
                  fontSize: 12, cursor: 'pointer',
                  fontFamily: 'inherit',
                }}>
                  {q}
                </button>
              ))}
            </div>

            {/* رسالة مخصصة */}
            <textarea
              value={msg}
              onChange={e => setMsg(e.target.value)}
              placeholder="اكتب رسالة مخصصة..."
              rows={3}
              style={{
                width: '100%', borderRadius: 10,
                background: inputBg, color: inputColor,
                border: `1px solid ${inputBord}`,
                padding: '10px 12px', fontSize: 13,
                resize: 'none', outline: 'none',
                fontFamily: 'inherit', boxSizing: 'border-box',
              }}
            />
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button onClick={onClose} style={{
                flex: 1, padding: '10px', borderRadius: 10,
                background: dark ? 'rgba(255,255,255,.07)' : '#f1f5f9',
                color: subColor,
                border: `1px solid ${inputBord}`,
                cursor: 'pointer', fontFamily: 'inherit', fontSize: 13,
              }}>إلغاء</button>
              <button
                onClick={() => msg.trim() && sendReminder(msg.trim())}
                disabled={!msg.trim()}
                style={{
                  flex: 2, padding: '10px', borderRadius: 10,
                  background: msg.trim() ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : (dark ? 'rgba(255,255,255,.05)' : '#e2e8f0'),
                  color: msg.trim() ? '#fff' : (dark ? '#4b5563' : '#9ca3af'),
                  border: 'none', cursor: msg.trim() ? 'pointer' : 'not-allowed',
                  fontFamily: 'inherit', fontSize: 13, fontWeight: 700,
                }}>إرسال 📨</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════
//  IncomingReminders
// ═══════════════════════════════════
function IncomingReminders({ myId, dark }: { myId: string; dark: boolean }) {
  const [items, setItems] = useState<Reminder[]>([]);

  const load = useCallback(() => {
    const all = getReminders();
    setItems(all.filter(r => r.toMemberId === myId && !r.read));
  }, [myId]);

  useEffect(() => {
    load();
    const t = setInterval(load, 2000);
    const onStorage = (e: StorageEvent) => {
      if (e.key === REMINDERS_KEY) load();
    };
    window.addEventListener('storage', onStorage);
    return () => { clearInterval(t); window.removeEventListener('storage', onStorage); };
  }, [load]);

  const dismiss = (id: string) => {
    const updated = getReminders().map(r => r.id === id ? { ...r, read: true } : r);
    saveReminders(updated);
    load();
  };

  if (!items.length) return null;

  const toastBg   = dark ? 'rgba(30,41,59,0.97)'   : 'rgba(255,255,255,0.98)';
  const toastBord = dark ? 'rgba(99,102,241,0.4)'   : 'rgba(99,102,241,0.3)';
  const msgColor  = dark ? '#e2e8f0'                : '#1e293b';
  const fromColor = dark ? '#94a3b8'                : '#64748b';

  return (
    <div style={{ position: 'fixed', top: 70, left: 12, right: 12, zIndex: 900, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {items.slice(0, 3).map(r => (
        <div key={r.id} style={{
          background: toastBg,
          border: `1px solid ${toastBord}`,
          borderRadius: 14, padding: '10px 14px',
          display: 'flex', alignItems: 'center', gap: 10,
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          animation: 'fadeUp 0.3s ease',
        }}>
          <span style={{ fontSize: 28 }}>{r.fromAvatar}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ color: msgColor, fontSize: 13, fontWeight: 600, margin: 0 }}>{r.message}</p>
            <p style={{ color: fromColor, fontSize: 11, margin: 0 }}>من {r.fromName}</p>
          </div>
          <button onClick={() => dismiss(r.id)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: fromColor, fontSize: 18, padding: 4,
          }}>×</button>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════
//  MemberCard
// ═══════════════════════════════════
function MemberCard({
  member, isMe, onView, onRemind, dark,
}: {
  member: FamilyMember; isMe: boolean;
  onView: () => void; onRemind: () => void; dark: boolean;
}) {
  // ── ألوان حسب الوضع ──
  const cardBg     = dark
    ? (isMe ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.04)')
    : (isMe ? 'rgba(99,102,241,0.08)' : '#ffffff');
  const cardBorder = dark
    ? (isMe ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.1)')
    : (isMe ? 'rgba(99,102,241,0.35)' : '#e2e8f0');
  const namColor   = dark ? '#e2e8f0' : '#1e293b';
  const roleColor  = dark ? '#94a3b8' : '#64748b';
  const meBadgeBg  = dark ? 'rgba(99,102,241,0.25)' : '#ede9fe';
  const meBadgeCol = dark ? '#a5b4fc' : '#4f46e5';

  return (
    <div style={{
      background: cardBg,
      border: `1px solid ${cardBorder}`,
      borderRadius: 16, padding: 14,
      marginBottom: 10,
      boxShadow: isMe
        ? (dark ? '0 0 20px rgba(99,102,241,0.15)' : '0 2px 12px rgba(99,102,241,0.12)')
        : (dark ? 'none' : '0 1px 4px rgba(0,0,0,0.06)'),
      transition: 'all 0.2s',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <div style={{ position: 'relative' }}>
          <span style={{ fontSize: 36 }}>{member.avatar}</span>
          {isMe && (
            <span style={{
              position: 'absolute', bottom: -2, right: -2,
              width: 10, height: 10, borderRadius: '50%',
              background: '#22c55e',
              border: `2px solid ${dark ? '#0f172a' : '#ffffff'}`,
            }} />
          )}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: namColor, fontWeight: 700, fontSize: 15 }}>{member.name}</span>
            {isMe && (
              <span style={{
                background: meBadgeBg, color: meBadgeCol,
                fontSize: 10, padding: '2px 7px', borderRadius: 99, fontWeight: 700,
              }}>أنا</span>
            )}
          </div>
          <span style={{ color: roleColor, fontSize: 12 }}>
            {member.role} · {member.age} سنة
          </span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={onView} style={{
            background: dark ? 'rgba(99,102,241,0.15)' : '#ede9fe',
            color: dark ? '#a5b4fc' : '#4f46e5',
            border: `1px solid ${dark ? 'rgba(99,102,241,0.3)' : '#c4b5fd'}`,
            borderRadius: 10, padding: '5px 10px',
            fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
          }}>👁️</button>
          {!isMe && (
            <button onClick={onRemind} style={{
              background: dark ? 'rgba(34,197,94,0.15)' : '#dcfce7',
              color: dark ? '#86efac' : '#16a34a',
              border: `1px solid ${dark ? 'rgba(34,197,94,0.3)' : '#bbf7d0'}`,
              borderRadius: 10, padding: '5px 10px',
              fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
            }}>🔔</button>
          )}
        </div>
      </div>

      {/* Stats */}
      <StatBar icon="💧" label="ماء"    value={member.water} max={8}     color="#22d3ee" dark={dark} />
      <StatBar icon="👟" label="خطوات" value={member.steps} max={10000} color="#a78bfa" dark={dark} />
      <StatBar icon="🌙" label="نوم"    value={member.sleep} max={8}     color="#fb923c" dark={dark} />
    </div>
  );
}

// ═══════════════════════════════════
//  MemberDetail
// ═══════════════════════════════════
function MemberDetail({ member, onClose, dark }: { member: FamilyMember; onClose: () => void; dark: boolean }) {
  const overlayBg = dark ? 'rgba(0,0,0,0.75)' : 'rgba(0,0,0,0.5)';
  const modalBg   = dark ? '#1e293b' : '#ffffff';
  const modalBord = dark ? 'rgba(255,255,255,0.1)' : '#e2e8f0';
  const titleCol  = dark ? '#e2e8f0' : '#1e293b';
  const subCol    = dark ? '#94a3b8' : '#64748b';
  const secBg     = dark ? 'rgba(255,255,255,0.04)' : '#f8fafc';
  const secBord   = dark ? 'rgba(255,255,255,0.08)' : '#e2e8f0';
  const secTitle  = dark ? '#cbd5e1' : '#334155';
  const itemCol   = dark ? '#e2e8f0' : '#1e293b';
  const tagBg     = dark ? 'rgba(99,102,241,0.15)' : '#ede9fe';
  const tagCol    = dark ? '#a5b4fc' : '#4f46e5';

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: overlayBg,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    }} onClick={onClose}>
      <div style={{
        background: modalBg, border: `1px solid ${modalBord}`,
        borderRadius: '20px 20px 0 0', padding: 24,
        width: '100%', maxWidth: 480,
        maxHeight: '80vh', overflowY: 'auto',
        boxShadow: '0 -10px 40px rgba(0,0,0,0.25)',
      }} onClick={e => e.stopPropagation()}>

        {/* drag handle */}
        <div style={{ width: 40, height: 4, borderRadius: 99, background: dark ? 'rgba(255,255,255,0.2)' : '#cbd5e1', margin: '0 auto 16px' }} />

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 56, marginBottom: 8 }}>{member.avatar}</div>
          <h2 style={{ color: titleCol, fontWeight: 700, fontSize: 20, margin: 0 }}>{member.name}</h2>
          <p style={{ color: subCol, fontSize: 13, margin: '4px 0 0' }}>{member.role} · {member.age} سنة</p>
        </div>

        {/* Stats */}
        <div style={{ marginBottom: 16 }}>
          <StatBar icon="💧" label="ماء"    value={member.water} max={8}     color="#22d3ee" dark={dark} />
          <StatBar icon="👟" label="خطوات" value={member.steps} max={10000} color="#a78bfa" dark={dark} />
          <StatBar icon="🌙" label="نوم"    value={member.sleep} max={8}     color="#fb923c" dark={dark} />
          <StatBar icon="😊" label="مزاج"   value={member.mood}  max={5}     color="#f472b6" dark={dark} />
        </div>

        {/* Medicines */}
        {member.medicines?.length > 0 && (
          <div style={{ background: secBg, border: `1px solid ${secBord}`, borderRadius: 12, padding: 14, marginBottom: 12 }}>
            <p style={{ color: secTitle, fontWeight: 700, fontSize: 13, margin: '0 0 10px' }}>💊 الأدوية</p>
            {member.medicines.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ color: itemCol, fontSize: 13 }}>{m.name} — {m.dose}</span>
                <span style={{ background: tagBg, color: tagCol, fontSize: 11, padding: '2px 8px', borderRadius: 99 }}>{m.time}</span>
              </div>
            ))}
          </div>
        )}

        {/* Vaccines */}
        {member.vaccines?.length > 0 && (
          <div style={{ background: secBg, border: `1px solid ${secBord}`, borderRadius: 12, padding: 14, marginBottom: 12 }}>
            <p style={{ color: secTitle, fontWeight: 700, fontSize: 13, margin: '0 0 10px' }}>💉 اللقاحات</p>
            {member.vaccines.map((v, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ color: itemCol, fontSize: 13 }}>{v.name}</span>
                <span style={{
                  background: v.done ? (dark ? 'rgba(34,197,94,0.15)' : '#dcfce7') : (dark ? 'rgba(251,191,36,0.15)' : '#fef9c3'),
                  color: v.done ? (dark ? '#86efac' : '#16a34a') : (dark ? '#fcd34d' : '#b45309'),
                  fontSize: 11, padding: '2px 8px', borderRadius: 99,
                }}>{v.done ? '✅ مكتمل' : '⏳ معلق'}</span>
              </div>
            ))}
          </div>
        )}

        <button onClick={onClose} style={{
          width: '100%', padding: 12, borderRadius: 12,
          background: dark ? 'rgba(255,255,255,0.07)' : '#f1f5f9',
          color: dark ? '#94a3b8' : '#64748b',
          border: `1px solid ${secBord}`,
          cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, fontWeight: 600,
        }}>إغلاق</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════
//  FamilyHome — الصفحة الرئيسية
// ═══════════════════════════════════
export default function FamilyHome({ theme }: Props) {
  const dark = theme === 'dark';
  const { family, currentMember, leaveFamily } = useFamily();
  const { user } = useAuth();
  const [detailMember, setDetailMember] = useState<FamilyMember | null>(null);
  const [reminderTarget, setReminderTarget] = useState<FamilyMember | null>(null);
  const [copied, setCopied] = useState(false);

  const myId = currentMember?.id;

  const copyCode = () => {
    if (!family?.code) return;
    navigator.clipboard.writeText(family.code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // ── ألوان حسب الوضع ──
  const pageBg      = dark ? '#0f172a'                    : '#f0f4ff';
  const headerBg    = dark ? 'rgba(15,23,42,0.95)'        : 'rgba(255,255,255,0.97)';
  const headerBord  = dark ? 'rgba(99,102,241,0.3)'       : 'rgba(99,102,241,0.2)';
  const titleColor  = dark ? '#e2e8f0'                    : '#1e293b';
  const subColor    = dark ? '#94a3b8'                    : '#64748b';
  const codeBg      = dark ? 'rgba(99,102,241,0.12)'      : '#ede9fe';
  const codeBord    = dark ? 'rgba(99,102,241,0.3)'       : '#c4b5fd';
  const codeColor   = dark ? '#a5b4fc'                    : '#4f46e5';
  const sectionBg   = dark ? 'rgba(255,255,255,0.03)'     : '#ffffff';
  const sectionBord = dark ? 'rgba(255,255,255,0.08)'     : '#e2e8f0';
  const sectionTitle= dark ? '#cbd5e1'                    : '#334155';
  const leaveBg     = dark ? 'rgba(239,68,68,0.1)'        : '#fef2f2';
  const leaveBord   = dark ? 'rgba(239,68,68,0.3)'        : '#fecaca';
  const leaveColor  = dark ? '#fca5a5'                    : '#dc2626';
  const remindAllBg = dark ? 'rgba(34,197,94,0.12)'       : '#dcfce7';
  const remindAllBord= dark? 'rgba(34,197,94,0.3)'        : '#86efac';
  const remindAllCol= dark ? '#86efac'                    : '#16a34a';
  const statsBg     = dark ? 'rgba(255,255,255,0.04)'     : '#f8fafc';
  const statsBord   = dark ? 'rgba(255,255,255,0.08)'     : '#e2e8f0';
  const statsTitle  = dark ? '#94a3b8'                    : '#64748b';
  const statsVal    = dark ? '#e2e8f0'                    : '#1e293b';

  if (!family || !currentMember) return null;

  const others = family.members.filter(m => m.id !== myId);
  const totalWater = family.members.reduce((s, m) => s + m.water, 0);
  const totalSteps = family.members.reduce((s, m) => s + m.steps, 0);

  return (
    <div style={{ background: pageBg, minHeight: '100vh', paddingBottom: 90 }}>

      {/* ── Header ── */}
      <div style={{
        background: headerBg,
        borderBottom: `1px solid ${headerBord}`,
        padding: '16px 16px 12px',
        backdropFilter: 'blur(12px)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ color: titleColor, fontSize: 20, fontWeight: 800, margin: 0 }}>
              👨‍👩‍👧‍👦 {family.name}
            </h1>
            <p style={{ color: subColor, fontSize: 12, margin: '2px 0 0' }}>
              {family.members.length} أعضاء
            </p>
          </div>
          {/* كود الدعوة */}
          <button onClick={copyCode} style={{
            background: codeBg, border: `1px solid ${codeBord}`,
            borderRadius: 10, padding: '6px 12px',
            display: 'flex', alignItems: 'center', gap: 6,
            cursor: 'pointer',
          }}>
            <span style={{ color: codeColor, fontSize: 12, fontWeight: 700, direction: 'ltr' }}>
              {copied ? '✅ تم النسخ' : `# ${family.code}`}
            </span>
            {!copied && <span style={{ fontSize: 14 }}>📋</span>}
          </button>
        </div>

        {/* أزرار تذكير الجميع + مغادرة */}
        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          <button
            onClick={() => setReminderTarget({ ...currentMember, id: '__all__' } as any)}
            style={{
              flex: 1, background: remindAllBg,
              border: `1px solid ${remindAllBord}`,
              color: remindAllCol,
              borderRadius: 10, padding: '8px 0',
              fontSize: 12, fontWeight: 700,
              cursor: 'pointer', fontFamily: 'inherit',
            }}>
            🔔 تذكير للجميع
          </button>
          <button onClick={leaveFamily} style={{
            background: leaveBg, border: `1px solid ${leaveBord}`,
            color: leaveColor,
            borderRadius: 10, padding: '8px 14px',
            fontSize: 12, fontWeight: 700,
            cursor: 'pointer', fontFamily: 'inherit',
          }}>
            🚪 خروج
          </button>
        </div>
      </div>

      {/* ── الإشعارات الواردة ── */}
      {myId && <IncomingReminders myId={myId} dark={dark} />}

      <div style={{ padding: '14px 14px 0' }}>

        {/* ── بطاقتي أنا ── */}
        <div style={{
          background: sectionBg,
          border: `1px solid ${sectionBord}`,
          borderRadius: 16, padding: 14, marginBottom: 14,
        }}>
          <p style={{ color: sectionTitle, fontSize: 12, fontWeight: 700, margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: 1 }}>
            ملفي الصحي
          </p>
          <MemberCard
            member={currentMember}
            isMe={true}
            onView={() => setDetailMember(currentMember)}
            onRemind={() => {}}
            dark={dark}
          />
        </div>

        {/* ── إحصائيات العائلة ── */}
        <div style={{
          background: statsBg, border: `1px solid ${statsBord}`,
          borderRadius: 16, padding: 14, marginBottom: 14,
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 10,
        }}>
          {[
            { icon: '💧', label: 'مجموع الماء', val: `${totalWater} كوب`, color: '#22d3ee' },
            { icon: '👟', label: 'مجموع الخطوات', val: totalSteps.toLocaleString(), color: '#a78bfa' },
            { icon: '👥', label: 'الأعضاء', val: `${family.members.length} شخص`, color: '#f472b6' },
            { icon: '✅', label: 'نشطون اليوم', val: `${family.members.filter(m => m.water > 0 || m.steps > 0).length}`, color: '#34d399' },
          ].map(s => (
            <div key={s.label} style={{
              background: dark ? 'rgba(255,255,255,0.04)' : '#ffffff',
              border: `1px solid ${statsBord}`,
              borderRadius: 12, padding: '10px 12px',
            }}>
              <p style={{ color: statsTitle, fontSize: 11, margin: '0 0 4px' }}>{s.icon} {s.label}</p>
              <p style={{ color: s.color, fontSize: 16, fontWeight: 800, margin: 0 }}>{s.val}</p>
            </div>
          ))}
        </div>

        {/* ── بقية الأعضاء ── */}
        {others.length > 0 && (
          <div style={{
            background: sectionBg, border: `1px solid ${sectionBord}`,
            borderRadius: 16, padding: 14,
          }}>
            <p style={{ color: sectionTitle, fontSize: 12, fontWeight: 700, margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: 1 }}>
              أعضاء العائلة
            </p>
            {others.map(m => (
              <MemberCard
                key={m.id}
                member={m}
                isMe={false}
                onView={() => setDetailMember(m)}
                onRemind={() => setReminderTarget(m)}
                dark={dark}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      {detailMember && (
        <MemberDetail member={detailMember} onClose={() => setDetailMember(null)} dark={dark} />
      )}

      {reminderTarget && currentMember && (
        <ReminderModal
          target={reminderTarget}
          fromMember={currentMember}
          onClose={() => setReminderTarget(null)}
          dark={dark}
        />
      )}
    </div>
  );
}
