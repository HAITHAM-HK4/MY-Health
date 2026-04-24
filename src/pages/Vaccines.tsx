import { useState, useEffect } from 'react';

type Vaccine = {
  id: number;
  name: string;
  date: string;
  nextDate: string;
  notes: string;
};

export default function Vaccines() {
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [nextDate, setNextDate] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('vaccines');
    if (saved) setVaccines(JSON.parse(saved));
  }, []);

  const save = () => {
    if (!name || !date) return alert('أدخل الاسم والتاريخ');
    const updated = [...vaccines, { id: Date.now(), name, date, nextDate, notes }];
    setVaccines(updated);
    localStorage.setItem('vaccines', JSON.stringify(updated));
    setName(''); setDate(''); setNextDate(''); setNotes('');
    setShowForm(false);
  };

  const del = (id: number) => {
    const updated = vaccines.filter(v => v.id !== id);
    setVaccines(updated);
    localStorage.setItem('vaccines', JSON.stringify(updated));
  };

  const isPast = (d: string) => d && new Date(d).getTime() < Date.now();
  const isNear = (d: string) => {
    if (!d) return false;
    const diff = new Date(d).getTime() - Date.now();
    return diff > 0 && diff < 30 * 24 * 60 * 60 * 1000;
  };

  return (
    <div className="p-4 pb-24" dir="rtl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">💉 التطعيمات</h1>
        <button onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-bold">
          {showForm ? '✕ إغلاق' : '+ إضافة'}
        </button>
      </div>

      {showForm && (
        <div className="bg-blue-50 rounded-2xl p-4 mb-4 border border-blue-100">
          <input type="text" placeholder="اسم اللقاح" value={name}
            onChange={e => setName(e.target.value)}
            className="w-full border border-gray-200 rounded-xl p-3 mb-2 text-right" />
          <label className="text-sm text-gray-500">تاريخ آخر جرعة:</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)}
            className="w-full border border-gray-200 rounded-xl p-3 mb-2" />
          <label className="text-sm text-gray-500">تاريخ الجرعة القادمة:</label>
          <input type="date" value={nextDate} onChange={e => setNextDate(e.target.value)}
            className="w-full border border-gray-200 rounded-xl p-3 mb-2" />
          <input type="text" placeholder="ملاحظات" value={notes}
            onChange={e => setNotes(e.target.value)}
            className="w-full border border-gray-200 rounded-xl p-3 mb-3 text-right" />
          <button onClick={save}
            className="w-full bg-blue-500 text-white py-3 rounded-xl font-bold">💾 حفظ</button>
        </div>
      )}

      {vaccines.length === 0 ? (
        <div className="text-center text-gray-400 mt-20">
          <p className="text-5xl mb-3">💉</p>
          <p>لا يوجد تطعيمات مسجلة</p>
        </div>
      ) : (
        vaccines.map(v => (
          <div key={v.id} className={`rounded-2xl p-4 mb-3 shadow-sm border ${
            isPast(v.nextDate) ? 'bg-red-50 border-red-200' :
            isNear(v.nextDate) ? 'bg-yellow-50 border-yellow-200' :
            'bg-white border-gray-100'
          }`}>
            <div className="flex justify-between">
              <div>
                <h3 className="font-bold text-gray-800">{v.name}</h3>
                <p className="text-sm text-gray-500">📅 {v.date}</p>
                {v.nextDate && (
                  <p className={`text-sm font-bold ${
                    isPast(v.nextDate) ? 'text-red-600' :
                    isNear(v.nextDate) ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {isPast(v.nextDate) ? '⚠️ متأخر: ' :
                     isNear(v.nextDate) ? '🔔 قريباً: ' : '✅ القادم: '}
                    {v.nextDate}
                  </p>
                )}
                {v.notes && <p className="text-xs text-gray-400 mt-1">{v.notes}</p>}
              </div>
              <button onClick={() => del(v.id)} className="text-red-400 text-xl">🗑️</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}