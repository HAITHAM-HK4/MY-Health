import { useState } from 'react';
import CalendarDay from '../components/CalendarDay';

export default function Calendar() {
  const today = new Date();
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const year = today.getFullYear();
  const month = today.getMonth();

  const monthName = today.toLocaleDateString('ar-SY', {
    month: 'long',
    year: 'numeric',
  });

  // عدد أيام الشهر
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // أول يوم في الشهر
  const firstDay = new Date(year, month, 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const getDayData = (day: number) => {
    const date = new Date(year, month, day).toDateString();
    const water = localStorage.getItem(`water_${date}`);
    const mood = localStorage.getItem(`mood_${date}`);
    const medicines = JSON.parse(localStorage.getItem('medicines') || '[]');
    const allTaken = medicines.length > 0 && medicines.every((m: any) => m.taken);

    return { water: Number(water || 0), mood: Number(mood || 0), allTaken };
  };

  const selectedData = selectedDay ? getDayData(selectedDay) : null;
  const selectedDate = selectedDay
    ? new Date(year, month, selectedDay).toLocaleDateString('ar-SY', {
        weekday: 'long', day: 'numeric', month: 'long',
      })
    : null;

  return (
    <div className="p-4 pb-24" dir="rtl">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">📅 {monthName}</h1>

      {/* أيام الأسبوع */}
      <div className="grid grid-cols-7 mb-2">
        {['أح', 'إث', 'ث', 'أر', 'خ', 'ج', 'س'].map(d => (
          <p key={d} className="text-center text-xs text-gray-400 font-bold">{d}</p>
        ))}
      </div>

      {/* الأيام */}
      <div className="grid grid-cols-7 gap-1">
        {/* فراغ أول الشهر */}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {days.map(day => {
          const data = getDayData(day);
          const isToday = day === today.getDate();

          return (
            <CalendarDay
              key={day}
              day={day}
              isToday={isToday}
              isSelected={selectedDay === day}
              water={data.water}
              mood={data.mood}
              allTaken={data.allTaken}
              onClick={() => setSelectedDay(day === selectedDay ? null : day)}
            />
          );
        })}
      </div>

      {/* تفاصيل اليوم المختار */}
      {selectedDay && selectedData && (
        <div className="mt-4 bg-white rounded-2xl p-4 shadow-sm">
          <h2 className="font-bold text-gray-700 mb-3">📋 {selectedDate}</h2>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <span className="text-gray-500">💧 الماء</span>
              <span className="font-bold">{selectedData.water} أكواب</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">😊 الحالة</span>
              <span className="font-bold">
                {['', '😢', '😟', '😐', '😊', '😄'][selectedData.mood] || 'لم يسجل'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">💊 الأدوية</span>
              <span className="font-bold">
                {selectedData.allTaken ? '✅ تم' : '❌ لم يكتمل'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}