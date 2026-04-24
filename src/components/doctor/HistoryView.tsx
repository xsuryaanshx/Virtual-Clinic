import { motion } from 'framer-motion';
import { useI18n } from '@/i18n/I18nContext';
import { mockHistory } from '@/data/mockData';
import { CheckCircle, ArrowUpRight, RotateCcw } from 'lucide-react';

const outcomeConfig = {
  completed: { icon: CheckCircle, className: 'text-green-600 bg-green-50' },
  referred: { icon: ArrowUpRight, className: 'text-primary bg-accent' },
  followup: { icon: RotateCcw, className: 'text-amber-600 bg-amber-50' },
};

const HistoryView = () => {
  const { t, locale } = useI18n();

  return (
    <div className="p-4 md:p-8 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-semibold text-foreground">{t('history.title')}</h1>
      </motion.div>

      <div className="space-y-3">
        {mockHistory.map((entry, i) => {
          const config = outcomeConfig[entry.outcome];
          const Icon = config.icon;
          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              className="glass-card p-4 flex items-start gap-4"
            >
              <div className={`p-2 rounded-lg ${config.className}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-medium text-sm text-foreground">{entry.patientName}</span>
                  <span className="text-xs text-muted-foreground font-mono">{entry.date}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{entry.summary[locale]}</p>
              </div>
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground shrink-0">
                {t(`history.${entry.outcome}`)}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default HistoryView;
