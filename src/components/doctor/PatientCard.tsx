import { motion } from 'framer-motion';
import { useI18n } from '@/i18n/I18nContext';
import type { Patient } from '@/data/mockData';
import { Clock, Sparkles, ArrowRight } from 'lucide-react';

interface PatientCardProps {
  patient: Patient;
  onViewDetails: (patient: Patient) => void;
  onAccept: (patient: Patient) => void;
  index: number;
}

const urgencyStyles = {
  low: 'urgency-low',
  medium: 'urgency-medium',
  high: 'urgency-high',
};

const urgencyLabels = { low: 'Low', medium: 'Medium', high: 'High' };

const PatientCard = ({ patient, onViewDetails, onAccept, index }: PatientCardProps) => {
  const { t, locale } = useI18n();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -3, transition: { duration: 0.22 } }}
      className="glass-card group cursor-pointer p-5 shadow-card transition-shadow hover:shadow-elevated"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground">{patient.name}</h3>
            {patient.isNew && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-accent px-1.5 py-0.5 rounded animate-pulse-soft">
                {t('patients.new')}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">{patient.age} • {patient.gender}</p>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${urgencyStyles[patient.urgency]}`}>
          {urgencyLabels[patient.urgency]}
        </span>
      </div>

      <div className="flex items-start gap-2 mb-3 p-3 rounded-lg bg-secondary/50">
        <Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" />
        <p className="text-sm text-foreground/80 leading-relaxed line-clamp-2">{patient.aiSummary[locale]}</p>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          <span>{t('patients.waiting')} {patient.waitingMinutes} {t('patients.minutes')}</span>
        </div>
        <span className="text-xs font-medium text-accent-foreground bg-accent px-2 py-0.5 rounded">
          {patient.suggestedSpecialty[locale]}
        </span>
      </div>

      <div className="flex gap-2">
        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          onClick={(e) => { e.stopPropagation(); onViewDetails(patient); }}
          className="flex-1 rounded-lg border border-border py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
        >
          {t('patients.view_details')}
        </motion.button>
        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          onClick={(e) => { e.stopPropagation(); onAccept(patient); }}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          {t('patients.accept')}
          <ArrowRight className="w-3.5 h-3.5" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default PatientCard;
