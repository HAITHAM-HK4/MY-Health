import { useState, useEffect } from 'react';

const allSymptoms = [
  { id: 1,  emoji: '🤕', label: 'صداع',         disease: 'توتر أو ضغط دم' },
  { id: 2,  emoji: '🌡️', label: 'حمى',          disease: 'عدوى أو التهاب' },
  { id: 3,  emoji: '😮‍💨', label: 'ضيق تنفس',    disease: 'مشكلة في الرئة' },
  { id: 4,  emoji: '🤢', label: 'غثيان',         disease: 'مشكلة في المعدة' },
  { id: 5,  emoji: '💫', label: 'دوخة',          disease: 'ضغط دم منخفض' },
  { id: 6,  emoji: '🦷', label: 'ألم أسنان',     disease: 'تسوس أو التهاب' },
  { id: 7,  emoji: '👁️', label: 'ألم عيون',      disease: 'إجهاد بصري' },
  { id: 8,  emoji: '🤧', label: 'رشح وعطاس',     disease: 'حساسية أو برد' },
  { id: 9,  emoji: '😴', label: 'إرهاق شديد',    disease: 'فقر دم أو نقص فيتامين' },
  { id: 10, emoji: '🫀', label: 'خفقان قلب',     disease: 'قلق أو مشكلة قلبية' },
];

export default function SymptomsList() {
  const today = new Date().toDateString();
  const key = `symptoms_${today}`;

  const [selected, setSelected] = useState<number[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(key);
    if (saved) setSelected(JSON.parse(saved));
  }, []);

  const toggle = (id: number) => {
    const updated = selected.includes(id)
      ? selected.filter(s => s !== id)
      : [...selected, id];
    setSelected(updated);
    localStorage.setItem(key, JSON.stringify(updated));
  };

  const selectedSymptoms = allSymptoms.filter(s => selected.includes(s.id));

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm mb-3">
      <h2 className="font-bold text-gray-700 mb-3">🤒 ما الذي تشعر به؟</h2>

      <div className="grid grid-cols-2 gap-2 mb-4">
        {allSymptoms.map(symptom => (
          <button
            key={symptom.id}
            onClick={() => toggle(symptom.id)}
            className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${
              selected.includes(symptom.id)
                ? 'bg-red-50 border-red-300 text-red-700'
                : 'bg-gray-50 border-gray-200 text-gray-600'
            }`}
          >
            <span>{symptom.emoji}</span>
            <span className="text-sm">{symptom.label}</span>
          </button>
        ))}
      </div>

      {/* تنبيه الأمراض المحتملة */}
      {selectedSymptoms.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
          <p className="font-bold text-yellow-700 mb-2">⚠️ أمراض محتملة:</p>
          {selectedSymptoms.map(s => (
            <p key={s.id} className="text-sm text-yellow-600">
              • {s.label} ← {s.disease}
            </p>
          ))}
          <p className="text-xs text-gray-400 mt-2">
            * هذا ليس تشخيصاً طبياً، استشر طبيبك
          </p>
        </div>
      )}
    </div>
  );
}