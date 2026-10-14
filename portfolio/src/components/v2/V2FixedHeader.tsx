"use client";

import { AnimatePresence, motion } from "framer-motion";

import { V2_SITE_NAME } from "@/lib/v2/content";

import { v2LabelEnter, v2LabelExit } from "./v2-header-motion";

const trailingVariants = {
  initial: { opacity: 0, y: 6, filter: "blur(4px)" },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: v2LabelEnter,
  },
  exit: {
    opacity: 0,
    y: -6,
    filter: "blur(4px)",
    transition: v2LabelExit,
  },
};

type V2FixedHeaderProps = {
  trailingLabel: string;
  trailingKey: string;
};

export function V2FixedHeader({ trailingLabel, trailingKey }: V2FixedHeaderProps) {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center">
      <div
        className="absolute inset-x-0 top-0 h-[140px] bg-gradient-to-b from-white from-45% via-white/85 via-70% to-transparent"
        aria-hidden
      />
      <div className="relative flex items-center gap-[6px] pt-[83px] text-base font-medium tracking-[0.01em] text-black">
        <span className="shrink-0">{V2_SITE_NAME}</span>
        <span className="shrink-0" aria-hidden>
          /
        </span>
        <span className="relative inline-flex overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={trailingKey}
              variants={trailingVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="whitespace-nowrap"
            >
              {trailingLabel}
            </motion.span>
          </AnimatePresence>
        </span>
      </div>
    </header>
  );
}
