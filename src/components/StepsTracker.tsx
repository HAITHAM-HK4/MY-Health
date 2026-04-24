import { useState, useEffect } from 'react';

export default function StepsTracker() {
  const today = new Date().toDateString();
  const key = `steps_${today}`;

  const [steps, setSteps] = useState(0);
  const [input, setInput] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem(key);
    if (saved) setSteps(Number(saved));
  }, []);

  const save = () => {
    const val = Number(input);
    if (!val) return;
    setSteps(val);
    localStorage.setItem(key, String(val));
    setInput('');
  };

  // حساب السعرات: كل 1000 خطوة = 40 سعرة
  const calories = Math.round((steps / 1000) * 40);
  const goal = 10000;
  const percent = Math.min((steps / goal) * 100, 100);

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm mb-3">
      <h2 className="font-bold text-gray-700 mb-3">🚶 الخطوات</h2>

      <div className="bg-gray-100 rounded-full h-4 mb-3">
        <div
          className="bg-green-400 h-4 rounded-full transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="flex justify-between text-sm text-gray-500 mb-3">
        <span>{steps.toLocaleString()} خطوة</span>
        <span>🔥 {calories} سعرة</span>
        <span>الهدف: {goal.toLocaleString()}</span>
      </div>

      <div className="flex gap-2">
        <input
          type="number"
          placeholder="أدخل عدد الخطوات"
          value={input}
          onChange={e => setInput(e.target.value)}
          className="flex-1 border border-gray-200 rounded-xl p-2 text-right"
        />
        <button
          onClick={save}
          className="bg-green-500 text-white px-4 rounded-xl font-bold"
        >
          حفظ
        </button>
      </div>
    </div>
  );
}