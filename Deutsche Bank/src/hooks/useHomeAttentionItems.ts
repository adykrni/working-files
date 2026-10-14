export type HomeAttentionVariant = "action" | "info" | "warning" | "success";

export interface HomeAttentionItem {
  id: string;
  title: string;
  detail: string;
  variant: HomeAttentionVariant;
  actionLabel?: string;
  href?: string;
}

export interface UseHomeAttentionItemsResult {
  items: HomeAttentionItem[];
}

/** Curated inbox-style items for the home landing */
export function useHomeAttentionItems(): UseHomeAttentionItemsResult {
  return {
    items: [
      {
        id: "rebalance",
        title: "Advisory rebalancing available",
        detail: "Bond allocation is 2% below target · Review within 45 days",
        variant: "action",
        actionLabel: "Review",
        href: "/dashboardv2",
      },
      {
        id: "orders",
        title: "2 standing orders pending",
        detail: "SAP SE sell and iShares MSCI World buy awaiting execution",
        variant: "warning",
        actionLabel: "View orders",
        href: "/dashboardv2",
      },
      {
        id: "retirement",
        title: "Retirement contribution due",
        detail: "Monthly $5,000 contribution due in 8 days",
        variant: "info",
        actionLabel: "Details",
        href: "/dashboardv2",
      },
      {
        id: "meta",
        title: "Meta position down 12.3%",
        detail: "Execution portfolio · Consider rebalancing or tax-loss harvest",
        variant: "warning",
        href: "/dashboardv2",
      },
      {
        id: "goals",
        title: "On track for retirement goal",
        detail: "Projected $20.5M vs $19M target · 7% surplus at current pace",
        variant: "success",
      },
    ],
  };
}
