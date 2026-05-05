import { storage } from '../lib/storage';
// src/services/NotificationService.ts

export type NotifType = 'water' | 'meds' | 'ai' | 'steps' | 'sleep' | 'digest';

/* ── ترجمات ── */
const CHRONIC_LABEL: Record<string, string> = {
  none: 'بصحة جيدة', diabetes: 'مريض سكري', bp: 'ضغط الدم',
  heart: 'أمراض القلب', asthma: 'الربو', kidney: 'مرض الكلى',
  thyroid: 'الغدة الدرقية', other: 'أمراض مزمنة أخرى',
};

/* ── طلب الإذن ── */
export const requestPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
};

export const isGranted = () =>
  'Notification' in window && Notification.permission === 'granted';

/* ── إرسال إشعار ── */
export const sendNotif = (
  title: string,
  body: string,
  icon = '/logo192.png',
  tag = 'health-app',
) => {
  if (!isGranted()) return;
  new Notification(title, { body, icon, tag, dir: 'rtl' });
};

/* ── الإشعار الثابت (معلومات اليوم) ── */
export const sendDailyStatus = () => {
  if (!isGranted()) return;
  const today = new Date().toDateString();
  const water  = storage.get(`water_${today}`)  || '0';
  const steps  = storage.get(`steps_${today}`)  || '0';
  const sleep  = storage.get(`sleep_${today}`)  || '0';
  const meds   = JSON.parse(storage.get('medicines') || '[]');
  const taken  = meds.filter((m: any) => m.taken).length;

  const lines = [
    `💧 الماء: ${water}/8 أكواب`,
    `🚶 الخطوات: ${steps}`,
    `😴 النوم: ${sleep} ساعة`,
    `💊 الأدوية: ${taken}/${meds.length}`,
  ].join('\n');

  new Notification('📊 ملخص يومك الصحي', {
    body: lines,
    icon: '/logo192.png',
    tag: 'daily-status',
    dir: 'rtl',
  });
};

/* ── تذكير الماء كل 3 ساعات ── */
let waterTimer: NodeJS.Timeout | null = null;

export const startWaterReminder = () => {
  if (waterTimer) clearInterval(waterTimer);
  const THREE_HOURS = 3 * 60 * 60 * 1000;

  const remind = () => {
    if (!isGranted()) return;
    if (storage.get('notif_water') === 'false') return;
    sendNotif(
      '💧 وقت الماء!',
      'هل شربت كوباً من الماء؟ حافظ على ترطيب جسمك 💙',
      '/logo192.png',
      'water-reminder',
    );
  };

  waterTimer = setInterval(remind, THREE_HOURS);
};

export const stopWaterReminder = () => {
  if (waterTimer) { clearInterval(waterTimer); waterTimer = null; }
};

/* ── تذكير الأدوية ── */
export const scheduleMedReminders = () => {
  const meds = JSON.parse(storage.get('medicines') || '[]');
  meds.forEach((med: any) => {
    if (!med.time || med.taken) return;
    const [h, m] = med.time.split(':').map(Number);
    const now  = new Date();
    const fire = new Date();
    fire.setHours(h, m, 0, 0);
    const diff = fire.getTime() - now.getTime();
    if (diff > 0 && diff < 24 * 60 * 60 * 1000) {
      setTimeout(() => {
        if (storage.get('notif_meds') === 'false') return;
        sendNotif(
          `💊 وقت دوائك!`,
          `حان وقت تناول: ${med.name}`,
          '/logo192.png',
          `med-${med.id}`,
        );
      }, diff);
    }
  });
};

/* ── تذكير AI كل 39 دقيقة ── */
let aiTimer: NodeJS.Timeout | null = null;
export const startAIReminder = () => {
  if (aiTimer) clearInterval(aiTimer);
  aiTimer = setInterval(() => {
    if (storage.get('notif_ai') === 'false') return;
    const summary = storage.get('ai_summary') || '';
    if (summary) {
      sendNotif('🤖 تحليلك الصحي', summary, '/logo192.png', 'ai-reminder');
    }
  }, 39 * 60 * 1000);
};

export const stopAIReminder = () => {
  if (aiTimer) { clearInterval(aiTimer); aiTimer = null; }
};

/* ══════════════════════════════════════════════════════════════
   🚨 إشعار الطوارئ الصحي
   يعرض: فصيلة الدم + المرض المزمن + رقم الطوارئ
   يتكرر كل ساعتين — يبقى على شاشة القفل حتى يُغلق
══════════════════════════════════════════════════════════════ */

export const buildHealthEmergencyText = (username: string): { title: string; body: string } | null => {
  const pKey = (id: string) =>
    username ? `profile_${username}_${id}` : `profile_${id}`;

  const name      = storage.get('display_name_' + username) || username || '';
  const bloodType = storage.get(pKey('blood_type'));
  const chronicRaw= storage.get(pKey('chronic'));
  const emergency = storage.get('emergency') || '';
  const age       = storage.get(pKey('age')) || '';

  const chronic = chronicRaw && chronicRaw !== 'none'
    ? CHRONIC_LABEL[chronicRaw] ?? chronicRaw
    : null;

  if (!bloodType && !chronic && !emergency) return null;

  const lines: string[] = [];
  if (name) lines.push(`👤 ${name}${age ? `  |  ${age} سنة` : ''}`);
  if (bloodType && bloodType !== 'unknown') lines.push(`🩸 فصيلة الدم: ${bloodType}`);
  if (chronic) lines.push(`🏥 ${chronic}`);
  if (emergency) lines.push(`📞 اتصل: ${emergency}`);

  return {
    title: '🚨 معلومات طبية طارئة',
    body: lines.join('\n'),
  };
};

export const sendHealthEmergencyNotif = (username: string) => {
  if (!isGranted()) return;
  if (storage.get('notif_health_emergency') === 'false') return;
  const info = buildHealthEmergencyText(username);
  if (!info) return;
  new Notification(info.title, {
    body: info.body,
    icon: '/logo192.png',
    tag: 'health-emergency',
    dir: 'rtl',
    requireInteraction: true,
  });
};

let emergencyTimer: NodeJS.Timeout | null = null;

export const startHealthEmergencyReminder = (username: string) => {
  if (emergencyTimer) clearInterval(emergencyTimer);
  sendHealthEmergencyNotif(username);
  emergencyTimer = setInterval(() => {
    if (storage.get('notif_health_emergency') === 'false') {
      stopHealthEmergencyReminder();
      return;
    }
    sendHealthEmergencyNotif(username);
  }, 2 * 60 * 60 * 1000);
};

export const stopHealthEmergencyReminder = () => {
  if (emergencyTimer) { clearInterval(emergencyTimer); emergencyTimer = null; }
};

