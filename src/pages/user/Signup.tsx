import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, User, Stethoscope, ExternalLink, Building2, BadgeCheck } from 'lucide-react';
import PageTransition from '@/components/user/PageTransition';
import { signUp } from '@/lib/supabase';

type Role = 'patient' | 'doctor';

const LANGUAGES = [
  { code: 'it', label: '🇮🇹 Italiano' },
  { code: 'en', label: '🇬🇧 English' },
  { code: 'ru', label: '🇷🇺 Русский' },
  { code: 'fr', label: '🇫🇷 Français' },
  { code: 'de', label: '🇩🇪 Deutsch' },
  { code: 'es', label: '🇪🇸 Español' },
  { code: 'ar', label: '🇸🇦 العربية' },
  { code: 'zh', label: '🇨🇳 中文' },
];

const ITALIAN_CITIES = [
  'Roma', 'Milano', 'Napoli', 'Torino', 'Palermo', 'Genova', 'Bologna',
  'Firenze', 'Bari', 'Catania', 'Venezia', 'Verona', 'Messina', 'Padova',
  'Trieste', 'Brescia', 'Taranto', 'Prato', 'Modena', 'Reggio Calabria',
  'Reggio Emilia', 'Perugia', 'Livorno', 'Ravenna', 'Cagliari', 'Foggia',
  'Rimini', 'Salerno', 'Ferrara', 'Sassari', 'Latina', 'Giugliano in Campania',
  'Monza', 'Siracusa', 'Pescara', 'Bergamo', 'Trento', 'Forlì', 'Vicenza', 'Terni',
];

const Signup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'role' | 'form'>('role');
  const [role, setRole] = useState<Role>('patient');

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [taxCode, setTaxCode] = useState('');
  const [medicalId, setMedicalId] = useState('');
  const [password, setPassword] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('it');
  const [city, setCity] = useState('');
  // B2B corporate health plan fields
  const [companyName, setCompanyName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const validateTaxCode = (code: string) => /^[A-Z0-9]{16}$/i.test(code);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!fullName.trim()) { setError('Full name is required.'); return; }
    if (!username.trim()) { setError('Username is required.'); return; }
    if (!validateTaxCode(taxCode)) { setError('Tax code must be exactly 16 alphanumeric characters (Italian Codice Fiscale).'); return; }
    if (role === 'doctor' && !medicalId.trim()) { setError('Medical ID is required for doctors.'); return; }
    if (!city.trim()) { setError('Please select your city.'); return; }
    if (role === 'patient' && !companyName.trim()) { setError('Company name is required. If you are registering individually, contact support.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (!termsAccepted) { setError('You must accept the Terms & Conditions to continue.'); return; }

    setLoading(true);
    try {
      const { data, error } = await signUp(email, password, {
        full_name: fullName,
        username: username.trim().toLowerCase(),
        role,
        tax_code: taxCode.toUpperCase(),
        medical_id: role === 'doctor' ? medicalId.trim() : undefined,
        preferred_language: preferredLanguage,
        city: city.trim(),
        organization_name: companyName.trim() || undefined,
        organization_code: employeeId.trim() || undefined,
      });
      if (error) { setError(error.message); return; }
      if (data.session) {
        navigate(role === 'doctor' ? '/doctor/dashboard' : '/dashboard');
      } else {
        setSuccess(true);
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center px-6 pt-16">
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md text-center">
            <div className="bg-card rounded-3xl shadow-card p-10 space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-foreground">Check your email</h2>
              <p className="text-muted-foreground">
                We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.
              </p>
              <Link to="/login" className="inline-block mt-4 text-primary font-medium hover:underline">Back to login</Link>
            </div>
          </motion.div>
        </div>
      </PageTransition>
    );
  }

  if (step === 'role') {
    return (
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center px-6 pt-16">
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-foreground">Create Account</h1>
              <p className="mt-2 text-muted-foreground">Who are you signing up as?</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => { setRole('patient'); setStep('form'); }}
                className="group bg-card rounded-3xl shadow-card p-8 flex flex-col items-center gap-4 hover:shadow-elevated hover:-translate-y-1 transition-all border-2 border-transparent hover:border-primary/30">
                <div className="w-16 h-16 rounded-2xl gradient-hero flex items-center justify-center group-hover:scale-110 transition-transform">
                  <User className="w-8 h-8 text-primary-foreground" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-foreground text-lg">Employee</p>
                  <p className="text-xs text-muted-foreground mt-1">I need medical help</p>
                </div>
              </button>
              <button onClick={() => { setRole('doctor'); setStep('form'); }}
                className="group bg-card rounded-3xl shadow-card p-8 flex flex-col items-center gap-4 hover:shadow-elevated hover:-translate-y-1 transition-all border-2 border-transparent hover:border-emerald-400/40">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Stethoscope className="w-8 h-8 text-white" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-foreground text-lg">Doctor</p>
                  <p className="text-xs text-muted-foreground mt-1">I provide medical care</p>
                </div>
              </button>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-8">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-medium hover:underline">Log in</Link>
            </p>
          </motion.div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center px-6 py-20">
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${role === 'doctor' ? 'bg-emerald-500' : 'gradient-hero'}`}>
              {role === 'doctor' ? <Stethoscope className="w-7 h-7 text-white" /> : <User className="w-7 h-7 text-primary-foreground" />}
            </div>
            <h1 className="text-3xl font-bold text-foreground">
              {role === 'doctor' ? 'Doctor Registration' : 'Employee Registration'}
            </h1>
            <button onClick={() => setStep('role')} className="mt-1 text-sm text-primary hover:underline">← Change role</button>
          </div>

          <form onSubmit={handleSubmit} className="bg-card rounded-3xl shadow-card p-8 space-y-5">
            {error && (
              <div className="px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">{error}</div>
            )}

            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Full Name</label>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required
                className="w-full px-4 py-3 rounded-xl bg-secondary border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                placeholder="Mario Rossi" />
            </div>

            {/* Username */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Username</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required
                className="w-full px-4 py-3 rounded-xl bg-secondary border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                placeholder="mario.rossi" />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full px-4 py-3 rounded-xl bg-secondary border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                placeholder="mario@azienda.it" />
            </div>

            {/* Codice Fiscale */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Codice Fiscale (Tax Code)</label>
              <input type="text" value={taxCode} onChange={(e) => setTaxCode(e.target.value.toUpperCase())} required maxLength={16}
                className="w-full px-4 py-3 rounded-xl bg-secondary border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all font-mono tracking-wider"
                placeholder="RSSMRA80A01H501U" />
              <p className="text-xs text-muted-foreground">16-character Italian tax identification code</p>
            </div>

            {/* Medical ID — doctors only */}
            {role === 'doctor' && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Medical ID / Ordine dei Medici Number</label>
                <input type="text" value={medicalId} onChange={(e) => setMedicalId(e.target.value)} required
                  className="w-full px-4 py-3 rounded-xl bg-secondary border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-400/30 transition-all font-mono"
                  placeholder="e.g. RM-12345" />
                <p className="text-xs text-muted-foreground">Will be verified by our team before your account is activated.</p>
              </div>
            )}

            {/* Corporate health plan fields — patients/employees only */}
            {role === 'patient' && (
              <>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-primary" />
                    Company / Employer Name
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-secondary border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                    placeholder="e.g. Acme S.p.A."
                  />
                  <p className="text-xs text-muted-foreground">The company whose health plan covers you</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                    <BadgeCheck className="w-3.5 h-3.5 text-primary" />
                    Employee ID
                    <span className="text-xs text-muted-foreground font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-secondary border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all font-mono tracking-wider"
                    placeholder="e.g. EMP-00421"
                  />
                  <p className="text-xs text-muted-foreground">Your company employee ID, used to verify your health plan eligibility</p>
                </div>
              </>
            )}

            {/* Preferred Language */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Preferred Language</label>
              <select value={preferredLanguage} onChange={(e) => setPreferredLanguage(e.target.value)} required
                className="w-full px-4 py-3 rounded-xl bg-secondary border-0 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all appearance-none cursor-pointer">
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>{l.label}</option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground">We'll match you with doctors who speak your language</p>
            </div>

            {/* City */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">City of Residence</label>
              <select value={city} onChange={(e) => setCity(e.target.value)} required
                className="w-full px-4 py-3 rounded-xl bg-secondary border-0 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all appearance-none cursor-pointer">
                <option value="">Select your city…</option>
                {ITALIAN_CITIES.sort().map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required
                  className="w-full px-4 py-3 rounded-xl bg-secondary border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all pr-12"
                  placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">Minimum 6 characters</p>
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start gap-3 pt-1">
              <button
                type="button"
                onClick={() => setTermsAccepted(!termsAccepted)}
                className={`mt-0.5 w-5 h-5 rounded flex-shrink-0 border-2 flex items-center justify-center transition-all ${
                  termsAccepted ? 'bg-primary border-primary' : 'border-border bg-secondary hover:border-primary/50'
                }`}
              >
                {termsAccepted && (
                  <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              <p className="text-sm text-muted-foreground leading-relaxed">
                I have read and agree to the{' '}
                <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-0.5">
                  Terms & Conditions <ExternalLink className="w-3 h-3" />
                </a>{' '}
                and{' '}
                <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-0.5">
                  Privacy Policy <ExternalLink className="w-3 h-3" />
                </a>
              </p>
            </div>

            <button type="submit" disabled={loading}
              className={`w-full py-3.5 rounded-xl font-medium hover:opacity-90 transition-opacity active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2 ${
                role === 'doctor' ? 'bg-emerald-500 text-white' : 'gradient-hero text-primary-foreground'
              }`}>
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Create Account
            </button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-medium hover:underline">Log in</Link>
            </p>
          </form>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default Signup;
