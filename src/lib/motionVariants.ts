import type { Transition } from "framer-motion";

export const smoothEase: Transition = {
  duration: 0.45,
  ease: [0.25, 0.46, 0.45, 0.94],
};

export const springSnappy: Transition = {
  type: "spring",
  stiffness: 380,
  damping: 28,
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.04 },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: smoothEase,
  },
};

export const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: smoothEase,
};
