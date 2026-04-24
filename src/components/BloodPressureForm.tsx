import { useState, useEffect } from 'react';

type Reading = {
  systolic: number;
  diastolic: number;
  date: string;
};

export default function BloodPressureForm() {
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [readings, setReadings] = useState<Reading[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('bp_readings');
    if (saved) setReadings(JSON.parse(saved));
  }, []);

  const save = () => {
    if (!systolic || !diastolic) return alert('املأ الحقلين');
    const newReading: Reading = {
      systolic: Number(systolic),
      diastolic: Number(diastolic),
      date: new Date().toLocaleDateString('ar-SY'),
    };
    const updated = [newReading, ...readings].slice(0, 10);
    setReadings(updated);
    localStorage.setItem('bp_readings', JSON.stringify(updated));
    setSystolic('');
    setDiastolic('');
  };

  const getStatus = (s: number, d: number) => {
    if (s < 120 && d < 80)  return { text: 'طبيعي ✅',       color: 'text-green-600' };
    if (s < 130 && d < 80)  return { text: 'مرتفع قليلاً ⚠️', color: 'text-yellow-600' };
    if (s < 140 || d < 90)  return { text: 'مرتفع 🔴',        color: 'text-orange-600' };
    return                          { text: 'خطر! 🚨',         color: 'text-red-600' };
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm mb-3">
      <h2 className="font-bold text-gray-700 mb-3">🫀 ضغط الدم</h2>

      <div className="flex gap-2 mb-2">
        <input
          type="number"
          placeholder="الانقباضي (120)"
          value={systolic}
          onChange={e => setSystolic(e.target.value)}
          className="flex-1 border border-gray-200 rounded-xl p-3 text-right"
        />
        <input
          type="number"
          placeholder="الانبساطي (80)"
          value={diastolic}
          onChange={e => setDiastolic(e.target.value)}
          className="flex-1 border border-gray-200 rounded-xl p-3 text-right"
        />
      </div>

      <button
        onClick={save}
        className="w-full bg-red-400 text-white py-3 rounded-xl font-bold mb-4"
      >
        💾 تسجيل القراءة
      </button>

      {readings.length > 0 && (
        <div>
          <p className="text-sm text-gray-500 mb-2">آخر القراءات:</p>
          {readings.map((r, i) => {
            const status = getStatus(r.systolic, r.diastolic);
            return (
              <div key={i} className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-500 text-sm">{r.date}</span>
                <span className="font-bold">{r.systolic}/{r.diastolic}</span>
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