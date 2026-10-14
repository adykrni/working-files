"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";

interface HoldingsCardProps {
  children: ReactNode;
  onClose?: () => void;
}

export function HoldingsCard({ children, onClose }: HoldingsCardProps) {
  return (
    <div className="w-full max-w-[1100px] rounded-[8px] border border-[var(--db-border-secondary)] bg-[var(--db-card-bg)] p-6 shadow-[var(--shadow-card)]">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="font-display text-[16px] text-[var(--db-primary)]">Holdings</h2>
        {onClose && (
          <motion.button
            type="button"
            onClick={onClose}
            whileTap={{ scale: 0.92 }}
            transition={{ duration: 0.12 }}
            className="flex size-[18px] shrink-0 items-center justify-center text-[var(--db-primary)]"
            aria-label="Close holdings"
          >
            <X size={18} strokeWidth={1.5} />
          </motion.button>
        )}
      </div>
      {children}
    </div>
  );
}

export default HoldingsCard;
