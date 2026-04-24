import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { useNavigate } from 'react-router-dom';
import PageTransition from '@/components/user/PageTransition';

const WaitingRoom = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [waitTime, setWaitTime] = useState(5);
  const [position, setPosition] = useState(2);

  useEffect(() => {
    const interval = setInterval(() => {
      setWaitTime((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimeout(() => navigate('/video'), 500);
          return 0;
        }
        return prev - 1;
      });
      setPosition((prev) => Math.max(0, prev - 1));
    }, 3000);
    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="space-y-10"
          >
            {/* Pulse animation */}
            <div className="relative mx-auto w-32 h-32">
              <div className="absolute inset-0 rounded-full gradient-hero opacity-20 animate-breathe" />
              <div className="absolute inset-4 rounded-full gradient-hero opacity-40 animate-breathe" style={{ animationDelay: '0.5s' }} />
              <div className="absolute inset-8 rounded-full gradient-hero opacity-60 animate-breathe" style={{ animationDelay: '1s' }} />
              <div className="absolute inset-12 rounded-full gradient-hero flex items-center justify-center">
                <div className="w-3 h-3 bg-primary-foreground rounded-full" />
              </div>
            </div>

            <div>
              <h1 className="text-2xl font-bold text-foreground">{t('waiting.title')}</h1>
              <p className="mt-3 text-muted-foreground">{t('waiting.connecting')}</p>
            </div>

            <div className="bg-card rounded-3xl shadow-card p-8 space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{t('waiting.estimated')}</span>
                <span className="text-2xl font-bold text-foreground">{waitTime} <span className="text-sm font-normal text-muted-foreground">{t('waiting.minutes')}</span></span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{t('waiting.position')}</span>
                <span className="text-2xl font-bold text-foreground">#{position}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default WaitingRoom;
