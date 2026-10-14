"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import type { AppliedFilters } from "@/data/portfoliosHomeData";
import {
  buildQuickFilterOptions,
  toggleQuickFilter,
  type QuickFilterOption,
} from "./portfolioFilterModel";

const MENU_WIDTH = 320;
const MENU_GAP = 6;

type Props = {
  open: boolean;
  anchorRef: React.RefObject<HTMLButtonElement | null>;
  /** Observed for height/layout shifts (e.g. formula bar) while the menu is open. */
  layoutRootRef?: React.RefObject<HTMLElement | null>;
  onClose: () => void;
  filters: AppliedFilters;
  searchQuery: string;
  onFiltersChange: (next: AppliedFilters) => void;
  onOpenFullPanel: () => void;
};

function isOptionActive(filters: AppliedFilters, opt: QuickFilterOption): boolean {
  switch (opt.category) {
    case "type":
      return filters.type.includes(opt.valueId as AppliedFilters["type"][number]);
    case "risk":
      return filters.risk.includes(opt.valueId as AppliedFilters["risk"][number]);
    case "currency":
      return filters.currency.includes(opt.valueId as AppliedFilters["currency"][number]);
    case "amount":
      return filters.amount.includes(opt.valueId);
    case "dayMovement":
      return filters.dayMovement.includes(opt.valueId as AppliedFilters["dayMovement"][number]);
    case "totalGain":
      return filters.totalGain.includes(opt.valueId as AppliedFilters["totalGain"][number]);
    default:
      return false;
  }
}

export function PortfolioFilterQuickMenu({
  open,
  anchorRef,
  layoutRootRef,
  onClose,
  filters,
  searchQuery,
  onFiltersChange,
  onOpenFullPanel,
}: Props) {
  const [mounted, setMounted] = useState(false);
  const [showZeroMatch, setShowZeroMatch] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (open) setShowZeroMatch(false);
  }, [open]);

  const updatePosition = useCallback(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;
    const rect = anchor.getBoundingClientRect();
    const pad = 12;
    let left = rect.left;
    if (left + MENU_WIDTH > window.innerWidth - pad) {
      left = Math.max(pad, window.innerWidth - MENU_WIDTH - pad);
    }
    setPos({ top: rect.bottom + MENU_GAP, left });
  }, [anchorRef]);

  useLayoutEffect(() => {
    if (!open) return;
    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("resize", updatePosition);
    };
  }, [open, updatePosition]);

  useLayoutEffect(() => {
    if (!open) return;
    const anchor = anchorRef.current;
    const root = layoutRootRef?.current ?? anchor;
    if (!root) return;

    const ro = new ResizeObserver(() => {
      updatePosition();
    });
    ro.observe(root);
    if (anchor && anchor !== root) ro.observe(anchor);

    return () => ro.disconnect();
  }, [open, anchorRef, layoutRootRef, updatePosition]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const onPointer = (e: MouseEvent) => {
      const t = e.target as Node;
      if (panelRef.current?.contains(t)) return;
      if (anchorRef.current?.contains(t)) return;
      onClose();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onPointer);
    };
  }, [open, onClose, anchorRef]);

  const allOptions = useMemo(
    () => buildQuickFilterOptions(filters, searchQuery),
    [filters, searchQuery],
  );

  const filteredOptions = useMemo(() => {
    if (showZeroMatch) return allOptions;
    const withMatches = allOptions.filter((o) => o.count > 0);
    return withMatches.length > 0 ? withMatches : allOptions;
  }, [allOptions, showZeroMatch]);

  const grouped = useMemo(() => {
    const map = new Map<string, QuickFilterOption[]>();
    for (const opt of filteredOptions) {
      const arr = map.get(opt.categoryLabel) ?? [];
      arr.push(opt);
      map.set(opt.categoryLabel, arr);
    }
    return [...map.entries()];
  }, [filteredOptions]);

  const hiddenZeroCount = useMemo(() => {
    if (showZeroMatch) return 0;
    return allOptions.filter((o) => o.count === 0).length;
  }, [allOptions, showZeroMatch]);

  if (!mounted || !open || !pos) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-label="Add filter"
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.14 }}
        style={{
          top: pos.top,
          left: pos.left,
          width: MENU_WIDTH,
          maxWidth: `min(${MENU_WIDTH}px, calc(100vw - 24px))`,
        }}
        className="fixed z-[210] box-border overflow-hidden rounded-[8px] border border-[#dfe3e9] bg-white shadow-[0px_8px_24px_rgba(0,32,91,0.12)]"
      >
        <div className="max-h-[min(360px,50vh)] w-full min-w-0 overflow-x-hidden overflow-y-auto overscroll-y-contain py-1">
          {grouped.map(([categoryLabel, opts]) => (
              <div key={categoryLabel} className="py-1">
                <p className="px-3 py-1 text-[11px] font-medium uppercase tracking-[0.03em] text-[#85868b]">
                  {categoryLabel}
                </p>
                {opts.map((opt) => {
                  const active = isOptionActive(filters, opt);
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={opt.count === 0 && !active}
                      onClick={() => {
                        onFiltersChange(toggleQuickFilter(filters, opt.category, opt.valueId));
                      }}
                      className={`flex w-full max-w-full min-w-0 items-center justify-between gap-2 px-3 py-1.5 text-left transition-colors ${
                        opt.count === 0 && !active
                          ? "cursor-not-allowed opacity-45"
                          : "hover:bg-[#f4f7fb]"
                      } ${active ? "bg-[#eef3fa]" : ""}`}
                    >
                      <span className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
                        <span
                          className={`flex size-4 shrink-0 items-center justify-center rounded-[4px] border ${
                            active
                              ? "border-[#00205b] bg-[#00205b]"
                              : "border-[#e4e4e9] bg-[#f7f8fb]"
                          }`}
                          aria-hidden
                        >
                          {active ? (
                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                              <path
                                d="M1 4L3.5 6.5L9 1"
                                stroke="white"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                              />
                            </svg>
                          ) : null}
                        </span>
                        <span className="truncate text-[13px] leading-[1.4] text-[#07132a]">
                          {opt.label}
                        </span>
                      </span>
                      <span className="shrink-0 tabular-nums text-[12px] text-[#85868b]">
                        {opt.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            ))}
          {hiddenZeroCount > 0 ? (
            <button
              type="button"
              onClick={() => setShowZeroMatch(true)}
              className="mb-1 mt-1 w-full max-w-full px-3 py-1.5 text-left text-[12px] text-[#5d636e] hover:bg-[#f4f7fb] hover:text-[#07132a]"
            >
              Show {hiddenZeroCount} values with no matches
            </button>
          ) : null}
        </div>

        <div className="border-t border-[#eef1f5] p-2">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenFullPanel();
            }}
            className="flex h-8 w-full items-center justify-center rounded-[6px] text-[13px] text-[#0f4faf] hover:bg-[#f4f7fb]"
          >
            All filters…
          </button>
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
}
