import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

/** Subtle fade so it stacks lightly with layout motion on `UserLayout` main. */
const PageTransition = ({ children }: { children: ReactNode }) => {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return <>{children}</>;
  return (
    <motion.div
      initial={{ opacity: 0.94 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
