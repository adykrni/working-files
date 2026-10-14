import type { AssetAllocationData, AssetClass } from "@/types/assetAllocations";
import type { PortfolioId } from "@/types/wealth";

export interface UseAssetAllocationsDataResult {
  data: AssetAllocationData | null;
  loading: boolean;
  error: string | null;
}

function buildAssetClass(
  id: string,
  name: string,
  color: string,
  currentAllocation: number,
  targetAllocation: number,
  ytdReturn: number,
  dollarContribution: number,
  volatilityContribution: number,
  sharpeRatio: number,
): AssetClass {
  return {
    id,
    name,
    color,
    currentAllocation,
    targetAllocation,
    ytdReturn,
    dollarContribution,
    volatilityContribution,
    sharpeRatio,
  };
}

/** Aligned with wealth overview detail panels per portfolio */
const ALLOCATION_BY_PORTFOLIO: Record<PortfolioId, AssetAllocationData> = {
  all: {
    totalAccountValue: 19_575_327,
    lastUpdated: "2026-05-25T12:00:00.000Z",
    overallSharpeRatio: 0.9,
    portfolioVolatility: 9.2,
    assetClasses: [
      buildAssetClass("equities", "Equities", "#29b6f6", 60, 60, 8.9, 11_700_000, 52, 0.8),
      buildAssetClass("bonds", "Bonds", "#7b83ef", 25, 25, 3.2, 4_900_000, 28, 0.6),
      buildAssetClass("cash", "Cash", "#a87ce2", 15, 15, 1.5, 2_975_327, 8, 2.1),
      buildAssetClass("alternatives", "Alternatives", "#6a895e", 0, 0, 0, 0, 0, 0),
      buildAssetClass("others", "Others", "#ae9b9b", 0, 0, 0, 0, 0, 0),
    ],
    currencies: [
      buildAssetClass("usd", "USD", "#ccabff", 62, 62, 8.9, 12_136_703, 0, 0),
      buildAssetClass("eur", "EUR", "#f6ae29", 24, 24, 2.1, 4_698_078, 0, 0),
      buildAssetClass("gbp", "GBP", "#ff87bf", 14, 14, -1.2, 2_740_546, 0, 0),
    ],
  },
  advisory: {
    totalAccountValue: 8_500_000,
    lastUpdated: "2026-05-25T12:00:00.000Z",
    overallSharpeRatio: 1.1,
    portfolioVolatility: 7.8,
    assetClasses: [
      buildAssetClass("equities", "Equities", "#29b6f6", 60, 60, 18.5, 5_100_000, 58, 1.0),
      buildAssetClass("bonds", "Bonds", "#7b83ef", 40, 40, 4.2, 3_400_000, 32, 0.7),
      buildAssetClass("cash", "Cash", "#a87ce2", 0, 0, 0, 0, 0, 0),
      buildAssetClass("alternatives", "Alternatives", "#6a895e", 0, 0, 0, 0, 0, 0),
      buildAssetClass("others", "Others", "#ae9b9b", 0, 0, 0, 0, 0, 0),
    ],
    currencies: [
      buildAssetClass("usd", "USD", "#ccabff", 72, 72, 18.5, 6_120_000, 0, 0),
      buildAssetClass("eur", "EUR", "#f6ae29", 28, 28, 3.8, 2_380_000, 0, 0),
    ],
  },
  execution: {
    totalAccountValue: 19_575_327,
    lastUpdated: "2026-05-25T12:00:00.000Z",
    overallSharpeRatio: 0.7,
    portfolioVolatility: 11.4,
    assetClasses: [
      buildAssetClass("equities", "Equities", "#29b6f6", 78, 75, -5.1, 15_268_755, 62, 0.6),
      buildAssetClass("bonds", "Bonds", "#7b83ef", 12, 15, 2.8, 2_349_039, 14, 0.4),
      buildAssetClass("cash", "Cash", "#a87ce2", 10, 10, 1.2, 1_957_533, 8, 1.8),
      buildAssetClass("alternatives", "Alternatives", "#6a895e", 0, 0, 0, 0, 0, 0),
      buildAssetClass("others", "Others", "#ae9b9b", 0, 0, 0, 0, 0, 0),
    ],
    sectors: [
      buildAssetClass("technology", "Technology", "#2563eb", 22, 22, 12.4, 4_306_572, 0, 0),
      buildAssetClass("healthcare", "Healthcare", "#16a34a", 28, 28, 8.1, 5_481_092, 0, 0),
      buildAssetClass("finance", "Finance", "#ca8a04", 15, 15, 4.5, 2_936_299, 0, 0),
      buildAssetClass("industries", "Industries", "#ea580c", 12, 12, -2.3, 2_349_039, 0, 0),
      buildAssetClass("consumer", "Consumer", "#9333ea", 11, 11, 1.8, 2_153_286, 0, 0),
      buildAssetClass("others", "Others", "#db2777", 12, 12, 0.6, 2_349_039, 0, 0),
    ],
    currencies: [
      buildAssetClass("usd", "USD", "#ccabff", 55, 55, -5.1, 10_766_430, 0, 0),
      buildAssetClass("eur", "EUR", "#f6ae29", 30, 30, 1.4, 5_872_598, 0, 0),
      buildAssetClass("gbp", "GBP", "#ff87bf", 15, 15, 0.8, 2_936_299, 0, 0),
    ],
  },
  retirement: {
    totalAccountValue: 4_875_327,
    lastUpdated: "2026-05-25T12:00:00.000Z",
    overallSharpeRatio: 0.85,
    portfolioVolatility: 6.5,
    assetClasses: [
      buildAssetClass("equities", "Equities", "#29b6f6", 50, 50, 10.4, 2_437_664, 38, 0.9),
      buildAssetClass("bonds", "Bonds", "#7b83ef", 45, 45, 3.6, 2_193_897, 35, 0.6),
      buildAssetClass("cash", "Cash", "#a87ce2", 5, 5, 1.8, 243_766, 5, 2.0),
      buildAssetClass("alternatives", "Alternatives", "#6a895e", 0, 0, 0, 0, 0, 0),
      buildAssetClass("others", "Others", "#ae9b9b", 0, 0, 0, 0, 0, 0),
    ],
    currencies: [
      buildAssetClass("usd", "USD", "#ccabff", 88, 88, 10.4, 4_290_288, 0, 0),
      buildAssetClass("eur", "EUR", "#f6ae29", 12, 12, 2.2, 585_039, 0, 0),
    ],
  },
};

export function useAssetAllocationsData(
  portfolioId: PortfolioId = "all",
): UseAssetAllocationsDataResult {
  const data = ALLOCATION_BY_PORTFOLIO[portfolioId] ?? ALLOCATION_BY_PORTFOLIO.all;

  return {
    data,
    loading: false,
    error: null,
  };
}
