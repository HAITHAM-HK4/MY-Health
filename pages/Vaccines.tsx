import { storage } from '../lib/storage';
import { useState, useEffect } from 'react';
import { Theme } from '../App';
import AIInsightCard from '../components/AIInsightCard';

type Vaccine = {
  id: number;
  name: string;
  date: string;
  nextDate: string;
  notes: string;
};

type Props = { theme?: Theme };

export default function Vaccines({ theme }: Props) {
  const dark = theme === 'dark';
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName]         = useState('');
  const [date, setDate]         = useState('');
  const [nextDate, setNextDate] = useState('');
  const [notes, setNotes]       = useState('');

  useEffect(() => {
    const saved = storage.get('vaccines');
    if (saved) setVaccines(JSON.parse(saved));
  }, []);

  const save = () => {
    if (!name || !date) return alert('أدخل الاسم والتاريخ');
    const updated = [...vaccines, { id: Date.now(), name, date, nextDate, notes }];
    setVaccines(updated);
    storage.set('vaccines', JSON.stringify(updated));
    setName(''); setDate(''); setNextDate(''); setNotes('');
    setShowForm(false);
  };

  const del = (id: number) => {
    const updated = vaccines.filter(v => v.id !== id);
    setVaccines(updated);
    storage.set('vaccines', JSON.stringify(updated));
  };

  const isPast = (d: string) => d && new Date(d).getTime() < Date.now();
  const isNear = (d: string) => {
    if (!d) return false;
    const diff = new Date(d).getTime() - Date.now();
    return diff > 0 && diff < 30 * 24 * 60 * 60 * 1000;
  };

  const getStatus = (v: Vaccine) => {
    if (!v.nextDate) return {
      bg: dark ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.05)',
      border: 'rgba(99,102,241,0.2)', badge: dark ? '#818cf8' : '#4f46e5',
      label: '✅ مكتمل', icon: '💉',
      accentBg: dark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.08)',
      labelColor: dark ? 'rgba(99,102,241,0.9)' : '#4338ca',
    };
    if (isPast(v.nextDate)) return {
      bg: dark ? 'rgba(239,68,68,0.08)' : 'rgba(239,68,68,0.05)',
      border: 'rgba(239,68,68,0.2)', badge: dark ? '#ef4444' : '#dc2626',
      label: '⚠️ متأخر', icon: '⏰',
      accentBg: dark ? 'rgba(239,68,68,0.15)' : 'rgba(239,68,68,0.08)',
      labelColor: dark ? '#ef4444' : '#b91c1c',
    };
    if (isNear(v.nextDate)) return {
      bg: dark ? 'rgba(251,191,36,0.08)' : 'rgba(251,191,36,0.06)',
      border: 'rgba(251,191,36,0.25)', badge: dark ? '#fbbf24' : '#d97706',
      label: '🔔 قريباً', icon: '🔔',
      accentBg: dark ? 'rgba(251,191,36,0.15)' : 'rgba(251,191,36,0.1)',
      labelColor: dark ? '#fbbf24' : '#92400e',
    };
    return {
      bg: dark ? 'rgba(16,185,129,0.08)' : 'rgba(16,185,129,0.05)',
      border: 'rgba(16,185,129,0.2)', badge: dark ? '#10b981' : '#059669',
      label: '✅ بخير', icon: '✅',
      accentBg: dark ? 'rgba(16,185,129,0.15)' : 'rgba(16,185,129,0.08)',
      labelColor: dark ? '#10b981' : '#065f46',
    };
  };

  const pageBg      = dark ? '#08080f'               : '#f0fdf8';
  const titleColor  = dark ? 'white'                 : '#1e293b';
  const textMuted   = dark ? 'rgba(148,163,184,0.5)' : '#94a3b8';
  const textSub     = dark ? 'rgba(255,255,255,0.3)' : '#475569';
  const inputBg     = dark ? 'rgba(255,255,255,0.04)': '#fafafa';
  const inputBord   = dark ? 'rgba(255,255,255,0.08)': 'rgba(0,0,0,0.09)';
  const inputColor  = dark ? 'rgba(226,232,240,0.9)' : '#1e293b';
  const formBg      = dark ? 'rgba(255,255,255,0.03)': '#ffffff';
  const formBord    = dark ? 'rgba(16,185,129,0.15)' : 'rgba(16,185,129,0.2)';
  const labelBg     = dark ? 'rgba(16,185,129,0.1)'  : 'rgba(16,185,129,0.1)';
  const labelBord   = dark ? 'rgba(16,185,129,0.22)' : 'rgba(16,185,129,0.3)';
  const labelText   = dark ? 'rgba(16,185,129,0.95)' : '#065f46';
  const sectionLbl  = dark ? 'rgba(255,255,255,0.25)': '#94a3b8';
  const metaBg      = dark ? 'rgba(255,255,255,0.04)': 'rgba(0,0,0,0.04)';
  const metaBord    = dark ? 'rgba(255,255,255,0.06)': 'rgba(0,0,0,0.07)';
  const metaText    = dark ? 'rgba(148,163,184,0.7)' : '#475569';
  const noteText    = dark ? 'rgba(148,163,184,0.6)' : '#64748b';
  const delBg       = dark ? 'rgba(239,68,68,0.08)'  : 'rgba(239,68,68,0.06)';
  const delBord     = dark ? 'rgba(239,68,68,0.15)'  : 'rgba(239,68,68,0.15)';
  const emptyIcBg   = dark ? 'rgba(16,185,129,0.08)' : 'rgba(16,185,129,0.1)';
  const emptyIcBrd  = dark ? 'rgba(16,185,129,0.15)' : 'rgba(16,185,129,0.25)';
  const headerBg    = dark
    ? 'linear-gradient(160deg, rgba(16,185,129,0.13) 0%, rgba(34,211,238,0.09) 60%, transparent 100%)'
    : 'linear-gradient(160deg, rgba(16,185,129,0.15) 0%, rgba(34,211,238,0.08) 60%, transparent 100%)';
  const headerBord  = dark ? 'rgba(255,255,255,0.05)': 'rgba(16,185,129,0.15)';
  const nameColor   = dark ? '#e2e8f0'               : '#1e293b';

  const inputStyle: React.CSSProperties = {
    width: '100%', background: inputBg, border: `1px solid ${inputBord}`,
    borderRadius: '14px', padding: '12px', color: inputColor,
    fontSize: '14px', fontFamily: "'Cairo', sans-serif",
    outline: 'none', marginBottom: '10px', boxSizing: 'border-box',
  };

  const late = vaccines.filter(v => isPast(v.nextDate)).length;
  const near = vaccines.filter(v => isNear(v.nextDate)).length;
  const safe = vaccines.filter(v => v.nextDate && !isPast(v.nextDate) && !isNear(v.nextDate)).length;

  return (
    <div className="min-h-screen pb-24 page-enter" dir="rtl"
      style={{ position: 'relative', zIndex: 1, background: pageBg, transition: 'background 0.4s' }}>

      {/* HEADER */}
      <div style={{
        padding: '2rem 1.25rem 1.5rem',
        background: headerBg, borderBottom: `1px solid ${headerBord}`,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-50px', right: '-50px',
          width: '180px', height: '180px', borderRadius: '50%',
          background: dark
            ? 'radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(16,185,129,0.3) 0%, transparent 70%)',
          pointerEvents: 'none', animation: 'orb-drift 10s ease-in-out infinite',
        }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                background: labelBg, border: `1px solid ${labelBord}`,
                borderRadius: '20px', padding: '4px 12px', marginBottom: '12px',
              }}>
                <span style={{ fontSize: '11px', color: labelText, fontWeight: 700 }}>💉 التطعيمات</span>
              </div>
              <h1 style={{ fontSize: '24px', fontWeight: 900, color: titleColor, lineHeight: 1.2, marginBottom: '6px' }}>
                اللقاحات
              </h1>
              <p style={{ fontSize: '13px', color: textMuted }}>
                {vaccines.length > 0 ? `${vaccines.length} تطعيم مسجّل` : 'تتبّع مواعيد جرعاتك'}
              </p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              style={{
                background: showForm
                  ? (dark ? 'rgba(16,185,129,0.1)' : 'rgba(16,185,129,0.08)')
                  : 'linear-gradient(135deg, #059669, #10b981)',
                border: showForm ? '1px solid rgba(16,185,129,0.3)' : 'none',
                borderRadius: '14px', padding: '10px 16px',
                color: showForm ? (dark ? 'rgba(16,185,129,0.9)' : '#065f46') : 'white',
                fontWeight: 700, fontSize: '13px',
                fontFamily: "'Cairo', sans-serif", cursor: 'pointer',
                boxShadow: showForm ? 'none' : '0 4px 16px rgba(16,185,129,0.35)',
                transition: 'all 0.3s',
              }}
            >{showForm ? '✕ إغلاق' : '+ إضافة'}</button>
          </div>

          {vaccines.length > 0 && (
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              {late > 0 && (
                <div style={{
                  flex: 1, background: dark ? 'rgba(239,68,68,0.12)' : 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.25)', borderRadius: '12px',
                  padding: '8px', textAlign: 'center',
                }}>
                  <p style={{ fontSize: '16px', fontWeight: 900, color: dark ? '#ef4444' : '#dc2626', margin: 0 }}>{late}</p>
                  <p style={{ fontSize: '10px', color: dark ? 'rgba(239,68,68,0.7)' : '#b91c1c', margin: 0 }}>متأخر</p>
                </div>
              )}
              {near > 0 && (
                <div style={{
                  flex: 1, background: dark ? 'rgba(251,191,36,0.12)' : 'rgba(251,191,36,0.08)',
                  border: '1px solid rgba(251,191,36,0.25)', borderRadius: '12px',
                  padding: '8px', textAlign: 'center',
                }}>
                  <p style={{ fontSize: '16px', fontWeight: 900, color: dark ? '#fbbf24' : '#d97706', margin: 0 }}>{near}</p>
                  <p style={{ fontSize: '10px', color: dark ? 'rgba(251,191,36,0.7)' : '#92400e', margin: 0 }}>قريباً</p>
                </div>
              )}
              {safe > 0 && (
                <div style={{
                  flex: 1, background: dark ? 'rgba(16,185,129,0.12)' : 'rgba(16,185,129,0.08)',
                  border: '1px solid rgba(16,185,129,0.25)', borderRadius: '12px',
                  padding: '8px', textAlign: 'center',
                }}>
                  <p style={{ fontSize: '16px', fontWeight: 900, color: dark ? '#10b981' : '#059669', margin: 0 }}>{safe}</p>
                  <p style={{ fontSize: '10px', color: dark ? 'rgba(16,185,129,0.7)' : '#065f46', margin: 0 }}>بخير</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: '1.25rem' }}>

        <AIInsightCard page="vaccines" theme={theme} />

        {showForm && (
          <div style={{
            background: formBg, border: `1px solid ${formBord}`,
            borderRadius: '20px', padding: '1rem', marginBottom: '1rem',
            position: 'relative',
            boxShadow: dark ? 'none' : '0 2px 16px rgba(16,185,129,0.08)',
          }}>
            <div style={{
              position: 'absolute', top: 0, left: '8%', right: '8%', height: '1px',
              background: `linear-gradient(90deg, transparent, rgba(16,185,129,${dark ? '0.5' : '0.4'}), transparent)`,
            }} />
            <input type="text" placeholder="اسم اللقاح" value={name}
              onChange={e => setName(e.target.value)} style={inputStyle} />
            <label style={{ fontSize: '11px', color: textMuted, display: 'block', marginBottom: '4px', marginTop: '-4px' }}>
              تاريخ آخر جرعة:
            </label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} style={inputStyle} />
            <label style={{ fontSize: '11px', color: textMuted, display: 'block', marginBottom: '4px', marginTop: '-4px' }}>
              تاريخ الجرعة القادمة:
            </label>
            <input type="date" value={nextDate} onChange={e => setNextDate(e.target.value)} style={inputStyle} />
            <input type="text" placeholder="ملاحظات (اختياري)" value={notes}
              onChange={e => setNotes(e.target.value)} style={{ ...inputStyle, marginBottom: '12px' }} />
            <button onClick={save} style={{
              width: '100%', padding: '12px', borderRadius: '14px', border: 'none',
              background: 'linear-gradient(135deg, #059669, #10b981)',
              color: 'white', fontWeight: 800, fontSize: '14px',
              fontFamily: "'Cairo', sans-serif", cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(16,185,129,0.35)',
            }}>💾 حفظ اللقاح</button>
          </div>
        )}

        {vaccines.length === 0 ? (
          <div style={{
            textAlign: 'center', marginTop: '60px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
          }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '24px',
              background: emptyIcBg, border: `1px solid ${emptyIcBrd}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px',
            }}>💉</div>
            <p style={{ color: textMuted, fontSize: '15px' }}>لا توجد تطعيمات مسجلة</p>
            <p style={{ color: textMuted, fontSize: '12px', opacity: 0.6 }}>اضغط "+ إضافة" لتسجيل أول لقاح</p>
          </div>
        ) : (
          <>
            <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', color: sectionLbl, marginBottom: '10px' }}>
              قائمة اللقاحات
            </p>
            {vaccines.map(v => {
              const s = getStatus(v);
              return (
                <div key={v.id} style={{
                  background: s.bg, border: `1px solid ${s.border}`,
                  borderRadius: '18px', padding: '14px 16px', marginBottom: '10px',
                  transition: 'all 0.3s', position: 'relative', overflow: 'hidden',
                  boxShadow: dark ? 'none' : '0 1px 8px rgba(0,0,0,0.05)',
                }}>
                  <div style={{
                    position: 'absolute', top: 0, right: 0,
                    width: '48px', height: '48px', background: s.accentBg,
                    borderRadius: '0 18px 0 48px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '20px', paddingBottom: '6px', paddingLeft: '6px',
                  }}>{s.icon}</div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1, paddingLeft: '10px' }}>
                      <h3 style={{ fontWeight: 700, color: nameColor, fontSize: '15px', marginBottom: '6px' }}>
                        💉 {v.name}
                      </h3>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        <span style={{ fontSize: '11px', color: metaText, background: metaBg, padding: '2px 8px', borderRadius: '8px', border: `1px solid ${metaBord}` }}>
                          📅 آخر جرعة: {v.date}
                        </span>
                      </div>
                      {v.nextDate && (
                        <div style={{ marginTop: '6px' }}>
                          <span style={{
                            fontSize: '11px', fontWeight: 700, color: s.labelColor,
                            background: s.accentBg, padding: '3px 10px',
                            borderRadius: '10px', border: `1px solid ${s.border}`,
                          }}>
                            {s.label} — {v.nextDate}
                          </span>
                        </div>
                      )}
                      {v.notes && <p style={{ fontSize: '12px', color: noteText, marginTop: '8px', lineHeight: 1.6 }}>{v.notes}</p>}
                    </div>
                    <button onClick={() => del(v.id)} style={{
                      background: delBg, border: `1px solid ${delBord}`,
                      borderRadius: '10px', cursor: 'pointer', fontSize: '14px',
                      width: '32px', height: '32px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>🗑️</button>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
