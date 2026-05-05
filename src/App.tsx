import { storage } from './lib/storage';

// src/App.tsx
import { useState, useEffect, useCallback } from 'react';
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
import Notes from './pages/Notes';
import HealthDigest from './pages/HealthDigest';
import WaterReminderNotif from './components/WaterReminderNotif';
import FamilyPortal from './pages/FamilyPortal';
import FamilyHome from './pages/FamilyHome';
import AuthScreen from './pages/AuthScreen';
import SplashScreen from './components/SplashScreen';
import NotificationCenter, { useUnreadCount } from './components/NotificationCenter';
import OnboardingQuiz from './components/OnboardingQuiz';
import { useWaterReminder } from './hooks/useWaterReminder';
import { AIProvider } from './context/AIContext';
import { FamilyProvider } from './context/FamilyContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useFamily } from './context/FamilyContext';
import {
  isGranted,
  startWaterReminder,
  startAIReminder,
  scheduleMedReminders,
} from './services/NotificationService';

// ─────────────────────────────────────────────────────────────
export type Theme = 'light' | 'dark';

export type Page =
  | 'home' | 'medicines' | 'health' | 'symptoms' | 'calendar'
  | 'settings' | 'records' | 'ai' | 'achievements' | 'vaccines'
  | 'history' | 'notes' | 'digest' | 'family';

const ONBOARDING_KEY = 'onboarding_done';
const getOnboardingKey = (u: string) => `${ONBOARDING_KEY}_${u}`;
const getThemeKey      = (u: string) => `theme_${u}`;

// ─────────────────────────────────────────────────────────────
function AppInner() {
  const { user }          = useAuth();
  const { currentMember } = useFamily();

  const [page,           setPage]           = useState<Page>('home');
  const [theme,          setTheme]          = useState<Theme>('light');
  const [showSplash,     setShowSplash]     = useState(true);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showMoreMenu,   setShowMoreMenu]   = useState(false);

  const unreadCount = useUnreadCount(currentMember?.id ?? '');
  useWaterReminder();

  // ─── عند تغيير المستخدم ──────────────────────────────────
  useEffect(() => {
    if (!user) return;
    setPage('home');
    setShowNotifPanel(false);
    setShowMoreMenu(false);

    // ✅ افتراضي نهاري — dark فقط إذا حُفظ صراحةً
    const saved = storage.get(getThemeKey(user.username));
    setTheme(saved === 'dark' ? 'dark' : 'light');

    // عرض الاستبيان إذا لم يُكتمل بعد
    const done = storage.get(getOnboardingKey(user.username));
    setShowOnboarding(!done);
  }, [user?.username]);

  // ─── تشغيل الإشعارات ──────────────────────────────────────
  useEffect(() => {
    if (isGranted()) {
      startWaterReminder();
      startAIReminder();
      scheduleMedReminders();
    }
  }, []);

  // ─── حفظ الثيم ────────────────────────────────────────────
  useEffect(() => {
    if (user?.username) storage.set(getThemeKey(user.username), theme);
  }, [theme, user?.username]);

  // ─── إغلاق قائمة المزيد عند تغيير الصفحة ─────────────────
  useEffect(() => {
    setShowMoreMenu(false);
  }, [page]);

  // ─── دوال ─────────────────────────────────────────────────
  const handleSplashFinish    = useCallback(() => setShowSplash(false), []);
  const handleOpenOnboarding  = useCallback(() => setShowOnboarding(true), []);
  const handleThemeToggle     = useCallback(() => setTheme(t => t === 'dark' ? 'light' : 'dark'), []);
  const handleNavigate        = useCallback((p: string) => setPage(p as Page), []);

  const handleOnboardingDone  = useCallback(() => {
    if (user?.username) storage.set(getOnboardingKey(user.username), 'true');
    setShowOnboarding(false);
  }, [user?.username]);

  // ─── شاشات ما قبل الدخول ──────────────────────────────────
  if (showSplash) return <SplashScreen onFinish={handleSplashFinish} />;
  if (!user)      return <AuthScreen theme={theme} />;

  // ─── تحديد الصفحة ─────────────────────────────────────────
  const dark = theme === 'dark';

  const renderPage = () => {
    switch (page) {
      case 'home':      return <Home theme={theme} />;
      case 'medicines': return <Medicines      theme={theme} />;
      case 'health':    return <Health         theme={theme} />;
      case 'symptoms':  return <Symptoms       theme={theme} />;
      case 'calendar':  return <Calendar       theme={theme} />;
      case 'settings':  return <Settings theme={theme} setTheme={setTheme} onEditProfile={handleOpenOnboarding} />;
      case 'records':   return <MedicalRecords theme={theme} />;
      case 'ai':        return <AIAssistant    theme={theme} />;
      case 'achievements': return <Achievements theme={theme} />;
      case 'vaccines':  return <Vaccines       theme={theme} />;
      case 'history':   return <MedicalHistory theme={theme} />;
      case 'notes':     return <Notes          theme={theme} />;
      case 'digest':    return <HealthDigest   theme={theme} />;
      case 'family':    return currentMember
        ? <FamilyHome   theme={theme} />
        : <FamilyPortal theme={theme} />;
      default:          return <Home theme={theme} />;
    }
  };

  // ─── إظهار الأزرار العائمة ────────────────────────────────
  // تختفي: عند فتح قائمة المزيد، أو في صفحة المساعد الذكي
  const showFloatingButtons = !showMoreMenu && page !== 'ai';

  return (
    <div style={{ minHeight: '100vh', background: dark ? '#0f172a' : '#f0f9ff', position: 'relative' }}>

      {/* ✅ الاستبيان */}
      {showOnboarding && (
        <OnboardingQuiz
          username={user.username}
          onFinish={handleOnboardingDone}
          onSkip={handleOnboardingDone}
        />
      )}

      <ReminderAlert />
      <WaterReminderNotif />

      <div className="page-enter" key={page}>{renderPage()}</div>

      <Navbar
        currentPage={page}
        setCurrentPage={setPage}
        theme={theme}
        showMoreMenu={showMoreMenu}
        setShowMoreMenu={setShowMoreMenu}
      />

      {showNotifPanel && <NotificationCenter onClose={() => setShowNotifPanel(false)} />}

      {/* الأزرار العائمة */}
      {showFloatingButtons && (
        <div style={{
          position: 'fixed', left: 12, bottom: 90,
          display: 'flex', flexDirection: 'column', gap: 10, zIndex: 400,
        }}>

          {/* 🔔 الإشعارات */}
          <button
            onClick={() => setShowNotifPanel(v => !v)}
            aria-label="الإشعارات"
            style={{
              width: 44, height: 44, borderRadius: '50%',
              background: dark ? 'rgba(30,41,59,0.95)' : 'rgba(255,255,255,0.95)',
              border: `1.5px solid ${dark ? 'rgba(99,102,241,0.4)' : 'rgba(2,132,199,0.30)'}`,
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, position: 'relative',
            }}
          >
            🔔
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute', top: -4, right: -4,
                background: '#ef4444', color: '#fff', fontSize: 10, fontWeight: 700,
                borderRadius: '50%', width: 18, height: 18,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: `2px solid ${dark ? '#0f172a' : '#ffffff'}`,
              }}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          <VoiceCommand onNavigate={handleNavigate} onThemeToggle={handleThemeToggle} />
          <EmergencyButton />
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
function AppWithFamily() {
  const { user } = useAuth();
  return (
    <FamilyProvider username={user?.username ?? null}>
      <AIProvider><AppInner /></AIProvider>
    </FamilyProvider>
  );
}

export default function App() {
  return (
    <AuthProvider><AppWithFamily /></AuthProvider>
  );
}
