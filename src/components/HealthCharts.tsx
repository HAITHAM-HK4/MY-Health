import { storage } from '../lib/storage';
// src/components/HealthCharts.tsx  — v2.0
import { useEffect, useState, useMemo } from 'react';

type Metric = 'water' | 'steps' | 'sleep' | 'mood';

type DayData = {
  day: string;
  date: string;
  water: number;
  steps: number;
  sleep: number;
  mood: number;
};

type ChartConfig = {
  label: string;
  icon: string;
  max: number;
  unit: string;
  gradient: string;
  glow: string;
  tip: (val: number) => string;
};

const CONFIG: Record<Metric, ChartConfig> = {
  water: {
    label: 'الماء',
    icon: '💧',
    max: 8,
    unit: 'أكواب',
    gradient: 'from-cyan-400 to-blue-500',
    glow: 'rgba(34,211,238,0.5)',
    tip: (v) =>
      v === 0 ? 'لا توجد بيانات' : v >= 8 ? '🎉 ممتاز! هدفك مكتمل' : `${8 - v} أكواب متبقية`,
  },
  steps: {
    label: 'الخطوات',
    icon: '🚶',
    max: 10000,
    unit: 'خطوة',
    gradient: 'from-emerald-400 to-green-500',
    glow: 'rgba(52,211,153,0.5)',
    tip: (v) =>
      v === 0 ? 'لا توجد بيانات' : v >= 10000 ? '🏆 هدف الخطوات مكتمل!' : `${(10000 - v).toLocaleString('ar')} خطوة متبقية`,
  },
  sleep: {
    label: 'النوم',
    icon: '😴',
    max: 10,
    unit: 'ساعة',
    gradient: 'from-violet-400 to-purple-600',
    glow: 'rgba(167,139,250,0.5)',
    tip: (v) =>
      v === 0 ? 'لا توجد بيانات' : v >= 7 ? '✨ نوم صحي ممتاز' : 'حاول النوم مبكراً أكثر',
  },
  mood: {
    label: 'المزاج',
    icon: '😊',
    max: 5,
    unit: '/ 5',
    gradient: 'from-amber-400 to-orange-500',
    glow: 'rgba(251,191,36,0.5)',
    tip: (v) =>
      v === 0 ? 'لا توجد بيانات' : v >= 4 ? '😄 يوم رائع!' : v >= 3 ? '🙂 مزاج عادي' : '💙 ارتاح واهتم بنفسك',
  },
};

const MOOD_EMOJI: Record<number, string> = { 1: '😞', 2: '😕', 3: '😐', 4: '🙂', 5: '😄' };

export default function HealthCharts() {
  const [data, setData] = useState<DayData[]>([]);
  const [active, setActive] = useState<Metric>('water');
  const [tooltip, setTooltip] = useState<{ index: number; visible: boolean }>({
    index: -1,
    visible: false,
  });

  useEffect(() => {
    const last7: DayData[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toDateString();
      const dayName = d.toLocaleDateString('ar-SA', { weekday: 'short' });
      last7.push({
        day: dayName,
        date: key,
        water: Number(storage.get(`water_${key}`) || 0),
        steps: Number(storage.get(`steps_${key}`) || 0),
        sleep: Number(storage.get(`sleep_${key}`) || 0),
        mood:  Number(storage.get(`mood_${key}`) || 0),
      });
    }
    setData(last7);
  }, []);

  const cfg = CONFIG[active];

  const stats = useMemo(() => {
    const vals = data.map((d) => d[active]).filter((v) => v > 0);
    if (!vals.length) return { avg: 0, max: 0, total: 0 };
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
    const max = Math.max(...vals);
    const total = vals.reduce((a, b) => a + b, 0);
    return { avg, max, total };
  }, [data, active]);

  const todayVal = data[data.length - 1]?.[active] ?? 0;
  const todayPct = cfg.max > 0 ? Math.min((todayVal / cfg.max) * 100, 100) : 0;

  return (
    <div
      className="rounded-2xl p-4 mb-3"
      dir="rtl"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-white text-base flex items-center gap-2">
          <span
            className="w-8 h-8 rounded-xl flex items-center justify-center text-sm"
            style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)' }}
          >
            📈
          </span>
          آخر 7 أيام
        </h2>
        <span className="text-xs text-gray-400">v2.0</span>
      </div>

      {/* ── Metric Tabs ── */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {(Object.keys(CONFIG) as Metric[]).map((key) => {
          const c = CONFIG[key];
          const isActive = active === key;
          return (
            <button
              key={key}
              onClick={() => { setActive(key); setTooltip({ index: -1, visible: false }); }}
              className="flex items-center gap-.0 px-3 py-2.0 rounded-xl text-xs font-semibold whitespace-nowrap transition-all"
              style={
                isActive
                  ? {
                      background: `linear-gradient(135deg, var(--tw-gradient-from, #22d3ee), var(--tw-gradient-to, #3b82f6))`,
                      backgroundImage: `linear-gradient(135deg, ${c.glow.replace('0.5', '0.9')}, ${c.glow})`,
                      color: '#fff',
                      boxShadow: `0 0 14px ${c.glow}`,
                    }
                  : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }
              }
            >
              <span>{c.icon}</span>
              <span>{c.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Today's Ring ── */}
      <div
        className="flex items-center gap-4 rounded-xl p-3 mb-5"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        {/* Ring */}
        <div className="relative w-14 h-14 flex-shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 56 56">
            <circle cx="28" cy="28" r="22" fill="none" strokeWidth="5" stroke="rgba(255,255,255,0.08)" />
            <circle
              cx="28" cy="28" r="22" fill="none" strokeWidth="5"
              stroke={cfg.glow.replace('0.5', '0.9')}
              strokeDasharray={`${2 * Math.PI * 22}`}
              strokeDashoffset={`${2 * Math.PI * 22 * (1 - todayPct / 100)}`}
              strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 6px ${cfg.glow})`, transition: 'stroke-dashoffset 0.8s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg">{cfg.icon}</span>
          </div>
        </div>
        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-400 mb-0.5">اليوم</p>
          <p className="text-white font-bold text-lg leading-none">
            {active === 'mood' && todayVal > 0
              ? `${MOOD_EMOJI[todayVal]} ${todayVal}`
              : todayVal > 0
              ? (active === 'steps' ? todayVal.toLocaleString('ar') : todayVal)
              : '—'}
            <span className="text-xs font-normal text-gray-400 mr-1">{todayVal > 0 ? cfg.unit : ''}</span>
          </p>
          <p className="text-xs mt-1" style={{ color: cfg.glow.replace('0.5', '1') }}>
            {cfg.tip(todayVal)}
          </p>
        </div>
        {/* Percent */}
        {todayVal > 0 && (
          <div className="text-right flex-shrink-0">
            <p className="text-2xl font-black" style={{ color: cfg.glow.replace('0.5', '1') }}>
              {Math.round(todayPct)}%
            </p>
            <p className="text-xs text-gray-500">من الهدف</p>
          </div>
        )}
      </div>

      {/* ── Bar Chart ── */}
      <div className="flex items-end justify-between gap-1 mb-3" style={{ height: '100px' }}>
        {data.map((d, i) => {
          const val = d[active];
          const heightPct = cfg.max > 0 ? Math.max((val / cfg.max) * 100, val > 0 ? 6 : 0) : 0;
          const isToday = i === data.length - 1;
          const isHovered = tooltip.index === i && tooltip.visible;

          return (
            <div
              key={i}
              className="flex flex-col items-center flex-1 gap-1 cursor-pointer"
              onMouseEnter={() => setTooltip({ index: i, visible: true })}
              onMouseLeave={() => setTooltip({ index: -1, visible: false })}
              onTouchStart={() => setTooltip({ index: i, visible: true })}
              onTouchEnd={() => setTimeout(() => setTooltip({ index: -1, visible: false }), 1200)}
            >
              {/* Tooltip */}


<div
  className="text-xs font-bold transition-all duration-200"
  style={{
    color: isHovered || isToday ? '#111827' : 'transparent',  // <-- تغير هنا
    fontSize: '10px',
    minHeight: '14px',
  }}
>
                {val > 0
                  ? active === 'mood'
                    ? MOOD_EMOJI[val]
                    : active === 'steps'
                    ? (val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val)
                    : val
                  : ''}
              </div>

              {/* Bar */}
              <div className="w-full flex items-end" style={{ height: '68px' }}>
                <div
                  className="w-full rounded-t-lg transition-all duration-500"
                  style={{
                    height: `${heightPct}%`,
                    background:
                      val > 0
                        ? `linear-gradient(to top, ${cfg.glow.replace('0.5', '0.6')}, ${cfg.glow.replace('0.5', '1')})`
                        : 'rgba(255,255,255,0.06)',
                    boxShadow: isToday && val > 0 ? `0 0 10px ${cfg.glow}` : 'none',
                    border: isToday ? `1px solid ${cfg.glow.replace('0.5', '0.4')}` : '1px solid transparent',
                  }}
                />
              </div>

              {/* Day label */}
              <p
                className="text-center font-medium"
                style={{
                  fontSize: '10px',
                  color: isToday ? cfg.glow.replace('0.5', '1') : 'rgba(255,255,255,0.35)',
                }}
              >
                {isToday ? 'اليوم' : d.day}
              </p>
            </div>
          );
        })}
      </div>

      {/* ── Weekly Stats ── */}
      {stats.avg > 0 && (
        <div
          className="grid grid-cols-3 gap-2 rounded-xl p-3"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          {[
            {
              label: 'المتوسط',
              value:
                active === 'steps'
                  ? stats.avg >= 1000
                    ? `${(stats.avg / 1000).toFixed(1)}k`
                    : Math.round(stats.avg).toString()
                  : stats.avg % 1 === 0
                  ? stats.avg.toString()
                  : stats.avg.toFixed(1),
            },
            {
              label: 'الأعلى',
              value:
                active === 'steps'
                  ? stats.max >= 1000
                    ? `${(stats.max / 1000).toFixed(1)}k`
                    : stats.max.toString()
                  : stats.max.toString(),
            },
            {
              label: 'الإجمالي',
              value:
                active === 'steps'
                  ? stats.total >= 1000
                    ? `${(stats.total / 1000).toFixed(0)}k`
                    : stats.total.toString()
                  : active === 'mood'
                  ? `${stats.avg.toFixed(1)}/5`
                  : stats.total.toString(),
            },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-xs text-gray-500 mb-0.5">{s.label}</p>
              <p className="font-bold text-sm" style={{ color: cfg.glow.replace('0.5', '1') }}>
                {s.value}
              </p>
              <p className="text-gray-600" style={{ fontSize: '9px' }}>{cfg.unit}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
