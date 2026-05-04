import { storage } from '../lib/storage';
// src/components/OnboardingQuiz.tsx
import { useState } from 'react';
import OnboardingComplete from './OnboardingComplete';

type Props = {
  username?: string;
  onFinish: (data: Record<string, string>) => void;
  onSkip?:  () => void;
};

type Question = {
  id: string;
  question: string;
  subtitle?: string;
  icon: string;
  cols?: number;
  options: { label: string; value: string; emoji: string }[];
};

const QUESTIONS: Question[] = [
  {
    id: 'gender', question: 'ما جنسك؟', subtitle: 'لتخصيص توصياتك الصحية', icon: '👤', cols: 1,
    options: [
      { label: 'ذكر',  value: 'male',   emoji: '👨' },
      { label: 'أنثى', value: 'female', emoji: '👩' },
    ],
  },
  {
    id: 'age', question: 'كم عمرك؟', subtitle: 'العمر يؤثر على احتياجاتك الغذائية والرياضية', icon: '🎂', cols: 2,
    options: [
      { label: 'أقل من 13', value: '<13',   emoji: '🧒' },
      { label: '13 – 17',   value: '13-17', emoji: '👦' },
      { label: '18 – 24',   value: '18-24', emoji: '🧑' },
      { label: '25 – 34',   value: '25-34', emoji: '👨' },
      { label: '35 – 44',   value: '35-44', emoji: '🧔' },
      { label: '45 – 54',   value: '45-54', emoji: '👴' },
      { label: '55 – 64',   value: '55-64', emoji: '🧓' },
      { label: '65 فأكثر',  value: '65+',   emoji: '👵' },
    ],
  },
  {
    id: 'height', question: 'ما طولك؟', subtitle: 'يُستخدم لحساب مؤشر كتلة الجسم', icon: '📏', cols: 2,
    options: [
      { label: 'أقل من 150 سم', value: '<150',    emoji: '🔹' },
      { label: '150 – 159 سم',  value: '150-159', emoji: '🔸' },
      { label: '160 – 169 سم',  value: '160-169', emoji: '🟡' },
      { label: '170 – 179 سم',  value: '170-179', emoji: '🟠' },
      { label: '180 – 189 سم',  value: '180-189', emoji: '🔴' },
      { label: '190 سم فأكثر',  value: '190+',    emoji: '⬆️' },
    ],
  },
  {
    id: 'weight', question: 'ما وزنك التقريبي؟', subtitle: 'معلوماتك خاصة وآمنة تماماً', icon: '⚖️', cols: 2,
    options: [
      { label: 'أقل من 50 كغ', value: '<50',    emoji: '🪶' },
      { label: '50 – 64 كغ',   value: '50-64',  emoji: '✅' },
      { label: '65 – 79 كغ',   value: '65-79',  emoji: '💪' },
      { label: '80 – 94 كغ',   value: '80-94',  emoji: '🟡' },
      { label: '95 – 109 كغ',  value: '95-109', emoji: '🟠' },
      { label: '110 كغ فأكثر', value: '110+',   emoji: '🔴' },
    ],
  },
  {
    id: 'blood_type', question: 'ما فصيلة دمك؟', subtitle: 'مهمة لحالات الطوارئ الطبية', icon: '🩸', cols: 3,
    options: [
      { label: 'A+',       value: 'A+',      emoji: '🅰️' },
      { label: 'A−',       value: 'A-',      emoji: '🅰️' },
      { label: 'B+',       value: 'B+',      emoji: '🅱️' },
      { label: 'B−',       value: 'B-',      emoji: '🅱️' },
      { label: 'AB+',      value: 'AB+',     emoji: '🆎' },
      { label: 'AB−',      value: 'AB-',     emoji: '🆎' },
      { label: 'O+',       value: 'O+',      emoji: '🅾️' },
      { label: 'O−',       value: 'O-',      emoji: '🅾️' },
      { label: 'لا أعرف', value: 'unknown', emoji: '❓' },
    ],
  },
  {
    id: 'marital', question: 'ما حالتك الاجتماعية؟', subtitle: 'تؤثر على توصيات الصحة النفسية', icon: '💍', cols: 2,
    options: [
      { label: 'أعزب',  value: 'single',   emoji: '🧍' },
      { label: 'متزوج', value: 'married',  emoji: '👫' },
      { label: 'مطلق',  value: 'divorced', emoji: '💔' },
      { label: 'أرمل',  value: 'widowed',  emoji: '🕊️' },
    ],
  },
  {
    id: 'health_goal', question: 'ما هدفك الصحي؟', subtitle: 'سنركز على ما يهمك أكثر', icon: '🎯', cols: 2,
    options: [
      { label: 'تتبع الأدوية',           value: 'medicines', emoji: '💊' },
      { label: 'تحسين اللياقة',          value: 'fitness',   emoji: '🏃' },
      { label: 'إنقاص الوزن',            value: 'weight',    emoji: '⚖️' },
      { label: 'متابعة الأمراض المزمنة', value: 'chronic',   emoji: '🩺' },
      { label: 'النوم الجيد',             value: 'sleep',    emoji: '😴' },
      { label: 'الصحة العامة',            value: 'general',  emoji: '❤️' },
    ],
  },
  {
    id: 'activity', question: 'مستوى نشاطك اليومي؟', subtitle: 'يحدد السعرات الحرارية المثالية لك', icon: '⚡', cols: 1,
    options: [
      { label: 'خامل — أجلس معظم اليوم',        value: 'sedentary', emoji: '🛋️' },
      { label: 'خفيف — حركة قليلة أو رياضة نادرة', value: 'light',  emoji: '🚶' },
      { label: 'معتدل — رياضة 3-4 مرات أسبوعياً',  value: 'moderate', emoji: '🚴' },
      { label: 'نشيط — رياضة يومية منتظمة',        value: 'active',   emoji: '🏋️' },
      { label: 'رياضي محترف',                      value: 'athlete',  emoji: '🏆' },
    ],
  },
  {
    id: 'chronic', question: 'هل تعاني من أمراض مزمنة؟', subtitle: 'لتقديم تنبيهات ونصائح مناسبة', icon: '🏥', cols: 2,
    options: [
      { label: 'لا يوجد',       value: 'none',     emoji: '✅' },
      { label: 'السكري',        value: 'diabetes', emoji: '🍬' },
      { label: 'ضغط الدم',      value: 'bp',       emoji: '🫀' },
      { label: 'أمراض القلب',   value: 'heart',    emoji: '❤️' },
      { label: 'الربو',          value: 'asthma',  emoji: '🫁' },
      { label: 'الكلى',          value: 'kidney',  emoji: '🫘' },
      { label: 'الغدة الدرقية', value: 'thyroid',  emoji: '🔬' },
      { label: 'أخرى',           value: 'other',   emoji: '📋' },
    ],
  },
  {
    id: 'allergy', question: 'هل لديك حساسية؟', subtitle: 'لتجنب الاقتراحات الضارة لك', icon: '⚠️', cols: 2,
    options: [
      { label: 'لا يوجد',       value: 'none',     emoji: '✅' },
      { label: 'حساسية أدوية',  value: 'medicine', emoji: '💊' },
      { label: 'حساسية طعام',   value: 'food',     emoji: '🍜' },
      { label: 'حساسية غبار',   value: 'dust',     emoji: '🌫️' },
      { label: 'حساسية موسمية', value: 'seasonal', emoji: '🌸' },
      { label: 'أخرى',           value: 'other',   emoji: '📋' },
    ],
  },
  {
    id: 'smoke', question: 'هل تدخن؟', subtitle: 'معلومة مهمة لتقييم صحتك', icon: '🚬', cols: 2,
    options: [
      { label: 'لا أدخن',          value: 'never',   emoji: '✅' },
      { label: 'مدخن',             value: 'yes',     emoji: '🚬' },
      { label: 'أدخن أحياناً',     value: 'social',  emoji: '🔸' },
      { label: 'أقلعت عن التدخين', value: 'stopped', emoji: '🏅' },
    ],
  },
  {
    id: 'sleep_hours', question: 'كم ساعة تنام يومياً؟', subtitle: 'النوم أساس الصحة الجيدة', icon: '🌙', cols: 2,
    options: [
      { label: 'أقل من 5 ساعات',  value: '<5',  emoji: '😵' },
      { label: '5 – 6 ساعات',     value: '5-6', emoji: '😪' },
      { label: '7 – 8 ساعات',     value: '7-8', emoji: '😊' },
      { label: 'أكثر من 8 ساعات', value: '>8',  emoji: '😴' },
    ],
  },
  {
    id: 'water', question: 'كم كوب ماء تشرب يومياً؟', subtitle: 'الترطيب مفتاح صحة مثالية', icon: '💧', cols: 2,
    options: [
      { label: 'أقل من 4 أكواب',  value: '<4',  emoji: '🥤' },
      { label: '4 – 6 أكواب',     value: '4-6', emoji: '💧' },
      { label: '7 – 8 أكواب',     value: '7-8', emoji: '🌊' },
      { label: 'أكثر من 8 أكواب', value: '>8',  emoji: '🏊' },
    ],
  },
  {
    id: 'diet', question: 'ما نظامك الغذائي؟', subtitle: 'لاقتراح وصفات ووجبات مناسبة', icon: '🥗', cols: 2,
    options: [
      { label: 'عادي — كل شيء',    value: 'normal',     emoji: '🍽️' },
      { label: 'نباتي',             value: 'vegetarian', emoji: '🥗' },
      { label: 'نباتي صرف',         value: 'vegan',      emoji: '🌱' },
      { label: 'كيتو',              value: 'keto',       emoji: '🥩' },
      { label: 'خالٍ من الغلوتين', value: 'gluten',      emoji: '🌾' },
      { label: 'حمية طبية',         value: 'medical',   emoji: '🏥' },
    ],
  },
];

// Accent palette per step — vibrant, unique per question
const ACCENTS = [
  { h: '#a78bfa', glow: 'rgba(167,139,250,0.25)', soft: 'rgba(167,139,250,0.08)' },
  { h: '#fb923c', glow: 'rgba(251,146,60,0.25)',  soft: 'rgba(251,146,60,0.08)'  },
  { h: '#38bdf8', glow: 'rgba(56,189,248,0.25)',  soft: 'rgba(56,189,248,0.08)'  },
  { h: '#34d399', glow: 'rgba(52,211,153,0.25)',  soft: 'rgba(52,211,153,0.08)'  },
  { h: '#f87171', glow: 'rgba(248,113,113,0.25)', soft: 'rgba(248,113,113,0.08)' },
  { h: '#fbbf24', glow: 'rgba(251,191,36,0.25)',  soft: 'rgba(251,191,36,0.08)'  },
  { h: '#f472b6', glow: 'rgba(244,114,182,0.25)', soft: 'rgba(244,114,182,0.08)' },
  { h: '#60a5fa', glow: 'rgba(96,165,250,0.25)',  soft: 'rgba(96,165,250,0.08)'  },
  { h: '#4ade80', glow: 'rgba(74,222,128,0.25)',  soft: 'rgba(74,222,128,0.08)'  },
  { h: '#e879f9', glow: 'rgba(232,121,249,0.25)', soft: 'rgba(232,121,249,0.08)' },
  { h: '#2dd4bf', glow: 'rgba(45,212,191,0.25)',  soft: 'rgba(45,212,191,0.08)'  },
  { h: '#818cf8', glow: 'rgba(129,140,248,0.25)', soft: 'rgba(129,140,248,0.08)' },
  { h: '#22d3ee', glow: 'rgba(34,211,238,0.25)',  soft: 'rgba(34,211,238,0.08)'  },
  { h: '#a3e635', glow: 'rgba(163,230,53,0.25)',  soft: 'rgba(163,230,53,0.08)'  },
];

const profileKey = (username: string | undefined, id: string) =>
  username ? `profile_${username}_${id}` : `profile_${id}`;

export default function OnboardingQuiz({ username, onFinish, onSkip }: Props) {
  const [step,     setStep]     = useState(0);
  const [answers,  setAnswers]  = useState<Record<string, string>>(() => {
    const saved: Record<string, string> = {};
    QUESTIONS.forEach(q => {
      const val = storage.get(profileKey(username, q.id));
      if (val) saved[q.id] = val;
    });
    return saved;
  });
  const [selected, setSelected] = useState<string | null>(
    () => storage.get(profileKey(username, QUESTIONS[0].id)) || null
  );
  const [animKey,  setAnimKey]  = useState(0);
  const [dir,      setDir]      = useState<'fwd' | 'bwd'>('fwd');
  const [busy,     setBusy]     = useState(false);
  const [done,     setDone]     = useState(false);

  const total   = QUESTIONS.length;
  const current = QUESTIONS[step];
  const accent  = ACCENTS[step % ACCENTS.length];
  const cols    = current.cols ?? 2;
  const isSingle = current.options.length <= 2 && cols === 1;

  const goTo = (nextStep: number, direction: 'fwd' | 'bwd') => {
    if (busy) return;
    setBusy(true);
    setDir(direction);
    setTimeout(() => {
      setStep(nextStep);
      setAnimKey(k => k + 1);
      setBusy(false);
    }, 300);
  };

  const goNext = () => {
    if (!selected) return;
    const newAnswers = { ...answers, [current.id]: selected };
    setAnswers(newAnswers);
    if (step + 1 >= total) {
      Object.entries(newAnswers).forEach(([k, v]) =>
        storage.set(profileKey(username, k), v)
      );
      setDone(true);
      return;
    }
    setSelected(newAnswers[QUESTIONS[step + 1].id] || null);
    goTo(step + 1, 'fwd');
  };

  const goBack = () => {
    if (step === 0) return;
    const prevAnswers = { ...answers };
    if (selected) prevAnswers[current.id] = selected;
    setAnswers(prevAnswers);
    setSelected(prevAnswers[QUESTIONS[step - 1].id] || null);
    goTo(step - 1, 'bwd');
  };

  const skip = () => {
    Object.entries(answers).forEach(([k, v]) =>
      storage.set(profileKey(username, k), v)
    );
    if (onSkip) onSkip();
    else onFinish(answers);
  };

  const pct = Math.round(((step + 1) / total) * 100);

  if (done) return <OnboardingComplete username={username ?? ''} onEnter={() => onFinish(answers)} />;

  return (
    <div
      dir="rtl"
      style={{
        position: 'fixed', inset: 0, zIndex: 10000,
        background: '#060a12',
        display: 'flex', flexDirection: 'column',
        fontFamily: "'Cairo', 'Segoe UI', Tahoma, sans-serif",
        overflow: 'hidden',
      }}
    >
      {/* ── CSS ───────────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&display=swap');

        @keyframes blobDrift {
          0%,100% { transform: translate(0,0) scale(1); }
          33%      { transform: translate(30px,-20px) scale(1.08); }
          66%      { transform: translate(-20px,15px) scale(0.94); }
        }
        @keyframes gridPulse {
          0%,100% { opacity: 0.4; }
          50%      { opacity: 0.7; }
        }
        @keyframes enterFwd {
          from { opacity: 0; transform: translateX(-48px) scale(0.97); }
          to   { opacity: 1; transform: translateX(0)     scale(1);    }
        }
        @keyframes enterBwd {
          from { opacity: 0; transform: translateX(48px) scale(0.97); }
          to   { opacity: 1; transform: translateX(0)    scale(1);    }
        }
        @keyframes staggerUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          0%   { transform: scale(0.5); opacity: 0; }
          70%  { transform: scale(1.25); }
          100% { transform: scale(1);   opacity: 1; }
        }
        @keyframes scanLine {
          from { transform: translateY(-100%); }
          to   { transform: translateY(100%); }
        }
        @keyframes glowPulse {
          0%,100% { opacity: 0.6; }
          50%     { opacity: 1; }
        }
        @keyframes emojiDrift {
          0%,100% { transform: rotate(-6deg) scale(1); }
          50%     { transform: rotate(6deg)  scale(1.06); }
        }
        @keyframes shimBar {
          from { background-position: -200% center; }
          to   { background-position:  200% center; }
        }
        @keyframes fadeIn {
          from { opacity: 0; } to { opacity: 1; }
        }

        .oq-card { will-change: transform, opacity; }
        .oq-card.fwd { animation: enterFwd 0.38s cubic-bezier(0.22,1,0.36,1) both; }
        .oq-card.bwd { animation: enterBwd 0.38s cubic-bezier(0.22,1,0.36,1) both; }

        .oq-opt {
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: transform 0.18s cubic-bezier(0.34,1.56,0.64,1),
                      box-shadow 0.2s ease,
                      border-color 0.2s ease,
                      background 0.2s ease;
        }
        .oq-opt:hover  { transform: translateY(-2px) scale(1.025) !important; }
        .oq-opt:active { transform: scale(0.96) !important; }

        .oq-next {
          transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1),
                      box-shadow 0.2s ease, opacity 0.2s;
        }
        .oq-next:not(:disabled):hover  { transform: translateY(-3px) scale(1.03); }
        .oq-next:not(:disabled):active { transform: scale(0.97); }
        .oq-next:disabled { cursor: not-allowed; }

        .oq-back {
          transition: all 0.18s ease;
        }
        .oq-back:not(:disabled):hover {
          background: rgba(255,255,255,0.06) !important;
          color: rgba(255,255,255,0.7) !important;
        }

        .oq-check { animation: popIn 0.32s cubic-bezier(0.34,1.56,0.64,1) both; }
        .oq-opt-anim { animation: staggerUp 0.4s ease both; }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 99px; }
      `}</style>

      {/* ── Ambient background ─────────────────────────────── */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        {/* Blob 1 */}
        <div style={{
          position: 'absolute', top: '-15%', right: '-10%',
          width: 480, height: 480, borderRadius: '50%',
          background: `radial-gradient(circle, ${accent.glow} 0%, transparent 65%)`,
          filter: 'blur(72px)',
          animation: 'blobDrift 12s ease-in-out infinite',
          transition: 'background 1.2s ease',
        }}/>
        {/* Blob 2 */}
        <div style={{
          position: 'absolute', bottom: '-10%', left: '-15%',
          width: 400, height: 400, borderRadius: '50%',
          background: `radial-gradient(circle, ${accent.glow} 0%, transparent 65%)`,
          filter: 'blur(90px)',
          animation: 'blobDrift 16s ease-in-out infinite reverse',
          transition: 'background 1.2s ease',
        }}/>
        {/* Dot grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage:
            'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          animation: 'gridPulse 6s ease-in-out infinite',
        }}/>
        {/* Scan line */}
        <div style={{
          position: 'absolute', inset: 0, overflow: 'hidden', opacity: 0.03,
        }}>
          <div style={{
            position: 'absolute', left: 0, right: 0, height: '30%',
            background: `linear-gradient(to bottom, transparent, ${accent.h}, transparent)`,
            animation: 'scanLine 8s linear infinite',
          }}/>
        </div>
      </div>

      {/* ── Scroll container ───────────────────────────────── */}
      <div style={{
        position: 'relative', zIndex: 1,
        flex: 1, overflowY: 'auto',
        display: 'flex', flexDirection: 'column',
        padding: '20px 18px 8px',
        gap: 16,
      }}>

        {/* ── Top bar ──────────────────────────────────────── */}
        <div style={{ animation: 'fadeIn 0.6s ease both' }}>
          {/* Welcome chip */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: 14,
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.09)',
              borderRadius: 99, padding: '5px 14px 5px 8px',
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: `linear-gradient(135deg, ${accent.h}, ${accent.glow})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, flexShrink: 0,
                transition: 'background 0.8s',
              }}>
                {current.icon}
              </div>
              <span style={{
                fontSize: 12, fontWeight: 700,
                color: 'rgba(255,255,255,0.55)',
                letterSpacing: 0.3,
              }}>
                {username ? `مرحباً ${username}` : 'ملفك الصحي'}
              </span>
            </div>

            {/* Step counter */}
            <div style={{
              background: `${accent.soft}`,
              border: `1px solid ${accent.h}33`,
              borderRadius: 99, padding: '5px 12px',
              transition: 'all 0.5s ease',
            }}>
              <span style={{
                fontSize: 12, fontWeight: 800, color: accent.h,
                transition: 'color 0.5s',
              }}>
                {step + 1} / {total}
              </span>
            </div>
          </div>

          {/* Progress track */}
          <div style={{ position: 'relative', marginBottom: 6 }}>
            {/* Track bg */}
            <div style={{
              height: 3, borderRadius: 99,
              background: 'rgba(255,255,255,0.06)',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${pct}%`,
                borderRadius: 99,
                background: `linear-gradient(90deg, ${accent.h}cc, ${accent.h})`,
                backgroundSize: '200% auto',
                animation: 'shimBar 2s linear infinite',
                boxShadow: `0 0 10px ${accent.glow}`,
                transition: 'width 0.5s cubic-bezier(0.22,1,0.36,1)',
              }}/>
            </div>
            {/* Moving dot */}
            <div style={{
              position: 'absolute', top: '50%',
              left: `calc(${pct}% - 6px)`,
              transform: 'translateY(-50%)',
              width: 12, height: 12, borderRadius: '50%',
              background: accent.h,
              boxShadow: `0 0 0 3px ${accent.glow}, 0 0 16px ${accent.h}`,
              transition: 'left 0.5s cubic-bezier(0.22,1,0.36,1), background 0.5s',
              animation: 'glowPulse 1.5s ease-in-out infinite',
            }}/>
          </div>

          {/* Percent label */}
          <div style={{
            textAlign: 'center', fontSize: 10,
            color: 'rgba(255,255,255,0.25)', fontWeight: 600,
            letterSpacing: 1,
          }}>
            {pct}% مكتمل
          </div>
        </div>

        {/* ── Animated card ─────────────────────────────────── */}
        <div
          key={animKey}
          className={`oq-card ${dir}`}
          style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}
        >
          {/* Question header */}
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 22,
            padding: '22px 20px',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Huge watermark emoji */}
            <div style={{
              position: 'absolute', bottom: -10, left: -10,
              fontSize: 110, opacity: 0.055,
              animation: 'emojiDrift 5s ease-in-out infinite',
              userSelect: 'none', lineHeight: 1,
              filter: 'blur(1px)',
              pointerEvents: 'none',
            }}>
              {current.icon}
            </div>

            {/* Step number watermark */}
            <div style={{
              position: 'absolute', top: 12, left: 16,
              fontSize: 52, fontWeight: 900, lineHeight: 1,
              color: 'rgba(255,255,255,0.035)',
              userSelect: 'none', pointerEvents: 'none',
            }}>
              {String(step + 1).padStart(2, '0')}
            </div>

            <div style={{ position: 'relative', zIndex: 1 }}>
              {/* Icon badge */}
              <div style={{
                width: 64, height: 64, borderRadius: 20,
                background: `linear-gradient(135deg, ${accent.soft}, rgba(255,255,255,0.04))`,
                border: `1.5px solid ${accent.h}30`,
                boxShadow: `0 8px 32px ${accent.glow}, inset 0 1px 0 rgba(255,255,255,0.08)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 32, margin: '0 auto 14px',
                transition: 'all 0.6s ease',
              }}>
                {current.icon}
              </div>

              <h2 style={{
                textAlign: 'center',
                fontSize: 20, fontWeight: 900,
                color: '#fff', margin: '0 0 6px',
                lineHeight: 1.35,
              }}>
                {current.question}
              </h2>

              {current.subtitle && (
                <p style={{
                  textAlign: 'center',
                  fontSize: 12, color: 'rgba(255,255,255,0.35)',
                  margin: 0, lineHeight: 1.5,
                }}>
                  {current.subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Options grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isSingle
              ? '1fr'
              : `repeat(${cols}, 1fr)`,
            gap: isSingle ? 10 : 8,
          }}>
            {current.options.map((opt, i) => {
              const sel = selected === opt.value;
              const delay = `${i * 55}ms`;

              return (
                <button
                  key={opt.value}
                  onClick={() => setSelected(opt.value)}
                  className="oq-opt oq-opt-anim"
                  style={{
                    animationDelay: delay,
                    background: sel
                      ? `linear-gradient(135deg, ${accent.soft}, rgba(255,255,255,0.04))`
                      : 'rgba(255,255,255,0.035)',
                    border: `1.5px solid ${sel ? accent.h : 'rgba(255,255,255,0.07)'}`,
                    borderRadius: isSingle ? 16 : 14,
                    padding: isSingle
                      ? '15px 18px'
                      : cols === 3 ? '11px 6px' : '13px 10px',
                    display: 'flex',
                    flexDirection: isSingle ? 'row' : 'column',
                    alignItems: 'center',
                    justifyContent: isSingle ? 'flex-start' : 'center',
                    gap: isSingle ? 14 : 7,
                    textAlign: 'center',
                    fontFamily: 'inherit',
                    boxShadow: sel ? `0 4px 24px ${accent.glow}, inset 0 1px 0 rgba(255,255,255,0.06)` : 'none',
                    transform: sel ? 'scale(1.02)' : 'scale(1)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                  }}
                >
                  {/* Shimmer on select */}
                  {sel && (
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: `linear-gradient(120deg, transparent 30%, ${accent.h}0a 60%, transparent 80%)`,
                      pointerEvents: 'none',
                    }}/>
                  )}

                  {/* Emoji */}
                  <span style={{
                    fontSize: isSingle ? 26 : cols === 3 ? 18 : 22,
                    lineHeight: 1, flexShrink: 0,
                    filter: sel ? 'drop-shadow(0 0 6px currentColor)' : 'none',
                    transition: 'filter 0.2s',
                  }}>
                    {opt.emoji}
                  </span>

                  {/* Label */}
                  <span style={{
                    flex: isSingle ? 1 : 'unset',
                    fontSize: isSingle ? 15 : cols === 3 ? 11 : 12.5,
                    fontWeight: sel ? 700 : 500,
                    color: sel ? '#fff' : 'rgba(255,255,255,0.45)',
                    lineHeight: 1.3,
                    textAlign: isSingle ? 'right' : 'center',
                    transition: 'color 0.2s',
                  }}>
                    {opt.label}
                  </span>

                  {/* Checkmark (row mode) */}
                  {isSingle && (
                    <div style={{
                      width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                      border: `2px solid ${sel ? accent.h : 'rgba(255,255,255,0.15)'}`,
                      background: sel ? accent.h : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.22s ease',
                    }}>
                      {sel && (
                        <svg className="oq-check" width="11" height="9" viewBox="0 0 11 9" fill="none">
                          <path d="M1 4.5L3.8 7.5L10 1" stroke="white" strokeWidth="2.2"
                                strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                  )}

                  {/* Dot (grid mode) */}
                  {!isSingle && sel && (
                    <div className="oq-check" style={{
                      position: 'absolute', top: 6, right: 6,
                      width: 9, height: 9, borderRadius: '50%',
                      background: accent.h,
                      boxShadow: `0 0 8px ${accent.h}`,
                    }}/>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Fixed footer ───────────────────────────────────── */}
      <div style={{
        position: 'relative', zIndex: 2,
        padding: '12px 18px 28px',
        background: 'linear-gradient(to top, #060a12 60%, transparent)',
        display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        {/* Primary: Next */}
        <button
          onClick={goNext}
          disabled={!selected}
          className="oq-next"
          style={{
            padding: '17px',
            borderRadius: 18, border: 'none',
            background: selected
              ? `linear-gradient(135deg, ${accent.h}dd, ${accent.h}88)`
              : 'rgba(255,255,255,0.05)',
            color: selected ? '#fff' : 'rgba(255,255,255,0.2)',
            fontSize: 16, fontWeight: 800,
            fontFamily: 'inherit',
            boxShadow: selected ? `0 8px 36px ${accent.glow}` : 'none',
            opacity: selected ? 1 : 0.6,
            letterSpacing: 0.3,
            transition: 'all 0.5s ease',
          }}
        >
          {step + 1 === total
            ? '✦ إنهاء وإنشاء ملفي الصحي'
            : `التالي — ${QUESTIONS[step + 1]?.question ?? ''} ←`}
        </button>

        {/* Secondary row: Back + Skip */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={goBack}
            disabled={step === 0}
            className="oq-back"
            style={{
              flex: 1, padding: '14px',
              borderRadius: 14,
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.03)',
              color: step === 0 ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.45)',
              fontSize: 14, fontWeight: 600,
              fontFamily: 'inherit',
              cursor: step === 0 ? 'not-allowed' : 'pointer',
            }}
          >
            ► السابق
          </button>

          <button
            onClick={skip}
            style={{
              flex: 1, padding: '14px',
              borderRadius: 14,
              border: '1px solid rgba(255,255,255,0.05)',
              background: 'transparent',
              color: 'rgba(255,255,255,0.2)',
              fontSize: 13, fontWeight: 500,
              fontFamily: 'inherit',
              cursor: 'pointer',
              transition: 'all 0.18s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.4)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.2)';
            }}
          >
            تخطي الآن
          </button>
        </div>
      </div>
    </div>
  );
}

