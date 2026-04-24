import { useEffect, useState } from 'react';

type Achievement = {
  id: string;
  icon: string;
  title: string;
  desc: string;
  unlocked: boolean;
};

export default function Achievements() {
  const [points, setPoints] = useState(0);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    const today = new Date().toDateString();
    const water = Number(localStorage.getItem(`water_${today}`) || 0);
    const steps = Number(localStorage.getItem(`steps_${today}`) || 0);
    const sleep = Number(localStorage.getItem(`sleep_${today}`) || 0);
    const meds  = JSON.parse(localStorage.getItem('medicines') || '[]');
    const allTaken = meds.length > 0 && meds.every((m: any) => m.taken);
    const bp    = JSON.parse(localStorage.getItem('bp_readings') || '[]');
    const sugar = JSON.parse(localStorage.getItem('sugar_readings') || '[]');

    const list: Achievement[] = [
      { id: 'water8',    icon: '💧', title: 'شارب الماء',    desc: 'اشرب 8 أكواب في يوم',        unlocked: water >= 8 },
      { id: 'steps10k',  icon: '🚶', title: 'المشي البطل',   desc: 'امشِ 10,000 خطوة',           unlocked: steps >= 10000 },
      { id: 'sleep8',    icon: '😴', title: 'النوم الجيد',   desc: 'نم 8 ساعات كاملة',           unlocked: sleep >= 8 },
      { id: 'meds',      icon: '💊', title: 'ملتزم بالدواء', desc: 'خذ كل أدويتك في يوم',        unlocked: allTaken },
      { id: 'bp',        icon: '🫀', title: 'متابع الضغط',   desc: 'سجّل قراءة ضغط دم',          unlocked: bp.length > 0 },
      { id: 'sugar',     icon: '🩸', title: 'متابع السكر',   desc: 'سجّل قراءة سكر',             unlocked: sugar.length > 0 },
      { id: 'perfect',   icon: '🏆', title: 'يوم مثالي',     desc: 'ماء + مشي + نوم + دواء',     unlocked: water >= 8 && steps >= 10000 && sleep >= 7 && allTaken },
      { id: 'meds3',     icon: '📋', title: 'منظم الصحة',    desc: 'أضف 3 أدوية أو أكثر',        unlocked: meds.length >= 3 },
    ];

    setPoints(list.filter(a => a.unlocked).length * 100);
    setAchievements(list);
  }, []);

  const unlocked = achievements.filter(a => a.unlocked);
  const locked   = achievements.filter(a => !a.unlocked);

  return (
    <div className="p-4 pb-24" dir="rtl">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">🏆 الإنجازات</h1>

      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-5 text-white text-center mb-4">
        <p className="text-5xl font-bold">{points}</p>
        <p className="text-lg mt-1">نقطة</p>
        <p className="text-sm opacity-80 mt-1">{unlocked.length} من {achievements.length} إنجاز</p>
      </div>

      {unlocked.length > 0 && (
        <>
          <h2 className="font-bold text-gray-700 mb-2">✅ إنجازاتك</h2>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {unlocked.map(a => (
              <div key={a.id} className="bg-yellow-50 border border-yellow-200 rounded-2xl p-3 text-center">
                <span className="text-3xl">{a.icon}</span>
                <p className="font-bold text-gray-800 text-sm mt-1">{a.title}</p>
                <p className="text-xs text-gray-500">{a.desc}</p>
                <p className="text-xs text-yellow-600 font-bold mt-1">+100 نقطة</p>
              </div>
            ))}
          </div>
        </>
      )}

      {locked.length > 0 && (
        <>
          <h2 className="font-bold text-gray-400 mb-2">🔒 إنجازات قادمة</h2>
          <div className="grid grid-cols-2 gap-3">
            {locked.map(a => (
              <div key={a.id} className="bg-gray-100 rounded-2xl p-3 text-center opacity-50">
                <span className="text-3xl">{a.icon}</span>
                <p className="font-bold text-gray-500 text-sm mt-1">{a.title}</p>
                <p className="text-xs text-gray-400">{a.desc}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}