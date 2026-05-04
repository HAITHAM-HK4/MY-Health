import { storage } from '../lib/storage';
import { useState } from 'react';

export default function EmergencyButton() {
  const [show, setShow]         = useState(false);
  const [calling, setCalling]   = useState<string | null>(null);

  // أرقام شخصية — يحفظها المستخدم في الإعدادات
  const emergency  = storage.get('emergency')  || '';
  const emergency2 = storage.get('emergency2') || '';

  const call = (number: string, label: string) => {
    setCalling(label);
    // يفتح تطبيق الهاتف ويبدأ الاتصال فوراً
    window.location.href = `tel:${number}`;
    // بعد ثانية يرجع للوضع الطبيعي (في حال بقي على الشاشة)
    setTimeout(() => setCalling(null), 2000);
  };

  const buttons = [
    { number: '110', label: 'الإسعاف',  icon: '🚑', color: '#ef4444' },
    { number: '112', label: 'الشرطة',   icon: '🚔', color: '#374151' },
    { number: '113', label: 'الإطفاء',  icon: '🚒', color: '#3b82f6' },
    ...(emergency  ? [{ number: emergency,  label: 'طوارئ شخصي',   icon: '👤', color: '#22c55e' }] : []),
    ...(emergency2 ? [{ number: emergency2, label: 'طوارئ شخصي 2', icon: '👥', color: '#a855f7' }] : []),
  ];

  return (
    <>
      {/* زر الطوارئ */}
      <button
        onClick={() => setShow(true)}
        style={{
          width: 56, height: 56, borderRadius: '50%',
          background: 'linear-gradient(135deg,#dc2626,#ef4444)',
          boxShadow: '0 4px 20px rgba(239,68,68,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22, border: 'none', cursor: 'pointer',
          animation: 'emergency-pulse 1.5s ease-in-out infinite',
          flexShrink: 0,
        }}
      >
        🆘
      </button>

      {/* المودال */}
      {show && (
        <div
          onClick={() => setShow(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
            style={{
              background: 'linear-gradient(180deg,#1e293b 0%,#0f172a 100%)',
              border: '1px solid rgba(239,68,68,0.4)',
              borderRadius: 24, padding: '24px 20px',
              width: '100%', maxWidth: 360,
              boxShadow: '0 0 40px rgba(239,68,68,0.2)',
            }}
          >
            {/* العنوان */}
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 44, marginBottom: 6 }}>🆘</div>
              <div style={{
                fontSize: 20, fontWeight: 900, color: '#fca5a5',
                letterSpacing: 1,
              }}>
                اتصال طوارئ
              </div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
                اضغط على أي زر للاتصال فوراً
              </div>
            </div>

            {/* الأزرار */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {buttons.map((btn) => (
                <button
                  key={btn.number}
                  onClick={() => call(btn.number, btn.label)}
                  style={{
                    background: calling === btn.label
                      ? 'rgba(255,255,255,0.1)'
                      : `${btn.color}22`,
                    border: `1.5px solid ${btn.color}66`,
                    color: '#f1f5f9',
                    padding: '14px 18px',
                    borderRadius: 16,
                    fontWeight: 700, fontSize: 15,
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all .2s',
                    fontFamily: 'inherit',
                  }}
                  onTouchStart={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)';
                  }}
                  onTouchEnd={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 22 }}>{btn.icon}</span>
                    <span>{btn.label}</span>
                  </span>
                  <span style={{
                    fontSize: 18, fontWeight: 900,
                    color: btn.color,
                    direction: 'ltr',
                    letterSpacing: 1,
                  }}>
                    {calling === btn.label ? '📞 جارٍ الاتصال...' : btn.number}
                  </span>
                </button>
              ))}
            </div>

            {/* ملاحظة الموبايل */}
            <div style={{
              marginTop: 16, padding: '10px 14px',
              background: 'rgba(99,102,241,0.08)',
              border: '1px solid rgba(99,102,241,0.2)',
              borderRadius: 12,
              fontSize: 12, color: '#94a3b8', textAlign: 'center',
            }}>
              📱 على الموبايل سيبدأ الاتصال تلقائياً فور الضغط
            </div>

            {/* إغلاق */}
            <button
              onClick={() => setShow(false)}
              style={{
                width: '100%', marginTop: 12, padding: '12px',
                borderRadius: 14,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#64748b', fontWeight: 700, fontSize: 14,
                cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
    </>
  );
}

