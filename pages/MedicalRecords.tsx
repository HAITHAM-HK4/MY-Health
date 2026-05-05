import BloodPressureForm from '../components/BloodPressureForm';
import SugarForm from '../components/SugarForm';
import { Theme } from '../App';
import AIInsightCard from '../components/AIInsightCard';

type Props = { theme?: Theme };

export default function MedicalRecords({ theme }: Props) {
  const dark = theme === 'dark';

  const pageBg      = dark ? '#08080f'               : '#fff5f5';
  const titleColor  = dark ? 'white'                 : '#1e293b';
  const textMuted   = dark ? 'rgba(148,163,184,0.5)' : '#94a3b8';
  const labelBg     = dark ? 'rgba(239,68,68,0.1)'   : 'rgba(239,68,68,0.08)';
  const labelBord   = dark ? 'rgba(239,68,68,0.22)'  : 'rgba(239,68,68,0.25)';
  const labelText   = dark ? 'rgba(239,68,68,0.95)'  : '#991b1b';
  const headerBg    = dark
    ? 'linear-gradient(160deg, rgba(239,68,68,0.13) 0%, rgba(244,114,182,0.09) 60%, transparent 100%)'
    : 'linear-gradient(160deg, rgba(239,68,68,0.1) 0%, rgba(244,114,182,0.07) 60%, transparent 100%)';
  const headerBord  = dark ? 'rgba(255,255,255,0.05)': 'rgba(239,68,68,0.12)';

  const section = (accent: string, accentHex: string, labelDark: string, labelLight: string) => ({
    sectionBg:    dark ? 'rgba(255,255,255,0.025)' : '#ffffff',
    sectionBord:  dark ? `rgba(${accent},0.18)` : `rgba(${accent},0.2)`,
    topLine:      dark ? `rgba(${accent},0.55)` : `rgba(${accent},0.4)`,
    iconBg:       dark ? `rgba(${accent},0.12)` : `rgba(${accent},0.1)`,
    iconBord:     dark ? `rgba(${accent},0.25)` : `rgba(${accent},0.2)`,
    headBord:     dark ? `rgba(${accent},0.1)`  : `rgba(${accent},0.12)`,
    subLabel:     dark ? labelDark : labelLight,
    shadow:       dark ? 'none' : `0 2px 16px rgba(${accent},0.06)`,
  });

  const bp  = section('239,68,68',  '#ef4444', 'rgba(239,68,68,0.7)',  '#b91c1c');
  const sg  = section('251,146,60', '#f97316', 'rgba(251,146,60,0.7)', '#c2410c');
  const nameColor = dark ? 'rgba(255,255,255,0.85)' : '#1e293b';

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
            ? 'radial-gradient(circle, rgba(239,68,68,0.2) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(239,68,68,0.25) 0%, transparent 70%)',
          pointerEvents: 'none', animation: 'orb-drift 10s ease-in-out infinite',
        }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: labelBg, border: `1px solid ${labelBord}`,
            borderRadius: '20px', padding: '4px 12px', marginBottom: '12px',
          }}>
            <span style={{ fontSize: '11px', color: labelText, fontWeight: 700 }}>🩺 قياساتك الحيوية</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 900, color: titleColor, lineHeight: 1.2, marginBottom: '6px' }}>
            سجلاتي
          </h1>
          <p style={{ fontSize: '13px', color: textMuted }}>ضغط الدم ومستوى السكر</p>
        </div>
      </div>

      <div style={{ padding: '1.25rem' }}>

        {/* بطاقة ضغط الدم */}
        <div style={{
          background: bp.sectionBg, border: `1px solid ${bp.sectionBord}`,
          borderRadius: '20px', overflow: 'hidden', marginBottom: '12px',
          position: 'relative', boxShadow: bp.shadow,
        }}>
          <div style={{
            position: 'absolute', top: 0, left: '8%', right: '8%', height: '1px',
            background: `linear-gradient(90deg, transparent, ${bp.topLine}, transparent)`,
          }} />
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '13px 16px 11px', borderBottom: `1px solid ${bp.headBord}`,
          }}>
            <span style={{
              width: '32px', height: '32px', borderRadius: '10px',
              background: bp.iconBg, border: `1px solid ${bp.iconBord}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px',
            }}>❤️</span>
            <div>
              <span style={{ fontWeight: 800, fontSize: '14px', color: nameColor, display: 'block' }}>
                ضغط الدم
              </span>
              <span style={{ fontSize: '11px', color: bp.subLabel }}>سجّل قياساتك اليومية</span>
            </div>
          </div>
          <div style={{ padding: '14px 16px' }}><BloodPressureForm /></div>
        </div>

        {/* بطاقة السكر */}
        <div style={{
          background: sg.sectionBg, border: `1px solid ${sg.sectionBord}`,
          borderRadius: '20px', overflow: 'hidden',
          position: 'relative', boxShadow: sg.shadow,
        }}>
          <div style={{
            position: 'absolute', top: 0, left: '8%', right: '8%', height: '1px',
            background: `linear-gradient(90deg, transparent, ${sg.topLine}, transparent)`,
          }} />
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '13px 16px 11px', borderBottom: `1px solid ${sg.headBord}`,
          }}>
            <span style={{
              width: '32px', height: '32px', borderRadius: '10px',
              background: sg.iconBg, border: `1px solid ${sg.iconBord}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px',
            }}>🩸</span>
            <div>
              <span style={{ fontWeight: 800, fontSize: '14px', color: nameColor, display: 'block' }}>
                مستوى السكر
              </span>
              <span style={{ fontSize: '11px', color: sg.subLabel }}>تتبّع مستوى الغلوكوز</span>
            </div>
          </div>
          <div style={{ padding: '14px 16px' }}><SugarForm /></div>
        </div>

      </div>
    </div>
  );
}