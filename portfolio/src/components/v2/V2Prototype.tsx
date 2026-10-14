"use client";

import { Plus } from "lucide-react";
import { useRef } from "react";

import { V2_FRAME_LABELS } from "@/lib/v2/content";

import { useV2ActiveFrame } from "./use-v2-active-frame";
import { V2FixedHeader } from "./V2FixedHeader";

export function V2Prototype() {
  const framesRootRef = useRef<HTMLDivElement>(null);
  const headerLabel = useV2ActiveFrame(framesRootRef);

  const trailingKey =
    headerLabel.kind === "default" ? "default" : `frame-${headerLabel.index}`;

  return (
    <div className="relative min-h-svh bg-white">
      <V2FixedHeader trailingLabel={headerLabel.label} trailingKey={trailingKey} />

      <div className="mx-auto w-full max-w-[1280px] pb-24 pt-[150px]">
        <div ref={framesRootRef} className="mx-auto flex w-[789px] flex-col gap-[63px]">
          {V2_FRAME_LABELS.map((label, index) => (
            <div
              key={label}
              data-v2-frame
              data-v2-frame-index={index}
              aria-label={label}
              className="h-[476px] w-full shrink-0 rounded-[20px] bg-[#f7f7f7]"
            />
          ))}
        </div>

        <div className="mx-auto mt-[63px] flex w-[789px] items-center justify-center gap-1.5 text-sm font-normal leading-none text-[#171717]">
          <span>Show more</span>
          <Plus className="size-3.5 shrink-0" strokeWidth={1.75} aria-hidden />
        </div>
      </div>
    </div>
  );
}
