import type { PortfolioId } from "@/types/wealth";
import type { AllAllocationMode } from "@/context/DashboardPortfolioContext";
import { getPortfolioSummary } from "@/hooks/useHomeV2HomeData";

export interface HomeV2HoldingCard {
  name: string;
  value: number;
  change: number;
}

export interface HomeV2AllocationRow {
  name: string;
  color: string;
  percent: number;
  value: number;
  change: number;
}

export type HomeV2SecondaryAllocation = "currency" | "sector";
export type HomeV2SecondaryAllocationLabel = "CURRENCY" | "SECTOR" | "MANDATE" | "GLIDE PATH";

/** Top holdings aggregated across portfolios */
const HOLDINGS_ALL: HomeV2HoldingCard[] = [
  { name: "Vanguard Target Retirement 2045", value: 3_420_000, change: 7.2 },
  { name: "iShares Core US Aggregate Bond", value: 2_975_000, change: 2.1 },
  { name: "Vanguard FTSE All-World UCITS", value: 2_125_000, change: 11.4 },
  { name: "Global Equity Index Fund", value: 1_856_877, change: 9.1 },
  { name: "SPDR Bloomberg IG Corporate Bond", value: 1_450_000, change: 1.8 },
  { name: "Meta Platforms (META)", value: 563_613, change: -2.3 },
  { name: "Apple Inc (AAPL)", value: 412_800, change: 8.1 },
  { name: "Investment Grade Bond Fund", value: 980_000, change: 1.8 },
];

/** Active US trading book — 14 individual names + ETF */
const HOLDINGS_EXECUTION: HomeV2HoldingCard[] = [
  { name: "Meta Platforms (META)", value: 563_613, change: -2.3 },
  { name: "Apple Inc (AAPL)", value: 412_800, change: 8.1 },
  { name: "Invesco QQQ Trust", value: 267_614, change: 17.8 },
  { name: "Microsoft Corp (MSFT)", value: 281_303, change: 12.0 },
  { name: "Nvidia Corp (NVDA)", value: 245_600, change: 22.4 },
  { name: "Amazon.com (AMZN)", value: 198_400, change: -1.2 },
  { name: "Tesla Inc (TSLA)", value: 187_500, change: -3.1 },
  { name: "JPMorgan Chase (JPM)", value: 156_200, change: 4.5 },
  { name: "UnitedHealth (UNH)", value: 142_800, change: 6.8 },
  { name: "Eli Lilly (LLY)", value: 128_500, change: 18.2 },
  { name: "Johnson & Johnson (JNJ)", value: 98_400, change: 2.1 },
  { name: "Caterpillar (CAT)", value: 87_300, change: 5.4 },
  { name: "Exxon Mobil (XOM)", value: 76_500, change: -4.8 },
  { name: "Visa Inc (V)", value: 68_200, change: 7.3 },
];

/** Model-portfolio mandate holdings — ETFs + bonds, no stock picking */
const HOLDINGS_ADVISORY: HomeV2HoldingCard[] = [
  { name: "iShares Core US Aggregate Bond", value: 2_975_000, change: 2.1 },
  { name: "Vanguard FTSE All-World UCITS", value: 2_125_000, change: 11.4 },
  { name: "SPDR Bloomberg IG Corporate Bond", value: 1_450_000, change: 1.8 },
  { name: "iShares Core MSCI Europe", value: 780_000, change: 5.2 },
  { name: "Vanguard Total Bond Market ETF", value: 520_000, change: 1.4 },
  { name: "iShares MSCI Emerging Markets", value: 345_000, change: -2.8 },
  { name: "Cash & equivalents", value: 305_000, change: 0.3 },
];

/** Target-date fund heavy — simple fund-based book */
const HOLDINGS_RETIREMENT: HomeV2HoldingCard[] = [
  { name: "Vanguard Target Retirement 2045", value: 3_420_000, change: 7.2 },
  { name: "Global Equity Index Fund", value: 1_856_877, change: 9.1 },
  { name: "Investment Grade Bond Fund", value: 980_000, change: 1.8 },
  { name: "Stable Value Fund", value: 420_000, change: 0.6 },
  { name: "Cash reserve", value: 180_000, change: 0.2 },
];

const HOLDINGS_VISIBLE_LIMIT: Record<PortfolioId, number> = {
  all: 5,
  execution: 14,
  advisory: 5,
  retirement: 5,
};

function assetClassFor(portfolioId: PortfolioId, total: number): HomeV2AllocationRow[] {
  const val = (share: number) => Math.round(total * share * 100) / 100;

  if (portfolioId === "advisory") {
    return [
      { name: "Equities", color: "#29b6f6", percent: 38, value: val(0.38), change: 11.2 },
      { name: "Bonds", color: "#466edd", percent: 35, value: val(0.35), change: 2.1 },
      { name: "Cash", color: "#815f9b", percent: 27, value: val(0.27), change: 0.3 },
    ];
  }
  if (portfolioId === "execution") {
    return [
      { name: "Equities", color: "#29b6f6", percent: 72, value: val(0.72), change: -9.4 },
      { name: "Bonds", color: "#466edd", percent: 8, value: val(0.08), change: 1.2 },
      { name: "Cash", color: "#815f9b", percent: 20, value: val(0.2), change: 0.1 },
    ];
  }
  if (portfolioId === "retirement") {
    return [
      { name: "Equities", color: "#29b6f6", percent: 55, value: val(0.55), change: 8.4 },
      { name: "Bonds", color: "#466edd", percent: 32, value: val(0.32), change: 1.9 },
      { name: "Cash", color: "#815f9b", percent: 13, value: val(0.13), change: 0.2 },
    ];
  }
  return [
    { name: "Equities", color: "#29b6f6", percent: 48, value: val(0.48), change: 14.2 },
    { name: "Bonds", color: "#466edd", percent: 28, value: val(0.28), change: 2.8 },
    { name: "Cash", color: "#815f9b", percent: 24, value: val(0.24), change: 0.4 },
  ];
}

function currencyRows(total: number): HomeV2AllocationRow[] {
  return [
    { name: "USD", color: "#ad84eb", percent: 62, value: total * 0.62, change: 12.1 },
    { name: "EUR", color: "#f3a616", percent: 28, value: total * 0.28, change: 4.3 },
    { name: "GBP", color: "#f263a6", percent: 10, value: total * 0.1, change: -1.2 },
  ];
}

/** Sector weights derived from Execution US stock book */
function executionSectorRows(total: number): HomeV2AllocationRow[] {
  return [
    { name: "Technology", color: "#ad84eb", percent: 38, value: total * 0.38, change: -4.2 },
    { name: "Healthcare", color: "#f263a6", percent: 11, value: total * 0.11, change: 8.9 },
    { name: "Consumer", color: "#f3a616", percent: 9, value: total * 0.09, change: -2.0 },
    { name: "Finance", color: "#466edd", percent: 8, value: total * 0.08, change: 5.8 },
    { name: "Industrials", color: "#29b6f6", percent: 6, value: total * 0.06, change: 5.4 },
    { name: "Energy", color: "#815f9b", percent: 4, value: total * 0.04, change: -4.8 },
  ];
}

function aggregatedSectorRows(total: number): HomeV2AllocationRow[] {
  return [
    { name: "Technology", color: "#ad84eb", percent: 28, value: total * 0.28, change: 18.4 },
    { name: "Healthcare", color: "#f263a6", percent: 14, value: total * 0.14, change: 6.2 },
    { name: "Finance", color: "#466edd", percent: 18, value: total * 0.18, change: 8.1 },
    { name: "Industrials", color: "#29b6f6", percent: 12, value: total * 0.12, change: 3.4 },
    { name: "Consumer", color: "#f3a616", percent: 10, value: total * 0.1, change: -2.1 },
  ];
}

/** Mandate sleeve breakdown for advisory compliance */
function advisoryMandateRows(total: number): HomeV2AllocationRow[] {
  return [
    { name: "US Equity", color: "#29b6f6", percent: 28, value: total * 0.28, change: 11.4 },
    { name: "Intl Equity", color: "#ad84eb", percent: 10, value: total * 0.1, change: 5.2 },
    { name: "IG Bonds", color: "#466edd", percent: 35, value: total * 0.35, change: 2.1 },
    { name: "Cash", color: "#815f9b", percent: 27, value: total * 0.27, change: 0.3 },
  ];
}

/** Glide-path milestones for retirement target-date plan */
function retirementGlidePathRows(total: number): HomeV2AllocationRow[] {
  return [
    { name: "Current (2045 plan)", color: "#29b6f6", percent: 55, value: total * 0.55, change: 8.4 },
    { name: "2030 auto-shift", color: "#466edd", percent: 52, value: total * 0.52, change: 6.2 },
    { name: "At retirement (2045)", color: "#815f9b", percent: 50, value: total * 0.5, change: 5.0 },
  ];
}

export const HOME_V2_PORTFOLIO_NAV: {
  id: PortfolioId;
  label: string;
  change: number;
}[] = [
  { id: "all", label: "All portfolios", change: 17.62 },
  { id: "advisory", label: "Advisory", change: 9.12 },
  { id: "execution", label: "Execution US", change: -7.63 },
  { id: "retirement", label: "Retirement 01", change: 6.61 },
];

function secondaryAllocationFor(
  portfolioId: PortfolioId,
  allMode: AllAllocationMode,
): HomeV2SecondaryAllocation {
  if (portfolioId === "all") {
    return allMode;
  }
  return "sector";
}

function holdingsFor(portfolioId: PortfolioId): HomeV2HoldingCard[] {
  switch (portfolioId) {
    case "execution":
      return HOLDINGS_EXECUTION;
    case "advisory":
      return HOLDINGS_ADVISORY;
    case "retirement":
      return HOLDINGS_RETIREMENT;
    default:
      return HOLDINGS_ALL;
  }
}

function secondaryRowsFor(
  portfolioId: PortfolioId,
  allMode: AllAllocationMode,
  total: number,
): { rows: HomeV2AllocationRow[]; label: HomeV2SecondaryAllocationLabel } {
  if (portfolioId === "all") {
    const mode = allMode;
    return {
      rows: mode === "currency" ? currencyRows(total) : aggregatedSectorRows(total),
      label: mode === "currency" ? "CURRENCY" : "SECTOR",
    };
  }
  if (portfolioId === "advisory") {
    return { rows: advisoryMandateRows(total), label: "MANDATE" };
  }
  if (portfolioId === "retirement") {
    return { rows: retirementGlidePathRows(total), label: "GLIDE PATH" };
  }
  return { rows: executionSectorRows(total), label: "SECTOR" };
}

export function useHomeV2SecondaryAllocation(
  portfolioId: PortfolioId,
  allMode: AllAllocationMode = "currency",
): HomeV2SecondaryAllocation {
  return secondaryAllocationFor(portfolioId, allMode);
}

export function useHomeV2Holdings(portfolioId: PortfolioId): HomeV2HoldingCard[] {
  return holdingsFor(portfolioId);
}

export function useHomeV2HoldingsVisibleLimit(portfolioId: PortfolioId): number {
  return HOLDINGS_VISIBLE_LIMIT[portfolioId];
}

export function useHomeV2HoldingsDisplay(portfolioId: PortfolioId): {
  holdings: HomeV2HoldingCard[];
  totalCount: number;
  visibleCount: number;
  hasMore: boolean;
} {
  const all = holdingsFor(portfolioId);
  const limit = HOLDINGS_VISIBLE_LIMIT[portfolioId];
  return {
    holdings: all.slice(0, limit),
    totalCount: all.length,
    visibleCount: Math.min(limit, all.length),
    hasMore: all.length > limit,
  };
}

export function useHomeV2AllocationRows(
  portfolioId: PortfolioId,
  allMode: AllAllocationMode = "currency",
): {
  assetClass: HomeV2AllocationRow[];
  secondary: HomeV2AllocationRow[];
  secondaryLabel: HomeV2SecondaryAllocationLabel;
} {
  const total = getPortfolioSummary(portfolioId).value;
  const secondary = secondaryRowsFor(portfolioId, allMode, total);
  return {
    assetClass: assetClassFor(portfolioId, total),
    secondary: secondary.rows,
    secondaryLabel: secondary.label,
  };
}

export function useHomeV2OrdersVisibleLimit(portfolioId: PortfolioId): number {
  switch (portfolioId) {
    case "execution":
      return 10;
    case "all":
      return 4;
    case "retirement":
      return 2;
    case "advisory":
      return 3;
    default:
      return 10;
  }
}

/** @deprecated Use useHomeV2OrdersVisibleLimit — kept for callers checking "all" subset */
export function useHomeV2ShowAllOrders(portfolioId: PortfolioId): boolean {
  return portfolioId === "all" || portfolioId === "execution";
}
