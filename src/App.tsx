import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Medicines from './pages/Medicines';
import Health from './pages/Health';
import Symptoms from './pages/Symptoms';
import Calendar from './pages/Calendar';
import Settings from './pages/Settings';
import MedicalRecords from './pages/MedicalRecords';
import AIAssistant from './pages/AIAssistant';
import Achievements from './components/Achievements';
import Vaccines from './pages/Vaccines';
import MedicalHistory from './pages/MedicalHistory';
import ReminderAlert from './components/ReminderAlert';
import EmergencyButton from './components/EmergencyButton';
import VoiceCommand from './components/VoiceCommand';
import { useWaterReminder } from './hooks/useWaterReminder';

export type Theme = 'light' | 'dark';

type Page =
  | 'home'
  | 'medicines'
  | 'health'
  | 'symptoms'
  | 'calendar'
  | 'settings'
  | 'records'
  | 'ai'
  | 'achievements'
  | 'vaccines'
  | 'history';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [theme, setTheme] = useState<Theme>('light');

  useWaterReminder();

  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme;
    if (saved) {
      setTheme(saved);
    } else {
      const hour = new Date().getHours();
      setTheme(hour >= 20 || hour < 7 ? 'dark' : 'light');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const lastReset = localStorage.getItem('lastReset');
    const today = new Date().toDateString();
    if (lastReset !== today) {
      const meds = JSON.parse(localStorage.getItem('medicines') || '[]');
      const reset = meds.map((m: any) => ({ ...m, taken: false }));
      localStorage.setItem('medicines', JSON.stringify(reset));
      localStorage.setItem('lastReset', today);
    }
  }, []);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const navigate = (p: string) => setCurrentPage(p as Page);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':         return <Home theme={theme} />;
      case 'medicines':    return <Medicines />;
      case 'health':       return <Health />;
      case 'symptoms':     return <Symptoms />;
      case 'calendar':     return <Calendar />;
      case 'settings':     return <Settings theme={theme} setTheme={setTheme} />;
      case 'records':      return <MedicalRecords />;
      case 'ai':           return <AIAssistant />;
      case 'achievements': return <Achievements />;
      case 'vaccines':     return <Vaccines />;
      case 'history':      return <MedicalHistory />;
      default:             return <Home theme={theme} />;
    }
  };

  return (
    <div className={`min-h-screen pb-20 transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'
    }`}>
      <ReminderAlert />
      <EmergencyButton />
      <VoiceCommand onNavigate={navigate} />
      {renderPage()}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        theme={theme}
      />
    </div>
  );
}

export default App;