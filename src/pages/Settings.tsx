import { useState, useEffect } from 'react';
import BMICalculator from '../components/BMICalculator';
import DailyTip from '../components/DailyTip';

export default function Settings() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [emergency, setEmergency] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setName(localStorage.getItem('username') || '');
    setAge(localStorage.getItem('age') || '');
    setEmergency(localStorage.getItem('emergency') || '');
  }, []);

  const save = () => {
    localStorage.setItem('username', name);
    localStorage.setItem('age', age);
    localStorage.setItem('emergency', emergency);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-4 pb-24" dir="rtl">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">⚙️ الإعدادات</h1>

      <DailyTip />

      {/* البروفايل */}
      <div className="bg-white rounded-2xl p-4 shadow-sm mb-3">
        <h2 className="font-bold text-gray-700 mb-3">👤 معلوماتي</h2>

        <input
          type="text"
          placeholder="اسمك"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full border border-gray-200 rounded-xl p-3 mb-2 text-right"
        />

        <input
          type="number"
          placeholder="عمرك"
          value={age}
          onChange={e => setAge(e.target.value)}
          className="w-full border border-gray-200 rounded-xl p-3 mb-2 text-right"
        />

        <input
          type="tel"
          placeholder="رقم الطوارئ"
          value={emergency}
          onChange={e => setEmergency(e.target.value)}
          className="w-full border border-gray-200 rounded-xl p-3 mb-3 text-right"
        />

        <button
          onClick={save}
          className="w-full bg-blue-500 text-white py-3 rounded-xl font-bold"
        >
          {saved ? '✅ تم الحفظ!' : '💾 حفظ'}
        </button>
      </div>

      <BMICalculator />

    </div>
  );
}