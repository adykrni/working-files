import type { AllAllocationMode } from "@/context/DashboardPortfolioContext";
import type { HomeV2ContentFocus } from "@/hooks/useHomeV2HomeData";
import type { PortfolioId } from "@/types/wealth";

export interface CioDriftBar {
  name: string;
  current: number;
  target: number;
  color: string;
  barColor?: string;
}

export interface CioInsightAction {
  label: string;
  focus?: HomeV2ContentFocus;
  lens?: AllAllocationMode;
}

export interface CioInsightSlide {
  headline: string;
  drift?: CioDriftBar;
  body: string;
  primaryAction: CioInsightAction;
  secondaryAction: CioInsightAction;
}

export function getCioInsightSlides(
  portfolioId: PortfolioId,
  allMode: AllAllocationMode = "currency",
): CioInsightSlide[] {
  if (portfolioId === "all") {
    return [
      {
        headline: "USD at 62% — FX concentration risk",
        drift: {
          name: "USD",
          current: 62,
          target: 55,
          color: "#ad84eb",
          barColor: "#6ab4e7",
        },
        body: "Most of your wealth is USD-denominated across advisory mandates and the Execution book. A dollar rally or US-only downturn would hit multiple portfolios at once.",
        primaryAction: { label: "Review FX exposure", focus: "allocation" },
        secondaryAction: { label: "View by sector", lens: "sector" },
      },
      {
        headline: "Technology at 28% across portfolios",
        drift: {
          name: "Technology",
          current: 28,
          target: 22,
          color: "#ad84eb",
          barColor: "#6ab4e7",
        },
        body: "Technology contributed +18.4% YTD but adds single-sector risk spanning Execution single names and advisory ETF sleeves. You might want to review underlying holdings.",
        primaryAction: { label: "Review holdings", focus: "holdings" },
        secondaryAction: { label: "View by currency", lens: "currency" },
      },
    ];
  }

  if (portfolioId === "advisory") {
    return [
      {
        headline: "IG Bonds 2% below mandate target",
        drift: {
          name: "IG Bonds",
          current: 35,
          target: 40,
          color: "#466edd",
          barColor: "#6ab4e7",
        },
        body: "Your advisory mandate targets 40% investment-grade bonds. The equity rally pushed IG to 35% — approving the CIO rebalance proposal restores compliance within 45 days.",
        primaryAction: { label: "Review rebalance proposal", focus: "rebalance" },
        secondaryAction: { label: "Download report", focus: "allocation" },
      },
      {
        headline: "Intl Equity sleeve within tolerance",
        drift: {
          name: "Intl Equity",
          current: 10,
          target: 12,
          color: "#ad84eb",
          barColor: "#6ab4e7",
        },
        body: "US Equity at 28% is on target. Intl Equity is slightly underweight but within mandate bands — no action required unless you want to add to the iShares Core MSCI Europe position.",
        primaryAction: { label: "Review holdings", focus: "holdings" },
        secondaryAction: { label: "Download report", focus: "allocation" },
      },
    ];
  }

  if (portfolioId === "execution") {
    return [
      {
        headline: "Technology at 38% - Meta weighs on YTD",
        drift: {
          name: "Technology",
          current: 28,
          target: 22,
          color: "#07132a",
          barColor: "#6ab4e7",
        },
        body: "Your technology holdings have contributed to +18.4% YTD but adds single-sector risk. You might want to review underlying holdings, and can trim overweight sectors.",
        primaryAction: { label: "Review holdings", focus: "holdings" },
        secondaryAction: { label: "Download report", focus: "allocation" },
      },
      {
        headline: "6 standing orders awaiting action",
        drift: {
          name: "Pending orders",
          current: 6,
          target: 0,
          color: "#07132a",
          barColor: "#1a69de",
        },
        body: "Six open orders across tech and healthcare names need your approval before market close. Two are rebalance-related sells flagged by CIO.",
        primaryAction: { label: "Review open orders", focus: "orders" },
        secondaryAction: { label: "Download report", focus: "allocation" },
      },
    ];
  }

  return [
    {
      headline: "On glide path — surplus ahead of plan",
      drift: {
        name: "Equity sleeve",
        current: 55,
        target: 55,
        color: "#29b6f6",
        barColor: "#6ab4e7",
      },
      body: "Your 2045 target-date allocation is on track. At current pace you reach $20.5M vs a $19M goal. One auto-invest contribution is scheduled this month.",
      primaryAction: { label: "Confirm contribution", focus: "orders" },
      secondaryAction: { label: "Download report", focus: "allocation" },
    },
    {
      headline: "Bond sleeve shifts down in 2030",
      drift: {
        name: "Bond sleeve",
        current: 32,
        target: 33,
        color: "#466edd",
        barColor: "#6ab4e7",
      },
      body: "The plan auto-reduces equity exposure as you approach 2045. No manual rebalance needed — your next glide-path milestone is 2030 at 52% equity.",
      primaryAction: { label: "View glide path", focus: "allocation" },
      secondaryAction: { label: "Download report", focus: "allocation" },
    },
  ];
}
