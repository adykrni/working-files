export type HoldingsAssetClass =
  | "equities"
  | "fixed-income"
  | "alternatives"
  | "money-market"
  | "others";

export type PerformanceStatus = "outperforming" | "underperforming" | "in-line";

export type RiskLevel = "higher-risk" | "average-risk" | "lower-risk";

export interface Security {
  id: string;
  name: string;
  symbol: string;
  investedAmount: number;
  currentValue: number;
  units: number;
  currentPrice: number;
  costPrice: number;
}

export interface SecurityPerformance {
  ytdReturn: number;
  ytdReturnDollar: number;
  benchmarkComparison: string;
  performanceStatus: PerformanceStatus;
}

export interface RiskMetrics {
  volatility: number;
  beta: number;
  maxDrawdown: number;
  riskLevel: RiskLevel;
  portfolioAllocationPercent: number;
}

export interface CostBasisInfo {
  costBasis: number;
  currentValue: number;
  unrealizedGainLoss: number;
  unrealizedGainLossPercent: number;
  timeHeldMonths: number;
  actionableInsight: string;
}

export interface PerformanceHistoryPoint {
  month: string;
  value: number;
}

export interface HoldingsSecurityDetails {
  performance: SecurityPerformance;
  riskMetrics: RiskMetrics;
  costBasis: CostBasisInfo;
  performanceHistory: PerformanceHistoryPoint[];
}

export interface HoldingsData {
  assetClass: HoldingsAssetClass;
  holdings: Security[];
  lastUpdated: string;
  benchmarkLabel: string;
  totalInvestedAmount: number;
  totalCurrentValue: number;
}
