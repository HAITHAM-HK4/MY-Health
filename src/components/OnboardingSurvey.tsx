import { storage } from '../lib/storage';
// src/components/OnboardingSurvey.tsx
import { useState } from 'react';

// ─── Types ───────────────────────────────────────────────────
type Step = {
  id: string;
  question: string;
  emoji: string;
  options: { label: string; value: string; icon: string }[];
  multi?: boolean;
};

type Answers = Record<string, string | string[]>;

type Props = {
  username: string;
  onComplete: (answers: Answers) => void;
};

// ─── خطوات الاستبيان ─────────────────────────────────────────
const STEPS: Step[] = [
  {
    id: 'gender',
    question: 'ما هو جنسك؟',
    emoji: '🧬',
    options: [
      { label: 'ذكر',    value: 'male',   icon: '👨' },
      { label: 'أنثى',   value: 'female', icon: '👩' },
      { label: 'أفضل عدم الإفصاح', value: 'prefer_not', icon: '🤐' },
    ],
  },
  {
    id: 'age_group',
    question: 'ما هي فئتك العمرية؟',
    emoji: '🎂',
    options: [
      { label: 'أقل من 18',   value: 'under_18',  icon: '🧒' },
      { label: '18 – 25',     value: '18_25',     icon: '🧑' },
      { label: '26 – 35',     value: '26_35',     icon: '👨' },
      { label: '36 – 50',     value: '36_50',     icon: '🧔' },
      { label: '50+',         value: '50_plus',   icon: '🧓' },
    ],
  },
  {
    id: 'blood_type',
    question: 'ما هي فصيلة دمك؟',
    emoji: '🩸',
    options: [
      { label: 'A+',  value: 'A+',       icon: '🔴' },
      { label: 'A-',  value: 'A-',       icon: '🔴' },
      { label: 'B+',  value: 'B+',       icon: '🟠' },
      { label: 'B-',  value: 'B-',       icon: '🟠' },
      { label: 'O+',  value: 'O+',       icon: '🔵' },
      { label: 'O-',  value: 'O-',       icon: '🔵' },
      { label: 'AB+', value: 'AB+',      icon: '🟣' },
      { label: 'AB-', value: 'AB-',      icon: '🟣' },
      { label: 'لا أعرف', value: 'unknown', icon: '❓' },
    ],
  },
  {
    id: 'height',
    question: 'ما هو طولك؟',
    emoji: '📏',
    options: [
      { label: 'أقل من 150 سم',    value: 'lt_150',  icon: '🟢' },
      { label: '150 – 160 سم',     value: '150_160', icon: '🟡' },
      { label: '161 – 170 سم',     value: '161_170', icon: '🟡' },
      { label: '171 – 180 سم',     value: '171_180', icon: '🟠' },
      { label: '181 – 190 سم',     value: '181_190', icon: '🟠' },
      { label: 'أكثر من 190 سم',   value: 'gt_190',  icon: '🔴' },
    ],
  },
  {
    id: 'weight',
    question: 'ما هو وزنك التقريبي؟',
    emoji: '⚖️',
    options: [
      { label: 'أقل من 50 كغ',   value: 'lt_50',   icon: '🟢' },
      { label: '50 – 70 كغ',     value: '50_70',   icon: '🟡' },
      { label: '71 – 90 كغ',     value: '71_90',   icon: '🟡' },
      { label: '91 – 110 كغ',    value: '91_110',  icon: '🟠' },
      { label: 'أكثر من 110 كغ', value: 'gt_110',  icon: '🔴' },
    ],
  },
  {
    id: 'chronic_diseases',
    question: 'هل تعاني من أي أمراض مزمنة؟',
    emoji: '🏥',
    multi: true,
    options: [
      { label: 'لا يوجد',              value: 'none',        icon: '✅' },
      { label: 'السكري',               value: 'diabetes',    icon: '🩺' },
      { label: 'ضغط الدم',            value: 'hypertension', icon: '💉' },
      { label: 'أمراض القلب',          value: 'heart',       icon: '❤️' },
      { label: 'الربو',                value: 'asthma',      icon: '🫁' },
      { label: 'أمراض الكلى',          value: 'kidney',      icon: '🫘' },
      { label: 'الغدة الدرقية',        value: 'thyroid',     icon: '🦋' },
      { label: 'أخرى',                 value: 'other',       icon: '📋' },
    ],
  },
  {
    id: 'activity_level',
    question: 'ما مستوى نشاطك البدني؟',
    emoji: '🏃',
    options: [
      { label: 'غير نشيط',             value: 'sedentary',  icon: '🛋️' },
      { label: 'خفيف (1-2 أيام/أسبوع)', value: 'light',     icon: '🚶' },
      { label: 'معتدل (3-4 أيام)',       value: 'moderate',  icon: '🚴' },
      { label: 'نشيط جداً (5+ أيام)',    value: 'very_active', icon: '🏋️' },
    ],
  },
  {
    id: 'sleep_hours',
    question: 'كم ساعة تنام يومياً في المتوسط؟',
    emoji: '😴',
    options: [
      { label: 'أقل من 5 ساعات',  value: 'lt_5',  icon: '😩' },
      { label: '5 – 6 ساعات',     value: '5_6',   icon: '😪' },
      { label: '7 – 8 ساعات',     value: '7_8',   icon: '😊' },
      { label: 'أكثر من 8 ساعات', value: 'gt_8',  icon: '😴' },
    ],
  },
  {
    id: 'health_goal',
    question: 'ما هدفك الصحي الرئيسي؟',
    emoji: '🎯',
    multi: true,
    options: [
      { label: 'إنقاص الوزن',        value: 'lose_weight',   icon: '⬇️' },
      { label: 'زيادة الوزن',        value: 'gain_weight',   icon: '⬆️' },
      { label: 'اللياقة البدنية',     value: 'fitness',       icon: '💪' },
      { label: 'التحكم بالسكر/الضغط', value: 'manage_chronic', icon: '📊' },
      { label: 'تحسين النوم',         value: 'sleep',         icon: '🌙' },
      { label: 'تقليل التوتر',        value: 'stress',        icon: '🧘' },
      { label: 'متابعة الأدوية',      value: 'medicines',     icon: '💊' },
    ],
  },
];

// ─── Component ───────────────────────────────────────────────
export default function OnboardingSurvey({ username, onComplete }: Props) {
  const [step, setStep]       = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [animDir, setAnimDir] = useState<'in' | 'out'>('in');

  const current    = STEPS[step];
  const progress   = ((step) / STEPS.length) * 100;
  const isMulti    = !!current.multi;
  const selected   = answers[current.id];

  // ── اختيار خيار ─────────────────────────────────────────
  const select = (value: string) => {
    if (isMulti) {
      const prev = (selected as string[] | undefined) ?? [];
      if (value === 'none') {
        setAnswers(a => ({ ...a, [current.id]: ['none'] }));
        return;
      }
      const without = prev.filter(v => v !== 'none');
      const next    = without.includes(value)
        ? without.filter(v => v !== value)
        : [...without, value];
      setAnswers(a => ({ ...a, [current.id]: next }));
    } else {
      setAnswers(a => ({ ...a, [current.id]: value }));
    }
  };

  // ── هل اختار شيء؟ ────────────────────────────────────────
  const hasAnswer = (): boolean => {
    const val = answers[current.id];
    if (!val) return false;
    if (Array.isArray(val)) return val.length > 0;
    return !!val;
  };

  // ── التالي ───────────────────────────────────────────────
  const next = () => {
    if (!hasAnswer()) return;
    if (step < STEPS.length - 1) {
      setStep(s => s + 1);
    } else {
      // حفظ الإجابات في localStorage
      try {
        storage.set(`survey_${username}`, JSON.stringify(answers));
        storage.set(`survey_done_${username}`, 'true');
      } catch { /* ignore */ }
      onComplete(answers);
    }
  };

  // ── السابق ───────────────────────────────────────────────
  const prev = () => {
    if (step > 0) setStep(s => s - 1);
  };

  // ── تخطي ─────────────────────────────────────────────────
  const skip = () => {
    try {
      storage.set(`survey_done_${username}`, 'true');
    } catch { /* ignore */ }
    onComplete(answers);
  };

  // ── هل الخيار محدد؟ ──────────────────────────────────────
  const isSelected = (value: string): boolean => {
    const val = answers[current.id];
    if (!val) return false;
    if (Array.isArray(val)) return val.includes(value);
    return val === value;
  };

  // ── ألوان تدرج لكل خطوة ──────────────────────────────────
  const stepColors = [
    { from: '#6366f1', to: '#8b5cf6' }, // بنفسجي
    { from: '#f97316', to: '#fb923c' }, // برتقالي
    { from: '#ef4444', to: '#f87171' }, // أحمر
    { from: '#0ea5e9', to: '#38bdf8' }, // أزرق
    { from: '#10b981', to: '#34d399' }, // أخضر
    { from: '#3b82f6', to: '#60a5fa' }, // أزرق سماوي
    { from: '#8b5cf6', to: '#a78bfa' }, // بنفسجي فاتح
    { from: '#6366f1', to: '#818cf8' }, // نيلي
    { from: '#f59e0b', to: '#fbbf24' }, // ذهبي
  ];
  const color = stepColors[step % stepColors.length];

  return (
    <div
      dir="rtl"
      style={{
        minHeight: '100dvh',
        background: 'linear-gradient(135deg, #f0f4ff 0%, #fdf4ff 50%, #f0fdf4 100%)',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Segoe UI', 'Cairo', sans-serif",
        overflowX: 'hidden',
      }}
    >
      {/* ── Header ─────────────────────────────────────────── */}
      <div style={{ padding: '20px 20px 0', position: 'relative' }}>
        {/* شريط التقدم */}
        <div style={{ marginBottom: 12 }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
          }}>
            <span style={{
              fontSize: 13,
              fontWeight: 600,
              color: '#64748b',
            }}>
              الخطوة {step + 1} من {STEPS.length}
            </span>
            <span style={{
              fontSize: 13,
              fontWeight: 700,
              color: color.from,
            }}>
              {Math.round(((step + 1) / STEPS.length) * 100)}%
            </span>
          </div>

          {/* Track */}
          <div style={{
            height: 8,
            borderRadius: 99,
            background: '#e2e8f0',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${((step + 1) / STEPS.length) * 100}%`,
              borderRadius: 99,
              background: `linear-gradient(90deg, ${color.from}, ${color.to})`,
              transition: 'width 0.5s cubic-bezier(0.4,0,0.2,1)',
              boxShadow: `0 0 12px ${color.from}66`,
            }} />
          </div>

          {/* نقاط الخطوات */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 8,
            gap: 4,
          }}>
            {STEPS.map((_, i) => (
              <div key={i} style={{
                flex: 1,
                height: 4,
                borderRadius: 99,
                background: i <= step ? color.from : '#e2e8f0',
                transition: 'background 0.4s ease',
                boxShadow: i === step ? `0 0 8px ${color.from}88` : 'none',
              }} />
            ))}
          </div>
        </div>

        {/* مرحباً */}
        {step === 0 && (
          <div style={{
            textAlign: 'center',
            marginBottom: 4,
            animation: 'fadeSlideDown 0.6s ease',
          }}>
            <div style={{ fontSize: 28, marginBottom: 4 }}>👋</div>
            <h2 style={{
              fontSize: 20,
              fontWeight: 800,
              color: '#1e293b',
              margin: 0,
            }}>
              مرحباً بك {username}!
            </h2>
            <p style={{
              fontSize: 13,
              color: '#64748b',
              margin: '4px 0 0',
            }}>
              دعنا نتعرف عليك أكثر لنقدم لك تجربة صحية مخصصة
            </p>
          </div>
        )}
      </div>

      {/* ── Card ───────────────────────────────────────────── */}
      <div style={{
        flex: 1,
        padding: '12px 16px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        animation: 'fadeSlideUp 0.4s ease',
      }}>
        {/* بطاقة السؤال */}
        <div style={{
          background: 'white',
          borderRadius: 24,
          padding: '20px 20px 16px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          border: `1.5px solid ${color.from}22`,
        }}>
          {/* أيقونة السؤال */}
          <div style={{
            width: 64,
            height: 64,
            borderRadius: 20,
            background: `linear-gradient(135deg, ${color.from}15, ${color.to}25)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 32,
            margin: '0 auto 16px',
            border: `2px solid ${color.from}30`,
          }}>
            {current.emoji}
          </div>

          <h3 style={{
            textAlign: 'center',
            fontSize: 18,
            fontWeight: 800,
            color: '#1e293b',
            margin: '0 0 4px',
            lineHeight: 1.4,
          }}>
            {current.question}
          </h3>

          {isMulti && (
            <p style={{
              textAlign: 'center',
              fontSize: 12,
              color: '#94a3b8',
              margin: '4px 0 0',
            }}>
              يمكنك اختيار أكثر من خيار
            </p>
          )}
        </div>

        {/* الخيارات */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: current.options.length > 5 ? '1fr 1fr' : '1fr',
          gap: 10,
        }}>
          {current.options.map(opt => {
            const sel = isSelected(opt.value);
            return (
              <button
                key={opt.value}
                onClick={() => select(opt.value)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: current.options.length > 5 ? '12px 14px' : '14px 18px',
                  borderRadius: 16,
                  border: sel
                    ? `2px solid ${color.from}`
                    : '2px solid #e2e8f0',
                  background: sel
                    ? `linear-gradient(135deg, ${color.from}12, ${color.to}18)`
                    : 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: sel
                    ? `0 4px 16px ${color.from}28`
                    : '0 2px 8px rgba(0,0,0,0.04)',
                  transform: sel ? 'scale(1.02)' : 'scale(1)',
                  textAlign: 'right',
                }}
              >
                {/* أيقونة */}
                <span style={{
                  fontSize: current.options.length > 5 ? 22 : 26,
                  lineHeight: 1,
                  flexShrink: 0,
                }}>
                  {opt.icon}
                </span>

                {/* نص */}
                <span style={{
                  flex: 1,
                  fontSize: current.options.length > 5 ? 13 : 15,
                  fontWeight: sel ? 700 : 500,
                  color: sel ? color.from : '#374151',
                  lineHeight: 1.3,
                }}>
                  {opt.label}
                </span>

                {/* علامة الاختيار */}
                <div style={{
                  width: 22,
                  height: 22,
                  borderRadius: isMulti ? 6 : 99,
                  border: sel ? `2px solid ${color.from}` : '2px solid #cbd5e1',
                  background: sel ? color.from : 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 0.2s ease',
                }}>
                  {sel && (
                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                      <path d="M1 5L4.5 8.5L11 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Footer Buttons ──────────────────────────────────── */}
      <div style={{
        padding: '12px 16px 24px',
        display: 'flex',
        gap: 10,
        flexDirection: 'column',
      }}>
        {/* زر التالي/إنهاء */}
        <button
          onClick={next}
          disabled={!hasAnswer()}
          style={{
            padding: '16px',
            borderRadius: 16,
            border: 'none',
            background: hasAnswer()
              ? `linear-gradient(135deg, ${color.from}, ${color.to})`
              : '#e2e8f0',
            color: hasAnswer() ? 'white' : '#94a3b8',
            fontSize: 16,
            fontWeight: 700,
            cursor: hasAnswer() ? 'pointer' : 'not-allowed',
            transition: 'all 0.3s ease',
            boxShadow: hasAnswer() ? `0 6px 20px ${color.from}44` : 'none',
            transform: hasAnswer() ? 'scale(1)' : 'scale(0.98)',
          }}
        >
          {step < STEPS.length - 1 ? 'التالي ←' : '✅ إنهاء الاستبيان'}
        </button>

        {/* زران: السابق + تخطي */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={prev}
            disabled={step === 0}
            style={{
              flex: 1,
              padding: '13px',
              borderRadius: 14,
              border: '2px solid #e2e8f0',
              background: 'white',
              color: step === 0 ? '#cbd5e1' : '#374151',
              fontSize: 14,
              fontWeight: 600,
              cursor: step === 0 ? 'not-allowed' : 'pointer',
            }}
          >
            ← السابق
          </button>
          <button
            onClick={skip}
            style={{
              flex: 1,
              padding: '13px',
              borderRadius: 14,
              border: '2px solid #e2e8f0',
              background: 'white',
              color: '#64748b',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            تخطي الاستبيان
          </button>
        </div>
      </div>

      {/* ── Animations ─────────────────────────────────────── */}
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ─── دالة مساعدة: هل أكمل المستخدم الاستبيان؟ ───────────────
export function hasSurveyDone(username: string): boolean {
  try {
    return storage.get(`survey_done_${username}`) === 'true';
  } catch {
    return false;
  }
}

