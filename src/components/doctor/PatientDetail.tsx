import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '@/i18n/I18nContext';
import type { Patient } from '@/data/mockData';
import { X, AlertTriangle, FileText, Activity, ArrowRight } from 'lucide-react';

interface PatientDetailProps {
  patient: Patient;
  onClose: () => void;
  onStartConsultation: (patient: Patient) => void;
}

const PatientDetail = ({ patient, onClose, onStartConsultation }: PatientDetailProps) => {
  const { t, locale } = useI18n();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-end bg-foreground/10 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 400, damping: 35 }}
          className="h-full w-full max-w-full md:max-w-lg bg-card border-l border-border overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border/50 p-5 flex items-center justify-between z-10">
            <div>
              <h2 className="text-lg font-semibold text-foreground">{patient.name}</h2>
              <p className="text-sm text-muted-foreground">{patient.age} • {patient.gender} • {patient.suggestedSpecialty[locale]}</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-secondary transition-colors">
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          <div className="p-5 space-y-6">
            <section>
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-primary" />
                {t('patients.ai_summary')}
              </h3>
              <p className="text-sm text-foreground/80 leading-relaxed p-3 bg-secondary/50 rounded-lg">
                {patient.aiSummary[locale]}
              </p>
            </section>

            <section>
              <h3 className="text-sm font-semibold text-foreground mb-2">{t('patients.symptoms')}</h3>
              <div className="flex flex-wrap gap-2">
                {patient.symptoms[locale].map((s) => (
                  <span key={s} className="text-xs font-medium px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground">
                    {s}
                  </span>
                ))}
              </div>
            </section>

            {patient.riskIndicators[locale].length > 0 && (
              <section>
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  {t('patients.risk')}
                </h3>
                <ul className="space-y-1.5">
                  {patient.riskIndicators[locale].map((r) => (
                    <li key={r} className="text-sm text-foreground/80 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      {r}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section>
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                {t('patients.medical_history')}
              </h3>
              <div className="space-y-2">
                {patient.medicalHistory.map((entry, i) => (
                  <div key={i} className="flex gap-3 text-sm p-2.5 rounded-lg bg-secondary/30">
                    <span className="text-muted-foreground shrink-0 font-mono text-xs mt-0.5">{entry.date}</span>
                    <span className="text-foreground/80">{entry.description[locale]}</span>
                  </div>
                ))}
              </div>
            </section>

            <button
              onClick={() => onStartConsultation(patient)}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              {t('patients.start_consultation')}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PatientDetail;
