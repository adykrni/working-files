"use client";

import { useState } from "react";
import Image from "next/image";

type StoryRevealProps = {
  children: React.ReactNode;
};

// Height is animated via the CSS grid-rows trick (0fr <-> 1fr) rather than a
// JS-measured pixel height — it handles content of unknown/changing size
// without a ResizeObserver, and the row's 0-height state clips the reveal's
// own top padding along with it. The blur+opacity fade layered on top follows
// the same "subtle, decoupled from motion" entrance/exit language used
// elsewhere on the site.
export function StoryReveal({ children }: StoryRevealProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {/* Constrained to the same 700px text column as the bullets above it
          (its direct parent is the wider 900px carousel column) — ml-3.5 +
          the button's own px-2.5 = 24px, lining the label up with the bullet
          list's text, which is offset that same 24px by its own list padding. */}
      <div className="flex w-full max-w-[700px] flex-col items-start">
        <button
          type="button"
          onClick={() => setIsExpanded((value) => !value)}
          aria-expanded={isExpanded}
          className="ml-3.5 inline-flex items-center gap-2 rounded-[6px] px-2.5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-card"
        >
          Read full story
          <Image
            src={isExpanded ? "/icons/minus.svg" : "/icons/plus.svg"}
            alt=""
            width={14}
            height={14}
            aria-hidden
          />
        </button>
      </div>

      {/* w-full here matters: without it, this flex item (under the parent's
          items-center) shrinks-to-fit its content instead of filling the
          available width, which silently caps every "w-full" carousel inside
          at whatever the narrower 700px text blocks happened to be. */}
      <div
        className="grid w-full transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
        style={{ gridTemplateRows: isExpanded ? "1fr" : "0fr" }}
      >
        <div className={isExpanded ? "min-h-0 min-w-0 overflow-visible" : "min-h-0 min-w-0 overflow-hidden"}>
          <div
            className={`flex w-full min-w-0 flex-col items-center gap-16 pt-16 transition-[filter,opacity] duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
              isExpanded ? "opacity-100 blur-0" : "opacity-0 blur-[6px]"
            }`}
          >
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
