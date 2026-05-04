import WaterTracker      from '../components/WaterTracker';
import StepsTracker      from '../components/StepsTracker';
import SleepTracker      from '../components/SleepTracker';
import MoodTracker       from '../components/MoodTracker';
import HealthCharts      from '../components/HealthCharts';
import BloodPressureForm from '../components/BloodPressureForm';
import SugarForm         from '../components/SugarForm';
import BMICalculator     from '../components/BMICalculator';
import { Theme }         from '../App';
import AIInsightCard from '../components/AIInsightCard';

/* ─────────────────────────────────────────────────────
   Section wrapper
───────────────────────────────────────────────────── */
type SectionProps = {
  icon: string;
  title: string;
  accent: string;
  dark?: boolean;
  children: React.ReactNode;
};

function Section({ icon, title, accent, dark, children }: SectionProps) {
  return (
    <div style={{
      background: dark ? 'rgba(255,255,255,0.025)' : '#ffffff',
      border: `1px solid ${accent}20`,
      borderRadius: '20px',
      marginBottom: '12px',
      overflow: 'hidden',
      position: 'relative',
      boxShadow: dark ? 'none' : `0 1px 10px rgba(0,0,0,0.05)`,
    }}>
      
      {/* shimmer top line */}
      <div style={{
        position: 'absolute', top: 0, left: '8%', right: '8%', height: '1px',
        background: `linear-gradient(90deg, transparent, ${accent}${dark ? '60' : '50'}, transparent)`,
      }} />

      {/* header row */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '13px 16px 11px',
        borderBottom: `1px solid ${accent}12`,
      }}>
        <span style={{
          width: '32px', height: '32px', borderRadius: '10px', flexShrink: 0,
          background: `${accent}15`,
          border: `1px solid ${accent}28`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '16px',
        }}>
          {icon}
        </span>
        <span style={{
          fontWeight: 800, fontSize: '14px',
          color: dark ? 'rgba(255,255,255,0.85)' : '#1e293b',
        }}>
          {title}
        </span>
      </div>

      {/* content */}
      <div style={{ padding: '14px 16px' }}>
        {children}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   Section group label
───────────────────────────────────────────────────── */
function Label({ children, dark }: { children: string; dark?: boolean }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '10px',
      margin: '20px 0 10px',
    }}>
      <div style={{ flex: 1, height: '1px', background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.08)' }} />
      <span style={{
        fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px',
        color: dark ? 'rgba(255,255,255,0.22)' : '#94a3b8',
        textTransform: 'uppercase',
      }}>
        {children}
      </span>
      <div style={{ flex: 1, height: '1px', background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.08)' }} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   Main page
───────────────────────────────────────────────────── */
type HealthProps = { theme?: Theme };

export default function Health({ theme }: HealthProps) {
  const dark = theme === 'dark';

  const pageBg     = dark ? '#08080f'                : '#fdf2f8';
  const titleColor = dark ? 'white'                  : '#1e293b';
  const textMuted  = dark ? 'rgba(255,255,255,0.4)'  : '#6b7280';
  const labelBg    = dark ? 'rgba(244,114,182,0.1)'  : 'rgba(244,114,182,0.08)';
  const labelBord  = dark ? 'rgba(244,114,182,0.22)' : 'rgba(244,114,182,0.3)';
  const labelText  = dark ? 'rgba(244,114,182,0.9)'  : '#9d174d';
  const headerBg   = dark
    ? 'linear-gradient(160deg, rgba(244,114,182,0.13) 0%, rgba(99,102,241,0.09) 60%, transparent 100%)'
    : 'linear-gradient(160deg, rgba(244,114,182,0.12) 0%, rgba(99,102,241,0.07) 60%, transparent 100%)';
  const headerBord = dark ? 'rgba(255,255,255,0.05)' : 'rgba(244,114,182,0.15)';

  return (
    <div className="min-h-screen pb-24 page-enter" dir="rtl"
      style={{ position: 'relative', zIndex: 1, background: pageBg, transition: 'background 0.4s' }}>
        <AIInsightCard page="home" theme={theme} />

      {/* HEADER */}
      <div style={{
        padding: '2rem 1.25rem 1.5rem',
        background: headerBg,
        borderBottom: `1px solid ${headerBord}`,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-50px', right: '-50px',
          width: '180px', height: '180px', borderRadius: '50%',
          background: dark
            ? 'radial-gradient(circle, rgba(244,114,182,0.2) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(244,114,182,0.28) 0%, transparent 70%)',
          pointerEvents: 'none',
          animation: 'orb-drift 10s ease-in-out infinite',
        }} />

        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: labelBg,
            border: `1px solid ${labelBord}`,
            borderRadius: '20px', padding: '4px 12px',
            marginBottom: '12px',
          }}>
            <span style={{ fontSize: '11px', color: labelText, fontWeight: 700 }}>
              ❤️ صحتي اليوم
            </span>
          </div>

          <h1 style={{ fontSize: '24px', fontWeight: 900, color: titleColor, lineHeight: 1.2, marginBottom: '6px' }}>
            تتبّع صحتك
          </h1>
          <p style={{ fontSize: '13px', color: textMuted }}>
            سجّل نشاطك اليومي وراقب تقدمك
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ padding: '0 1.25rem 1.25rem' }}>

        <Label dark={dark}>النشاط اليومي</Label>

        <Section icon="💧" title="متابعة الماء"     accent="#22d3ee" dark={dark}>
          <WaterTracker />
        </Section>

        <Section icon="🚶" title="عداد الخطوات"     accent="#34d399" dark={dark}>
          <StepsTracker />
        </Section>

        <Section icon="😴" title="جودة النوم"       accent="#a78bfa" dark={dark}>
          <SleepTracker />
        </Section>

        <Section icon="😊" title="حالتك المزاجية"   accent="#f472b6" dark={dark}>
          <MoodTracker />
        </Section>

        <Label dark={dark}>القراءات الطبية</Label>

        <Section icon="❤️" title="ضغط الدم"         accent="#f87171" dark={dark}>
          <BloodPressureForm />
        </Section>

        <Section icon="🩸" title="سكر الدم"         accent="#fb923c" dark={dark}>
          <SugarForm />
        </Section>

        <Section icon="⚖️" title="مؤشر كتلة الجسم" accent="#fbbf24" dark={dark}>
          <BMICalculator />
        </Section>

        <Label dark={dark}>الإحصائيات</Label>

        <Section icon="📈" title="آخر ٧ أيام"       accent="#818cf8" dark={dark}>
          <HealthCharts />
        </Section>

      </div>
    </div>
  );
}