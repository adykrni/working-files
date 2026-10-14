"use client";

import { AnimatePresence, motion } from "framer-motion";
import { type ReactNode } from "react";
import { createPortal } from "react-dom";
import {
  focusPortalExit,
  focusPortalExitTransition,
} from "./focusMotion";

interface FocusPortalProps {
  portalNode: HTMLDivElement | null;
  visible: boolean;
  onExitComplete: () => void;
  children: ReactNode;
}

/** Portals the L2 panel and handles dismiss via fade — not reverse layout morph. */
export function FocusPortal({
  portalNode,
  visible,
  onExitComplete,
  children,
}: FocusPortalProps) {
  if (!portalNode) return null;

  return createPortal(
    <AnimatePresence onExitComplete={onExitComplete}>
      {visible && (
        <motion.div
          key="focus-portal-shell"
          className="w-full"
          initial={false}
          exit={focusPortalExit}
          transition={focusPortalExitTransition}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>,
    portalNode,
  );
}
