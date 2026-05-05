import { storage } from '../lib/storage';
// src/pages/Home.tsx
import { useEffect, useRef, useState } from 'react';
import { Theme } from '../App';
import AIInsightCard from '../components/AIInsightCard';
import ProfileCard from '../components/ProfileCard';
import { useAuth } from '../context/AuthContext';

// ✅ أزلنا onEditProfile — زر التعديل أُنقل للإعدادات فقط
type Props = { theme?: Theme };

// ── ترجمة بيانات الاستبيان للعرض ─────────────────────────────
const GENDER_LABEL: Record<string, string>   = { male:'ذكر', female:'أنثى' };
const GOAL_LABEL:   Record<string, string>   = {
  medicines:'متابعة الأدوية', fitness:'اللياقة', weight:'الوزن',
  chronic:'الأمراض المزمنة', sleep:'النوم', general:'الصحة العامة',
};
const ACTIVITY_LABEL: Record<string, string> = {
  sedentary:'خامل', light:'خفيف', moderate:'معتدل', active:'نشيط', athlete:'رياضي',
};
const CHRONIC_LABEL: Record<string, string>  = {
  none:'بصحة جيدة', diabetes:'السكري', bp:'ضغط الدم',
  heart:'أمراض القلب', asthma:'الربو', kidney:'الكلى',
  thyroid:'الغدة الدرقية', other:'أمراض أخرى',
};

export default function Home({ theme }: Props) {
  const dark = theme === 'dark';
  const { user, displayName } = useAuth();
  const username = user?.username ?? '';

  const today       = new Date();
  const todayString = today.toDateString();
  const todayDate   = today.toLocaleDateString('ar-SY', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const [water,          setWater]         = useState(0);
  const [steps,          setSteps]         = useState(0);
  const [sleep,          setSleep]         = useState(0);
  const [mood,           setMood]          = useState(0);
  const [medicinesDone,  setMedicinesDone] = useState(0);
  const [medicinesTotal, setMedicinesTotal]= useState(0);
  const [pulse,          setPulse]         = useState(false);
  const [displayPct,     setDisplayPct]    = useState(0);

  // ── بيانات الاستبيان (خاصة بكل مستخدم) ────────────────────
  const [profileTags, setProfileTags] = useState<{ icon: string; text: string; color: string }[]>([]);

  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    setWater(Number(storage.get(`water_${todayString}`) || 0));
    setSteps(Number(storage.get(`steps_${todayString}`) || 0));
    setSleep(Number(storage.get(`sleep_${todayString}`) || 0));
    setMood (Number(storage.get(`mood_${todayString}`)  || 0));
    const meds = JSON.parse(storage.get('medicines') || '[]');
    setMedicinesTotal(meds.length);
    setMedicinesDone(meds.filter((m: any) => m.taken).length);
    setTimeout(() => setPulse(true), 200);

    // ── قراءة ملخص الاستبيان بمفتاح مخصص للمستخدم ──────────
    const pKey = (id: string) =>
      username ? `profile_${username}_${id}` : `profile_${id}`;

    const gender    = storage.get(pKey('gender'));
    const age       = storage.get(pKey('age'));
    const bloodType = storage.get(pKey('blood_type'));
    const activity  = storage.get(pKey('activity'));
    const chronic   = storage.get(pKey('chronic'));
    const goalRaw   = storage.get(pKey('health_goal'));

    const tags: { icon: string; text: string; color: string }[] = [];

    if (gender)
      tags.push({ icon: gender === 'female' ? '👩' : '👨', text: GENDER_LABEL[gender] ?? gender, color: '#6366f1' });
    if (age)
      tags.push({ icon: '🎂', text: age, color: '#f59e0b' });
    if (bloodType && bloodType !== 'unknown')
      tags.push({ icon: '🩸', text: bloodType, color: '#ef4444' });
    if (activity)
      tags.push({ icon: '⚡', text: ACTIVITY_LABEL[activity] ?? activity, color: '#f97316' });
    if (chronic)
      tags.push({ icon: '🏥', text: CHRONIC_LABEL[chronic] ?? chronic, color: '#14b8a6' });
    if (goalRaw)
      tags.push({ icon: '🎯', text: GOAL_LABEL[goalRaw] ?? goalRaw, color: '#8b5cf6' });

    setProfileTags(tags);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todayString, username]);

  const moodEmoji = ['😐', '😢', '😟', '😐', '😊', '😄'][mood] || '😐';
  const calories  = Math.round((steps / 1000) * 40);
  const progress = Math.round(
    ((water >= 8 ? 1 : 0) +
     (steps >= 10000 ? 1 : 0) +
     (sleep >= 7 ? 1 : 0) +
     (medicinesDone === medicinesTotal && medicinesTotal > 0 ? 1 : 0)) / 4 * 100
  );

  useEffect(() => {
    if (!pulse) return;
    const DURATION = 1600;
    const start    = performance.now();
    const easeOut  = (t: number) => 1 - Math.pow(1 - t, 3);
    const tick = (now: number) => {
      const t = Math.min((now - start) / DURATION, 1);
      setDisplayPct(Math.round(easeOut(t) * progress));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [pulse, progress]);

  const R      = 44;
  const CIRCUM = 2 * Math.PI * R;
  const dashOffset = CIRCUM - (progress / 100) * CIRCUM;

  const motivational =
    progress === 100 ? { emoji: '🏆', text: 'يوم مثالي! أنت رائع!',    color: '#d97706' }
    : progress >= 75 ? { emoji: '💪', text: 'أحسنت! تقريباً وصلت!',    color: dark ? '#34d399' : '#059669' }
    : progress >= 50 ? { emoji: '⚡', text: 'في المنتصف، استمر!',       color: dark ? '#818cf8' : '#4f46e5' }
    :                  { emoji: '🌱', text: 'ابدأ يومك بصحة!',           color: dark ? '#f472b6' : '#be185d' };

  const tips = [
    'اشرب كوب ماء قبل كل وجبة لتحسين الهضم 💧',
    'المشي ٣٠ دقيقة يومياً يحسن المزاج ويقلل التوتر 🚶',
    'النوم المبكر يقوي المناعة ويجدد الطاقة 😴',
    'الفطور الصحي يرفع تركيزك طوال اليوم ☀️',
    'التنفس العميق ١٠ مرات يقلل التوتر فوراً 🌬️',
  ];
  const todayTip = tips[today.getDate() % tips.length];

  // ── الألوان حسب الوضع ───────────────────────────────────────
  const pageBg           = dark ? '#08080f'                : '#f5f3ff';
  const headerGrad       = dark
    ? 'linear-gradient(160deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.1) 60%, transparent 100%)'
    : 'linear-gradient(160deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.08) 60%, transparent 100%)';
  const headerBord       = dark ? 'rgba(255,255,255,0.05)' : 'rgba(99,102,241,0.15)';
  const orbBg            = dark
    ? 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)'
    : 'radial-gradient(circle, rgba(99,102,241,0.2)  0%, transparent 70%)';
  const badgeBg          = dark ? 'rgba(129,140,248,0.1)'  : 'rgba(99,102,241,0.1)';
  const badgeBord        = dark ? 'rgba(129,140,248,0.2)'  : 'rgba(99,102,241,0.25)';
  const badgeText        = dark ? 'rgba(129,140,248,0.9)'  : '#4338ca';
  const titleColor       = dark ? 'white'                  : '#1e293b';
  const subText          = dark ? 'rgba(255,255,255,0.5)'  : '#64748b';
  const progressCardBg   = dark ? 'rgba(255,255,255,0.03)' : '#ffffff';
  const progressCardBord = dark ? 'rgba(255,255,255,0.07)' : 'rgba(99,102,241,0.12)';
  const topLine          = dark
    ? 'linear-gradient(90deg, transparent, rgba(129,140,248,0.5), rgba(34,211,238,0.4), transparent)'
    : 'linear-gradient(90deg, transparent, rgba(99,102,241,0.35), rgba(34,211,238,0.3), transparent)';
  const barTrack         = dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)';
  const barLabelDone     = (c: string) => c;
  const barLabelPend     = dark ? 'rgba(255,255,255,0.35)' : '#94a3b8';
  const barPctText       = dark ? 'rgba(255,255,255,0.25)' : '#94a3b8';
  const motivBg          = (c: string) => dark ? `${c}15` : `${c}18`;
  const motivBord        = (c: string) => dark ? `${c}28` : `${c}30`;
  const sectionLabel     = dark ? 'rgba(255,255,255,0.25)' : '#94a3b8';
  const ringTrack        = dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.07)';
  const ringPctText      = dark ? 'rgba(129,140,248,0.7)'  : '#6366f1';
  const ringValueClr     = dark ? 'white'                  : '#1e293b';
  const tipCardBg        = dark ? 'rgba(99,102,241,0.06)'  : 'rgba(99,102,241,0.06)';
  const tipCardBord      = dark ? 'rgba(99,102,241,0.15)'  : 'rgba(99,102,241,0.18)';
  const tipIconBg        = 'linear-gradient(135deg, #818cf8, #22d3ee)';
  const tipLabelColor    = dark ? 'rgba(129,140,248,0.9)'  : '#4338ca';
  const tipBodyColor     = dark ? 'rgba(203,213,225,0.75)' : '#475569';

  const cards = [
    { icon: '💊', label: 'الأدوية',  value: medicinesTotal === 0 ? '—' : `${medicinesDone}/${medicinesTotal}`, sub: 'جرعة اليوم',   color: '#818cf8', bg: dark ? 'rgba(129,140,248,0.08)' : 'rgba(99,102,241,0.07)',  border: dark ? 'rgba(129,140,248,0.2)' : 'rgba(99,102,241,0.2)'   },
    { icon: '💧', label: 'الماء',    value: `${water}/8`,                                                       sub: 'كوب',          color: dark ? '#22d3ee' : '#0891b2', bg: dark ? 'rgba(34,211,238,0.08)'  : 'rgba(8,145,178,0.07)',   border: dark ? 'rgba(34,211,238,0.2)'  : 'rgba(8,145,178,0.2)'    },
    { icon: '🚶', label: 'الخطوات', value: steps >= 1000 ? `${(steps / 1000).toFixed(1)}k` : `${steps}`,       sub: 'خطوة اليوم',  color: dark ? '#34d399' : '#059669', bg: dark ? 'rgba(52,211,153,0.08)'  : 'rgba(5,150,105,0.07)',   border: dark ? 'rgba(52,211,153,0.2)'  : 'rgba(5,150,105,0.2)'    },
    { icon: '😴', label: 'النوم',    value: sleep > 0 ? `${sleep}h` : '0h',                                    sub: 'ساعة نوم',     color: dark ? '#a78bfa' : '#7c3aed', bg: dark ? 'rgba(167,139,250,0.08)' : 'rgba(124,58,237,0.07)',  border: dark ? 'rgba(167,139,250,0.2)' : 'rgba(124,58,237,0.2)'   },
    { icon: '😊', label: 'المزاج',  value: mood > 0 ? moodEmoji : '—',                                        sub: 'حالتك الآن',   color: dark ? '#f472b6' : '#db2777', bg: dark ? 'rgba(244,114,182,0.08)' : 'rgba(219,39,119,0.07)',  border: dark ? 'rgba(244,114,182,0.2)' : 'rgba(219,39,119,0.2)'   },
    { icon: '🔥', label: 'السعرات', value: `${calories}`,                                                      sub: 'سعرة محروقة',  color: dark ? '#fb923c' : '#ea580c', bg: dark ? 'rgba(251,146,60,0.08)'  : 'rgba(234,88,12,0.07)',   border: dark ? 'rgba(251,146,60,0.2)'  : 'rgba(234,88,12,0.2)'    },
  ];
  const cardLabelColor = dark ? 'rgba(255,255,255,0.4)'  : '#6b7280';
  const cardSubColor   = dark ? 'rgba(255,255,255,0.25)' : '#94a3b8';

  const bars = [
    { label: 'الماء',    pct: Math.min((water / 8)    * 100, 100), done: water >= 8,     color: dark ? '#22d3ee' : '#0891b2' },
    { label: 'الخطوات', pct: Math.min((steps / 10000) * 100, 100), done: steps >= 10000, color: dark ? '#34d399' : '#059669' },
    { label: 'النوم',   pct: Math.min((sleep / 7)     * 100, 100), done: sleep >= 7,     color: dark ? '#a78bfa' : '#7c3aed' },
    { label: 'الدواء',  pct: medicinesTotal > 0 ? Math.min((medicinesDone / medicinesTotal) * 100, 100) : 0, done: medicinesDone === medicinesTotal && medicinesTotal > 0, color: dark ? '#818cf8' : '#4f46e5' },
  ];

  const cardHoverShadow = (border: string) =>
    dark ? `0 8px 28px ${border}` : `0 8px 20px ${border}`;

  return (
    <div className="min-h-screen pb-24 page-enter" dir="rtl"
      style={{ position: 'relative', zIndex: 1, background: pageBg, transition: 'background 0.4s' }}>

      {/* ── Header ── */}
      <div style={{
        padding: '2rem 1.25rem 1.5rem',
        background: headerGrad,
        borderBottom: `1px solid ${headerBord}`,
        position: 'relative', overflow: 'hidden',
      }}>
        <AIInsightCard page="home" theme={theme} />
        <div style={{
          position: 'absolute', top: '-60px', right: '-60px',
          width: '200px', height: '200px', borderRadius: '50%',
          background: orbBg, pointerEvents: 'none',
          animation: 'orb-drift 10s ease-in-out infinite',
        }} />

        {/* شريط التاريخ */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          background: badgeBg, border: `1px solid ${badgeBord}`,
          borderRadius: '20px', padding: '4px 12px', marginBottom: '14px',
        }}>
          <span style={{ fontSize: '11px', color: badgeText, fontWeight: 700, letterSpacing: '0.3px' }}>
            📅 {todayDate}
          </span>
        </div>

        <h1 style={{ fontSize: '26px', fontWeight: 900, color: titleColor, lineHeight: 1.25, marginBottom: '6px' }}>
          مرحباً {displayName || user?.username || 'صديقي'} 👋
        </h1>
        <p style={{ fontSize: '13px', color: subText, marginBottom: profileTags.length > 0 ? '12px' : 0 }}>
          {medicinesTotal > 0 && medicinesDone === medicinesTotal
            ? '✅ أخذت كل أدويتك اليوم!'
            : '💊 لا تنسَ أدويتك اليوم'}
        </p>

        {/* ── ملخص الاستبيان — وصف المستخدم الصحي ── */}
        {profileTags.length > 0 && (
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: '6px',
            marginTop: '4px',
          }}>
            {profileTags.map((tag, i) => (
              <div key={i} style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px',
                padding: '4px 10px',
                borderRadius: '14px',
                background: dark ? `${tag.color}18` : `${tag.color}14`,
                border: `1px solid ${tag.color}33`,
                fontSize: '11px', fontWeight: 700,
                color: dark ? `${tag.color}` : tag.color,
              }}>
                <span>{tag.icon}</span>
                <span style={{ color: dark ? 'rgba(255,255,255,0.8)' : '#334155' }}>{tag.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Content ── */}
      <div style={{ padding: '1.25rem' }}>

        {/* بطاقة الملف الشخصي (تفاصيل الاستبيان الكاملة) */}
        <ProfileCard theme={theme} />

        {/* Progress ring card */}
        <div style={{
          background: progressCardBg,
          border: `1px solid ${progressCardBord}`,
          borderRadius: '24px', padding: '1.25rem',
          marginBottom: '1rem', position: 'relative', overflow: 'hidden',
          boxShadow: dark ? 'none' : '0 2px 20px rgba(99,102,241,0.08)',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px',
            background: topLine,
          }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            {/* Ring */}
            <div style={{ position: 'relative', width: '100px', height: '100px', flexShrink: 0 }}>
              <svg width="100" height="100" style={{ transform: 'rotate(-90deg)' }}>
                <defs>
                  <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%"   stopColor={dark ? '#818cf8' : '#6366f1'} />
                    <stop offset="100%" stopColor={dark ? '#22d3ee' : '#0891b2'} />
                  </linearGradient>
                </defs>
                <circle cx="50" cy="50" r={R} fill="none" stroke={ringTrack} strokeWidth="8" />
                <circle cx="50" cy="50" r={R} fill="none"
                  stroke="url(#ringGrad)" strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={CIRCUM}
                  strokeDashoffset={pulse ? dashOffset : CIRCUM}
                  style={{ transition: 'stroke-dashoffset 1.6s cubic-bezier(0.34,1.56,0.64,1)', filter: `drop-shadow(0 0 6px ${dark ? 'rgba(129,140,248,0.7)' : 'rgba(99,102,241,0.5)'})` }}
                />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '20px', fontWeight: 900, color: ringValueClr, lineHeight: 1 }}>{displayPct}%</span>
                <span style={{ fontSize: '9px', color: ringPctText, marginTop: '2px' }}>إنجازك</span>
              </div>
            </div>
            {/* Bars */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', minWidth: 0 }}>
              {bars.map((b, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '10px', fontWeight: 700, color: b.done ? barLabelDone(b.color) : barLabelPend }}>
                      {b.done ? '✓' : '○'} {b.label}
                    </span>
                    <span style={{ fontSize: '10px', color: barPctText }}>{Math.round(b.pct)}%</span>
                  </div>
                  <div style={{ height: '5px', borderRadius: '10px', background: barTrack, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: '10px',
                      width: `${pulse ? Math.max(b.pct, b.pct > 0 ? 4 : 0) : 0}%`,
                      background: `linear-gradient(90deg, ${b.color}88, ${b.color})`,
                      boxShadow: b.pct > 0 ? `0 0 8px ${b.color}99` : 'none',
                      transition: `width 1.4s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.1}s`,
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{
            marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            background: motivBg(motivational.color), border: `1px solid ${motivBord(motivational.color)}`,
            borderRadius: '14px', padding: '8px 14px',
          }}>
            <span style={{ fontSize: '18px' }}>{motivational.emoji}</span>
            <span style={{ fontSize: '13px', fontWeight: 700, color: motivational.color }}>{motivational.text}</span>
          </div>
        </div>

        {/* Section label */}
        <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', color: sectionLabel, marginBottom: '10px', textTransform: 'uppercase' }}>
          إحصائيات اليوم
        </p>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '1rem' }}>
          {cards.map((card, i) => (
            <div key={i}
              style={{
                background: card.bg, border: `1px solid ${card.border}`,
                borderRadius: '20px', padding: '1rem',
                display: 'flex', alignItems: 'center', gap: '12px',
                position: 'relative', overflow: 'hidden',
                transition: 'all 0.25s ease', animationDelay: `${i * 0.06}s`,
                boxShadow: dark ? 'none' : '0 1px 8px rgba(0,0,0,0.04)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = cardHoverShadow(card.border);
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.transform = '';
                (e.currentTarget as HTMLDivElement).style.boxShadow = dark ? '' : '0 1px 8px rgba(0,0,0,0.04)';
              }}
            >
              <div style={{
                width: '46px', height: '46px', borderRadius: '14px', flexShrink: 0,
                background: `${card.color}15`, border: `1px solid ${card.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px',
              }}>
                {card.icon}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '11px', color: cardLabelColor, marginBottom: '2px' }}>{card.label}</div>
                <div style={{ fontSize: '20px', fontWeight: 900, color: card.color, lineHeight: 1 }}>{card.value}</div>
                <div style={{ fontSize: '10px', color: cardSubColor, marginTop: '2px' }}>{card.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Daily tip */}
        <div style={{
          background: tipCardBg, border: `1px solid ${tipCardBord}`,
          borderRadius: '20px', padding: '1.1rem 1.2rem',
          display: 'flex', gap: '12px', alignItems: 'flex-start',
        }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '12px', flexShrink: 0,
            background: tipIconBg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '17px', boxShadow: '0 0 16px rgba(99,102,241,0.4)',
          }}>
            💡
          </div>
          <div>
            <p style={{ fontSize: '11px', fontWeight: 800, color: tipLabelColor, marginBottom: '5px', letterSpacing: '0.3px' }}>
              نصيحة اليوم
            </p>
            <p style={{ fontSize: '13px', color: tipBodyColor, lineHeight: 1.7 }}>{todayTip}</p>
          </div>
        </div>

      </div>
    </div>
  );
}

