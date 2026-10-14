/** Prototype benchmarks common in private banking / wealth comparisons */
export type WealthBenchmarkId =
  | "sp500"
  | "msci-world"
  | "msci-acwi"
  | "msci-europe"
  | "ftse-100"
  | "stoxx-600"
  | "nikkei-225"
  | "msci-em"
  | "bbg-global-agg";

export type WealthBenchmark = {
  id: WealthBenchmarkId;
  /** Primary line in dropdown (Figma) */
  menuTitle: string;
  name: string;
  shortName: string;
  region: string;
  /** YTD total return % (prototype) */
  ytdReturnPct: number;
  /** Indexed level at series end (rebased to 100 at start) */
  endIndex: number;
  /** Slight path character vs base S&P-shaped curve */
  pathSkew: number;
  /** When true, selection updates chart + hero spread (demo: first 5 only) */
  chartLinked: boolean;
};

export const WEALTH_BENCHMARKS: WealthBenchmark[] = [
  {
    id: "sp500",
    menuTitle: "S&P500",
    name: "S&P 500",
    shortName: "S&P 500",
    region: "United states",
    ytdReturnPct: 8.92,
    endIndex: 108.92,
    pathSkew: 0,
    chartLinked: true,
  },
  {
    id: "msci-world",
    menuTitle: "MSCI World",
    name: "MSCI World",
    shortName: "MSCI World",
    region: "Global developed",
    ytdReturnPct: 7.45,
    endIndex: 107.45,
    pathSkew: 0.38,
    chartLinked: true,
  },
  {
    id: "msci-acwi",
    menuTitle: "MSCI ACWI",
    name: "MSCI ACWI",
    shortName: "MSCI ACWI",
    region: "Global all-cap",
    ytdReturnPct: 7.62,
    endIndex: 107.62,
    pathSkew: 0.32,
    chartLinked: true,
  },
  {
    id: "msci-europe",
    menuTitle: "MSCI Europe",
    name: "MSCI Europe",
    shortName: "MSCI Europe",
    region: "Europe develope",
    ytdReturnPct: 6.18,
    endIndex: 106.18,
    pathSkew: 0.52,
    chartLinked: true,
  },
  {
    id: "ftse-100",
    menuTitle: "FTSE 1000",
    name: "FTSE 100",
    shortName: "FTSE 100",
    region: "United Kingdom",
    ytdReturnPct: 4.21,
    endIndex: 104.21,
    pathSkew: 0.62,
    chartLinked: true,
  },
  {
    id: "stoxx-600",
    menuTitle: "STOXXX Europe 600",
    name: "STOXX Europe 600",
    shortName: "STOXX 600",
    region: "Eurozone & Europe",
    ytdReturnPct: 5.88,
    endIndex: 105.88,
    pathSkew: 0.48,
    chartLinked: false,
  },
  {
    id: "nikkei-225",
    menuTitle: "Nikkei 600",
    name: "Nikkei 225",
    shortName: "Nikkei 225",
    region: "Japan",
    ytdReturnPct: 9.34,
    endIndex: 109.34,
    pathSkew: -0.25,
    chartLinked: false,
  },
  {
    id: "msci-em",
    menuTitle: "MSCI Emerging Markets",
    name: "MSCI Emerging Markets",
    shortName: "MSCI EM",
    region: "Emerging Markets",
    ytdReturnPct: 3.92,
    endIndex: 103.92,
    pathSkew: 0.65,
    chartLinked: false,
  },
  {
    id: "bbg-global-agg",
    menuTitle: "Bloomberg Global Aggregate",
    name: "Bloomberg Global Aggregate",
    shortName: "Bloomberg Global Agg",
    region: "Global income fixed",
    ytdReturnPct: 2.18,
    endIndex: 102.18,
    pathSkew: 0.85,
    chartLinked: false,
  },
];

export const CHART_LINKED_BENCHMARK_IDS = WEALTH_BENCHMARKS.filter((b) => b.chartLinked).map(
  (b) => b.id,
);

/** Policy / hero reference benchmark (prototype: S&P 500 proxy) */
export const DEFAULT_BENCHMARK_ID: WealthBenchmarkId = "sp500";
export const POLICY_BENCHMARK_ID = DEFAULT_BENCHMARK_ID;

export function getWealthBenchmark(id: WealthBenchmarkId): WealthBenchmark {
  return WEALTH_BENCHMARKS.find((b) => b.id === id) ?? WEALTH_BENCHMARKS[0]!;
}

export function isChartLinkedBenchmark(id: WealthBenchmarkId): boolean {
  return getWealthBenchmark(id).chartLinked;
}

export function formatBenchmarkButtonLabel(benchmark: WealthBenchmark) {
  const sign = benchmark.ytdReturnPct >= 0 ? "+" : "−";
  return `${benchmark.shortName} (${sign}${Math.abs(benchmark.ytdReturnPct).toFixed(2)}%)`;
}

/** Chart toolbar — Figma 1002:3592 “S&P 500 (+8.92%)” */
export function formatChartBenchmarkTriggerLabel(benchmark: WealthBenchmark) {
  return formatBenchmarkButtonLabel(benchmark);
}

/** Hero Performance column — spread in percentage points */
export function formatHeroBenchmarkSpreadPts(portfolioYtdPct: number, benchmarkYtdPct: number) {
  const spread = portfolioYtdPct - benchmarkYtdPct;
  const sign = spread >= 0 ? "+" : "−";
  return `${sign}${Math.abs(spread).toFixed(1)} pts`;
}

export function formatBenchmarkMenuSubtitle(benchmark: WealthBenchmark) {
  const sign = benchmark.ytdReturnPct >= 0 ? "+" : "−";
  return `${benchmark.region} · YTD ${sign}${Math.abs(benchmark.ytdReturnPct).toFixed(2)}%`;
}

/** Portfolio YTD indexed return % for prototype hero (111.02 → +11.02%) */
export const PORTFOLIO_INDEXED_YTD_PCT = 11.02;

export function formatVsBenchmarkSpread(benchmark: WealthBenchmark) {
  const spread = PORTFOLIO_INDEXED_YTD_PCT - benchmark.ytdReturnPct;
  const sign = spread >= 0 ? "+" : "−";
  return `${sign}${Math.abs(spread).toFixed(2)}%`;
}

export function spreadTone(benchmark: WealthBenchmark): "positive" | "negative" {
  return PORTFOLIO_INDEXED_YTD_PCT - benchmark.ytdReturnPct >= 0 ? "positive" : "negative";
}

export const CHART_LINKED_BENCHMARKS = WEALTH_BENCHMARKS.filter((b) => b.chartLinked);
