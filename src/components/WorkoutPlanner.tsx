import { useState } from 'react';

const levels = ['مبتدئ', 'متوسط', 'متقدم'];
const goals  = ['صحة عامة', 'خسارة وزن', 'بناء عضلات', 'مرونة'];

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
          content: 'أنت مدرب لياقة بدنية محترف ومتخصص باللغة العربية. ردودك واضحة ومنظمة وعملية. استخدم إيموجي باعتدال. قدم خططاً آمنة ومناسبة.',
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

export default function WorkoutPlanner() {
  const [level, setLevel] = useState('مبتدئ');
  const [goal, setGoal]   = useState('صحة عامة');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    setResult('');
    try {
      const prompt = `خطة تمرين يومية بالعربية - المستوى: ${level}، الهدف: ${goal}
      بدون معدات (في البيت). تشمل: إحماء، تمارين رئيسية، تبريد.`;
      const text = await callAI(prompt);
      setResult(text);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setResult(`⚠️ تعذّر الاتصال: ${errorMsg}\nتحقق من اتصالك وحاول مجدداً.`);
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="flex gap-2 mb-3">
        {levels.map(l => (
          <button key={l} onClick={() => setLevel(l)}
            className={`flex-1 py-2 rounded-xl text-sm border transition-all ${
              level === l ? 'bg-purple-500 text-white' : 'bg-gray-50 text-gray-600 border-gray-200'
            }`}>
            {l}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {goals.map(g => (
          <button key={g} onClick={() => setGoal(g)}
            className={`px-3 py-2 rounded-xl text-sm border transition-all ${
              goal === g ? 'bg-purple-500 text-white' : 'bg-gray-50 text-gray-600 border-gray-200'
            }`}>
            {g}
          </button>
        ))}
      </div>
      <button onClick={generate} disabled={loading}
        className="w-full bg-purple-500 text-white py-3 rounded-xl font-bold mb-4">
        {loading ? '⏳ جاري التخطيط...' : '🧘 اقترح خطة تمرين'}
      </button>
      {result && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-gray-700 whitespace-pre-line">
          {result}
        </div>
      )}
    </div>
  );
}
