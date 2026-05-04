import { storage } from '../lib/storage';
// src/components/VoiceCommand.tsx
import { useState, useEffect, useRef } from 'react';

type Props = {
  onNavigate: (page: string) => void;
  onThemeToggle?: () => void;
  onAddWater?: () => void;
};

const GROQ_KEY = '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';

/* ── أوامر التنقل الثابتة ── */
const NAV_COMMANDS: Record<string, string> = {
  'الرئيسية': 'home',   'رئيسية': 'home',
  'الادوية':  'medicines', 'ادوية': 'medicines',
  'صحتي':     'health',  'الصحة': 'health',
  'اعراض':    'symptoms', 'الاعراض': 'symptoms',
  'التقويم':  'calendar', 'تقويم': 'calendar',
  'الاعدادات':'settings', 'اعدادات': 'settings',
  'سجلاتي':   'records',
  'الذكاء':   'ai',      'ذكاء': 'ai',
  'انجازات':  'achievements', 'الانجازات': 'achievements',
  'لقاحات':   'vaccines',
  'تاريخي':   'history',
  'ملاحظات':  'notes',
  'الموجز':   'digest',
};

/* ── استدعاء Groq لفهم الأمر ── */
const callAI = async (command: string): Promise<{
  action: string;
  page?: string;
  value?: string;
  message: string;
}> => {
  const today = new Date().toDateString();
  const water = storage.get(`water_${today}`) || '0';
  const theme = storage.get('theme') || 'light';

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `أنت مساعد صوتي لتطبيق صحي. تحليل الأوامر الصوتية وتحديد الإجراء المناسب.
بيانات حالية: ماء=${water}/8 أكواب، وضع العرض=${theme}.

الصفحات المتاحة: home, medicines, health, symptoms, calendar, settings, records, ai, achievements, vaccines, history, notes, digest

الإجراءات المتاحة:
- navigate: للتنقل بين الصفحات
- add_water: لإضافة كوب ماء
- toggle_theme: لتبديل وضع الليل/النهار
- set_theme_dark: لتشغيل وضع الليل
- set_theme_light: لتشغيل وضع النهار
- unknown: إذا لم تفهم الأمر

أعد JSON فقط بهذا الشكل:
{"action":"...","page":"...","value":"...","message":"رسالة قصيرة للمستخدم"}`,
        },
        {
          role: 'user',
          content: `الأمر الصوتي: "${command}"`,
        },
      ],
      max_tokens: 200,
    }),
  });

  const data  = await res.json();
  const raw   = data.choices[0].message.content;
  const clean = raw.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
};

export default function VoiceCommand({ onNavigate, onThemeToggle, onAddWater }: Props) {
  const [listening,  setListening]  = useState(false);
  const [processing, setProcessing] = useState(false);
  const [text,       setText]       = useState('');
  const [response,   setResponse]   = useState('');
  const [success,    setSuccess]    = useState(false);
  const hideTimer = useRef<NodeJS.Timeout | null>(null);

  const scheduleHide = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      setText('');
      setResponse('');
      setSuccess(false);
    }, 4000);
  };

  useEffect(() => {
    return () => { if (hideTimer.current) clearTimeout(hideTimer.current); };
  }, []);

  const handleCommand = async (said: string) => {
    setText(said);
    setProcessing(true);

    // أولاً: تحقق من الأوامر الثابتة (أسرع)
    const matched = Object.keys(NAV_COMMANDS).find(cmd => said.includes(cmd));
    if (matched) {
      onNavigate(NAV_COMMANDS[matched]);
      setResponse(`✅ ${matched}`);
      setSuccess(true);
      setProcessing(false);
      scheduleHide();
      return;
    }

    // ثانياً: أرسل للذكاء الاصطناعي
    try {
      const result = await callAI(said);

      switch (result.action) {
        case 'navigate':
          if (result.page) {
            onNavigate(result.page);
            setSuccess(true);
          }
          break;

        case 'add_water': {
          const today = new Date().toDateString();
          const current = parseInt(storage.get(`water_${today}`) || '0');
          storage.set(`water_${today}`, String(current + 1));
          setSuccess(true);
          break;
        }

        case 'toggle_theme':
          onThemeToggle?.();
          setSuccess(true);
          break;

        case 'set_theme_dark':
          storage.set('theme', 'dark');
          window.dispatchEvent(new Event('themechange'));
          onThemeToggle?.();
          setSuccess(true);
          break;

        case 'set_theme_light':
          storage.set('theme', 'light');
          window.dispatchEvent(new Event('themechange'));
          onThemeToggle?.();
          setSuccess(true);
          break;

        default:
          setSuccess(false);
      }

      setResponse(result.message || (result.action === 'unknown' ? '❓ لم أفهم الأمر' : '✅ تم'));
    } catch {
      setResponse('⚠️ خطأ في المعالجة');
      setSuccess(false);
    }

    setProcessing(false);
    scheduleHide();
  };

  const startListening = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { setResponse('المتصفح لا يدعم الصوت'); scheduleHide(); return; }

    const recognition = new SR();
    recognition.lang      = 'ar-SA';
    recognition.onstart   = () => setListening(true);
    recognition.onend     = () => setListening(false);
    recognition.onresult  = (e: any) => {
      const said = e.results[0][0].transcript;
      handleCommand(said);
    };
    recognition.onerror = () => {
      setListening(false);
      setResponse('⚠️ تعذّر التعرف على الصوت');
      scheduleHide();
    };
    recognition.start();
  };

  /* لون الزر */
  const btnColor = listening  ? '#ef4444'
                 : processing ? '#f59e0b'
                 : '#3b82f6';

  const btnIcon  = listening  ? '🎤'
                 : processing ? '⏳'
                 : '🎤';

  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <button
        onClick={startListening}
        disabled={listening || processing}
        style={{
          width: '56px', height: '56px', borderRadius: '50%',
          background: btnColor,
          boxShadow: `0 4px 20px ${btnColor}80`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '22px', border: 'none', cursor: 'pointer',
          animation: listening ? 'pulse 1s ease-in-out infinite' : 'none',
          transition: 'all 0.3s', flexShrink: 0,
        }}
      >
        {btnIcon}
      </button>

      {(text || response) && (
        <div style={{
          position: 'absolute', bottom: '64px', left: 0,
          background: 'white', borderRadius: '16px',
          padding: '12px 14px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
          width: '200px', fontSize: '12px', zIndex: 50,
          animation: 'fadeInUp 0.2s ease',
          borderTop: `3px solid ${success ? '#22c55e' : processing ? '#f59e0b' : '#ef4444'}`,
        }} dir="rtl">
          {text && (
            <p style={{ color: '#6b7280', marginBottom: '6px', lineHeight: 1.5 }}>
              🎤 {text}
            </p>
          )}
          {processing && (
            <p style={{ color: '#f59e0b', fontWeight: 700 }}>
              🤖 جاري المعالجة...
            </p>
          )}
          {response && !processing && (
            <p style={{ color: success ? '#16a34a' : '#dc2626', fontWeight: 700, lineHeight: 1.5 }}>
              {response}
            </p>
          )}
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%,100% { transform: scale(1); }
          50%      { transform: scale(1.08); }
        }
      `}</style>
    </div>
  );
}

