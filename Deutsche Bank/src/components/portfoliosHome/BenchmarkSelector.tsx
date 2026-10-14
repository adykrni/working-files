"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import {
  CHART_LINKED_BENCHMARKS,
  formatBenchmarkButtonLabel,
  formatBenchmarkMenuSubtitle,
  formatChartBenchmarkTriggerLabel,
  WEALTH_BENCHMARKS,
  type WealthBenchmark,
  type WealthBenchmarkId,
} from "@/data/wealthBenchmarks";

type Props = {
  value: WealthBenchmarkId;
  onChange: (id: WealthBenchmarkId) => void;
  /** Matches hero footer compact control in Figma */
  compact?: boolean;
  /** Figma 1003:82207 — inline chart leg trigger */
  inline?: boolean;
};

const MENU_WIDTH = 229;
const MENU_GAP = 6;

type MenuPosition = {
  top: number;
  left: number;
  placement: "below" | "above";
};

function ChevronIcon({ open, size = 12 }: { open: boolean; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
      className={`shrink-0 text-[#3c4556] transition-transform duration-150 ${open ? "rotate-180" : ""}`}
    >
      <path
        d="M3 4.5L6 7.5L9 4.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SelectionMark({ selected }: { selected: boolean }) {
  return (
    <span className="flex size-4 shrink-0 items-center justify-center" aria-hidden>
      {selected ? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M3.5 8.5L6.5 11.5L12.5 4.5"
            stroke="#07132a"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : null}
    </span>
  );
}

export function BenchmarkSelector({ value, onChange, compact = false, inline = false }: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const selected = WEALTH_BENCHMARKS.find((b) => b.id === value) ?? WEALTH_BENCHMARKS[0]!;

  useEffect(() => {
    setMounted(true);
  }, []);

  const updateMenuPosition = useCallback(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;

    const rect = anchor.getBoundingClientRect();
    const viewportPad = 16;
    const estimatedMenuHeight = Math.min(window.innerHeight * 0.5, 280);

    let left = rect.left;
    if (left + MENU_WIDTH > window.innerWidth - viewportPad) {
      left = Math.max(viewportPad, window.innerWidth - MENU_WIDTH - viewportPad);
    }

    const spaceBelow = window.innerHeight - rect.bottom - viewportPad;
    const spaceAbove = rect.top - viewportPad;
    const placement: MenuPosition["placement"] =
      spaceBelow < estimatedMenuHeight && spaceAbove > spaceBelow ? "above" : "below";

    const top =
      placement === "below" ? rect.bottom + MENU_GAP : rect.top - MENU_GAP;

    setMenuPosition({ top, left, placement });
  }, []);

  useLayoutEffect(() => {
    if (!open) {
      setMenuPosition(null);
      return;
    }
    updateMenuPosition();
    window.addEventListener("resize", updateMenuPosition);
    window.addEventListener("scroll", updateMenuPosition, true);
    return () => {
      window.removeEventListener("resize", updateMenuPosition);
      window.removeEventListener("scroll", updateMenuPosition, true);
    };
  }, [open, updateMenuPosition]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onPointer = (e: MouseEvent) => {
      const target = e.target as Node;
      if (panelRef.current?.contains(target)) return;
      if (anchorRef.current?.contains(target)) return;
      setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onPointer);
    };
  }, [open]);

  const pick = (benchmark: WealthBenchmark) => {
    if (!benchmark.chartLinked) return;
    onChange(benchmark.id);
    setOpen(false);
  };

  const triggerLayout = inline
    ? "gap-[6px] px-[6px] py-[3px]"
    : compact
      ? "gap-0.5 px-1.5 py-1"
      : "gap-[6px] px-[10px] py-[6px]";
  const labelSize = inline ? "text-[12px]" : compact ? "text-[10px]" : "text-[12px]";
  const chevronSize = inline ? 16 : compact ? 14 : 12;

  return (
    <div className={`relative min-w-0 ${inline ? "max-w-[11rem]" : ""}`}>
      <button
        ref={anchorRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${selected.name}. Change benchmark`}
        onClick={() => setOpen((v) => !v)}
        className={`flex max-w-full items-center rounded-[6px] border border-[#c6ccda] bg-white transition-colors hover:border-[#aeb6c8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00205b]/35 ${triggerLayout}`}
      >
        <span
          className={`min-w-0 truncate text-center leading-[1.4] text-[#07132a] ${labelSize}`}
        >
          {inline || compact
            ? formatChartBenchmarkTriggerLabel(selected)
            : formatBenchmarkButtonLabel(selected)}
        </span>
        <ChevronIcon open={open} size={chevronSize} />
      </button>

      {mounted && open && menuPosition
        ? createPortal(
            <motion.div
              ref={panelRef}
              role="listbox"
              aria-label="Select benchmark"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.16, ease: [0.25, 0.1, 0.25, 1] }}
              className="fixed z-[200] w-[229px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[10px] border border-[#e7e7e7] bg-white shadow-[0px_2px_5px_rgba(0,0,0,0.1)]"
              style={{
                top: menuPosition.top,
                left: menuPosition.left,
                transform:
                  menuPosition.placement === "above" ? "translateY(-100%)" : undefined,
              }}
            >
              <div className="flex max-h-[50vh] flex-col gap-[2px] overflow-y-auto overscroll-contain p-[10px]">
                {CHART_LINKED_BENCHMARKS.map((benchmark) => {
                  const active = benchmark.id === value;
                  return (
                    <button
                      key={benchmark.id}
                      type="button"
                      role="option"
                      aria-selected={active}
                      onClick={() => pick(benchmark)}
                      className="flex w-full shrink-0 cursor-pointer items-start gap-[10px] rounded-[6px] p-[4px] text-left transition-colors hover:bg-[#eaeef6]"
                    >
                      <SelectionMark selected={active} />
                      <span className="flex min-w-0 flex-col items-start justify-center whitespace-nowrap leading-[1.4]">
                        <span className="text-[12px] text-[#07132a]">{benchmark.menuTitle}</span>
                        <span className="text-[10px] text-[#63676f]">
                          {formatBenchmarkMenuSubtitle(benchmark)}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>,
            document.body,
          )
        : null}
    </div>
  );
}
