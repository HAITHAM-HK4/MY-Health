import { storage } from '../lib/storage';
import { useState } from 'react';

const GROQ_KEY = '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';

const callAI = async (prompt: string): Promise<string> => {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
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
          content: 'أنت مساعد صحي ذكي ومحفز باللغة العربية. اكتب تقارير صحية يومية واضحة ومشجعة بناءً على بيانات المستخدم.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 1000,
    }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data?.error?.message || 'خطأ غير معروف');
  return data.choices[0].message.content;
};

export default function DailyReport() {
  const [report, setReport] = useState('');
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    setReport('');
    const today = new Date().toDateString();
    const water = storage.get(`water_${today}`) || '0';
    const steps = storage.get(`steps_${today}`) || '0';
    const sleep = storage.get(`sleep_${today}`) || '0';
    const mood  = storage.get(`mood_${today}`) || '0';
    const meds  = JSON.parse(storage.get('medicines') || '[]');
    const taken = meds.filter((m: any) => m.taken).length;

    try {
      const prompt = `بيانات اليوم: ماء=${water}/8, خطوات=${steps}, نوم=${sleep}ساعة, مزاج=${mood}/5, أدوية=${taken}/${meds.length}
      اكتب تقريراً صحياً يومياً بالعربية يشمل: تقييم عام، نقاط قوة، نقاط تحسين، نصائح لغد أفضل. اجعله محفزاً.`;
      const text = await callAI(prompt);
      setReport(text);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setReport(`⚠️ تعذّر الاتصال: ${errorMsg}\nتحقق من اتصالك وحاول مجدداً.`);
    }
    setLoading(false);
  };

  return (
    <div>
      <button onClick={generate} disabled={loading}
        className="w-full bg-purple-500 text-white py-3 rounded-xl font-bold mb-4">
        {loading ? '⏳ جاري التوليد...' : '📊 ولّد تقرير اليوم'}
      </button>
      {report && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-gray-700 whitespace-pre-line">
          {report}
        </div>
      )}
    </div>
  );
}

