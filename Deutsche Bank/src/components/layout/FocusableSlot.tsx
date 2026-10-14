"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useDashboardFocus } from "@/context/DashboardFocusContext";
import type { DashboardFocusTarget } from "@/types/dashboardFocus";
import { focusBlurTransition } from "./focusMotion";

interface FocusableSlotProps {
  id: DashboardFocusTarget;
  children: ReactNode;
}

/** Blurs + dims sibling L1 cards when another widget is in single-focus L2. */
export function FocusableSlot({ id, children }: FocusableSlotProps) {
  const { focusTarget } = useDashboardFocus();
  const isDimmed = focusTarget !== null && focusTarget !== id;

  return (
    <motion.div
      layout
      className="flex h-full min-w-0 w-full flex-col"
      animate={{
        filter: isDimmed ? "blur(40px)" : "blur(0px)",
        opacity: isDimmed ? 0.5 : 1,
      }}
      transition={focusBlurTransition}
      style={{ pointerEvents: isDimmed ? "none" : "auto" }}
    >
      {children}
    </motion.div>
  );
}
