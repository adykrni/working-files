type CaseStudyVideoProps = {
  src: string;
  ariaLabel: string;
  className?: string;
  /** CSS aspect-ratio value, e.g. "3112/2004". Keeps the full frame visible at any width. */
  aspectRatio?: string;
};

export function CaseStudyVideo({
  src,
  ariaLabel,
  className = "",
  aspectRatio = "3112/2004",
}: CaseStudyVideoProps) {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-[10px] ${className}`}
      style={{ aspectRatio }}
    >
      <video
        src={src}
        autoPlay
        loop
        muted
        playsInline
        aria-label={ariaLabel}
        className="absolute inset-0 h-full w-full object-contain object-center"
      />
    </div>
  );
}
