// src/pages/AIAssistant.tsx
import { useState } from 'react';
import HealthChat      from '../components/HealthChat';
import SymptomAnalyzer from '../components/SymptomAnalyzer';
import MedicineInfo    from '../components/MedicineInfo';
import DailyReport     from '../components/DailyReport';
import MealPlanner     from '../components/MealPlanner';
import WorkoutPlanner  from '../components/WorkoutPlanner';
import { Theme }       from '../App';

type Tab = 'chat' | 'symptoms' | 'medicine' | 'report' | 'meal' | 'workout';

const tabs: { id: Tab; icon: string; label: string; color: string; bg: string }[] = [
  { id: 'chat',     icon: '🤖', label: 'مساعد', color: '#818cf8', bg: 'rgba(129,140,248,0.12)' },
  { id: 'symptoms', icon: '🔬', label: 'أعراض', color: '#f472b6', bg: 'rgba(244,114,182,0.12)' },
  { id: 'medicine', icon: '💊', label: 'دواء',  color: '#22d3ee', bg: 'rgba(34,211,238,0.12)'  },
  { id: 'report',   icon: '📊', label: 'تقرير', color: '#34d399', bg: 'rgba(52,211,153,0.12)'  },
  { id: 'meal',     icon: '🍽️', label: 'وجبات', color: '#fb923c', bg: 'rgba(251,146,60,0.12)'  },
  { id: 'workout',  icon: '🧘', label: 'تمرين', color: '#a78bfa', bg: 'rgba(167,139,250,0.12)' },
];

const tabsLight: Record<Tab, string> = {
  chat: '#4f46e5', symptoms: '#db2777', medicine: '#0891b2',
  report: '#059669', meal: '#ea580c', workout: '#7c3aed',
};

type Props = { theme?: Theme };

export default function AIAssistant({ theme }: Props) {
  const dark = theme === 'dark';
  const [activeTab, setActiveTab] = useState<Tab>('chat');
  const active = tabs.find(t => t.id === activeTab)!;

  const renderTab = () => {
    switch (activeTab) {
      case 'chat':     return <HealthChat theme={theme} />; // ← التعديل هنا
      case 'symptoms': return <SymptomAnalyzer />;
    case 'medicine': return <MedicineInfo theme={theme} />;
      case 'report':   return <DailyReport />;
      case 'meal':     return <MealPlanner />;
      case 'workout':  return <WorkoutPlanner />;
    }
  };

  const pageBg      = dark ? '#08080f'               : '#f8faff';
  const titleColor  = dark ? 'white'                 : '#1e293b';
  const textMuted   = dark ? 'rgba(255,255,255,0.4)' : '#6b7280';
  const badgeBg     = dark ? `${active.color}15`     : `${active.color}18`;
  const badgeBord   = dark ? `${active.color}30`     : `${active.color}35`;
  const badgeText   = dark ? active.color            : tabsLight[activeTab];
  const headerBg    = dark
    ? `linear-gradient(160deg, ${active.bg} 0%, transparent 70%)`
    : `linear-gradient(160deg, ${active.bg} 0%, transparent 70%)`;
  const headerBord  = dark ? 'rgba(255,255,255,0.05)': `${active.color}20`;
  const tabActiveBg = dark ? active.bg               : `${active.bg}`;
  const tabActiveBrd= dark ? `${active.color}40`     : `${active.color}50`;
  const tabActiveClr= dark ? active.color            : tabsLight[activeTab];
  const tabDefBg    = dark ? 'rgba(255,255,255,0.025)': 'rgba(0,0,0,0.03)';
  const tabDefBord  = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)';
  const tabDefClr   = dark ? 'rgba(255,255,255,0.35)' : '#94a3b8';
  const contentBg   = dark ? 'rgba(255,255,255,0.02)' : '#ffffff';
  const contentBord = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)';
  const contentShdw = dark ? 'none' : '0 2px 16px rgba(0,0,0,0.05)';

  return (
    <div className="min-h-screen pb-24 page-enter" dir="rtl"
      style={{ position: 'relative', zIndex: 1, background: pageBg, transition: 'background 0.4s' }}>

      {/* HEADER */}
      <div style={{
        padding: '2rem 1.25rem 1.5rem',
        background: headerBg,
        borderBottom: `1px solid ${headerBord}`,
        position: 'relative', overflow: 'hidden',
        transition: 'background 0.4s ease',
      }}>
        <div style={{
          position: 'absolute', top: '-60px', right: '-60px',
          width: '200px', height: '200px', borderRadius: '50%',
          background: `radial-gradient(circle, ${active.color}${dark ? '33' : '28'} 0%, transparent 70%)`,
          pointerEvents: 'none',
          animation: 'orb-drift 10s ease-in-out infinite',
          transition: 'background 0.4s ease',
        }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: badgeBg, border: `1px solid ${badgeBord}`,
            borderRadius: '20px', padding: '4px 12px', marginBottom: '12px',
            transition: 'all 0.3s',
          }}>
            <span style={{ fontSize: '11px', color: badgeText, fontWeight: 700 }}>
              ✨ مدعوم بالذكاء الاصطناعي
            </span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 900, color: titleColor, lineHeight: 1.2 }}>
            {active.icon} {active.label === 'مساعد' ? 'المساعد الصحي' : active.label}
          </h1>
          <p style={{ fontSize: '13px', color: textMuted, marginTop: '4px' }}>
            اختر ما تريد من التبويبات أدناه
          </p>
        </div>
      </div>

      {/* TABS */}
      <div style={{
        padding: '1rem 1.25rem 0',
        overflowX: 'auto', display: 'flex', gap: '8px',
        scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch',
      } as React.CSSProperties}>
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 14px', borderRadius: '14px',
                border: isActive ? `1px solid ${tabActiveBrd}` : `1px solid ${tabDefBord}`,
                background: isActive ? tabActiveBg : tabDefBg,
                color: isActive ? tabActiveClr : tabDefClr,
                fontWeight: isActive ? 700 : 500,
                fontSize: '12px', cursor: 'pointer',
                fontFamily: "'Cairo', sans-serif",
                whiteSpace: 'nowrap', flexShrink: 0,
                transition: 'all 0.25s ease',
                boxShadow: isActive
                  ? dark
                    ? `0 0 14px ${tab.color}25`
                    : `0 2px 10px ${tab.color}20`
                  : 'none',
              }}
            >
              <span style={{ fontSize: '14px' }}>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* CONTENT */}
      <div style={{ padding: '1rem 1.25rem' }}>
        <div style={{
          background: contentBg, border: `1px solid ${contentBord}`,
          borderRadius: '20px', padding: '1rem',
          position: 'relative', overflow: 'hidden',
          boxShadow: contentShdw,
        }}>
          <div style={{
            position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px',
            background: `linear-gradient(90deg, transparent, ${active.color}60, transparent)`,
            transition: 'background 0.4s ease',
          }} />
          {renderTab()}
        </div>
      </div>
    </div>
  );
}
