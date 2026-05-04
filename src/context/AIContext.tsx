import { storage } from '../lib/storage';
// src/context/AIContext.tsx
import { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';

const GROQ_KEY    = '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';
const INTERVAL_MS = 39 * 60 * 1000; // 39 دقيقة

export type AIInsight = {
  page: string;
  message: string;
  type: 'tip' | 'warning' | 'praise' | 'info';
  updatedAt: number;
};

type AIContextType = {
  insights: Record<string, AIInsight>;
  globalSummary: string;
  loading: boolean;
  lastUpdated: string;
  refresh: () => void;
};

const AIContext = createContext<AIContextType>({
  insights: {},
  globalSummary: '',
  loading: false,
  lastUpdated: '',
  refresh: () => {},
});

const collectData = () => {
  const today    = new Date().toDateString();
  const water    = storage.get(`water_${today}`)    || '0';
  const steps    = storage.get(`steps_${today}`)    || '0';
  const sleep    = storage.get(`sleep_${today}`)    || '0';
  const mood     = storage.get(`mood_${today}`)     || '0';
  const sugar    = storage.get(`sugar_${today}`)    || '0';
  const bp       = storage.get(`bp_${today}`)       || '';
  const meds     = JSON.parse(storage.get('medicines')      || '[]');
  const notes    = JSON.parse(storage.get('notes')          || '[]');
  // إصلاح: استخدام 'medical_history' (المفتاح الصحيح المستخدم في MedicalHistory.tsx)
  const history  = JSON.parse(storage.get('medical_history') || '[]');
  const weight   = storage.get('weight') || '0';
  const height   = storage.get('height') || '0';
  const taken    = meds.filter((m: any) => m.taken).length;
  const missed   = meds.filter((m: any) => !m.taken).map((m: any) => m.name).join(', ');

  // بيانات الإنجازات
  const waterNum  = Number(water);
  const stepsNum  = Number(steps);
  const sleepNum  = Number(sleep);
  const allTaken  = meds.length > 0 && meds.every((m: any) => m.taken);
  const bpArr     = JSON.parse(storage.get('bp_readings')    || '[]');
  const sugarArr  = JSON.parse(storage.get('sugar_readings') || '[]');

  const unlockedCount = [
    waterNum >= 8,
    stepsNum >= 10000,
    sleepNum >= 8,
    allTaken,
    bpArr.length > 0,
    sugarArr.length > 0,
    waterNum >= 8 && stepsNum >= 10000 && sleepNum >= 7 && allTaken,
    meds.length >= 3,
  ].filter(Boolean).length;

  const totalAchievements = 8;

  // أنواع السجلات الطبية
  const historyTypes = {
    مرض:    history.filter((r: any) => r.type === 'مرض').length,
    عملية:  history.filter((r: any) => r.type === 'عملية').length,
    حساسية: history.filter((r: any) => r.type === 'حساسية').length,
    إصابة:  history.filter((r: any) => r.type === 'إصابة').length,
  };

  return {
    water: `${water}/8`, steps, sleep, mood, sugar, bp,
    meds: `${taken}/${meds.length}`, missed,
    notes: notes.length, history: history.length,
    weight, height,
    unlockedCount, totalAchievements,
    historyTypes,
    waterNum, stepsNum, sleepNum, allTaken,
  };
};

const callGroq = async (prompt: string): Promise<string> => {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GROQ_KEY}` },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: 'أنت مساعد صحي ذكي. ردودك قصيرة جداً ومحفزة باللغة العربية. جملتان فقط.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 150,
    }),
  });
  const data = await res.json();
  return data.choices[0].message.content;
};

const generateInsights = async (): Promise<{ insights: Record<string, AIInsight>; summary: string }> => {
  const d   = collectData();
  const now = Date.now();

  const tasks: Record<string, { prompt: string; type: AIInsight['type'] }> = {
    home: {
      prompt: `ماء=${d.water}, خطوات=${d.steps}, نوم=${d.sleep}ساعة, مزاج=${d.mood}/5, أدوية=${d.meds}. قيّم يومه بجملتين محفزتين.`,
      type: 'info',
    },
    medicines: {
      prompt: `أخذ ${d.meds} أدوية. ${d.missed ? `فاته: ${d.missed}` : 'أخذ كل أدويته'}. اعطه رسالة مناسبة.`,
      type: d.missed ? 'warning' : 'praise',
    },
    health: {
      prompt: `ماء=${d.water}, خطوات=${d.steps}, نوم=${d.sleep}ساعة, سكر=${d.sugar}, ضغط=${d.bp||'غير مسجل'}, وزن=${d.weight}كغ. ملاحظة صحية واحدة مهمة.`,
      type: 'tip',
    },
    symptoms: {
      prompt: `مزاج المستخدم ${d.mood}/5 ونام ${d.sleep}ساعة. هل يجب الانتباه لشيء؟`,
      type: 'info',
    },
    notes: {
      prompt: `لديه ${d.notes} ملاحظة. شجّعه على تسجيل صحته يومياً.`,
      type: 'tip',
    },
    history: {
      prompt: `لديه ${d.history} سجل طبي: ${d.historyTypes.مرض} مرض, ${d.historyTypes.عملية} عملية, ${d.historyTypes.حساسية} حساسية, ${d.historyTypes.إصابة} إصابة. ${d.history === 0 ? 'شجّعه على تسجيل تاريخه الطبي.' : 'قيّم تنوع سجلاته وأهمية توثيق التاريخ الطبي.'}`,
      type: d.history === 0 ? 'tip' : 'info',
    },
    records: {
      prompt: `وزنه ${d.weight}كغ وطوله ${d.height}سم. اعطه ملاحظة عن مؤشر كتلة الجسم.`,
      type: 'tip',
    },
    calendar: {
      prompt: `لديه بيانات صحية يومية مسجّلة في التقويم. نصيحة عن أهمية الانتظام في التسجيل اليومي.`,
      type: 'tip',
    },
    vaccines: {
      prompt: `لديه لقاحات مسجلة. ذكّره بأهمية متابعة مواعيد الجرعات القادمة والالتزام بها.`,
      type: 'info',
    },
    // ✅ جديد: تحليل الإنجازات
    achievements: {
      prompt: `فتح المستخدم ${d.unlockedCount} إنجازاً من أصل ${d.totalAchievements}. ${
        d.unlockedCount === 0
          ? 'شجّعه على البدء بأنشطته اليومية لفتح أول إنجاز.'
          : d.unlockedCount === d.totalAchievements
          ? 'فتح كل الإنجازات اليوم! احتفِ بإنجازه وشجّعه على الاستمرار غداً.'
          : `ماء=${d.water}, خطوات=${d.steps}, نوم=${d.sleep}ساعة. حفّزه لإكمال الإنجازات المتبقية.`
      }`,
      type: d.unlockedCount === d.totalAchievements ? 'praise' : d.unlockedCount === 0 ? 'tip' : 'info',
    },
    // ✅ جديد: تحليل التاريخ الطبي (للسجلات الطبية)
    medical_history: {
      prompt: `لديه ${d.history} سجل طبي: ${d.historyTypes.مرض} مرض, ${d.historyTypes.عملية} عملية, ${d.historyTypes.حساسية} حساسية, ${d.historyTypes.إصابة} إصابة. ${
        d.historyTypes.حساسية > 0
          ? 'نبّهه بأن وجود حساسيات مسجلة مهم لإعلام الأطباء عنها دائماً.'
          : d.history === 0
          ? 'شجّعه على توثيق تاريخه الطبي لمساعدة الأطباء مستقبلاً.'
          : 'أشد على يده لتسجيله المنتظم وذكّره بمشاركة السجلات مع طبيبه.'
      }`,
      type: d.historyTypes.حساسية > 0 ? 'warning' : d.history === 0 ? 'tip' : 'praise',
    },
  };

  const insights: Record<string, AIInsight> = {};

  await Promise.all(
    Object.entries(tasks).map(async ([page, { prompt, type }]) => {
      try {
        const message = await callGroq(prompt);
        insights[page] = { page, message, type, updatedAt: now };
      } catch {
        insights[page] = { page, type: 'info', updatedAt: now, message: 'تعذّر التحليل، حاول لاحقاً.' };
      }
    })
  );

  let summary = '';
  try {
    summary = await callGroq(
      `ماء=${d.water}, خطوات=${d.steps}, نوم=${d.sleep}ساعة, مزاج=${d.mood}/5, أدوية=${d.meds}. جملة واحدة تلخّص يومه الصحي.`
    );
  } catch { summary = ''; }

  return { insights, summary };
};

export function AIProvider({ children }: { children: ReactNode }) {
  const [insights,      setInsights]      = useState<Record<string, AIInsight>>({});
  const [globalSummary, setGlobalSummary] = useState('');
  const [loading,       setLoading]       = useState(false);
  const [lastUpdated,   setLastUpdated]   = useState('');
  const timer = useRef<NodeJS.Timeout | null>(null);

  const refresh = async () => {
    setLoading(true);
    try {
      const { insights: newI, summary } = await generateInsights();
      setInsights(newI);
      setGlobalSummary(summary);
      const time = new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
      setLastUpdated(time);
      storage.set('ai_insights', JSON.stringify(newI));
      storage.set('ai_summary',  summary);
      storage.set('ai_updated',  time);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => {
    // استرجاع آخر تحليل محفوظ
    const saved   = storage.get('ai_insights');
    const summary = storage.get('ai_summary');
    const updated = storage.get('ai_updated');
    if (saved)   setInsights(JSON.parse(saved));
    if (summary) setGlobalSummary(summary);
    if (updated) setLastUpdated(updated);

    // تحليل فوري + كل 39 دقيقة
    refresh();
    timer.current = setInterval(refresh, INTERVAL_MS);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, []);

  return (
    <AIContext.Provider value={{ insights, globalSummary, loading, lastUpdated, refresh }}>
      {children}
    </AIContext.Provider>
  );
}

export const useAI = () => useContext(AIContext);

