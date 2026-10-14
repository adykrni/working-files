"use client";

import { AnimatePresence } from "framer-motion";
import { useCallback, useLayoutEffect, useRef, useState, type RefObject } from "react";

import { allBioChips, type BioChip } from "@/lib/bio-content";
import { BioAnnotation } from "./BioAnnotation";

type BioAnnotationLayerProps = {
  activeChipId: string | null;
  chipRefs: RefObject<Map<string, HTMLElement>>;
  containerRef: RefObject<HTMLElement | null>;
};

type Position = { top: number; left: number };

// Project rows (the "facts" panels) anchor at one fixed spot regardless of
// which row triggered them, so the preview never jumps around depending on
// which project the user hovers.
const factsChipIds = Object.values(allBioChips)
  .filter((chip) => chip.annotation.kind === "facts")
  .map((chip) => chip.id);

// Deliberately non-interactive: hover must stay scoped to the chip's own
// hit-box (per design), so the floating card/bubbles can never themselves
// keep a chip "active" by being hovered.
//
// Resolves the anchor element straight from chipRefs inside its own layout
// effect (rather than receiving it as a prop computed by the parent's own
// effect) so there's no extra async round-trip between "chip became active"
// and "we know where to anchor its annotation".
export function BioAnnotationLayer({ activeChipId, chipRefs, containerRef }: BioAnnotationLayerProps) {
  const [position, setPosition] = useState<Position | null>(null);
  const [displayedChip, setDisplayedChip] = useState<BioChip | null>(null);
  const wrapperNodeRef = useRef<HTMLElement | null>(null);

  const activeChip = activeChipId ? allBioChips[activeChipId] : null;

  // AnimatePresence's onExitComplete fires per *exit*, not scoped to which
  // child exited — if the pointer already moved onto a new chip while the
  // previous one was still animating out, that stale callback would otherwise
  // null out the new chip's freshly-computed position. Read the latest
  // activeChipId from a ref instead of the callback's closure so it only
  // cleans up when nothing new has taken over in the meantime.
  const activeChipIdRef = useRef(activeChipId);
  useLayoutEffect(() => {
    activeChipIdRef.current = activeChipId;
  }, [activeChipId]);

  // Freeze "what to render" the instant a chip goes active — this is the
  // snapshot AnimatePresence shows while exiting, once `activeChipId` has
  // already gone back to null.
  useLayoutEffect(() => {
    if (!activeChip) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing the frozen "what to render during exit" snapshot to the new anchor, not a derived-state loop
    setDisplayedChip(activeChip);
  }, [activeChip]);

  // Measured via a ref callback (not a shared ref read in an effect) because
  // AnimatePresence can keep an exiting node mounted while a new keyed node
  // mounts alongside it — a single ref read after the fact could easily end
  // up pointing at the wrong one, or at nothing yet.
  const recalc = useCallback(
    (wrapper: HTMLElement | null) => {
      const container = containerRef.current;
      const chipEl = activeChipId ? chipRefs.current.get(activeChipId) : null;
      if (!container || !wrapper || !chipEl) return;

      const containerRect = container.getBoundingClientRect();
      const chipRect = chipEl.getBoundingClientRect();
      const wrapperRect = wrapper.getBoundingClientRect();
      const gap = 24;
      const viewportMargin = 8;
      const isFactsPanel = activeChipId ? allBioChips[activeChipId]?.annotation.kind === "facts" : false;

      let top: number;
      let left: number;

      if (isFactsPanel) {
        // Fixed placement: anchored just past the widest project row's own
        // right edge (not the specific hovered row's), so every row opens
        // the panel in exactly the same spot instead of it shifting
        // left/right or up/down depending on which one triggered it.
        let maxChipRight = chipRect.right;
        for (const id of factsChipIds) {
          const el = chipRefs.current.get(id);
          if (el) maxChipRight = Math.max(maxChipRight, el.getBoundingClientRect().right);
        }
        const fixedLeftAbsolute = maxChipRight + gap;
        const fitsRight = window.innerWidth - fixedLeftAbsolute >= wrapperRect.width + viewportMargin;

        if (fitsRight) {
          left = fixedLeftAbsolute - containerRect.left;
          top = 0;
        } else {
          // Not enough room beside the rows (narrow viewport) — fall back to
          // anchoring above whichever row is actually active.
          top = Math.max(
            viewportMargin - containerRect.top,
            chipRect.top - containerRect.top - wrapperRect.height - gap,
          );
          left = Math.max(
            4,
            Math.min(
              chipRect.left - containerRect.left,
              containerRect.width - wrapperRect.width - 4,
            ),
          );
        }
      } else {
        // Bubbles (e.g. the employer chip) keep the original beside-the-chip
        // anchor — small enough that it doesn't need a fixed spot.
        const spaceRight = window.innerWidth - chipRect.right;
        const fitsRight = spaceRight >= wrapperRect.width + gap;

        if (fitsRight) {
          left = chipRect.right - containerRect.left + gap;
          const idealTop = chipRect.top + chipRect.height / 2 - wrapperRect.height / 2;
          const clampedTop = Math.max(
            viewportMargin,
            Math.min(idealTop, window.innerHeight - wrapperRect.height - viewportMargin),
          );
          top = clampedTop - containerRect.top;
        } else {
          top = Math.max(
            viewportMargin - containerRect.top,
            chipRect.top - containerRect.top - wrapperRect.height - gap,
          );
          left = Math.max(
            4,
            Math.min(
              chipRect.left - containerRect.left,
              containerRect.width - wrapperRect.width - 4,
            ),
          );
        }
      }

      // Bail out on an unchanged result — this is called from a ref callback
      // (every commit where the node is attached) as well as from resize/scroll,
      // so skipping a no-op update is what keeps it from looping.
      setPosition((current) =>
        current && current.top === top && current.left === left ? current : { top, left },
      );
    },
    [activeChipId, chipRefs, containerRef],
  );

  // Stable identity so React doesn't detach/reattach (and thus re-measure)
  // this ref on every render — only when `recalc` itself changes (i.e. the
  // anchor chip changed) should a new node actually get measured.
  const setWrapperRef = useCallback(
    (node: HTMLElement | null) => {
      wrapperNodeRef.current = node;
      if (node) recalc(node);
    },
    [recalc],
  );

  useLayoutEffect(() => {
    if (!activeChipId || !displayedChip) return;

    function handleReflow() {
      recalc(wrapperNodeRef.current);
    }

    handleReflow();
    window.addEventListener("resize", handleReflow);
    window.addEventListener("scroll", handleReflow, true);
    return () => {
      window.removeEventListener("resize", handleReflow);
      window.removeEventListener("scroll", handleReflow, true);
    };
  }, [activeChipId, displayedChip, recalc]);

  return (
    <div
      className="pointer-events-none absolute inset-0 z-20 hidden md:block"
      style={{ visibility: position ? "visible" : "hidden" }}
    >
      <AnimatePresence
        onExitComplete={() => {
          if (activeChipIdRef.current) return;
          setPosition(null);
          setDisplayedChip(null);
        }}
      >
        {activeChip && displayedChip ? (
          <div
            key={displayedChip.id}
            ref={setWrapperRef}
            className="absolute"
            style={{ top: position?.top ?? 0, left: position?.left ?? 0 }}
          >
            <BioAnnotation chip={displayedChip} />
          </div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
