import { useState, useEffect } from 'react';

type Reading = {
  value: number;
  type: string;
  date: string;
};

export default function SugarForm() {
  const [value, setValue] = useState('');
  const [type, setType] = useState('صائم');
  const [readings, setReadings] = useState<Reading[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('sugar_readings');
    if (saved) setReadings(JSON.parse(saved));
  }, []);

  const save = () => {
    if (!value) return alert('أدخل قيمة السكر');
    const newReading: Reading = {
      value: Number(value),
      type,
      date: new Date().toLocaleDateString('ar-SY'),
    };
    const updated = [newReading, ...readings].slice(0, 10);
    setReadings(updated);
    localStorage.setItem('sugar_readings', JSON.stringify(updated));
    setValue('');
  };

  const getStatus = (val: number, t: string) => {
    if (t === 'صائم') {
      if (val < 100) return { text: 'طبيعي ✅',   color: 'text-green-600' };
      if (val < 126) return { text: 'ما قبل سكري ⚠️', color: 'text-yellow-600' };
      return               { text: 'سكري 🔴',      color: 'text-red-600' };
    } else {
      if (val < 140) return { text: 'طبيعي ✅',   color: 'text-green-600' };
      if (val < 200) return { text: 'مرتفع ⚠️',   color: 'text-yellow-600' };
      return               { text: 'سكري 🔴',      color: 'text-red-600' };
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm mb-3">
      <h2 className="font-bold text-gray-700 mb-3">🩸 مستوى السكر</h2>

      <div className="flex gap-2 mb-2">
        <select
          value={type}
          onChange={e => setType(e.target.value)}
          className="border border-gray-200 rounded-xl p-3"
        >
          <option>صائم</option>
          <option>بعد الأكل</option>
        </select>
        <input
          type="number"
          placeholder="القيمة (mg/dL)"
          value={value}
          onChange={e => setValue(e.target.value)}
          className="flex-1 border border-gray-200 rounded-xl p-3 text-right"
        />
      </div>

      <button
        onClick={save}
        className="w-full bg-pink-400 text-white py-3 rounded-xl font-bold mb-4"
      >
        💾 تسجيل القراءة
      </button>

      {readings.length > 0 && (
        <div>
          <p className="text-sm text-gray-500 mb-2">آخر القراءات:</p>
          {readings.map((r, i) => {
            const status = getStatus(r.value, r.type);
            return (
              <div key={i} className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-500 text-sm">{r.date}</span>
                <span className="font-bold">{r.value} - {r.type}</span>
                <span className={`text-sm font-bold ${status.color}`}>
                  {status.text}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}