import { storage } from '../lib/storage';
// src/components/ProfileCard.tsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Theme } from '../App';

type Props = { theme?: Theme };

// ── ترجمة القيم للعربية ────────────────────────────────────
const MAP: Record<string, Record<string, string>> = {
  gender:      { male:'ذكر', female:'أنثى' },
  age:         { '<13':'أقل من 13','13-17':'13–17','18-24':'18–24','25-34':'25–34','35-44':'35–44','45-54':'45–54','55-64':'55–64','65+':'65 فأكثر' },
  height:      { '<150':'أقل من 150 سم','150-159':'150–159 سم','160-169':'160–169 سم','170-179':'170–179 سم','180-189':'180–189 سم','190+':'190+ سم' },
  weight:      { '<50':'أقل من 50 كغ','50-64':'50–64 كغ','65-79':'65–79 كغ','80-94':'80–94 كغ','95-109':'95–109 كغ','110+':'110+ كغ' },
  blood_type:  { 'A+':'A+','A-':'A−','B+':'B+','B-':'B−','AB+':'AB+','AB-':'AB−','O+':'O+','O-':'O−','unknown':'غير معروف' },
  marital:     { single:'أعزب', married:'متزوج', divorced:'مطلق', widowed:'أرمل' },
  health_goal: { medicines:'تتبع الأدوية', fitness:'تحسين اللياقة', weight:'إنقاص الوزن', chronic:'أمراض مزمنة', sleep:'النوم الجيد', general:'الصحة العامة' },
  activity:    { sedentary:'خامل', light:'نشاط خفيف', moderate:'معتدل', active:'مرتفع', athlete:'رياضي' },
  chronic:     { none:'لا يوجد', diabetes:'السكري', bp:'ضغط الدم', heart:'أمراض القلب', asthma:'الربو', kidney:'الكلى', thyroid:'الغدة الدرقية', other:'أخرى' },
  allergy:     { none:'لا يوجد', medicine:'أدوية', food:'طعام', dust:'غبار', seasonal:'موسمية', other:'أخرى' },
  smoke:       { never:'لا أدخن', yes:'مدخن', social:'أحياناً', stopped:'أقلعت' },
  sleep_hours: { '<5':'أقل من 5 ساعات','5-6':'5–6 ساعات','7-8':'7–8 ساعات','>8':'أكثر من 8 ساعات' },
  water:       { '<4':'أقل من 4','4-6':'4–6 أكواب','7-8':'7–8 أكواب','>8':'أكثر من 8' },
  diet:        { normal:'عادي', vegetarian:'نباتي', vegan:'نباتي صرف', keto:'كيتو', gluten:'خالٍ غلوتين', medical:'حمية طبية' },
};

type Field = { id: string; label: string; icon: string; color: string };

const FIELDS: Field[] = [
  { id:'gender',      label:'الجنس',             icon:'👤', color:'#6366f1' },
  { id:'age',         label:'العمر',              icon:'🎂', color:'#f59e0b' },
  { id:'height',      label:'الطول',              icon:'📏', color:'#06b6d4' },
  { id:'weight',      label:'الوزن',              icon:'⚖️', color:'#10b981' },
  { id:'blood_type',  label:'فصيلة الدم',         icon:'🩸', color:'#ef4444' },
  { id:'marital',     label:'الحالة الاجتماعية',  icon:'💍', color:'#ec4899' },
  { id:'health_goal', label:'الهدف الصحي',        icon:'🎯', color:'#8b5cf6' },
  { id:'activity',    label:'النشاط اليومي',      icon:'⚡', color:'#f97316' },
  { id:'chronic',     label:'الأمراض المزمنة',    icon:'🏥', color:'#14b8a6' },
  { id:'allergy',     label:'الحساسية',           icon:'⚠️', color:'#eab308' },
  { id:'smoke',       label:'التدخين',            icon:'🚬', color:'#94a3b8' },
  { id:'sleep_hours', label:'ساعات النوم',        icon:'🌙', color:'#6366f1' },
  { id:'water',       label:'الماء يومياً',       icon:'💧', color:'#38bdf8' },
  { id:'diet',        label:'النظام الغذائي',     icon:'🥗', color:'#22c55e' },
];

export default function ProfileCard({ theme }: Props) {
  const dark = theme !== 'light';
  const { user } = useAuth();
  const [expanded, setExpanded] = useState(false);

  const username = user?.username ?? '';

  // ── مفتاح التخزين خاص بكل مستخدم ──────────────────────
  const pKey = (id: string) =>
    username ? `profile_${username}_${id}` : `profile_${id}`;

  const getValue = (id: string): string | null => {
    const raw = storage.get(pKey(id));
    if (!raw) return null;
    return MAP[id]?.[raw] ?? raw;
  };

  const completionPercent = (): number => {
    const filled = FIELDS.filter(f => !!storage.get(pKey(f.id))).length;
    return Math.round((filled / FIELDS.length) * 100);
  };

  // ── التحقق من اكتمال الاستبيان (يدعم المفتاح القديم والجديد) ──
  const done =
    storage.get(`onboarding_done_${username}`) === 'true' ||
    storage.get('onboarding_done') === '1';

  const pct = completionPercent();

  if (!done || pct === 0) return null;

  const visibleFields = expanded ? FIELDS : FIELDS.slice(0, 6);

  return (
    <div style={{
      margin: '0 0 20px',
      background: dark
        ? 'linear-gradient(135deg,rgba(30,41,59,.9) 0%,rgba(15,23,42,.9) 100%)'
        : 'linear-gradient(135deg,rgba(255,255,255,.95) 0%,rgba(240,244,255,.95) 100%)',
      border: `1px solid ${dark ? 'rgba(99,102,241,.25)' : 'rgba(99,102,241,.2)'}`,
      borderRadius: 20,
      overflow: 'hidden',
      boxShadow: dark
        ? '0 8px 32px rgba(0,0,0,.35), 0 0 0 1px rgba(99,102,241,.1)'
        : '0 4px 20px rgba(99,102,241,.12)',
    }}>

      {/* ── رأس البطاقة ── */}
      <div style={{
        background: 'linear-gradient(135deg,rgba(99,102,241,.18),rgba(168,85,247,.12))',
        borderBottom: `1px solid ${dark ? 'rgba(99,102,241,.2)' : 'rgba(99,102,241,.15)'}`,
        padding: '14px 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* أفاتار دائري */}
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            background: 'linear-gradient(135deg,#6366f1,#a78bfa)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22,
            boxShadow: '0 0 14px rgba(99,102,241,.5)',
          }}>
            {getValue('gender') === 'ذكر' ? '👨'
              : getValue('gender') === 'أنثى' ? '👩'
              : '👤'}
          </div>

          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: dark ? '#e2e8f0' : '#1e293b' }}>
              ملفي الصحي
            </div>
            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>
              {getValue('health_goal') ?? 'صحتك بين يديك'}
            </div>
          </div>
        </div>

        {/* شريط الاكتمال */}
        <div style={{ textAlign: 'left', minWidth: 80 }}>
          <div style={{ fontSize: 11, color: '#818cf8', fontWeight: 700, marginBottom: 4 }}>
            {pct}% مكتمل
          </div>
          <div style={{
            height: 5, borderRadius: 99, width: 80,
            background: dark ? 'rgba(99,102,241,.15)' : 'rgba(99,102,241,.1)',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%', width: `${pct}%`,
              background: 'linear-gradient(90deg,#6366f1,#a78bfa)',
              borderRadius: 99,
              transition: 'width .5s ease',
              boxShadow: '0 0 6px rgba(99,102,241,.5)',
            }} />
          </div>
        </div>
      </div>

      {/* ── شبكة الحقول ── */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: 8, padding: '12px 14px',
      }}>
        {visibleFields.map(f => {
          const val = getValue(f.id);
          if (!val) return null;
          return (
            <div key={f.id} style={{
              background: dark ? 'rgba(255,255,255,.04)' : 'rgba(99,102,241,.05)',
              border: `1px solid ${dark ? 'rgba(255,255,255,.07)' : 'rgba(99,102,241,.12)'}`,
              borderRadius: 12,
              padding: '9px 11px',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <div style={{
                width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                background: `${f.color}22`,
                border: `1px solid ${f.color}44`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14,
              }}>
                {f.icon}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 10, color: '#64748b', marginBottom: 1 }}>
                  {f.label}
                </div>
                <div style={{
                  fontSize: 12, fontWeight: 700,
                  color: dark ? '#e2e8f0' : '#1e293b',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {val}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── زر عرض المزيد / أقل ── */}
      <button
        onClick={() => setExpanded(e => !e)}
        style={{
          width: '100%',
          background: 'transparent',
          border: 'none',
          borderTop: `1px solid ${dark ? 'rgba(255,255,255,.06)' : 'rgba(99,102,241,.1)'}`,
          padding: '10px 0',
          color: '#818cf8',
          fontSize: 12, fontWeight: 700,
          cursor: 'pointer', fontFamily: 'inherit',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}
      >
        {expanded ? '▲ عرض أقل' : `▼ عرض كل المعلومات (${FIELDS.length - 6} حقل إضافي)`}
      </button>
    </div>
  );
}

