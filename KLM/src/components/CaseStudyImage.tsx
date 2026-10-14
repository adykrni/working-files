import Image from "next/image";

import { HeroBanner } from "@/components/HeroBanner";

type CaseStudyImageProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  objectFit?: "cover" | "contain";
  width?: number;
  height?: number;
  unoptimized?: boolean;
};

export function CaseStudyImage({
  src,
  alt,
  className = "",
  priority = false,
  objectFit = "cover",
  width,
  height,
  unoptimized = false,
}: CaseStudyImageProps) {
  if (width && height) {
    return (
      <div className={`overflow-hidden rounded-[10px] ${className.includes("w-full") ? "w-full" : "shrink-0"}`}>
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={`block max-w-none ${className.includes("w-full") ? "h-auto w-full" : className}`}
          priority={priority}
          unoptimized={unoptimized}
        />
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-[10px] ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className={`object-center ${objectFit === "contain" ? "object-contain" : "object-cover"}`}
        sizes="(max-width: 768px) 100vw, 1280px"
        priority={priority}
        unoptimized={unoptimized}
      />
    </div>
  );
}

const componentImages = [
  {
    src: "/images/be-inspired.png",
    alt: "Be Inspired transparent holiday package cards over a mountain landscape",
    width: 1024,
    height: 558,
  },
  {
    src: "/images/city-trips.png",
    alt: "City trips destination list with pricing and find deals buttons",
    width: 1024,
    height: 728,
  },
  {
    src: "/images/faq.png",
    alt: "KLM Holidays FAQ accordion component",
    width: 1013,
    height: 1024,
  },
] as const;

export function ComponentGallery() {
  return (
    <div className="w-full overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#cdd9e3]">
      <div className="flex w-max gap-4 sm:gap-6">
        {componentImages.map((image) => (
          <div
            key={image.src}
            className="shrink-0 overflow-hidden rounded-[10px] bg-background"
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              className="block h-[220px] w-auto max-w-none sm:h-[379px]"
              unoptimized
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function HeroImage() {
  return <HeroBanner />;
}
