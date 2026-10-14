"use client";

import { forwardRef } from "react";
import Image from "next/image";

import { isProjectNavigable, type BioChip } from "@/lib/bio-content";

type ProjectRowProps = {
  chip: BioChip;
  isActive: boolean;
  isDimmed: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
  onOpen: () => void;
};

// Same hover/tap contract as the employer chip: a real mouse hover reveals
// the annotation, a touch tap needs a second tap to open (via onClick below)
// — see EmployerChip.tsx for the fuller rationale on why focus is gated by
// :focus-visible rather than firing on every tap.
function handlePointerEnter(event: React.PointerEvent, onActivate: () => void) {
  if (event.pointerType === "mouse") onActivate();
}

function handlePointerLeave(event: React.PointerEvent, onDeactivate: () => void) {
  if (event.pointerType === "mouse") onDeactivate();
}

function handleFocus(event: React.FocusEvent<HTMLElement>, onActivate: () => void) {
  if (event.target.matches(":focus-visible")) onActivate();
}

export const ProjectRow = forwardRef<HTMLButtonElement, ProjectRowProps>(function ProjectRow(
  { chip, isActive, isDimmed, onActivate, onDeactivate, onOpen },
  ref,
) {
  const isNavigable = isProjectNavigable(chip);
  const dimClass = isDimmed ? "opacity-20 blur-[3px]" : "opacity-100 blur-0";

  return (
    <button
      ref={ref}
      type="button"
      data-chip-id={chip.id}
      onPointerEnter={(event) => handlePointerEnter(event, onActivate)}
      onPointerLeave={(event) => handlePointerLeave(event, onDeactivate)}
      onFocus={(event) => handleFocus(event, onActivate)}
      onBlur={onDeactivate}
      onClick={() => {
        if (isNavigable && isActive) {
          onOpen();
          return;
        }
        onActivate();
      }}
      className={`inline-flex items-center gap-[10px] text-left transition-[filter,opacity] duration-200 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${dimClass}`}
    >
      <Image src="/icons/folder.svg" alt="" width={16} height={16} className="shrink-0" aria-hidden />
      <span className="text-[16px] tracking-[0.16px] text-foreground">{chip.label}</span>
      {isNavigable ? (
        // Always mounted (rather than only while active) so the row's own
        // width never changes when it activates — otherwise the widest-row
        // measurement used to anchor the annotation panel would shift
        // depending on which row happened to be active at the time.
        <Image
          src="/icons/triangle-marker.svg"
          alt=""
          width={8}
          height={8}
          className={`shrink-0 transition-opacity duration-200 ${isActive ? "opacity-100" : "opacity-0"}`}
          aria-hidden
        />
      ) : null}
    </button>
  );
});
