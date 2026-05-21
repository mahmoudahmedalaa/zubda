"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ComponentProps, ReactElement, ReactNode } from "react";

type RevealProps = ComponentProps<typeof motion.div> & {
  children: ReactNode;
  delay?: number;
};

export function Reveal({ children, delay = 0, className = "", ...props }: RevealProps): ReactElement {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
