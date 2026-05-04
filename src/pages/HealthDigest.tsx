// src/pages/HealthDigest.tsx
import { useState, useEffect } from 'react';

type Props = { theme?: 'dark' | 'light' };

type Article = {
  title: string;
  description: string;
  url: string;
  image: string | null;
  publishedAt: string;
  source: { name: string; url: string };
};

const CATEGORIES = [
  { id: 'epidemic',  label: 'وباء',   icon: '🦠', query: 'epidemic virus outbreak disease' },
  { id: 'health',    label: 'صحة',    icon: '❤️', query: 'health medicine wellness' },
  { id: 'nutrition', label: 'مأكولات', icon: '🥗', query: 'nutrition food diet healthy eating' },
];

const GNEWS_KEY = '2c0b3684083d696e1f076ef2badd4fb7';
const GROQ_KEY  = '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';

const fetchNews = async (query: string): Promise<Article[]> => {
  const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&country=any&max=10&token=${GNEWS_KEY}`;
  const res  = await fetch(url);
  if (!res.ok) throw new Error(`GNews Error ${res.status}`);
  const data = await res.json();
  return data.articles || [];
};

const translateWithAI = async (articles: Article[]): Promise<Article[]> => {
  const input = articles
    .map((a, i) => `${i + 1}. Title: ${a.title}\nDesc: ${a.description || ''}`)
    .join('\n\n');

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'أنت مترجم طبي محترف. رد بـ JSON فقط بدون أي نص إضافي أو backticks.',
        },
        {
          role: 'user',
          content: `ترجم إلى العربية وأعد JSON مصفوفة بهذا الشكل فقط:
[{"title":"...","description":"..."}]

النصوص:
${input}`,
        },
      ],
      max_tokens: 2000,
    }),
  });

  const data  = await response.json();
  const raw   = data.choices[0].message.content;
  const clean = raw.replace(/```json|```/g, '').trim();
  const translated: { title: string; description: string }[] = JSON.parse(clean);

  return articles.map((a, i) => ({
    ...a,
    title:       translated[i]?.title       || a.title,
    description: translated[i]?.description || a.description,
  }));
};

const timeAgo = (dateStr: string): string => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60)  return `منذ ${mins} دقيقة`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)   return `منذ ${hrs} ساعة`;
  return `منذ ${Math.floor(hrs / 24)} يوم`;
};

const categoryColors: Record<string, string> = {
  epidemic:  '#ef4444',
  health:    '#6366f1',
  nutrition: '#f59e0b',
};

export default function HealthDigest({ theme }: Props) {
  const dark = theme === 'dark';

  const [articles,    setArticles]    = useState<Article[]>([]);
  const [loading,     setLoading]     = useState(false);
  const [translating, setTranslating] = useState(false);
  const [activecat,   setActivecat]   = useState(CATEGORIES[0]);
  const [expanded,    setExpanded]    = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState('');
  const [error,       setError]       = useState('');

  const load = async (cat = activecat) => {
    setLoading(true);
    setError('');
    setArticles([]);
    setExpanded(null);
    try {
      const raw = await fetchNews(cat.query);
      setLoading(false);
      setTranslating(true);
      const translated = await translateWithAI(raw);
      setArticles(translated);
      setLastFetched(
        new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
      );
    } catch (e: any) {
      setError(e.message || 'حدث خطأ');
      setLoading(false);
    }
    setLoading(false);
    setTranslating(false);
  };

  useEffect(() => { load(); }, []);

  const handleCategory = (cat: typeof CATEGORIES[0]) => {
    setActivecat(cat);
    load(cat);
  };

  const bg   = dark ? '#050510' : '#f5f3ff';
  const card = dark ? 'rgba(255,255,255,0.05)' : 'white';
  const text = dark ? 'rgba(255,255,255,0.9)'  : '#1e293b';
  const sub  = dark ? 'rgba(255,255,255,0.5)'  : '#64748b';
  const color = categoryColors[activecat.id] || '#6366f1';

  return (
    <div dir="rtl" style={{ minHeight: '100vh', background: bg, paddingBottom: 100 }}>

      {/* ── Header ── */}
      <div style={{
        background: dark
          ? `linear-gradient(135deg,#1e1b4b,#0f172a)`
          : `linear-gradient(135deg,${color},${color}cc)`,
        padding: '24px 20px 20px',
        borderRadius: '0 0 28px 28px',
        marginBottom: 20,
        transition: 'background 0.4s',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ color: 'white', fontSize: 22, fontWeight: 800, margin: 0 }}>
              {activecat.icon} الموجز الصحي
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12, margin: '4px 0 0' }}>
              أخبار حقيقية • مترجمة بالذكاء الاصطناعي
            </p>
          </div>
          <button
            onClick={() => load()}
            disabled={loading || translating}
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: 14, padding: '8px 14px',
              color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer',
            }}
          >
            {loading || translating ? '⏳' : '🔄'} تحديث
          </button>
        </div>
        {lastFetched && (
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, margin: '10px 0 0' }}>
            آخر تحديث: {lastFetched}
          </p>
        )}
      </div>

      {/* ── Category Filter ── */}
      <div style={{
        display: 'flex', gap: 10,
        padding: '0 16px 14px',
        justifyContent: 'center',
      }}>
        {CATEGORIES.map(cat => {
          const isActive = activecat.id === cat.id;
          const c = categoryColors[cat.id];
          return (
            <button key={cat.id} onClick={() => handleCategory(cat)} style={{
              flex: 1, padding: '10px 8px', borderRadius: 16,
              border: isActive ? 'none' : `1.5px solid ${dark ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}`,
              cursor: 'pointer', fontSize: 13, fontWeight: 700,
              background: isActive ? c : dark ? 'rgba(255,255,255,0.04)' : 'white',
              color: isActive ? 'white' : sub,
              boxShadow: isActive ? `0 4px 16px ${c}55` : 'none',
              transition: 'all 0.25s',
            }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>{cat.icon}</div>
              {cat.label}
            </button>
          );
        })}
      </div>

      <div style={{ padding: '0 16px' }}>

        {/* Error */}
        {error && (
          <div style={{
            background: '#fee2e2', border: '1px solid #fca5a5',
            borderRadius: 16, padding: '14px 16px', marginBottom: 12,
            color: '#dc2626', fontSize: 13, fontWeight: 600,
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Status */}
        {(loading || translating) && (
          <div style={{
            background: dark ? `${color}15` : `${color}10`,
            border: `1px solid ${color}30`,
            borderRadius: 16, padding: '12px 16px', marginBottom: 12,
            color, fontSize: 13, fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <span style={{ fontSize: 22 }}>{loading ? activecat.icon : '🤖'}</span>
            <div>
              <div>{loading ? 'جاري جلب الأخبار...' : 'جاري الترجمة بالذكاء الاصطناعي...'}</div>
              <div style={{ fontSize: 11, opacity: 0.7, marginTop: 2 }}>
                {loading ? 'GNews API' : 'Groq llama-3.3-70b'}
              </div>
            </div>
          </div>
        )}

        {/* Skeletons */}
        {(loading || translating) && Array.from({ length: 5 }).map((_, i) => (
          <div key={i} style={{
            background: card, borderRadius: 20, padding: 18, marginBottom: 12,
            animation: 'pulse 1.5s ease-in-out infinite',
            animationDelay: `${i * 120}ms`,
          }}>
            <div style={{ height: 140, borderRadius: 12, background: dark ? 'rgba(255,255,255,0.07)' : '#e2e8f0', marginBottom: 12 }} />
            <div style={{ height: 12, width: '45%', borderRadius: 6, background: dark ? 'rgba(255,255,255,0.07)' : '#e2e8f0', marginBottom: 10 }} />
            <div style={{ height: 16, width: '88%', borderRadius: 6, background: dark ? 'rgba(255,255,255,0.07)' : '#e2e8f0' }} />
          </div>
        ))}

        {/* Articles */}
        {!loading && !translating && articles.map((article, idx) => {
          const isOpen = expanded === article.url;
          return (
            <div key={article.url || idx} style={{
              background: card, borderRadius: 20, marginBottom: 14,
              border: isOpen
                ? `1.5px solid ${color}50`
                : `1.5px solid ${dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}`,
              boxShadow: isOpen ? `0 8px 28px ${color}20` : '0 2px 8px rgba(0,0,0,0.04)',
              overflow: 'hidden', transition: 'all 0.3s',
            }}>
              {article.image && (
                <img src={article.image} alt=""
                  style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }}
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              )}
              <div style={{ padding: '14px 16px', cursor: 'pointer' }}
                onClick={() => setExpanded(isOpen ? null : article.url)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{
                    background: `${color}18`, color,
                    borderRadius: 10, padding: '3px 10px', fontSize: 11, fontWeight: 700,
                  }}>
                    {activecat.icon} {activecat.label}
                  </span>
                  <span style={{ fontSize: 11, color: sub }}>
                    {timeAgo(article.publishedAt)}
                  </span>
                </div>
                <h3 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 700, color: text, lineHeight: 1.6 }}>
                  {article.title}
                </h3>
                {isOpen && article.description && (
                  <p style={{ margin: '10px 0 12px', fontSize: 13, color: sub, lineHeight: 1.9 }}>
                    {article.description}
                  </p>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                  <span style={{ fontSize: 12, color, fontWeight: 600 }}>
                    {isOpen ? 'إخفاء ▲' : 'اقرأ المزيد ▼'}
                  </span>
                  {isOpen && (
                    <a href={article.url} target="_blank" rel="noreferrer"
                      onClick={e => e.stopPropagation()}
                      style={{
                        background: color, color: 'white', borderRadius: 10,
                        padding: '5px 12px', fontSize: 12, fontWeight: 700,
                        textDecoration: 'none',
                      }}>
                      المصدر ↗
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {!loading && !translating && !error && articles.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: sub }}>
            <p style={{ fontSize: 40, marginBottom: 12 }}>📭</p>
            <p>اضغط تحديث لجلب الأخبار</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.45} }
        ::-webkit-scrollbar { display:none }
      `}</style>
    </div>
  );
}
