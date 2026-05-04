import { storage } from '../lib/storage';
// src/components/WaterReminderNotif.tsx
import { useEffect, useRef } from 'react';

const THREE_HOURS = 3 * 60 * 60 * 1000;

export default function WaterReminderNotif() {
  const timer = useRef<NodeJS.Timeout | null>(null);

  const ask = () => {
    if (Notification.permission !== 'granted') return;
    if (storage.get('notif_water') === 'false') return;

    const today = new Date().toDateString();
    const water = parseInt(storage.get(`water_${today}`) || '0');

    // إشعار السؤال
    const notif = new Notification('💧 هل شربت الماء؟', {
      body: `لديك ${water} أكواب حتى الآن. اضغط نعم لإضافة كوب 💙`,
      icon: '/logo192.png',
      tag: 'water-question',
      dir: 'rtl',
      requireInteraction: true, // يبقى حتى يتفاعل المستخدم
    });

    // نعم — يضيف كوب
    notif.onclick = () => {
      const current = parseInt(storage.get(`water_${today}`) || '0');
      storage.set(`water_${today}`, String(current + 1));
      new Notification('✅ أحسنت!', {
        body: `رائع! وصلت لـ ${current + 1} أكواب اليوم 🎉`,
        icon: '/logo192.png',
        tag: 'water-confirm',
        dir: 'rtl',
      });
      notif.close();
    };

    // لا — يختفي تلقائياً بعد 10 ثواني
    setTimeout(() => notif.close(), 10000);
  };

  useEffect(() => {
    // أول تذكير بعد 3 ساعات من فتح التطبيق
    timer.current = setInterval(ask, THREE_HOURS);

    // تذكير فوري للتجربة (بعد 5 ثوان من الفتح) — احذفه في الإنتاج
    // setTimeout(ask, 5000);

    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  return null; // لا يرسم شيئاً
}

