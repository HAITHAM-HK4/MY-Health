import { useState } from 'react';

const levels = ['مبتدئ', 'متوسط', 'متقدم'];
const goals  = ['صحة عامة', 'خسارة وزن', 'بناء عضلات', 'مرونة'];

export default function WorkoutPlanner() {
  const [level, setLevel] = useState('مبتدئ');
  const [goal, setGoal]   = useState('صحة عامة');
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
                text: `خطة تمرين يومية بالعربية - المستوى: ${level}، الهدف: ${goal}
                بدون معدات (في البيت). تشمل: إحماء، تمارين رئيسية، تبريد.`
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