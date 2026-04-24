import { useState, useEffect } from 'react';

const moods = [
  { emoji: '😄', label: 'ممتاز', value: 5 },
  { emoji: '😊', label: 'جيد',   value: 4 },
  { emoji: '😐', label: 'عادي',  value: 3 },
  { emoji: '😟', label: 'متعب',  value: 2 },
  { emoji: '😢', label: 'سيء',   value: 1 },
];

export default function MoodTracker() {
  const today = new Date().toDateString();
  const key = `mood_${today}`;
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(key);
    if (saved) setSelected(Number(saved));
  }, []);

  const select = (val: number) => {
    setSelected(val);
    localStorage.setItem(key, String(val));
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm mb-3">
      <h2 className="font-bold text-gray-700 mb-3">😊 كيف تشعر اليوم؟</h2>
      <div className="flex justify-around">
        {moods.map(mood => (
          <button
            key={mood.value}
            onClick={() => select(mood.value)}
            className={`flex flex-col items-center p-2 rounded-xl transition-all ${
              selected === mood.value
                ? 'bg-blue-50 scale-110'
                : 'opacity-50'
            }`}
          >
            <span className="text-3xl">{mood.emoji}</span>
            <span className="text-xs text-gray-500 mt-1">{mood.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}