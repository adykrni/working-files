"use client";

import { useEffect, useRef, useState } from "react";
import type { HoldingRow, HoldingsAppliedFilters } from "@/data/holdingsHomeData";
import { HoldingsFilterFormulaBar } from "./HoldingsFilterFormulaBar";
import { HoldingsFilterQuickMenu } from "./HoldingsFilterQuickMenu";
import { HoldingsFilterSidePanel } from "./HoldingsFilterSidePanel";
import {
  activeHoldingsFilterCount,
  removeChipFromHoldingsFilters,
} from "./holdingsFilterModel";

type Props = {
  filters: HoldingsAppliedFilters;
  onFiltersChange: (next: HoldingsAppliedFilters) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  visibleCount: number;
  totalCount: number;
  exportRows: HoldingRow[];
};

function FilterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden className="text-[#3c4556]">
      <path d="M2 4h12M4.5 8h7M6.5 12h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden className="shrink-0 text-[#85868b]">
      <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M10 10L13.5 13.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function ExportIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden className="shrink-0 text-[#3c4556]">
      <path
        d="M7 2.5V9M7 9L4.75 6.75M7 9L9.25 6.75"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M3 11.5H11" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

function downloadHoldingsCsv(rows: HoldingRow[]) {
  const data = rows.filter((r) => !r.isTotalRow);
  const header = ["Security", "Held in", "Value (USD)", "% of wealth", "YTD %"];
  const lines = data.map((r) =>
    [
      `"${r.security.replace(/"/g, '""')}"`,
      `"${r.heldIn.replace(/"/g, '""')}"`,
      r.valueUsd.toFixed(2),
      r.wealthPct.toFixed(1),
      r.ytdPct.toFixed(2),
    ].join(","),
  );
  const csv = [header.join(","), ...lines].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "holdings-export.csv";
  a.click();
  URL.revokeObjectURL(url);
}

/** View-header filter strip — formula bar + quick menu + full drawer (Portfolios parity). */
export function HoldingsFilterToolbar({
  filters,
  onFiltersChange,
  searchQuery,
  onSearchQueryChange,
  visibleCount,
  totalCount,
  exportRows,
}: Props) {
  const [quickOpen, setQuickOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const filterRef = useRef<HTMLButtonElement>(null);
  const toolbarLayoutRef = useRef<HTMLDivElement>(null);

  const activeCount = activeHoldingsFilterCount(filters, searchQuery);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)
        return;
      if (e.key === "f" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        setQuickOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const openFullPanel = () => {
    setQuickOpen(false);
    setPanelOpen(true);
  };

  return (
    <>
      <div ref={toolbarLayoutRef} className="flex w-full flex-col gap-2 pb-1">
        <div className="flex h-8 w-full min-w-0 items-center justify-between gap-3 overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex shrink-0 items-center gap-2">
            <label className="flex h-8 w-[336px] min-w-[336px] shrink-0 items-center gap-2 overflow-hidden rounded-[6px] border border-[#dfe3e9] bg-[#fbfbfb] px-3 py-2">
              <SearchIcon />
              <span className="sr-only">Search holdings</span>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => onSearchQueryChange(e.target.value)}
                placeholder="Search holdings"
                className="min-w-0 flex-1 truncate border-0 bg-transparent text-[14px] leading-5 text-[#07132a] placeholder:text-[#85868b] focus-visible:outline-none"
              />
            </label>

            <button
              ref={filterRef}
              type="button"
              aria-expanded={quickOpen || panelOpen}
              onClick={() => setQuickOpen(true)}
              className={`relative inline-flex h-8 shrink-0 items-center gap-1.5 rounded-[6px] px-2.5 py-1 text-[#07132a] transition-colors hover:bg-[#eef3fa] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00205b]/35 ${
                quickOpen || panelOpen ? "bg-[#eef3fa]" : ""
              }`}
            >
              <FilterIcon />
              <span className="whitespace-nowrap text-[14px] leading-[1.4]">Filter</span>
              {activeCount > 0 ? (
                <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#00205b] px-1 text-[10px] font-medium tabular-nums leading-none text-white">
                  {activeCount}
                </span>
              ) : null}
            </button>
          </div>

          <button
            type="button"
            onClick={() => downloadHoldingsCsv(exportRows)}
            className="inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-[6px] border border-[#c6d4e8] bg-[#eef3fa] px-3 text-[14px] leading-[1.4] text-[#00205b] transition-colors hover:border-[#aeb6c8] hover:bg-[#e4ecf7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00205b]/35"
          >
            <ExportIcon />
            Export list
          </button>
        </div>

        <HoldingsFilterFormulaBar
          filters={filters}
          searchQuery={searchQuery}
          onRemoveToken={(chipId) => onFiltersChange(removeChipFromHoldingsFilters(filters, chipId))}
          onClearSearch={() => onSearchQueryChange("")}
        />
      </div>

      <HoldingsFilterQuickMenu
        open={quickOpen}
        anchorRef={filterRef}
        layoutRootRef={toolbarLayoutRef}
        onClose={() => setQuickOpen(false)}
        filters={filters}
        searchQuery={searchQuery}
        onFiltersChange={onFiltersChange}
        onOpenFullPanel={openFullPanel}
      />

      <HoldingsFilterSidePanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        filters={filters}
        onApply={onFiltersChange}
        searchQuery={searchQuery}
        totalCount={totalCount}
      />
    </>
  );
}
