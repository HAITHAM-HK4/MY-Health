const tips = [
  '💧 اشرب 8 أكواب ماء يومياً للحفاظ على صحتك',
  '🚶 30 دقيقة مشي يومياً تقلل خطر الأمراض بنسبة 30%',
  '😴 النوم 7-8 ساعات يحسن المناعة والتركيز',
  '🥦 تناول الخضار والفواكه يومياً لصحة أفضل',
  '🧘 التأمل 10 دقائق يومياً يقلل التوتر والقلق',
  '☀️ التعرض للشمس الصباحية يرفع مستوى فيتامين D',
  '🦷 تفريش الأسنان مرتين يومياً يحمي من الأمراض',
  '🏃 الرياضة المنتظمة تحسن المزاج وتقلل الاكتئاب',
  '🥗 تقليل السكر يحمي القلب والكبد والكلى',
  '📵 ابتعد عن الشاشات قبل النوم بساعة للنوم الأفضل',
];

export default function DailyTip() {
  const dayIndex = new Date().getDate() % tips.length;
  const tip = tips[dayIndex];

  return (
    <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-2xl p-4 shadow-sm mb-3 text-white">
      <p className="text-sm opacity-80 mb-1">💡 نصيحة اليوم</p>
      <p className="font-bold">{tip}</p>
    </div>
  );
}