import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { useNavigate, useLocation } from 'react-router-dom';
import { AlertTriangle, User, FileText, ShieldAlert, ShieldCheck } from 'lucide-react';
import PageTransition from '@/components/user/PageTransition';
import type { TriageResult } from './Chat';

const urgencyConfig = {
  low: {
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    icon: ShieldCheck,
    key: 'triage.low',
  },
  medium: {
    color: 'text-urgency-medium',
    bg: 'bg-urgency-medium/10',
    icon: AlertTriangle,
    key: 'triage.medium',
  },
  high: {
    color: 'text-red-500',
    bg: 'bg-red-500/10',
    icon: ShieldAlert,
    key: 'triage.high',
  },
};

const Triage = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();

  // Try to get real triage data passed via router state; fall back to mock
  const triage: TriageResult = location.state?.triage ?? {
    urgency: 'medium',
    specialist: t('triage.defaultSpecialist'),
    summary: t('triage.defaultSummary'),
  };

  const config = urgencyConfig[triage.urgency] ?? urgencyConfig.medium;
  const UrgencyIcon = config.icon;

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-12 px-6 flex items-start justify-center">
        <div className="w-full max-w-lg">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold text-foreground">{t('triage.title')}</h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-card rounded-3xl shadow-elevated p-8 space-y-8"
          >
            {/* Urgency */}
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl ${config.bg} flex items-center justify-center`}>
                <UrgencyIcon className={`w-5 h-5 ${config.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('triage.urgency')}</p>
                <p className={`text-lg font-semibold ${config.color}`}>{t(config.key)}</p>
              </div>
            </div>

            {/* Specialist */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('triage.specialist')}</p>
                <p className="text-lg font-semibold text-foreground">{triage.specialist}</p>
              </div>
            </div>

            {/* Summary */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('triage.summary')}</p>
                <p className="text-foreground leading-relaxed mt-1">{triage.summary}</p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate('/waiting')}
                className="w-full py-3.5 rounded-xl gradient-hero text-primary-foreground font-medium hover:opacity-90 transition-opacity active:scale-[0.98]"
              >
                {t('triage.joinWaiting')}
              </button>
              <button
                onClick={() => navigate('/chat')}
                className="w-full py-3 rounded-xl bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors active:scale-[0.98]"
              >
                {t('triage.retake')}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Triage;
