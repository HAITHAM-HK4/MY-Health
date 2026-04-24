type Page = 'home' | 'medicines' | 'health' | 'symptoms' | 'calendar' | 'settings' | 'records' | 'ai' | 'achievements' | 'vaccines' | 'history';

type Props = {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  theme: any;
};
const navItems = [
  { id: 'home',      icon: '🏠', label: 'الرئيسية' },
  { id: 'medicines', icon: '💊', label: 'الأدوية'  },
  { id: 'health',    icon: '❤️', label: 'صحتي'     },
  { id: 'symptoms',  icon: '🤒', label: 'أعراض'    },
  { id: 'calendar',  icon: '📅', label: 'التقويم'  },
  { id: 'records',   icon: '🩺', label: 'سجلاتي'   },
  { id: 'settings',  icon: '⚙️', label: 'إعدادات'  },
  { id: 'ai', icon: '🤖', label: 'ذكاء' },
];

export default function Navbar({ currentPage, setCurrentPage }: Props) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-2 z-50">
      {navItems.map(item => (
        <button
          key={item.id}
          onClick={() => setCurrentPage(item.id as Page)}
          className={`flex flex-col items-center text-xs gap-1 px-2 py-1 rounded-xl transition-all ${
            currentPage === item.id
              ? 'text-blue-600 bg-blue-50 font-bold'
              : 'text-gray-400'
          }`}
        >
          <span className="text-xl">{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}