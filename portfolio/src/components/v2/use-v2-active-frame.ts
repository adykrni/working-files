"use client";

import { useCallback, useEffect, useState } from "react";

import { V2_DEFAULT_HEADER_LABEL, V2_FRAME_LABELS } from "@/lib/v2/content";

export type V2HeaderLabelState =
  | { kind: "default"; label: typeof V2_DEFAULT_HEADER_LABEL }
  | { kind: "frame"; index: number; label: (typeof V2_FRAME_LABELS)[number] };

function resolveActiveLabel(frameElements: HTMLElement[]): V2HeaderLabelState {
  if (frameElements.length === 0) {
    return { kind: "default", label: V2_DEFAULT_HEADER_LABEL };
  }

  const viewportCenter = window.innerHeight / 2;
  const rects = frameElements.map((el) => el.getBoundingClientRect());
  const lastRect = rects[rects.length - 1]!;

  if (lastRect.bottom <= viewportCenter) {
    const index = frameElements.length - 1;
    return { kind: "frame", index, label: V2_FRAME_LABELS[index]! };
  }

  const firstRect = rects[0]!;
  if (viewportCenter < firstRect.top + firstRect.height * 0.35) {
    return { kind: "default", label: V2_DEFAULT_HEADER_LABEL };
  }

  let bestIndex = 0;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (let i = 0; i < rects.length; i++) {
    const rect = rects[i]!;
    const frameCenter = rect.top + rect.height / 2;
    const distance = Math.abs(frameCenter - viewportCenter);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = i;
    }
  }

  return {
    kind: "frame",
    index: bestIndex,
    label: V2_FRAME_LABELS[bestIndex]!,
  };
}

export function useV2ActiveFrame(framesRootRef: React.RefObject<HTMLDivElement | null>) {
  const [headerLabel, setHeaderLabel] = useState<V2HeaderLabelState>({
    kind: "default",
    label: V2_DEFAULT_HEADER_LABEL,
  });

  const measure = useCallback(() => {
    const root = framesRootRef.current;
    if (!root) return;
    const nodes = Array.from(root.querySelectorAll<HTMLElement>("[data-v2-frame]"));
    setHeaderLabel(resolveActiveLabel(nodes));
  }, [framesRootRef]);

  useEffect(() => {
    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  return headerLabel;
}
