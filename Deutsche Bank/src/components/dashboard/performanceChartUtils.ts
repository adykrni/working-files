import type { ChartDataPoint } from "@/types/goalMonitoring";

export type PerformancePeriod = "1D" | "5D" | "1M" | "6M" | "1Y" | "5Y" | "MAX";

const PERFORMANCE_PERIOD_MONTHS: Record<PerformancePeriod, number | null> = {
  "1D": 2,
  "5D": 2,
  "1M": 2,
  "6M": 6,
  "1Y": 12,
  "5Y": 60,
  MAX: null,
};

/** Slice chart series to the selected performance period */
export function filterPerformanceDataByPeriod(
  data: ChartDataPoint[],
  period: PerformancePeriod,
): ChartDataPoint[] {
  const months = PERFORMANCE_PERIOD_MONTHS[period];
  if (months === null || data.length <= months) {
    return data;
  }
  return data.slice(data.length - months);
}
