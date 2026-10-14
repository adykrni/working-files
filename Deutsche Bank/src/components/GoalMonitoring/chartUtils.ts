import type { ChartDataPoint, GoalTimeframe } from "@/types/goalMonitoring";
import { formatMillions } from "@/lib/format";

const TIMEFRAME_MONTHS: Record<GoalTimeframe, number | null> = {
  "6M": 6,
  /** Monthly data — use 2 points so a line segment renders */
  "1M": 2,
  "1Y": 12,
  "5Y": 60,
  MAX: null,
};

/** Slice chart series to the selected timeframe window */
export function filterChartDataByTimeframe(
  data: ChartDataPoint[],
  timeframe: GoalTimeframe,
): ChartDataPoint[] {
  const months = TIMEFRAME_MONTHS[timeframe];
  if (months === null || data.length <= months) {
    return data;
  }
  return data.slice(data.length - months);
}

export const TIMEFRAME_OPTIONS: { value: GoalTimeframe; label: string }[] = [
  { value: "6M", label: "6M" },
  { value: "1M", label: "1M" },
  { value: "1Y", label: "1Y" },
  { value: "5Y", label: "5Y" },
  { value: "MAX", label: "MAX" },
];

const SHORT_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

/** Short x-axis label — e.g. "Jan '23" */
export function formatChartMonthLabel(month: string): string {
  const [year, monthNum] = month.split("-");
  const shortMonth = SHORT_MONTHS[Number(monthNum) - 1] ?? monthNum;
  return `${shortMonth} '${year.slice(-2)}`;
}

export function formatChartTooltipValue(value: number): string {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(0)}K`;
  }
  return `$${value.toFixed(0)}`;
}

/** Pick evenly spaced x-axis ticks (~8 labels across the range) */
export function getChartXAxisTicks(data: ChartDataPoint[]): string[] {
  if (data.length <= 1) {
    return data.map((point) => point.month);
  }

  const targetCount = Math.min(9, data.length);
  const step = Math.max(1, Math.floor((data.length - 1) / (targetCount - 1)));

  const ticks: string[] = [];
  for (let index = 0; index < data.length; index += step) {
    ticks.push(data[index].month);
  }

  const lastMonth = data[data.length - 1].month;
  if (ticks[ticks.length - 1] !== lastMonth) {
    ticks.push(lastMonth);
  }

  return ticks;
}

/** Compute Y-axis ticks with padding so lines aren't clipped */
export function getChartYAxisConfig(data: ChartDataPoint[], includeBand = false) {
  const values = data.flatMap((point) => {
    const base = [point.actual, point.target];
    return includeBand ? [...base, point.upperBand, point.lowerBand] : base;
  });

  const min = Math.min(...values);
  const max = Math.max(...values);
  const floor = Math.floor(min / 1_000_000) * 1_000_000;
  const ceil = Math.ceil(max / 1_000_000) * 1_000_000;
  const range = ceil - floor;
  const step = range <= 8_000_000 ? 1_000_000 : 2_000_000;
  const ticks: number[] = [];

  for (let tick = floor; tick <= ceil; tick += step) {
    ticks.push(tick);
  }

  if (ticks.length < 3) {
    return {
      domain: [floor * 0.95, ceil * 1.05] as [number, number],
      ticks: [floor, floor + step, ceil],
    };
  }

  return {
    domain: [ticks[0], ticks[ticks.length - 1]] as [number, number],
    ticks,
  };
}

export const CHART_AXIS_STYLE = {
  tick: { fill: "var(--db-primary)", fontSize: 10 },
  axisLine: false as const,
  tickLine: false as const,
};

export function formatYAxisTick(value: number): string {
  return formatMillions(value, 1);
}

export type GoalChartVariant = "level1" | "level2";
