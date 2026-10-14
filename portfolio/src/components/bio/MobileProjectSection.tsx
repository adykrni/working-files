import Image from "next/image";
import Link from "next/link";

import { isProjectNavigable, type BioChip, type FactsAnnotation } from "@/lib/bio-content";

function ProjectTitleRow({
  chip,
  href,
  navigable,
}: {
  chip: BioChip;
  href?: string;
  navigable: boolean;
}) {
  const row = (
    <>
      <Image src="/icons/folder.svg" alt="" width={16} height={16} className="shrink-0" aria-hidden />
      <span className="font-radio text-[16px] leading-[1.4] tracking-[0.16px] text-[#3a3a3a]">
        {chip.label}
      </span>
    </>
  );

  if (navigable && href) {
    return (
      <Link href={href} className="flex items-center gap-2.5">
        {row}
      </Link>
    );
  }

  return <div className="flex items-center gap-2.5">{row}</div>;
}

function ProjectFacts({
  facts,
  muted,
}: {
  facts: string[];
  muted: boolean;
}) {
  return (
    <ul className="flex list-none flex-col gap-3 p-0">
      {facts.map((fact) => (
        <li
          key={fact}
          className={`font-radio leading-[1.4] tracking-[0.16px] ${
            muted ? "text-[16px] text-[#585d67]" : "text-[16px] text-[#191b1e]"
          }`}
        >
          {fact}
        </li>
      ))}
    </ul>
  );
}

function ProjectPreviewImage({
  imageSrc,
  imageAlt,
  imageWidth,
  imageHeight,
  href,
}: {
  imageSrc: string;
  imageAlt?: string;
  imageWidth: number;
  imageHeight: number;
  href?: string;
}) {
  const image = (
    <Image
      src={imageSrc}
      alt={imageAlt ?? ""}
      width={imageWidth}
      height={imageHeight}
      className="h-auto w-full"
      sizes="(max-width: 768px) calc(100vw - 80px), 520px"
      unoptimized
    />
  );

  if (href) {
    return (
      <Link href={href} className="block w-full" aria-label={`Open ${imageAlt ?? "case study"}`}>
        {image}
      </Link>
    );
  }

  return <div className="w-full">{image}</div>;
}

export function MobileProjectSection({ chip }: { chip: BioChip }) {
  if (chip.annotation.kind !== "facts") return null;

  const annotation: FactsAnnotation = chip.annotation;
  const navigable = isProjectNavigable(chip);
  const showPreview = navigable && Boolean(annotation.imageSrc);
  const facts = annotation.facts;

  return (
    <section className="flex flex-col">
      <ProjectTitleRow chip={chip} href={annotation.href} navigable={navigable} />

      <div className="mt-4 flex flex-col">
        {showPreview ? (
          <>
            <ProjectPreviewImage
              imageSrc={annotation.imageSrc!}
              imageAlt={annotation.imageAlt}
              imageWidth={annotation.imageWidth ?? 2600}
              imageHeight={annotation.imageHeight ?? 1704}
              href={annotation.href}
            />
            <div className="mt-5">
              <ProjectFacts facts={facts} muted={false} />
            </div>
          </>
        ) : (
          <ProjectFacts facts={facts} muted />
        )}
      </div>
    </section>
  );
}
