import { useEffect, useState } from 'react';

export default function Home() {
  const today = new Date();
  const todayString = today.toDateString();

  const todayDate = today.toLocaleDateString('ar-SY', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const [name, setName] = useState('صديقي');
  const [water, setWater] = useState(0);
  const [steps, setSteps] = useState(0);
  const [sleep, setSleep] = useState(0);
  const [mood, setMood] = useState(0);
  const [medicinesDone, setMedicinesDone] = useState(0);
  const [medicinesTotal, setMedicinesTotal] = useState(0);

  useEffect(() => {
    setName(localStorage.getItem('username') || 'صديقي');
    setWater(Number(localStorage.getItem(`water_${todayString}`) || 0));
    setSteps(Number(localStorage.getItem(`steps_${todayString}`) || 0));
    setSleep(Number(localStorage.getItem(`sleep_${todayString}`) || 0));
    setMood(Number(localStorage.getItem(`mood_${todayString}`) || 0));

    const meds = JSON.parse(localStorage.getItem('medicines') || '[]');
    setMedicinesTotal(meds.length);
    setMedicinesDone(meds.filter((m: any) => m.taken).length);
  }, []);

  const moodEmoji = ['😐', '😢', '😟', '😐', '😊', '😄'][mood] || '😐';

  const cards = [
    {
      icon: '💊',
      label: 'الأدوية',
      value: medicinesTotal === 0
        ? 'لا يوجد'
        : `${medicinesDone}/${medicinesTotal}`,
      color: medicinesDone === medicinesTotal && medicinesTotal > 0
        ? 'bg-green-50 border-green-200'
        : 'bg-white border-gray-100',
      valueColor: medicinesDone === medicinesTotal && medicinesTotal > 0
        ? 'text-green-600'
        : 'text-blue-600',
    },
    {
      icon: '💧',
      label: 'الماء',
      value: `${water}/8 أكواب`,
      color: water >= 8 ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-100',
      valueColor: water >= 8 ? 'text-blue-600' : 'text-gray-600',
    },
    {
      icon: '🚶',
      label: 'الخطوات',
      value: steps > 0 ? steps.toLocaleString() : 'لم تسجل',
      color: steps >= 10000 ? 'bg-green-50 border-green-200' : 'bg-white border-gray-100',
      valueColor: steps >= 10000 ? 'text-green-600' : 'text-gray-600',
    },
    {
      icon: '😴',
      label: 'النوم',
      value: sleep > 0 ? `${sleep} ساعات` : 'لم تسجل',
      color: sleep >= 7 ? 'bg-purple-50 border-purple-200' : 'bg-white border-gray-100',
      valueColor: sleep >= 7 ? 'text-purple-600' : 'text-gray-600',
    },
    {
      icon: '😊',
      label: 'حالتك',
      value: mood > 0 ? moodEmoji : 'لم تسجل',
      color: 'bg-white border-gray-100',
      valueColor: 'text-gray-600',
    },
    {
      icon: '🔥',
      label: 'سعرات محروقة',
      value: steps > 0 ? `${Math.round(steps / 1000 * 40)} سعرة` : 'لم تسجل',
      color: 'bg-orange-50 border-orange-100',
      valueColor: 'text-orange-600',
    },
  ];

  return (
    <div className="p-4 pb-24" dir="rtl">

      {/* ترحيب */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-2xl p-5 text-white mb-4">
        <p className="text-sm opacity-80">{todayDate}</p>
        <h1 className="text-2xl font-bold mt-1">مرحباً {name} 👋</h1>
        <p className="text-sm mt-1 opacity-90">
          {medicinesTotal > 0 && medicinesDone === medicinesTotal
            ? '✅ أخذت كل أدويتك اليوم!'
            : '💊 لا تنسَ أدويتك اليوم'}
        </p>
      </div>

      {/* ملخص اليوم */}
      <h2 className="text-lg font-bold text-gray-700 mb-3">ملخص اليوم</h2>
      <div className="grid grid-cols-2 gap-3">
        {cards.map((card, i) => (
          <div
            key={i}
            className={`rounded-2xl p-4 shadow-sm border ${card.color}`}
          >
            <span className="text-3xl">{card.icon}</span>
            <p className="text-sm text-gray-500 mt-1">{card.label}</p>
            <p className={`font-bold text-lg ${card.valueColor}`}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* تحفيز */}
      <div className="mt-4 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl p-4 text-white text-center">
        <p className="font-bold text-lg">
          {water >= 8 && steps >= 10000 && sleep >= 7
            ? '🏆 يوم مثالي! أنت رائع!'
            : '💪 استمر، أنت تسير بالطريق الصحيح!'}
        </p>
      </div>

    </div>
  );
}