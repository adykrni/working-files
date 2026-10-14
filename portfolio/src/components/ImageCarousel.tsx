"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

export type CarouselImage = {
  src: string;
  alt: string;
};

type ImageCarouselProps = {
  images: CarouselImage[];
  /** Time each slide is fully visible, in milliseconds. Default: 4000 (4s). */
  intervalMs?: number;
  /** Crossfade duration, in milliseconds. Default: 600. */
  fadeMs?: number;
  /** CSS aspect-ratio value, e.g. "3112/2004". Keeps slides uncropped at full width. */
  aspectRatio?: string;
  className?: string;
};

export function ImageCarousel({
  images,
  intervalMs = 4000,
  fadeMs = 600,
  aspectRatio = "3112/2004",
  className = "",
}: ImageCarouselProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [images.length, intervalMs]);

  if (images.length === 0) return null;

  const slide = images[index];

  return (
    <div
      className={`relative w-full overflow-hidden rounded-[10px] ${className}`}
      style={{ aspectRatio }}
      aria-live="polite"
      aria-roledescription="carousel"
      aria-label="Image carousel"
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={slide.src}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: fadeMs / 1000, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            className="object-contain object-center"
            sizes="(max-width: 768px) 100vw, 900px"
            priority={index === 0}
            unoptimized
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
