import { motion } from 'framer-motion';
import { useI18n } from '@/i18n/I18nContext';
import { User, Bell, Globe } from 'lucide-react';

const SettingsView = () => {
  const { t } = useI18n();

  const sections = [
    { icon: User, label: t('settings.profile'), description: 'Manage your profile information and preferences' },
    { icon: Bell, label: t('settings.notifications'), description: 'Configure notification settings and alerts' },
    { icon: Globe, label: t('settings.language'), description: 'Change the interface language' },
  ];

  return (
    <div className="p-4 md:p-8 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-semibold text-foreground">{t('settings.title')}</h1>
      </motion.div>

      <div className="space-y-3">
        {sections.map((section, i) => {
          const Icon = section.icon;
          return (
            <motion.button
              key={section.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              className="w-full glass-card p-4 flex items-center gap-4 text-left hover:border-primary/20 transition-colors"
            >
              <div className="p-2 rounded-lg bg-secondary">
                <Icon className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium text-sm text-foreground">{section.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{section.description}</p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default SettingsView;
