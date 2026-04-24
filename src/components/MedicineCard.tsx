import { Medicine } from '../pages/Medicines';

type Props = {
  medicine: Medicine;
  onTaken: (id: number) => void;
  onDelete: (id: number) => void;
};

export default function MedicineCard({ medicine, onTaken, onDelete }: Props) {
  return (
    <div className={`rounded-2xl p-4 mb-3 shadow-sm border ${
      medicine.taken
        ? 'bg-green-50 border-green-200'
        : 'bg-white border-gray-100'
    }`}>

      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-gray-800 text-lg">{medicine.name}</h3>
          <p className="text-gray-500 text-sm">الجرعة: {medicine.dose}</p>
          <p className="text-gray-500 text-sm">🕐 {medicine.time}</p>
          <p className="text-gray-500 text-sm">📅 {medicine.days} يوم</p>
        </div>

        <button
          onClick={() => onDelete(medicine.id)}
          className="text-red-400 text-xl"
        >
          🗑️
        </button>
      </div>

      <div className="mt-3">
        {medicine.taken ? (
          <p className="text-green-600 font-bold">✅ تم الأخذ اليوم</p>
        ) : (
          <button
            onClick={() => onTaken(medicine.id)}
            className="w-full bg-blue-500 text-white py-2 rounded-xl font-bold"
          >
            أخذت الدواء
          </button>
        )}
      </div>

    </div>
  );
}