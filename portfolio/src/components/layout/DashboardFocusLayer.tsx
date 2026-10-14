"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useDashboardFocus } from "@/context/DashboardFocusContext";
import { focusBackdropTransition } from "./focusMotion";

interface DashboardFocusLayerProps {
  /** Full viewport overlay for isolated prototype recording (no sidebar/header). */
  variant?: "dashboard" | "prototype";
}

/** Overlay slot inside main — centred L2 surfaces portal here. */
export function DashboardFocusLayer({ variant = "dashboard" }: DashboardFocusLayerProps) {
  const { focusTarget, setFocusPortalNode } = useDashboardFocus();
  const isPrototype = variant === "prototype";

  return (
    <AnimatePresence>
      {focusTarget && (
        <motion.div
          key="dashboard-focus-layer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={focusBackdropTransition}
          className={
            isPrototype
              ? "pointer-events-auto fixed inset-0 z-30 overflow-y-auto overscroll-y-contain bg-white/60 backdrop-blur-[2px]"
              : "pointer-events-auto fixed bottom-0 left-0 right-0 top-[42px] z-30 overflow-y-auto overscroll-y-contain lg:left-[200px]"
          }
          aria-hidden={false}
        >
          <div
            className={
              isPrototype
                ? "flex min-h-full items-center justify-center p-6"
                : "flex min-h-full items-start justify-center px-4 pb-12 pt-[22px] sm:px-6 lg:px-[22.5px]"
            }
          >
            <div
              ref={setFocusPortalNode}
              className="w-full max-w-[1055px] xl:max-w-[1200px] 2xl:max-w-[1280px]"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
