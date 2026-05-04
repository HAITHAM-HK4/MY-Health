// src/components/OnboardingComplete.tsx
import { useEffect, useState } from 'react';

type Props = {
  username: string;
  onEnter: () => void;
};

// ── Particle config ───────────────────────────────────────────
const COLORS = ['#a78bfa','#f472b6','#38bdf8','#34d399','#fbbf24','#fb923c','#818cf8'];

const PARTICLES = Array.from({ length: 52 }, (_, i) => {
  const angle    = (i / 52) * 360 + (Math.random() - 0.5) * 18;
  const dist     = 110 + Math.random() * 140;
  const rad      = (angle * Math.PI) / 180;
  const tx       = Math.cos(rad) * dist;
  const ty       = Math.sin(rad) * dist;
  const size     = 3 + Math.random() * 7;
  const isSquare = Math.random() > 0.6;
  const delay    = Math.random() * 0.45;
  const dur      = 0.55 + Math.random() * 0.55;
  const color    = COLORS[i % COLORS.length];
  return { id: i, tx, ty, size, isSquare, delay, dur, color };
});

// ── Floating stars ────────────────────────────────────────────
const STARS = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  top:   `${Math.random() * 100}%`,
  left:  `${Math.random() * 100}%`,
  size:  1 + Math.random() * 2.5,
  delay: Math.random() * 4,
  dur:   2 + Math.random() * 3,
}));

// ── Achievements ──────────────────────────────────────────────
const BADGES = [
  { icon: '🧬', label: 'ملفك الصحي' },
  { icon: '🎯', label: 'أهدافك محددة' },
  { icon: '🤖', label: 'AI مُخصّص لك' },
  { icon: '🛡️', label: 'بياناتك آمنة' },
];

export default function OnboardingComplete({ username, onEnter }: Props) {
  const [phase, setPhase] = useState<0 | 1 | 2 | 3>(0);
  // 0 = burst  1 = text in  2 = badges  3 = button

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 400);
    const t2 = setTimeout(() => setPhase(2), 900);
    const t3 = setTimeout(() => setPhase(3), 1500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div
      dir="rtl"
      style={{
        position: 'fixed', inset: 0, zIndex: 10001,
        background: '#060a12',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Cairo', 'Segoe UI', Tahoma, sans-serif",
        overflow: 'hidden',
      }}
    >
      {/* ── CSS ─────────────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap');

        @keyframes oc-burst {
          0%   { transform: translate(0,0) scale(1); opacity: 1; }
          80%  { opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) scale(0.3); opacity: 0; }
        }
        @keyframes oc-ring {
          0%   { transform: scale(0.3); opacity: 0.7; }
          100% { transform: scale(2.8); opacity: 0; }
        }
        @keyframes oc-checkDraw {
          from { stroke-dashoffset: 80; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes oc-circlePop {
          0%   { transform: scale(0); opacity: 0; }
          55%  { transform: scale(1.12); opacity: 1; }
          80%  { transform: scale(0.96); }
          100% { transform: scale(1); }
        }
        @keyframes oc-glow {
          0%,100% { box-shadow: 0 0 30px rgba(52,211,153,0.3), 0 0 60px rgba(52,211,153,0.15); }
          50%      { box-shadow: 0 0 50px rgba(52,211,153,0.5), 0 0 90px rgba(52,211,153,0.25); }
        }
        @keyframes oc-slideUp {
          from { transform: translateY(28px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        @keyframes oc-badgePop {
          0%   { transform: scale(0) rotate(-10deg); opacity: 0; }
          65%  { transform: scale(1.15) rotate(3deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg);   opacity: 1; }
        }
        @keyframes oc-btnPulse {
          0%,100% { box-shadow: 0 8px 40px rgba(167,139,250,0.35); }
          50%     { box-shadow: 0 8px 60px rgba(167,139,250,0.6), 0 0 0 8px rgba(167,139,250,0.08); }
        }
        @keyframes oc-starTwinkle {
          0%,100% { opacity: 0.15; transform: scale(1); }
          50%     { opacity: 0.8;  transform: scale(1.4); }
        }
        @keyframes oc-gridPulse {
          0%,100% { opacity: 0.35; }
          50%     { opacity: 0.6; }
        }
        @keyframes oc-blob {
          0%,100% { transform: scale(1) translate(0,0); }
          50%     { transform: scale(1.1) translate(15px,-15px); }
        }
        @keyframes oc-nameShimmer {
          from { background-position: -200% center; }
          to   { background-position:  200% center; }
        }
        @keyframes oc-btnArrow {
          0%,100% { transform: translateX(0); }
          50%     { transform: translateX(-5px); }
        }

        .oc-btn {
          transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s ease;
        }
        .oc-btn:hover  { transform: translateY(-3px) scale(1.04) !important; }
        .oc-btn:active { transform: scale(0.97) !important; }

        .oc-skip {
          transition: color 0.18s ease, transform 0.18s ease;
        }
        .oc-skip:hover { color: rgba(255,255,255,0.5) !important; transform: translateY(-1px); }
      `}</style>

      {/* ── Ambient blobs ───────────────────────────────────── */}
      <div style={{ position:'absolute', inset:0, pointerEvents:'none', overflow:'hidden' }}>
        <div style={{
          position:'absolute', top:'-20%', right:'-15%',
          width:500, height:500, borderRadius:'50%',
          background:'radial-gradient(circle, rgba(52,211,153,0.12) 0%, transparent 65%)',
          filter:'blur(80px)', animation:'oc-blob 14s ease-in-out infinite',
        }}/>
        <div style={{
          position:'absolute', bottom:'-15%', left:'-10%',
          width:420, height:420, borderRadius:'50%',
          background:'radial-gradient(circle, rgba(167,139,250,0.12) 0%, transparent 65%)',
          filter:'blur(90px)', animation:'oc-blob 18s ease-in-out infinite reverse',
        }}/>
        {/* dot grid */}
        <div style={{
          position:'absolute', inset:0,
          backgroundImage:'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize:'28px 28px',
          animation:'oc-gridPulse 6s ease-in-out infinite',
        }}/>
        {/* stars */}
        {STARS.map(s => (
          <div key={s.id} style={{
            position:'absolute', top:s.top, left:s.left,
            width:s.size, height:s.size, borderRadius:'50%',
            background:'#fff',
            animation:`oc-starTwinkle ${s.dur}s ${s.delay}s ease-in-out infinite`,
          }}/>
        ))}
      </div>

      {/* ── Center stage ────────────────────────────────────── */}
      <div style={{ position:'relative', display:'flex', flexDirection:'column', alignItems:'center', width:'100%', padding:'0 24px' }}>

        {/* Expanding rings */}
        {[0,1,2].map(i => (
          <div key={i} style={{
            position:'absolute',
            width:100, height:100, borderRadius:'50%',
            border:'2px solid rgba(52,211,153,0.35)',
            animation:`oc-ring ${1.4 + i * 0.5}s ${i * 0.22}s cubic-bezier(0.22,1,0.36,1) both infinite`,
            pointerEvents:'none',
          }}/>
        ))}

        {/* Particles */}
        {PARTICLES.map(p => (
          <div key={p.id} style={{
            position:'absolute',
            width:p.size, height:p.size,
            borderRadius: p.isSquare ? '3px' : '50%',
            background:p.color,
            '--tx': `${p.tx}px`,
            '--ty': `${p.ty}px`,
            animation:`oc-burst ${p.dur}s ${p.delay}s cubic-bezier(0.22,1,0.36,1) both`,
            pointerEvents:'none',
          } as any}/>
        ))}

        {/* Checkmark circle */}
        <div style={{
          width:96, height:96, borderRadius:'50%',
          background:'linear-gradient(135deg, rgba(52,211,153,0.18), rgba(52,211,153,0.06))',
          border:'2px solid rgba(52,211,153,0.5)',
          display:'flex', alignItems:'center', justifyContent:'center',
          animation:'oc-circlePop 0.6s cubic-bezier(0.34,1.56,0.64,1) both, oc-glow 2.5s 0.8s ease-in-out infinite',
          marginBottom:28,
          position:'relative', zIndex:1,
        }}>
          <svg width="42" height="36" viewBox="0 0 42 36" fill="none">
            <path
              d="M4 18L16 30L38 4"
              stroke="#34d399"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="80"
              strokeDashoffset="0"
              style={{ animation:'oc-checkDraw 0.55s 0.3s cubic-bezier(0.22,1,0.36,1) both' }}
            />
          </svg>
        </div>

        {/* Text block */}
        <div style={{
          textAlign:'center', marginBottom:28,
          opacity: phase >= 1 ? 1 : 0,
          transition:'opacity 0.5s ease',
        }}>
          {/* Label */}
          <div style={{
            fontSize:11, fontWeight:700, letterSpacing:3,
            color:'rgba(52,211,153,0.7)', textTransform:'uppercase',
            marginBottom:10,
            animation: phase >= 1 ? 'oc-slideUp 0.5s ease both' : 'none',
          }}>
            ملفك الصحي جاهز ✦
          </div>

          {/* Name */}
          <h1 style={{
            fontSize:32, fontWeight:900, margin:'0 0 10px',
            background:'linear-gradient(90deg, #fff 0%, #a78bfa 40%, #34d399 70%, #fff 100%)',
            backgroundSize:'200% auto',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
            backgroundClip:'text',
            animation: phase >= 1
              ? 'oc-slideUp 0.55s 0.08s ease both, oc-nameShimmer 4s 1s linear infinite'
              : 'none',
          }}>
            {username} 👋
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize:14, color:'rgba(255,255,255,0.4)',
            margin:0, lineHeight:1.6, maxWidth:280,
            animation: phase >= 1 ? 'oc-slideUp 0.55s 0.16s ease both' : 'none',
          }}>
            أجبت على جميع الأسئلة وسيُكيَّف التطبيق<br/>بالكامل بناءً على ملفك الشخصي
          </p>
        </div>

        {/* Achievement badges */}
        <div style={{
          display:'grid', gridTemplateColumns:'1fr 1fr',
          gap:10, width:'100%', maxWidth:320,
          marginBottom:32,
        }}>
          {BADGES.map((b, i) => (
            <div key={b.icon} style={{
              background:'rgba(255,255,255,0.04)',
              border:'1px solid rgba(255,255,255,0.08)',
              borderRadius:16,
              padding:'14px 16px',
              display:'flex', alignItems:'center', gap:10,
              backdropFilter:'blur(12px)',
              opacity: phase >= 2 ? 1 : 0,
              animation: phase >= 2
                ? `oc-badgePop 0.5s ${i * 0.1}s cubic-bezier(0.34,1.56,0.64,1) both`
                : 'none',
            }}>
              <span style={{ fontSize:22, flexShrink:0 }}>{b.icon}</span>
              <span style={{
                fontSize:12, fontWeight:700,
                color:'rgba(255,255,255,0.65)', lineHeight:1.3,
              }}>{b.label}</span>
              <div style={{
                width:7, height:7, borderRadius:'50%',
                background:'#34d399',
                boxShadow:'0 0 8px #34d399',
                marginRight:'auto', flexShrink:0,
              }}/>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div style={{
          width:'100%', maxWidth:320,
          opacity: phase >= 3 ? 1 : 0,
          transform: phase >= 3 ? 'translateY(0)' : 'translateY(16px)',
          transition:'opacity 0.5s ease, transform 0.5s cubic-bezier(0.34,1.56,0.64,1)',
        }}>
          <button
            onClick={onEnter}
            className="oc-btn"
            style={{
              width:'100%',
              padding:'18px 24px',
              borderRadius:20, border:'none',
              background:'linear-gradient(135deg, #a78bfa, #7c3aed)',
              color:'#fff',
              fontSize:16, fontWeight:900,
              fontFamily:'inherit', letterSpacing:0.5,
              cursor:'pointer',
              display:'flex', alignItems:'center', justifyContent:'center', gap:10,
              animation: phase >= 3 ? 'oc-btnPulse 2.5s ease-in-out infinite' : 'none',
            }}
          >
            <span>ابدأ رحلتك الصحية</span>
            <span style={{ animation:'oc-btnArrow 1.2s ease-in-out infinite', display:'inline-block' }}>
              ←
            </span>
          </button>

          <button
            onClick={onEnter}
            className="oc-skip"
            style={{
              display:'block', margin:'14px auto 0',
              background:'none', border:'none',
              color:'rgba(255,255,255,0.2)', fontSize:12,
              fontFamily:'inherit', cursor:'pointer',
            }}
          >
            الدخول بدون مراجعة
          </button>
        </div>
      </div>
    </div>
  );
}
