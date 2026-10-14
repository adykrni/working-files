import type {
  ChartDataPoint,
  GoalMonitoringData,
  GoalPortfolioData,
  GoalPortfolioType,
  GoalStatus,
} from "@/types/goalMonitoring";

const CHART_MONTH_COUNT = 48;
const CHART_START_DATE = new Date("2023-01-01T00:00:00Z");

interface PortfolioSeed {
  type: GoalPortfolioType;
  title: string;
  currentValue: number;
  goalValue: number;
  yearsToGoal: number;
  status: GoalStatus;
  trackingDelta: number;
  ytdReturn: number;
  volatility: number;
  maxDrawdown: number;
  expectedAnnualReturn: number;
  projectedMonthsToGoal: number;
  monthsAheadOrBehind: number;
  scheduleStatus: GoalPortfolioData["scenario"]["scheduleStatus"];
  recoveryTimeMonths: number;
  normalVolatilityMin: number;
  normalVolatilityMax: number;
  assetClasses: Array<{ assetClass: string; contribution: number; returnPct: number }>;
}

const PORTFOLIO_SEEDS: PortfolioSeed[] = [
  {
    type: "retirement",
    title: "Retirement portfolio",
    currentValue: 15_600_000,
    goalValue: 20_000_000,
    yearsToGoal: 13,
    status: "on-track",
    trackingDelta: 0.8,
    ytdReturn: 11.2,
    volatility: 8.4,
    maxDrawdown: -12.3,
    expectedAnnualReturn: 6.8,
    projectedMonthsToGoal: 148,
    monthsAheadOrBehind: 6,
    scheduleStatus: "ahead",
    recoveryTimeMonths: 14,
    normalVolatilityMin: 5.2,
    normalVolatilityMax: 9.8,
    assetClasses: [
      { assetClass: "US Equities", contribution: 42, returnPct: 14.2 },
      { assetClass: "International Equities", contribution: 18, returnPct: 9.8 },
      { assetClass: "Fixed Income", contribution: 28, returnPct: 4.1 },
      { assetClass: "Alternatives", contribution: 8, returnPct: 6.5 },
      { assetClass: "Cash", contribution: 4, returnPct: 2.3 },
    ],
  },
  {
    type: "advisory",
    title: "Advisory portfolio",
    currentValue: 8_500_000,
    goalValue: 12_500_000,
    yearsToGoal: 8,
    status: "on-track",
    trackingDelta: 0.8,
    ytdReturn: 12.5,
    volatility: 8.4,
    maxDrawdown: -12.3,
    expectedAnnualReturn: 6.8,
    projectedMonthsToGoal: 86,
    monthsAheadOrBehind: 3,
    scheduleStatus: "ahead",
    recoveryTimeMonths: 11,
    normalVolatilityMin: 6.5,
    normalVolatilityMax: 11.4,
    assetClasses: [
      { assetClass: "US Large Cap", contribution: 35, returnPct: 12.4 },
      { assetClass: "US Mid/Small Cap", contribution: 12, returnPct: 10.1 },
      { assetClass: "Global Bonds", contribution: 30, returnPct: 3.8 },
      { assetClass: "Real Estate", contribution: 15, returnPct: 7.2 },
      { assetClass: "Cash", contribution: 8, returnPct: 2.1 },
    ],
  },
  {
    type: "execution",
    title: "Execution portfolio",
    currentValue: 6_200_000,
    goalValue: 10_000_000,
    yearsToGoal: 3,
    status: "off-track",
    trackingDelta: -1.2,
    ytdReturn: 4.8,
    volatility: 14.6,
    maxDrawdown: -18.5,
    expectedAnnualReturn: 8.5,
    projectedMonthsToGoal: 42,
    monthsAheadOrBehind: -4,
    scheduleStatus: "behind",
    recoveryTimeMonths: 9,
    normalVolatilityMin: 9.2,
    normalVolatilityMax: 16.8,
    assetClasses: [
      { assetClass: "Technology", contribution: 28, returnPct: 18.6 },
      { assetClass: "Healthcare", contribution: 22, returnPct: 6.2 },
      { assetClass: "Financials", contribution: 18, returnPct: 5.4 },
      { assetClass: "Consumer", contribution: 16, returnPct: 3.1 },
      { assetClass: "Other sectors", contribution: 16, returnPct: 2.8 },
    ],
  },
];

/** Deterministic pseudo-random noise for reproducible chart curves */
function seededNoise(index: number, seed: number): number {
  const x = Math.sin(index * 12.9898 + seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function formatMonthLabel(monthIndex: number): string {
  const date = new Date(CHART_START_DATE);
  date.setUTCMonth(date.getUTCMonth() + monthIndex);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

function buildNarrativeMessage(seed: PortfolioSeed): string {
  const label = seed.title.replace(/ portfolio$/i, "");
  const delta = Math.abs(seed.trackingDelta).toFixed(1);
  if (seed.status === "on-track") {
    return `${label} portfolio is ${delta}% above expected returns.`;
  }
  return `${label} portfolio is ${delta}% below expected returns.`;
}

function generateChartData(seed: PortfolioSeed): ChartDataPoint[] {
  const monthlyVol = (seed.volatility / 100) / Math.sqrt(12);
  const monthlyDrift =
    Math.pow(1 + seed.expectedAnnualReturn / 100, 1 / 12) - 1;
  const trackingSkew =
    seed.status === "on-track"
      ? Math.abs(seed.trackingDelta) / 100 / 12
      : seed.trackingDelta / 100 / 12;

  const startActual = seed.currentValue * 0.7;
  const values: number[] = [startActual];

  for (let i = 1; i < CHART_MONTH_COUNT; i++) {
    const noise = (seededNoise(i, seed.currentValue) - 0.5) * 2;
    const monthlyReturn = monthlyDrift + trackingSkew + noise * monthlyVol;
    values.push(values[i - 1] * (1 + monthlyReturn));
  }

  // Preserve wiggle shape while anchoring the terminal value to currentValue
  const scale = seed.currentValue / values[values.length - 1];
  const scaledValues = values.map((value) => value * scale);

  const totalHorizonMonths = seed.yearsToGoal * 12;
  const targetStart = scaledValues[0] * 0.98;
  const targetEndMultiplier = seed.status === "on-track" ? 0.88 : 1.05;
  const targetEnd = seed.currentValue * targetEndMultiplier;
  const bandSpread = 2 * monthlyVol;

  return scaledValues.map((actual, index) => {
    const progress = index / (CHART_MONTH_COUNT - 1);
    const target = Math.round(targetStart + (targetEnd - targetStart) * progress);
    const roundedActual = Math.round(actual);

    return {
      month: formatMonthLabel(index),
      monthIndex: index,
      actual: roundedActual,
      target,
      upperBand: Math.round(roundedActual * (1 + bandSpread)),
      lowerBand: Math.round(roundedActual * (1 - bandSpread)),
    };
  });
}

function generateMonthlyReturns(seed: PortfolioSeed) {
  const buckets = [
    { id: "b1", range: "< -4%", count: 2, percentage: 3.3 },
    { id: "b2", range: "-4% to -2%", count: 5, percentage: 8.3 },
    { id: "b3", range: "-2% to 0%", count: 12, percentage: 20.0 },
    { id: "b4", range: "0% to 2%", count: 22, percentage: 36.7 },
    { id: "b5", range: "2% to 4%", count: 14, percentage: 23.3 },
    { id: "b6", range: "> 4%", count: 5, percentage: 8.3 },
  ];

  if (seed.status === "off-track") {
    return buckets.map((bucket, index) =>
      index <= 2
        ? { ...bucket, count: bucket.count + 2, percentage: bucket.percentage + 2 }
        : bucket,
    );
  }

  return buckets;
}

function buildPortfolio(seed: PortfolioSeed): GoalPortfolioData {
  return {
    type: seed.type,
    title: seed.title,
    currentValue: seed.currentValue,
    goalValue: seed.goalValue,
    yearsToGoal: seed.yearsToGoal,
    currency: "USD",
    status: seed.status,
    trackingDelta: seed.trackingDelta,
    narrativeMessage: buildNarrativeMessage(seed),
    chartData: generateChartData(seed),
    metrics: {
      ytdReturn: seed.ytdReturn,
      volatility: seed.volatility,
      maxDrawdown: seed.maxDrawdown,
      expectedAnnualReturn: seed.expectedAnnualReturn,
    },
    scenario: {
      projectedMonthsToGoal: seed.projectedMonthsToGoal,
      monthsAheadOrBehind: seed.monthsAheadOrBehind,
      scheduleStatus: seed.scheduleStatus,
    },
    monthlyReturns: generateMonthlyReturns(seed),
    assetClassContributions: seed.assetClasses,
    riskContext: {
      maxDrawdown: seed.maxDrawdown,
      recoveryTimeMonths: seed.recoveryTimeMonths,
      normalVolatilityRange: {
        min: seed.normalVolatilityMin,
        max: seed.normalVolatilityMax,
      },
    },
  };
}

const mockGoalMonitoringData: GoalMonitoringData = {
  title: "Wealth Monitoring",
  timestamp: "as of 05 Apr 2023, 12:45PM",
  portfolios: PORTFOLIO_SEEDS.reduce(
    (acc, seed) => {
      acc[seed.type] = buildPortfolio(seed);
      return acc;
    },
    {} as Record<GoalPortfolioType, GoalPortfolioData>,
  ),
};

export function useGoalMonitoringData(): GoalMonitoringData {
  return mockGoalMonitoringData;
}
