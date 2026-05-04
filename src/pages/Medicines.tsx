import { storage } from '../lib/storage';
import { useState, useEffect } from 'react';
import MedicineCard from '../components/MedicineCard';
import AddMedicineForm from '../components/AddMedicineForm';
import MedicineTimer from '../components/MedicineTimer';
import { Theme } from '../App';
import AIInsightCard from '../components/AIInsightCard';

export type Medicine = {
  id: number;
  name: string;
  dose: string;
  time: string;
  days: number;
  taken: boolean;
};

type Props = { theme?: Theme };

export default function Medicines({ theme }: Props) {
  const dark = theme === 'dark';

  const [medicines, setMedicines] = useState<Medicine[]>(() => {
    const saved = storage.get('medicines');
    return saved ? JSON.parse(saved) : [];
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    storage.set('medicines', JSON.stringify(medicines));
  }, [medicines]);

  const addMedicine = (med: Omit<Medicine, 'id' | 'taken'>) => {
    setMedicines([...medicines, { ...med, id: Date.now(), taken: false }]);
    setShowForm(false);
  };

  const markTaken = (id: number) => {
    setMedicines(medicines.map(m => m.id === id ? { ...m, taken: true } : m));
  };

  const deleteMedicine = (id: number) => {
    setMedicines(medicines.filter(m => m.id !== id));
  };

  const taken = medicines.filter(m => m.taken).length;
  const total = medicines.length;
  const pct   = total > 0 ? Math.round((taken / total) * 100) : 0;

  /* ── ألوان الوضعين ── */
  const pageBg      = dark ? '#08080f'                : '#f5f3ff';
  const titleColor  = dark ? 'white'                  : '#1e293b';
  const textMuted   = dark ? 'rgba(255,255,255,0.45)' : '#6b7280';
  const labelBg     = dark ? 'rgba(129,140,248,0.1)'  : 'rgba(99,102,241,0.08)';
  const labelBord   = dark ? 'rgba(129,140,248,0.2)'  : 'rgba(99,102,241,0.2)';
  const labelText   = dark ? 'rgba(129,140,248,0.9)'  : '#4f46e5';
  const headerBg    = dark
    ? 'linear-gradient(160deg, rgba(129,140,248,0.15) 0%, rgba(139,92,246,0.1) 60%, transparent 100%)'
    : 'linear-gradient(160deg, rgba(129,140,248,0.12) 0%, rgba(139,92,246,0.07) 60%, transparent 100%)';
  const headerBord  = dark ? 'rgba(255,255,255,0.05)' : 'rgba(129,140,248,0.15)';
  const addBtnOpen  = dark ? 'rgba(129,140,248,0.15)' : 'rgba(99,102,241,0.08)';
  const addBtnBord  = dark ? 'rgba(129,140,248,0.3)'  : 'rgba(99,102,241,0.25)';
  const addBtnColor = dark ? 'white'                  : '#4338ca';
  const progressBg  = dark ? 'rgba(255,255,255,0.04)' : 'rgba(99,102,241,0.05)';
  const progressBord= dark ? 'rgba(129,140,248,0.12)' : 'rgba(99,102,241,0.15)';
  const pctColor    = dark ? '#818cf8'                : '#4f46e5';
  const progressTrk = dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)';
  const formBg      = dark ? 'rgba(255,255,255,0.03)' : '#ffffff';
  const formBord    = dark ? 'rgba(129,140,248,0.15)' : 'rgba(99,102,241,0.2)';
  const sectionLbl  = dark ? 'rgba(255,255,255,0.25)' : '#94a3b8';
  const emptyIcBg   = dark ? 'rgba(129,140,248,0.08)' : 'rgba(99,102,241,0.08)';
  const emptyIcBrd  = dark ? 'rgba(129,140,248,0.15)' : 'rgba(99,102,241,0.2)';

  return (
    <div className="min-h-screen pb-24 page-enter" dir="rtl"
      style={{ position: 'relative', zIndex: 1, background: pageBg, transition: 'background 0.4s' }}>
        <AIInsightCard page="home" theme={theme} />

      {/* HEADER */}
      <div style={{
        padding: '2rem 1.25rem 1.5rem',
        background: headerBg,
        borderBottom: `1px solid ${headerBord}`,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-60px', right: '-60px',
          width: '200px', height: '200px', borderRadius: '50%',
          background: dark
            ? 'radial-gradient(circle, rgba(129,140,248,0.25) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)',
          pointerEvents: 'none',
          animation: 'orb-drift 10s ease-in-out infinite',
        }} />

        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                background: labelBg, border: `1px solid ${labelBord}`,
                borderRadius: '20px', padding: '4px 12px', marginBottom: '10px',
              }}>
                <span style={{ fontSize: '11px', color: labelText, fontWeight: 700 }}>
                  💊 جرعاتك اليوم
                </span>
              </div>
              <h1 style={{ fontSize: '24px', fontWeight: 900, color: titleColor, lineHeight: 1.2 }}>
                الأدوية
              </h1>
              <p style={{ fontSize: '13px', color: textMuted, marginTop: '4px' }}>
                {total === 0 ? 'لا يوجد أدوية مضافة' : `${taken} من ${total} تم أخذها`}
              </p>
            </div>

            <button
              onClick={() => setShowForm(!showForm)}
              style={{
                background: showForm
                  ? addBtnOpen
                  : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: showForm ? addBtnColor : 'white',
                border: showForm ? `1px solid ${addBtnBord}` : 'none',
                borderRadius: '14px', padding: '10px 18px',
                fontWeight: 700, cursor: 'pointer', fontSize: '13px',
                fontFamily: "'Cairo', sans-serif",
                boxShadow: showForm ? 'none' : '0 4px 20px rgba(99,102,241,0.45)',
                transition: 'all 0.3s', flexShrink: 0,
              }}
            >
              {showForm ? '✕ إغلاق' : '+ إضافة'}
            </button>
          </div>

          {total > 0 && (
            <div style={{
              background: progressBg, border: `1px solid ${progressBord}`,
              borderRadius: '16px', padding: '12px 14px',
              boxShadow: dark ? 'none' : '0 1px 8px rgba(99,102,241,0.06)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: textMuted }}>تقدم اليوم</span>
                <span style={{ fontSize: '11px', fontWeight: 800, color: pctColor }}>{pct}%</span>
              </div>
              <div style={{ height: '6px', borderRadius: '10px', background: progressTrk, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: '10px', width: `${pct}%`,
                  background: 'linear-gradient(90deg, #6366f1, #818cf8, #22d3ee)',
                  boxShadow: dark ? '0 0 10px rgba(99,102,241,0.6)' : '0 0 8px rgba(99,102,241,0.4)',
                  transition: 'width 0.6s ease',
                }} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ padding: '1.25rem' }}>
        <MedicineTimer />

        {showForm && (
          <div style={{
            background: formBg, border: `1px solid ${formBord}`,
            borderRadius: '20px', padding: '1rem', marginBottom: '1rem',
            boxShadow: dark ? 'none' : '0 2px 16px rgba(99,102,241,0.08)',
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute', top: 0, left: '8%', right: '8%', height: '1px',
              background: `linear-gradient(90deg, transparent, rgba(99,102,241,${dark ? '0.5' : '0.35'}), transparent)`,
            }} />
            <AddMedicineForm onAdd={addMedicine} />
          </div>
        )}

        {total > 0 && (
          <p style={{
            fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px',
            color: sectionLbl, marginBottom: '10px',
          }}>
            قائمة الأدوية
          </p>
        )}

        {medicines.length === 0 ? (
          <div style={{
            textAlign: 'center', marginTop: '80px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
          }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '24px',
              background: emptyIcBg, border: `1px solid ${emptyIcBrd}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px',
            }}>💊</div>
            <p style={{ fontSize: '16px', fontWeight: 700, color: textMuted }}>لا يوجد أدوية بعد</p>
            <p style={{ fontSize: '13px', color: textMuted, opacity: 0.6 }}>اضغط + إضافة لتسجيل دوائك</p>
          </div>
        ) : (
          medicines.map(med => (
            <MedicineCard
              key={med.id}
              medicine={med}
              onTaken={markTaken}
              onDelete={deleteMedicine}
            />
          ))
        )}
      </div>
    </div>
  );
}
