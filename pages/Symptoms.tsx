import SymptomsList from '../components/SymptomsList';
import MoodTracker  from '../components/MoodTracker';
import { Theme }    from '../App';
import AIInsightCard from '../components/AIInsightCard';

type Props = { theme?: Theme };

export default function Symptoms({ theme }: Props) {
  const dark = theme === 'dark';

  const pageBg     = dark ? '#08080f'                : '#fff7ed';
  const titleColor = dark ? 'white'                  : '#1e293b';
  const textMuted  = dark ? 'rgba(255,255,255,0.4)'  : '#6b7280';
  const headerBg   = dark
    ? 'linear-gradient(160deg, rgba(251,146,60,0.13) 0%, rgba(244,114,182,0.09) 60%, transparent 100%)'
    : 'linear-gradient(160deg, rgba(251,146,60,0.12) 0%, rgba(244,114,182,0.07) 60%, transparent 100%)';
  const headerBord = dark ? 'rgba(255,255,255,0.05)' : 'rgba(251,146,60,0.15)';
  const labelBg    = dark ? 'rgba(251,146,60,0.1)'   : 'rgba(251,146,60,0.1)';
  const labelBord  = dark ? 'rgba(251,146,60,0.22)'  : 'rgba(251,146,60,0.3)';
  const labelText  = dark ? 'rgba(251,146,60,0.95)'  : '#92400e';

  /* بطاقة المزاج */
  const moodBg     = dark ? 'rgba(255,255,255,0.025)': '#ffffff';
  const moodBord   = dark ? 'rgba(244,114,182,0.18)' : 'rgba(244,114,182,0.2)';
  const moodTopLn  = dark ? 'rgba(244,114,182,0.55)' : 'rgba(244,114,182,0.4)';
  const moodHdBord = dark ? 'rgba(244,114,182,0.1)'  : 'rgba(244,114,182,0.12)';
  const moodIconBg = dark ? 'rgba(244,114,182,0.12)' : 'rgba(244,114,182,0.1)';
  const moodIconBd = dark ? 'rgba(244,114,182,0.25)' : 'rgba(244,114,182,0.2)';
  const moodTitle  = dark ? 'rgba(255,255,255,0.85)' : '#1e293b';
  const moodShadow = dark ? 'none' : '0 2px 12px rgba(244,114,182,0.07)';

  /* بطاقة الأعراض */
  const sympBg     = dark ? 'rgba(255,255,255,0.025)': '#ffffff';
  const sympBord   = dark ? 'rgba(251,146,60,0.18)'  : 'rgba(251,146,60,0.2)';
  const sympTopLn  = dark ? 'rgba(251,146,60,0.55)'  : 'rgba(251,146,60,0.4)';
  const sympHdBord = dark ? 'rgba(251,146,60,0.1)'   : 'rgba(251,146,60,0.12)';
  const sympIconBg = dark ? 'rgba(251,146,60,0.12)'  : 'rgba(251,146,60,0.1)';
  const sympIconBd = dark ? 'rgba(251,146,60,0.25)'  : 'rgba(251,146,60,0.2)';
  const sympTitle  = dark ? 'rgba(255,255,255,0.85)' : '#1e293b';
  const sympShadow = dark ? 'none' : '0 2px 12px rgba(251,146,60,0.07)';

  return (
    <div className="min-h-screen pb-24 page-enter" dir="rtl"
      style={{ position: 'relative', zIndex: 1, background: pageBg, transition: 'background 0.4s' }}>
        <AIInsightCard page="home" theme={theme} />

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
            ? 'radial-gradient(circle, rgba(251,146,60,0.2) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(251,146,60,0.28) 0%, transparent 70%)',
          pointerEvents: 'none', animation: 'orb-drift 10s ease-in-out infinite',
        }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: labelBg, border: `1px solid ${labelBord}`,
            borderRadius: '20px', padding: '4px 12px', marginBottom: '12px',
          }}>
            <span style={{ fontSize: '11px', color: labelText, fontWeight: 700 }}>🤒 الأعراض والحالة</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 900, color: titleColor, lineHeight: 1.2, marginBottom: '6px' }}>
            كيف تشعر اليوم؟
          </h1>
          <p style={{ fontSize: '13px', color: textMuted }}>سجّل مزاجك وأعراضك اليومية</p>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ padding: '1.25rem' }}>

        {/* بطاقة المزاج */}
        <div style={{
          background: moodBg, border: `1px solid ${moodBord}`,
          borderRadius: '20px', overflow: 'hidden', marginBottom: '12px',
          position: 'relative', boxShadow: moodShadow,
        }}>
          <div style={{
            position: 'absolute', top: 0, left: '8%', right: '8%', height: '1px',
            background: `linear-gradient(90deg, transparent, ${moodTopLn}, transparent)`,
          }} />
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '13px 16px 11px', borderBottom: `1px solid ${moodHdBord}`,
          }}>
            <span style={{
              width: '32px', height: '32px', borderRadius: '10px',
              background: moodIconBg, border: `1px solid ${moodIconBd}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px',
            }}>😊</span>
            <span style={{ fontWeight: 800, fontSize: '14px', color: moodTitle }}>حالتك المزاجية</span>
          </div>
          <div style={{ padding: '14px 16px' }}>
            <MoodTracker />
          </div>
        </div>

        {/* بطاقة الأعراض */}
        <div style={{
          background: sympBg, border: `1px solid ${sympBord}`,
          borderRadius: '20px', overflow: 'hidden',
          position: 'relative', boxShadow: sympShadow,
        }}>
          <div style={{
            position: 'absolute', top: 0, left: '8%', right: '8%', height: '1px',
            background: `linear-gradient(90deg, transparent, ${sympTopLn}, transparent)`,
          }} />
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '13px 16px 11px', borderBottom: `1px solid ${sympHdBord}`,
          }}>
            <span style={{
              width: '32px', height: '32px', borderRadius: '10px',
              background: sympIconBg, border: `1px solid ${sympIconBd}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px',
            }}>🔬</span>
            <span style={{ fontWeight: 800, fontSize: '14px', color: sympTitle }}>تسجيل الأعراض</span>
          </div>
          <div style={{ padding: '14px 16px' }}>
            <SymptomsList />
          </div>
        </div>

      </div>
    </div>
  );
}