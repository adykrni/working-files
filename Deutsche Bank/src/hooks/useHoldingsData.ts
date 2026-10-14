import { useEffect, useMemo, useState } from "react";
import type {
  HoldingsAssetClass,
  HoldingsData,
  HoldingsSecurityDetails,
  PerformanceHistoryPoint,
  Security,
} from "@/types/holdings";
import type { PortfolioId } from "@/types/wealth";

export interface UseHoldingsDataResult {
  data: HoldingsData | null;
  loading: boolean;
  error: string | null;
}

const MONTH_LABELS = [
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
] as const;

interface SecuritySeed extends Security {
  details: HoldingsSecurityDetails;
}

function buildPriceHistory(
  startPrice: number,
  endPrice: number,
  trend: "up" | "down" | "flat" = "up",
): PerformanceHistoryPoint[] {
  return MONTH_LABELS.map((month, index) => {
    const t = index / (MONTH_LABELS.length - 1);
    let value = startPrice + (endPrice - startPrice) * t;
    if (trend === "down") {
      value = startPrice - (startPrice - endPrice) * t;
    } else if (trend === "flat") {
      value = startPrice + (endPrice - startPrice) * t * 0.6 + Math.sin(index * 0.8) * startPrice * 0.02;
    }
    const wiggle = Math.sin(index * 1.1) * (endPrice - startPrice) * 0.04;
    return { month, value: Math.max(0, value + wiggle) };
  });
}

function toHoldingsData(
  assetClass: HoldingsAssetClass,
  seeds: SecuritySeed[],
  benchmarkLabel: string,
): HoldingsData {
  const holdings = seeds.map(({ details: _details, ...security }) => security);
  return {
    assetClass,
    holdings,
    lastUpdated: "2026-05-25T12:00:00.000Z",
    benchmarkLabel,
    totalInvestedAmount: holdings.reduce((sum, h) => sum + h.investedAmount, 0),
    totalCurrentValue: holdings.reduce((sum, h) => sum + h.currentValue, 0),
  };
}

const DETAILS_BY_ASSET_CLASS: Record<
  HoldingsAssetClass,
  Record<string, HoldingsSecurityDetails>
> = {
  equities: {},
  "fixed-income": {},
  alternatives: {},
  "money-market": {},
  others: {},
};

const EQUITIES_SEEDS: SecuritySeed[] = [
  {
    id: "db-ag",
    name: "Deutsche Bank AG",
    symbol: "DBK",
    investedAmount: 1_200_000,
    currentValue: 1_063_600,
    units: 100_000,
    costPrice: 12,
    currentPrice: 10.636,
    details: {
      performance: {
        ytdReturn: -31,
        ytdReturnDollar: -136_400,
        benchmarkComparison:
          "Deutsche Bank AG is -31% YTD while JPMorgan Chase is up +8.2%. Consider reviewing this position.",
        performanceStatus: "underperforming",
      },
      riskMetrics: {
        volatility: 45.2,
        beta: 2.1,
        maxDrawdown: -28,
        riskLevel: "higher-risk",
        portfolioAllocationPercent: 8.5,
      },
      costBasis: {
        costBasis: 1_200_000,
        currentValue: 1_063_600,
        unrealizedGainLoss: -136_400,
        unrealizedGainLossPercent: -11.37,
        timeHeldMonths: 18,
        actionableInsight: "Consider tax-loss harvesting",
      },
      performanceHistory: buildPriceHistory(14.2, 10.636, "down"),
    },
  },
  {
    id: "aapl",
    name: "Apple Inc",
    symbol: "AAPL",
    investedAmount: 500_000,
    currentValue: 589_200,
    units: 3_000,
    costPrice: 166.67,
    currentPrice: 196.4,
    details: {
      performance: {
        ytdReturn: 17.8,
        ytdReturnDollar: 89_200,
        benchmarkComparison:
          "Apple is up +17.8% YTD, outperforming S&P 500 by +9.6%",
        performanceStatus: "outperforming",
      },
      riskMetrics: {
        volatility: 28,
        beta: 1.3,
        maxDrawdown: -15,
        riskLevel: "average-risk",
        portfolioAllocationPercent: 4.2,
      },
      costBasis: {
        costBasis: 500_000,
        currentValue: 589_200,
        unrealizedGainLoss: 89_200,
        unrealizedGainLossPercent: 17.84,
        timeHeldMonths: 24,
        actionableInsight: "Excellent performance",
      },
      performanceHistory: buildPriceHistory(168, 196.4, "up"),
    },
  },
  {
    id: "msft",
    name: "Microsoft Corp",
    symbol: "MSFT",
    investedAmount: 450_000,
    currentValue: 504_200,
    units: 1_200,
    costPrice: 375,
    currentPrice: 420.17,
    details: {
      performance: {
        ytdReturn: 12,
        ytdReturnDollar: 54_200,
        benchmarkComparison: "Microsoft tracking market average",
        performanceStatus: "in-line",
      },
      riskMetrics: {
        volatility: 22,
        beta: 0.95,
        maxDrawdown: -12,
        riskLevel: "average-risk",
        portfolioAllocationPercent: 3.6,
      },
      costBasis: {
        costBasis: 450_000,
        currentValue: 504_200,
        unrealizedGainLoss: 54_200,
        unrealizedGainLossPercent: 12.04,
        timeHeldMonths: 20,
        actionableInsight: "Well-diversified position",
      },
      performanceHistory: buildPriceHistory(378, 420.17, "up"),
    },
  },
  {
    id: "tsla",
    name: "Tesla Inc",
    symbol: "TSLA",
    investedAmount: 400_000,
    currentValue: 387_600,
    units: 800,
    costPrice: 500,
    currentPrice: 484.5,
    details: {
      performance: {
        ytdReturn: -3.1,
        ytdReturnDollar: -12_400,
        benchmarkComparison:
          "Tesla is down -3.1% YTD, underperforming market by -11%",
        performanceStatus: "underperforming",
      },
      riskMetrics: {
        volatility: 48,
        beta: 2.2,
        maxDrawdown: -25,
        riskLevel: "higher-risk",
        portfolioAllocationPercent: 2.8,
      },
      costBasis: {
        costBasis: 400_000,
        currentValue: 387_600,
        unrealizedGainLoss: -12_400,
        unrealizedGainLossPercent: -3.1,
        timeHeldMonths: 12,
        actionableInsight: "High volatility, monitor closely",
      },
      performanceHistory: buildPriceHistory(512, 484.5, "down"),
    },
  },
  {
    id: "voo",
    name: "Vanguard S&P 500 ETF",
    symbol: "VOO",
    investedAmount: 350_000,
    currentValue: 378_400,
    units: 700,
    costPrice: 500,
    currentPrice: 540.57,
    details: {
      performance: {
        ytdReturn: 8.1,
        ytdReturnDollar: 28_400,
        benchmarkComparison: "VOO tracking S&P 500 benchmark closely at +8.1% YTD",
        performanceStatus: "in-line",
      },
      riskMetrics: {
        volatility: 15,
        beta: 1,
        maxDrawdown: -8,
        riskLevel: "lower-risk",
        portfolioAllocationPercent: 2.7,
      },
      costBasis: {
        costBasis: 350_000,
        currentValue: 378_400,
        unrealizedGainLoss: 28_400,
        unrealizedGainLossPercent: 8.11,
        timeHeldMonths: 36,
        actionableInsight: "Core index exposure — well-positioned for growth",
      },
      performanceHistory: buildPriceHistory(502, 540.57, "up"),
    },
  },
  {
    id: "nvda",
    name: "Nvidia Corp",
    symbol: "NVDA",
    investedAmount: 320_000,
    currentValue: 412_800,
    units: 2_400,
    costPrice: 133.33,
    currentPrice: 172,
    details: {
      performance: {
        ytdReturn: 29,
        ytdReturnDollar: 92_800,
        benchmarkComparison:
          "Nvidia is up +29% YTD, significantly outperforming S&P 500",
        performanceStatus: "outperforming",
      },
      riskMetrics: {
        volatility: 42,
        beta: 1.8,
        maxDrawdown: -18,
        riskLevel: "higher-risk",
        portfolioAllocationPercent: 3,
      },
      costBasis: {
        costBasis: 320_000,
        currentValue: 412_800,
        unrealizedGainLoss: 92_800,
        unrealizedGainLossPercent: 29,
        timeHeldMonths: 14,
        actionableInsight: "Strong momentum — review concentration risk",
      },
      performanceHistory: buildPriceHistory(135, 172, "up"),
    },
  },
  {
    id: "amzn",
    name: "Amazon.com Inc",
    symbol: "AMZN",
    investedAmount: 280_000,
    currentValue: 315_600,
    units: 1_800,
    costPrice: 155.56,
    currentPrice: 175.33,
    details: {
      performance: {
        ytdReturn: 12.7,
        ytdReturnDollar: 35_600,
        benchmarkComparison: "Amazon up +12.7% YTD, slightly ahead of S&P 500",
        performanceStatus: "outperforming",
      },
      riskMetrics: {
        volatility: 32,
        beta: 1.4,
        maxDrawdown: -14,
        riskLevel: "average-risk",
        portfolioAllocationPercent: 2.3,
      },
      costBasis: {
        costBasis: 280_000,
        currentValue: 315_600,
        unrealizedGainLoss: 35_600,
        unrealizedGainLossPercent: 12.71,
        timeHeldMonths: 22,
        actionableInsight: "Well-positioned for growth",
      },
      performanceHistory: buildPriceHistory(158, 175.33, "up"),
    },
  },
];

const FIXED_INCOME_SEEDS: SecuritySeed[] = [
  {
    id: "us-treasury-10y",
    name: "US Treasury 10-Year Note",
    symbol: "UST10Y",
    investedAmount: 600_000,
    currentValue: 612_400,
    units: 600,
    costPrice: 1000,
    currentPrice: 1020.67,
    details: {
      performance: {
        ytdReturn: 2.1,
        ytdReturnDollar: 12_400,
        benchmarkComparison: "Treasury 10Y up +2.1% YTD, in line with Bloomberg US Aggregate",
        performanceStatus: "in-line",
      },
      riskMetrics: {
        volatility: 6.2,
        beta: 0.2,
        maxDrawdown: -4,
        riskLevel: "lower-risk",
        portfolioAllocationPercent: 5.1,
      },
      costBasis: {
        costBasis: 600_000,
        currentValue: 612_400,
        unrealizedGainLoss: 12_400,
        unrealizedGainLossPercent: 2.07,
        timeHeldMonths: 30,
        actionableInsight: "Stable income anchor",
      },
      performanceHistory: buildPriceHistory(998, 1020.67, "up"),
    },
  },
  {
    id: "corp-bond-ig",
    name: "Corporate Bond IG Fund",
    symbol: "CBIG",
    investedAmount: 450_000,
    currentValue: 458_200,
    units: 45_000,
    costPrice: 10,
    currentPrice: 10.18,
    details: {
      performance: {
        ytdReturn: 1.8,
        ytdReturnDollar: 8_200,
        benchmarkComparison: "IG corporates +1.8% YTD vs benchmark +1.6%",
        performanceStatus: "in-line",
      },
      riskMetrics: {
        volatility: 4.5,
        beta: 0.35,
        maxDrawdown: -3,
        riskLevel: "lower-risk",
        portfolioAllocationPercent: 3.8,
      },
      costBasis: {
        costBasis: 450_000,
        currentValue: 458_200,
        unrealizedGainLoss: 8_200,
        unrealizedGainLossPercent: 1.82,
        timeHeldMonths: 24,
        actionableInsight: "Reliable yield — hold to maturity",
      },
      performanceHistory: buildPriceHistory(9.95, 10.18, "flat"),
    },
  },
  {
    id: "muni-bond",
    name: "Municipal Bond ETF",
    symbol: "MUB",
    investedAmount: 320_000,
    currentValue: 326_400,
    units: 6_400,
    costPrice: 50,
    currentPrice: 51,
    details: {
      performance: {
        ytdReturn: 2,
        ytdReturnDollar: 6_400,
        benchmarkComparison: "Municipal bonds +2% YTD, tax-efficient income",
        performanceStatus: "in-line",
      },
      riskMetrics: {
        volatility: 3.8,
        beta: 0.15,
        maxDrawdown: -2,
        riskLevel: "lower-risk",
        portfolioAllocationPercent: 2.7,
      },
      costBasis: {
        costBasis: 320_000,
        currentValue: 326_400,
        unrealizedGainLoss: 6_400,
        unrealizedGainLossPercent: 2,
        timeHeldMonths: 18,
        actionableInsight: "Tax-advantaged income stream",
      },
      performanceHistory: buildPriceHistory(49.8, 51, "up"),
    },
  },
  {
    id: "hy-bond",
    name: "High Yield Bond Fund",
    symbol: "HYBF",
    investedAmount: 250_000,
    currentValue: 241_500,
    units: 25_000,
    costPrice: 10,
    currentPrice: 9.66,
    details: {
      performance: {
        ytdReturn: -3.4,
        ytdReturnDollar: -8_500,
        benchmarkComparison: "High yield down -3.4% YTD, underperforming IG by -5.2%",
        performanceStatus: "underperforming",
      },
      riskMetrics: {
        volatility: 12,
        beta: 0.55,
        maxDrawdown: -9,
        riskLevel: "higher-risk",
        portfolioAllocationPercent: 2,
      },
      costBasis: {
        costBasis: 250_000,
        currentValue: 241_500,
        unrealizedGainLoss: -8_500,
        unrealizedGainLossPercent: -3.4,
        timeHeldMonths: 15,
        actionableInsight: "Credit spread widening — monitor closely",
      },
      performanceHistory: buildPriceHistory(10.2, 9.66, "down"),
    },
  },
  {
    id: "tips-etf",
    name: "TIPS ETF",
    symbol: "TIP",
    investedAmount: 200_000,
    currentValue: 204_800,
    units: 2_000,
    costPrice: 100,
    currentPrice: 102.4,
    details: {
      performance: {
        ytdReturn: 2.4,
        ytdReturnDollar: 4_800,
        benchmarkComparison: "TIPS +2.4% YTD, inflation protection performing as expected",
        performanceStatus: "outperforming",
      },
      riskMetrics: {
        volatility: 5,
        beta: 0.25,
        maxDrawdown: -3,
        riskLevel: "lower-risk",
        portfolioAllocationPercent: 1.7,
      },
      costBasis: {
        costBasis: 200_000,
        currentValue: 204_800,
        unrealizedGainLoss: 4_800,
        unrealizedGainLossPercent: 2.4,
        timeHeldMonths: 28,
        actionableInsight: "Inflation hedge — maintain allocation",
      },
      performanceHistory: buildPriceHistory(99.5, 102.4, "up"),
    },
  },
];

const ALTERNATIVES_SEEDS: SecuritySeed[] = [
  {
    id: "reit-fund",
    name: "Global REIT Fund",
    symbol: "GREIT",
    investedAmount: 400_000,
    currentValue: 418_400,
    units: 20_000,
    costPrice: 20,
    currentPrice: 20.92,
    details: {
      performance: {
        ytdReturn: 4.6,
        ytdReturnDollar: 18_400,
        benchmarkComparison: "REITs +4.6% YTD, outperforming alternatives benchmark by +1.2%",
        performanceStatus: "outperforming",
      },
      riskMetrics: {
        volatility: 18,
        beta: 0.85,
        maxDrawdown: -11,
        riskLevel: "average-risk",
        portfolioAllocationPercent: 3.4,
      },
      costBasis: {
        costBasis: 400_000,
        currentValue: 418_400,
        unrealizedGainLoss: 18_400,
        unrealizedGainLossPercent: 4.6,
        timeHeldMonths: 26,
        actionableInsight: "Real assets diversification benefit",
      },
      performanceHistory: buildPriceHistory(19.5, 20.92, "up"),
    },
  },
  {
    id: "pe-fund",
    name: "Private Equity Fund II",
    symbol: "PEF2",
    investedAmount: 500_000,
    currentValue: 545_000,
    units: 500,
    costPrice: 1000,
    currentPrice: 1090,
    details: {
      performance: {
        ytdReturn: 9,
        ytdReturnDollar: 45_000,
        benchmarkComparison: "PE Fund II +9% YTD vs Cambridge Associates +7.1%",
        performanceStatus: "outperforming",
      },
      riskMetrics: {
        volatility: 22,
        beta: 0.6,
        maxDrawdown: -14,
        riskLevel: "higher-risk",
        portfolioAllocationPercent: 4.4,
      },
      costBasis: {
        costBasis: 500_000,
        currentValue: 545_000,
        unrealizedGainLoss: 45_000,
        unrealizedGainLossPercent: 9,
        timeHeldMonths: 48,
        actionableInsight: "Illiquid — long-term hold recommended",
      },
      performanceHistory: buildPriceHistory(980, 1090, "up"),
    },
  },
  {
    id: "hedge-fund",
    name: "Multi-Strategy Hedge Fund",
    symbol: "MSHF",
    investedAmount: 350_000,
    currentValue: 357_700,
    units: 350,
    costPrice: 1000,
    currentPrice: 1022,
    details: {
      performance: {
        ytdReturn: 2.2,
        ytdReturnDollar: 7_700,
        benchmarkComparison: "Hedge fund +2.2% YTD with lower volatility than equities",
        performanceStatus: "in-line",
      },
      riskMetrics: {
        volatility: 8,
        beta: 0.3,
        maxDrawdown: -5,
        riskLevel: "lower-risk",
        portfolioAllocationPercent: 2.9,
      },
      costBasis: {
        costBasis: 350_000,
        currentValue: 357_700,
        unrealizedGainLoss: 7_700,
        unrealizedGainLossPercent: 2.2,
        timeHeldMonths: 36,
        actionableInsight: "Downside protection — maintain allocation",
      },
      performanceHistory: buildPriceHistory(1005, 1022, "flat"),
    },
  },
  {
    id: "commodity-etf",
    name: "Broad Commodity ETF",
    symbol: "DBC",
    investedAmount: 180_000,
    currentValue: 172_800,
    units: 9_000,
    costPrice: 20,
    currentPrice: 19.2,
    details: {
      performance: {
        ytdReturn: -4,
        ytdReturnDollar: -7_200,
        benchmarkComparison: "Commodities -4% YTD, underperforming inflation expectations",
        performanceStatus: "underperforming",
      },
      riskMetrics: {
        volatility: 24,
        beta: 0.4,
        maxDrawdown: -12,
        riskLevel: "higher-risk",
        portfolioAllocationPercent: 1.4,
      },
      costBasis: {
        costBasis: 180_000,
        currentValue: 172_800,
        unrealizedGainLoss: -7_200,
        unrealizedGainLossPercent: -4,
        timeHeldMonths: 10,
        actionableInsight: "Consider rebalancing commodity exposure",
      },
      performanceHistory: buildPriceHistory(20.5, 19.2, "down"),
    },
  },
  {
    id: "infra-fund",
    name: "Infrastructure Fund",
    symbol: "INFR",
    investedAmount: 270_000,
    currentValue: 283_500,
    units: 2_700,
    costPrice: 100,
    currentPrice: 105,
    details: {
      performance: {
        ytdReturn: 5,
        ytdReturnDollar: 13_500,
        benchmarkComparison: "Infrastructure +5% YTD, steady cash yield profile",
        performanceStatus: "outperforming",
      },
      riskMetrics: {
        volatility: 12,
        beta: 0.5,
        maxDrawdown: -7,
        riskLevel: "average-risk",
        portfolioAllocationPercent: 2.3,
      },
      costBasis: {
        costBasis: 270_000,
        currentValue: 283_500,
        unrealizedGainLoss: 13_500,
        unrealizedGainLossPercent: 5,
        timeHeldMonths: 32,
        actionableInsight: "Inflation-linked cash flows — hold",
      },
      performanceHistory: buildPriceHistory(98, 105, "up"),
    },
  },
];

const MONEY_MARKET_SEEDS: SecuritySeed[] = [
  {
    id: "mm-fund-usd",
    name: "USD Money Market Fund",
    symbol: "MMUSD",
    investedAmount: 800_000,
    currentValue: 812_800,
    units: 812_800,
    costPrice: 1,
    currentPrice: 1,
    details: {
      performance: {
        ytdReturn: 1.6,
        ytdReturnDollar: 12_800,
        benchmarkComparison: "Money market +1.6% YTD, tracking Fed funds rate",
        performanceStatus: "in-line",
      },
      riskMetrics: {
        volatility: 0.2,
        beta: 0,
        maxDrawdown: 0,
        riskLevel: "lower-risk",
        portfolioAllocationPercent: 6.8,
      },
      costBasis: {
        costBasis: 800_000,
        currentValue: 812_800,
        unrealizedGainLoss: 12_800,
        unrealizedGainLossPercent: 1.6,
        timeHeldMonths: 12,
        actionableInsight: "Liquidity reserve — optimal for near-term needs",
      },
      performanceHistory: buildPriceHistory(0.985, 1, "up"),
    },
  },
  {
    id: "tbill-3m",
    name: "3-Month T-Bill Ladder",
    symbol: "TB3M",
    investedAmount: 500_000,
    currentValue: 507_500,
    units: 500,
    costPrice: 1000,
    currentPrice: 1015,
    details: {
      performance: {
        ytdReturn: 1.5,
        ytdReturnDollar: 7_500,
        benchmarkComparison: "T-Bill ladder +1.5% YTD, risk-free return",
        performanceStatus: "in-line",
      },
      riskMetrics: {
        volatility: 0.1,
        beta: 0,
        maxDrawdown: 0,
        riskLevel: "lower-risk",
        portfolioAllocationPercent: 4.3,
      },
      costBasis: {
        costBasis: 500_000,
        currentValue: 507_500,
        unrealizedGainLoss: 7_500,
        unrealizedGainLossPercent: 1.5,
        timeHeldMonths: 6,
        actionableInsight: "Capital preservation — no action needed",
      },
      performanceHistory: buildPriceHistory(1000, 1015, "up"),
    },
  },
  {
    id: "cd-portfolio",
    name: "Certificate of Deposit Portfolio",
    symbol: "CDP",
    investedAmount: 300_000,
    currentValue: 304_500,
    units: 300,
    costPrice: 1000,
    currentPrice: 1015,
    details: {
      performance: {
        ytdReturn: 1.5,
        ytdReturnDollar: 4_500,
        benchmarkComparison: "CD portfolio +1.5% YTD, locked rate above savings",
        performanceStatus: "in-line",
      },
      riskMetrics: {
        volatility: 0,
        beta: 0,
        maxDrawdown: 0,
        riskLevel: "lower-risk",
        portfolioAllocationPercent: 2.6,
      },
      costBasis: {
        costBasis: 300_000,
        currentValue: 304_500,
        unrealizedGainLoss: 4_500,
        unrealizedGainLossPercent: 1.5,
        timeHeldMonths: 9,
        actionableInsight: "Maturity in 3 months — plan reinvestment",
      },
      performanceHistory: buildPriceHistory(1000, 1015, "up"),
    },
  },
  {
    id: "eur-mm",
    name: "EUR Money Market Fund",
    symbol: "MMEUR",
    investedAmount: 200_000,
    currentValue: 203_200,
    units: 200_000,
    costPrice: 1,
    currentPrice: 1.016,
    details: {
      performance: {
        ytdReturn: 1.6,
        ytdReturnDollar: 3_200,
        benchmarkComparison: "EUR money market +1.6% YTD, ECB rate aligned",
        performanceStatus: "in-line",
      },
      riskMetrics: {
        volatility: 0.3,
        beta: 0,
        maxDrawdown: -0.1,
        riskLevel: "lower-risk",
        portfolioAllocationPercent: 1.7,
      },
      costBasis: {
        costBasis: 200_000,
        currentValue: 203_200,
        unrealizedGainLoss: 3_200,
        unrealizedGainLossPercent: 1.6,
        timeHeldMonths: 12,
        actionableInsight: "FX exposure minimal — hold",
      },
      performanceHistory: buildPriceHistory(0.99, 1.016, "up"),
    },
  },
];

const OTHERS_SEEDS: SecuritySeed[] = [
  {
    id: "gold-etf",
    name: "Gold ETF",
    symbol: "GLD",
    investedAmount: 150_000,
    currentValue: 168_000,
    units: 750,
    costPrice: 200,
    currentPrice: 224,
    details: {
      performance: {
        ytdReturn: 12,
        ytdReturnDollar: 18_000,
        benchmarkComparison: "Gold +12% YTD, safe-haven demand supporting prices",
        performanceStatus: "outperforming",
      },
      riskMetrics: {
        volatility: 16,
        beta: -0.1,
        maxDrawdown: -8,
        riskLevel: "average-risk",
        portfolioAllocationPercent: 1.4,
      },
      costBasis: {
        costBasis: 150_000,
        currentValue: 168_000,
        unrealizedGainLoss: 18_000,
        unrealizedGainLossPercent: 12,
        timeHeldMonths: 18,
        actionableInsight: "Hedge allocation — maintain 1–2% target",
      },
      performanceHistory: buildPriceHistory(198, 224, "up"),
    },
  },
  {
    id: "crypto-trust",
    name: "Digital Assets Trust",
    symbol: "DAT",
    investedAmount: 80_000,
    currentValue: 92_800,
    units: 800,
    costPrice: 100,
    currentPrice: 116,
    details: {
      performance: {
        ytdReturn: 16,
        ytdReturnDollar: 12_800,
        benchmarkComparison: "Digital assets +16% YTD, high volatility environment",
        performanceStatus: "outperforming",
      },
      riskMetrics: {
        volatility: 65,
        beta: 2.5,
        maxDrawdown: -35,
        riskLevel: "higher-risk",
        portfolioAllocationPercent: 0.8,
      },
      costBasis: {
        costBasis: 80_000,
        currentValue: 92_800,
        unrealizedGainLoss: 12_800,
        unrealizedGainLossPercent: 16,
        timeHeldMonths: 8,
        actionableInsight: "Speculative sleeve — limit to <1% of portfolio",
      },
      performanceHistory: buildPriceHistory(88, 116, "up"),
    },
  },
  {
    id: "structured-note",
    name: "Structured Note — Autocall",
    symbol: "SNAC",
    investedAmount: 120_000,
    currentValue: 118_800,
    units: 120,
    costPrice: 1000,
    currentPrice: 990,
    details: {
      performance: {
        ytdReturn: -1,
        ytdReturnDollar: -1_200,
        benchmarkComparison: "Structured note -1% YTD, coupon deferred this quarter",
        performanceStatus: "underperforming",
      },
      riskMetrics: {
        volatility: 10,
        beta: 0.7,
        maxDrawdown: -6,
        riskLevel: "average-risk",
        portfolioAllocationPercent: 1,
      },
      costBasis: {
        costBasis: 120_000,
        currentValue: 118_800,
        unrealizedGainLoss: -1_200,
        unrealizedGainLossPercent: -1,
        timeHeldMonths: 14,
        actionableInsight: "Review autocall trigger levels at next observation",
      },
      performanceHistory: buildPriceHistory(1010, 990, "down"),
    },
  },
  {
    id: "insurance-wrapper",
    name: "Unit-Linked Insurance Wrapper",
    symbol: "ULIW",
    investedAmount: 200_000,
    currentValue: 206_000,
    units: 200,
    costPrice: 1000,
    currentPrice: 1030,
    details: {
      performance: {
        ytdReturn: 3,
        ytdReturnDollar: 6_000,
        benchmarkComparison: "Insurance wrapper +3% YTD, balanced fund performance",
        performanceStatus: "in-line",
      },
      riskMetrics: {
        volatility: 8,
        beta: 0.45,
        maxDrawdown: -4,
        riskLevel: "lower-risk",
        portfolioAllocationPercent: 1.7,
      },
      costBasis: {
        costBasis: 200_000,
        currentValue: 206_000,
        unrealizedGainLoss: 6_000,
        unrealizedGainLossPercent: 3,
        timeHeldMonths: 60,
        actionableInsight: "Long-term estate planning vehicle — hold",
      },
      performanceHistory: buildPriceHistory(1005, 1030, "up"),
    },
  },
];

function registerSeeds(assetClass: HoldingsAssetClass, seeds: SecuritySeed[]) {
  DETAILS_BY_ASSET_CLASS[assetClass] = Object.fromEntries(
    seeds.map((seed) => [seed.id, seed.details]),
  );
}

registerSeeds("equities", EQUITIES_SEEDS);
registerSeeds("fixed-income", FIXED_INCOME_SEEDS);
registerSeeds("alternatives", ALTERNATIVES_SEEDS);
registerSeeds("money-market", MONEY_MARKET_SEEDS);
registerSeeds("others", OTHERS_SEEDS);

const HOLDINGS_BY_CLASS: Record<HoldingsAssetClass, HoldingsData> = {
  equities: toHoldingsData("equities", EQUITIES_SEEDS, "JPMorgan Chase"),
  "fixed-income": toHoldingsData("fixed-income", FIXED_INCOME_SEEDS, "Bloomberg US Aggregate"),
  alternatives: toHoldingsData("alternatives", ALTERNATIVES_SEEDS, "Cambridge Associates"),
  "money-market": toHoldingsData("money-market", MONEY_MARKET_SEEDS, "Fed Funds Rate"),
  others: toHoldingsData("others", OTHERS_SEEDS, "Mixed Benchmark"),
};

const SEEDS_BY_CLASS: Record<HoldingsAssetClass, SecuritySeed[]> = {
  equities: EQUITIES_SEEDS,
  "fixed-income": FIXED_INCOME_SEEDS,
  alternatives: ALTERNATIVES_SEEDS,
  "money-market": MONEY_MARKET_SEEDS,
  others: OTHERS_SEEDS,
};

const PORTFOLIO_SECURITY_IDS: Record<PortfolioId, Record<HoldingsAssetClass, string[]>> = {
  all: {
    equities: ["db-ag", "aapl", "msft", "tsla", "voo", "nvda", "amzn"],
    "fixed-income": ["us-treasury-10y", "corp-bond-ig", "muni-bond", "hy-bond", "tips-etf"],
    alternatives: ["reit-fund", "pe-fund", "hedge-fund", "commodity-etf", "infra-fund"],
    "money-market": ["mm-fund-usd", "tbill-3m", "cd-portfolio", "eur-mm"],
    others: ["gold-etf", "crypto-trust", "structured-note", "insurance-wrapper"],
  },
  advisory: {
    equities: ["aapl", "msft", "voo"],
    "fixed-income": ["us-treasury-10y", "corp-bond-ig", "tips-etf"],
    alternatives: ["reit-fund"],
    "money-market": ["mm-fund-usd"],
    others: [],
  },
  execution: {
    equities: ["db-ag", "nvda", "tsla", "amzn", "msft", "aapl"],
    "fixed-income": ["corp-bond-ig", "hy-bond"],
    alternatives: ["commodity-etf"],
    "money-market": ["tbill-3m"],
    others: ["structured-note"],
  },
  retirement: {
    equities: ["voo"],
    "fixed-income": ["us-treasury-10y", "tips-etf", "muni-bond"],
    alternatives: [],
    "money-market": ["mm-fund-usd", "cd-portfolio"],
    others: [],
  },
};

function buildPortfolioHoldings(portfolioId: PortfolioId): Record<HoldingsAssetClass, HoldingsData> {
  const idsByClass = PORTFOLIO_SECURITY_IDS[portfolioId];
  return (Object.keys(idsByClass) as HoldingsAssetClass[]).reduce(
    (acc, assetClass) => {
      const ids = new Set(idsByClass[assetClass]);
      const seeds = SEEDS_BY_CLASS[assetClass].filter((seed) => ids.has(seed.id));
      acc[assetClass] = toHoldingsData(
        assetClass,
        seeds,
        HOLDINGS_BY_CLASS[assetClass].benchmarkLabel,
      );
      return acc;
    },
    {} as Record<HoldingsAssetClass, HoldingsData>,
  );
}

const HOLDINGS_BY_PORTFOLIO: Record<PortfolioId, Record<HoldingsAssetClass, HoldingsData>> = {
  all: HOLDINGS_BY_CLASS,
  advisory: buildPortfolioHoldings("advisory"),
  execution: buildPortfolioHoldings("execution"),
  retirement: buildPortfolioHoldings("retirement"),
};

/** Lookup enriched security details for expanded row rendering */
export function getHoldingsSecurityDetails(
  assetClass: HoldingsAssetClass,
  securityId: string,
): HoldingsSecurityDetails | undefined {
  return DETAILS_BY_ASSET_CLASS[assetClass]?.[securityId];
}

/**
 * Returns mock holdings data for the selected asset class.
 * Simulates a brief loading state on asset class change.
 */
export function useHoldingsData(
  assetClass: HoldingsAssetClass,
  portfolioId: PortfolioId = "all",
): UseHoldingsDataResult {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const data = useMemo(
    () => HOLDINGS_BY_PORTFOLIO[portfolioId]?.[assetClass] ?? null,
    [assetClass, portfolioId],
  );

  useEffect(() => {
    setLoading(true);
    setError(null);
    const timer = window.setTimeout(() => {
      if (!data) {
        setError("Unable to load holdings for this asset class.");
        setLoading(false);
        return;
      }
      setLoading(false);
    }, 280);
    return () => window.clearTimeout(timer);
  }, [assetClass, portfolioId, data]);

  return { data, loading, error };
}
