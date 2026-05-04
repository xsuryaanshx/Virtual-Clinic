import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/user/useAuth';

const Navbar = () => {
  const { t } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Hide navbar on video consultation page
  if (location.pathname === '/video') return null;

  const isHome = location.pathname === '/';

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="fixed top-0 left-0 right-0 z-50 glass"
    >
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold tracking-tight text-foreground">
          Virtual Clinic
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
          
          {user && (
            <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t('nav.dashboard')}
            </Link>
          )}

          {!user ? (
            <Link
              to="/login"
              className="text-sm font-medium px-5 py-2 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              {t('nav.login')}
            </Link>
          ) : (
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 text-sm font-medium px-5 py-2 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              {t('nav.logout') || 'Logout'}
            </button>
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
              {user ? (
                <>
                  <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="text-sm py-2 text-foreground">{t('nav.dashboard')}</Link>
                  <button
                    onClick={() => { handleSignOut(); setMobileOpen(false); }}
                    className="text-sm py-2 text-destructive font-medium text-left flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    {t('nav.logout') || 'Logout'}
                  </button>
                </>
              ) : (
                <Link to="/login" onClick={() => setMobileOpen(false)} className="text-sm py-2 text-primary font-medium">{t('nav.login')}</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
