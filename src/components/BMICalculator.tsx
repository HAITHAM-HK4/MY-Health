import { useState } from 'react';
type Props = { theme?: 'dark' | 'light' };
export default function BMICalculator({ theme }: Props) {
  const dark = theme === 'dark';
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi,    setBmi]    = useState<number | null>(null);
  const calculate = () => {
    const w = Number(weight);
    const h = Number(height) / 100;
    if (!w || !h) return;
    setBmi(Math.round((w / (h * h)) * 10) / 10);
  };
  const getStatus = () => {
    if (!bmi) return null;
    if (bmi < 18.5) return { text: 'نحيف 😟',      color: '#60a5fa', bg: 'rgba(96,165,250,0.12)',  border: 'rgba(96,165,250,0.25)'  };
    if (bmi < 25)   return { text: 'وزن مثالي 😊', color: '#34d399', bg: 'rgba(52,211,153,0.12)',  border: 'rgba(52,211,153,0.25)'  };
    if (bmi < 30)   return { text: 'زيادة وزن 😐', color: '#fbbf24', bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.25)'  };
    return                 { text: 'سمنة ⚠️',       color: '#f87171', bg: 'rgba(248,113,113,0.12)', border: 'rgba(248,113,113,0.25)' };
  };
  const status = getStatus();
 const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 14px',
  background: dark ? 'rgba(255,255,255,0.05)' : '#f8fafc',
  border: `1px solid ${dark ? 'rgba(139,92,246,0.25)' : '#e2e8f0'}`,
  borderRadius: '12px',
  color: '#111827',  // <-- أصبح أسود ثابت بدلاً من dark/light
  fontSize: '14px', outline: 'none',
  fontFamily: "'Cairo', sans-serif",
  textAlign: 'right' as const,
  marginBottom: '10px',
  transition: 'border-color 0.2s',
  boxSizing: 'border-box' as const,
};
  return (
    <div dir="rtl">
      <input
        type="number"
        placeholder="الوزن (كغ)"
        value={weight}
        onChange={e => setWeight(e.target.value)}
        style={inputStyle}
        onFocus={e => (e.target as HTMLInputElement).style.borderColor = 'rgba(139,92,246,0.6)'}
        onBlur={e  => (e.target as HTMLInputElement).style.borderColor = dark ? 'rgba(139,92,246,0.25)' : '#e2e8f0'}
      />
      <input
        type="number"
        placeholder="الطول (سم)"
        value={height}
        onChange={e => setHeight(e.target.value)}
        style={{ ...inputStyle, marginBottom: '14px' }}
        onFocus={e => (e.target as HTMLInputElement).style.borderColor = 'rgba(139,92,246,0.6)'}
        onBlur={e  => (e.target as HTMLInputElement).style.borderColor = dark ? 'rgba(139,92,246,0.25)' : '#e2e8f0'}
      />
      <button
        onClick={calculate}
        style={{
          width: '100%', padding: '12px',
          borderRadius: '14px', border: 'none', cursor: 'pointer',
          background: 'linear-gradient(135deg,#7c3aed,#8b5cf6)',
          color: 'white', fontWeight: 800, fontSize: '14px',
          fontFamily: "'Cairo', sans-serif",
          boxShadow: '0 4px 16px rgba(124,58,237,0.4)',
          marginBottom: '14px', transition: 'all 0.2s',
        }}
      >
        احسب BMI
      </button>
      {bmi && status && (
        <div style={{
          textAlign: 'center', padding: '16px',
          background: status.bg,
          border: `1px solid ${status.border}`,
          borderRadius: '16px',
        }}>
        <p style={{
  fontSize: '42px', fontWeight: 900,
  color: '#111827',  // <-- الرقم دائماً أسود
  margin: '0 0 6px',
  textShadow: `0 0 20px ${status.color}55`,
}}>
  {bmi}
</p>
          <p style={{
            fontSize: '15px', fontWeight: 700,
            color: status.color, margin: 0,
          }}>
            {status.text}
          </p>
        </div>
      )}
    </div>
  );
}
