import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';
import PageTransition from '@/components/PageTransition';

const DoctorDashboard = () => {
  const { t } = useI18n();
  const navigate = useNavigate();

  const mockPatients = [
    { id: 1, name: `${t('common.patient')} A`, urgency: 'high' as const, summary: t('consultation.summaryChestPain'), age: 54, wait: 2 },
    { id: 2, name: `${t('common.patient')} B`, urgency: 'medium' as const, summary: t('consultation.summaryFluPersistent'), age: 32, wait: 5 },
    { id: 3, name: `${t('common.patient')} C`, urgency: 'low' as const, summary: t('consultation.summaryPostOp'), age: 41, wait: 8 },
  ];

  const urgencyConfig = {
    high: { icon: AlertTriangle, color: 'text-urgency-high', bg: 'bg-urgency-high/10', label: t('triage.high') },
    medium: { icon: AlertCircle, color: 'text-urgency-medium', bg: 'bg-urgency-medium/10', label: t('triage.medium') },
    low: { icon: CheckCircle, color: 'text-urgency-low', bg: 'bg-urgency-low/10', label: t('triage.low') },
  };

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-12 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{t('doctor.title')}</h1>
            <p className="mt-2 text-muted-foreground">{t('doctor.patients')} ({mockPatients.length})</p>
          </motion.div>

          <div className="mt-8 space-y-4">
            {mockPatients.map((patient, i) => {
              const config = urgencyConfig[patient.urgency];
              const Icon = config.icon;

              return (
                <motion.div
                  key={patient.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.1, duration: 0.4 }}
                  className="bg-card rounded-2xl shadow-card p-5 sm:p-6 hover:shadow-elevated transition-all group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl ${config.bg} flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${config.color}`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground">{patient.name}</h3>
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${config.bg} ${config.color}`}>
                            {config.label}
                          </span>
                          <span className="text-xs text-muted-foreground">{patient.age} {t('common.yearsOld')} · {patient.wait} {t('common.minutesShort')}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{patient.summary}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate('/video')}
                      className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2.5 rounded-xl gradient-hero text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity flex-shrink-0 active:scale-95"
                    >
                      {t('doctor.startConsultation')}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default DoctorDashboard;
