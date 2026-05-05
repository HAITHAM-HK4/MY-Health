import { storage } from '../lib/storage';

import { useState, useEffect } from 'react';
import { Theme } from '../App';
import AIInsightCard from '../components/AIInsightCard';

type HistoryRecord = {
  id: number;
  type: 'مرض' | 'عملية' | 'حساسية' | 'إصابة';
  name: string;
  date: string;
  doctor: string;
  notes: string;
};

const types = ['مرض', 'عملية', 'حساسية', 'إصابة'] as const;

const typeConfig = {
  'مرض':    { icon: '🤒', dark: { bg: 'rgba(239,68,68,0.08)',  border: 'rgba(239,68,68,0.2)',  badge: '#ef4444', accent: 'rgba(239,68,68,0.15)'  }, light: { bg: 'rgba(239,68,68,0.05)',  border: 'rgba(239,68,68,0.2)',  badge: '#dc2626', accent: 'rgba(239,68,68,0.1)'   } },
  'عملية':  { icon: '🏥', dark: { bg: 'rgba(251,146,60,0.08)', border: 'rgba(251,146,60,0.2)', badge: '#f97316', accent: 'rgba(251,146,60,0.15)' }, light: { bg: 'rgba(251,146,60,0.05)', border: 'rgba(251,146,60,0.2)', badge: '#ea580c', accent: 'rgba(251,146,60,0.1)'  } },
  'حساسية': { icon: '🤧', dark: { bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.2)', badge: '#fbbf24', accent: 'rgba(251,191,36,0.15)' }, light: { bg: 'rgba(251,191,36,0.06)', border: 'rgba(251,191,36,0.25)',badge: '#d97706', accent: 'rgba(251,191,36,0.12)' } },
  'إصابة':  { icon: '🩹', dark: { bg: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.2)', badge: '#818cf8', accent: 'rgba(99,102,241,0.15)' }, light: { bg: 'rgba(99,102,241,0.05)', border: 'rgba(99,102,241,0.2)', badge: '#4f46e5', accent: 'rgba(99,102,241,0.1)'  } },
};

type Props = { theme?: Theme };

export default function MedicalHistory({ theme }: Props) {
  const dark = theme === 'dark';
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [type, setType]     = useState<HistoryRecord['type']>('مرض');
  const [name, setName]     = useState('');
  const [date, setDate]     = useState('');
  const [doctor, setDoctor] = useState('');
  const [notes, setNotes]   = useState('');

  useEffect(() => {
    const saved = storage.get('medical_history');
    if (saved) setRecords(JSON.parse(saved));
  }, []);

  const save = () => {
    if (!name || !date) return alert('أدخل الاسم والتاريخ');
    const updated = [{ id: Date.now(), type, name, date, doctor, notes }, ...records];
    setRecords(updated);
    storage.set('medical_history', JSON.stringify(updated));
    setName(''); setDate(''); setDoctor(''); setNotes('');
    setShowForm(false);
  };

  const del = (id: number) => {
    const updated = records.filter(r => r.id !== id);
    setRecords(updated);
    storage.set('medical_history', JSON.stringify(updated));
  };

  /* ── ألوان الوضعين ── */
  const pageBg     = dark ? '#08080f'               : '#f0fdf8';
  const titleColor = dark ? 'white'                 : '#1e293b';
  const textMuted  = dark ? 'rgba(148,163,184,0.5)' : '#94a3b8';
  const textSub    = dark ? 'rgba(255,255,255,0.3)' : '#475569';
  const inputBg    = dark ? 'rgba(255,255,255,0.04)': '#fafafa';
  const inputBord  = dark ? 'rgba(255,255,255,0.08)': 'rgba(0,0,0,0.09)';
  const inputColor = dark ? 'rgba(226,232,240,0.9)' : '#1e293b';
  const formBg     = dark ? 'rgba(255,255,255,0.03)': '#ffffff';
  const formBord   = dark ? 'rgba(16,185,129,0.15)' : 'rgba(16,185,129,0.2)';
  const labelBg    = dark ? 'rgba(16,185,129,0.1)'  : 'rgba(16,185,129,0.1)';
  const labelBord  = dark ? 'rgba(16,185,129,0.22)' : 'rgba(16,185,129,0.3)';
  const labelText  = dark ? 'rgba(16,185,129,0.95)' : '#065f46';
  const sectionLbl = dark ? 'rgba(255,255,255,0.25)': '#94a3b8';
  const delBg      = dark ? 'rgba(239,68,68,0.08)'  : 'rgba(239,68,68,0.06)';
  const delBord    = dark ? 'rgba(239,68,68,0.15)'  : 'rgba(239,68,68,0.15)';
  const metaBg     = dark ? 'rgba(255,255,255,0.04)': 'rgba(0,0,0,0.04)';
  const metaBord   = dark ? 'rgba(255,255,255,0.06)': 'rgba(0,0,0,0.07)';
  const metaText   = dark ? 'rgba(148,163,184,0.7)' : '#475569';
  const noteText   = dark ? 'rgba(148,163,184,0.6)' : '#64748b';
  const emptyIcBg  = dark ? 'rgba(16,185,129,0.08)' : 'rgba(16,185,129,0.1)';
  const emptyIcBrd = dark ? 'rgba(16,185,129,0.15)' : 'rgba(16,185,129,0.25)';
  const headerBg   = dark
    ? 'linear-gradient(160deg, rgba(16,185,129,0.13) 0%, rgba(99,102,241,0.09) 60%, transparent 100%)'
    : 'linear-gradient(160deg, rgba(16,185,129,0.15) 0%, rgba(99,102,241,0.08) 60%, transparent 100%)';
  const headerBord = dark ? 'rgba(255,255,255,0.05)': 'rgba(16,185,129,0.15)';

  const inputStyle: React.CSSProperties = {
    width: '100%', background: inputBg, border: `1px solid ${inputBord}`,
    borderRadius: '14px', padding: '12px', color: inputColor,
    fontSize: '14px', fontFamily: "'Cairo', sans-serif",
    outline: 'none', marginBottom: '10px', boxSizing: 'border-box',
  };

  const tc = (t: HistoryRecord['type']) => dark ? typeConfig[t].dark : typeConfig[t].light;
  const counts = types.reduce((acc, t) => { acc[t] = records.filter(r => r.type === t).length; return acc; }, {} as Record<string, number>);

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
                <span style={{ fontSize: '11px', color: labelText, fontWeight: 700 }}>🧬 السجل الطبي</span>
              </div>
              <h1 style={{ fontSize: '24px', fontWeight: 900, color: titleColor, lineHeight: 1.2, marginBottom: '6px' }}>
                تاريخي الطبي
              </h1>
              <p style={{ fontSize: '13px', color: textMuted }}>
                {records.length > 0 ? `${records.length} سجل مضاف` : 'سجّل تاريخك الصحي'}
              </p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              style={{
                background: showForm
                  ? (dark ? 'rgba(16,185,129,0.1)' : 'rgba(16,185,129,0.08)')
                  : 'linear-gradient(135deg, #059669, #10b981)',
                color: showForm ? (dark ? 'rgba(255,255,255,0.7)' : '#065f46') : 'white',
                border: showForm ? `1px solid rgba(16,185,129,0.3)` : 'none',
                borderRadius: '14px', padding: '10px 18px',
                fontWeight: 700, cursor: 'pointer', fontSize: '13px',
                fontFamily: "'Cairo', sans-serif",
                boxShadow: showForm ? 'none' : '0 4px 20px rgba(16,185,129,0.4)',
                transition: 'all 0.3s', flexShrink: 0, marginTop: '4px',
              }}
            >{showForm ? '✕ إغلاق' : '+ إضافة'}</button>
          </div>

          {records.length > 0 && (
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
              {types.filter(t => counts[t] > 0).map(t => (
                <div key={t} style={{
                  background: tc(t).accent, border: `1px solid ${tc(t).border}`,
                  borderRadius: '12px', padding: '4px 10px',
                  display: 'flex', alignItems: 'center', gap: '5px',
                }}>
                  <span style={{ fontSize: '12px' }}>{typeConfig[t].icon}</span>
                  <span style={{ fontSize: '11px', color: tc(t).badge, fontWeight: 700 }}>
                    {counts[t]} {t}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: '1.25rem' }}>

        {/* بطاقة تحليل الذكاء الاصطناعي */}
        <AIInsightCard page="medical_history" theme={theme} />

        {/* فورم الإضافة */}
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
            <p style={{ fontSize: '11px', color: textSub, marginBottom: '8px', fontWeight: 700 }}>نوع السجل</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px' }}>
              {types.map(t => (
                <button key={t} onClick={() => setType(t)} style={{
                  padding: '10px', borderRadius: '12px',
                  border: type === t ? `1px solid ${tc(t).badge}` : `1px solid ${inputBord}`,
                  background: type === t ? tc(t).bg : inputBg,
                  color: type === t ? tc(t).badge : textMuted,
                  fontWeight: type === t ? 700 : 400, fontSize: '13px',
                  cursor: 'pointer', fontFamily: "'Cairo', sans-serif",
                  transition: 'all 0.25s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                }}>
                  {typeConfig[t].icon} {t}
                </button>
              ))}
            </div>
            <input type="text" placeholder="الاسم" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
            <label style={{ fontSize: '11px', color: textMuted, display: 'block', marginBottom: '4px', marginTop: '-4px' }}>التاريخ:</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} style={inputStyle} />
            <input type="text" placeholder="اسم الطبيب (اختياري)" value={doctor} onChange={e => setDoctor(e.target.value)} style={inputStyle} />
            <textarea placeholder="ملاحظات..." value={notes} onChange={e => setNotes(e.target.value)} rows={3}
              style={{ ...inputStyle, resize: 'none', lineHeight: 1.7, marginBottom: '12px' }} />
            <button onClick={save} style={{
              width: '100%', padding: '12px', borderRadius: '14px', border: 'none',
              background: 'linear-gradient(135deg, #059669, #10b981)',
              color: 'white', fontWeight: 800, fontSize: '14px',
              fontFamily: "'Cairo', sans-serif", cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(16,185,129,0.35)',
            }}>💾 حفظ السجل</button>
          </div>
        )}

        {/* القائمة */}
        {records.length === 0 ? (
          <div style={{
            textAlign: 'center', marginTop: '60px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
          }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '24px',
              background: emptyIcBg, border: `1px solid ${emptyIcBrd}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px',
            }}>🧬</div>
            <p style={{ color: textMuted, fontSize: '15px' }}>لا يوجد سجلات طبية</p>
            <p style={{ color: textMuted, fontSize: '12px', opacity: 0.6 }}>اضغط "+ إضافة" لتسجيل أول سجل</p>
          </div>
        ) : (
          <>
            <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', color: sectionLbl, marginBottom: '10px' }}>
              السجلات
            </p>
            {records.map(r => (
              <div key={r.id} style={{
                background: tc(r.type).bg,
                border: `1px solid ${tc(r.type).border}`,
                borderRadius: '18px', padding: '14px 16px', marginBottom: '10px',
                transition: 'all 0.3s', position: 'relative', overflow: 'hidden',
                boxShadow: dark ? 'none' : '0 1px 8px rgba(0,0,0,0.05)',
              }}>
                <div style={{
                  position: 'absolute', top: 0, right: 0, width: '48px', height: '48px',
                  background: tc(r.type).accent,
                  borderRadius: '0 18px 0 48px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '22px', paddingBottom: '6px', paddingLeft: '6px',
                }}>{typeConfig[r.type].icon}</div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1, paddingLeft: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span style={{
                        fontSize: '10px', background: tc(r.type).accent,
                        color: tc(r.type).badge, padding: '2px 10px',
                        borderRadius: '20px', border: `1px solid ${tc(r.type).border}`, fontWeight: 700,
                      }}>{r.type}</span>
                    </div>
                    <h3 style={{ fontWeight: 700, color: dark ? '#e2e8f0' : '#1e293b', fontSize: '15px', marginBottom: '6px' }}>
                      {r.name}
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      <span style={{ fontSize: '11px', color: metaText, background: metaBg, padding: '2px 8px', borderRadius: '8px', border: `1px solid ${metaBord}` }}>
                        📅 {r.date}
                      </span>
                      {r.doctor && (
                        <span style={{ fontSize: '11px', color: metaText, background: metaBg, padding: '2px 8px', borderRadius: '8px', border: `1px solid ${metaBord}` }}>
                          👨‍⚕️ {r.doctor}
                        </span>
                      )}
                    </div>
                    {r.notes && <p style={{ fontSize: '12px', color: noteText, marginTop: '8px', lineHeight: 1.6 }}>{r.notes}</p>}
                  </div>
                  <button onClick={() => del(r.id)} style={{
                    background: delBg, border: `1px solid ${delBord}`,
                    borderRadius: '10px', cursor: 'pointer', fontSize: '14px',
                    width: '32px', height: '32px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>🗑️</button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
