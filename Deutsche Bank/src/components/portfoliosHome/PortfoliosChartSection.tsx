"use client";

import { useState } from "react";
import type { ChartRange } from "@/data/portfoliosHomeData";
import {
  DEFAULT_BENCHMARK_ID,
  getWealthBenchmark,
  type WealthBenchmarkId,
} from "@/data/wealthBenchmarks";
import { IndexedComparisonChart } from "./IndexedComparisonChart";
import { HERO_MODULE_SHADOW } from "./heroModuleStyles";
import {
  PortfoliosViewSegmented,
  type PortfoliosViewMode,
} from "./PortfolioFilterToolbar";

type Props = {
  /** Chart view — fills the content pane (plain white, Figma 1023:2645) */
  fillHeight?: boolean;
  viewMode?: PortfoliosViewMode;
  onViewModeChange?: (mode: PortfoliosViewMode) => void;
};

/** Figma 966:2784 / 1023:2645 — indexed chart module */
export function PortfoliosChartSection({
  fillHeight = false,
  viewMode = "chart",
  onViewModeChange,
}: Props) {
  const [range, setRange] = useState<ChartRange>("YTD");
  const [benchmarkId, setBenchmarkId] = useState<WealthBenchmarkId>(DEFAULT_BENCHMARK_ID);
  const [portfolioId, setPortfolioId] = useState("all");
  const benchmark = getWealthBenchmark(benchmarkId);

  if (fillHeight) {
    return (
      <div
        data-node-id="1023:2645"
        className="mt-3 flex min-h-0 w-full min-w-0 flex-1 flex-col gap-[14px] bg-white"
      >
        <div className="flex shrink-0 flex-col gap-[10px]" data-node-id="1023:3075">
          <div
            className="flex w-full items-center justify-between gap-4"
            data-node-id="1023:2646"
          >
            <h2 className="font-display text-[14px] leading-[1.4] text-[#07132a]">
              Indexed performance chart
            </h2>
            {onViewModeChange ? (
              <PortfoliosViewSegmented value={viewMode} onChange={onViewModeChange} />
            ) : null}
          </div>

          <div className="flex flex-col gap-[10px]" data-node-id="1023:3029">
            <p className="text-[14px] leading-[1.4] text-[#07132a]" data-node-id="1023:3030">
              Compare your portfolio to a benchmark — rebased to 100 at the start of the range.
            </p>
            <div className="h-px w-full shrink-0 bg-[#dfe3e9]" data-node-id="1023:3031" />
          </div>
        </div>

        <div className="relative flex min-h-[360px] min-w-0 flex-1 flex-col">
          <IndexedComparisonChart
            compact
            emphasis
            showPlotTooltip
            range={range}
            onRangeChange={setRange}
            benchmarkId={benchmarkId}
            onBenchmarkChange={setBenchmarkId}
            benchmarkLabel={benchmark.shortName}
            portfolioId={portfolioId}
            onPortfolioChange={setPortfolioId}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 shrink-0 pb-1">
      <div
        className={`flex h-[196px] min-h-[196px] w-full flex-col overflow-visible rounded-[10px] border border-[#dfe3e9] bg-[#fbfbfb] p-4 ${HERO_MODULE_SHADOW}`}
      >
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <IndexedComparisonChart
            compact
            range={range}
            onRangeChange={setRange}
            benchmarkId={benchmarkId}
            onBenchmarkChange={setBenchmarkId}
            benchmarkLabel={benchmark.shortName}
            portfolioId={portfolioId}
            onPortfolioChange={setPortfolioId}
          />
        </div>
      </div>
    </div>
  );
}
