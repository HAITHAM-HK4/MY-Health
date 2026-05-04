// src/pages/FamilyPortal.tsx
import { useState } from 'react';
import { useFamily } from '../context/FamilyContext';
import { useAuth } from '../context/AuthContext';
type Props = { theme?: 'dark' | 'light' };
const AVATARS = ['👨','👩','👦','👧','👴','👵','🧑','👮','👨‍⚕️','👩‍⚕️'];
const ROLES   = ['أب','أم','ابن','ابنة','جد','جدة','عم','عمة','أخ','أخت'];
export default function FamilyPortal({ theme }: Props) {
  const dark = theme === 'dark';
  const { createFamily, joinFamily } = useFamily();
  const { user, displayName } = useAuth();
  const [mode,       setMode]       = useState<'choose' | 'create' | 'join'>('choose');
  const [familyName, setFamilyName] = useState('');
  const [joinCode,   setJoinCode]   = useState('');
  const [age,        setAge]        = useState('');
  const [role,       setRole]       = useState('أب');
  const [avatar,     setAvatar]     = useState('👨');
  const [error,      setError]      = useState('');
  const [notFound,   setNotFound]   = useState(false);
  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '13px 16px',
    background: dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.04)',
    border: `1.5px solid ${dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)'}`,
    borderRadius: 14,
    color: dark ? 'rgba(255,255,255,0.9)' : '#1a1a2e',
    fontSize: 14,
    outline: 'none',
    fontFamily: "'Cairo', sans-serif",
    textAlign: 'right' as const,
    marginBottom: 10,
    boxSizing: 'border-box' as const,
    transition: 'border-color 0.2s',
  };
  // نموذج العضو — بدون حقل الاسم
  const memberForm = () => (
    <div>
      {/* عرض الاسم المعروض كـ badge للتأكيد */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: dark ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.08)',
        border: `1px solid rgba(99,102,241,0.25)`,
        borderRadius: 12, padding: '10px 14px', marginBottom: 14,
      }}>
        <span style={{ fontSize: 18 }}>👤</span>
        <div>
          <p style={{ margin: 0, fontSize: 11, color: dark ? 'rgba(255,255,255,0.4)' : '#888', fontWeight: 700 }}>
            ستنضم باسم
          </p>
          <p style={{ margin: 0, fontSize: 15, fontWeight: 900, color: dark ? '#a5b4fc' : '#6366f1' }}>
            {displayName || user?.username}
          </p>
        </div>
      </div>
      <p style={{ fontSize: 12, color: dark ? 'rgba(255,255,255,0.4)' : '#888', marginBottom: 6, fontWeight: 700, letterSpacing: 1 }}>
        الصورة الرمزية
      </p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
        {AVATARS.map(a => (
          <button
            key={a}
            onClick={() => setAvatar(a)}
            style={{
              width: 44, height: 44, borderRadius: 12, fontSize: 22,
              background: avatar === a
                ? 'linear-gradient(135deg,#6366f1,#8b5cf6)'
                : dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
              border: avatar === a ? 'none' : `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              cursor: 'pointer',
              transform: avatar === a ? 'scale(1.1)' : 'scale(1)',
              transition: 'all 0.2s',
              boxShadow: avatar === a ? '0 4px 14px rgba(99,102,241,0.5)' : 'none',
            }}
          >{a}</button>
        ))}
      </div>
      <input
        placeholder="عمرك"
        type="number"
        value={age}
        onChange={e => setAge(e.target.value)}
        style={inputStyle}
      />
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
        {ROLES.map(r => (
          <button
            key={r}
            onClick={() => setRole(r)}
            style={{
              padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700,
              background: role === r ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
              border: role === r ? 'none' : `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              color: role === r ? 'white' : dark ? 'rgba(255,255,255,0.5)' : '#666',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >{r}</button>
        ))}
      </div>
    </div>
  );
  // الاسم يأتي من displayName أو username
  const memberData = () => ({
    name: displayName || user?.username || 'مجهول',
    age,
    role,
    avatar,
    water: 0, steps: 0, sleep: 0, mood: 0,
    medicines: [], vaccines: [],
  });
  const handleCreate = () => {
    if (!familyName.trim()) { setError('أدخل اسم العائلة'); return; }
    if (!age.trim())        { setError('أدخل عمرك'); return; }
    setError('');
    createFamily(familyName, memberData());
  };
  const handleJoin = () => {
    if (!joinCode.trim()) { setError('أدخل كود الدعوة'); return; }
    if (!age.trim())      { setError('أدخل عمرك'); return; }
    setError('');
    setNotFound(false);
    const result = joinFamily(joinCode.toUpperCase(), memberData());
    if (result === 'not_found') setNotFound(true);
  };
  const bg = dark ? '#07071a' : '#f4f3ff';
  return (
    <div
      dir="rtl"
      style={{
        minHeight: '100vh',
        background: bg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '0 0 60px',
        fontFamily: "'Cairo', sans-serif",
      }}
    >
      {/* Header */}
      <div style={{
        width: '100%',
        background: 'linear-gradient(140deg, #4f46e5 0%, #7c3aed 60%, #a855f7 100%)',
        padding: '48px 24px 36px',
        textAlign: 'center',
        borderRadius: '0 0 40px 40px',
        boxShadow: '0 12px 40px rgba(99,102,241,0.35)',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: 28,
      }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -20, left: -30, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
        <div style={{ fontSize: 56, marginBottom: 10, filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' }}>👨‍👩‍👧‍👦</div>
        <h1 style={{ color: 'white', fontSize: 26, fontWeight: 900, margin: '0 0 6px', letterSpacing: -0.5 }}>
          بوابة العائلة
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 13, margin: 0, lineHeight: 1.8 }}>
          أنشئ عائلتك أو انضم إلى عائلة موجودة
        </p>
      </div>

      {/* CHOOSE */}
      {mode === 'choose' && (
        <div style={{ width: '100%', maxWidth: 420, padding: '0 20px' }}>
          <div style={{
            background: dark ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.06)',
            border: `1px solid ${dark ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.15)'}`,
            borderRadius: 20, padding: '18px 20px', marginBottom: 28,
          }}>
            {[
              { icon: '📊', text: 'تابع صحة كل فرد من العائلة' },
              { icon: '💊', text: 'تتبع الأدوية واللقاحات معاً' },
              { icon: '🔗', text: 'شارك كود الدعوة مع عائلتك' },
            ].map(f => (
              <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                <span style={{ fontSize: 20 }}>{f.icon}</span>
                <span style={{ fontSize: 13, color: dark ? 'rgba(255,255,255,0.6)' : '#555', fontWeight: 600 }}>{f.text}</span>
              </div>
            ))}
          </div>
          <button onClick={() => setMode('create')} style={{
            width: '100%', padding: '16px',
            background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
            border: 'none', borderRadius: 18, color: 'white',
            fontSize: 16, fontWeight: 900, cursor: 'pointer',
            fontFamily: "'Cairo', sans-serif",
            boxShadow: '0 8px 24px rgba(99,102,241,0.45)',
            marginBottom: 14,
          }}>
            ➕ إنشاء عائلة جديدة
          </button>
          <button onClick={() => setMode('join')} style={{
            width: '100%', padding: '16px',
            background: dark ? 'rgba(255,255,255,0.06)' : 'white',
            border: `2px solid rgba(99,102,241,0.4)`,
            borderRadius: 18,
            color: dark ? '#a5b4fc' : '#6366f1',
            fontSize: 16, fontWeight: 900, cursor: 'pointer',
            fontFamily: "'Cairo', sans-serif",
          }}>
            🔗 الانضمام بكود دعوة
          </button>
        </div>
      )}

      {/* CREATE */}
      {mode === 'create' && (
        <div style={{ width: '100%', maxWidth: 420, padding: '0 20px' }}>
          <div style={{
            background: dark ? 'rgba(255,255,255,0.04)' : 'white',
            border: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
            borderRadius: 24, padding: 22,
            boxShadow: dark ? 'none' : '0 4px 24px rgba(0,0,0,0.06)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <button onClick={() => { setMode('choose'); setError(''); }} style={{
                background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                border: 'none', borderRadius: 10, padding: '6px 12px',
                color: dark ? 'rgba(255,255,255,0.6)' : '#666', fontSize: 16, cursor: 'pointer',
              }}>←</button>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: dark ? 'white' : '#1a1a2e' }}>
                إنشاء عائلة
              </h2>
            </div>
            <p style={{ fontSize: 12, color: dark ? 'rgba(255,255,255,0.4)' : '#888', marginBottom: 6, fontWeight: 700, letterSpacing: 1 }}>
              اسم العائلة
            </p>
            <input
              placeholder="مثال: عائلة الأحمد"
              value={familyName}
              onChange={e => setFamilyName(e.target.value)}
              style={{ ...inputStyle, marginBottom: 16 }}
            />
            <div style={{ height: 1, background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)', marginBottom: 16 }} />
            {memberForm()}
            {error && (
              <div style={{
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
                borderRadius: 12, padding: '10px 14px', marginBottom: 14,
                color: '#ef4444', fontSize: 13, fontWeight: 700,
              }}>⚠️ {error}</div>
            )}
            <button onClick={handleCreate} style={{
              width: '100%', padding: '15px',
              background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
              border: 'none', borderRadius: 16, color: 'white',
              fontSize: 15, fontWeight: 900, cursor: 'pointer',
              fontFamily: "'Cairo', sans-serif",
              boxShadow: '0 6px 20px rgba(99,102,241,0.4)',
            }}>
              🚀 إنشاء العائلة
            </button>
          </div>
        </div>
      )}

      {/* JOIN */}
      {mode === 'join' && (
        <div style={{ width: '100%', maxWidth: 420, padding: '0 20px' }}>
          <div style={{
            background: dark ? 'rgba(255,255,255,0.04)' : 'white',
            border: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
            borderRadius: 24, padding: 22,
            boxShadow: dark ? 'none' : '0 4px 24px rgba(0,0,0,0.06)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <button onClick={() => { setMode('choose'); setNotFound(false); setError(''); }} style={{
                background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                border: 'none', borderRadius: 10, padding: '6px 12px',
                color: dark ? 'rgba(255,255,255,0.6)' : '#666', fontSize: 16, cursor: 'pointer',
              }}>←</button>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: dark ? 'white' : '#1a1a2e' }}>
                انضمام بكود
              </h2>
            </div>
            <div style={{
              background: dark ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.06)',
              border: `2px solid ${notFound ? 'rgba(239,68,68,0.4)' : 'rgba(99,102,241,0.25)'}`,
              borderRadius: 18, padding: '16px',
              marginBottom: 16, textAlign: 'center',
              transition: 'border-color 0.3s',
            }}>
              <p style={{ fontSize: 11, color: dark ? 'rgba(255,255,255,0.4)' : '#888', margin: '0 0 10px', fontWeight: 700, letterSpacing: 2 }}>
                كود الدعوة
              </p>
              <input
                placeholder="_ _ _ _ _ _"
                value={joinCode}
                onChange={e => { setJoinCode(e.target.value.toUpperCase()); setNotFound(false); setError(''); }}
                maxLength={6}
                style={{
                  ...inputStyle,
                  textAlign: 'center' as const,
                  fontSize: 28, fontWeight: 900, letterSpacing: 10,
                  background: 'transparent', border: 'none', margin: 0, padding: '4px 0',
                  color: dark ? '#a5b4fc' : '#6366f1',
                }}
              />
              {notFound && (
                <p style={{ color: '#ef4444', fontSize: 12, margin: '8px 0 0', fontWeight: 700 }}>
                  ❌ لم يُعثر على عائلة بهذا الكود
                </p>
              )}
            </div>
            <div style={{ height: 1, background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)', marginBottom: 16 }} />
            {memberForm()}
            {error && (
              <div style={{
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
                borderRadius: 12, padding: '10px 14px', marginBottom: 14,
                color: '#ef4444', fontSize: 13, fontWeight: 700,
              }}>⚠️ {error}</div>
            )}
            <button onClick={handleJoin} style={{
              width: '100%', padding: '15px',
              background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
              border: 'none', borderRadius: 16, color: 'white',
              fontSize: 15, fontWeight: 900, cursor: 'pointer',
              fontFamily: "'Cairo', sans-serif",
              boxShadow: '0 6px 20px rgba(99,102,241,0.4)',
            }}>
              🔗 انضمام للعائلة
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
