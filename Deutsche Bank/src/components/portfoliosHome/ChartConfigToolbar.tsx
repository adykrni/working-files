"use client";

import type { ReactNode } from "react";
import type { ChartRange } from "@/data/portfoliosHomeData";
import type { WealthBenchmarkId } from "@/data/wealthBenchmarks";
import { BenchmarkSelector } from "./BenchmarkSelector";
import { PortfolioChartSelector, type ChartPortfolioId } from "./PortfolioChartSelector";
import {
  formatBenchmarkSpreadLineScrub,
  formatChartPerformanceHeaderDate,
  formatIndex,
  type IndexedChartPoint,
} from "./indexedChartUtils";

function ScrubSummaryDivider() {
  return <span className="mx-px h-[18px] w-px shrink-0 bg-[#dfe3e9]" aria-hidden />;
}

/** Figma 1003:82190 / 82202 — 6px between dot column, index value, and picker */
function ChartSeriesLeg({
  nodeId,
  valueNodeId,
  dotColor,
  indexValue,
  picker,
}: {
  nodeId: string;
  valueNodeId: string;
  dotColor: string;
  indexValue: string;
  picker: ReactNode;
}) {
  return (
    <div data-node-id={nodeId} className="flex shrink-0 items-center gap-[6px]">
      <span
        className="flex w-[8px] shrink-0 items-center justify-center pt-px"
        aria-hidden
      >
        <span className="size-[4px] rounded-full" style={{ backgroundColor: dotColor }} />
      </span>
      <span
        data-node-id={valueNodeId}
        className="shrink-0 text-[12px] leading-normal tabular-nums text-[#07132a]"
      >
        {indexValue}
      </span>
      {picker}
    </div>
  );
}

type Props = {
  point: IndexedChartPoint;
  range: ChartRange;
  pointIndex: number;
  pointCount: number;
  portfolioId: ChartPortfolioId;
  onPortfolioChange: (id: ChartPortfolioId) => void;
  benchmarkId: WealthBenchmarkId;
  onBenchmarkChange: (id: WealthBenchmarkId) => void;
  benchmarkDotColor?: string;
  /** Chart view — portfolio vs benchmark pickers only */
  minimal?: boolean;
};

/** Figma 1003:82185 — date, spread, indexed values + entity pickers */
export function ChartConfigToolbar({
  point,
  range,
  pointIndex,
  pointCount,
  portfolioId,
  onPortfolioChange,
  benchmarkId,
  onBenchmarkChange,
  benchmarkDotColor = "#9ea4b0",
  minimal = false,
}: Props) {
  if (minimal) {
    return (
      <div
        data-node-id="1003:82185"
        className="flex shrink-0 items-center gap-2"
        aria-label="Compare portfolio to benchmark"
      >
        <PortfolioChartSelector value={portfolioId} onChange={onPortfolioChange} />
        <span className="text-[12px] leading-[1.4] text-[#5a5e65]">vs</span>
        <BenchmarkSelector inline value={benchmarkId} onChange={onBenchmarkChange} />
      </div>
    );
  }

  const dateLabel = formatChartPerformanceHeaderDate(range, pointIndex, pointCount);
  const spreadLine = formatBenchmarkSpreadLineScrub(point.portfolio, point.benchmark);
  const ahead = point.portfolio >= point.benchmark;

  return (
    <div
      data-node-id="1003:82185"
      className="flex min-w-0 shrink items-center gap-[10px]"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="flex shrink-0 items-center gap-1 whitespace-nowrap text-[12px] leading-[1.4]">
        <p data-node-id="1003:82187" className="shrink-0 tabular-nums text-[#5a5e65]">
          {dateLabel}
        </p>
        <p
          data-node-id="1003:82188"
          className={`shrink-0 tabular-nums leading-normal ${
            ahead ? "text-[#0d6a1c]" : "text-[#d72735]"
          }`}
        >
          {spreadLine}
        </p>
      </div>

      <ScrubSummaryDivider />

      <ChartSeriesLeg
        nodeId="1003:82190"
        valueNodeId="1003:82194"
        dotColor="#00205b"
        indexValue={formatIndex(point.portfolio)}
        picker={
          <PortfolioChartSelector value={portfolioId} onChange={onPortfolioChange} />
        }
      />

      <ScrubSummaryDivider />

      <ChartSeriesLeg
        nodeId="1003:82202"
        valueNodeId="1003:82206"
        dotColor={benchmarkDotColor}
        indexValue={formatIndex(point.benchmark)}
        picker={
          <BenchmarkSelector inline value={benchmarkId} onChange={onBenchmarkChange} />
        }
      />
    </div>
  );
}
