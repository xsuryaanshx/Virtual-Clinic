import { useI18n } from '@/i18n/I18nContext';
import { LayoutDashboard, Users, MessageSquare, Clock, Settings, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type View = 'dashboard' | 'incoming' | 'active' | 'history' | 'settings';

interface AppSidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
  incomingCount?: number;
  isOpen: boolean;
  onClose: () => void;
}

const navItems: { key: View; icon: typeof LayoutDashboard; labelKey: string }[] = [
  { key: 'dashboard', icon: LayoutDashboard, labelKey: 'sidebar.dashboard' },
  { key: 'incoming', icon: Users, labelKey: 'sidebar.incoming' },
  { key: 'active', icon: MessageSquare, labelKey: 'sidebar.active' },
  { key: 'history', icon: Clock, labelKey: 'sidebar.history' },
  { key: 'settings', icon: Settings, labelKey: 'sidebar.settings' },
];

const AppSidebar = ({ currentView, onViewChange, incomingCount, isOpen, onClose }: AppSidebarProps) => {
  const { t } = useI18n();

  const handleNav = (view: View) => {
    onViewChange(view);
    onClose();
  };

  const sidebarContent = (
    <nav className="flex flex-col gap-1 px-3 py-4">
      {navItems.map((item) => {
        const isActive = currentView === item.key;
        const Icon = item.icon;
        return (
          <button
            key={item.key}
            onClick={() => handleNav(item.key)}
            className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'text-primary bg-accent'
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="sidebar-indicator"
                className="absolute inset-0 bg-accent rounded-lg"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            <Icon className="w-[18px] h-[18px] relative z-10" />
            <span className="relative z-10">{t(item.labelKey)}</span>
            {item.key === 'incoming' && incomingCount && incomingCount > 0 && (
              <span className="relative z-10 ml-auto bg-primary text-primary-foreground text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                {incomingCount}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-[260px] border-r border-border/50 bg-card flex-col shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile overlay sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm md:hidden"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              className="fixed inset-y-0 left-0 z-50 w-[260px] bg-card border-r border-border/50 flex flex-col md:hidden"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
                <span className="font-semibold text-foreground">Menu</span>
                <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AppSidebar;
