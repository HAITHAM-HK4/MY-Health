import { storage } from '../lib/storage';
// src/pages/Settings.tsx
import { useState, useEffect } from 'react';
import BMICalculator   from '../components/BMICalculator';
import DailyTip        from '../components/DailyTip';
import NearestPharmacy from '../components/NearestPharmacy';
import {
  requestPermission, isGranted, sendDailyStatus,
  startWaterReminder, stopWaterReminder,
  startAIReminder,   stopAIReminder,
  scheduleMedReminders,
  startHealthEmergencyReminder, stopHealthEmergencyReminder,
  sendHealthEmergencyNotif, buildHealthEmergencyText,
} from '../services/NotificationService';
import { Theme } from '../App';
import { useAuth } from '../context/AuthContext';

type Props = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  onEditProfile?: () => void;
};

function Card({ icon, title, accent, dark, children }: {
  icon: string; title: string; accent: string; dark: boolean; children: React.ReactNode;
}) {
  return (
    <div style={{
      background: dark ? 'rgba(255,255,255,0.025)' : '#ffffff',
      border: `1px solid ${accent}22`,
      borderRadius: '20px', overflow: 'hidden',
      marginBottom: '12px', position: 'relative',
      boxShadow: dark ? 'none' : '0 2px 12px rgba(0,0,0,0.05)',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: '8%', right: '8%', height: '1px',
        background: `linear-gradient(90deg,transparent,${accent}55,transparent)`,
      }} />
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '13px 16px 11px',
        borderBottom: `1px solid ${accent}14`,
      }}>
        <span style={{
          width: '32px', height: '32px', borderRadius: '10px', flexShrink: 0,
          background: `${accent}15`, border: `1px solid ${accent}28`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px',
        }}>{icon}</span>
        <span style={{ fontWeight: 800, fontSize: '14px', color: dark ? 'rgba(255,255,255,0.85)' : '#1e293b' }}>
          {title}
        </span>
      </div>
      <div style={{ padding: '14px 16px' }}>{children}</div>
    </div>
  );
}

function Label({ children, dark }: { children: string; dark: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '20px 0 10px' }}>
      <div style={{ flex: 1, height: '1px', background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.08)' }} />
      <span style={{
        fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px',
        color: dark ? 'rgba(255,255,255,0.22)' : '#94a3b8',
        textTransform: 'uppercase',
      }}>
        {children}
      </span>
      <div style={{ flex: 1, height: '1px', background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.08)' }} />
    </div>
  );
}

function Toggle({ value, onChange, color = '#6366f1' }: { value: boolean; onChange: () => void; color?: string }) {
  return (
    <div onClick={onChange} style={{
      width: '54px', height: '30px', borderRadius: '20px', cursor: 'pointer',
      background: value ? `linear-gradient(135deg,${color},${color}cc)` : 'rgba(148,163,184,0.25)',
      border: value ? 'none' : '1px solid rgba(148,163,184,0.3)',
      position: 'relative', transition: 'all 0.3s',
      boxShadow: value ? `0 0 16px ${color}55` : 'none', flexShrink: 0,
    }}>
      <div style={{
        position: 'absolute', top: '4px', width: '22px', height: '22px',
        background: 'white', borderRadius: '50%', transition: 'all 0.3s',
        right: value ? '4px' : 'auto', left: value ? 'auto' : '4px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
      }} />
    </div>
  );
}

function NotifRow({ icon, label, desc, value, onToggle, color, dark }: {
  icon: string; label: string; desc: string;
  value: boolean; onToggle: () => void; color?: string; dark: boolean;
}) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '12px 0',
      borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '20px' }}>{icon}</span>
        <div>
          <p style={{ fontSize: '13px', fontWeight: 700, color: dark ? 'rgba(255,255,255,0.85)' : '#1e293b', margin: 0 }}>
            {label}
          </p>
          <p style={{ fontSize: '11px', color: dark ? 'rgba(255,255,255,0.3)' : '#94a3b8', margin: '2px 0 0' }}>
            {desc}
          </p>
        </div>
      </div>
      <Toggle value={value} onChange={onToggle} color={color} />
    </div>
  );
}

export default function Settings({ theme, setTheme, onEditProfile }: Props) {
  const dark = theme === 'dark';
  const { logout, user, displayName, setDisplayName } = useAuth();
  const username = user?.username ?? '';

  const [name,      setName]      = useState('');
  const [age,       setAge]       = useState('');
  const [emergency, setEmergency] = useState('');
  const [saved,     setSaved]     = useState(false);
  const [granted,   setGranted]   = useState(false);
  const [notifWater,  setNotifWater]  = useState(true);
  const [notifMeds,   setNotifMeds]   = useState(true);
  const [notifAI,     setNotifAI]     = useState(true);
  const [notifSteps,  setNotifSteps]  = useState(false);
  const [notifSleep,  setNotifSleep]  = useState(false);
  const [notifDigest, setNotifDigest] = useState(false);
  const [notifStatus, setNotifStatus] = useState(true);

  // ── إشعار الطوارئ الصحي ─────────────────────────────────
  const [notifEmergency, setNotifEmergency] = useState(false);
  const [emergencyPreview, setEmergencyPreview] = useState<{ title: string; body: string } | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);

  useEffect(() => {
    setName(displayName || user?.username || '');
    setAge(storage.get('age') || '');
    setEmergency(storage.get('emergency') || '');
    setGranted(isGranted());
    setNotifWater(storage.get('notif_water')   !== 'false');
    setNotifMeds(storage.get('notif_meds')     !== 'false');
    setNotifAI(storage.get('notif_ai')         !== 'false');
    setNotifSteps(storage.get('notif_steps')   === 'true');
    setNotifSleep(storage.get('notif_sleep')   === 'true');
    setNotifDigest(storage.get('notif_digest') === 'true');
    setNotifStatus(storage.get('notif_status') !== 'false');
    setNotifEmergency(storage.get('notif_health_emergency') === 'true');
    setEmergencyPreview(buildHealthEmergencyText(username));
  }, [displayName, user, username]);

  const toggle = (key: string, val: boolean, setter: (v: boolean) => void) => {
    const next = !val;
    setter(next);
    storage.set(key, String(next));
    if (key === 'notif_water') next ? startWaterReminder() : stopWaterReminder();
    if (key === 'notif_ai')    next ? startAIReminder()    : stopAIReminder();
    if (key === 'notif_meds' && next) scheduleMedReminders();
  };

  const toggleEmergency = () => {
    const next = !notifEmergency;
    setNotifEmergency(next);
    storage.set('notif_health_emergency', String(next));
    if (next) startHealthEmergencyReminder(username);
    else stopHealthEmergencyReminder();
  };

  const activate = async () => {
    const ok = await requestPermission();
    setGranted(ok);
    if (ok) {
      startWaterReminder();
      startAIReminder();
      scheduleMedReminders();
      setTimeout(() => sendDailyStatus(), 1000);
    }
  };

  const save = () => {
    setDisplayName(name);
    storage.set('age', age);
    storage.set('emergency', emergency);
    setTimeout(() => setEmergencyPreview(buildHealthEmergencyText(username)), 100);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const pageBg     = dark ? '#08080f'                : '#f5f3ff';
  const headerGrad = dark
    ? 'linear-gradient(160deg,rgba(99,102,241,0.13) 0%,rgba(139,92,246,0.08) 60%,transparent 100%)'
    : 'linear-gradient(160deg,rgba(99,102,241,0.1)  0%,rgba(139,92,246,0.06) 60%,transparent 100%)';
  const headerBord = dark ? 'rgba(255,255,255,0.05)' : 'rgba(99,102,241,0.12)';
  const orbBg      = dark
    ? 'radial-gradient(circle,rgba(99,102,241,0.2) 0%,transparent 70%)'
    : 'radial-gradient(circle,rgba(99,102,241,0.18) 0%,transparent 70%)';
  const badgeBg    = dark ? 'rgba(99,102,241,0.1)'  : 'rgba(99,102,241,0.08)';
  const badgeBord  = dark ? 'rgba(99,102,241,0.22)' : 'rgba(99,102,241,0.2)';
  const badgeText  = dark ? 'rgba(129,140,248,0.95)': '#4338ca';
  const titleColor = dark ? 'white'                 : '#1e293b';
  const subText    = dark ? 'rgba(255,255,255,0.4)' : '#64748b';

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: dark ? 'rgba(255,255,255,0.04)' : '#f8fafc',
    border: `1px solid ${dark ? 'rgba(255,255,255,0.09)' : '#e2e8f0'}`,
    borderRadius: '12px', padding: '11px 14px',
    color: dark ? '#e2e8f0' : '#1e293b',
    fontSize: '14px', textAlign: 'right', outline: 'none',
    fontFamily: "'Cairo', sans-serif", marginBottom: '10px',
    transition: 'border-color 0.2s',
  };
  const inputFocusBorder = dark ? 'rgba(129,140,248,0.5)' : 'rgba(99,102,241,0.5)';
  const inputBlurBorder  = dark ? 'rgba(255,255,255,0.09)' : '#e2e8f0';

  const missingData = !emergencyPreview;

  return (
    <div className="min-h-screen pb-24 page-enter" dir="rtl"
      style={{ position: 'relative', zIndex: 1, background: pageBg, transition: 'background 0.4s' }}>

      {/* Header */}
      <div style={{
        padding: '1.5rem 1.25rem', background: headerGrad,
        borderBottom: `1px solid ${headerBord}`, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-50px', right: '-50px',
          width: '180px', height: '180px', borderRadius: '50%',
          background: orbBg, pointerEvents: 'none',
          animation: 'orb-drift 10s ease-in-out infinite',
        }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: badgeBg, border: `1px solid ${badgeBord}`,
            borderRadius: '20px', padding: '4px 12px', marginBottom: '12px',
          }}>
            <span style={{ fontSize: '11px', color: badgeText, fontWeight: 700 }}>⚙️ الإعدادات</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 900, color: titleColor, lineHeight: 1.2, marginBottom: '6px' }}>
            تخصيص التطبيق
          </h1>
          <p style={{ fontSize: '13px', color: subText }}>معلوماتك الشخصية وإعدادات العرض</p>
        </div>
      </div>

      <div style={{ padding: '1.25rem' }}>

        {/* ── المظهر ── */}
        <Label dark={dark}>المظهر</Label>
        <Card icon="🌙" title="وضع العرض" accent="#818cf8" dark={dark}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '14px', fontWeight: 700, color: dark ? 'rgba(255,255,255,0.8)' : '#1e293b', margin: '0 0 2px' }}>
                {dark ? 'وضع الليل 🌙' : 'وضع النهار ☀️'}
              </p>
              <p style={{ fontSize: '12px', color: dark ? 'rgba(255,255,255,0.3)' : '#94a3b8', margin: 0 }}>اضغط للتبديل</p>
            </div>
            <Toggle value={dark} onChange={() => setTheme(dark ? 'light' : 'dark')} />
          </div>
        </Card>

        {/* ── الإشعارات ── */}
        <Label dark={dark}>الإشعارات</Label>
        <Card icon="🔔" title="إعدادات الإشعارات" accent="#f59e0b" dark={dark}>
          {!granted ? (
            <div style={{ textAlign: 'center', padding: '8px 0 12px' }}>
              <p style={{ fontSize: '40px', marginBottom: '8px' }}>🔕</p>
              <p style={{ fontSize: '13px', color: dark ? 'rgba(255,255,255,0.5)' : '#64748b', marginBottom: '16px', lineHeight: 1.6 }}>
                فعّل الإشعارات لتصلك تذكيرات<br />الأدوية والماء والتحليل الصحي
              </p>
              <button onClick={activate} style={{
                background: 'linear-gradient(135deg,#f59e0b,#d97706)', border: 'none',
                borderRadius: '14px', padding: '12px 28px', color: 'white', fontWeight: 700,
                fontSize: '14px', fontFamily: "'Cairo',sans-serif", cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(245,158,11,0.4)',
              }}>🔔 تفعيل الإشعارات</button>
            </div>
          ) : (
            <div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)',
                borderRadius: '12px', padding: '10px 14px', marginBottom: '14px',
              }}>
                <span style={{ fontSize: '18px' }}>✅</span>
                <div>
                  <p style={{ fontSize: '13px', color: '#34d399', fontWeight: 700, margin: 0 }}>الإشعارات مفعّلة</p>
                  <p style={{ fontSize: '11px', color: dark ? 'rgba(255,255,255,0.3)' : '#94a3b8', margin: '2px 0 0' }}>
                    يمكنك التحكم بكل نوع بشكل منفصل
                  </p>
                </div>
              </div>
              <NotifRow icon="💧" label="تذكير الماء" desc="كل 3 ساعات" value={notifWater} color="#22d3ee" dark={dark} onToggle={() => toggle('notif_water', notifWater, setNotifWater)} />
              <NotifRow icon="💊" label="تذكير الأدوية" desc="عند موعد كل دواء تلقائياً" value={notifMeds} color="#f472b6" dark={dark} onToggle={() => toggle('notif_meds', notifMeds, setNotifMeds)} />
              <NotifRow icon="🤖" label="التحليل الذكي" desc="ملخص صحي كل 39 دقيقة" value={notifAI} color="#818cf8" dark={dark} onToggle={() => toggle('notif_ai', notifAI, setNotifAI)} />
              <NotifRow icon="📊" label="ملخص اليوم" desc="إشعار بإحصائيات يومك الصحي" value={notifStatus} color="#34d399" dark={dark} onToggle={() => toggle('notif_status', notifStatus, setNotifStatus)} />
              <NotifRow icon="🚶" label="تذكير الخطوات" desc="تشجيع للمشي عند انخفاض الخطوات" value={notifSteps} color="#f59e0b" dark={dark} onToggle={() => toggle('notif_steps', notifSteps, setNotifSteps)} />
              <NotifRow icon="😴" label="تذكير النوم" desc="تنبيه للنوم في الوقت المناسب" value={notifSleep} color="#c084fc" dark={dark} onToggle={() => toggle('notif_sleep', notifSleep, setNotifSleep)} />
              <NotifRow icon="🌍" label="الموجز الصحي" desc="آخر أخبار الصحة العالمية" value={notifDigest} color="#38bdf8" dark={dark} onToggle={() => toggle('notif_digest', notifDigest, setNotifDigest)} />
              <button onClick={sendDailyStatus} style={{
                width: '100%', marginTop: '14px', padding: '11px', borderRadius: '14px',
                border: `1px solid ${dark ? 'rgba(99,102,241,0.3)' : 'rgba(99,102,241,0.25)'}`,
                background: dark ? 'rgba(99,102,241,0.1)' : 'rgba(99,102,241,0.07)',
                color: dark ? 'rgba(129,140,248,0.9)' : '#4338ca',
                fontWeight: 700, fontSize: '13px', fontFamily: "'Cairo',sans-serif", cursor: 'pointer',
              }}>📊 إرسال ملخص اليوم الآن</button>
            </div>
          )}
        </Card>

        {/* ══ 🚨 إشعار الطوارئ الصحي ══ */}
        <Label dark={dark}>الطوارئ الصحية</Label>
        <Card icon="🚨" title="إشعار الطوارئ الصحي" accent="#ef4444" dark={dark}>

          {/* وصف */}
          <div style={{
            background: dark ? 'rgba(239,68,68,0.08)' : 'rgba(239,68,68,0.05)',
            border: `1px solid ${dark ? 'rgba(239,68,68,0.2)' : 'rgba(239,68,68,0.18)'}`,
            borderRadius: '14px', padding: '12px 14px', marginBottom: '14px',
          }}>
            <p style={{ fontSize: '13px', color: dark ? 'rgba(255,255,255,0.8)' : '#374151', margin: '0 0 6px', fontWeight: 700 }}>
              🆘 مفيد عند الإغماء أو الحوادث
            </p>
            <p style={{ fontSize: '12px', color: dark ? 'rgba(255,255,255,0.45)' : '#6b7280', margin: 0, lineHeight: 1.7 }}>
              يظهر إشعار ثابت على شاشة الجهاز يحتوي على <strong>فصيلة دمك</strong> و<strong>مرضك المزمن</strong> و<strong>رقم الطوارئ</strong> — ليراه المسعف حتى لو كان الجهاز مقفلاً.
            </p>
          </div>

          {/* مفتاح التفعيل */}
          {granted ? (
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '12px 0',
              borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
              marginBottom: '14px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '22px' }}>📳</span>
                <div>
                  <p style={{ fontSize: '13px', fontWeight: 700, color: dark ? 'rgba(255,255,255,0.85)' : '#1e293b', margin: 0 }}>
                    تفعيل إشعار الطوارئ
                  </p>
                  <p style={{ fontSize: '11px', color: dark ? 'rgba(255,255,255,0.3)' : '#94a3b8', margin: '2px 0 0' }}>
                    يتكرر كل ساعتين — يبقى على الشاشة حتى يُغلق
                  </p>
                </div>
              </div>
              <Toggle value={notifEmergency} onChange={toggleEmergency} color="#ef4444" />
            </div>
          ) : (
            <div style={{
              background: dark ? 'rgba(255,255,255,0.04)' : '#f9fafb',
              border: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : '#e5e7eb'}`,
              borderRadius: '12px', padding: '12px', marginBottom: '14px', textAlign: 'center',
            }}>
              <p style={{ fontSize: '12px', color: dark ? 'rgba(255,255,255,0.4)' : '#9ca3af', margin: 0 }}>
                ⚠️ فعّل الإشعارات أولاً من قسم الإشعارات أعلاه
              </p>
            </div>
          )}

          {/* حالة البيانات + معاينة */}
          {missingData ? (
            <div style={{
              background: dark ? 'rgba(251,191,36,0.08)' : 'rgba(251,191,36,0.07)',
              border: `1px solid ${dark ? 'rgba(251,191,36,0.2)' : 'rgba(251,191,36,0.3)'}`,
              borderRadius: '12px', padding: '12px 14px',
            }}>
              <p style={{ fontSize: '12px', color: dark ? '#fbbf24' : '#92400e', margin: 0, fontWeight: 700 }}>
                ⚠️ بيانات الطوارئ غير مكتملة
              </p>
              <p style={{ fontSize: '12px', color: dark ? 'rgba(255,255,255,0.4)' : '#6b7280', margin: '4px 0 0', lineHeight: 1.6 }}>
                أكمل الاستبيان الصحي (فصيلة الدم أو المرض المزمن) وأضف رقم الطوارئ في قسم معلوماتي أدناه.
              </p>
            </div>
          ) : (
            <>
              {/* زر المعاينة */}
              <button
                onClick={() => setPreviewVisible(v => !v)}
                style={{
                  width: '100%', padding: '10px', borderRadius: '12px',
                  border: `1px solid ${dark ? 'rgba(239,68,68,0.25)' : 'rgba(239,68,68,0.2)'}`,
                  background: dark ? 'rgba(239,68,68,0.07)' : 'rgba(239,68,68,0.05)',
                  color: dark ? '#fca5a5' : '#dc2626', fontWeight: 700, fontSize: '12px',
                  fontFamily: "'Cairo',sans-serif", cursor: 'pointer',
                  marginBottom: previewVisible ? '10px' : '0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                }}
              >
                {previewVisible ? '🔼 إخفاء المعاينة' : '👁️ معاينة محتوى الإشعار'}
              </button>

              {/* بطاقة المعاينة — تحاكي شاشة القفل */}
              {previewVisible && emergencyPreview && (
                <div style={{
                  background: dark ? 'rgba(10,10,20,0.97)' : 'rgba(20,20,40,0.94)',
                  borderRadius: '18px', padding: '16px',
                  border: '2px solid rgba(239,68,68,0.45)',
                  boxShadow: '0 8px 32px rgba(239,68,68,0.2)',
                  position: 'relative', overflow: 'hidden',
                  marginBottom: '10px',
                }}>
                  {/* شريط أحمر علوي */}
                  <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                    background: 'linear-gradient(90deg,#ef4444,#f97316,#ef4444)',
                  }} />
                  {/* رأس الإشعار */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <div style={{
                      width: '26px', height: '26px', borderRadius: '7px',
                      background: 'linear-gradient(135deg,#ef4444,#f97316)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '13px', flexShrink: 0,
                    }}>🏥</div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>تطبيق الصحة</p>
                      <p style={{ margin: 0, fontSize: '12px', color: '#fca5a5', fontWeight: 900 }}>
                        {emergencyPreview.title}
                      </p>
                    </div>
                    <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)' }}>الآن</span>
                  </div>
                  {/* محتوى الإشعار */}
                  <div style={{ paddingRight: '34px' }}>
                    {emergencyPreview.body.split('\n').map((line, i) => (
                      <p key={i} style={{
                        margin: '0 0 5px', fontSize: '13px',
                        color: i === 0 ? 'rgba(255,255,255,0.7)' : 'white',
                        fontWeight: line.includes('🩸') || line.includes('📞') ? 900 : 600,
                        lineHeight: 1.5,
                      }}>{line}</p>
                    ))}
                  </div>
                  <p style={{ margin: '10px 0 0', fontSize: '10px', color: 'rgba(255,255,255,0.25)', textAlign: 'center' }}>
                    هكذا يظهر الإشعار على شاشة الجهاز حتى لو مقفل
                  </p>
                </div>
              )}

              {/* إرسال فوري للتجربة */}
              {notifEmergency && (
                <button
                  onClick={() => sendHealthEmergencyNotif(username)}
                  style={{
                    width: '100%', padding: '11px', borderRadius: '14px', border: 'none',
                    background: 'linear-gradient(135deg,#ef4444,#f97316)',
                    color: 'white', fontWeight: 700, fontSize: '13px',
                    fontFamily: "'Cairo',sans-serif", cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(239,68,68,0.35)',
                  }}
                >
                  🚨 إرسال الإشعار الآن للتجربة
                </button>
              )}
            </>
          )}
        </Card>

        {/* ── نصيحة ── */}
        <Card icon="💡" title="نصيحة اليوم" accent="#fbbf24" dark={dark}>
          <DailyTip />
        </Card>

        {/* ── الملف الشخصي ── */}
        <Label dark={dark}>الملف الشخصي</Label>
        <Card icon="👤" title="معلوماتي" accent="#818cf8" dark={dark}>
          <input type="text" placeholder={user?.username || 'اسمك'} value={name}
            onChange={e => setName(e.target.value)} style={inputStyle}
            onFocus={e => (e.target as HTMLInputElement).style.borderColor = inputFocusBorder}
            onBlur={e  => (e.target as HTMLInputElement).style.borderColor = inputBlurBorder} />
          <input type="number" placeholder="عمرك" value={age}
            onChange={e => setAge(e.target.value)} style={inputStyle}
            onFocus={e => (e.target as HTMLInputElement).style.borderColor = inputFocusBorder}
            onBlur={e  => (e.target as HTMLInputElement).style.borderColor = inputBlurBorder} />
          <input type="tel" placeholder="رقم الطوارئ" value={emergency}
            onChange={e => setEmergency(e.target.value)}
            style={{ ...inputStyle, marginBottom: '14px' }}
            onFocus={e => (e.target as HTMLInputElement).style.borderColor = inputFocusBorder}
            onBlur={e  => (e.target as HTMLInputElement).style.borderColor = inputBlurBorder} />
          {onEditProfile && (
            <button onClick={onEditProfile} style={{
              width: '100%', padding: '11px', borderRadius: '14px',
              border: `1px solid ${dark ? 'rgba(129,140,248,0.3)' : 'rgba(99,102,241,0.25)'}`,
              background: dark ? 'rgba(99,102,241,0.1)' : 'rgba(99,102,241,0.07)',
              color: dark ? 'rgba(129,140,248,0.9)' : '#4338ca',
              fontWeight: 700, fontSize: '13px', fontFamily: "'Cairo',sans-serif",
              cursor: 'pointer', marginBottom: '10px',
            }}>📋 تعديل الاستبيان الصحي</button>
          )}
          <button onClick={save} style={{
            width: '100%', padding: '12px', borderRadius: '14px', border: 'none',
            background: saved ? 'linear-gradient(135deg,#059669,#34d399)' : 'linear-gradient(135deg,#6366f1,#8b5cf6)',
            color: 'white', fontWeight: 700, fontSize: '14px',
            fontFamily: "'Cairo',sans-serif", cursor: 'pointer',
            boxShadow: saved ? '0 4px 20px rgba(52,211,153,0.4)' : '0 4px 20px rgba(99,102,241,0.45)',
            transition: 'all 0.3s',
          }}>
            {saved ? '✅ تم الحفظ!' : '💾 حفظ'}
          </button>
        </Card>

        {/* ── أدوات ── */}
        <Label dark={dark}>أدوات إضافية</Label>
        <Card icon="🏥" title="أقرب صيدلية" accent="#34d399" dark={dark}>
          <NearestPharmacy />
        </Card>
        <Card icon="⚖️" title="مؤشر كتلة الجسم" accent="#fbbf24" dark={dark}>
          <BMICalculator />
        </Card>

        {/* ── الحساب ── */}
        <Label dark={dark}>الحساب</Label>
        <Card icon="🚪" title="تسجيل الخروج" accent="#ef4444" dark={dark}>
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <p style={{ fontSize: '13px', color: dark ? 'rgba(255,255,255,0.6)' : '#64748b', marginBottom: '14px' }}>
              أنت مسجل الدخول باسم: <strong style={{ color: dark ? 'white' : '#1e293b' }}>{user?.username}</strong>
            </p>
            <button onClick={logout} style={{
              width: '100%', padding: '14px', borderRadius: '16px',
              background: 'rgba(239,68,68,0.1)', color: '#ef4444',
              fontWeight: 900, fontSize: '15px', fontFamily: "'Cairo', sans-serif",
              cursor: 'pointer', border: '1px solid rgba(239,68,68,0.3)', transition: 'all 0.3s',
            }}
              onMouseEnter={e => (e.target as HTMLButtonElement).style.background = 'rgba(239,68,68,0.2)'}
              onMouseLeave={e => (e.target as HTMLButtonElement).style.background = 'rgba(239,68,68,0.1)'}
            >
              تسجيل الخروج من التطبيق
            </button>
          </div>
        </Card>

      </div>
    </div>
  );
}

