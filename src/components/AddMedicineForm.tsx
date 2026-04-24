import { useState } from 'react';
import { Medicine } from '../pages/Medicines';

type Props = {
  onAdd: (med: Omit<Medicine, 'id' | 'taken'>) => void;
};

export default function AddMedicineForm({ onAdd }: Props) {
  const [name, setName] = useState('');
  const [dose, setDose] = useState('');
  const [time, setTime] = useState('');
  const [days, setDays] = useState(7);

  const handleSubmit = () => {
    if (!name || !dose || !time) return alert('املأ كل الحقول');
    onAdd({ name, dose, time, days });
  };

  return (
    <div className="bg-blue-50 rounded-2xl p-4 mb-4 border border-blue-100">
      <h2 className="font-bold text-blue-700 mb-3">إضافة دواء جديد</h2>

      <input
        type="text"
        placeholder="اسم الدواء"
        value={name}
        onChange={e => setName(e.target.value)}
        className="w-full border border-gray-200 rounded-xl p-3 mb-2 text-right"
      />

      <input
        type="text"
        placeholder="الجرعة (مثال: حبة واحدة)"
        value={dose}
        onChange={e => setDose(e.target.value)}
        className="w-full border border-gray-200 rounded-xl p-3 mb-2 text-right"
      />

      <input
        type="time"
        value={time}
        onChange={e => setTime(e.target.value)}
        className="w-full border border-gray-200 rounded-xl p-3 mb-2"
      />

      <div className="flex items-center gap-2 mb-3">
        <label className="text-gray-600 text-sm">عدد الأيام:</label>
        <input
          type="number"
          value={days}
          onChange={e => setDays(Number(e.target.value))}
          className="border border-gray-200 rounded-xl p-2 w-20 text-center"
          min={1}
        />
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-500 text-white py-3 rounded-xl font-bold"
      >
        💾 حفظ الدواء
      </button>
    </div>
  );
}