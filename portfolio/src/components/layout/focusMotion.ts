import {
  focusDetailEnter,
  focusDetailExit,
  iconEnterTransition,
  iconExitTransition,
} from "@/components/WealthOverview/motion";

/** Sibling blur + opacity — spring, interruptible. */
export const focusBlurTransition = {
  type: "spring" as const,
  duration: 0.3,
  bounce: 0,
};

export const focusBackdropTransition = {
  opacity: { type: "spring" as const, duration: 0.26, bounce: 0 },
};

/** Whole L2 panel dismiss — fade at centre, no layout morph back to grid. */
export const focusPortalExit = {
  opacity: 0,
  scale: 0.985,
  filter: "blur(6px)",
};

export const focusPortalExitTransition = {
  opacity: { duration: 0.18, ease: [0.4, 0, 1, 1] as const },
  scale: { duration: 0.18, ease: [0.4, 0, 1, 1] as const },
  filter: { duration: 0.14, ease: [0.4, 0, 1, 1] as const },
};

/** L1 remount after focus dismiss — quick fade in, no shared layout. */
export const focusL1EnterTransition = {
  opacity: { duration: 0.2, ease: [0.4, 0, 0.2, 1] as const },
};

export const expandIconVariants = {
  initial: { opacity: 0, rotate: -90, scale: 0.9 },
  animate: {
    opacity: 1,
    rotate: 0,
    scale: 1,
    transition: iconEnterTransition,
  },
  exit: {
    opacity: 0,
    rotate: 90,
    scale: 0.9,
    transition: iconExitTransition,
  },
};

export const closeIconVariants = {
  initial: { opacity: 0, rotate: 90, scale: 0.9 },
  animate: {
    opacity: 1,
    rotate: 0,
    scale: 1,
    transition: iconEnterTransition,
  },
  exit: {
    opacity: 0,
    rotate: -90,
    scale: 0.9,
    transition: iconExitTransition,
  },
};

/** L2 inner sections — enter only (portal shell handles dismiss). */
export const detailPanelVariants = {
  initial: { opacity: 0, y: 8, filter: "blur(4px)" },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: focusDetailEnter,
  },
  exit: {
    opacity: 0,
    y: -10,
    filter: "blur(2px)",
    transition: focusDetailExit,
  },
};
