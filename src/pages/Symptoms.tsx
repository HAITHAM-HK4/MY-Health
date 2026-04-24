import SymptomsList from '../components/SymptomsList';
import MoodTracker from '../components/MoodTracker';

export default function Symptoms() {
  return (
    <div className="p-4 pb-24" dir="rtl">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">🤒 الأعراض والحالة</h1>
      <MoodTracker />
      <SymptomsList />
    </div>
  );
}