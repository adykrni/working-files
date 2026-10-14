/** Header label crossfade — aligned with Jakub-style enter/exit (no bounce). */
export const v2LabelEnter = {
  opacity: { type: "spring" as const, duration: 0.3, bounce: 0 },
  y: { type: "spring" as const, duration: 0.3, bounce: 0 },
  filter: { duration: 0.22 },
};

export const v2LabelExit = {
  opacity: { duration: 0.2, ease: [0.4, 0, 1, 1] as const },
  y: { duration: 0.2, ease: [0.4, 0, 1, 1] as const },
  filter: { duration: 0.16, ease: [0.4, 0, 1, 1] as const },
};
