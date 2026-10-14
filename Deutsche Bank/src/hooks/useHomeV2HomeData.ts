import type { PortfolioId } from "@/types/wealth";

export type AttentionTier = "urgent" | "watch" | "positive";
export type HomeV2ContentFocus = "orders" | "performance" | "holdings" | "allocation" | "rebalance";

export interface AttentionItem {
  id: string;
  tier: AttentionTier;
  title: string;
  description: string;
  actionLabel?: string;
  portfolioId?: PortfolioId;
  focus?: HomeV2ContentFocus;
}

export interface PortfolioSummaryCard {
  id: PortfolioId;
  label: string;
  value: number;
  changeYtd: number;
}

export interface PortfolioInsight {
  headline: string;
  summary: string;
  primaryAction: { label: string; focus: HomeV2ContentFocus };
  secondaryAction: { label: string; focus: HomeV2ContentFocus };
}

export interface PortfolioMetrics {
  marketValue: number;
  netAssetValue: number;
  liabilities: number;
  cash: number;
  availableBorrowing: number;
}

/** NAV + liabilities = market value for every portfolio */
const PORTFOLIO_METRICS: Record<PortfolioId, PortfolioMetrics> = {
  all: {
    marketValue: 19_575_327,
    netAssetValue: 8_199_731,
    liabilities: 11_375_596,
    cash: 232_046,
    availableBorrowing: 4_850_000,
  },
  advisory: {
    marketValue: 8_500_000,
    netAssetValue: 5_950_000,
    liabilities: 2_550_000,
    cash: 105_000,
    availableBorrowing: 1_700_000,
  },
  execution: {
    marketValue: 4_218_450,
    netAssetValue: 2_843_450,
    liabilities: 1_375_000,
    cash: 95_000,
    availableBorrowing: 725_000,
  },
  retirement: {
    marketValue: 6_856_877,
    netAssetValue: 6_856_877,
    liabilities: 0,
    cash: 600_000,
    availableBorrowing: 0,
  },
};

/** Single source of truth — all figures reconcile across Home + portfolio views */
export const HOME_V2_TOTAL_WEALTH = 19_575_327;
export const HOME_V2_MTD_CHANGE = 8.9;
export const HOME_V2_YTD_CHANGE_ALL = 17.62;

export const HOME_V2_PORTFOLIO_SUMMARIES: PortfolioSummaryCard[] = [
  { id: "all", label: "All portfolios", value: 19_575_327, changeYtd: 17.62 },
  { id: "advisory", label: "Advisory portfolio", value: 8_500_000, changeYtd: 9.12 },
  { id: "execution", label: "Execution portfolio", value: 4_218_450, changeYtd: -7.63 },
  { id: "retirement", label: "Retirement portfolio", value: 6_856_877, changeYtd: 6.61 },
];

export const HOME_V2_ATTENTION_ITEMS: AttentionItem[] = [
  {
    id: "rebalance",
    tier: "urgent",
    title: "Advisory rebalancing available",
    description: "Bond allocation is 2% below target. Review within 45 days.",
    actionLabel: "Review",
    portfolioId: "advisory",
    focus: "rebalance",
  },
  {
    id: "orders",
    tier: "urgent",
    title: "2 standing orders pending",
    description: "SAP SE sell and iShares MSCI World buy awaiting execution.",
    actionLabel: "View orders",
    portfolioId: "all",
    focus: "orders",
  },
  {
    id: "contribution",
    tier: "urgent",
    title: "Retirement contribution is due",
    description: "Monthly $5,000 contribution is due in 8 days.",
    actionLabel: "Details",
    portfolioId: "retirement",
    focus: "performance",
  },
  {
    id: "meta",
    tier: "watch",
    title: "Meta position down 2.3%",
    description: "Execution portfolio · Consider rebalancing or tax-loss harvest.",
    actionLabel: "Review",
    portfolioId: "execution",
    focus: "holdings",
  },
  {
    id: "retirement-track",
    tier: "positive",
    title: "On track for retirement goal",
    description: "Projected $20.5M vs $19M target, 7% surplus at current pace.",
    portfolioId: "retirement",
    focus: "performance",
  },
];

const PORTFOLIO_INSIGHTS: Record<PortfolioId, PortfolioInsight> = {
  all: {
    headline: "Strong year, two items need your attention",
    summary:
      "Up 17.62% YTD — US equities contributed most of the gain (+4.2pp vs benchmark). Two standing orders are awaiting your approval before market close.",
    primaryAction: { label: "To orders", focus: "orders" },
    secondaryAction: { label: "To allocations", focus: "allocation" },
  },
  advisory: {
    headline: "Drift detected in bond allocation",
    summary:
      "Advisory portfolio is up 9.12% YTD but bonds sit 2% below target. Approving the rebalance proposal keeps risk aligned with your mandate.",
    primaryAction: { label: "Review proposal", focus: "rebalance" },
    secondaryAction: { label: "View allocation", focus: "allocation" },
  },
  execution: {
    headline: "Pullback driven by tech concentration",
    summary:
      "Execution US is down 7.63% YTD. Meta (−2.3% this week) and broader US tech weigh on results — tax-loss harvesting may offset gains elsewhere.",
    primaryAction: { label: "To holdings", focus: "holdings" },
    secondaryAction: { label: "To performance", focus: "performance" },
  },
  retirement: {
    headline: "On track — surplus building ahead of plan",
    summary:
      "Retirement 01 is up 6.61% YTD. At current pace you reach $20.5M vs a $19M target. Your $5,000 monthly contribution is due in 8 days.",
    primaryAction: { label: "Confirm contribution", focus: "performance" },
    secondaryAction: { label: "View allocation", focus: "allocation" },
  },
};

const PORTFOLIO_TITLES: Record<PortfolioId, string> = {
  all: "All portfolios",
  advisory: "Advisory portfolio",
  execution: "Execution US",
  retirement: "Retirement 01",
};

export function useHomeV2AttentionItems() {
  return HOME_V2_ATTENTION_ITEMS;
}

export function useHomeV2PortfolioSummaries() {
  return HOME_V2_PORTFOLIO_SUMMARIES;
}

export function getPortfolioSummary(id: PortfolioId): PortfolioSummaryCard {
  return HOME_V2_PORTFOLIO_SUMMARIES.find((p) => p.id === id) ?? HOME_V2_PORTFOLIO_SUMMARIES[0];
}

export function getPortfolioTitle(id: PortfolioId): string {
  return PORTFOLIO_TITLES[id];
}

export function getPortfolioInsight(id: PortfolioId): PortfolioInsight {
  return PORTFOLIO_INSIGHTS[id];
}

export function getPortfolioMetrics(id: PortfolioId): PortfolioMetrics {
  return PORTFOLIO_METRICS[id];
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning, Nick";
  if (hour < 17) return "Good afternoon, Nick";
  return "Good evening, Nick";
}
