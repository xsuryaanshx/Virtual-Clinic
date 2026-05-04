import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, User, Stethoscope } from "lucide-react";
import PageTransition from "@/components/user/PageTransition";
import { signIn } from "@/lib/supabase";
import { useI18n } from "@/lib/i18n";
import { smoothEase } from "@/lib/motionVariants";

type RoleTab = "patient" | "doctor";

const Login = () => {
  const { t } = useI18n();
  const reduceMotion = useReducedMotion();
  const [roleTab, setRoleTab] = useState<RoleTab>("patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      if (roleTab === "doctor" && role !== "doctor") {
        setError("This account is not registered as a doctor. Please use the Patient tab.");
        setLoading(false);
        return;
      }
      if (roleTab === "patient" && role === "doctor") {
        setError(
          "This is a doctor account. Please use the Doctor tab or go to your doctor dashboard."
        );
        setLoading(false);
        return;
      }
      window.location.href = role === "doctor" ? "/doctor/dashboard" : "/dashboard";
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="flex min-h-screen items-center justify-center px-6 pt-16">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-full max-w-md"
        >
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{t("auth.welcome")}</h1>
            <p className="mt-2 text-muted-foreground">{t("auth.signInSubtitle")}</p>
          </div>

          <div className="mb-6 flex gap-2 rounded-2xl bg-secondary p-1.5">
            <button
              type="button"
              onClick={() => {
                setRoleTab("patient");
                setError(null);
              }}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition-all ${
                roleTab === "patient"
                  ? "bg-card text-foreground shadow-card"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <User className="h-4 w-4" />
              {t("auth.rolePatient")}
            </button>
            <button
              type="button"
              onClick={() => {
                setRoleTab("doctor");
                setError(null);
              }}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition-all ${
                roleTab === "doctor"
                  ? "bg-emerald-500 text-white shadow-card"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Stethoscope className="h-4 w-4" />
              {t("auth.roleDoctor")}
            </button>
          </div>

          <motion.form
            onSubmit={(e) => void handleSubmit(e)}
            className="space-y-6 rounded-3xl bg-card p-8 shadow-card"
            whileHover={reduceMotion ? undefined : { boxShadow: "var(--shadow-elevated)" }}
            transition={smoothEase}
          >
            {error && (
              <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="login-email">
                {t("auth.email")}
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border-0 bg-secondary px-4 py-3 text-foreground transition-all placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="nome@email.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="login-password">
                {t("auth.password")}
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-xl border-0 bg-secondary px-4 py-3 pr-12 text-foreground transition-all placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="text-right">
              <button type="button" className="text-sm text-primary hover:underline">
                {t("auth.forgotPassword")}
              </button>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-medium transition-opacity hover:opacity-90 active:scale-[0.98] disabled:opacity-60 ${
                roleTab === "doctor"
                  ? "bg-emerald-500 text-white"
                  : "gradient-hero text-primary-foreground"
              }`}
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {roleTab === "doctor" ? t("auth.signInAsDoctor") : t("auth.signInAsPatient")}
            </motion.button>

            <p className="text-center text-sm text-muted-foreground">
              {t("auth.noAccount")}{" "}
              <Link to="/signup" className="font-medium text-primary hover:underline">
                {t("nav.signup")}
              </Link>
            </p>
          </motion.form>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default Login;
