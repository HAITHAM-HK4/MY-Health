// src/pages/FamilySetup.tsx
import { useState } from 'react';
import { useFamily } from '../context/FamilyContext';

type Props = { theme?: 'dark' | 'light' };

const AVATARS = ['👨','👩','👦','👧','👴','👵','🧑','👮','👨‍⚕️','👩‍⚕️'];
const ROLES   = ['أب','أم','ابن','ابنة','جد','جدة','عم','عمة','أخ','أخت'];

export default function FamilySetup({ theme }: Props) {
  const dark = theme === 'dark';
  const { createFamily, joinFamily } = useFamily();

  const [mode,       setMode]       = useState<'choose' | 'create' | 'join'>('choose');
  const [familyName, setFamilyName] = useState('');
  const [joinCode,   setJoinCode]   = useState('');
  const [name,       setName]       = useState('');
  const [age,        setAge]        = useState('');
  const [role,       setRole]       = useState('أب');
  const [avatar,     setAvatar]     = useState('👨');
  const [error,      setError]      = useState('');
  const [notFound,   setNotFound]   = useState(false);

  const bg   = dark ? '#050510' : '#f5f3ff';
  const card = dark ? 'rgba(255,255,255,0.05)' : 'white';
  const text = dark ? 'rgba(255,255,255,0.9)'  : '#1e293b';
  const sub  = dark ? 'rgba(255,255,255,0.5)'  : '#64748b';

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 16px',
    background: dark ? 'rgba(255,255,255,0.06)' : '#f8fafc',
    border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}`,
    borderRadius: 14, color: text, fontSize: 14, outline: 'none',
    fontFamily: "'Cairo',sans-serif",
    textAlign: 'right' as const, marginBottom: 12,
    boxSizing: 'border-box' as const,
  };

  const btnStyle: React.CSSProperties = {
    width: '100%', padding: '14px',
    background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
    border: 'none', borderRadius: 16, color: 'white',
    fontSize: 15, fontWeight: 800, cursor: 'pointer',
    fontFamily: "'Cairo',sans-serif",
    boxShadow: '0 6px 20px rgba(99,102,241,0.4)',
  };

  const memberForm = () => (
    <div>
      <p style={{ fontSize: 13, color: sub, marginBottom: 10 }}>معلوماتك الشخصية</p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
        {AVATARS.map(a => (
          <button key={a} onClick={() => setAvatar(a)} style={{
            width: 44, height: 44, borderRadius: 12, fontSize: 22,
            background: avatar === a ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : dark ? 'rgba(255,255,255,0.06)' : '#f1f5f9',
            border: avatar === a ? 'none' : `1px solid ${dark ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}`,
            cursor: 'pointer',
            boxShadow: avatar === a ? '0 4px 12px rgba(99,102,241,0.4)' : 'none',
          }}>{a}</button>
        ))}
      </div>
      <input placeholder="اسمك" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
      <input placeholder="عمرك" type="number" value={age} onChange={e => setAge(e.target.value)} style={inputStyle} />
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {ROLES.map(r => (
          <button key={r} onClick={() => setRole(r)} style={{
            padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700,
            background: role === r ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : dark ? 'rgba(255,255,255,0.06)' : '#f1f5f9',
            border: role === r ? 'none' : `1px solid ${dark ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}`,
            color: role === r ? 'white' : sub, cursor: 'pointer',
          }}>{r}</button>
        ))}
      </div>
    </div>
  );

  const memberData = () => ({
    name, age, role, avatar,
    water: 0, steps: 0, sleep: 0, mood: 0,
    medicines: [], vaccines: [],
  });

  const handleCreate = () => {
    if (!familyName.trim()) { setError('أدخل اسم العائلة'); return; }
    if (!name.trim())       { setError('أدخل اسمك'); return; }
    setError('');
    createFamily(familyName, memberData());
  };

  const handleJoin = () => {
    if (!joinCode.trim()) { setError('أدخل كود الدعوة'); return; }
    if (!name.trim())     { setError('أدخل اسمك'); return; }
    setError('');
    setNotFound(false);
    const result = joinFamily(joinCode.toUpperCase(), memberData());
    if (result === 'not_found') setNotFound(true);
  };

  return (
    <div dir="rtl" style={{ minHeight: '100vh', background: bg, paddingBottom: 40 }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
        padding: '40px 20px 30px',
        borderRadius: '0 0 32px 32px',
        textAlign: 'center', marginBottom: 24,
      }}>
        <div style={{ fontSize: 52, marginBottom: 12 }}>👨‍👩‍👧‍👦</div>
        <h1 style={{ color: 'white', fontSize: 24, fontWeight: 900, margin: '0 0 8px' }}>
          تطبيق العائلة
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, margin: 0 }}>
          تابع صحة عائلتك في مكان واحد
        </p>
      </div>

      <div style={{ padding: '0 20px' }}>

        {/* اختيار */}
        {mode === 'choose' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <button onClick={() => setMode('create')} style={btnStyle}>
              ➕ إنشاء عائلة جديدة
            </button>
            <button onClick={() => setMode('join')} style={{
              ...btnStyle,
              background: card,
              border: '2px solid rgba(99,102,241,0.3)',
              color: '#6366f1', boxShadow: 'none',
            }}>
              🔗 الانضمام بكود دعوة
            </button>
          </div>
        )}

        {/* إنشاء */}
        {mode === 'create' && (
          <div style={{ background: card, borderRadius: 24, padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <button onClick={() => setMode('choose')} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: sub }}>←</button>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: text }}>إنشاء عائلة</h2>
            </div>
            <input placeholder="اسم العائلة" value={familyName}
              onChange={e => setFamilyName(e.target.value)}
              style={{ ...inputStyle, marginBottom: 16 }} />
            {memberForm()}
            {error && <p style={{ color: '#ef4444', fontSize: 13, marginBottom: 12, fontWeight: 600 }}>⚠️ {error}</p>}
            <button onClick={handleCreate} style={btnStyle}>🚀 إنشاء العائلة</button>
          </div>
        )}

        {/* انضمام */}
        {mode === 'join' && (
          <div style={{ background: card, borderRadius: 24, padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <button onClick={() => { setMode('choose'); setNotFound(false); setError(''); }}
                style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: sub }}>←</button>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: text }}>انضمام بكود</h2>
            </div>

            <input
              placeholder="أدخل الكود هنا"
              value={joinCode}
              onChange={e => { setJoinCode(e.target.value.toUpperCase()); setNotFound(false); }}
              maxLength={6}
              style={{
                ...inputStyle,
                textAlign: 'center' as const,
                fontSize: 28, fontWeight: 900, letterSpacing: 10,
                marginBottom: notFound ? 8 : 16,
                borderColor: notFound ? '#ef4444' : undefined,
                background: notFound ? 'rgba(239,68,68,0.08)' : inputStyle.background,
              }}
            />

            {notFound && (
              <div style={{
                background: '#fee2e2', border: '1px solid #fca5a5',
                borderRadius: 12, padding: '10px 14px', marginBottom: 16,
                color: '#dc2626', fontSize: 13, fontWeight: 700,
              }}>
                ❌ الكود غير صحيح — تحقق من الكود وحاول مجدداً
              </div>
            )}

            {memberForm()}
            {error && <p style={{ color: '#ef4444', fontSize: 13, marginBottom: 12, fontWeight: 600 }}>⚠️ {error}</p>}
            <button onClick={handleJoin} style={btnStyle}>🔗 انضمام للعائلة</button>
          </div>
        )}
      </div>
    </div>
  );
}
