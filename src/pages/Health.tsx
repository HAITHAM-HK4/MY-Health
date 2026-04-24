import WaterTracker from '../components/WaterTracker';
import StepsTracker from '../components/StepsTracker';
import SleepTracker from '../components/SleepTracker';

export default function Health() {
  return (
    <div className="p-4 pb-24" dir="rtl">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">❤️ صحتي اليوم</h1>
      <WaterTracker />
      <StepsTracker />
      <SleepTracker />
    </div>
  );
}