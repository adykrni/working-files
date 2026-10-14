"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceDot,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";
import type { ChartRange } from "@/data/portfoliosHomeData";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import {
  CHART_AXIS_COLOR,
  CHART_TICK_COLOR,
  formatAxisIndexValue,
  getNiceYScale,
} from "./chartAxis";
import {
  formatBenchmarkSpreadLineScrub,
  formatChartPerformanceHeaderDate,
  formatIndex,
  getSharedYDomain,
  type IndexedChartPoint,
} from "./indexedChartUtils";

type ChartRow = {
  i: number;
  portfolio: number;
  benchmark: number;
  dateLabel: string;
  tickLabel: string | null;
};

const PORTFOLIO_STROKE = "#07132a";
const BENCHMARK_STROKE = "#0F4FAF";
const CHART_MARGIN = { top: 12, right: 16, left: 0, bottom: 2 } as const;
/** Tick labels end at this x; Y-axis line sits on the right edge (aligned with range pills). */
const Y_AXIS_COL_WIDTH = 32;
const TOOLTIP_OFFSET_X = 12;

type ScrubState = {
  index: number;
  /** Tooltip follows cursor (container coordinates) */
  anchorX: number;
  anchorY: number;
};

function YAxisTick({
  x = 0,
  y = 0,
  payload,
}: {
  x?: number;
  y?: number;
  payload?: { value: number };
}) {
  if (!payload) return null;
  return (
    <text
      x={x - 4}
      y={y}
      dy={4}
      textAnchor="end"
      fill={CHART_TICK_COLOR}
      fontSize={11}
    >
      {formatAxisIndexValue(Number(payload.value))}
    </text>
  );
}

function createXAxisMonthTick(
  chartData: ChartRow[],
  firstTickIndex: number,
  lastTickIndex: number,
) {
  return function XAxisMonthTick(props: {
    x?: string | number;
    y?: string | number;
    payload?: { value?: string | number };
  }) {
    const x = Number(props.x ?? 0);
    const y = Number(props.y ?? 0);
    const payload = props.payload;
    if (!payload) return null;
    const idx = Number(payload.value);
    const label = chartData[idx]?.tickLabel;
    if (!label) return null;
    const textAnchor =
      idx === firstTickIndex ? "start" : idx === lastTickIndex ? "end" : "middle";
    return (
      <text
        x={x}
        y={y}
        dy={14}
        textAnchor={textAnchor}
        fill={CHART_TICK_COLOR}
        fontSize={11}
      >
        {label}
      </text>
    );
  };
}

function indexFromPlotX(plotX: number, plotWidth: number, pointCount: number): number {
  if (plotWidth <= 0 || pointCount <= 0) return 0;
  const ratio = Math.min(1, Math.max(0, plotX / plotWidth));
  return Math.round(ratio * Math.max(0, pointCount - 1));
}

function lineXForIndex(
  index: number,
  pointCount: number,
  plotWidth: number,
): number {
  const xRatio = pointCount <= 1 ? 1 : index / (pointCount - 1);
  return Y_AXIS_COL_WIDTH + xRatio * plotWidth;
}

type Props = {
  series: IndexedChartPoint[];
  range: ChartRange;
  portfolioName: string;
  benchmarkName: string;
  variant?: "full" | "compact";
  showTooltip?: boolean;
  fillHeight?: boolean;
};

function usePlotHeight(fillHeight: boolean, compact: boolean) {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(compact ? 112 : 320);

  useEffect(() => {
    if (!fillHeight) {
      setHeight(compact ? 112 : 320);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const next = el.clientHeight;
      if (next > 0) setHeight(next);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [fillHeight, compact]);

  return { ref, height };
}

function IndexedPerformanceTooltip({
  row,
  range,
  pointCount,
  portfolioName,
  benchmarkName,
}: {
  row: ChartRow;
  range: ChartRange;
  pointCount: number;
  portfolioName: string;
  benchmarkName: string;
}) {

  const spread = formatBenchmarkSpreadLineScrub(row.portfolio, row.benchmark);
  const spreadUp = row.portfolio >= row.benchmark;
  const headerDate = formatChartPerformanceHeaderDate(range, row.i, pointCount);

  return (
    <div className="pointer-events-none min-w-[200px] rounded-[8px] border border-[#dfe3e9] bg-white px-3 py-2.5 shadow-[0_4px_16px_rgba(7,19,42,0.08)]">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <p className="text-[12px] text-[#5a5e65]">{headerDate}</p>
        <p
          className={`text-[14px] font-medium tabular-nums ${spreadUp ? "text-[#0d6a1c]" : "text-[#d72735]"}`}
        >
          {spread}
        </p>
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-3 text-[12px]">
          <span className="flex min-w-0 items-center gap-2 text-[#383f4d]">
            <span className="size-2 shrink-0 rounded-full bg-[#07132a]" aria-hidden />
            <span className="truncate">{portfolioName}</span>
          </span>
          <span className="shrink-0 tabular-nums font-medium text-[#07132a]">
            {formatIndex(row.portfolio)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3 text-[12px]">
          <span className="flex min-w-0 items-center gap-2 text-[#383f4d]">
            <span className="size-2 shrink-0 rounded-full bg-[#0F4FAF]" aria-hidden />
            <span className="truncate">{benchmarkName}</span>
          </span>
          <span className="shrink-0 tabular-nums font-medium text-[#07132a]">
            {formatIndex(row.benchmark)}
          </span>
        </div>
      </div>
    </div>
  );
}

/** Indexed portfolio vs benchmark — shadcn ChartContainer + Recharts area (Figma 1023:2645 plot) */
export function PortfoliosIndexedAreaChart({
  series,
  range,
  portfolioName,
  benchmarkName,
  variant = "full",
  showTooltip = false,
  fillHeight = false,
}: Props) {
  const portfolioGradId = useId().replace(/:/g, "");
  const benchmarkGradId = useId().replace(/:/g, "");
  const compact = variant === "compact";
  const { ref, height } = usePlotHeight(fillHeight, compact);
  const plotSurfaceRef = useRef<HTMLDivElement>(null);
  const [plotSize, setPlotSize] = useState({ w: 0, h: 0 });
  const [scrub, setScrub] = useState<ScrubState | null>(null);

  const chartData = useMemo<ChartRow[]>(
    () =>
      series.map((p, i) => ({
        i,
        portfolio: p.portfolio,
        benchmark: p.benchmark,
        dateLabel: p.dateLabel,
        tickLabel: p.tickLabel ?? null,
      })),
    [series],
  );

  const xTickIndices = useMemo(
    () => chartData.filter((d) => d.tickLabel).map((d) => d.i),
    [chartData],
  );

  const firstXTickIndex = xTickIndices[0] ?? 0;
  const lastXTickIndex = xTickIndices[xTickIndices.length - 1] ?? 0;
  const xAxisMonthTick = useMemo(
    () => createXAxisMonthTick(chartData, firstXTickIndex, lastXTickIndex),
    [chartData, firstXTickIndex, lastXTickIndex],
  );

  const yScale = useMemo(() => {
    const [dataMin, dataMax] = getSharedYDomain(series);
    return getNiceYScale(dataMin, dataMax, 5);
  }, [series]);

  const chartConfig = useMemo(
    () =>
      ({
        portfolio: { label: portfolioName, color: PORTFOLIO_STROKE },
        benchmark: { label: benchmarkName, color: BENCHMARK_STROKE },
      }) satisfies ChartConfig,
    [portfolioName, benchmarkName],
  );

  const defaultTooltipIndex = Math.max(0, chartData.length - 1);
  const margin = compact ? { top: 8, right: 8, left: 0, bottom: 0 } : CHART_MARGIN;

  const plotWidth = Math.max(0, plotSize.w - Y_AXIS_COL_WIDTH - margin.right);
  const plotHeight = Math.max(0, plotSize.h - margin.top - margin.bottom - 24);

  useEffect(() => {
    setScrub(null);
  }, [series, range]);

  useEffect(() => {
    const el = plotSurfaceRef.current ?? ref.current;
    if (!el || compact) return;
    const update = () => setPlotSize({ w: el.clientWidth, h: el.clientHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref, compact, fillHeight, height]);

  const handlePlotPointerMove = useCallback(
    (clientX: number, clientY: number) => {
      const surface = plotSurfaceRef.current;
      if (!surface || plotWidth <= 0) return;
      const rect = surface.getBoundingClientRect();
      const localX = clientX - rect.left;
      const localY = clientY - rect.top;
      const plotX = localX - Y_AXIS_COL_WIDTH;
      if (plotX < 0 || plotX > plotWidth) return;
      const index = indexFromPlotX(plotX, plotWidth, chartData.length);
      setScrub({ index, anchorX: localX, anchorY: localY });
    },
    [chartData.length, plotWidth],
  );

  const activeIndex = scrub?.index ?? defaultTooltipIndex;
  const activeRow = chartData[activeIndex] ?? chartData[defaultTooltipIndex]!;

  const defaultAnchor = useMemo(() => {
    const lineX = lineXForIndex(defaultTooltipIndex, chartData.length, plotWidth);
    return {
      anchorX: lineX,
      anchorY: Math.max(CHART_MARGIN.top + 24, plotHeight * 0.35),
    };
  }, [chartData.length, defaultTooltipIndex, plotHeight, plotWidth]);

  const tooltipAnchorX = scrub?.anchorX ?? defaultAnchor.anchorX;
  const tooltipAnchorY = scrub?.anchorY ?? defaultAnchor.anchorY;

  const chart = (
    <ChartContainer
      config={chartConfig}
      className="h-full w-full min-h-0 [&_.recharts-responsive-container]:!h-full"
    >
      <ComposedChart data={chartData} margin={margin}>
        <defs>
          <linearGradient id={portfolioGradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5a8fd4" stopOpacity={0.28} />
            <stop offset="100%" stopColor="#5a8fd4" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id={benchmarkGradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0F4FAF" stopOpacity={0.14} />
            <stop offset="100%" stopColor="#0F4FAF" stopOpacity={0} />
          </linearGradient>
        </defs>

        {!compact ? (
          <CartesianGrid vertical={false} strokeDasharray="0" stroke="#e2e8f0" />
        ) : null}

        {!compact ? (
          <>
            <XAxis
              dataKey="i"
              type="number"
              domain={[0, Math.max(0, chartData.length - 1)]}
              ticks={xTickIndices.length ? xTickIndices : undefined}
              tick={xAxisMonthTick}
              axisLine={{ stroke: CHART_AXIS_COLOR, strokeWidth: 1 }}
              tickLine={{ stroke: CHART_AXIS_COLOR, strokeWidth: 1, height: 4 }}
              interval={0}
              padding={{ left: 0, right: 0 }}
            />
            <YAxis
              domain={[yScale.scaleMin, yScale.scaleMax]}
              ticks={yScale.ticks}
              axisLine={{ stroke: CHART_AXIS_COLOR, strokeWidth: 1 }}
              tickLine={false}
              tick={<YAxisTick />}
              width={Y_AXIS_COL_WIDTH}
            />
            <ReferenceLine
              y={100}
              stroke="#c7d2eb"
              strokeDasharray="4 4"
              strokeWidth={1}
              ifOverflow="extendDomain"
            />
            {showTooltip ? (
              <>
                <ReferenceLine
                  x={activeIndex}
                  stroke="#9aa3b2"
                  strokeWidth={1}
                  strokeDasharray="3 3"
                  ifOverflow="extendDomain"
                />
                <ReferenceDot
                  x={activeIndex}
                  y={activeRow.portfolio}
                  r={4}
                  fill={PORTFOLIO_STROKE}
                  stroke="#fff"
                  strokeWidth={2}
                />
                <ReferenceDot
                  x={activeIndex}
                  y={activeRow.benchmark}
                  r={4}
                  fill={BENCHMARK_STROKE}
                  stroke="#fff"
                  strokeWidth={2}
                />
              </>
            ) : null}
          </>
        ) : (
          <>
            <XAxis dataKey="i" hide />
            <YAxis hide domain={[yScale.scaleMin, yScale.scaleMax]} />
          </>
        )}

        <Area
          type="monotone"
          dataKey="benchmark"
          stroke="none"
          fill={`url(#${benchmarkGradId})`}
          isAnimationActive={false}
          connectNulls
        />
        <Area
          type="monotone"
          dataKey="portfolio"
          stroke="none"
          fill={`url(#${portfolioGradId})`}
          isAnimationActive={false}
          connectNulls
        />
        <Line
          type="monotone"
          dataKey="benchmark"
          stroke={BENCHMARK_STROKE}
          strokeWidth={1.5}
          strokeDasharray="6 4"
          dot={false}
          isAnimationActive={false}
          connectNulls
        />
        <Line
          type="monotone"
          dataKey="portfolio"
          stroke={PORTFOLIO_STROKE}
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
          connectNulls
        />
      </ComposedChart>
    </ChartContainer>
  );

  const tooltipFlipLeft =
    plotSize.w > 0 && tooltipAnchorX + TOOLTIP_OFFSET_X + 220 > plotSize.w;

  const plotInteractionLayer =
    showTooltip && !compact ? (
      <div
        className="absolute inset-0 z-10 touch-none"
        aria-hidden
        onPointerMove={(e) => handlePlotPointerMove(e.clientX, e.clientY)}
        onPointerLeave={() => setScrub(null)}
        onPointerDown={(e) => handlePlotPointerMove(e.clientX, e.clientY)}
      />
    ) : null;

  const tooltipOverlay =
    showTooltip && !compact && activeRow ? (
      <div
        className="pointer-events-none absolute z-20"
        style={{
          left: tooltipFlipLeft
            ? tooltipAnchorX - TOOLTIP_OFFSET_X
            : tooltipAnchorX + TOOLTIP_OFFSET_X,
          top: tooltipAnchorY,
          transform: tooltipFlipLeft
            ? "translate(-100%, -50%)"
            : "translateY(-50%)",
        }}
      >
        <IndexedPerformanceTooltip
          row={activeRow}
          range={range}
          pointCount={chartData.length}
          portfolioName={portfolioName}
          benchmarkName={benchmarkName}
        />
      </div>
    ) : null;

  const chartShell = (
    <div ref={plotSurfaceRef} className="relative h-full w-full">
      {chart}
      {plotInteractionLayer}
      {tooltipOverlay}
    </div>
  );

  if (fillHeight) {
    return (
      <div ref={ref} className="absolute inset-0 min-h-[280px] bg-white">
        {height > 0 ? (
          <div className="relative h-full" style={{ height }}>
            {chartShell}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={`relative w-full bg-white ${compact ? "h-[112px]" : ""}`}
      style={compact ? undefined : { height: 320 }}
    >
      {height > 0 ? <div className="relative h-full">{chartShell}</div> : null}
    </div>
  );
}
