import { useState } from 'react';
import HealthChat from '../components/HealthChat';
import SymptomAnalyzer from '../components/SymptomAnalyzer';
import MedicineInfo from '../components/MedicineInfo';
import DailyReport from '../components/DailyReport';
import MealPlanner from '../components/MealPlanner';
import WorkoutPlanner from '../components/WorkoutPlanner';

type Tab = 'chat' | 'symptoms' | 'medicine' | 'report' | 'meal' | 'workout';

const tabs = [
  { id: 'chat',     icon: '🤖', label: 'مساعد' },
  { id: 'symptoms', icon: '🔬', label: 'أعراض' },
  { id: 'medicine', icon: '💊', label: 'دواء'   },
  { id: 'report',   icon: '📊', label: 'تقرير' },
  { id: 'meal',     icon: '🍽️', label: 'وجبات' },
  { id: 'workout',  icon: '🧘', label: 'تمرين' },
];

export default function AIAssistant() {
  const [activeTab, setActiveTab] = useState<Tab>('chat');

  const renderTab = () => {
    switch (activeTab) {
      case 'chat':     return <HealthChat />;
      case 'symptoms': return <SymptomAnalyzer />;
      case 'medicine': return <MedicineInfo />;
      case 'report':   return <DailyReport />;
      case 'meal':     return <MealPlanner />;
      case 'workout':  return <WorkoutPlanner />;
    }
  };

  return (
    <div className="pb-24" dir="rtl">
      <div className="bg-gradient-to-r from-purple-500 to-purple-700 p-5 text-white">
        <h1 className="text-2xl font-bold">🤖 المساعد الصحي الذكي</h1>
        <p className="text-sm opacity-80 mt-1">مدعوم بالذكاء الاصطناعي</p>
      </div>

      <div className="flex overflow-x-auto gap-2 p-3 bg-white border-b">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as Tab)}
            className={`flex items-center gap-1 px-3 py-2 rounded-xl text-sm whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-purple-500 text-white font-bold'
                : 'bg-gray-100 text-gray-600'
            }`}>
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="p-4">{renderTab()}</div>
    </div>
  );
}