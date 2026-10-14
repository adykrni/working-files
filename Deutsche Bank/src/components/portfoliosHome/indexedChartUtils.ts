import { PORTFOLIO_ROWS, type ChartRange } from "@/data/portfoliosHomeData";
import {
  getWealthBenchmark,
  isChartLinkedBenchmark,
  type WealthBenchmarkId,
} from "@/data/wealthBenchmarks";

export type IndexedChartPoint = {
  /** Short x-axis label when this point is a tick anchor */
  tickLabel?: string;
  /** Tooltip / scrub label */
  dateLabel: string;
  portfolio: number;
  benchmark: number;
};

type Keyframe = { t: number; portfolio: number; benchmark: number; tickLabel?: string };

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

function interpolateKeyframes(keyframes: Keyframe[], pointCount: number): IndexedChartPoint[] {
  const sorted = [...keyframes].sort((a, b) => a.t - b.t);
  const points: IndexedChartPoint[] = [];

  for (let i = 0; i < pointCount; i += 1) {
    const t = i / (pointCount - 1);
    let left = sorted[0]!;
    let right = sorted[sorted.length - 1]!;

    for (let k = 0; k < sorted.length - 1; k += 1) {
      if (t >= sorted[k]!.t && t <= sorted[k + 1]!.t) {
        left = sorted[k]!;
        right = sorted[k + 1]!;
        break;
      }
    }

    const segment = right.t - left.t || 1;
    const local = smoothstep((t - left.t) / segment);
    const portfolio = lerp(left.portfolio, right.portfolio, local);
    const benchmark = lerp(left.benchmark, right.benchmark, local);

    points.push({
      dateLabel: formatProgressLabel(t),
      tickLabel: undefined,
      portfolio: Number(portfolio.toFixed(2)),
      benchmark: Number(benchmark.toFixed(2)),
    });
  }

  sorted.forEach((kf) => {
    if (!kf.tickLabel) return;
    const idx = Math.round(kf.t * (pointCount - 1));
    if (points[idx]) {
      points[idx]!.tickLabel = kf.tickLabel;
      points[idx]!.dateLabel = kf.tickLabel;
    }
  });

  return points;
}

function formatProgressLabel(t: number): string {
  if (t >= 0.98) return "Latest";
  const month = Math.round(t * 9);
  const names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"];
  return names[Math.min(month, names.length - 1)] ?? "—";
}

export function getXTickPositions(
  points: IndexedChartPoint[],
  xAt: (i: number) => number,
): { label: string; x: number }[] {
  return points
    .map((p, i) => (p.tickLabel ? { label: p.tickLabel, x: xAt(i) } : null))
    .filter((t): t is { label: string; x: number } => t !== null);
}

/** X-axis labels at semantic range positions (even spacing on the plot width). */
export function getRangeXAxisTicks(
  range: ChartRange,
  plotW: number,
): { label: string; x: number }[] {
  if (plotW <= 0) return [];
  const keyframes = SERIES[range].keyframes;
  return keyframes
    .filter((kf): kf is Keyframe & { tickLabel: string } => Boolean(kf.tickLabel))
    .sort((a, b) => a.t - b.t)
    .map((kf) => ({
      label: kf.tickLabel,
      x: kf.t * plotW,
    }));
}

const SERIES: Record<ChartRange, { count: number; keyframes: Keyframe[] }> = {
  YTD: {
    count: 52,
    keyframes: [
      { t: 0, portfolio: 100, benchmark: 100, tickLabel: "Jan" },
      { t: 0.12, portfolio: 103.2, benchmark: 102.1 },
      { t: 0.28, portfolio: 101.4, benchmark: 101.2 },
      { t: 0.33, portfolio: 100.8, benchmark: 100.9, tickLabel: "Apr" },
      { t: 0.48, portfolio: 104.6, benchmark: 103.4 },
      { t: 0.66, portfolio: 107.1, benchmark: 105.8, tickLabel: "Jul" },
      { t: 0.82, portfolio: 109.4, benchmark: 107.6 },
      { t: 1, portfolio: 111.02, benchmark: 108.92, tickLabel: "Oct" },
    ],
  },
  "1M": {
    count: 28,
    keyframes: [
      { t: 0, portfolio: 109.2, benchmark: 107.4, tickLabel: "W1" },
      { t: 0.33, portfolio: 109.8, benchmark: 107.9, tickLabel: "W2" },
      { t: 0.66, portfolio: 110.4, benchmark: 108.3, tickLabel: "W3" },
      { t: 1, portfolio: 111.02, benchmark: 108.92, tickLabel: "W4" },
    ],
  },
  "3M": {
    count: 36,
    keyframes: [
      { t: 0, portfolio: 106.5, benchmark: 105.1, tickLabel: "−3M" },
      { t: 0.33, portfolio: 107.8, benchmark: 106.2, tickLabel: "−2M" },
      { t: 0.66, portfolio: 109.5, benchmark: 107.5, tickLabel: "−1M" },
      { t: 1, portfolio: 111.02, benchmark: 108.92, tickLabel: "Now" },
    ],
  },
  "6M": {
    count: 40,
    keyframes: [
      { t: 0, portfolio: 103.8, benchmark: 102.9, tickLabel: "−6M" },
      { t: 0.33, portfolio: 105.2, benchmark: 104.1, tickLabel: "−4M" },
      { t: 0.66, portfolio: 108.1, benchmark: 106.4, tickLabel: "−2M" },
      { t: 1, portfolio: 111.02, benchmark: 108.92, tickLabel: "Now" },
    ],
  },
  "1Y": {
    count: 48,
    keyframes: [
      { t: 0, portfolio: 100, benchmark: 100, tickLabel: "−1Y" },
      { t: 0.33, portfolio: 104.2, benchmark: 103.1, tickLabel: "−9M" },
      { t: 0.66, portfolio: 107.5, benchmark: 105.8, tickLabel: "−6M" },
      { t: 1, portfolio: 111.02, benchmark: 108.92, tickLabel: "Now" },
    ],
  },
  All: {
    count: 56,
    keyframes: [
      { t: 0, portfolio: 100, benchmark: 100, tickLabel: "2022" },
      { t: 0.33, portfolio: 96.5, benchmark: 97.8, tickLabel: "2023" },
      { t: 0.66, portfolio: 104.2, benchmark: 102.5, tickLabel: "2024" },
      { t: 1, portfolio: 111.02, benchmark: 108.92, tickLabel: "Now" },
    ],
  },
};

function remapPortfolioSeries(
  points: IndexedChartPoint[],
  portfolioId: string,
): IndexedChartPoint[] {
  if (portfolioId === "all") return points;

  const row = PORTFOLIO_ROWS.find((r) => r.id === portfolioId);
  const anchor = PORTFOLIO_ROWS.find((r) => r.isTotalRow);
  if (!row || row.isTotalRow || !anchor) return points;

  const baseEnd = points[points.length - 1]?.portfolio ?? 111.02;
  const endSpan = baseEnd - 100 || 1;
  const anchorGain = anchor.totalGain.pct || 1;
  const targetEnd = 100 + ((baseEnd - 100) * row.totalGain.pct) / anchorGain;
  const targetSpan = targetEnd - 100;

  return points.map((p) => {
    const normalized = (p.portfolio - 100) / endSpan;
    const portfolio = 100 + normalized * targetSpan;
    return { ...p, portfolio: Number(portfolio.toFixed(2)) };
  });
}

function remapBenchmarkSeries(
  points: IndexedChartPoint[],
  benchmarkId: WealthBenchmarkId,
): IndexedChartPoint[] {
  if (benchmarkId === "sp500" || !isChartLinkedBenchmark(benchmarkId)) return points;

  const profile = getWealthBenchmark(benchmarkId);
  const baseEnd = points[points.length - 1]?.benchmark ?? 108.92;
  const endSpan = baseEnd - 100 || 1;
  const targetSpan = profile.endIndex - 100;

  return points.map((p, i) => {
    const t = points.length <= 1 ? 0 : i / (points.length - 1);
    const normalized = (p.benchmark - 100) / endSpan;
    const skew = profile.pathSkew * Math.sin(t * Math.PI) * 0.6;
    const benchmark = 100 + normalized * targetSpan + skew;
    return { ...p, benchmark: Number(benchmark.toFixed(2)) };
  });
}

export function getIndexedChartSeries(
  range: ChartRange,
  benchmarkId: WealthBenchmarkId = "sp500",
  portfolioId = "all",
): IndexedChartPoint[] {
  const spec = SERIES[range];
  const base = interpolateKeyframes(spec.keyframes, spec.count);
  const withPortfolio = remapPortfolioSeries(base, portfolioId);
  return remapBenchmarkSeries(withPortfolio, benchmarkId);
}

export function getSharedYDomain(points: IndexedChartPoint[], padPct = 0.06): [number, number] {
  const values = points.flatMap((p) => [p.portfolio, p.benchmark]);
  let min = Math.min(...values);
  let max = Math.max(...values);
  const span = max - min || 1;
  min -= span * padPct;
  max += span * padPct;

  // Keep 100 baseline visible when near the window
  if (100 >= min && 100 <= max) {
    /* already in range */
  } else if (100 < min) {
    min = 100 - span * 0.02;
  } else if (100 > max) {
    max = 100 + span * 0.02;
  }

  return [min, max];
}

export function buildSmoothLinePath(
  values: number[],
  xAt: (i: number) => number,
  yAt: (v: number) => number,
  tension = 10,
): string {
  if (values.length === 0) return "";
  if (values.length === 1) return `M${xAt(0).toFixed(2)},${yAt(values[0]!).toFixed(2)}`;

  const coords = values.map((v, i) => ({ x: xAt(i), y: yAt(v) }));
  let path = `M${coords[0]!.x.toFixed(2)},${coords[0]!.y.toFixed(2)}`;

  for (let i = 0; i < coords.length - 1; i++) {
    const p0 = coords[Math.max(i - 1, 0)]!;
    const p1 = coords[i]!;
    const p2 = coords[i + 1]!;
    const p3 = coords[Math.min(i + 2, coords.length - 1)]!;

    const cp1x = p1.x + (p2.x - p0.x) / tension;
    const cp1y = p1.y + (p2.y - p0.y) / tension;
    const cp2x = p2.x - (p3.x - p1.x) / tension;
    const cp2y = p2.y - (p3.y - p1.y) / tension;

    path += ` C${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${p2.x.toFixed(2)},${p2.y.toFixed(2)}`;
  }

  return path;
}

export function buildAreaToBaseline(
  values: number[],
  xAt: (i: number) => number,
  yAt: (v: number) => number,
  baselineY: number,
): string {
  const line = buildSmoothLinePath(values, xAt, yAt);
  if (!line) return "";
  const lastX = xAt(values.length - 1);
  const firstX = xAt(0);
  return `${line} L${lastX.toFixed(2)},${baselineY.toFixed(2)} L${firstX.toFixed(2)},${baselineY.toFixed(2)} Z`;
}

const FULL_MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

/** Full month + year for hero header (updates with chart scrub index). */
export function formatChartHeaderDate(
  range: ChartRange,
  pointIndex: number,
  pointCount: number,
): string {
  if (pointCount <= 0) return "—";
  const t = pointCount <= 1 ? 1 : pointIndex / (pointCount - 1);

  if (range === "YTD") {
    const monthIdx = Math.min(9, Math.round(t * 9));
    return `${FULL_MONTH_NAMES[monthIdx]} 2026`;
  }

  if (range === "1M") {
    const day = Math.max(1, Math.min(28, Math.round(1 + t * 27)));
    return `October ${day}, 2026`;
  }

  if (range === "3M" || range === "6M") {
    const monthsBack = range === "3M" ? 3 : 6;
    const monthIdx = Math.max(0, 9 - Math.round((1 - t) * monthsBack));
    return `${FULL_MONTH_NAMES[monthIdx]} 2026`;
  }

  if (range === "1Y") {
    const start = new Date(2025, 10, 1);
    start.setMonth(start.getMonth() + Math.round(t * 11));
    return `${FULL_MONTH_NAMES[start.getMonth()]} ${start.getFullYear()}`;
  }

  if (range === "All") {
    const year = 2022 + Math.round(t * 4);
    return `October ${year}`;
  }

  return `${FULL_MONTH_NAMES[9]} 2026`;
}

/** Figma 955:20917 — e.g. October 26’ */
const HEADER_YEAR_MARK = "\u2019";

/** YTD header scrubs Jan 1 → Oct 6 (aligned with prototype as-of). */
const YTD_HEADER_START = new Date(2026, 0, 1);
const YTD_HEADER_END = new Date(2026, 9, 6);

export function formatChartPerformanceHeaderDate(
  range: ChartRange,
  pointIndex: number,
  pointCount: number,
): string {
  if (pointCount <= 0) return "—";
  const t = pointCount <= 1 ? 1 : pointIndex / (pointCount - 1);

  if (range === "YTD") {
    const spanMs = YTD_HEADER_END.getTime() - YTD_HEADER_START.getTime();
    const date = new Date(YTD_HEADER_START.getTime() + t * spanMs);
    return `${FULL_MONTH_NAMES[date.getMonth()]} ${date.getDate()}${HEADER_YEAR_MARK}`;
  }

  if (range === "1M") {
    const day = Math.max(1, Math.min(31, Math.round(1 + t * 30)));
    return `October ${day}${HEADER_YEAR_MARK}`;
  }

  if (range === "3M" || range === "6M") {
    const monthsBack = range === "3M" ? 3 : 6;
    const monthIdx = Math.max(0, 9 - Math.round((1 - t) * monthsBack));
    const day = Math.max(1, Math.min(28, 1 + (pointIndex % 28)));
    return `${FULL_MONTH_NAMES[monthIdx]} ${day}${HEADER_YEAR_MARK}`;
  }

  if (range === "1Y") {
    const start = new Date(2025, 10, 1);
    start.setMonth(start.getMonth() + Math.round(t * 11));
    const day = Math.max(1, Math.min(28, 1 + (pointIndex % 28)));
    return `${FULL_MONTH_NAMES[start.getMonth()]} ${day}${HEADER_YEAR_MARK}`;
  }

  if (range === "All") {
    const year = 2022 + Math.round(t * 4);
    return `October ${year}`;
  }

  return `October 26${HEADER_YEAR_MARK}`;
}

export function formatIndex(value: number) {
  return value.toFixed(2);
}

export function formatSpread(portfolio: number, benchmark: number) {
  const spread = portfolio - benchmark;
  const sign = spread >= 0 ? "+" : "−";
  return `${sign}${Math.abs(spread).toFixed(2)} pts`;
}

/** Figma 955:20934 — +2.10% vs Benchmark · YTD */
export function formatBenchmarkSpreadLine(
  portfolio: number,
  benchmark: number,
  range: ChartRange,
): string {
  const spread = portfolio - benchmark;
  const sign = spread >= 0 ? "+" : "−";
  return `${sign}${Math.abs(spread).toFixed(2)}% vs Benchmark · ${range}`;
}

/** Figma 1002:3590 — scrub spread only (benchmark name lives in the selector) */
export function formatBenchmarkSpreadLineScrub(portfolio: number, benchmark: number): string {
  const spread = portfolio - benchmark;
  const sign = spread >= 0 ? "+" : "−";
  return `${sign}${Math.abs(spread).toFixed(2)}%`;
}
