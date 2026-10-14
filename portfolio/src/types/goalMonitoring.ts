export type GoalPortfolioType = "retirement" | "advisory" | "execution";

export type GoalTimeframe = "6M" | "1M" | "1Y" | "5Y" | "MAX";

export type GoalStatus = "on-track" | "off-track";

export type ScheduleStatus = "ahead" | "behind" | "on-schedule";

export interface ChartDataPoint {
  /** ISO month label, e.g. "2021-01" */
  month: string;
  /** Zero-based index from start of series */
  monthIndex: number;
  /** Actual portfolio growth line */
  actual: number;
  /** Linear target trajectory toward goal */
  target: number;
  /** Upper bound of volatility band */
  upperBand: number;
  /** Lower bound of volatility band */
  lowerBand: number;
}

export interface MonthlyReturnBucket {
  id: string;
  /** Display label, e.g. "-2% to -1%" */
  range: string;
  count: number;
  /** Share of total months in bucket (0–100) */
  percentage: number;
}

export interface AssetClassContribution {
  assetClass: string;
  contribution: number;
  returnPct: number;
}

export interface ScenarioAnalysis {
  projectedMonthsToGoal: number;
  /** Positive = ahead of schedule, negative = behind */
  monthsAheadOrBehind: number;
  scheduleStatus: ScheduleStatus;
}

export interface RiskContext {
  maxDrawdown: number;
  recoveryTimeMonths: number;
  normalVolatilityRange: { min: number; max: number };
}

export interface GoalMetrics {
  ytdReturn: number;
  volatility: number;
  maxDrawdown: number;
  expectedAnnualReturn: number;
}

export interface GoalPortfolioData {
  type: GoalPortfolioType;
  title: string;
  currentValue: number;
  goalValue: number;
  yearsToGoal: number;
  currency: string;
  status: GoalStatus;
  /** Delta vs expected return, e.g. +0.8 */
  trackingDelta: number;
  narrativeMessage: string;
  /** Historical chart data (Jan '23 – Apr '26) */
  chartData: ChartDataPoint[];
  metrics: GoalMetrics;
  scenario: ScenarioAnalysis;
  monthlyReturns: MonthlyReturnBucket[];
  assetClassContributions: AssetClassContribution[];
  riskContext: RiskContext;
}

export interface GoalMonitoringData {
  title: string;
  timestamp: string;
  portfolios: Record<GoalPortfolioType, GoalPortfolioData>;
}
