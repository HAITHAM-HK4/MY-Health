import { useReminder } from '../hooks/useReminder';

export default function ReminderAlert() {
  const { alerts, dismissAlert } = useReminder();

  if (alerts.length === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-3 flex flex-col gap-2">
      {alerts.map(alert => (
        <div
          key={alert.id}
          className="bg-blue-600 text-white rounded-2xl p-4 shadow-lg flex justify-between items-center"
          dir="rtl"
        >
          <div>
            <p className="font-bold text-lg">🔔 وقت الدواء!</p>
            <p className="text-sm opacity-90">
              حان موعد تناول: {alert.medicineName}
            </p>
          </div>
          <button
            onClick={() => dismissAlert(alert.id)}
            className="bg-white text-blue-600 font-bold px-3 py-1 rounded-xl text-sm"
          >
            تم ✓
          </button>
        </div>
      ))}
    </div>
  );
}