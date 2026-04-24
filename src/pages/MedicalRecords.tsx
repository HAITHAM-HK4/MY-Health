import BloodPressureForm from '../components/BloodPressureForm';
import SugarForm from '../components/SugarForm';

export default function MedicalRecords() {
  return (
    <div className="p-4 pb-24" dir="rtl">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">🩺 سجلاتي الطبية</h1>
      <BloodPressureForm />
      <SugarForm />
    </div>
  );
}