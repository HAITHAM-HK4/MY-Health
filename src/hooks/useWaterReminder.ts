import { useEffect } from 'react';

export function useWaterReminder() {
  useEffect(() => {
    const interval = setInterval(() => {
      const today = new Date().toDateString();
      const cups = Number(localStorage.getItem(`water_${today}`) || 0);
      const hour = new Date().getHours();
      if (hour >= 8 && hour <= 22 && cups < 8) {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('💧 تذكير الماء', {
            body: `شربت ${cups} أكواب فقط — اشرب كوباً الآن!`,
          });
        }
      }
    }, 2 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);
}