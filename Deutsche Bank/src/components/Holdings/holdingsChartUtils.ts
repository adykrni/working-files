import type { PerformanceHistoryPoint } from "@/types/holdings";

export const HOLDINGS_CHART_AXIS_STYLE = {
  tick: { fill: "var(--db-muted)", fontSize: 10 },
  axisLine: false as const,
  tickLine: false as const,
};

/** Format share price for axis and tooltip */
export function formatHoldingsPrice(value: number): string {
  if (value >= 1_000) {
    return `$${value.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  }
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function getHoldingsChartXAxisTicks(data: PerformanceHistoryPoint[]): string[] {
  if (data.length <= 6) {
    return data.map((point) => point.month);
  }
  const step = Math.max(1, Math.floor((data.length - 1) / 5));
  const ticks: string[] = [];
  for (let i = 0; i < data.length; i += step) {
    ticks.push(data[i].month);
  }
  const last = data[data.length - 1].month;
  if (ticks[ticks.length - 1] !== last) {
    ticks.push(last);
  }
  return ticks;
}

export function getHoldingsChartYAxisConfig(data: PerformanceHistoryPoint[]) {
  const values = data.map((point) => point.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const padding = (max - min) * 0.12 || max * 0.05 || 1;
  const domainMin = Math.max(0, min - padding);
  const domainMax = max + padding;
  const range = domainMax - domainMin;
  const rawStep = range / 4;
  const magnitude = 10 ** Math.floor(Math.log10(rawStep || 1));
  const step = Math.max(magnitude / 2, Math.ceil(rawStep / magnitude) * magnitude);

  const ticks: number[] = [];
  let tick = Math.floor(domainMin / step) * step;
  while (tick <= domainMax + step * 0.01) {
    if (tick >= domainMin - step * 0.01) {
      ticks.push(Number(tick.toFixed(4)));
    }
    tick += step;
  }

  if (ticks.length < 2) {
    return {
      domain: [domainMin, domainMax] as [number, number],
      ticks: [domainMin, domainMax],
    };
  }

  return {
    domain: [ticks[0], ticks[ticks.length - 1]] as [number, number],
    ticks,
  };
}

export function getHoldingsChartStrokeColor(data: PerformanceHistoryPoint[]): string {
  if (data.length < 2) return "var(--db-info)";
  const first = data[0].value;
  const last = data[data.length - 1].value;
  if (last > first) return "var(--db-success)";
  if (last < first) return "#ff5040";
  return "var(--db-info)";
}
