import { motion } from 'framer-motion';
import { useI18n } from '@/i18n/I18nContext';
import { Users, MessageSquare, CheckCircle, Clock } from 'lucide-react';

const stats = [
  { key: 'dashboard.incoming_patients', value: '5', icon: Users, color: 'text-primary' },
  { key: 'dashboard.active_consultations', value: '2', icon: MessageSquare, color: 'text-accent-foreground' },
  { key: 'dashboard.completed_today', value: '8', icon: CheckCircle, color: 'text-green-600' },
  { key: 'dashboard.avg_wait', value: '14 min', icon: Clock, color: 'text-muted-foreground' },
];

const DashboardView = () => {
  const { t } = useI18n();

  return (
    <div className="p-4 md:p-8 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-semibold text-foreground mb-1">{t('dashboard.title')}</h1>
        <p className="text-muted-foreground mb-8">{t('dashboard.welcome')} Rossi</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.08 }}
              className="glass-card p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{t(stat.key)}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardView;
