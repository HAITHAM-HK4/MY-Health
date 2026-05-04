import { useState } from 'react';
type Props = { theme?: 'dark' | 'light' };
export default function NearestPharmacy({ theme }: Props) {
  const dark = theme === 'dark';
  const [loading, setLoading] = useState(false);
  const [link,    setLink]    = useState('');
  const [error,   setError]   = useState('');
  const find = () => {
    setLoading(true);
    setError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const url = `https://www.google.com/maps/search/صيدلية/@${latitude},${longitude},15z`;
        setLink(url);
        setLoading(false);
      },
      () => {
        setError('لم نتمكن من الوصول لموقعك');
        setLoading(false);
      }
    );
  };
  return (
    <div dir="rtl">
      <button
        onClick={find}
        disabled={loading}
        style={{
          width: '100%', padding: '13px',
          borderRadius: '14px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
          background: loading
            ? 'rgba(99,102,241,0.4)'
            : 'linear-gradient(135deg,#6366f1,#8b5cf6)',
          color: 'white', fontWeight: 800, fontSize: '14px',
          fontFamily: "'Cairo', sans-serif",
          boxShadow: loading ? 'none' : '0 4px 16px rgba(99,102,241,0.4)',
          marginBottom: '10px', transition: 'all 0.2s',
        }}
      >
        {loading ? '⏳ جاري تحديد موقعك...' : '🔍 ابحث عن صيدلية قريبة'}
      </button>
      {error && (
        <p style={{
          color: '#f87171', fontSize: '13px', textAlign: 'center',
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
          borderRadius: '10px', padding: '8px',
        }}>
          ⚠️ {error}
        </p>
      )}
      {link && (
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'block', width: '100%', padding: '13px',
            borderRadius: '14px', textAlign: 'center',
            background: dark ? 'rgba(34,211,238,0.12)' : 'rgba(8,145,178,0.1)',
            border: `1px solid ${dark ? 'rgba(34,211,238,0.3)' : 'rgba(8,145,178,0.25)'}`,
            color: dark ? '#22d3ee' : '#0e7490',
            fontWeight: 800, fontSize: '14px',
            fontFamily: "'Cairo', sans-serif",
            textDecoration: 'none', transition: 'all 0.2s',
            boxShadow: dark ? '0 0 14px rgba(34,211,238,0.15)' : 'none',
          }}
        >
          🗺️ افتح الخريطة
        </a>
      )}
    </div>
  );
}
