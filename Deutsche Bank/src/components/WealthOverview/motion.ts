/** Shared layout morph — Jakub-style spring, no bounce */
export const layoutSpring = {
  type: "spring" as const,
  duration: 0.45,
  bounce: 0,
};

/** Faster morph for single-focus L1 → overlay (parallel with blur, interruptible). */
export const focusLayoutSpring = {
  type: "spring" as const,
  duration: 0.34,
  bounce: 0,
};

/** Detail panel enter — overlaps layout morph, minimal delay */
export const focusDetailEnter = {
  opacity: { type: "spring" as const, duration: 0.3, bounce: 0, delay: 0.03 },
  y: { type: "spring" as const, duration: 0.3, bounce: 0, delay: 0.03 },
  filter: { duration: 0.22, delay: 0.03 },
};

/** Subtle exit — shorter & less travel than enter */
export const focusDetailExit = {
  opacity: { duration: 0.2, ease: [0.4, 0, 1, 1] as const },
  y: { duration: 0.2, ease: [0.4, 0, 1, 1] as const },
  filter: { duration: 0.16, ease: [0.4, 0, 1, 1] as const },
};

/** Detail panel enter — staggered after portfolio cells settle */
export const detailEnter = {
  opacity: { type: "spring" as const, duration: 0.45, bounce: 0, delay: 0.1 },
  y: { type: "spring" as const, duration: 0.45, bounce: 0, delay: 0.1 },
  filter: { duration: 0.35, delay: 0.1 },
};

/** Subtle exit — shorter, less movement than enter */
export const detailExit = {
  opacity: { duration: 0.28, ease: [0.4, 0, 1, 1] as const },
  y: { duration: 0.28, ease: [0.4, 0, 1, 1] as const },
  filter: { duration: 0.22, ease: [0.4, 0, 1, 1] as const },
};

/** Icon enter — soft spring, faster than layout morph */
export const iconEnterTransition = {
  opacity: { type: "spring" as const, duration: 0.25, bounce: 0 },
  rotate: { type: "spring" as const, duration: 0.25, bounce: 0 },
  scale: { type: "spring" as const, duration: 0.25, bounce: 0 },
};

/** Icon exit — quick ease out for responsive feel */
export const iconExitTransition = {
  opacity: { duration: 0.15, ease: [0.4, 0, 1, 1] as const },
  rotate: { duration: 0.15, ease: [0.4, 0, 1, 1] as const },
  scale: { duration: 0.15, ease: [0.4, 0, 1, 1] as const },
};

export const CARD_BOX_SHADOW =
  "0px 1px 2px 0px rgba(0, 0, 0, 0.1), 0px 1px 0px -1px rgba(0, 0, 0, 0.15), 0px 0px 0px 0.5px rgba(0, 0, 0, 0.15)";

export const ACTIVE_BOX_SHADOW =
  "0px 0px 4px 0px rgba(0,32,91,0.1), 0px 1px 0px -1px rgba(0,32,91,0.8), 0px 0px 0px 0.5px rgba(0,32,91,0.8)";

export const HOVER_BOX_SHADOW =
  "0px 1px 4px 0px rgba(0,32,91,0.1), 0px 1px 0px -1px rgba(0,32,91,0.3), 0px 0px 0px 0.5px rgba(0,32,91,0.3)";

/** Soft fade + blur for active ring on collapse — separate from layout spring */
export const shadowFade = {
  opacity: { duration: 0.35, ease: [0.4, 0, 0.2, 1] as const },
  filter: { duration: 0.35, ease: [0.4, 0, 0.2, 1] as const },
};

/** Hover ring — snappy opacity ramp */
export const ringHoverTransition = {
  opacity: { duration: 0.18, ease: [0.4, 0, 0.2, 1] as const },
};

/** Tab switch / hover→active — opacity only, no blur */
export const ringTabTransition = {
  opacity: { duration: 0.2, ease: [0.4, 0, 0.2, 1] as const },
  filter: { duration: 0.2, ease: [0.4, 0, 0.2, 1] as const },
};

export const tabContentTransition = {
  opacity: { duration: 0.24, ease: [0.4, 0, 0.2, 1] as const },
  y: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const },
};
