import { useState } from 'react';

export default function DailyReport() {
  const [report, setReport] = useState('');
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    setReport('');
    const today = new Date().toDateString();
    const water = localStorage.getItem(`water_${today}`) || '0';
    const steps = localStorage.getItem(`steps_${today}`) || '0';
    const sleep = localStorage.getItem(`sleep_${today}`) || '0';
    const mood  = localStorage.getItem(`mood_${today}`) || '0';
    const meds  = JSON.parse(localStorage.getItem('medicines') || '[]');
    const taken = meds.filter((m: any) => m.taken).length;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.REACT_APP_GEMINI_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `بيانات اليوم: ماء=${water}/8, خطوات=${steps}, نوم=${sleep}ساعة, مزاج=${mood}/5, أدوية=${taken}/${meds.length}
                اكتب تقريراً صحياً يومياً بالعربية يشمل: تقييم عام، نقاط قوة، نقاط تحسين، نصائح لغد أفضل. اجعله محفزاً.`
              }]
            }],
          }),
        }
      );
      const data = await response.json();
      setReport(data.candidates[0].content.parts[0].text);
    } catch { setReport('حدث خطأ، حاول مرة ثانية'); }
    setLoading(false);
  };

  return (
    <div>
      <button onClick={generate} disabled={loading}
        className="w-full bg-purple-500 text-white py-3 rounded-xl font-bold mb-4">
        {loading ? '⏳ جاري التوليد...' : '📊 ولّد تقرير اليوم'}
      </button>
      {report && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-gray-700 whitespace-pre-line">
          {report}
        </div>
      )}
    </div>
  );
}