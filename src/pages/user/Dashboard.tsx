import { motion, useReducedMotion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { useNavigate } from "react-router-dom";
import { Plus, ChevronRight, Sparkles } from "lucide-react";
import PageTransition from "@/components/user/PageTransition";
import { useAuth } from "@/hooks/user/useAuth";
import { staggerContainer, staggerItem, smoothEase } from "@/lib/motionVariants";

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
};

const Dashboard = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { user } = useAuth();
  const reduceMotion = useReducedMotion();

  const fullName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "there";

  const firstName = fullName.split(" ")[0];

  return (
    <PageTransition>
      <div className="min-h-screen px-6 pb-12 pt-24">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            className="space-y-8"
            variants={reduceMotion ? undefined : staggerContainer}
            initial={reduceMotion ? false : "hidden"}
            animate={reduceMotion ? false : "show"}
          >
            <motion.div variants={reduceMotion ? undefined : staggerItem}>
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {getGreeting()}, {firstName} 👋
              </h1>
              <p className="mt-2 text-muted-foreground">{t("dashboard.title")}</p>
            </motion.div>

            <motion.button
              type="button"
              variants={reduceMotion ? undefined : staggerItem}
              whileHover={reduceMotion ? undefined : { scale: 1.01 }}
              whileTap={reduceMotion ? undefined : { scale: 0.99 }}
              transition={smoothEase}
              onClick={() => navigate("/chat")}
              className="group mt-2 flex w-full items-center gap-6 rounded-3xl bg-card p-8 text-left shadow-card transition-shadow hover:shadow-elevated"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl gradient-hero transition-transform duration-300 group-hover:scale-105">
                <Plus className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-foreground">
                    {t("dashboard.newConsultation")}
                  </h2>
                  <Sparkles className="h-4 w-4 shrink-0 text-primary opacity-70" aria-hidden />
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{t("dashboard.startFirst")}</p>
              </div>
              <ChevronRight className="ml-auto h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Dashboard;
