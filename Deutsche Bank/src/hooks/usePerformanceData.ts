import { useMemo } from "react";
import type { ChartDataPoint } from "@/types/goalMonitoring";
import type { PortfolioId } from "@/types/wealth";
import { useWealthData } from "./useWealthData";

const CHART_MONTH_COUNT = 48;
const CHART_START_DATE = new Date("2023-01-01T00:00:00Z");
const BENCHMARK_ANNUAL_RETURN = 6.4;

const PORTFOLIO_CHART_PROFILE: Record<
  PortfolioId,
  { annualReturn: number; volatility: number; benchmarkReturn: number }
> = {
  all: { annualReturn: 7.8, volatility: 0.055, benchmarkReturn: BENCHMARK_ANNUAL_RETURN },
  advisory: { annualReturn: 9.2, volatility: 0.048, benchmarkReturn: 7.5 },
  execution: { annualReturn: 5.4, volatility: 0.072, benchmarkReturn: 6.8 },
  retirement: { annualReturn: 6.8, volatility: 0.042, benchmarkReturn: 6.0 },
};

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

function generatePortfolioChartData(
  currentValue: number,
  portfolioId: PortfolioId,
): ChartDataPoint[] {
  const profile = PORTFOLIO_CHART_PROFILE[portfolioId];
  const monthlyVol = profile.volatility / Math.sqrt(12);
  const monthlyDrift = Math.pow(1 + profile.annualReturn / 100, 1 / 12) - 1;
  const benchmarkMonthlyDrift =
    Math.pow(1 + profile.benchmarkReturn / 100, 1 / 12) - 1;

  const seed = currentValue + portfolioId.charCodeAt(0);
  const startActual = currentValue * (portfolioId === "retirement" ? 0.68 : 0.72);
  const actualValues: number[] = [startActual];

  for (let i = 1; i < CHART_MONTH_COUNT; i++) {
    const noise = (seededNoise(i, seed) - 0.5) * 2;
    const monthlyReturn = monthlyDrift + noise * monthlyVol;
    actualValues.push(actualValues[i - 1] * (1 + monthlyReturn));
  }

  const scale = currentValue / actualValues[actualValues.length - 1];
  const scaledActual = actualValues.map((value) => value * scale);

  const benchmarkStart = scaledActual[0] * 0.97;
  const benchmarkEnd = benchmarkStart * Math.pow(1 + benchmarkMonthlyDrift, CHART_MONTH_COUNT - 1);
  const bandSpread = 2 * monthlyVol;

  return scaledActual.map((actual, index) => {
    const progress = index / (CHART_MONTH_COUNT - 1);
    const target = Math.round(benchmarkStart + (benchmarkEnd - benchmarkStart) * progress);
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

export function usePerformanceData(portfolioId: PortfolioId = "all"): ChartDataPoint[] {
  const wealth = useWealthData();
  const portfolio =
    wealth.portfolios.find((item) => item.id === portfolioId) ?? wealth.portfolios[0];

  return useMemo(
    () => generatePortfolioChartData(portfolio.value, portfolioId),
    [portfolio.value, portfolioId],
  );
}
