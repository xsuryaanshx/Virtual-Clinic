import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { useNavigate } from "react-router-dom";
import PageTransition from "@/components/user/PageTransition";

const WaitingRoom = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [waitTime, setWaitTime] = useState(5);
  const [position, setPosition] = useState(2);

  useEffect(() => {
    const interval = setInterval(() => {
      setWaitTime((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimeout(() => navigate("/video"), 500);
          return 0;
        }
        return prev - 1;
      });
      setPosition((prev) => Math.max(0, prev - 1));
    }, 3000);
    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <PageTransition>
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="max-w-md text-center">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="space-y-10"
          >
            <div className="relative mx-auto h-32 w-32">
              <div className="absolute inset-0 animate-breathe rounded-full gradient-hero opacity-20" />
              <div
                className="absolute inset-4 animate-breathe rounded-full gradient-hero opacity-40"
                style={{ animationDelay: "0.5s" }}
              />
              <div
                className="absolute inset-8 animate-breathe rounded-full gradient-hero opacity-60"
                style={{ animationDelay: "1s" }}
              />
              <div className="absolute inset-12 flex items-center justify-center rounded-full gradient-hero">
                <div className="h-3 w-3 rounded-full bg-primary-foreground" />
              </div>
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">{t("waiting.title")}</h1>
              <p className="mt-3 text-muted-foreground">{t("waiting.connecting")}</p>
            </div>

            <motion.div
              layout
              className="space-y-6 rounded-3xl bg-card p-8 shadow-card"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t("waiting.estimated")}</span>
                <div className="flex items-baseline gap-1">
                  <AnimatePresence mode="popLayout">
                    <motion.span
                      key={waitTime}
                      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                      transition={{ duration: 0.22 }}
                      className="text-2xl font-bold text-foreground"
                    >
                      {waitTime}
                    </motion.span>
                  </AnimatePresence>
                  <span className="text-sm font-normal text-muted-foreground">
                    {t("waiting.minutes")}
                  </span>
                </div>
              </div>
              <div className="h-px bg-border" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t("waiting.position")}</span>
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={position}
                    initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={reduceMotion ? undefined : { opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="text-2xl font-bold text-foreground"
                  >
                    #{position}
                  </motion.span>
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default WaitingRoom;
