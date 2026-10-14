import type { AllAllocationMode } from "@/context/DashboardPortfolioContext";
import type { HomeV2ContentFocus } from "@/hooks/useHomeV2HomeData";
import type { PortfolioId } from "@/types/wealth";

export type AllocationInsightStatus = "urgent" | "watch" | "positive";

export interface AllocationDriftItem {
  name: string;
  current: number;
  target: number;
  color: string;
}

export interface AllocationInsightAction {
  label: string;
  focus?: HomeV2ContentFocus;
  /** Switch secondary breakdown lens (All portfolios only) */
  lens?: AllAllocationMode;
}

export interface AllocationInsight {
  status: AllocationInsightStatus;
  statusLabel: string;
  headline: string;
  summary: string;
  /** What the user can do — ties insight to a concrete outcome */
  implication: string;
  drifts: AllocationDriftItem[];
  primaryAction: AllocationInsightAction;
  secondaryAction: AllocationInsightAction;
  /** All portfolios: user picks currency vs sector breakdown */
  showLensToggle: boolean;
}

const STATUS_STYLES: Record<
  AllocationInsightStatus,
  { dot: string; text: string; bg: string }
> = {
  urgent: { dot: "#e95252", text: "#d72735", bg: "#fef2f2" },
  watch: { dot: "#f19317", text: "#b45309", bg: "#fffbeb" },
  positive: { dot: "#39c67c", text: "#11810d", bg: "#f0fdf4" },
};

export function allocationInsightStatusStyles(status: AllocationInsightStatus) {
  return STATUS_STYLES[status];
}

export function getAllocationInsight(
  portfolioId: PortfolioId,
  allMode: AllAllocationMode,
): AllocationInsight {
  if (portfolioId === "all") {
    if (allMode === "currency") {
      return {
        status: "watch",
        statusLabel: "FX concentration",
        headline: "USD exposure is above your comfort range",
        summary:
          "62% of total wealth is denominated in USD. A stronger dollar or US-only downturn would affect most of your holdings at once.",
        implication:
          "You can hedge FX risk, rebalance into EUR/GBP, or review whether this matches your spending currency.",
        drifts: [
          { name: "USD", current: 62, target: 55, color: "#ad84eb" },
          { name: "EUR", current: 28, target: 32, color: "#f3a616" },
        ],
        primaryAction: { label: "Review FX exposure", focus: "rebalance" },
        secondaryAction: { label: "View by sector", lens: "sector" },
        showLensToggle: true,
      };
    }
    return {
      status: "watch",
      statusLabel: "Sector concentration",
      headline: "Technology is your largest sector weight",
      summary:
        "Technology at 28% spans Execution US single names and advisory ETF sleeves. It contributed +18.4% YTD but adds single-sector risk.",
      implication:
        "You can trim overweight sectors, review underlying holdings, or accept the risk if it fits your mandate.",
      drifts: [{ name: "Technology", current: 28, target: 22, color: "#ad84eb" }],
      primaryAction: { label: "Review sector holdings", focus: "holdings" },
      secondaryAction: { label: "View by currency", lens: "currency" },
      showLensToggle: true,
    };
  }

  if (portfolioId === "advisory") {
    return {
      status: "urgent",
      statusLabel: "Rebalance due",
      headline: "Bond sleeve has drifted below mandate target",
      summary:
        "Your advisory mandate targets 40% investment-grade bonds. Current IG weight is 35% after the equity rally — US Equity and Intl Equity are within tolerance.",
      implication:
        "Approving the CIO rebalance proposal restores mandate compliance and keeps income stability on track.",
      drifts: [
        { name: "IG Bonds", current: 35, target: 40, color: "#466edd" },
        { name: "US Equity", current: 28, target: 30, color: "#29b6f6" },
      ],
      primaryAction: { label: "Review rebalance proposal", focus: "rebalance" },
      secondaryAction: { label: "To holdings", focus: "holdings" },
      showLensToggle: false,
    };
  }

  if (portfolioId === "execution") {
    return {
      status: "watch",
      statusLabel: "Sector concentration",
      headline: "Technology at 38% — Meta weighs on YTD",
      summary:
        "14 US names drive the book. Tech (META, AAPL, MSFT, NVDA, QQQ) is 6% above your 32% comfort band. Healthcare and Finance are balanced; 6 pending orders need attention.",
      implication:
        "You can trim Meta and QQQ, add to Healthcare laggards, or review the 6 open orders before market close.",
      drifts: [
        { name: "Technology", current: 38, target: 32, color: "#ad84eb" },
        { name: "Healthcare", current: 11, target: 12, color: "#f263a6" },
      ],
      primaryAction: { label: "Review open orders", focus: "orders" },
      secondaryAction: { label: "To holdings", focus: "holdings" },
      showLensToggle: false,
    };
  }

  return {
    status: "positive",
    statusLabel: "On glide path",
    headline: "2045 target-date plan is on track",
    summary:
      "55% equities / 32% bonds / 13% cash matches your age-based glide path. YTD return is +6.61% with surplus building ahead of the $19M goal.",
    implication:
      "No rebalance needed. Confirm your monthly auto-invest contribution to stay on track toward retirement.",
    drifts: [
      { name: "Equity sleeve", current: 55, target: 55, color: "#29b6f6" },
      { name: "Bond sleeve", current: 32, target: 33, color: "#466edd" },
    ],
    primaryAction: { label: "Confirm contribution", focus: "orders" },
    secondaryAction: { label: "View glide path", focus: "allocation" },
    showLensToggle: false,
  };
}
