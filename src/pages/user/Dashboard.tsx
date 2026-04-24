import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { useNavigate } from 'react-router-dom';
import { Plus, ChevronRight } from 'lucide-react';
import PageTransition from '@/components/user/PageTransition';
import { useAuth } from '@/hooks/user/useAuth';

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
};

const Dashboard = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Pull name from user_metadata (set during signup), fall back to email prefix
  const fullName = user?.user_metadata?.full_name
    || user?.user_metadata?.name
    || user?.email?.split('@')[0]
    || 'there';

  // Show only the first name for a friendlier greeting
  const firstName = fullName.split(' ')[0];

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-12 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              {getGreeting()}, {firstName} 👋
            </h1>
            <p className="mt-2 text-muted-foreground">{t('dashboard.title')}</p>
          </motion.div>

          {/* New consultation CTA */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            onClick={() => navigate('/chat')}
            className="mt-8 w-full bg-card rounded-3xl shadow-card p-8 flex items-center gap-6 hover:shadow-elevated transition-all group"
          >
            <div className="w-14 h-14 rounded-2xl gradient-hero flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <Plus className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="text-left">
              <h2 className="text-lg font-semibold text-foreground">{t('dashboard.newConsultation')}</h2>
              <p className="text-sm text-muted-foreground">{t('dashboard.startFirst')}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground ml-auto" />
          </motion.button>
        </div>
      </div>
    </PageTransition>
  );
};

export default Dashboard;
