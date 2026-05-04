// src/components/AIInsightCard.tsx
import { useAI } from '../context/AIContext';

type Props = {
  page: string;
  theme?: 'dark' | 'light';
};

const typeStyles: Record<string, { bg: string; border: string; color: string; icon: string }> = {
  tip:     { bg: '#eff6ff', border: '#bfdbfe', color: '#1d4ed8', icon: '💡' },
  warning: { bg: '#fff7ed', border: '#fed7aa', color: '#c2410c', icon: '⚠️' },
  praise:  { bg: '#f0fdf4', border: '#bbf7d0', color: '#15803d', icon: '🌟' },
  info:    { bg: '#faf5ff', border: '#e9d5ff', color: '#7e22ce', icon: '🤖' },
};

const typeStylesDark: Record<string, { bg: string; border: string; color: string; icon: string }> = {
  tip:     { bg: 'rgba(29,78,216,0.1)',  border: 'rgba(191,219,254,0.2)', color: '#93c5fd', icon: '💡' },
  warning: { bg: 'rgba(194,65,12,0.1)',  border: 'rgba(254,215,170,0.2)', color: '#fdba74', icon: '⚠️' },
  praise:  { bg: 'rgba(21,128,61,0.1)',  border: 'rgba(187,247,208,0.2)', color: '#86efac', icon: '🌟' },
  info:    { bg: 'rgba(126,34,206,0.1)', border: 'rgba(233,213,255,0.2)', color: '#d8b4fe', icon: '🤖' },
};

export default function AIInsightCard({ page, theme }: Props) {
  const dark = theme === 'dark';
  const { insights, loading, lastUpdated, refresh } = useAI();
  const insight = insights[page];
  const styles  = dark ? typeStylesDark : typeStyles;

  if (loading && !insight) {
    return (
      <div style={{
        background: dark ? 'rgba(255,255,255,0.04)' : '#f8fafc',
        border: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}`,
        borderRadius: 16, padding: '12px 16px', marginBottom: 16,
        display: 'flex', alignItems: 'center', gap: 10,
        animation: 'pulse 1.5s ease-in-out infinite',
      }}>
        <span style={{ fontSize: 20 }}>🤖</span>
        <span style={{ fontSize: 13, color: dark ? 'rgba(255,255,255,0.4)' : '#94a3b8' }}>
          الذكاء الاصطناعي يحلل بياناتك...
        </span>
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
      </div>
    );
  }

  if (!insight) return null;

  const s = styles[insight.type] || styles.info;

  return (
    <div style={{
      background: s.bg,
      border: `1.5px solid ${s.border}`,
      borderRadius: 16, padding: '12px 16px',
      marginBottom: 16,
      display: 'flex', alignItems: 'flex-start', gap: 10,
    }}>
      <span style={{ fontSize: 20, flexShrink: 0 }}>{s.icon}</span>
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontSize: 13, color: s.color, lineHeight: 1.7, fontWeight: 600 }}>
          {insight.message}
        </p>
        {lastUpdated && (
          <p style={{ margin: '4px 0 0', fontSize: 10, color: dark ? 'rgba(255,255,255,0.3)' : '#94a3b8' }}>
            آخر تحليل: {lastUpdated}
          </p>
        )}
      </div>
      <button
        onClick={refresh}
        disabled={loading}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: 14, opacity: loading ? 0.4 : 0.7, flexShrink: 0,
        }}
        title="تحديث التحليل"
      >
        🔄
      </button>
    </div>
  );
}
