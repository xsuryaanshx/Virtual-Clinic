import { useState } from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { Eye, EyeOff, UserRound, Stethoscope } from 'lucide-react';
import PageTransition from '@/components/PageTransition';

const Login = () => {
  const { t } = useI18n();
  const { isLoggedIn, role, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'patient' | 'doctor'>('patient');

  if (isLoggedIn) {
    return <Navigate to={role === 'doctor' ? '/doctor' : '/dashboard'} replace />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(selectedRole, email || undefined);
    navigate(selectedRole === 'doctor' ? '/doctor' : '/dashboard');
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center px-6 pt-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-foreground">{t('auth.welcome')}</h1>
            <p className="mt-2 text-muted-foreground">{t('auth.login')}</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-card rounded-3xl shadow-card p-8 space-y-6">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedRole('patient')}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                  selectedRole === 'patient'
                    ? 'border-primary bg-accent'
                    : 'border-border hover:border-muted-foreground/30'
                }`}
              >
                <UserRound className={`w-6 h-6 ${selectedRole === 'patient' ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className={`text-sm font-medium ${selectedRole === 'patient' ? 'text-primary' : 'text-muted-foreground'}`}>
                  {t('auth.patientRole')}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('doctor')}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                  selectedRole === 'doctor'
                    ? 'border-primary bg-accent'
                    : 'border-border hover:border-muted-foreground/30'
                }`}
              >
                <Stethoscope className={`w-6 h-6 ${selectedRole === 'doctor' ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className={`text-sm font-medium ${selectedRole === 'doctor' ? 'text-primary' : 'text-muted-foreground'}`}>
                  {t('auth.doctorRole')}
                </span>
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">{t('auth.email')}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-secondary border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                placeholder="nome@email.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">{t('auth.password')}</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-secondary border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="text-right">
              <button type="button" className="text-sm text-primary hover:underline">
                {t('auth.forgotPassword')}
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl gradient-hero text-primary-foreground font-medium hover:opacity-90 transition-opacity active:scale-[0.98]"
            >
              {t('auth.login')}
            </button>

            <p className="text-center text-sm text-muted-foreground">
              {t('auth.noAccount')}{' '}
              <Link to="/signup" className="text-primary font-medium hover:underline">
                {t('auth.signup')}
              </Link>
            </p>
          </form>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default Login;
