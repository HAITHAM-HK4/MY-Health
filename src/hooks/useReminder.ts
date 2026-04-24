import { useEffect, useState } from 'react';

export type ReminderAlert = {
  id: number;
  medicineName: string;
};

export function useReminder() {
  const [alerts, setAlerts] = useState<ReminderAlert[]>([]);

  const playSound = () => {
    const ctx = new AudioContext();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(880, ctx.currentTime);
    oscillator.frequency.setValueAtTime(660, ctx.currentTime + 0.2);
    oscillator.frequency.setValueAtTime(880, ctx.currentTime + 0.4);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.6);
  };

  useEffect(() => {
    const check = () => {
      const saved = localStorage.getItem('medicines');
      if (!saved) return;

      const medicines = JSON.parse(saved);
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      medicines.forEach((med: any) => {
        if (med.time === currentTime && !med.taken) {
          setAlerts(prev => {
            const exists = prev.find(a => a.id === med.id);
            if (exists) return prev;
            playSound();
            return [...prev, { id: med.id, medicineName: med.name }];
          });
        }
      });
    };

    check();
    const interval = setInterval(check, 60000);
    return () => clearInterval(interval);
  }, []);

  const dismissAlert = (id: number) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  return { alerts, dismissAlert };
}