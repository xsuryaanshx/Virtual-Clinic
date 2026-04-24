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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="glass-card p-5 group cursor-pointer"
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
        <button
          onClick={(e) => { e.stopPropagation(); onViewDetails(patient); }}
          className="flex-1 text-sm font-medium py-2 rounded-lg border border-border text-foreground hover:bg-secondary transition-colors"
        >
          {t('patients.view_details')}
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onAccept(patient); }}
          className="flex-1 text-sm font-medium py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5"
        >
          {t('patients.accept')}
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
};

export default PatientCard;
