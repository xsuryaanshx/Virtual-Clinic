import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, User, FileText } from 'lucide-react';
import PageTransition from '@/components/PageTransition';

const Triage = () => {
  const { t } = useI18n();
  const navigate = useNavigate();

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
              <div className="w-12 h-12 rounded-2xl bg-urgency-medium/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-urgency-medium" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('triage.urgency')}</p>
                <p className="text-lg font-semibold text-urgency-medium">{t('triage.medium')}</p>
              </div>
            </div>

            {/* Specialist */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('triage.specialist')}</p>
                <p className="text-lg font-semibold text-foreground">Medico Generico</p>
              </div>
            </div>

            {/* Summary */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('triage.summary')}</p>
                <p className="text-foreground leading-relaxed mt-1">
                  Il paziente presenta sintomi influenzali persistenti da 5 giorni con febbre moderata. 
                  Si consiglia una consultazione con un medico generico per valutazione approfondita.
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate('/waiting')}
              className="w-full py-3.5 rounded-xl gradient-hero text-primary-foreground font-medium hover:opacity-90 transition-opacity active:scale-[0.98]"
            >
              {t('triage.joinWaiting')}
            </button>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Triage;
