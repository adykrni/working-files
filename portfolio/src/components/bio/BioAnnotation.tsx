"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import type { BioChip } from "@/lib/bio-content";
import { MediaPlaceholder } from "@/components/MediaPlaceholder";

// Springs stay interruptible when the pointer darts between chips — unlike a
// fixed-duration keyframe animation, a spring retargets smoothly mid-flight
// instead of snapping or restarting. bounce: 0 keeps it critically damped
// (no overshoot), matching a quick, confident UI motion rather than a bouncy one.
const springTransition = { type: "spring" as const, duration: 0.28, bounce: 0 };

// Enter combines opacity + blur + a small translateY — exit is deliberately
// more subtle (opacity + blur only, no movement) so dismissing a chip never
// draws as much attention as revealing one did.
const itemVariants = {
  initial: { opacity: 0, y: 6, filter: "blur(4px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, filter: "blur(4px)" },
};

// Bubbles/facts still land one after another rather than flashing in as one
// block, but enter and exit now run at nearly the same pace — with the old
// panel exiting fast while the new one built in slowly (as it did before),
// there was a stretch where neither was fully visible, which read as
// glitchy when swapping between two rows in quick succession.
const containerVariants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.08 } },
  exit: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
};

type BioAnnotationProps = {
  chip: BioChip;
};

export function BioAnnotation({ chip }: BioAnnotationProps) {
  if (chip.annotation.kind === "bubbles") {
    return (
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="flex flex-col items-start gap-[6px]"
      >
        {chip.annotation.texts.map((text) => (
          <motion.div
            key={text}
            variants={itemVariants}
            transition={springTransition}
            className="whitespace-nowrap rounded-[10px] bg-[#e7e7e7] px-3 py-2 text-[16px] lowercase tracking-[0.16px] text-foreground"
          >
            {text}
          </motion.div>
        ))}
      </motion.div>
    );
  }

  // "facts" — a dark device-style preview frame followed by a stack of
  // pill-shaped highlights, in the same enter/exit language as the bubbles.
  const { mediaLabel, imageSrc, imageAlt, imageHasOwnFrame, imageWidth, imageHeight, facts, navigable } =
    chip.annotation;
  const isMuted = navigable === false;
  const imageSizes = "(min-width: 1024px) 650px, (min-width: 640px) 420px, 280px";
  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex w-[280px] flex-col items-start gap-5 sm:w-[420px] lg:w-[650px]"
    >
      {imageSrc && imageHasOwnFrame && imageWidth && imageHeight ? (
        // This image already bakes in its own border/bezel (a device mockup
        // export) — render it at its native aspect ratio so the whole frame
        // stays visible (no cropping) instead of wrapping it in another
        // frame or force-fitting it into a mismatched box.
        <motion.div variants={itemVariants} transition={springTransition} className="w-full">
          <Image
            src={imageSrc}
            alt={imageAlt ?? mediaLabel}
            width={imageWidth}
            height={imageHeight}
            className="h-auto w-full rounded-[10px]"
            sizes={imageSizes}
            quality={95}
          />
        </motion.div>
      ) : (
        <motion.div
          variants={itemVariants}
          transition={springTransition}
          className="w-full rounded-[10px] bg-[#1d242d] p-1"
        >
          {imageSrc ? (
            <div className="relative h-[150px] w-full overflow-hidden rounded-[6px] bg-white sm:h-[224px] lg:h-[433px]">
              <Image
                src={imageSrc}
                alt={imageAlt ?? mediaLabel}
                fill
                className="object-cover"
                sizes={imageSizes}
                quality={95}
              />
            </div>
          ) : (
            <MediaPlaceholder
              label={mediaLabel}
              className="h-[150px] w-full rounded-[6px] bg-white sm:h-[224px] lg:h-[433px]"
            />
          )}
        </motion.div>
      )}
      <ul className="flex w-[80%] list-none flex-col gap-2.5 p-0">
        {facts.map((fact) => (
          <motion.li
            key={fact}
            variants={itemVariants}
            transition={springTransition}
            className={`font-radio leading-[1.4] tracking-[0.16px] ${
              isMuted ? "text-[16px] text-[#585d67]" : "text-[16px] text-[#191b1e]"
            }`}
          >
            {fact}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}
