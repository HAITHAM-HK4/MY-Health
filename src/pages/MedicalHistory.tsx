import { useState, useEffect } from 'react';

type Record = {
  id: number;
  type: 'مرض' | 'عملية' | 'حساسية' | 'إصابة';
  name: string;
  date: string;
  doctor: string;
  notes: string;
};

const types = ['مرض', 'عملية', 'حساسية', 'إصابة'] as const;
const typeColors = { 'مرض': 'bg-red-50 border-red-200', 'عملية': 'bg-orange-50 border-orange-200', 'حساسية': 'bg-yellow-50 border-yellow-200', 'إصابة': 'bg-blue-50 border-blue-200' };
const typeIcons  = { 'مرض': '🤒', 'عملية': '🏥', 'حساسية': '🤧', 'إصابة': '🩹' };

export default function MedicalHistory() {
  const [records, setRecords] = useState<Record[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [type, setType]     = useState<Record['type']>('مرض');
  const [name, setName]     = useState('');
  const [date, setDate]     = useState('');
  const [doctor, setDoctor] = useState('');
  const [notes, setNotes]   = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('medical_history');
    if (saved) setRecords(JSON.parse(saved));
  }, []);

  const save = () => {
    if (!name || !date) return alert('أدخل الاسم والتاريخ');
    const updated = [{ id: Date.now(), type, name, date, doctor, notes }, ...records];
    setRecords(updated);
    localStorage.setItem('medical_history', JSON.stringify(updated));
    setName(''); setDate(''); setDoctor(''); setNotes('');
    setShowForm(false);
  };

  const del = (id: number) => {
    const updated = records.filter(r => r.id !== id);
    setRecords(updated);
    localStorage.setItem('medical_history', JSON.stringify(updated));
  };

  return (
    <div className="p-4 pb-24" dir="rtl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">🧬 التاريخ الطبي</h1>
        <button onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-bold">
          {showForm ? '✕ إغلاق' : '+ إضافة'}
        </button>
      </div>

      {showForm && (
        <div className="bg-blue-50 rounded-2xl p-4 mb-4 border border-blue-100">
          <div className="flex gap-2 mb-3">
            {types.map(t => (
              <button key={t} onClick={() => setType(t)}
                className={`flex-1 py-2 rounded-xl text-sm font-bold border transition-all ${
                  type === t ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 border-gray-200'
                }`}>
                {typeIcons[t]} {t}
              </button>
            ))}
          </div>
          <input type="text" placeholder="الاسم" value={name}
            onChange={e => setName(e.target.value)}
            className="w-full border border-gray-200 rounded-xl p-3 mb-2 text-right" />
          <label className="text-sm text-gray-500">التاريخ:</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)}
            className="w-full border border-gray-200 rounded-xl p-3 mb-2" />
          <input type="text" placeholder="اسم الطبيب" value={doctor}
            onChange={e => setDoctor(e.target.value)}
            className="w-full border border-gray-200 rounded-xl p-3 mb-2 text-right" />
          <textarea placeholder="ملاحظات..." value={notes}
            onChange={e => setNotes(e.target.value)} rows={3}
            className="w-full border border-gray-200 rounded-xl p-3 mb-3 text-right" />
          <button onClick={save}
            className="w-full bg-blue-500 text-white py-3 rounded-xl font-bold">💾 حفظ</button>
        </div>
      )}

      {records.length === 0 ? (
        <div className="text-center text-gray-400 mt-20">
          <p className="text-5xl mb-3">🧬</p>
          <p>لا يوجد سجلات طبية</p>
        </div>
      ) : (
        records.map(r => (
          <div key={r.id} className={`rounded-2xl p-4 mb-3 shadow-sm border ${typeColors[r.type]}`}>
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span>{typeIcons[r.type]}</span>
                  <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{r.type}</span>
                </div>
                <h3 className="font-bold text-gray-800">{r.name}</h3>
                <p className="text-sm text-gray-500">📅 {r.date}</p>
                {r.doctor && <p className="text-sm text-gray-500">👨‍⚕️ {r.doctor}</p>}
                {r.notes && <p className="text-xs text-gray-400 mt-1">{r.notes}</p>}
              </div>
              <button onClick={() => del(r.id)} className="text-red-400 text-xl">🗑️</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}