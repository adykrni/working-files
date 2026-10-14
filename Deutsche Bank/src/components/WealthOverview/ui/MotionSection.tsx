"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { jakubItemVariants } from "../motion/jakub";

interface MotionSectionProps {
  children: ReactNode;
  className?: string;
}

export function MotionSection({ children, className }: MotionSectionProps) {
  return (
    <motion.div variants={jakubItemVariants} className={className}>
      {children}
    </motion.div>
  );
}
