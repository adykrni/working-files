import type { ChartDataPoint } from "@/types/goalMonitoring";
import { formatChartMonthLabel } from "@/components/GoalMonitoring/chartUtils";

export type ValuationRange = "3M" | "6M" | "9M" | "12M" | "15M" | "ALL";

export const VALUATION_RANGES: ValuationRange[] = ["3M", "6M", "9M", "12M", "15M", "ALL"];

export const VALUATION_RANGE_LABELS: Record<ValuationRange, string> = {
  "3M": "3 months",
  "6M": "6 months",
  "9M": "9 months",
  "12M": "1 year",
  "15M": "2 year",
  ALL: "Max",
};

const RANGE_MONTHS: Record<Exclude<ValuationRange, "ALL">, number> = {
  "3M": 3,
  "6M": 6,
  "9M": 9,
  "12M": 12,
  "15M": 15,
};

/** Plot-ready point — plotIndex drives even x spacing */
export interface ValuationPlotPoint extends ChartDataPoint {
  plotIndex: number;
}

export interface ScrubberStats {
  startLabel: string;
  focusLabel: string;
  startValue: number;
  focusValue: number;
  changeAbs: number;
  changePct: number;
  isPositive: boolean;
  isFlat: boolean;
  periodLabel: string;
}

export function filterValuationDataByRange(
  data: ChartDataPoint[],
  range: ValuationRange,
): ChartDataPoint[] {
  if (range === "ALL" || data.length === 0) return data;

  const months = RANGE_MONTHS[range];
  return data.length <= months ? data : data.slice(0, months);
}

export function prepareValuationPlotSeries(
  data: ChartDataPoint[],
  range: ValuationRange,
): ValuationPlotPoint[] {
  return filterValuationDataByRange(data, range).map((point, plotIndex) => ({
    ...point,
    plotIndex,
  }));
}

export function computeScrubberStats(
  visibleData: ValuationPlotPoint[],
  scrubPlotIndex: number,
  range: ValuationRange,
): ScrubberStats | null {
  if (visibleData.length === 0) return null;

  const start = visibleData[0];
  const focus = visibleData[Math.min(Math.max(scrubPlotIndex, 0), visibleData.length - 1)];
  const changeAbs = focus.actual - start.actual;
  const changePct = start.actual === 0 ? 0 : (changeAbs / start.actual) * 100;

  const periodLabel =
    range === "ALL"
      ? `since ${formatChartMonthLabel(start.month)}`
      : `over first ${RANGE_MONTHS[range as Exclude<ValuationRange, "ALL">]} months`;

  return {
    startLabel: formatChartMonthLabel(start.month),
    focusLabel: formatChartMonthLabel(focus.month),
    startValue: start.actual,
    focusValue: focus.actual,
    changeAbs,
    changePct,
    isPositive: changeAbs > 0,
    isFlat: Math.abs(changePct) < 0.05,
    periodLabel,
  };
}

export function getPerformanceHeadline(stats: ScrubberStats): string {
  if (stats.isFlat) return `Flat ${stats.periodLabel}`;
  const sign = stats.isPositive ? "+" : "−";
  return `${sign}${Math.abs(stats.changePct).toFixed(1)}% ${stats.periodLabel}`;
}

export function getPerformanceSubline(stats: ScrubberStats, isScrubbing: boolean): string {
  const sign = stats.changeAbs >= 0 ? "+" : "−";
  const abs = formatValuationDelta(Math.abs(stats.changeAbs));
  const verb = stats.changeAbs >= 0 ? "gained" : "lost";

  if (isScrubbing) {
    return `${stats.focusLabel}: ${formatValuationCompact(stats.focusValue)} (${sign}${abs} from ${stats.startLabel})`;
  }

  return `Portfolio ${verb} ${sign}${abs} · now at ${formatValuationCompact(stats.focusValue)} (${stats.focusLabel})`;
}

export function getValuationXAxisTicks(visibleData: ValuationPlotPoint[]): number[] {
  if (visibleData.length === 0) return [];

  const lastPlotIndex = visibleData.length - 1;
  const markerMonthIndices = [2, 5, 8, 11, 14];

  const ticks = markerMonthIndices
    .map((monthIndex) => visibleData.findIndex((point) => point.monthIndex === monthIndex))
    .filter((plotIndex) => plotIndex >= 0);

  if (ticks.length === 0 || ticks[ticks.length - 1] !== lastPlotIndex) {
    ticks.push(lastPlotIndex);
  }

  return ticks;
}

export function formatValuationXTick(
  plotIndex: number,
  visibleData: ValuationPlotPoint[],
  range: ValuationRange,
): string {
  const point = visibleData[plotIndex];
  if (!point) return "";

  const isLastPoint = plotIndex === visibleData.length - 1;
  if (isLastPoint && range === "ALL") return "ALL";

  return `${point.monthIndex + 1}M`;
}

/** Five grid lines; domain fits visible series (Figma 732:3037) */
export function getValuationYAxisConfig(data: ChartDataPoint[]) {
  const series = data.length > 0 ? data : [{ actual: 0 } as ChartDataPoint];
  const min = Math.min(...series.map((point) => point.actual));
  const max = Math.max(...series.map((point) => point.actual));
  const spread = max - min || max * 0.1;
  const pad = spread * 0.08;

  const snap = 500_000;
  let floor = Math.max(0, Math.floor((min - pad) / snap) * snap);
  let ceil = Math.ceil((max + pad) / snap) * snap;

  const minSpan = snap * 8;
  if (ceil - floor < minSpan) {
    ceil = floor + minSpan;
  }

  const step = (ceil - floor) / 4;
  const ticks = [0, 1, 2, 3, 4].map((i) => floor + step * i);

  return {
    domain: [floor, ceil] as [number, number],
    ticks,
  };
}

export function formatValuationYTick(value: number): string {
  if (value === 0) return "0$";
  const millions = value / 1_000_000;
  if (Number.isInteger(millions)) return `${millions}M$`;
  const rounded = Math.round(millions * 4) / 4;
  return Number.isInteger(rounded) ? `${rounded}M$` : `${millions.toFixed(1)}M$`;
}

export function formatValuationCompact(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value.toFixed(0)}`;
}

export function formatValuationDelta(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value.toFixed(0)}`;
}
