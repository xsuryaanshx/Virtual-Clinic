import { useState } from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '@/i18n/I18nContext';
import type { Patient } from '@/data/mockData';
import { Mic, MicOff, PhoneOff, User, Sparkles, ChevronUp, ChevronDown } from 'lucide-react';

interface ConsultationViewProps {
  patient: Patient;
  onEnd: () => void;
}

const ConsultationView = ({ patient, onEnd }: ConsultationViewProps) => {
  const { t, locale } = useI18n();
  const [muted, setMuted] = useState(false);
  const [notes, setNotes] = useState('');
  const [showPanel, setShowPanel] = useState(false);

  const handleGenerateSummary = () => {
    setNotes(
      (prev) =>
        prev +
        (prev ? '\n\n' : '') +
        `--- AI Summary ---\n${patient.aiSummary[locale]}\n\nSymptoms: ${patient.symptoms[locale].join(', ')}\nRisk: ${patient.riskIndicators[locale].join(', ') || 'None identified'}`
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col md:flex-row h-full"
    >
      {/* Video area */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 bg-foreground/5 relative flex items-center justify-center m-2 md:m-4 rounded-2xl overflow-hidden min-h-[250px]">
          <div className="text-center">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-secondary mx-auto flex items-center justify-center mb-3 md:mb-4">
              <User className="w-8 h-8 md:w-10 md:h-10 text-muted-foreground" />
            </div>
            <p className="text-foreground font-medium text-sm md:text-base">{patient.name}</p>
            <p className="text-xs md:text-sm text-muted-foreground">{t('consultation.title')}</p>
          </div>

          <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 w-24 h-20 md:w-36 md:h-28 rounded-xl bg-secondary/80 border border-border/50 flex items-center justify-center">
            <User className="w-5 h-5 md:w-6 md:h-6 text-muted-foreground" />
          </div>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-3">
            <button
              onClick={() => setMuted(!muted)}
              className={`p-2.5 md:p-3 rounded-full transition-colors ${
                muted ? 'bg-destructive text-destructive-foreground' : 'bg-card border border-border text-foreground hover:bg-secondary'
              }`}
            >
              {muted ? <MicOff className="w-4 h-4 md:w-5 md:h-5" /> : <Mic className="w-4 h-4 md:w-5 md:h-5" />}
            </button>
            <button
              onClick={onEnd}
              className="p-2.5 md:p-3 rounded-full bg-destructive text-destructive-foreground hover:opacity-90 transition-opacity"
            >
              <PhoneOff className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        </div>

        {/* Mobile toggle for panel */}
        <button
          onClick={() => setShowPanel(!showPanel)}
          className="md:hidden flex items-center justify-center gap-2 py-2 text-xs font-medium text-muted-foreground border-t border-border/50"
        >
          {showPanel ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          {t('consultation.notes')}
        </button>
      </div>

      {/* Right sidebar / bottom panel */}
      <div className={`${showPanel ? 'flex' : 'hidden'} md:flex w-full md:w-80 border-t md:border-t-0 md:border-l border-border/50 flex-col bg-card max-h-[50vh] md:max-h-none overflow-y-auto`}>
        <div className="p-3 md:p-4 border-b border-border/50">
          <h3 className="text-sm font-semibold text-foreground mb-2">{t('consultation.patient_summary')}</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">{patient.aiSummary[locale]}</p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {patient.symptoms[locale].map((s) => (
              <span key={s} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="flex-1 p-3 md:p-4 flex flex-col min-h-0">
          <h3 className="text-sm font-semibold text-foreground mb-2">{t('consultation.notes')}</h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t('consultation.notes_placeholder')}
            className="flex-1 w-full resize-none text-sm p-3 rounded-lg bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring min-h-[100px]"
          />
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleGenerateSummary}
              className="flex-1 text-xs font-medium py-2 rounded-lg border border-border text-foreground hover:bg-secondary transition-colors flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              {t('consultation.generate_summary')}
            </button>
          </div>
        </div>

        <div className="p-3 md:p-4 border-t border-border/50">
          <button
            onClick={onEnd}
            className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            {t('consultation.save')}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ConsultationView;
