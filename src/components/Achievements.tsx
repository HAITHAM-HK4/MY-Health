import { storage } from '../lib/storage';
import { useEffect, useState } from 'react';
import { Theme } from '../App';
import AIInsightCard from './AIInsightCard';

type Achievement = {
  id: string;
  icon: string;
  title: string;
  desc: string;
  unlocked: boolean;
  points: number;
  color: string;
};

type Props = { theme?: Theme };

export default function Achievements({ theme }: Props) {
  const dark = theme === 'dark';

  const [points, setPoints]             = useState(0);
  const [displayPts, setDisplayPts]     = useState(0);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [ready, setReady]               = useState(false);

  useEffect(() => {
    const today    = new Date().toDateString();
    const water    = Number(storage.get(`water_${today}`) || 0);
    const steps    = Number(storage.get(`steps_${today}`) || 0);
    const sleep    = Number(storage.get(`sleep_${today}`) || 0);
    const meds     = JSON.parse(storage.get('medicines') || '[]');
    const allTaken = meds.length > 0 && meds.every((m: any) => m.taken);
    const bp       = JSON.parse(storage.get('bp_readings') || '[]');
    const sugar    = JSON.parse(storage.get('sugar_readings') || '[]');

    const list: Achievement[] = [
      { id: 'water8',   icon: '💧', title: 'شارب الماء',    desc: 'اشرب 8 أكواب في يوم',    unlocked: water >= 8,                                              points: 100, color: '#22d3ee' },
      { id: 'steps10k', icon: '🚶', title: 'المشي البطل',   desc: 'امشِ 10,000 خطوة',        unlocked: steps >= 10000,                                          points: 150, color: '#34d399' },
      { id: 'sleep8',   icon: '😴', title: 'النوم الجيد',   desc: 'نم 8 ساعات كاملة',        unlocked: sleep >= 8,                                              points: 100, color: '#a78bfa' },
      { id: 'meds',     icon: '💊', title: 'ملتزم بالدواء', desc: 'خذ كل أدويتك في يوم',     unlocked: allTaken,                                                points: 100, color: '#818cf8' },
      { id: 'bp',       icon: '🫀', title: 'متابع الضغط',   desc: 'سجّل قراءة ضغط دم',       unlocked: bp.length > 0,                                           points: 80,  color: '#f87171' },
      { id: 'sugar',    icon: '🩸', title: 'متابع السكر',   desc: 'سجّل قراءة سكر',          unlocked: sugar.length > 0,                                        points: 80,  color: '#fb923c' },
      { id: 'perfect',  icon: '🏆', title: 'يوم مثالي',     desc: 'ماء + مشي + نوم + دواء',  unlocked: water >= 8 && steps >= 10000 && sleep >= 7 && allTaken, points: 300, color: '#fbbf24' },
      { id: 'meds3',    icon: '📋', title: 'منظم الصحة',    desc: 'أضف 3 أدوية أو أكثر',     unlocked: meds.length >= 3,                                        points: 80,  color: '#f472b6' },
    ];

    const total = list.filter(a => a.unlocked).reduce((s, a) => s + a.points, 0);
    setPoints(total);
    setAchievements(list);
    setTimeout(() => setReady(true), 200);
  }, []);

  useEffect(() => {
    if (!ready || points === 0) return;
    const dur   = 1400;
    const start = performance.now();
    const tick  = (now: number) => {
      const t    = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setDisplayPts(Math.round(ease * points));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [ready, points]);

  const unlocked = achievements.filter(a => a.unlocked);
  const locked   = achievements.filter(a => !a.unlocked);
  const totalPts = achievements.reduce((s, a) => s + a.points, 0);
  const pct      = totalPts > 0 ? Math.round((points / totalPts) * 100) : 0;

  /* ── ألوان الوضعين ── */
  const pageBg      = dark ? '#08080f'                : '#fffbeb';
  const titleColor  = dark ? 'white'                  : '#1e293b';
  const textMuted   = dark ? 'rgba(255,255,255,0.4)'  : '#6b7280';
  const labelBg     = dark ? 'rgba(251,191,36,0.1)'   : 'rgba(251,191,36,0.12)';
  const labelBord   = dark ? 'rgba(251,191,36,0.22)'  : 'rgba(251,191,36,0.35)';
  const labelText   = dark ? 'rgba(251,191,36,0.95)'  : '#92400e';
  const headerBg    = dark
    ? 'linear-gradient(160deg, rgba(251,191,36,0.12) 0%, rgba(251,146,60,0.08) 60%, transparent 100%)'
    : 'linear-gradient(160deg, rgba(251,191,36,0.15) 0%, rgba(251,146,60,0.08) 60%, transparent 100%)';
  const headerBord  = dark ? 'rgba(255,255,255,0.05)' : 'rgba(251,191,36,0.18)';
  const ptsBg       = dark ? 'rgba(255,255,255,0.03)' : '#ffffff';
  const ptsBord     = dark ? 'rgba(251,191,36,0.18)'  : 'rgba(251,191,36,0.25)';
  const ptsShadow   = dark ? 'none'                   : '0 2px 20px rgba(251,191,36,0.1)';
  const ptsColor    = dark ? '#fbbf24'                : '#d97706';
  const ptsMuted    = dark ? 'rgba(255,255,255,0.4)'  : '#92400e';
  const ptsTrack    = dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)';
  const ptsPct      = dark ? 'rgba(251,191,36,0.6)'   : '#b45309';
  const unlockedLbl = dark ? 'rgba(255,255,255,0.25)' : '#94a3b8';
  const lockedLbl   = dark ? 'rgba(255,255,255,0.18)' : '#cbd5e1';
  const lockedCardBg= dark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)';
  const lockedBord  = dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)';
  const lockedTitle = dark ? 'rgba(255,255,255,0.5)'  : '#94a3b8';
  const lockedDesc  = dark ? 'rgba(255,255,255,0.25)' : '#cbd5e1';
  const lockedPts   = dark ? 'rgba(255,255,255,0.2)'  : '#94a3b8';
  const emptyIcBg   = dark ? 'rgba(251,191,36,0.08)'  : 'rgba(251,191,36,0.1)';
  const emptyIcBrd  = dark ? 'rgba(251,191,36,0.15)'  : 'rgba(251,191,36,0.25)';
  const unlockedDesc= dark ? 'rgba(255,255,255,0.35)' : '#6b7280';
  const unlockedTitle2 = dark ? 'rgba(255,255,255,0.85)': '#1e293b';

  return (
    <div className="min-h-screen pb-24 page-enter" dir="rtl"
      style={{ position: 'relative', zIndex: 1, background: pageBg, transition: 'background 0.4s' }}>

      {/* HEADER */}
      <div style={{
        padding: '2rem 1.25rem 1.5rem',
        background: headerBg, borderBottom: `1px solid ${headerBord}`,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-50px', right: '-50px',
          width: '180px', height: '180px', borderRadius: '50%',
          background: dark
            ? 'radial-gradient(circle, rgba(251,191,36,0.2) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(251,191,36,0.28) 0%, transparent 70%)',
          pointerEvents: 'none', animation: 'orb-drift 10s ease-in-out infinite',
        }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: labelBg, border: `1px solid ${labelBord}`,
            borderRadius: '20px', padding: '4px 12px', marginBottom: '12px',
          }}>
            <span style={{ fontSize: '11px', color: labelText, fontWeight: 700 }}>🏆 تقدمك في الإنجازات</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 900, color: titleColor, lineHeight: 1.2, marginBottom: '6px' }}>
            الإنجازات
          </h1>
          <p style={{ fontSize: '13px', color: textMuted }}>
            {unlocked.length} من {achievements.length} إنجاز مفتوح
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ padding: '1.25rem' }}>

        {/* بطاقة تحليل الذكاء الاصطناعي */}
        <AIInsightCard page="achievements" theme={theme} />

        {/* بطاقة النقاط */}
        <div style={{
          background: ptsBg, border: `1px solid ${ptsBord}`,
          borderRadius: '24px', padding: '1.5rem', marginBottom: '1.25rem',
          position: 'relative', overflow: 'hidden', textAlign: 'center',
          boxShadow: ptsShadow,
        }}>
          <div style={{
            position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px',
            background: `linear-gradient(90deg, transparent, rgba(251,191,36,${dark ? '0.6' : '0.5'}), transparent)`,
          }} />
          <div style={{
            position: 'absolute', bottom: '-40px', left: '50%', transform: 'translateX(-50%)',
            width: '140px', height: '140px', borderRadius: '50%',
            background: `radial-gradient(circle, rgba(251,191,36,${dark ? '0.12' : '0.08'}) 0%, transparent 70%)`,
            pointerEvents: 'none',
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              fontSize: '48px', fontWeight: 900, color: ptsColor,
              textShadow: dark ? '0 0 30px rgba(251,191,36,0.5)' : '0 2px 8px rgba(251,191,36,0.3)',
              fontVariantNumeric: 'tabular-nums', lineHeight: 1, marginBottom: '4px',
            }}>
              {displayPts.toLocaleString()}
            </div>
            <div style={{ fontSize: '13px', color: ptsMuted, marginBottom: '16px' }}>
              نقطة من أصل {totalPts.toLocaleString()}
            </div>
            <div style={{ height: '6px', borderRadius: '10px', background: ptsTrack, overflow: 'hidden', marginBottom: '8px' }}>
              <div style={{
                height: '100%', borderRadius: '10px',
                width: ready ? `${pct}%` : '0%',
                background: 'linear-gradient(90deg, #f59e0b, #fbbf24, #fde68a)',
                boxShadow: dark ? '0 0 10px rgba(251,191,36,0.6)' : '0 0 8px rgba(251,191,36,0.4)',
                transition: 'width 1.4s cubic-bezier(0.34,1.56,0.64,1)',
              }} />
            </div>
            <div style={{ fontSize: '11px', color: ptsPct, fontWeight: 700 }}>{pct}% مكتمل</div>
          </div>
        </div>

        {/* الإنجازات المفتوحة */}
        {unlocked.length > 0 && (
          <>
            <p style={{
              fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px',
              color: unlockedLbl, marginBottom: '10px',
            }}>✅ إنجازاتك المفتوحة</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '10px', marginBottom: '20px' }}>
              {unlocked.map((a, i) => (
                <div key={a.id} className="page-enter" style={{
                  background: `${a.color}0D`, border: `1px solid ${a.color}28`,
                  borderRadius: '18px', padding: '14px 12px', textAlign: 'center',
                  position: 'relative', overflow: 'hidden', animationDelay: `${i * 0.07}s`,
                  boxShadow: dark ? 'none' : `0 2px 12px ${a.color}15`,
                }}>
                  <div style={{
                    position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px',
                    background: `linear-gradient(90deg, transparent, ${a.color}50, transparent)`,
                  }} />
                  <div style={{ fontSize: '30px', marginBottom: '8px', lineHeight: 1 }}>{a.icon}</div>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: unlockedTitle2, marginBottom: '4px' }}>{a.title}</div>
                  <div style={{ fontSize: '10px', color: unlockedDesc, marginBottom: '8px', lineHeight: 1.4 }}>{a.desc}</div>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '3px',
                    background: `${a.color}15`, border: `1px solid ${a.color}30`,
                    borderRadius: '20px', padding: '3px 10px',
                  }}>
                    <span style={{ fontSize: '10px', fontWeight: 800, color: a.color }}>+{a.points}</span>
                    <span style={{ fontSize: '9px', color: `${a.color}80` }}>نقطة</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* الإنجازات المقفلة */}
        {locked.length > 0 && (
          <>
            <p style={{
              fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px',
              color: lockedLbl, marginBottom: '10px',
            }}>🔒 إنجازات قادمة</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '10px' }}>
              {locked.map(a => (
                <div key={a.id} style={{
                  background: lockedCardBg, border: `1px solid ${lockedBord}`,
                  borderRadius: '18px', padding: '14px 12px', textAlign: 'center', opacity: 0.55,
                }}>
                  <div style={{ fontSize: '28px', marginBottom: '8px', lineHeight: 1, filter: 'grayscale(1)' }}>{a.icon}</div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: lockedTitle, marginBottom: '4px' }}>{a.title}</div>
                  <div style={{ fontSize: '10px', color: lockedDesc, lineHeight: 1.4, marginBottom: '8px' }}>{a.desc}</div>
                  <div style={{ fontSize: '10px', color: lockedPts, fontWeight: 600 }}>{a.points} نقطة</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* empty state */}
        {achievements.length === 0 && (
          <div style={{
            textAlign: 'center', marginTop: '80px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
          }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '24px',
              background: emptyIcBg, border: `1px solid ${emptyIcBrd}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px',
            }}>🏆</div>
            <p style={{ color: textMuted, fontSize: '15px' }}>لا توجد إنجازات بعد</p>
            <p style={{ color: textMuted, fontSize: '12px', opacity: 0.6 }}>سجّل نشاطك اليومي لفتح الإنجازات</p>
          </div>
        )}
      </div>
    </div>
  );
}

