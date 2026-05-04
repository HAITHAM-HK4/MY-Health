import { useEffect, useRef, useState } from 'react';

type Props = { onFinish: () => void };

const PARTICLES = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  delay: Math.random() * 4,
  dur: Math.random() * 6 + 4,
  color: ['#0ea5e9', '#06b6d4', '#10b981', '#38bdf8', '#34d399', '#6ee7b7'][
    Math.floor(Math.random() * 6)
  ],
  opacity: Math.random() * 0.35 + 0.08,
}));

const FEATURES = [
  { icon: '💧', label: 'تتبع الماء',      color: '#0ea5e9', delay: 0 },
  { icon: '💊', label: 'إدارة الأدوية',   color: '#6366f1', delay: 0.1 },
  { icon: '🚶', label: 'الخطوات اليومية', color: '#10b981', delay: 0.2 },
  { icon: '😴', label: 'جودة النوم',      color: '#8b5cf6', delay: 0.3 },
  { icon: '❤️', label: 'ضغط الدم',        color: '#ef4444', delay: 0.4 },
  { icon: '🤖', label: 'ذكاء اصطناعي',   color: '#f59e0b', delay: 0.5 },
];

export default function SplashScreen({ onFinish }: Props) {
  const [phase, setPhase] = useState<'idle' | 'logo' | 'tagline' | 'features' | 'cta' | 'exit'>('idle');
  const [progress, setProgress] = useState(0);
  const [logoGlow, setLogoGlow] = useState(false);
  const [ripple, setRipple] = useState(false);
  const [nameVisible, setNameVisible] = useState(false);
  const [taglineVisible, setTaglineVisible] = useState(false);
  const [featuresVisible, setFeaturesVisible] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);
  const [exitStart, setExitStart] = useState(false);
  const [orb1, setOrb1] = useState(false);
  const [orb2, setOrb2] = useState(false);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    const t1 = setTimeout(() => { setPhase('logo'); setOrb1(true); }, 200);
    const t2 = setTimeout(() => { setLogoGlow(true); setRipple(true); }, 600);
    const t3 = setTimeout(() => setNameVisible(true), 900);
    const t4 = setTimeout(() => { setPhase('tagline'); setTaglineVisible(true); }, 1400);
    const t5 = setTimeout(() => { setPhase('features'); setFeaturesVisible(true); setOrb2(true); }, 2000);
    const t6 = setTimeout(() => { setPhase('cta'); setCtaVisible(true); }, 2800);

    const t7 = setTimeout(() => {
      startRef.current = performance.now();
      const animate = (now: number) => {
        const elapsed = now - (startRef.current ?? now);
        const pct = Math.min(elapsed / 2500, 1);
        const eased = 1 - Math.pow(1 - pct, 2);
        setProgress(Math.round(eased * 100));
        if (pct < 1) rafRef.current = requestAnimationFrame(animate);
      };
      rafRef.current = requestAnimationFrame(animate);
    }, 800);

    return () => {
      [t1, t2, t3, t4, t5, t6, t7].forEach(clearTimeout);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleEnter = () => {
    setExitStart(true);
    setTimeout(onFinish, 700);
  };

  return (
    <div
      dir="rtl"
      style={{
        position: 'fixed',
        inset: 0,
        /* ✅ خلفية نهارية مشرقة */
        background: 'linear-gradient(160deg, #f0f9ff 0%, #e0f2fe 45%, #ecfeff 75%, #f0fdf4 100%)',
        overflow: 'hidden',
        fontFamily: "'Cairo', 'Tajawal', sans-serif",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transition: exitStart ? 'opacity 0.7s ease, transform 0.7s ease' : 'none',
        opacity: exitStart ? 0 : 1,
        transform: exitStart ? 'scale(1.04)' : 'scale(1)',
        zIndex: 9999,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&family=Tajawal:wght@400;700;900&display=swap');

        @keyframes float-up {
          0%   { transform: translateY(0px) rotate(0deg); opacity: 0.7; }
          50%  { transform: translateY(-30px) rotate(180deg); opacity: 0.2; }
          100% { transform: translateY(-60px) rotate(360deg); opacity: 0; }
        }
        @keyframes orb-pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50%      { transform: scale(1.15); opacity: 0.8; }
        }
        @keyframes logo-pop {
          0%   { transform: scale(0.3) rotate(-15deg); opacity: 0; }
          60%  { transform: scale(1.12) rotate(3deg); opacity: 1; }
          80%  { transform: scale(0.96) rotate(-1deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 30px rgba(2,132,199,0.30), 0 0 60px rgba(2,132,199,0.12); }
          50%       { box-shadow: 0 0 50px rgba(2,132,199,0.50), 0 0 100px rgba(6,182,212,0.22), 0 0 150px rgba(16,185,129,0.10); }
        }
        @keyframes ripple-expand {
          0%   { transform: scale(0); opacity: 0.5; }
          100% { transform: scale(4); opacity: 0; }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes cta-bounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-4px); }
        }
        @keyframes rotate-slow {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes counter-rotate {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }
        @keyframes scan-line {
          0%   { top: -4px; }
          100% { top: 100%; }
        }
        @keyframes feature-pop {
          0%   { transform: scale(0.7) translateY(10px); opacity: 0; }
          70%  { transform: scale(1.06) translateY(-2px); }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }

        .particle     { animation: float-up linear infinite; }
        .orb          { animation: orb-pulse ease-in-out infinite; }
        .ripple-ring  { animation: ripple-expand 1.2s ease-out forwards; }
        .pulse-ring   { animation: pulse-ring 2s ease-out infinite; }
        .feature-item { animation: feature-pop 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards; opacity: 0; }
        .cta-btn      { animation: cta-bounce 2s ease-in-out infinite; }
        .ring-rotate  { animation: rotate-slow 8s linear infinite; }
        .ring-counter { animation: counter-rotate 6s linear infinite; }

        /* ✅ shimmer نهاري أزرق-أخضر */
        .shimmer-text {
          background: linear-gradient(90deg, #0284c7 0%, #0ea5e9 30%, #06b6d4 55%, #10b981 80%, #0284c7 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }
      `}</style>

      {/* جزيئات عائمة */}
      {PARTICLES.map((p) => (
        <div key={p.id} className="particle" style={{
          position: 'absolute', left: `${p.x}%`, top: `${p.y}%`,
          width: `${p.size}px`, height: `${p.size}px`,
          borderRadius: '50%', background: p.color,
          opacity: p.opacity,
          animationDuration: `${p.dur}s`, animationDelay: `${p.delay}s`,
        }} />
      ))}

      {/* ORB 1 */}
      <div className={orb1 ? 'orb' : ''} style={{
        position: 'absolute', top: '-10%', right: '-15%',
        width: '500px', height: '500px', borderRadius: '50%',
        /* ✅ لون نهاري أزرق سماوي */
        background: 'radial-gradient(circle, rgba(14,165,233,0.14) 0%, rgba(6,182,212,0.07) 50%, transparent 75%)',
        transition: 'opacity 1.5s', opacity: orb1 ? 1 : 0, animationDuration: '7s',
      }} />

      {/* ORB 2 */}
      <div className={orb2 ? 'orb' : ''} style={{
        position: 'absolute', bottom: '-8%', left: '-12%',
        width: '400px', height: '400px', borderRadius: '50%',
        /* ✅ لون نهاري أخضر */
        background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, rgba(52,211,153,0.06) 50%, transparent 70%)',
        transition: 'opacity 1.5s', opacity: orb2 ? 1 : 0,
        animationDuration: '9s', animationDelay: '1s',
      }} />

      {/* خط scan خفيف */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', opacity: 0.06 }}>
        <div style={{
          position: 'absolute', left: 0, right: 0, height: '1px',
          /* ✅ لون نهاري */
          background: 'linear-gradient(90deg, transparent, rgba(2,132,199,0.9), rgba(6,182,212,0.9), transparent)',
          animation: 'scan-line 4s linear infinite',
        }} />
      </div>

      {/* المحتوى الرئيسي */}
      <div style={{
        position: 'relative', zIndex: 10,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: '0',
        width: '100%', maxWidth: '380px', padding: '0 24px',
      }}>

        {/* اللوجو */}
        <div style={{ position: 'relative', marginBottom: '28px' }}>

          {/* حلقات نبض */}
          {[0, 0.5, 1].map((delay) => (
            <div key={delay} className="pulse-ring" style={{
              position: 'absolute', inset: '-4px', borderRadius: '50%',
              /* ✅ */
              border: '1.5px solid rgba(2,132,199,0.30)',
              animationDelay: `${delay}s`,
            }} />
          ))}

          {/* حلقة خارجية */}
          <div className="ring-rotate" style={{
            position: 'absolute', inset: '-18px', borderRadius: '50%',
            border: '1px dashed rgba(2,132,199,0.20)',
          }} />
          <div className="ring-counter" style={{
            position: 'absolute', inset: '-32px', borderRadius: '50%',
            border: '1px dashed rgba(6,182,212,0.15)',
          }} />

          {/* الشعار */}
          <div style={{
            width: '96px', height: '96px', borderRadius: '28px',
            /* ✅ تدرج نهاري */
            background: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 50%, #10b981 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '44px', position: 'relative',
            animation: phase !== 'idle' ? 'logo-pop 0.7s cubic-bezier(0.34,1.56,0.64,1) forwards' : 'none',
            opacity: phase === 'idle' ? 0 : undefined,
            ...(logoGlow ? {
              boxShadow: '0 0 40px rgba(2,132,199,0.40), 0 0 80px rgba(2,132,199,0.18), 0 0 120px rgba(6,182,212,0.10)',
              animation: 'logo-pop 0.7s cubic-bezier(0.34,1.56,0.64,1) forwards, glow-pulse 2.5s ease-in-out infinite 0.7s',
            } : {}),
          }}>
            {ripple && (
              <>
                <div className="ripple-ring" style={{
                  position: 'absolute', inset: 0, borderRadius: '28px',
                  border: '2px solid rgba(2,132,199,0.50)',
                }} />
                <div className="ripple-ring" style={{
                  position: 'absolute', inset: 0, borderRadius: '28px',
                  border: '2px solid rgba(16,185,129,0.35)',
                  animationDelay: '0.3s',
                }} />
              </>
            )}
            💚
          </div>
        </div>

        {/* اسم التطبيق */}
        <div style={{
          transition: 'all 0.7s cubic-bezier(0.34,1.56,0.64,1)',
          opacity: nameVisible ? 1 : 0,
          transform: nameVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.9)',
          marginBottom: '8px', textAlign: 'center',
        }}>
          <h1 className="shimmer-text" style={{
            fontSize: '38px', fontWeight: 900,
            letterSpacing: '-0.5px', lineHeight: 1.1, margin: 0,
          }}>صحّتي</h1>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            /* ✅ */
            background: 'rgba(2,132,199,0.08)',
            border: '1px solid rgba(2,132,199,0.20)',
            borderRadius: '20px', padding: '3px 12px', marginTop: '6px',
          }}>
            <span style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: '#10b981', boxShadow: '0 0 8px #10b981',
              animation: 'pulse-ring 1.5s ease-out infinite', display: 'inline-block',
            }} />
            <span style={{
              fontSize: '11px',
              /* ✅ */
              color: '#0284c7',
              fontWeight: 700, letterSpacing: '0.5px',
            }}>مساعدك الصحي الذكي</span>
          </div>
        </div>

        {/* الشعار الفرعي */}
        <p style={{
          transition: 'all 0.8s ease',
          opacity: taglineVisible ? 0.75 : 0,
          transform: taglineVisible ? 'translateY(0)' : 'translateY(15px)',
          fontSize: '14px',
          /* ✅ */
          color: '#475569',
          textAlign: 'center', lineHeight: 1.7,
          margin: '0 0 32px', maxWidth: '260px',
        }}>
          تتبّع صحتك، راقب أدويتك،<br />وابدأ كل يوم بقوة 💪
        </p>

        {/* شبكة الميزات */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '10px', width: '100%', marginBottom: '32px',
        }}>
          {FEATURES.map((f) => (
            <div key={f.label}
              className={featuresVisible ? 'feature-item' : ''}
              style={{
                animationDelay: featuresVisible ? `${f.delay}s` : '0s',
                /* ✅ بطاقة بيضاء نهارية */
                background: '#ffffff',
                border: `1px solid ${f.color}25`,
                borderRadius: '14px', padding: '10px 6px',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: '5px',
                opacity: featuresVisible ? undefined : 0,
                boxShadow: `0 2px 10px ${f.color}10`,
              }}
            >
              <span style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: `${f.color}12`,
                border: `1px solid ${f.color}25`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '18px',
              }}>{f.icon}</span>
              <span style={{
                fontSize: '10px',
                /* ✅ */
                color: '#475569',
                fontWeight: 700, textAlign: 'center',
              }}>{f.label}</span>
            </div>
          ))}
        </div>

        {/* شريط التحميل */}
        <div style={{ width: '100%', marginBottom: '28px' }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            marginBottom: '8px', opacity: nameVisible ? 1 : 0, transition: 'opacity 0.5s',
          }}>
            {/* ✅ */}
            <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>جاري التحميل...</span>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#0284c7' }}>{progress}%</span>
          </div>
          <div style={{
            width: '100%', height: '4px',
            /* ✅ */
            background: 'rgba(2,132,199,0.10)',
            borderRadius: '99px', overflow: 'hidden',
            opacity: nameVisible ? 1 : 0, transition: 'opacity 0.5s',
          }}>
            <div style={{
              height: '100%', width: `${progress}%`, borderRadius: '99px',
              /* ✅ */
              background: 'linear-gradient(90deg, #0284c7, #06b6d4, #10b981)',
              boxShadow: '0 0 10px rgba(2,132,199,0.45)',
              transition: 'width 0.1s linear',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.45) 50%, transparent 100%)',
                animation: 'shimmer 1.5s linear infinite', backgroundSize: '200% 100%',
              }} />
            </div>
          </div>
        </div>

        {/* زر الدخول */}
        <button
          onClick={handleEnter}
          className={ctaVisible ? 'cta-btn' : ''}
          style={{
            width: '100%', padding: '16px', borderRadius: '16px', border: 'none',
            /* ✅ */
            background: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 50%, #10b981 100%)',
            color: 'white', fontSize: '16px', fontWeight: 900,
            fontFamily: 'inherit', cursor: 'pointer', letterSpacing: '0.3px',
            position: 'relative', overflow: 'hidden',
            boxShadow: '0 4px 30px rgba(2,132,199,0.35), 0 8px 32px rgba(6,182,212,0.18)',
            transition: 'opacity 0.6s cubic-bezier(0.34,1.56,0.64,1), transform 0.6s cubic-bezier(0.34,1.56,0.64,1)',
            opacity: ctaVisible ? 1 : 0,
            transform: ctaVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.9)',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px) scale(1.02)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 40px rgba(2,132,199,0.45)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0) scale(1)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 30px rgba(2,132,199,0.35)';
          }}
          onTouchStart={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)'; }}
          onTouchEnd={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
        >
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.20) 50%, transparent 60%)',
            animation: 'shimmer 2.5s linear infinite', backgroundSize: '200% 100%',
          }} />
          <span style={{ position: 'relative', zIndex: 1 }}>ابدأ رحلتك الصحية ✨</span>
        </button>

        {/* نص صغير */}
        <p style={{
          marginTop: '14px', fontSize: '11px',
          /* ✅ */
          color: '#94a3b8',
          textAlign: 'center', transition: 'opacity 0.6s', opacity: ctaVisible ? 1 : 0,
        }}>صُنع بـ ❤️ لصحتك وسعادتك</p>
      </div>
    </div>
  );
}
