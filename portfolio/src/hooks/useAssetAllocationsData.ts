import type { AssetAllocationData } from "@/types/assetAllocations";

export interface UseAssetAllocationsDataResult {
  data: AssetAllocationData | null;
  loading: boolean;
  error: string | null;
}

/**
 * Mock account allocation — targets sum to 100%; currents sum to 100%.
 * Level 2 main label uses targetAllocation; bar + sub-label use currentAllocation.
 */
const MOCK_DATA: AssetAllocationData = {
  totalAccountValue: 2_050_000,
  lastUpdated: "2026-05-25T12:00:00.000Z",
  overallSharpeRatio: 0.9,
  portfolioVolatility: 9.2,
  assetClasses: [
    {
      id: "equities",
      name: "Equities",
      color: "#6AB4E7",
      currentAllocation: 27,
      targetAllocation: 35,
      ytdReturn: 8.2,
      dollarContribution: 245_000,
      volatilityContribution: 43,
      sharpeRatio: 0.8,
    },
    {
      id: "money-market",
      name: "Money Market",
      color: "#63C4A4",
      currentAllocation: 21,
      targetAllocation: 25,
      ytdReturn: 4.2,
      dollarContribution: 72_000,
      volatilityContribution: 11,
      sharpeRatio: 2.1,
    },
    {
      id: "alternatives",
      name: "Alternatives",
      color: "#DCEE83",
      currentAllocation: 24,
      targetAllocation: 20,
      ytdReturn: 6.5,
      dollarContribution: 58_000,
      volatilityContribution: 20,
      sharpeRatio: 0.6,
    },
    {
      id: "fixed-income",
      name: "Fixed Income",
      color: "#A998E9",
      currentAllocation: 25,
      targetAllocation: 18,
      ytdReturn: 3.1,
      dollarContribution: 12_000,
      volatilityContribution: 17,
      sharpeRatio: 0.5,
    },
    {
      id: "others",
      name: "Others",
      color: "#F19DE7",
      currentAllocation: 3,
      targetAllocation: 2,
      ytdReturn: 0,
      dollarContribution: 2_500,
      volatilityContribution: 9,
      sharpeRatio: 0,
    },
  ],
};

/**
 * Returns mock asset allocation data for the account-wide view.
 * Resolves immediately with no async delay.
 */
export function useAssetAllocationsData(): UseAssetAllocationsDataResult {
  return {
    data: MOCK_DATA,
    loading: false,
    error: null,
  };
}
