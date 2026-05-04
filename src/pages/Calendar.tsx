import { storage } from '../lib/storage';
import { useState } from 'react';
import CalendarDay from '../components/CalendarDay';
import { Theme } from '../App';
import AIInsightCard from '../components/AIInsightCard';

type Props = { theme?: Theme };

export default function Calendar({ theme }: Props) {
  const dark = theme === 'dark';
  const today = new Date();
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const year  = today.getFullYear();
  const month = today.getMonth();

  const monthName = today.toLocaleDateString('ar-SY', {
    month: 'long', year: 'numeric',
  });

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay    = new Date(year, month, 1).getDay();
  const days        = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const getDayData = (day: number) => {
    const date      = new Date(year, month, day).toDateString();
    const water     = storage.get(`water_${date}`);
    const mood      = storage.get(`mood_${date}`);
    const medicines = JSON.parse(storage.get('medicines') || '[]');
    const allTaken  = medicines.length > 0 && medicines.every((m: any) => m.taken);
    return { water: Number(water || 0), mood: Number(mood || 0), allTaken };
  };

  const selectedData = selectedDay ? getDayData(selectedDay) : null;
  const selectedDate = selectedDay
    ? new Date(year, month, selectedDay).toLocaleDateString('ar-SY', {
        weekday: 'long', day: 'numeric', month: 'long',
      })
    : null;

  const dayLabels = ['أح', 'إث', 'ث', 'أر', 'خ', 'ج', 'س'];

  const detailRows = selectedData
    ? [
        { label: '💧 الماء',  value: `${selectedData.water} أكواب`, color: '#22d3ee' },
        { label: '😊 المزاج', value: ['', '😢', '😟', '😐', '😊', '😄'][selectedData.mood] || 'لم يسجل', color: '#f472b6' },
        { label: '💊 الدواء', value: selectedData.allTaken ? '✅ مكتمل' : '○ لم يكتمل', color: '#818cf8' },
      ]
    : [];

  const pageBg      = dark ? '#08080f'                 : '#f0f9ff';
  const titleColor  = dark ? 'white'                   : '#1e293b';
  const textMuted   = dark ? 'rgba(255,255,255,0.4)'   : '#6b7280';
  const labelBg     = dark ? 'rgba(34,211,238,0.1)'    : 'rgba(6,182,212,0.08)';
  const labelBord   = dark ? 'rgba(34,211,238,0.22)'   : 'rgba(6,182,212,0.25)';
  const labelText   = dark ? 'rgba(34,211,238,0.95)'   : '#0e7490';
  const headerBg    = dark
    ? 'linear-gradient(160deg, rgba(34,211,238,0.12) 0%, rgba(99,102,241,0.08) 60%, transparent 100%)'
    : 'linear-gradient(160deg, rgba(34,211,238,0.1)  0%, rgba(99,102,241,0.06) 60%, transparent 100%)';
  const headerBord  = dark ? 'rgba(255,255,255,0.05)'  : 'rgba(34,211,238,0.15)';
  const calCardBg   = dark ? 'rgba(255,255,255,0.025)' : '#ffffff';
  const calCardBord = dark ? 'rgba(255,255,255,0.07)'  : 'rgba(0,0,0,0.07)';
  const calCardShdw = dark ? 'none'                    : '0 2px 16px rgba(0,0,0,0.05)';
  const dayLabelClr = dark ? 'rgba(129,140,248,0.6)'   : '#818cf8';
  const legendBord  = dark ? 'rgba(255,255,255,0.05)'  : 'rgba(0,0,0,0.07)';
  const legendText  = dark ? 'rgba(255,255,255,0.3)'   : '#94a3b8';
  const detailBg    = dark ? 'rgba(255,255,255,0.025)' : '#ffffff';
  const detailBord  = dark ? 'rgba(129,140,248,0.18)'  : 'rgba(129,140,248,0.2)';
  const detailShdw  = dark ? 'none'                    : '0 2px 16px rgba(99,102,241,0.07)';
  const dateTxtClr  = dark ? 'rgba(129,140,248,0.9)'   : '#4f46e5';
  const dateHdBord  = dark ? 'rgba(129,140,248,0.1)'   : 'rgba(129,140,248,0.12)';
  const rowLblClr   = dark ? 'rgba(255,255,255,0.5)'   : '#475569';

  return (
    <div className="min-h-screen pb-24 page-enter" dir="rtl"
      style={{ position: 'relative', zIndex: 1, background: pageBg, transition: 'background 0.4s' }}>

      {/* HEADER */}
      <div style={{
        padding: '2rem 1.25rem 1.5rem',
        background: headerBg,
        borderBottom: `1px solid ${headerBord}`,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-50px', right: '-50px',
          width: '180px', height: '180px', borderRadius: '50%',
          background: dark
            ? 'radial-gradient(circle, rgba(34,211,238,0.18) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(34,211,238,0.25) 0%, transparent 70%)',
          pointerEvents: 'none',
          animation: 'orb-drift 10s ease-in-out infinite',
        }} />

        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: labelBg,
            border: `1px solid ${labelBord}`,
            borderRadius: '20px', padding: '4px 12px',
            marginBottom: '12px',
          }}>
            <span style={{ fontSize: '11px', color: labelText, fontWeight: 700 }}>
              📅 التقويم الشهري
            </span>
          </div>

          <h1 style={{ fontSize: '24px', fontWeight: 900, color: titleColor, lineHeight: 1.2, marginBottom: '6px' }}>
            {monthName}
          </h1>
          <p style={{ fontSize: '13px', color: textMuted }}>
            اضغط على أي يوم لعرض تفاصيله
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ padding: '1.25rem' }}>

        <AIInsightCard page="calendar" theme={theme} />

        {/* بطاقة التقويم */}
        <div style={{
          background: calCardBg,
          border: `1px solid ${calCardBord}`,
          borderRadius: '22px',
          padding: '1rem',
          marginBottom: '12px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: calCardShdw,
        }}>
          <div style={{
            position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px',
            background: `linear-gradient(90deg, transparent, rgba(34,211,238,${dark ? '0.5' : '0.4'}), transparent)`,
          }} />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', marginBottom: '10px' }}>
            {dayLabels.map(d => (
              <p key={d} style={{
                textAlign: 'center', fontSize: '10px', fontWeight: 700,
                color: dayLabelClr, padding: '4px 0',
              }}>
                {d}
              </p>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '4px' }}>
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`e-${i}`} />
            ))}
            {days.map(day => {
              const data    = getDayData(day);
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

          <div style={{
            display: 'flex', gap: '14px', justifyContent: 'center',
            marginTop: '14px', paddingTop: '12px',
            borderTop: `1px solid ${legendBord}`,
          }}>
            {[
              { dot: '#22d3ee', label: 'ماء ✓' },
              { dot: '#f472b6', label: 'مزاج'  },
              { dot: '#818cf8', label: 'دواء ✓' },
            ].map((l, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: l.dot,
                  boxShadow: `0 0 6px ${l.dot}`,
                }} />
                <span style={{ fontSize: '10px', color: legendText, fontWeight: 600 }}>
                  {l.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* تفاصيل اليوم */}
        {selectedDay && selectedData && (
          <div style={{
            background: detailBg,
            border: `1px solid ${detailBord}`,
            borderRadius: '20px',
            overflow: 'hidden',
            position: 'relative',
            animation: 'page-enter 0.25s ease',
            boxShadow: detailShdw,
          }}>
            <div style={{
              position: 'absolute', top: 0, left: '8%', right: '8%', height: '1px',
              background: `linear-gradient(90deg, transparent, rgba(129,140,248,${dark ? '0.55' : '0.4'}), transparent)`,
            }} />

            <div style={{
              padding: '13px 16px 11px',
              borderBottom: `1px solid ${dateHdBord}`,
            }}>
              <p style={{ fontSize: '13px', fontWeight: 800, color: dateTxtClr }}>
                📋 {selectedDate}
              </p>
            </div>

            <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {detailRows.map((row, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 14px',
                  background: `${row.color}08`,
                  border: `1px solid ${row.color}18`,
                  borderRadius: '12px',
                }}>
                  <span style={{ fontSize: '13px', color: rowLblClr }}>
                    {row.label}
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: row.color }}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
