import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, Loader2, CheckCircle } from 'lucide-react';
import { saveReview } from '@/lib/supabase';
import { useAuth } from '@/hooks/user/useAuth';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctorName?: string;
  doctorId?: string;
  consultationId?: string;
}

const ReviewModal = ({ isOpen, onClose, doctorName, doctorId, consultationId }: ReviewModalProps) => {
  const { user } = useAuth();
  const [stars, setStars] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (stars === 0) return;
    if (!user) return;
    setLoading(true);
    try {
      await saveReview({
        user_id: user.id,
        stars,
        comment: comment.trim(),
        ...(doctorId ? { doctor_id: doctorId } : {}),
        ...(consultationId ? { consultation_id: consultationId } : {}),
      });
      setSubmitted(true);
      setTimeout(() => { onClose(); }, 2000);
    } finally {
      setLoading(false);
    }
  };

  const labels: Record<number, string> = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-card rounded-3xl shadow-elevated p-8 w-full max-w-md relative"
          >
            {/* Close */}
            <button onClick={onClose} className="absolute top-5 right-5 text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-5 h-5" />
            </button>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-4 py-6 text-center"
              >
                <CheckCircle className="w-16 h-16 text-green-500" />
                <h2 className="text-2xl font-bold text-foreground">Thank you!</h2>
                <p className="text-muted-foreground">Your review has been submitted.</p>
              </motion.div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-full gradient-hero flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-primary-foreground fill-primary-foreground" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Rate your consultation</h2>
                  {doctorName && (
                    <p className="mt-1 text-muted-foreground text-sm">with <strong>{doctorName}</strong></p>
                  )}
                </div>

                {/* Star selector */}
                <div className="flex justify-center gap-3 mb-3">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      onMouseEnter={() => setHovered(s)}
                      onMouseLeave={() => setHovered(0)}
                      onClick={() => setStars(s)}
                      className="transition-transform hover:scale-110 active:scale-95"
                    >
                      <Star
                        className={`w-10 h-10 transition-colors ${
                          s <= (hovered || stars)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-muted-foreground/30'
                        }`}
                      />
                    </button>
                  ))}
                </div>

                {/* Label */}
                <div className="text-center mb-6 h-5">
                  {(hovered || stars) > 0 && (
                    <motion.p
                      key={hovered || stars}
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm font-medium text-primary"
                    >
                      {labels[hovered || stars]}
                    </motion.p>
                  )}
                </div>

                {/* Comment */}
                <div className="space-y-2 mb-6">
                  <label className="text-sm font-medium text-foreground">Leave a comment (optional)</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                    placeholder="How was your experience? Any feedback for the doctor?"
                    className="w-full px-4 py-3 rounded-xl bg-secondary border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-none text-sm"
                  />
                </div>

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={stars === 0 || loading}
                  className="w-full py-3.5 rounded-xl gradient-hero text-primary-foreground font-medium hover:opacity-90 transition-opacity disabled:opacity-40 active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Submit Review
                </button>

                <button onClick={onClose} className="w-full mt-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Skip for now
                </button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReviewModal;