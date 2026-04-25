import { useState } from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '@/i18n/I18nContext';
import { Globe, ChevronDown, User, Menu } from 'lucide-react';
import type { Locale } from '@/i18n/translations';

const localeLabels: Record<Locale, string> = {
  it: 'Italiano',
  en: 'English',
  ru: 'Русский',
};

interface TopNavbarProps {
  isOnline: boolean;
  onToggleStatus: () => void;
  onToggleSidebar: () => void;
}

const TopNavbar = ({ isOnline, onToggleStatus, onToggleSidebar }: TopNavbarProps) => {
  const { t, locale, setLocale } = useI18n();
  const [langOpen, setLangOpen] = useState(false);

  return (
    <motion.header
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative z-50 flex h-14 items-center justify-between border-b border-border/50 bg-card px-3 md:h-16 md:px-6"
      style={{ boxShadow: 'var(--shadow-soft)' }}
    >
      {/* Left */}
      <div className="flex items-center gap-2 md:gap-3">
        <button onClick={onToggleSidebar} className="p-2 rounded-lg hover:bg-secondary transition-colors md:hidden">
          <Menu className="w-5 h-5 text-foreground" />
        </button>
        <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-xs md:text-sm">VC</span>
        </div>
        <span className="font-semibold text-base md:text-lg tracking-tight text-foreground hidden sm:inline">{t('nav.clinic')}</span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 md:gap-5">
        <button
          onClick={onToggleStatus}
          className="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1.5 rounded-full text-xs md:text-sm font-medium transition-all duration-200"
          style={{
            backgroundColor: isOnline ? 'hsl(142 71% 45% / 0.1)' : 'hsl(220 10% 60% / 0.1)',
            color: isOnline ? 'hsl(142 71% 35%)' : 'hsl(220 10% 50%)',
          }}
        >
          <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
          <span className="hidden sm:inline">{isOnline ? t('nav.online') : t('nav.offline')}</span>
        </button>

        {/* Language */}
        <div className="relative">
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-1 md:gap-1.5 px-2 md:px-3 py-1.5 rounded-lg text-xs md:text-sm text-muted-foreground hover:bg-secondary transition-colors"
          >
            <Globe className="w-4 h-4" />
            <span className="hidden sm:inline">{localeLabels[locale]}</span>
            <ChevronDown className="w-3 h-3" />
          </button>
          {langOpen && (
            <div className="absolute right-0 top-full mt-1 bg-card rounded-lg border border-border/50 py-1 min-w-[140px] z-50" style={{ boxShadow: 'var(--shadow-elevated)' }}>
              {(Object.keys(localeLabels) as Locale[]).map((l) => (
                <button
                  key={l}
                  onClick={() => { setLocale(l); setLangOpen(false); }}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors ${l === locale ? 'text-primary bg-accent' : 'text-foreground hover:bg-secondary'}`}
                >
                  {localeLabels[l]}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-secondary flex items-center justify-center">
            <User className="w-3.5 h-3.5 md:w-4 md:h-4 text-muted-foreground" />
          </div>
          <span className="text-sm font-medium text-foreground hidden md:inline">Dr. Rossi</span>
        </div>
      </div>
    </motion.header>
  );
};

export default TopNavbar;
