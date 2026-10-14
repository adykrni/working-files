import { useMemo } from "react";
import type { PortfolioId } from "@/types/wealth";
import { useWealthData } from "./useWealthData";

export interface PortfolioSummary {
  id: PortfolioId;
  name: string;
  shortName: string;
  value: number;
  currency: string;
  changePercentage: number;
  ytdPerformance: number;
}

const SHORT_NAMES: Record<PortfolioId, string> = {
  all: "All",
  advisory: "Advisory",
  execution: "Execution",
  retirement: "Retirement",
};

function ytdForPortfolio(id: PortfolioId, details: ReturnType<typeof useWealthData>["details"]): number {
  switch (id) {
    case "advisory":
      return details.advisory?.ytdPerformance ?? 0;
    case "execution":
      return details.execution?.ytdReturn ?? 0;
    case "retirement":
      return details.retirement?.ytdReturn ?? 0;
    default:
      return details.allPortfolios?.ytdPerformance ?? 0;
  }
}

export function usePortfolioSummary(portfolioId: PortfolioId): PortfolioSummary {
  const wealth = useWealthData();

  return useMemo(() => {
    const portfolio =
      wealth.portfolios.find((item) => item.id === portfolioId) ?? wealth.portfolios[0];

    return {
      id: portfolioId,
      name: portfolio.name,
      shortName: SHORT_NAMES[portfolioId],
      value: portfolio.value,
      currency: portfolio.currency,
      changePercentage: portfolio.changePercentage,
      ytdPerformance: ytdForPortfolio(portfolioId, wealth.details),
    };
  }, [portfolioId, wealth]);
}

export function usePortfolioSummaries(): PortfolioSummary[] {
  const wealth = useWealthData();

  return useMemo(
    () =>
      (["all", "advisory", "execution", "retirement"] as PortfolioId[]).map((id) => {
        const portfolio = wealth.portfolios.find((item) => item.id === id)!;
        return {
          id,
          name: portfolio.name,
          shortName: SHORT_NAMES[id],
          value: portfolio.value,
          currency: portfolio.currency,
          changePercentage: portfolio.changePercentage,
          ytdPerformance: ytdForPortfolio(id, wealth.details),
        };
      }),
    [wealth],
  );
}
