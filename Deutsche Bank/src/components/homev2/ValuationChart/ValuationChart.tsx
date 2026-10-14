"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ChartDataPoint } from "@/types/goalMonitoring";
import { formatCurrencyParts } from "@/lib/format";
import { ValuationRangeBar } from "./ValuationRangeBar";
import {
  computeScrubberStats,
  formatValuationDelta,
  formatValuationYTick,
  getPerformanceHeadline,
  getPerformanceSubline,
  getValuationYAxisConfig,
  prepareValuationPlotSeries,
  type ScrubberStats,
  type ValuationPlotPoint,
  type ValuationRange,
} from "./valuationChartUtils";

interface ValuationChartProps {
  data: ChartDataPoint[];
  height?: number;
  className?: string;
  defaultRange?: ValuationRange;
}

const Y_AXIS_WIDTH = 40;
const PLOT_PAD_TOP = 8;
const PLOT_PAD_RIGHT = 16;

function PerformanceHeadline({
  stats,
  isScrubbing,
}: {
  stats: ScrubberStats;
  isScrubbing: boolean;
}) {
  const { whole, decimals } = formatCurrencyParts(stats.focusValue);
  const headlineColor = stats.isFlat
    ? "text-[#3c4556]"
    : stats.isPositive
      ? "text-[#2ba13f]"
      : "text-[#d72735]";

  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div className="flex min-w-0 flex-col gap-1">
        <p className={`font-display text-[16px] leading-normal ${headlineColor}`}>
          {getPerformanceHeadline(stats)}
        </p>
        <p className="text-[13px] leading-[1.4] text-[#3c4556]">
          {getPerformanceSubline(stats, isScrubbing)}
        </p>
      </div>
      <div className="shrink-0 text-right">
        <p className="font-display leading-none text-[#07132a]">
          <span className="text-[16px] leading-normal">{whole}</span>
          <span className="text-[10px] leading-normal">.{decimals}</span>
        </p>
        <p className="text-[11px] leading-normal text-[#a7a8aa]">{stats.focusLabel}</p>
      </div>
    </div>
  );
}

function ChartTooltip({
  stats,
  point,
  anchorX,
  anchorY,
  plotInnerWidth,
}: {
  stats: ScrubberStats;
  point: ValuationPlotPoint;
  anchorX: number;
  anchorY: number;
  plotInnerWidth: number;
}) {
  const sign = stats.changeAbs >= 0 ? "+" : "−";
  const changeColor = stats.isPositive ? "text-[#2ba13f]" : "text-[#d72735]";
  const { whole, decimals } = formatCurrencyParts(stats.focusValue);
  const flipLeft = anchorX > plotInnerWidth * 0.58;

  return (
    <div
      className="pointer-events-none absolute z-20 w-[168px] rounded-[6px] bg-white px-3 py-2.5 shadow-[0px_2px_10px_rgba(0,0,0,0.1)] transition-none"
      style={{
        top: Math.max(4, anchorY - 56),
        left: flipLeft
          ? Y_AXIS_WIDTH + anchorX - 168 - 12
          : Y_AXIS_WIDTH + anchorX + 12,
      }}
    >
      <p className="mb-1 text-[12px] leading-normal text-[#3c4556]">
        {stats.focusLabel} · Month {point.monthIndex + 1}
      </p>
      <p className="font-display text-[14px] leading-normal text-[#07132a]">
        {whole}
        <span className="text-[10px]">.{decimals}</span>
      </p>
      <p className={`mt-1 text-[12px] leading-[1.4] ${changeColor}`}>
        {sign}
        {Math.abs(stats.changePct).toFixed(1)}% from {stats.startLabel}
      </p>
      <p className="mt-0.5 text-[11px] leading-normal text-[#3c4556]">
        {sign}
        {formatValuationDelta(Math.abs(stats.changeAbs))} since start
      </p>
    </div>
  );
}

function buildSmoothLinePath(
  points: ValuationPlotPoint[],
  xAt: (index: number) => number,
  yAt: (value: number) => number,
): string {
  if (points.length === 0) return "";
  if (points.length === 1) {
    return `M${xAt(0).toFixed(2)},${yAt(points[0].actual).toFixed(2)}`;
  }

  const coords = points.map((point, index) => ({
    x: xAt(index),
    y: yAt(point.actual),
  }));

  let path = `M${coords[0].x.toFixed(2)},${coords[0].y.toFixed(2)}`;

  for (let i = 0; i < coords.length - 1; i++) {
    const p0 = coords[Math.max(i - 1, 0)];
    const p1 = coords[i];
    const p2 = coords[i + 1];
    const p3 = coords[Math.min(i + 2, coords.length - 1)];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    path += ` C${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${p2.x.toFixed(2)},${p2.y.toFixed(2)}`;
  }

  return path;
}

function buildAreaPath(
  points: ValuationPlotPoint[],
  xAt: (index: number) => number,
  yAt: (value: number) => number,
  baselineY: number,
): string {
  if (points.length === 0) return "";
  const line = buildSmoothLinePath(points, xAt, yAt);
  const lastX = xAt(points.length - 1);
  const firstX = xAt(0);
  return `${line} L${lastX.toFixed(2)},${baselineY.toFixed(2)} L${firstX.toFixed(2)},${baselineY.toFixed(2)} Z`;
}

/** Custom SVG plot — Figma 732:3018 */
export function ValuationChart({
  data,
  height = 181,
  className = "",
  defaultRange = "ALL",
}: ValuationChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [plotWidth, setPlotWidth] = useState(0);
  const [activeRange, setActiveRange] = useState<ValuationRange>(defaultRange);
  const [scrubPlotIndex, setScrubPlotIndex] = useState<number | null>(null);

  const visibleData = useMemo(
    () => prepareValuationPlotSeries(data, activeRange),
    [data, activeRange],
  );

  const { domain, ticks } = useMemo(
    () => getValuationYAxisConfig(visibleData),
    [visibleData],
  );
  const yMin = domain[0];
  const yMax = domain[1];

  const lastPlotIndex = Math.max(0, visibleData.length - 1);
  const activePlotIndex = scrubPlotIndex ?? lastPlotIndex;
  const activePoint = visibleData[activePlotIndex];

  const scrubberStats = useMemo(
    () => computeScrubberStats(visibleData, activePlotIndex, activeRange),
    [visibleData, activePlotIndex, activeRange],
  );

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const update = () => setPlotWidth(element.clientWidth);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const plotInnerWidth = Math.max(0, plotWidth - Y_AXIS_WIDTH - PLOT_PAD_RIGHT);
  const plotInnerHeight = height - PLOT_PAD_TOP;

  const xAt = useCallback(
    (index: number) => {
      if (visibleData.length <= 1) return 0;
      return (index / (visibleData.length - 1)) * plotInnerWidth;
    },
    [visibleData.length, plotInnerWidth],
  );

  const yAt = useCallback(
    (value: number) => {
      const range = yMax - yMin;
      if (range <= 0) return plotInnerHeight;
      return plotInnerHeight - ((value - yMin) / range) * plotInnerHeight;
    },
    [plotInnerHeight, yMin, yMax],
  );

  const handlePlotMouseMove = useCallback(
    (event: React.MouseEvent<SVGRectElement>) => {
      if (visibleData.length === 0 || plotInnerWidth <= 0) return;
      const rect = event.currentTarget.getBoundingClientRect();
      const relativeX = event.clientX - rect.left;
      const ratio = Math.min(1, Math.max(0, relativeX / plotInnerWidth));
      const index = Math.round(ratio * (visibleData.length - 1));
      setScrubPlotIndex(index);
    },
    [visibleData.length, plotInnerWidth],
  );

  const handleRangeChange = useCallback((range: ValuationRange) => {
    setActiveRange(range);
    setScrubPlotIndex(null);
  }, []);

  if (!activePoint || !scrubberStats || plotWidth === 0) {
    return (
      <div ref={containerRef} className={`flex w-full flex-col ${className}`} style={{ minHeight: height + 80 }}>
        <div style={{ height }} />
      </div>
    );
  }

  const isScrubbing = scrubPlotIndex !== null;
  const anchorX = xAt(activePlotIndex);
  const anchorY = yAt(activePoint.actual) + PLOT_PAD_TOP;
  const baselineY = plotInnerHeight + PLOT_PAD_TOP;
  const linePath = buildSmoothLinePath(visibleData, xAt, (v) => yAt(v) + PLOT_PAD_TOP);
  const areaPath = buildAreaPath(
    visibleData,
    xAt,
    (v) => yAt(v) + PLOT_PAD_TOP,
    baselineY,
  );

  return (
    <div className={`flex w-full flex-col gap-5 ${className}`}>
      <PerformanceHeadline stats={scrubberStats} isScrubbing={isScrubbing} />

      <div className="flex w-full flex-col">
        <div ref={containerRef} className="relative w-full" style={{ height }}>
        <ChartTooltip
          key={activePlotIndex}
          stats={scrubberStats}
          point={activePoint}
          anchorX={anchorX}
          anchorY={anchorY}
          plotInnerWidth={plotInnerWidth}
        />

        <svg
          width={plotWidth}
          height={height}
          className="block overflow-visible"
          aria-label="Portfolio performance chart"
        >
          <defs>
            <linearGradient id="valuation-area-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1A69DE" stopOpacity={0.22} />
              <stop offset="100%" stopColor="#1A69DE" stopOpacity={0} />
            </linearGradient>
          </defs>

          {ticks.map((tick) => {
            const y = yAt(tick) + PLOT_PAD_TOP;
            return (
              <g key={tick}>
                <text
                  x={Y_AXIS_WIDTH - 6}
                  y={y + 4}
                  textAnchor="end"
                  fill="#A7A8AA"
                  fontSize={12}
                >
                  {formatValuationYTick(tick)}
                </text>
                <line
                  x1={Y_AXIS_WIDTH}
                  y1={y}
                  x2={plotWidth - PLOT_PAD_RIGHT}
                  y2={y}
                  stroke="#DCE4F3"
                  strokeDasharray="4 4"
                  strokeWidth={1}
                />
              </g>
            );
          })}

          <g transform={`translate(${Y_AXIS_WIDTH}, 0)`}>
            <path d={areaPath} fill="url(#valuation-area-fill)" />
            <path d={linePath} fill="none" stroke="#1A69DE" strokeWidth={2} strokeLinejoin="round" />

            <line
              x1={0}
              y1={baselineY}
              x2={plotInnerWidth}
              y2={baselineY}
              stroke="#DCE4F3"
              strokeWidth={1}
            />

            <line
              x1={anchorX}
              y1={PLOT_PAD_TOP}
              x2={anchorX}
              y2={baselineY}
              stroke="#A7A8AA"
              strokeDasharray="4 4"
              strokeWidth={1}
            />

            <circle
              cx={anchorX}
              cy={yAt(activePoint.actual) + PLOT_PAD_TOP}
              r={6}
              fill="#0018A8"
              stroke="#FFFFFF"
              strokeWidth={2}
            />

            <rect
              x={0}
              y={0}
              width={plotInnerWidth}
              height={height}
              fill="transparent"
              onMouseMove={handlePlotMouseMove}
              onMouseLeave={() => setScrubPlotIndex(null)}
            />
          </g>
        </svg>
        </div>

        <div
          className="mt-[15px]"
          style={{
            marginLeft: Y_AXIS_WIDTH,
            width: plotInnerWidth > 0 ? plotInnerWidth : undefined,
          }}
        >
          <ValuationRangeBar activeRange={activeRange} onChange={handleRangeChange} />
        </div>
      </div>
    </div>
  );
}
