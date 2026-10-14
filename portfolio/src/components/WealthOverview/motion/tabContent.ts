/** Tab content motion — layout morph + staggered section reveal */

export const tabEaseOut = [0.4, 0, 0.2, 1] as const;

/** Stagger overlaps layout morph (~340ms spring) instead of waiting for it to finish. */
export const jakubContainerVariants = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.045, delayChildren: 0.08 },
  },
};

/** Sections: opacity only — no y/blur during height morph */
export const jakubItemVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.22, ease: tabEaseOut },
  },
};
