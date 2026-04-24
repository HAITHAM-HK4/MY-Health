import { useState, useEffect } from 'react';
import MedicineCard from '../components/MedicineCard';
import AddMedicineForm from '../components/AddMedicineForm';

export type Medicine = {
  id: number;
  name: string;
  dose: string;
  time: string;
  days: number;
  taken: boolean;
};

export default function Medicines() {
const [medicines, setMedicines] = useState<Medicine[]>(() => {
  const saved = localStorage.getItem('medicines');
  return saved ? JSON.parse(saved) : [];
});
  const [showForm, setShowForm] = useState(false);

 

  // حفظ في localStorage عند أي تغيير
  useEffect(() => {
    localStorage.setItem('medicines', JSON.stringify(medicines));
  }, [medicines]);

  const addMedicine = (med: Omit<Medicine, 'id' | 'taken'>) => {
    const newMed: Medicine = {
      ...med,
      id: Date.now(),
      taken: false,
    };
    setMedicines([...medicines, newMed]);
    setShowForm(false);
  };

  const markTaken = (id: number) => {
    setMedicines(medicines.map(m =>
      m.id === id ? { ...m, taken: true } : m
    ));
  };

  const deleteMedicine = (id: number) => {
    setMedicines(medicines.filter(m => m.id !== id));
  };

  return (
    <div className="p-4 pb-24" dir="rtl">

      {/* العنوان */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">💊 الأدوية</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-bold"
        >
          {showForm ? '✕ إغلاق' : '+ إضافة'}
        </button>
      </div>

      {/* فورم الإضافة */}
      {showForm && (
        <AddMedicineForm onAdd={addMedicine} />
      )}

      {/* القائمة */}
      {medicines.length === 0 ? (
        <div className="text-center text-gray-400 mt-20">
          <p className="text-5xl mb-3">💊</p>
          <p>لا يوجد أدوية بعد</p>
          <p className="text-sm">اضغط + إضافة لتسجيل دوائك</p>
        </div>
      ) : (
        medicines.map(med => (
          <MedicineCard
            key={med.id}
            medicine={med}
            onTaken={markTaken}
            onDelete={deleteMedicine}
          />
        ))
      )}

    </div>
  );
}