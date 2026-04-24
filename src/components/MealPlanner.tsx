import { useState } from 'react';

const goals = ['صحة عامة', 'خسارة وزن', 'بناء عضلات', 'السكري', 'ضغط الدم'];

export default function MealPlanner() {
  const [goal, setGoal] = useState('صحة عامة');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    setResult('');
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.REACT_APP_GEMINI_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `اقترح خطة وجبات يومية بالعربية لهدف: ${goal}
                تشمل: الفطور، الغداء، العشاء، وسناك صحي. اجعلها بسيطة ومتاحة.`
              }]
            }],
          }),
        }
      );
      const data = await response.json();
      setResult(data.candidates[0].content.parts[0].text);
    } catch { setResult('حدث خطأ، حاول مرة ثانية'); }
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