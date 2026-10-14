"use client";

import { useMemo } from "react";
import type { ChartRange } from "@/data/portfoliosHomeData";
import type { WealthBenchmarkId } from "@/data/wealthBenchmarks";
import { getWealthBenchmark, formatChartBenchmarkTriggerLabel } from "@/data/wealthBenchmarks";
import { BenchmarkSelector } from "./BenchmarkSelector";
import { ChartConfigToolbar } from "./ChartConfigToolbar";
import type { ChartPortfolioId } from "./PortfolioChartSelector";
import { getChartPortfolioLabel } from "./PortfolioChartSelector";
import { PortfoliosIndexedAreaChart } from "./PortfoliosIndexedAreaChart";
import {
  formatBenchmarkSpreadLine,
  formatChartPerformanceHeaderDate,
  formatIndex,
  getIndexedChartSeries,
  type IndexedChartPoint,
} from "./indexedChartUtils";

const RANGES: ChartRange[] = ["1M", "3M", "6M", "YTD", "1Y", "All"];

function RangePills({
  range,
  onRangeChange,
  muted,
  outlineActive,
}: {
  range: ChartRange;
  onRangeChange: (range: ChartRange) => void;
  muted?: boolean;
  outlineActive?: boolean;
}) {
  return (
    <div
      className="grid w-[200px] shrink-0 grid-cols-6 gap-1"
      role="group"
      aria-label="Chart time range"
    >
      {RANGES.map((r) => {
        const active = r === range;
        return (
          <button
            key={r}
            type="button"
            onClick={() => onRangeChange(r)}
            className={`flex h-[22px] w-full items-center justify-center rounded-[4px] px-2 py-1 text-center text-[10px] leading-[1.4] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 ${
              outlineActive
                ? `text-[#07132a] focus-visible:outline-[#00205b]/40 ${
                    active
                      ? "border border-[#848688] bg-white font-medium"
                      : "border border-transparent hover:bg-[#f4f7fb]"
                  }`
                : muted
                  ? `text-[#383f4d] focus-visible:outline-[#5d636e]/35 ${
                      active ? "bg-[#e4e7ec] font-medium" : "text-[#5d636e] hover:bg-[#eef1f5]"
                    }`
                  : `text-[#07132a] focus-visible:outline-[#00205b]/40 ${
                      active ? "bg-[#c7d2eb]" : "hover:bg-[#eef1f5]/90"
                    }`
            }`}
          >
            {r}
          </button>
        );
      })}
    </div>
  );
}

function ChartPerformanceHeader({
  point,
  benchmarkLabel,
  range,
  pointIndex,
  pointCount,
}: {
  point: IndexedChartPoint;
  benchmarkLabel: string;
  range: ChartRange;
  pointIndex: number;
  pointCount: number;
}) {
  const ahead = point.portfolio >= point.benchmark;
  const spreadColor = ahead ? "text-[#0d6a1c]" : "text-[#d72735]";
  const headerDate = formatChartPerformanceHeaderDate(range, pointIndex, pointCount);
  const spreadLine = formatBenchmarkSpreadLine(point.portfolio, point.benchmark, range);

  return (
    <div className="relative flex w-full min-w-0 shrink-0 items-center justify-between border-b border-[#dfe3e9] pb-[10px]">
      <p className="shrink-0 text-[12px] leading-normal text-[#5a5e65]">Indexed performance</p>
      <div className="flex shrink-0 items-center gap-5">
        <p className="w-[66px] shrink-0 text-center text-[12px] text-[#5a5e65]">{headerDate}</p>
        <span className="text-[12px] tabular-nums text-[#07132a]">{formatIndex(point.portfolio)}</span>
        <span className="text-[12px] tabular-nums text-[#07132a]">{formatIndex(point.benchmark)}</span>
        <p className={`w-[140px] shrink-0 text-center text-[12px] tabular-nums ${spreadColor}`}>
          {spreadLine}
        </p>
      </div>
    </div>
  );
}

type Props = {
  range: ChartRange;
  onRangeChange: (range: ChartRange) => void;
  benchmarkId: WealthBenchmarkId;
  onBenchmarkChange: (id: WealthBenchmarkId) => void;
  benchmarkLabel: string;
  portfolioId?: ChartPortfolioId;
  onPortfolioChange?: (id: ChartPortfolioId) => void;
  compact?: boolean;
  emphasis?: boolean;
  showPlotTooltip?: boolean;
};

export function IndexedComparisonChart({
  range,
  onRangeChange,
  benchmarkId,
  onBenchmarkChange,
  benchmarkLabel,
  portfolioId = "all",
  onPortfolioChange,
  compact = false,
  emphasis = false,
  showPlotTooltip = false,
}: Props) {
  const series = useMemo(
    () => getIndexedChartSeries(range, benchmarkId, portfolioId),
    [range, benchmarkId, portfolioId],
  );

  const lastPoint = series[series.length - 1] ?? series[0]!;
  const portfolioName = getChartPortfolioLabel(portfolioId);
  const benchmarkName = formatChartBenchmarkTriggerLabel(getWealthBenchmark(benchmarkId));

  const controlsRow = (
    <div
      data-node-id={compact ? "1003:81886" : undefined}
      className={`relative z-10 flex w-full min-w-0 shrink-0 items-center ${
        compact ? "justify-between gap-3" : "gap-3"
      }`}
    >
      <RangePills
        range={range}
        onRangeChange={onRangeChange}
        muted={compact && !emphasis}
        outlineActive={emphasis}
      />
      {compact && onPortfolioChange ? (
        <div className={emphasis ? "shrink-0" : "min-w-0 shrink overflow-hidden"}>
          <ChartConfigToolbar
            point={lastPoint}
            range={range}
            pointIndex={series.length - 1}
            pointCount={series.length}
            portfolioId={portfolioId}
            onPortfolioChange={onPortfolioChange}
            benchmarkId={benchmarkId}
            onBenchmarkChange={onBenchmarkChange}
            benchmarkDotColor={emphasis ? "#0F4FAF" : undefined}
            minimal={emphasis}
          />
        </div>
      ) : !compact ? (
        <>
          <div className="min-w-0 flex-1" aria-hidden />
          <BenchmarkSelector compact value={benchmarkId} onChange={onBenchmarkChange} />
        </>
      ) : null}
    </div>
  );

  if (emphasis && showPlotTooltip) {
    return (
      <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col gap-[10px]">
        {controlsRow}
        <div className="relative min-h-[280px] min-w-0 flex-1">
          <PortfoliosIndexedAreaChart
            series={series}
            range={range}
            portfolioName={portfolioName}
            benchmarkName={benchmarkName}
            variant="full"
            showTooltip
            fillHeight
          />
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="flex flex-col gap-2">
        {controlsRow}
        <PortfoliosIndexedAreaChart
          series={series}
          range={range}
          portfolioName={portfolioName}
          benchmarkName={benchmarkName}
          variant="compact"
        />
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-2">
      <ChartPerformanceHeader
        point={lastPoint}
        benchmarkLabel={benchmarkLabel}
        range={range}
        pointIndex={series.length - 1}
        pointCount={series.length}
      />
      {controlsRow}
      <div className="min-h-[200px] flex-1">
        <PortfoliosIndexedAreaChart
          series={series}
          range={range}
          portfolioName={portfolioName}
          benchmarkName={benchmarkName}
          variant="full"
          showTooltip
          fillHeight
        />
      </div>
    </div>
  );
}
