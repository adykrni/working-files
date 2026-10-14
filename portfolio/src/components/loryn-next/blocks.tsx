import { MediaPlaceholder } from "@/components/MediaPlaceholder";

export function BlockHeading({ children }: { children: React.ReactNode }) {
  return <p className="text-base font-semibold leading-[1.4] text-foreground">{children}</p>;
}

export function BlockBody({ children }: { children: React.ReactNode }) {
  return <p className="text-base font-normal leading-[1.4] text-muted">{children}</p>;
}

type SubsectionProps = {
  heading: string;
  children: React.ReactNode;
};

export function Subsection({ heading, children }: SubsectionProps) {
  return (
    <div className="flex w-full flex-col gap-1.5">
      <BlockHeading>{heading}</BlockHeading>
      {children}
    </div>
  );
}

type DeepDiveSectionProps = {
  children: React.ReactNode;
  media?: React.ReactNode;
};

// A heading/paragraph column with a trailing full-width carousel — the most
// common section shape, but not the only one (some sections skip the
// carousel entirely, or interleave more than one), so this is a convenience
// wrapper rather than something every section is forced through.
export function DeepDiveSection({ children, media }: DeepDiveSectionProps) {
  return (
    <div className="flex w-full min-w-0 max-w-[900px] flex-col items-center gap-10">
      <div className="flex w-full max-w-[700px] flex-col gap-[30px]">{children}</div>
      {media ?? (
        <MediaPlaceholder label="IMAGE PLACEHOLDER CAROUSEL" className="aspect-[3112/2004] w-full" />
      )}
    </div>
  );
}

// Same text column, no carousel — for sections like "Where it started" that
// Figma renders without one.
export function TextOnlySection({ children }: DeepDiveSectionProps) {
  return (
    <div className="flex w-full max-w-[900px] flex-col items-center">
      <div className="flex w-full max-w-[700px] flex-col gap-[30px]">{children}</div>
    </div>
  );
}
