import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n, Language } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';
import { Menu, X, Globe } from 'lucide-react';

const Navbar = () => {
  const { t, language, setLanguage, languageNames } = useI18n();
  const { isLoggedIn, role, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  // Hide navbar on video consultation page
  if (location.pathname === '/video') return null;

  const isHome = location.pathname === '/';
  const languages: Language[] = ['it', 'en', 'ru'];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="fixed top-0 left-0 right-0 z-50 glass"
    >
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold tracking-tight text-foreground">
          Virtual <span className="text-gradient">Clinic</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {isHome && (
            <>
              <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t('nav.howItWorks')}
              </a>
              <a href="#benefits" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t('nav.benefits')}
              </a>
            </>
          )}
          {isLoggedIn && (
            <Link
              to={role === 'doctor' ? '/doctor' : '/dashboard'}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('nav.dashboard')}
            </Link>
          )}

          {/* Language switcher */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Globe className="w-4 h-4" />
              {languageNames[language]}
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-8 bg-card shadow-elevated rounded-xl overflow-hidden border border-border"
                >
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => { setLanguage(lang); setLangOpen(false); }}
                      className={`block w-full px-4 py-2 text-sm text-left transition-colors hover:bg-accent ${
                        language === lang ? 'text-primary font-medium' : 'text-foreground'
                      }`}
                    >
                      {languageNames[lang]}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {isLoggedIn ? (
            <button
              onClick={logout}
              className="text-sm font-medium px-5 py-2 rounded-full bg-secondary text-secondary-foreground hover:bg-muted transition-colors"
            >
              {t('nav.logout')}
            </button>
          ) : (
            <Link
              to="/login"
              className="text-sm font-medium px-5 py-2 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              {t('nav.login')}
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-foreground">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-border overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-3">
              {isLoggedIn && (
                <Link
                  to={role === 'doctor' ? '/doctor' : '/dashboard'}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm py-2 text-foreground"
                >
                  {t('nav.dashboard')}
                </Link>
              )}
              {isLoggedIn ? (
                <button
                  onClick={() => { logout(); setMobileOpen(false); }}
                  className="text-sm py-2 text-left text-destructive font-medium"
                >
                  {t('nav.logout')}
                </button>
              ) : (
                <Link to="/login" onClick={() => setMobileOpen(false)} className="text-sm py-2 text-primary font-medium">
                  {t('nav.login')}
                </Link>
              )}
              <div className="flex gap-2 pt-2">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => { setLanguage(lang); setMobileOpen(false); }}
                    className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                      language === lang ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground'
                    }`}
                  >
                    {languageNames[lang]}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
