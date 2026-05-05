import { motion, useScroll, useTransform } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Brain, Video, Clock, Zap, Shield, Sparkles } from 'lucide-react';
import PageTransition from '@/components/PageTransition';

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const },
};

const stagger = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const Landing = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);

  const steps = [
    { icon: MessageSquare, title: t('how.step1.title'), desc: t('how.step1.desc') },
    { icon: Brain, title: t('how.step2.title'), desc: t('how.step2.desc') },
    { icon: Video, title: t('how.step3.title'), desc: t('how.step3.desc') },
  ];

  const benefits = [
    { icon: Clock, title: t('benefits.noWait'), desc: t('benefits.noWaitDesc') },
    { icon: Zap, title: t('benefits.instant'), desc: t('benefits.instantDesc') },
    { icon: Sparkles, title: t('benefits.ai'), desc: t('benefits.aiDesc') },
    { icon: Shield, title: t('benefits.secure'), desc: t('benefits.secureDesc') },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen">
        {/* Hero */}
        <motion.section
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="relative min-h-screen flex items-center justify-center overflow-hidden"
        >
          {/* Gradient orbs */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-breathe" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/30 rounded-full blur-3xl animate-breathe" style={{ animationDelay: '1.5s' }} />
          </div>

          <div className="relative container mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <span className="inline-block px-4 py-1.5 mb-8 text-xs font-medium tracking-wide text-primary bg-accent rounded-full">
                AI-Powered Healthcare
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground leading-[1.05]"
            >
              {t('hero.title')}
              <br />
              <span className="text-gradient">{t('hero.subtitle')}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              {t('hero.description')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button
                onClick={() => navigate('/chat')}
                className="px-8 py-4 rounded-full gradient-hero text-primary-foreground font-medium text-base shadow-elevated hover:shadow-soft transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {t('hero.cta')}
              </button>
              <a
                href="#how-it-works"
                className="px-8 py-4 rounded-full bg-secondary text-secondary-foreground font-medium text-base hover:bg-muted transition-colors"
              >
                {t('hero.ctaSecondary')}
              </a>
            </motion.div>
          </div>
        </motion.section>

        {/* How it works */}
        <section id="how-it-works" className="py-16 sm:py-32 bg-surface">
          <div className="container mx-auto px-6">
            <motion.div {...fadeInUp} className="text-center mb-20">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">{t('how.title')}</h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">{t('how.subtitle')}</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  {...stagger}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="relative bg-card rounded-3xl p-8 shadow-card hover:shadow-elevated transition-shadow group"
                >
                  <div className="w-14 h-14 rounded-2xl gradient-hero flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <step.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <span className="absolute top-8 right-8 text-6xl font-bold text-muted/50">
                    {i + 1}
                  </span>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section id="benefits" className="py-16 sm:py-32">
          <div className="container mx-auto px-6">
            <motion.div {...fadeInUp} className="text-center mb-20">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">{t('benefits.title')}</h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">{t('benefits.subtitle')}</p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {benefits.map((b, i) => (
                <motion.div
                  key={i}
                  {...stagger}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-card rounded-3xl p-8 shadow-card hover:shadow-elevated transition-all hover:-translate-y-1 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-5 group-hover:bg-primary/10 transition-colors">
                    <b.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{b.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-border">
          <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
            © 2026 Virtual Clinic. All rights reserved.
          </div>
        </footer>
      </div>
    </PageTransition>
  );
};

export default Landing;
