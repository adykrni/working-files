"use client";

import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  EMPTY_FILTERS,
  PORTFOLIO_ROWS,
  countPortfolioDataRows,
  filterPortfolioRows,
  filterPortfolioRowsBySearch,
  type AppliedFilters,
} from "@/data/portfoliosHomeData";
import {
  CreatePortfolioDialog,
  PortfolioFilterToolbar,
  type PortfoliosViewMode,
} from "./PortfolioFilterToolbar";
import { PortfoliosHomeSidebar } from "./PortfoliosHomeSidebar";
import { PortfoliosTabBar, type PortfoliosTab } from "./PortfoliosTabBar";
import {
  applyHoldingsFilters,
  countHoldingsDataRows,
  EMPTY_HOLDINGS_FILTERS,
  HOLDINGS_ROWS,
  type HoldingRow,
  type HoldingsAppliedFilters,
} from "@/data/holdingsHomeData";
import { HoldingDetailDialog } from "./HoldingDetailDialog";
import { HoldingsFilterToolbar } from "./HoldingsFilterToolbar";
import { HoldingsTable } from "./HoldingsTable";
import { PortfoliosTable } from "./PortfoliosTable";
import { PortfolioSummaryBand } from "./PortfolioSummaryBand";
import { PortfoliosChartSection } from "./PortfoliosChartSection";

function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path d="M3 5h12M3 9h12M3 13h12" stroke="#07132a" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden className="text-[#85868b]">
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.1" />
      <path d="M7 6.25V10M7 4.5v.01" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

/** Figma 1034:3029 — main panel padding */
const MAIN_CONTENT_PAD = "px-4 pb-5 pt-4 sm:px-5 lg:px-[20px] lg:pt-[17px]";

export function PortfoliosHomeShell() {
  const [activeTab, setActiveTab] = useState<PortfoliosTab>("Portfolios");
  const [filters, setFilters] = useState<AppliedFilters>(EMPTY_FILTERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [portfoliosViewMode, setPortfoliosViewMode] = useState<PortfoliosViewMode>("list");
  const [holdingsFilters, setHoldingsFilters] = useState<HoldingsAppliedFilters>(
    EMPTY_HOLDINGS_FILTERS,
  );
  const [holdingsSearch, setHoldingsSearch] = useState("");
  const [selectedHolding, setSelectedHolding] = useState<HoldingRow | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [createPortfolioOpen, setCreatePortfolioOpen] = useState(false);
  const dataScrollRef = useRef<HTMLDivElement>(null);
  const scrollTopOnTabChangeRef = useRef<number | null>(null);

  const handleTabChange = useCallback((next: PortfoliosTab) => {
    const el = dataScrollRef.current;
    if (el) scrollTopOnTabChangeRef.current = el.scrollTop;
    setActiveTab(next);
  }, []);

  useLayoutEffect(() => {
    const el = dataScrollRef.current;
    const saved = scrollTopOnTabChangeRef.current;
    if (!el || saved === null) return;

    const restore = () => {
      const max = Math.max(0, el.scrollHeight - el.clientHeight);
      el.scrollTop = Math.min(saved, max);
    };

    restore();
    requestAnimationFrame(restore);
    const t0 = window.setTimeout(restore, 0);
    const t1 = window.setTimeout(restore, 100);
    scrollTopOnTabChangeRef.current = null;
    return () => {
      window.clearTimeout(t0);
      window.clearTimeout(t1);
    };
  }, [activeTab]);

  const totalCount = useMemo(() => countPortfolioDataRows(PORTFOLIO_ROWS), []);

  const visibleRows = useMemo(() => {
    const filtered = filterPortfolioRows(PORTFOLIO_ROWS, filters);
    return filterPortfolioRowsBySearch(filtered, searchQuery);
  }, [filters, searchQuery]);

  const visibleCount = useMemo(() => countPortfolioDataRows(visibleRows), [visibleRows]);

  const holdingsTotalCount = useMemo(() => countHoldingsDataRows(HOLDINGS_ROWS), []);

  const visibleHoldings = useMemo(
    () => applyHoldingsFilters(HOLDINGS_ROWS, holdingsFilters, holdingsSearch),
    [holdingsFilters, holdingsSearch],
  );

  const holdingsVisibleCount = useMemo(
    () => countHoldingsDataRows(visibleHoldings),
    [visibleHoldings],
  );

  const portfolioCount = useMemo(
    () => PORTFOLIO_ROWS.filter((r) => !r.isTotalRow).length,
    [],
  );

  const greetingTitle = useMemo(() => {
    const hour = new Date().getHours();
    const salutation =
      hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
    return `${salutation} Nick, here's your consolidated view across ${portfolioCount} portfolios.`;
  }, [portfolioCount]);

  const handlePortfoliosViewModeChange = useCallback((mode: PortfoliosViewMode) => {
    setPortfoliosViewMode(mode);
    const el = dataScrollRef.current;
    if (el) el.scrollTop = 0;
  }, []);

  const clearAllFilters = () => {
    setFilters(EMPTY_FILTERS);
    setSearchQuery("");
  };

  const clearHoldingsFilters = () => {
    setHoldingsFilters(EMPTY_HOLDINGS_FILTERS);
    setHoldingsSearch("");
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#f9fbfd]" data-node-id="1034:2411">
      <div className="flex h-full w-full min-w-0">
        <PortfoliosHomeSidebar
          mobileOpen={mobileNavOpen}
          onMobileClose={() => setMobileNavOpen(false)}
          onNewPortfolio={() => setCreatePortfolioOpen(true)}
        />

        <main
          data-node-id="1034:3029"
          className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-white"
        >
          <header className="flex shrink-0 items-center gap-3 border-b border-[#eef1f5] px-4 py-3 lg:hidden">
            <button
              type="button"
              aria-label="Open navigation"
              className="flex size-9 items-center justify-center rounded-md hover:bg-[#f4f7fb]"
              onClick={() => setMobileNavOpen(true)}
            >
              <MenuIcon />
            </button>
            <span className="text-[14px] font-medium text-[#00205b]">Wealth Management</span>
          </header>

          <div
            className={`flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden ${MAIN_CONTENT_PAD}`}
          >
            <div className="shrink-0">
              <div data-node-id="1034:3218" className="mb-0 flex flex-col gap-2">
                <h1 className="max-w-[1016px] text-[14px] font-normal leading-[1.3] text-[#00205b]">
                  {greetingTitle}
                </h1>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <PortfoliosTabBar activeTab={activeTab} onTabChange={handleTabChange} />
                  </div>
                  <p className="inline-flex shrink-0 items-center gap-1.5 text-[10px] leading-normal text-[#71747a]">
                    <span>All values are in USD ($)</span>
                    <InfoIcon />
                  </p>
                </div>
              </div>

              <div className="my-4 h-px w-full bg-[#dfe3e9]" aria-hidden data-node-id="1034:3289" />

              <PortfolioSummaryBand />

              {activeTab === "Portfolios" ? (
                <div className="mt-4 flex flex-col gap-3 pb-1">
                  <PortfolioFilterToolbar
                    filters={filters}
                    onFiltersChange={setFilters}
                    searchQuery={searchQuery}
                    onSearchQueryChange={setSearchQuery}
                    visibleCount={visibleCount}
                    totalCount={totalCount}
                    viewMode={portfoliosViewMode}
                    onViewModeChange={handlePortfoliosViewModeChange}
                  />
                </div>
              ) : null}

              {activeTab === "Holdings" ? (
                <div className="mt-3">
                  <HoldingsFilterToolbar
                    filters={holdingsFilters}
                    onFiltersChange={setHoldingsFilters}
                    searchQuery={holdingsSearch}
                    onSearchQueryChange={setHoldingsSearch}
                    visibleCount={holdingsVisibleCount}
                    totalCount={holdingsTotalCount}
                    exportRows={visibleHoldings}
                  />
                </div>
              ) : null}
            </div>

            <div
              ref={dataScrollRef}
              className={`min-h-0 min-w-0 flex-1 ${
                  activeTab === "Portfolios" && portfoliosViewMode === "chart"
                    ? "flex flex-col overflow-hidden"
                    : "overflow-x-hidden overflow-y-auto overscroll-y-contain [overflow-anchor:none]"
                }`}
              >
              {activeTab === "Portfolios" && portfoliosViewMode === "list" ? (
                <PortfoliosTable
                  rows={visibleRows}
                  filters={filters}
                  onFiltersChange={setFilters}
                  onClearFilters={clearAllFilters}
                  columnFiltersEnabled={totalCount > 10}
                  stickyHeaderTop={0}
                />
              ) : null}

              {activeTab === "Portfolios" && portfoliosViewMode === "chart" ? (
                <PortfoliosChartSection
                  fillHeight
                  viewMode={portfoliosViewMode}
                  onViewModeChange={handlePortfoliosViewModeChange}
                />
              ) : null}

              {activeTab === "Holdings" ? (
                <>
                  <HoldingsTable
                    rows={visibleHoldings}
                    onRowSelect={setSelectedHolding}
                    onClearFilters={clearHoldingsFilters}
                    stickyHeaderTop={0}
                  />
                  <HoldingDetailDialog
                    holding={selectedHolding}
                    onClose={() => setSelectedHolding(null)}
                  />
                </>
              ) : null}

              {activeTab !== "Portfolios" && activeTab !== "Holdings" ? (
                <div className="flex min-h-[200px] items-center justify-center rounded-[8px] border border-dashed border-[#dfe3e9] bg-[#fafbfd]">
                  <p className="px-4 text-center text-[14px] text-[#5d636e]">
                    {activeTab} — tab state preview (content not in scope)
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </main>
      </div>

      <CreatePortfolioDialog
        open={createPortfolioOpen}
        onClose={() => setCreatePortfolioOpen(false)}
      />
    </div>
  );
}
