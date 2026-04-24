import { useState } from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { useNavigate } from 'react-router-dom';
import { PhoneOff, Mic, MicOff, Video, VideoOff, User, FileText, AlertTriangle, Info } from 'lucide-react';
import PageTransition from '@/components/user/PageTransition';
import ReviewModal from '@/components/user/ReviewModal';

const VideoConsultation = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showReview, setShowReview] = useState(false);

  const handleHangUp = () => {
    // Show review modal first, then navigate away after they close it
    setShowReview(true);
  };

  const handleReviewClose = () => {
    setShowReview(false);
    navigate('/dashboard');
  };

  return (
    <PageTransition>
      <div className="fixed inset-0 bg-foreground flex flex-col lg:flex-row z-50">
        {/* Main video area */}
        <div className="flex-1 relative flex items-center justify-center min-h-0">
          {/* Remote video placeholder */}
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/90 to-foreground flex items-center justify-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-muted/20 flex items-center justify-center">
              <User className="w-8 h-8 sm:w-10 sm:h-10 text-muted/40" />
            </div>
          </div>

          {/* Self video */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="absolute bottom-28 sm:bottom-24 right-4 sm:right-6 w-24 h-32 sm:w-36 sm:h-48 rounded-2xl bg-muted/30 border border-muted/20 flex items-center justify-center overflow-hidden"
          >
            {cameraOff ? (
              <VideoOff className="w-5 h-5 text-muted/40" />
            ) : (
              <div className="w-full h-full bg-gradient-to-b from-primary/20 to-primary/10 flex items-center justify-center">
                <User className="w-6 h-6 sm:w-8 sm:h-8 text-primary-foreground/60" />
              </div>
            )}
          </motion.div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 sm:gap-4"
          >
            <button
              onClick={() => setMuted(!muted)}
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-colors ${
                muted ? 'bg-destructive' : 'bg-muted/20 hover:bg-muted/30'
              }`}
            >
              {muted ? <MicOff className="w-5 h-5 text-primary-foreground" /> : <Mic className="w-5 h-5 text-primary-foreground" />}
            </button>

            {/* Hang up — triggers review */}
            <button
              onClick={handleHangUp}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-destructive flex items-center justify-center hover:bg-destructive/90 transition-colors active:scale-95"
            >
              <PhoneOff className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
            </button>

            <button
              onClick={() => setCameraOff(!cameraOff)}
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-colors ${
                cameraOff ? 'bg-destructive' : 'bg-muted/20 hover:bg-muted/30'
              }`}
            >
              {cameraOff ? <VideoOff className="w-5 h-5 text-primary-foreground" /> : <Video className="w-5 h-5 text-primary-foreground" />}
            </button>

            <button
              onClick={() => setShowInfo(!showInfo)}
              className="lg:hidden w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center bg-muted/20 hover:bg-muted/30 transition-colors"
            >
              <Info className="w-5 h-5 text-primary-foreground" />
            </button>
          </motion.div>
        </div>

        {/* Sidebar */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className={`${showInfo ? 'block' : 'hidden'} lg:block w-full lg:w-80 bg-card border-t lg:border-t-0 lg:border-l border-border p-5 sm:p-6 overflow-y-auto max-h-[40vh] lg:max-h-none`}
        >
          <h2 className="text-lg font-semibold text-foreground mb-4 lg:mb-6">{t('video.patientInfo')}</h2>
          <div className="space-y-4 lg:space-y-6">
            <div className="bg-secondary rounded-2xl p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gradient-hero flex items-center justify-center">
                  <User className="w-4 h-4 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Giulia Verdi</p>
                  <p className="text-xs text-muted-foreground">32 anni · F</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-urgency-medium" />
              <span className="text-sm font-medium text-urgency-medium">Urgenza Media</span>
            </div>
            <div>
              <h3 className="text-sm font-medium text-foreground flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4" />
                {t('triage.summary')}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Sintomi influenzali persistenti da 5 giorni con febbre moderata (38.2°C).
                Tosse secca e dolori muscolari generalizzati.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Review modal — shown after hang up */}
      <ReviewModal
        isOpen={showReview}
        onClose={handleReviewClose}
        doctorName="Dr. Luca Ferrari"
      />
    </PageTransition>
  );
};

export default VideoConsultation;