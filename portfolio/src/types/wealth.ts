export interface Portfolio {
  id: string;
  name: string;
  level1Label?: string;
  value: number;
  currency: string;
  changePercentage: number;
}

export interface Holding {
  id: string;
  security: string;
  allocation: number;
  return: number;
}

/** % of total portfolio owned within an asset-class bucket */
export interface AllocationHolding {
  security: string;
  allocation: number;
}

export interface SectorBreakdown {
  sector: string;
  percentage: number;
  holdings?: AllocationHolding[];
}

export interface RetirementData {
  currentBalance: number;
  projectedAtRetirement: number;
  targetNeeded: number;
  projectedSurplus: number;
  yearsToRetirement: number;
  monthlyContribution: number;
  annualSavings: number;
  pensions: number;
  totalSavings: number;
  ytdReturn: number;
  expectedAnnualReturn: number;
  currentAllocation: string;
  accountBreakdown: { type: string; balance: number }[];
}

export interface PortfolioDetails {
  advisory?: {
    ytdPerformance: number;
    benchmark: number;
    outperformance: number;
    equitiesAllocation: number;
    equitiesValue: number;
    bondsAllocation: number;
    bondsValue: number;
    holdings: Holding[];
    strategy: string;
    fee: number;
    feeEstimateAnnual: number;
    benchmarkTarget: string;
    rebalancingFrequency: string;
    rebalancingDueDays: number;
    advisorName: string;
    alerts: { id: string; message: string; actionLabel?: string }[];
  };
  execution?: {
    incoming: number;
    outgoing: number;
    gains: number;
    ytdReturn: number;
    marketReturn: number;
    outperformance: number;
    tradingCosts: number;
    diversificationCount: number;
    sectorCount: number;
    countryCount: number;
    largestPositionName: string;
    largestPosition: number;
    sectorBreakdown: SectorBreakdown[];
    holdings: Holding[];
    activities: {
      id: string;
      type: "buy" | "sell" | "info";
      message: string;
    }[];
    nextSteps: { id: string; message: string }[];
  };
  retirement?: RetirementData & {
    savingsStatusMessage: string;
  };
  allPortfolios?: {
    netAssetValue: number;
    liabilities: number;
    ytdPerformance: number;
    availableBorrowing: number;
    equitiesAllocation: number;
    equitiesValue: number;
    equitiesHoldings?: AllocationHolding[];
    bondsAllocation: number;
    bondsValue: number;
    bondsHoldings?: AllocationHolding[];
    cashAllocation: number;
    cashValue: number;
    cashHoldings?: AllocationHolding[];
    portfolios: Array<{
      portfolio: string;
      balance: number;
      balanceShare: number;
      ytdReturn: number;
      allocation: string;
      status: string;
      statusVariant: "success" | "warning" | "neutral";
    }>;
    rebalancingOpportunities: Array<{
      id: string;
      observation: string;
      impact: string;
    }>;
  };
}

export interface WealthData {
  title: string;
  level1Title: string;
  timestamp: string;
  portfolios: Portfolio[];
  details: PortfolioDetails;
}

export type PortfolioId = "all" | "advisory" | "execution" | "retirement";
