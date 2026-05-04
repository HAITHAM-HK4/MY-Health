import { useState } from 'react';

// استخدمنا نفس المفتاح والـ API الخاص بالمحادثة لضمان العمل
const GROQ_KEY = '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';

const symptoms = [
  '🤕 صداع', '🌡️ حمى', '🤢 غثيان', '💫 دوخة',
  '😮‍💨 ضيق تنفس', '🤧 رشح', '😴 إرهاق', '🫀 خفقان',
  '🦴 آلام مفاصل', '👁️ ألم عيون', '🤒 قشعريرة', '🍽️ فقدان شهية',
];

export default function SymptomAnalyzer() {
  const [selected, setSelected] = useState<string[]>([]);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const toggle = (s: string) =>
    setSelected(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const analyze = async () => {
    if (selected.length === 0) return alert('اختر أعراضاً أولاً');
    setLoading(true);
    setResult('');
    
    try {
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
              content: 'أنت مساعد طبي ذكي. قدم تحليلاً مبدئياً مبنياً على الأعراض، ودائماً انصح باستشارة طبيب للحالات المؤكدة.'
            },
            {
              role: 'user',
              content: `المريض يعاني من هذه الأعراض: ${selected.join('، ')}.
              قدم تحليلاً باللغة العربية يشمل:
              1. الأسباب المحتملة
              2. التوصيات العامة المنزلية
              3. متى يجب زيارة الطبيب فوراً
              كن مختصراً وواضحاً ومرتباً في نقاط.`
            }
          ],
          max_tokens: 1000,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.error?.message || 'خطأ غير معروف');
      setResult(data.choices[0].message.content);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setResult(`⚠️ تعذّر الاتصال: ${errorMsg}\nتحقق من اتصالك وحاول مجدداً.`);
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-2 mb-4">
        {symptoms.map(s => (
          <button key={s} onClick={() => toggle(s)}
            className={`p-2 rounded-xl text-sm border transition-all ${
              selected.includes(s)
                ? 'bg-purple-50 border-purple-400 text-purple-700'
                : 'bg-gray-50 border-gray-200 text-gray-600'
            }`}>
            {s}
          </button>
        ))}
      </div>
      <button onClick={analyze} disabled={loading}
        className="w-full bg-purple-500 text-white py-3 rounded-xl font-bold mb-4">
        {loading ? '⏳ جاري التحليل...' : '🔬 حلل الأعراض'}
      </button>
      {result && (
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-sm text-gray-700 whitespace-pre-line">
          {result}
          <p className="text-xs text-gray-400 mt-3">⚠️ ليس تشخيصاً طبياً</p>
        </div>
      )}
    </div>
  );
}
