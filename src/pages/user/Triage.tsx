import { motion, useReducedMotion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { useNavigate, useLocation } from "react-router-dom";
import { AlertTriangle, User, FileText, ShieldAlert, ShieldCheck } from "lucide-react";
import PageTransition from "@/components/user/PageTransition";
import { Button } from "@/components/user/ui/button";
import type { TriageResult } from "./Chat";
import { staggerContainer, staggerItem } from "@/lib/motionVariants";

const urgencyConfig = {
  low: {
    color: "text-green-500",
    bg: "bg-green-500/10",
    icon: ShieldCheck,
    key: "triage.low",
  },
  medium: {
    color: "text-urgency-medium",
    bg: "bg-urgency-medium/10",
    icon: AlertTriangle,
    key: "triage.medium",
  },
  high: {
    color: "text-red-500",
    bg: "bg-red-500/10",
    icon: ShieldAlert,
    key: "triage.high",
  },
};

const Triage = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const reduceMotion = useReducedMotion();

  const triage: TriageResult =
    (location.state as { triage?: TriageResult } | undefined)?.triage ?? {
      urgency: "medium",
      specialist: t("triage.defaultSpecialist"),
      summary: t("triage.defaultSummary"),
    };

  const config = urgencyConfig[triage.urgency] ?? urgencyConfig.medium;
  const UrgencyIcon = config.icon;

  return (
    <PageTransition>
      <div className="flex min-h-screen items-start justify-center px-6 pb-12 pt-24">
        <div className="w-full max-w-lg">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mb-8 text-center"
          >
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{t("triage.title")}</h1>
          </motion.div>

          <motion.div
            className="space-y-8 rounded-3xl bg-card p-8 shadow-elevated"
            variants={reduceMotion ? undefined : staggerContainer}
            initial={reduceMotion ? false : "hidden"}
            animate={reduceMotion ? false : "show"}
          >
            <motion.div
              variants={reduceMotion ? undefined : staggerItem}
              className="flex items-center gap-4"
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${config.bg}`}
              >
                <UrgencyIcon className={`h-5 w-5 ${config.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("triage.urgency")}</p>
                <p className={`text-lg font-semibold ${config.color}`}>{t(config.key)}</p>
              </div>
            </motion.div>

            <motion.div variants={reduceMotion ? undefined : staggerItem} className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("triage.specialist")}</p>
                <p className="text-lg font-semibold text-foreground">{triage.specialist}</p>
              </div>
            </motion.div>

            <motion.div variants={reduceMotion ? undefined : staggerItem} className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("triage.summary")}</p>
                <p className="mt-1 leading-relaxed text-foreground">{triage.summary}</p>
              </div>
            </motion.div>

            <motion.div
              variants={reduceMotion ? undefined : staggerItem}
              className="flex flex-col gap-3"
            >
              <Button
                type="button"
                onClick={() => navigate("/waiting")}
                className="h-12 w-full rounded-xl gradient-hero text-primary-foreground shadow-card transition-opacity hover:opacity-90"
              >
                {t("triage.joinWaiting")}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate("/chat")}
                className="h-11 w-full rounded-xl"
              >
                {t("triage.retake")}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Triage;
