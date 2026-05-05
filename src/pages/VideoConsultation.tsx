import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { PhoneOff, Mic, MicOff, Video, VideoOff, User, FileText, AlertTriangle, Info } from 'lucide-react';
import PageTransition from '@/components/PageTransition';

type CameraStatus = 'loading' | 'ready' | 'off' | 'error';

const VideoConsultation = () => {
  const { t } = useI18n();
  const { role } = useAuth();
  const navigate = useNavigate();
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [cameraStatus, setCameraStatus] = useState<CameraStatus>('loading');
  const [cameraErrorKey, setCameraErrorKey] = useState<'video.cameraUnavailable' | 'video.cameraPermissionDenied' | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraStatus('error');
      setCameraErrorKey('video.cameraUnavailable');
      return;
    }

    setCameraStatus('loading');
    setCameraErrorKey(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false,
      });

      stopCamera();
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => undefined);
      }

      setCameraOff(false);
      setCameraStatus('ready');
    } catch (error) {
      stopCamera();
      setCameraStatus('error');

      if (error instanceof DOMException && ['NotAllowedError', 'SecurityError'].includes(error.name)) {
        setCameraErrorKey('video.cameraPermissionDenied');
      } else {
        setCameraErrorKey('video.cameraUnavailable');
      }
    }
  }, [stopCamera]);

  useEffect(() => {
    void startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  const handleToggleCamera = () => {
    if (cameraOff || cameraStatus === 'error') {
      void startCamera();
      return;
    }

    stopCamera();
    setCameraOff(true);
    setCameraStatus('off');
    setCameraErrorKey(null);
  };

  const handleEndCall = () => {
    stopCamera();
    navigate(role === 'doctor' ? '/doctor' : '/dashboard');
  };

  const patientName = `${t('common.patient')} B`;

  return (
    <PageTransition>
      <div className="fixed inset-0 bg-foreground flex flex-col lg:flex-row z-50">
        <div className="flex-1 relative flex items-center justify-center min-h-0">
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/90 to-foreground flex items-center justify-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-muted/20 flex items-center justify-center">
              <User className="w-8 h-8 sm:w-10 sm:h-10 text-muted/40" />
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="absolute bottom-28 sm:bottom-24 right-4 sm:right-6 w-24 h-32 sm:w-36 sm:h-48 rounded-2xl bg-muted/30 border border-muted/20 overflow-hidden"
          >
            {cameraStatus === 'ready' && !cameraOff ? (
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
            ) : (
              <div className="w-full h-full bg-gradient-to-b from-primary/20 to-primary/10 flex flex-col items-center justify-center gap-2 px-3 text-center">
                {cameraOff ? (
                  <VideoOff className="w-5 h-5 text-primary-foreground/70" />
                ) : (
                  <User className="w-6 h-6 sm:w-8 sm:h-8 text-primary-foreground/60" />
                )}
                {cameraStatus === 'loading' && (
                  <p className="text-[10px] sm:text-xs text-primary-foreground/80 leading-snug">{t('video.startingCamera')}</p>
                )}
                {cameraStatus === 'error' && cameraErrorKey && (
                  <p className="text-[10px] sm:text-xs text-primary-foreground/80 leading-snug">{t(cameraErrorKey)}</p>
                )}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 sm:gap-4"
          >
            <button
              onClick={() => setMuted(!muted)}
              aria-label={t('video.mute')}
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-colors ${
                muted ? 'bg-destructive' : 'bg-muted/20 hover:bg-muted/30'
              }`}
            >
              {muted ? <MicOff className="w-5 h-5 text-primary-foreground" /> : <Mic className="w-5 h-5 text-primary-foreground" />}
            </button>

            <button
              onClick={handleEndCall}
              aria-label={t('video.endCall')}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-destructive flex items-center justify-center hover:bg-destructive/90 transition-colors active:scale-95"
            >
              <PhoneOff className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
            </button>

            <button
              onClick={handleToggleCamera}
              aria-label={t('video.camera')}
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-colors ${
                cameraOff || cameraStatus === 'error' ? 'bg-destructive' : 'bg-muted/20 hover:bg-muted/30'
              }`}
            >
              {cameraOff || cameraStatus === 'error' ? (
                <VideoOff className="w-5 h-5 text-primary-foreground" />
              ) : (
                <Video className="w-5 h-5 text-primary-foreground" />
              )}
            </button>

            <button
              onClick={() => setShowInfo(!showInfo)}
              className="lg:hidden w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center bg-muted/20 hover:bg-muted/30 transition-colors"
            >
              <Info className="w-5 h-5 text-primary-foreground" />
            </button>
          </motion.div>
        </div>

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
                  <p className="font-medium text-foreground">{patientName}</p>
                  <p className="text-xs text-muted-foreground">32 {t('common.yearsOld')}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-urgency-medium" />
              <span className="text-sm font-medium text-urgency-medium">{t('triage.medium')}</span>
            </div>

            <div>
              <h3 className="text-sm font-medium text-foreground flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4" />
                {t('triage.summary')}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t('triage.summaryText')}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default VideoConsultation;
