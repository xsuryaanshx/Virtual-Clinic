import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface Doctor {
  id: number;
  name: string;
  specialization: string;
  rating: number;
  reviewCount: number;
  city: string;
  languages: string[];
  avatar: string; // initials fallback
  avatarColor: string;
}

const DOCTORS: Doctor[] = [
  { id: 1, name: 'Dr. Luca Ferrari', specialization: 'Cardiologist', rating: 4.9, reviewCount: 312, city: 'Milano', languages: ['IT', 'EN'], avatar: 'LF', avatarColor: 'from-blue-500 to-blue-600' },
  { id: 2, name: 'Dr.ssa Sofia Martini', specialization: 'Dermatologist', rating: 4.8, reviewCount: 278, city: 'Roma', languages: ['IT', 'EN', 'FR'], avatar: 'SM', avatarColor: 'from-rose-500 to-pink-600' },
  { id: 3, name: 'Dr. Alessandro Ricci', specialization: 'General Practitioner', rating: 4.7, reviewCount: 445, city: 'Torino', languages: ['IT'], avatar: 'AR', avatarColor: 'from-emerald-500 to-green-600' },
  { id: 4, name: 'Dr.ssa Giulia Conti', specialization: 'Pediatrician', rating: 4.9, reviewCount: 390, city: 'Firenze', languages: ['IT', 'EN'], avatar: 'GC', avatarColor: 'from-violet-500 to-purple-600' },
  { id: 5, name: 'Dr. Marco Esposito', specialization: 'Orthopedist', rating: 4.6, reviewCount: 201, city: 'Napoli', languages: ['IT', 'EN'], avatar: 'ME', avatarColor: 'from-amber-500 to-orange-600' },
  { id: 6, name: 'Dr.ssa Anna Lombardi', specialization: 'Neurologist', rating: 4.8, reviewCount: 167, city: 'Bologna', languages: ['IT', 'DE'], avatar: 'AL', avatarColor: 'from-teal-500 to-cyan-600' },
  { id: 7, name: 'Dr. Paolo Moretti', specialization: 'Psychiatrist', rating: 4.7, reviewCount: 289, city: 'Venezia', languages: ['IT', 'EN', 'RU'], avatar: 'PM', avatarColor: 'from-indigo-500 to-blue-600' },
  { id: 8, name: 'Dr.ssa Chiara Romano', specialization: 'Gynecologist', rating: 4.9, reviewCount: 534, city: 'Milano', languages: ['IT', 'EN'], avatar: 'CR', avatarColor: 'from-pink-500 to-rose-600' },
];

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`w-3.5 h-3.5 ${star <= Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30'}`}
      />
    ))}
  </div>
);

const DoctorCard = ({ doctor }: { doctor: Doctor }) => (
  <motion.div
    whileHover={{ y: -4, scale: 1.02 }}
    transition={{ duration: 0.2 }}
    className="bg-card rounded-3xl shadow-card p-6 flex flex-col items-center text-center gap-4 cursor-pointer hover:shadow-elevated transition-shadow flex-shrink-0 w-56"
  >
    {/* Avatar */}
    <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${doctor.avatarColor} flex items-center justify-center text-white text-xl font-bold shadow-lg`}>
      {doctor.avatar}
    </div>

    {/* Info */}
    <div className="space-y-1">
      <h3 className="font-semibold text-foreground text-sm leading-tight">{doctor.name}</h3>
      <p className="text-xs text-primary font-medium">{doctor.specialization}</p>
      <p className="text-xs text-muted-foreground">{doctor.city}</p>
    </div>

    {/* Rating */}
    <div className="flex flex-col items-center gap-1">
      <StarRating rating={doctor.rating} />
      <p className="text-xs text-muted-foreground">
        <span className="font-semibold text-foreground">{doctor.rating}</span> ({doctor.reviewCount} reviews)
      </p>
    </div>

    {/* Languages */}
    <div className="flex gap-1 flex-wrap justify-center">
      {doctor.languages.map((lang) => (
        <span key={lang} className="px-2 py-0.5 text-xs font-medium rounded-full bg-accent text-accent-foreground">
          {lang}
        </span>
      ))}
    </div>
  </motion.div>
);

const DoctorsCarousel = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = 280;
    scrollRef.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  return (
    <section className="py-16 sm:py-24 bg-surface overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Our Doctors</h2>
            <p className="mt-2 text-muted-foreground">Trusted specialists ready to help you</p>
          </div>

          {/* Scroll controls */}
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-foreground hover:bg-accent transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-foreground hover:bg-accent transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Scrollable cards */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-5 overflow-x-auto pb-4 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {DOCTORS.map((doctor, i) => (
            <motion.div
              key={doctor.id}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
            >
              <DoctorCard doctor={doctor} />
            </motion.div>
          ))}
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: Math.ceil(DOCTORS.length / 3) }).map((_, i) => (
            <button
              key={i}
              onClick={() => scrollRef.current?.scrollTo({ left: i * 280 * 3, behavior: 'smooth' })}
              className="w-2 h-2 rounded-full bg-primary/30 hover:bg-primary transition-colors"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DoctorsCarousel;