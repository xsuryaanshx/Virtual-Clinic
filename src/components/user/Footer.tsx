import { Globe, Sun, Moon, Monitor, Mail, Shield, FileText } from 'lucide-react';
import { useI18n, Language } from '@/lib/i18n';
import { useTheme, Theme } from '@/hooks/user/useTheme';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const Footer = () => {
  const { language, setLanguage, languageNames } = useI18n();
  const { theme, setTheme } = useTheme();
  const [langOpen, setLangOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);

  const languages: Language[] = ['it', 'en', 'ru'];
  const languageFullNames: Record<Language, string> = { it: 'Italiano', en: 'English', ru: 'Русский' };

  const themes: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: 'Light', icon: <Sun className="w-3.5 h-3.5" /> },
    { value: 'dark', label: 'Dark', icon: <Moon className="w-3.5 h-3.5" /> },
    { value: 'system', label: 'System', icon: <Monitor className="w-3.5 h-3.5" /> },
  ];

  const currentTheme = themes.find((t) => t.value === theme) ?? themes[2];
  const dropdownClass = 'absolute bottom-full mb-2 right-0 bg-card border border-border rounded-xl shadow-elevated overflow-hidden z-50 min-w-[130px]';
  const itemClass = 'flex items-center gap-2 w-full px-4 py-2.5 text-sm text-left transition-colors hover:bg-accent';

  return (
    <footer className="w-full border-t border-border bg-card/60 backdrop-blur-sm">
      {/* Top links row */}
      <div className="container mx-auto px-6 pt-6 pb-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg gradient-hero flex items-center justify-center">
              <span className="text-primary-foreground text-xs font-bold">V</span>
            </div>
            <span className="font-semibold text-foreground text-sm">Virtual Clinic</span>
          </div>

          {/* Legal links */}
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <a href="/privacy" className="flex items-center gap-1.5 hover:text-foreground transition-colors">
              <Shield className="w-3.5 h-3.5" />
              Privacy Policy
            </a>
            <a href="/terms" className="flex items-center gap-1.5 hover:text-foreground transition-colors">
              <FileText className="w-3.5 h-3.5" />
              Terms & Conditions
            </a>
            <a href="mailto:support@virtualclinic.it" className="flex items-center gap-1.5 hover:text-foreground transition-colors">
              <Mail className="w-3.5 h-3.5" />
              support@virtualclinic.it
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border/50 container mx-auto px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground order-3 sm:order-1">
          © {new Date().getFullYear()} Virtual Clinic. All rights reserved.
        </p>

        {/* Language + Theme controls */}
        <div className="flex items-center gap-3 order-1 sm:order-2">
          {/* Language picker */}
          <div className="relative">
            <button
              onClick={() => { setLangOpen(!langOpen); setThemeOpen(false); }}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border border-border bg-background hover:bg-accent transition-colors text-foreground"
            >
              <Globe className="w-3.5 h-3.5 text-muted-foreground" />
              {languageFullNames[language]}
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.div initial={{ opacity: 0, y: 4, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.95 }} transition={{ duration: 0.15 }} className={dropdownClass}>
                  {languages.map((lang) => (
                    <button key={lang} onClick={() => { setLanguage(lang); setLangOpen(false); }}
                      className={`${itemClass} ${language === lang ? 'text-primary font-medium bg-accent' : 'text-foreground'}`}>
                      <span className="w-5 text-center text-xs font-bold text-muted-foreground">{languageNames[lang]}</span>
                      {languageFullNames[lang]}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Theme picker */}
          <div className="relative">
            <button
              onClick={() => { setThemeOpen(!themeOpen); setLangOpen(false); }}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border border-border bg-background hover:bg-accent transition-colors text-foreground"
            >
              {currentTheme.icon}
              {currentTheme.label}
            </button>
            <AnimatePresence>
              {themeOpen && (
                <motion.div initial={{ opacity: 0, y: 4, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.95 }} transition={{ duration: 0.15 }} className={dropdownClass}>
                  {themes.map((t) => (
                    <button key={t.value} onClick={() => { setTheme(t.value); setThemeOpen(false); }}
                      className={`${itemClass} ${theme === t.value ? 'text-primary font-medium bg-accent' : 'text-foreground'}`}>
                      {t.icon} {t.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;