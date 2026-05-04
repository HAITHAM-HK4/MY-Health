import { storage } from '../lib/storage';
import { useState, useEffect } from 'react';
import { Theme } from '../App';
import AIInsightCard from '../components/AIInsightCard';

type Note = {
  id: number;
  text: string;
  date: string;
  mood: string;
};

const moods = ['😊', '😢', '😤', '😴', '🤒', '💪'];
const moodLabels: Record<string, string> = {
  '😊': 'سعيد', '😢': 'حزين', '😤': 'متوتر',
  '😴': 'متعب', '🤒': 'مريض', '💪': 'نشيط',
};

type Props = { theme?: Theme };

export default function Notes({ theme }: Props) {
  const dark = theme === 'dark';
  const [notes, setNotes] = useState<Note[]>([]);
  const [input, setInput] = useState('');
  const [mood, setMood] = useState('😊');

  useEffect(() => {
    const saved = storage.get('daily_notes');
    if (saved) setNotes(JSON.parse(saved));
  }, []);

  const save = () => {
    if (!input.trim()) return;
    const newNote: Note = {
      id: Date.now(),
      text: input,
      date: new Date().toLocaleDateString('ar-SY', {
        weekday: 'long', day: 'numeric', month: 'long',
      }),
      mood,
    };
    const updated = [newNote, ...notes];
    setNotes(updated);
    storage.set('daily_notes', JSON.stringify(updated));
    setInput('');
  };

  const del = (id: number) => {
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    storage.set('daily_notes', JSON.stringify(updated));
  };

  /* ── ألوان الوضعين ── */
  const pageBg    = dark ? '#08080f'              : '#fffbf0';
  const cardBg    = dark ? 'rgba(255,255,255,0.03)' : '#ffffff';
  const cardBorder= dark ? 'rgba(251,191,36,0.15)'  : 'rgba(251,191,36,0.25)';
  const inputBg   = dark ? 'rgba(255,255,255,0.04)' : '#fafafa';
  const inputBord = dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.09)';
  const textMain  = dark ? 'rgba(226,232,240,0.9)'  : '#1e293b';
  const textMuted = dark ? 'rgba(148,163,184,0.5)'  : '#94a3b8';
  const textSub   = dark ? 'rgba(255,255,255,0.3)'  : '#475569';
  const noteBg    = dark ? 'rgba(255,255,255,0.025)': '#ffffff';
  const noteBord  = dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)';
  const dateBg    = dark ? 'rgba(255,255,255,0.04)' : 'rgba(251,191,36,0.08)';
  const dateBord  = dark ? 'rgba(255,255,255,0.06)' : 'rgba(251,191,36,0.2)';
  const dateText  = dark ? 'rgba(148,163,184,0.5)'  : '#92400e';
  const delBg     = dark ? 'rgba(239,68,68,0.08)'   : 'rgba(239,68,68,0.06)';
  const delBord   = dark ? 'rgba(239,68,68,0.15)'   : 'rgba(239,68,68,0.15)';
  const orbColor  = dark
    ? 'radial-gradient(circle, rgba(251,191,36,0.2) 0%, transparent 70%)'
    : 'radial-gradient(circle, rgba(251,191,36,0.35) 0%, transparent 70%)';
  const headerBg  = dark
    ? 'linear-gradient(160deg, rgba(251,191,36,0.13) 0%, rgba(244,114,182,0.09) 60%, transparent 100%)'
    : 'linear-gradient(160deg, rgba(251,191,36,0.18) 0%, rgba(244,114,182,0.1) 60%, transparent 100%)';
  const headerBord= dark ? 'rgba(255,255,255,0.05)' : 'rgba(251,191,36,0.15)';
  const labelColor= dark ? 'rgba(251,191,36,0.1)'   : 'rgba(251,191,36,0.15)';
  const labelBord = dark ? 'rgba(251,191,36,0.22)'  : 'rgba(251,191,36,0.35)';
  const labelText = dark ? 'rgba(251,191,36,0.95)'  : '#b45309';
  const titleColor= dark ? 'white'                  : '#1e293b';
  const moodSelBg = dark ? 'rgba(251,191,36,0.15)'  : 'rgba(251,191,36,0.12)';
  const moodSelBrd= dark ? 'rgba(251,191,36,0.5)'   : 'rgba(251,191,36,0.4)';
  const moodDefBg = dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)';
  const moodDefBrd= dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)';
  const saveBtnSh = dark
    ? '0 4px 20px rgba(251,191,36,0.25)'
    : '0 4px 16px rgba(251,191,36,0.35)';
  const cornerBg  = dark ? 'rgba(251,191,36,0.06)'  : 'rgba(251,191,36,0.1)';
  const emptyIcon = dark ? 'rgba(251,191,36,0.08)'  : 'rgba(251,191,36,0.12)';
  const emptyBord = dark ? 'rgba(251,191,36,0.15)'  : 'rgba(251,191,36,0.25)';
  const sectionLbl= dark ? 'rgba(255,255,255,0.25)' : '#94a3b8';

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
          position: 'absolute', top: '-50px', right: '-50px',
          width: '180px', height: '180px', borderRadius: '50%',
          background: orbColor, pointerEvents: 'none',
          animation: 'orb-drift 10s ease-in-out infinite',
        }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: labelColor, border: `1px solid ${labelBord}`,
            borderRadius: '20px', padding: '4px 12px', marginBottom: '12px',
          }}>
            <span style={{ fontSize: '11px', color: labelText, fontWeight: 700 }}>📝 يومياتك</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 900, color: titleColor, lineHeight: 1.2, marginBottom: '6px' }}>
            ملاحظاتي
          </h1>
          <p style={{ fontSize: '13px', color: textMuted }}>
            {notes.length > 0 ? `${notes.length} ملاحظة مسجّلة` : 'سجّل يومياتك ومشاعرك'}
          </p>
        </div>
      </div>

      <div style={{ padding: '1.25rem' }}>

        {/* بطاقة الإضافة */}
        <div style={{
          background: cardBg, border: `1px solid ${cardBorder}`,
          borderRadius: '20px', padding: '1rem', marginBottom: '1rem',
          position: 'relative',
          boxShadow: dark ? 'none' : '0 2px 16px rgba(251,191,36,0.08)',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: '8%', right: '8%', height: '1px',
            background: `linear-gradient(90deg, transparent, rgba(251,191,36,${dark ? '0.5' : '0.4'}), transparent)`,
          }} />
          <textarea
            placeholder="اكتب ملاحظتك اليومية..."
            value={input}
            onChange={e => setInput(e.target.value)}
            rows={3}
            style={{
              width: '100%', background: inputBg, border: `1px solid ${inputBord}`,
              borderRadius: '14px', padding: '12px', color: textMain,
              fontSize: '14px', fontFamily: "'Cairo', sans-serif",
              resize: 'none', outline: 'none', marginBottom: '12px',
              lineHeight: 1.7, boxSizing: 'border-box',
            }}
          />

          <p style={{ fontSize: '11px', color: textSub, marginBottom: '8px', fontWeight: 700 }}>كيف مزاجك؟</p>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            {moods.map(m => (
              <button key={m} onClick={() => setMood(m)} title={moodLabels[m]}
                style={{
                  flex: 1,
                  background: mood === m ? moodSelBg : moodDefBg,
                  border: `1px solid ${mood === m ? moodSelBrd : moodDefBrd}`,
                  borderRadius: '12px', padding: '8px 4px', cursor: 'pointer',
                  fontSize: '20px', transition: 'all 0.2s',
                  transform: mood === m ? 'scale(1.15)' : 'scale(1)',
                }}
              >{m}</button>
            ))}
          </div>

          <button onClick={save} style={{
            width: '100%', padding: '12px', borderRadius: '14px', border: 'none',
            background: 'linear-gradient(135deg, rgba(251,191,36,0.9), rgba(244,114,182,0.8))',
            color: dark ? 'white' : '#7c2d12',
            fontWeight: 800, fontSize: '14px', fontFamily: "'Cairo', sans-serif",
            cursor: 'pointer', boxShadow: saveBtnSh, transition: 'all 0.3s',
          }}>
            💾 حفظ الملاحظة
          </button>
        </div>

        {/* القائمة */}
        {notes.length === 0 ? (
          <div style={{
            textAlign: 'center', marginTop: '60px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
          }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '24px',
              background: emptyIcon, border: `1px solid ${emptyBord}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px',
            }}>📝</div>
            <p style={{ color: textMuted, fontSize: '15px' }}>لا توجد ملاحظات بعد</p>
            <p style={{ color: textMuted, fontSize: '12px', opacity: 0.6 }}>ابدأ بكتابة أول ملاحظة ↑</p>
          </div>
        ) : (
          <>
            <p style={{
              fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px',
              color: sectionLbl, marginBottom: '10px',
            }}>السجل</p>
            {notes.map(note => (
              <div key={note.id} style={{
                background: noteBg, border: `1px solid ${noteBord}`,
                borderRadius: '18px', padding: '14px 16px', marginBottom: '10px',
                transition: 'all 0.3s', position: 'relative', overflow: 'hidden',
                boxShadow: dark ? 'none' : '0 1px 8px rgba(0,0,0,0.05)',
              }}>
                <div style={{
                  position: 'absolute', top: 0, right: 0,
                  width: '40px', height: '40px', background: cornerBg,
                  borderRadius: '0 18px 0 40px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '20px', paddingBottom: '4px', paddingLeft: '4px',
                }}>{note.mood}</div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{
                    fontSize: '10px', color: dateText,
                    background: dateBg, padding: '2px 8px',
                    borderRadius: '10px', border: `1px solid ${dateBord}`,
                  }}>{note.date}</span>
                  <button onClick={() => del(note.id)} style={{
                    background: delBg, border: `1px solid ${delBord}`,
                    borderRadius: '10px', cursor: 'pointer', fontSize: '14px',
                    width: '30px', height: '30px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>🗑️</button>
                </div>
                <p style={{ color: textMain, fontSize: '14px', lineHeight: 1.8, margin: 0 }}>
                  {note.text}
                </p>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
