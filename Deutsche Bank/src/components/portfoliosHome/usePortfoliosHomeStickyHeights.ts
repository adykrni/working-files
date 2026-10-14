"use client";

import { useLayoutEffect, useRef, useState } from "react";
export function usePortfoliosHomeStickyHeights(remountKey: string) {
  const tabRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [heights, setHeights] = useState({ tab: 0, toolbar: 0 });

  useLayoutEffect(() => {
    const measure = () => {
      setHeights({
        tab: tabRef.current?.offsetHeight ?? 0,
        toolbar: toolbarRef.current?.offsetHeight ?? 0,
      });
    };

    measure();
    requestAnimationFrame(measure);

    const ro = new ResizeObserver(measure);
    if (tabRef.current) ro.observe(tabRef.current);
    if (toolbarRef.current) ro.observe(toolbarRef.current);

    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [remountKey]);

  /** Tab block includes top padding (pt) — stack tops are cumulative heights only. */
  const tabH = Math.max(heights.tab, 64);
  const toolH = Math.max(heights.toolbar, 40);
  const toolbarStickyTop = heights.tab > 0 ? heights.tab : tabH;
  const tableHeaderTop =
    heights.tab > 0 && heights.toolbar > 0
      ? heights.tab + heights.toolbar
      : tabH + toolH;

  return { tabRef, toolbarRef, toolbarStickyTop, tableHeaderTop };
}
