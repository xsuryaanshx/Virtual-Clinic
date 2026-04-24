import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Loader2, User, Stethoscope } from 'lucide-react';
import PageTransition from '@/components/user/PageTransition';
import { signIn } from '@/lib/supabase';

type RoleTab = 'patient' | 'doctor';

const Login = () => {
  const [roleTab, setRoleTab] = useState<RoleTab>('patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { data, error } = await signIn(email, password);
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      const role = data.user?.user_metadata?.role;
      // If user logged in as doctor tab but account is patient (or vice versa), warn them
      if (roleTab === 'doctor' && role !== 'doctor') {
        setError('This account is not registered as a doctor. Please use the Patient tab.');
        setLoading(false);
        return;
      }
      if (roleTab === 'patient' && role === 'doctor') {
        setError('This is a doctor account. Please use the Doctor tab or go to your doctor dashboard.');
        setLoading(false);
        return;
      }
      // Use window.location for hard redirect to ensure auth state updates
      window.location.href = role === 'doctor' ? '/doctor/dashboard' : '/dashboard';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
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
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground">Welcome Back</h1>
            <p className="mt-2 text-muted-foreground">Sign in to your account</p>
          </div>

          {/* Role tab selector */}
          <div className="flex gap-2 mb-6 bg-secondary rounded-2xl p-1.5">
            <button
              onClick={() => { setRoleTab('patient'); setError(null); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
                roleTab === 'patient'
                  ? 'bg-card shadow-card text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <User className="w-4 h-4" />
              Patient
            </button>
            <button
              onClick={() => { setRoleTab('doctor'); setError(null); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
                roleTab === 'doctor'
                  ? 'bg-emerald-500 shadow-card text-white'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Stethoscope className="w-4 h-4" />
              Doctor
            </button>
          </div>

          <form onSubmit={handleSubmit} className="bg-card rounded-3xl shadow-card p-8 space-y-6">
            {error && (
              <div className="px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-secondary border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                placeholder="nome@email.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-xl font-medium hover:opacity-90 transition-opacity active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2 ${
                roleTab === 'doctor' ? 'bg-emerald-500 text-white' : 'gradient-hero text-primary-foreground'
              }`}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Sign In as {roleTab === 'doctor' ? 'Doctor' : 'Patient'}
            </button>

            <p className="text-center text-sm text-muted-foreground">
              No account?{' '}
              <Link to="/signup" className="text-primary font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </form>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default Login;
