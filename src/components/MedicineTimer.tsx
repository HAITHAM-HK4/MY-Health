import { storage } from '../lib/storage';
import { useState, useEffect } from 'react';

type Medicine = {
  id: number;
  name: string;
  time: string;
  taken: boolean;
};

export default function MedicineTimer() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const saved = storage.get('medicines');
    if (saved) setMedicines(JSON.parse(saved));

    // تحديث كل ثانية
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const getTimeLeft = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    const target = new Date();
    target.setHours(h, m, 0, 0);

    let diff = target.getTime() - now.getTime();

    // إذا فات الوقت اليوم، احسب للغد
    if (diff < 0) diff += 24 * 60 * 60 * 1000;

    const hours   = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { hours, minutes, seconds, diff };
  };

  const notTaken = medicines.filter(m => !m.taken);

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm mb-3" dir="rtl">
      <h2 className="font-bold text-gray-700 mb-3">⏲️ موعد الدواء القادم</h2>

      {notTaken.length === 0 ? (
        <p className="text-center text-green-600 font-bold py-4">
          ✅ أخذت كل أدويتك اليوم!
        </p>
      ) : (
        notTaken
          .sort((a, b) => getTimeLeft(a.time).diff - getTimeLeft(b.time).diff)
          .slice(0, 3)
          .map(med => {
            const { hours, minutes, seconds, diff } = getTimeLeft(med.time);
            const isNear = diff < 30 * 60 * 1000; // أقل من 30 دقيقة

            return (
              <div key={med.id}
                className={`rounded-xl p-3 mb-2 ${
                  isNear ? 'bg-red-50 border border-red-200' : 'bg-gray-50'
                }`}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-gray-800">{med.name}</p>
                    <p className="text-sm text-gray-500">🕐 {med.time}</p>
                  </div>
                  <div className="text-center">
                    <p className={`text-2xl font-bold ${
                      isNear ? 'text-red-500' : 'text-blue-500'
                    }`}>
                      {String(hours).padStart(2,'0')}:{String(minutes).padStart(2,'0')}:{String(seconds).padStart(2,'0')}
                    </p>
                    <p className="text-xs text-gray-400">
                      {isNear ? '🔔 قريباً!' : 'متبقي'}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
      )}
    </div>
  );
}
