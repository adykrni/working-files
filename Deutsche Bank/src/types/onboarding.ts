export type OnboardingStepId = "login" | "portfolios" | "content" | "net-wealth";

export type PortfolioOptionId =
  | "advisory"
  | "execution"
  | "retirement"
  | "execution-apac";

export interface PortfolioOption {
  id: PortfolioOptionId;
  label: string;
  value: number;
}

export const PORTFOLIO_OPTIONS: PortfolioOption[] = [
  { id: "advisory", label: "Advisory portfolio", value: 8_500_000 },
  { id: "execution", label: "Execution portfolio", value: 8_500_000 },
  { id: "retirement", label: "Retirement portfolio", value: 8_500_000 },
  { id: "execution-apac", label: "Execution portfolio APAC", value: 8_500_000 },
];

export const CONTENT_FORMAT_OPTIONS = [
  "Articles",
  "Videos",
  "Podcasts",
  "Events",
] as const;

export const CONTENT_INTEREST_OPTIONS = [
  "Asset allocations",
  "Investment ideas",
  "Market news",
  "Expert analysis",
  "Macro trends",
  "Long term strategies",
  "Regional updates",
] as const;

export const CONTENT_EXPLORE_OPTIONS = [
  "Fintech",
  "Technology",
  "Utilities",
  "Healthcare",
  "Biotech",
  "Energy",
  "Industrial",
  "Materials",
  "Consumer discretionary",
] as const;

export type ContentFormat = (typeof CONTENT_FORMAT_OPTIONS)[number];
export type ContentInterest = (typeof CONTENT_INTEREST_OPTIONS)[number];
export type ContentExplore = (typeof CONTENT_EXPLORE_OPTIONS)[number];

export const ONBOARDING_CARD_SHADOW =
  "0px 1px 4px 0px rgba(137,146,161,0.1), 0px 2px 10px -1px rgba(137,146,161,0.3), 0px 0px 0px 0.5px rgba(137,146,161,0.8)";

export const ONBOARDING_INPUT_SHADOW =
  "0px 1px 4px 0px rgba(137,146,161,0.1), 0px 1px 0px -1px rgba(137,146,161,0.8), 0px 0px 0px 0.5px rgba(137,146,161,0.8)";
