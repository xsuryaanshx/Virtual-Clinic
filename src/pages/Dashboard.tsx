import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';
import { Plus, Clock, ChevronRight } from 'lucide-react';
import PageTransition from '@/components/PageTransition';

const mockConsultations = [
  { id: 1, date: '2026-04-08', specialist: 'Cardiologo', urgency: 'low' as const, summary: 'Controllo pressione arteriosa' },
  { id: 2, date: '2026-04-05', specialist: 'Medico Generico', urgency: 'medium' as const, summary: 'Sintomi influenzali persistenti' },
  { id: 3, date: '2026-03-28', specialist: 'Dermatologo', urgency: 'low' as const, summary: 'Irritazione cutanea' },
];

const urgencyColors = {
  low: 'bg-urgency-low/10 text-urgency-low',
  medium: 'bg-urgency-medium/10 text-urgency-medium',
  high: 'bg-urgency-high/10 text-urgency-high',
};

const Dashboard = () => {
  const { t } = useI18n();
  const { name } = useAuth();
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-12 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{t('dashboard.welcome')}, {name || 'Patient'}</h1>
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

          {/* Previous consultations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-12"
          >
            <h2 className="text-xl font-semibold text-foreground mb-6">{t('dashboard.previousConsultations')}</h2>
            <div className="space-y-4">
              {mockConsultations.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.4 }}
                  className="bg-card rounded-2xl shadow-card p-6 flex items-center gap-5 hover:shadow-elevated transition-all cursor-pointer group"
                  onClick={() => navigate('/triage')}
                >
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium text-foreground truncate">{c.summary}</h3>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full flex-shrink-0 ${urgencyColors[c.urgency]}`}>
                        {c.urgency}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{c.specialist} · {c.date}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Dashboard;
