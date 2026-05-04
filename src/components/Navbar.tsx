// src/components/Navbar.tsx
import { useState, useEffect, useRef } from 'react';
import { useFamily } from '../context/FamilyContext';

type Page =
  | 'home' | 'medicines' | 'health' | 'symptoms' | 'calendar'
  | 'settings' | 'records' | 'ai' | 'achievements' | 'vaccines'
  | 'history' | 'notes' | 'digest' | 'family';

type Props = {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  theme?: any;
};

/* ── رسالة الانضمام الرائعة ── */
function JoinFamilyPrompt({ onClose, onJoin }: { onClose: () => void; onJoin: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 20);
    return () => clearTimeout(t);
  }, []);

  const close = () => {
    setVisible(false);
    setTimeout(onClose, 350);
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={close}
        style={{
          position: 'fixed', inset: 0, zIndex: 10000,
          background: 'rgba(0,0,0,.65)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          opacity: visible ? 1 : 0,
          transition: 'opacity .35s ease',
        }}
      />

      {/* Card */}
      <div
        style={{
          position: 'fixed',
          bottom: visible ? 100 : 60,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10001,
          width: 'min(340px, 92vw)',
          opacity: visible ? 1 : 0,
          transition: 'bottom .4s cubic-bezier(.22,1,.36,1), opacity .35s ease',
          background: 'linear-gradient(135deg,rgba(17,17,40,.98) 0%,rgba(10,10,30,.98) 100%)',
          border: '1px solid rgba(139,92,246,.5)',
          borderRadius: 24,
          padding: '28px 24px 24px',
          boxShadow:
            '0 0 0 1px rgba(139,92,246,.2), 0 20px 60px rgba(0,0,0,.7), 0 0 40px rgba(139,92,246,.25)',
          textAlign: 'center',
        }}
      >
        {/* Glow orb */}
        <div style={{
          position: 'absolute', top: -30, left: '50%', transform: 'translateX(-50%)',
          width: 60, height: 60, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,.8) 0%, transparent 70%)',
          filter: 'blur(12px)',
        }} />

        {/* Icon */}
        <div style={{
          fontSize: 52,
          marginBottom: 8,
          filter: 'drop-shadow(0 0 12px rgba(139,92,246,.8))',
          animation: 'navPromptFloat 3s ease-in-out infinite',
        }}>
          👨‍👩‍👧‍👦
        </div>

        {/* Title */}
        <div style={{
          fontSize: 20, fontWeight: 800, color: '#e2e8f0',
          marginBottom: 6, letterSpacing: 0.3,
        }}>
          انضم لعائلتك
        </div>

        {/* Subtitle */}
        <div style={{
          fontSize: 13.5, color: '#94a3b8', lineHeight: 1.6,
          marginBottom: 22,
        }}>
          هذه الميزة متاحة لأعضاء العائلة فقط.<br />
          أنشئ عائلة أو انضم لواحدة بثوانٍ ✨
        </div>

        {/* Features */}
        {[
          { icon: '🔔', text: 'تذكير أدوية لكل الأسرة' },
          { icon: '📊', text: 'متابعة صحة أفراد العائلة' },
          { icon: '💬', text: 'إرسال تذكيرات فورية' },
        ].map((f) => (
          <div key={f.text} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'rgba(139,92,246,.08)',
            border: '1px solid rgba(139,92,246,.15)',
            borderRadius: 12, padding: '8px 14px',
            marginBottom: 8, textAlign: 'right',
          }}>
            <span style={{ fontSize: 18 }}>{f.icon}</span>
            <span style={{ fontSize: 12.5, color: '#cbd5e1' }}>{f.text}</span>
          </div>
        ))}

        {/* CTA Button */}
        <button
          onClick={() => { close(); setTimeout(onJoin, 380); }}
          style={{
            width: '100%', marginTop: 16,
            background: 'linear-gradient(135deg,#7c3aed,#6366f1)',
            border: 'none', borderRadius: 14,
            padding: '14px 0', cursor: 'pointer',
            color: '#fff', fontWeight: 800, fontSize: 15,
            boxShadow: '0 0 20px rgba(124,58,237,.5)',
            transition: 'transform .15s, box-shadow .15s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.02)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 28px rgba(124,58,237,.7)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 20px rgba(124,58,237,.5)';
          }}
        >
          🚀 انضم الآن
        </button>

        {/* Cancel */}
        <button
          onClick={close}
          style={{
            width: '100%', marginTop: 10,
            background: 'transparent',
            border: '1px solid rgba(148,163,184,.2)',
            borderRadius: 14, padding: '10px 0',
            cursor: 'pointer', color: '#64748b',
            fontSize: 13, fontWeight: 600,
          }}
        >
          ربما لاحقاً
        </button>

        <style>{`
          @keyframes navPromptFloat {
            0%,100% { transform: translateY(0); }
            50%      { transform: translateY(-6px); }
          }
          @keyframes navDotPulse {
            0%,100% { opacity: 1; transform: scale(1); }
            50%      { opacity: .5; transform: scale(1.4); }
          }
        `}</style>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────
   Navbar
───────────────────────────────────────────────────────── */
export default function Navbar({ currentPage, setCurrentPage, theme }: Props) {
  const { family } = useFamily();
  const [drawerOpen, setDrawerOpen]         = useState(false);
  const [showJoinPrompt, setShowJoinPrompt] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  const isFamilyMember = !!family;

  /* العنصر مقفول إذا كان "family" والمستخدم غير منضم */
  const isItemLocked = (id: string) => id === 'family' && !isFamilyMember;

  /* إغلاق الـ Drawer عند الضغط خارجه */
  useEffect(() => {
    if (!drawerOpen) return;
    const handler = (e: TouchEvent | MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setDrawerOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [drawerOpen]);

  /* نقرة على زر رئيسي في الشريط السفلي */
  const handleMain = (id: string) => {
    if (id === 'more') { setDrawerOpen((o) => !o); return; }
    if (isItemLocked(id)) { setShowJoinPrompt(true); return; }
    setCurrentPage(id as Page);
  };

  /* نقرة على عنصر في الـ Drawer */
  const handleDrawer = (id: string) => {
    setDrawerOpen(false);
    if (isItemLocked(id)) {
      setTimeout(() => setShowJoinPrompt(true), 250);
      return;
    }
    setCurrentPage(id as Page);
  };

  /* ── عناصر الشريط السفلي ── */
  const mainItems = [
    { id: 'home',      icon: '🏠', label: 'الرئيسية' },
    { id: 'medicines', icon: '💊', label: 'الأدوية'  },
    { id: 'health',    icon: '❤️', label: 'الصحة'    },
    { id: 'family',    icon: '👨‍👩‍👧‍👦', label: 'العائلة'  },
    { id: 'more',      icon: '⋯',  label: 'المزيد'   },
  ];

  /* ── عناصر الـ Drawer ── */
  const drawerItems = [
    { id: 'ai',           icon: '🤖', label: 'المساعد',     color: 'cyan'   },
    { id: 'symptoms',     icon: '🩺', label: 'الأعراض',     color: 'pink'   },
    { id: 'calendar',     icon: '📅', label: 'التقويم',     color: 'gold'   },
    { id: 'achievements', icon: '🏆', label: 'الإنجازات',   color: 'gold'   },
    { id: 'records',      icon: '📋', label: 'السجلات',     color: 'mint'   },
    { id: 'vaccines',     icon: '💉', label: 'اللقاحات',    color: 'mint'   },
    { id: 'history',      icon: '📜', label: 'التاريخ',     color: 'purple' },
    { id: 'notes',        icon: '📝', label: 'الملاحظات',   color: 'cyan'   },
    { id: 'digest',       icon: '📰', label: 'الأخبار',     color: 'pink'   },
    { id: 'settings',     icon: '⚙️', label: 'الإعدادات',   color: 'purple' },
  ];

  const dark = theme !== 'light';

  return (
    <>
      {/* ── Overlay الـ Drawer ── */}
      <div
        className={`more-overlay${drawerOpen ? ' open' : ''}`}
        onClick={() => setDrawerOpen(false)}
      />

      {/* ── Drawer ── */}
      <div
        ref={drawerRef}
        className={`more-drawer${drawerOpen ? ' open' : ''}`}
      >
        <div className="drawer-grid">
          {drawerItems.map((item) => {
            const locked = isItemLocked(item.id);
            return (
              <button
                key={item.id}
                className={`drawer-item color-${item.color}${locked ? ' locked-item' : ''}`}
                onClick={() => handleDrawer(item.id)}
                style={{
                  position: 'relative',
                  opacity: locked ? 0.55 : 1,
                  filter: locked ? 'grayscale(60%)' : 'none',
                }}
              >
                <span className="d-icon">{item.icon}</span>
                <span className="d-label">{item.label}</span>

                {/* نقطة وهّاجة للعنصر غير المنضم */}
                {locked && (
                  <span style={{
                    position: 'absolute', top: 5, left: 5,
                    width: 8, height: 8, borderRadius: '50%',
                    background: '#818cf8',
                    boxShadow: '0 0 6px #818cf8, 0 0 12px #818cf8',
                    animation: 'navDotPulse 1.5s ease-in-out infinite',
                  }} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Bottom Nav ── */}
      <nav className="navbar-glass">
        {mainItems.map((item) => {
          const locked  = isItemLocked(item.id);
          const active  = item.id !== 'more' && (currentPage as string) === item.id;

          return (
            <button
              key={item.id}
              className={`nav-item${active ? ' active' : ''}`}
              onClick={() => handleMain(item.id)}
              style={{ position: 'relative' }}
            >
              {/* نقطة وهّاجة فوق زر العائلة إذا غير منضم */}
              {locked && (
                <span style={{
                  position: 'absolute', top: 4, right: 4,
                  width: 8, height: 8, borderRadius: '50%',
                  background: '#818cf8',
                  boxShadow: '0 0 6px #818cf8, 0 0 12px #818cf8',
                  animation: 'navDotPulse 1.5s ease-in-out infinite',
                  zIndex: 2,
                }} />
              )}
              <span className="nav-icon">{item.icon}</span>
              <span style={{ fontSize: 10, color: active ? '#818cf8' : dark ? '#64748b' : '#9ca3af' }}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* ── رسالة الانضمام ── */}
      {showJoinPrompt && (
        <JoinFamilyPrompt
          onClose={() => setShowJoinPrompt(false)}
          onJoin={() => setCurrentPage('family')}
        />
      )}
    </>
  );
}
