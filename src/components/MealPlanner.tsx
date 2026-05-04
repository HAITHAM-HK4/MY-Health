import { useState } from 'react';

const goals = ['صحة عامة', 'خسارة وزن', 'بناء عضلات', 'السكري', 'ضغط الدم'];

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
          content: 'أنت أخصائي تغذية محترف ومتخصص باللغة العربية. ردودك واضحة ومنظمة وعملية. اقترح وجبات بسيطة ومتاحة ومناسبة للهدف الصحي.',
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

export default function MealPlanner() {
  const [goal, setGoal] = useState('صحة عامة');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    setResult('');
    try {
      const prompt = `اقترح خطة وجبات يومية بالعربية لهدف: ${goal}
      تشمل: الفطور، الغداء، العشاء، وسناك صحي. اجعلها بسيطة ومتاحة.`;
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
        {loading ? '⏳ جاري التخطيط...' : '🍽️ اقترح وجبات اليوم'}
      </button>
      {result && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-sm text-gray-700 whitespace-pre-line">
          {result}
        </div>
      )}
    </div>
  );
}
