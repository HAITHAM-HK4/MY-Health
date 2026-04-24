import { useState, useEffect } from 'react';

export default function SleepTracker() {
  const today = new Date().toDateString();
  const key = `sleep_${today}`;

  const [hours, setHours] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem(key);
    if (saved) setHours(Number(saved));
  }, []);

  const update = (val: number) => {
    const newVal = Math.min(24, Math.max(0, hours + val));
    setHours(newVal);
    localStorage.setItem(key, String(newVal));
  };

  const getStatus = () => {
    if (hours === 0) return { text: 'لم تسجل بعد', color: 'text-gray-400' };
    if (hours < 6) return { text: 'نوم قليل جداً 😟', color: 'text-red-500' };
    if (hours < 7) return { text: 'نوم أقل من المثالي', color: 'text-yellow-500' };
    if (hours <= 9) return { text: 'نوم ممتاز! 😊', color: 'text-green-500' };
    return { text: 'نوم كثير 😴', color: 'text-yellow-500' };
  };

  const status = getStatus();

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm mb-3">
      <h2 className="font-bold text-gray-700 mb-3">😴 النوم</h2>

      <p className="text-center text-5xl font-bold text-gray-800 mb-1">
        {hours}
      </p>
      <p className="text-center text-gray-500 mb-2">ساعات</p>
      <p className={`text-center font-bold mb-4 ${status.color}`}>
        {status.text}
      </p>

      <div className="flex justify-center gap-4">
        <button
          onClick={() => update(-1)}
          className="bg-gray-100 text-gray-700 w-12 h-12 rounded-full text-2xl font-bold"
        >
          −
        </button>
        <button
          onClick={() => update(1)}
          className="bg-purple-500 text-white w-12 h-12 rounded-full text-2xl font-bold"
        >
          +
        </button>
      </div>
    </div>
  );
}