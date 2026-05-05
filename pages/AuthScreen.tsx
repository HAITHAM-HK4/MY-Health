// src/pages/AuthScreen.tsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

type Props = { theme?: 'dark' | 'light' };

export default function AuthScreen({ theme }: Props) {
  const dark = theme === 'dark' || true; // افتراضي ليلي للشاشة الأولى
  const { login, signup } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    setError('');
    const result = isLogin ? login(username, password) : signup(username, password);
    if (result) setError(result);
  };

  const bg = dark ? '#050510' : '#f5f3ff';
  const cardBg = dark ? 'rgba(255,255,255,0.04)' : '#ffffff';
  const inputBg = dark ? 'rgba(255,255,255,0.06)' : '#f8fafc';
  const inputBord = dark ? 'rgba(255,255,255,0.1)' : '#e2e8f0';

  return (
    <div dir="rtl" style={{
      minHeight: '100vh', background: bg, color: dark ? 'white' : '#1e293b',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '20px', fontFamily: "'Cairo', sans-serif",
    }}>
      {/* تأثيرات بصرية */}
      <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.2), transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,211,238,0.15), transparent 70%)', pointerEvents: 'none' }} />

      <div style={{
        background: cardBg, border: `1px solid ${inputBord}`,
        borderRadius: '24px', padding: '32px 24px',
        width: '100%', maxWidth: '400px', position: 'relative', zIndex: 10,
        boxShadow: dark ? '0 10px 40px rgba(0,0,0,0.5)' : '0 10px 40px rgba(99,102,241,0.1)',
        backdropFilter: 'blur(20px)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>🏥</div>
          <h1 style={{ fontSize: '24px', fontWeight: 900, margin: '0 0 8px' }}>
            {isLogin ? 'مرحباً بعودتك!' : 'أنشئ حسابك الصحي'}
          </h1>
          <p style={{ color: dark ? 'rgba(255,255,255,0.5)' : '#64748b', fontSize: '14px', margin: 0 }}>
            منصتك الشاملة لمتابعة صحتك وعائلتك
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
            color: '#ef4444', padding: '12px', borderRadius: '12px',
            fontSize: '13px', fontWeight: 700, marginBottom: '16px', textAlign: 'center'
          }}>⚠️ {error}</div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          <input
            type="text" placeholder="اسم المستخدم" value={username} onChange={e => setUsername(e.target.value)}
            style={{ width: '100%', padding: '14px 16px', background: inputBg, border: `1px solid ${inputBord}`, borderRadius: '14px', color: 'inherit', fontSize: '15px', outline: 'none', fontFamily: 'inherit' }}
          />
          <input
            type="password" placeholder="كلمة المرور" value={password} onChange={e => setPassword(e.target.value)}
            style={{ width: '100%', padding: '14px 16px', background: inputBg, border: `1px solid ${inputBord}`, borderRadius: '14px', color: 'inherit', fontSize: '15px', outline: 'none', fontFamily: 'inherit' }}
          />
        </div>

        <button onClick={handleSubmit} style={{
          width: '100%', padding: '16px', borderRadius: '16px', border: 'none',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          color: 'white', fontWeight: 900, fontSize: '16px', cursor: 'pointer',
          fontFamily: "'Cairo', sans-serif", boxShadow: '0 8px 24px rgba(99,102,241,0.4)',
          marginBottom: '20px', transition: 'transform 0.2s'
        }}>
          {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
        </button>

        <div style={{ textAlign: 'center' }}>
          <button onClick={() => { setIsLogin(!isLogin); setError(''); }} style={{
            background: 'none', border: 'none', color: dark ? '#a5b4fc' : '#6366f1',
            fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit'
          }}>
            {isLogin ? 'ليس لديك حساب؟ انضم إلينا' : 'لديك حساب بالفعل؟ سجل دخولك'}
          </button>
        </div>
      </div>
    </div>
  );
}
