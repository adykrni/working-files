"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { AppliedFilters } from "@/data/portfoliosHomeData";
import { PortfolioFilterFormulaBar } from "./PortfolioFilterFormulaBar";
import { PortfolioFilterQuickMenu } from "./PortfolioFilterQuickMenu";
import { PortfolioFilterSidePanel } from "./PortfolioFilterSidePanel";
import {
  activeFilterCount,
  removeChipFromFilters,
} from "./portfolioFilterModel";

type Props = {
  filters: AppliedFilters;
  onFiltersChange: (next: AppliedFilters) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  visibleCount: number;
  totalCount: number;
  viewMode: PortfoliosViewMode;
  onViewModeChange: (mode: PortfoliosViewMode) => void;
};

export type PortfoliosViewMode = "list" | "chart";

function FilterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden className="shrink-0 text-[#3c4556]">
      <path
        d="M2 4h12M4.5 8h7M6.5 12h3"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
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

const VIEW_SEGMENTS: { id: PortfoliosViewMode; label: string }[] = [
  { id: "list", label: "List view" },
  { id: "chart", label: "Chart view" },
];

export function PortfoliosViewSegmented({
  value,
  onChange,
}: {
  value: PortfoliosViewMode;
  onChange: (mode: PortfoliosViewMode) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Portfolio content view"
      data-node-id="1003:81882"
      className="inline-flex h-8 shrink-0 items-center gap-1"
    >
      {VIEW_SEGMENTS.map((seg) => {
        const active = value === seg.id;
        return (
          <button
            key={seg.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(seg.id)}
            className={`inline-flex h-7 items-center justify-center whitespace-nowrap rounded-[5px] px-2.5 text-[12px] leading-[1.35] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00205b]/35 ${
              active
                ? "border border-[#00205b] bg-white text-[#07132a]"
                : "border border-transparent text-[#3c4556] hover:text-[#07132a]"
            }`}
          >
            {seg.label}
          </button>
        );
      })}
    </div>
  );
}

export function CreatePortfolioDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[210] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-[#07132a]/40"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-labelledby="create-portfolio-title"
        className="relative w-full max-w-[400px] rounded-[10px] border border-[#dfe3e9] bg-white p-6 shadow-[0px_4px_24px_rgba(0,32,91,0.12)]"
      >
        <h2 id="create-portfolio-title" className="text-[16px] leading-normal text-[#00205b]">
          New portfolio
        </h2>
        <p className="mt-2 text-[14px] leading-[1.4] text-[#5d636e]">
          Portfolio onboarding will walk through type, currency, and mandate details. This step is a
          placeholder for the full journey.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-[30px] rounded-[4px] px-3 text-[12px] leading-[1.4] text-[#5d636e] hover:text-[#07132a]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex h-[30px] items-center justify-center rounded-[4px] bg-[#00205b] px-3 pb-[3px] pt-[2px] text-[12px] leading-[1.4] text-white"
          >
            Continue
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

/** View-header filter strip — Linear-inspired formula + quick menu + full drawer. */
export function PortfolioFilterToolbar({
  filters,
  onFiltersChange,
  searchQuery,
  onSearchQueryChange,
  visibleCount,
  totalCount,
  viewMode,
  onViewModeChange,
}: Props) {
  const [quickOpen, setQuickOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const filterRef = useRef<HTMLButtonElement>(null);
  const toolbarLayoutRef = useRef<HTMLDivElement>(null);

  const activeCount = activeFilterCount(filters, searchQuery);

  useEffect(() => {
    if (viewMode !== "list") return;
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
  }, [viewMode]);

  const openFullPanel = () => {
    setQuickOpen(false);
    setPanelOpen(true);
  };

  return (
    <>
      <div ref={toolbarLayoutRef} className="flex w-full flex-col gap-2">
        <div
          data-node-id="1003:81838"
          className={`flex w-full min-w-0 items-center gap-3 ${
            viewMode === "chart" ? "h-8 justify-end" : "h-8 justify-between overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          }`}
        >
          {viewMode === "list" ? (
            <div className="flex shrink-0 items-center gap-2">
              <label className="flex h-7 w-full max-w-[761px] min-w-[200px] flex-1 shrink items-center gap-2 overflow-hidden rounded-[6px] border border-[#dfe3e9] bg-[#fafafa] px-3 py-2 lg:min-w-[336px] lg:max-w-[761px]">
                <SearchIcon />
                <span className="sr-only">Search by portfolio name</span>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => onSearchQueryChange(e.target.value)}
                  placeholder="Search portfolios"
                  className="min-w-0 flex-1 truncate border-0 bg-transparent text-[14px] leading-5 text-[#07132a] placeholder:text-[#85868b] focus-visible:outline-none"
                />
              </label>

              <button
                ref={filterRef}
                type="button"
                data-node-id="1003:81875"
                aria-expanded={quickOpen || panelOpen}
                onClick={() => setQuickOpen(true)}
                className={`relative inline-flex h-8 shrink-0 items-center gap-1.5 rounded-[6px] px-2.5 py-1 text-[#07132a] transition-colors hover:bg-[#eef3fa] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00205b]/35 ${
                  quickOpen || panelOpen ? "bg-[#eef3fa]" : ""
                }`}
              >
                <FilterIcon />
                <span className="whitespace-nowrap text-[14px] leading-[1.4]">Filter by</span>
                {activeCount > 0 ? (
                  <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#00205b] px-1 text-[10px] font-medium tabular-nums leading-none text-white">
                    {activeCount}
                  </span>
                ) : null}
              </button>
            </div>
          ) : (
            <p className="sr-only">Chart view — use portfolio and benchmark controls in the chart</p>
          )}

          <div data-node-id="1012:82340" className="flex h-8 shrink-0 items-center">
            <PortfoliosViewSegmented value={viewMode} onChange={onViewModeChange} />
          </div>
        </div>

        {viewMode === "list" ? (
          <PortfolioFilterFormulaBar
            filters={filters}
            searchQuery={searchQuery}
            onRemoveToken={(chipId) => onFiltersChange(removeChipFromFilters(filters, chipId))}
            onClearSearch={() => onSearchQueryChange("")}
          />
        ) : null}
      </div>

      <PortfolioFilterQuickMenu
        open={quickOpen}
        anchorRef={filterRef}
        layoutRootRef={toolbarLayoutRef}
        onClose={() => setQuickOpen(false)}
        filters={filters}
        searchQuery={searchQuery}
        onFiltersChange={onFiltersChange}
        onOpenFullPanel={openFullPanel}
      />

      <PortfolioFilterSidePanel
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
