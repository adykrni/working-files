import type { StandingOrder, StandingOrdersData } from "@/types/standingOrders";
import type { PortfolioId } from "@/types/wealth";

export interface UseStandingOrdersDataResult {
  data: StandingOrdersData | null;
  loading: boolean;
  error: string | null;
  totalCount: number;
}

const EXECUTION_ORDERS: StandingOrder[] = [
  {
    id: "exec-1",
    security: "Meta Platforms (META)",
    quantity: 120,
    orderPrice: "512.40 USD",
    orderValue: 61_488,
    currency: "USD",
    status: "Pending",
    action: "SELL",
    portfolioId: "execution",
    portfolioLabel: "Execution",
  },
  {
    id: "exec-2",
    security: "Nvidia Corp (NVDA)",
    quantity: 85,
    orderPrice: "875.20 USD",
    orderValue: 74_392,
    currency: "USD",
    status: "Pending",
    action: "BUY",
    portfolioId: "execution",
    portfolioLabel: "Execution",
  },
  {
    id: "exec-3",
    security: "Apple Inc (AAPL)",
    quantity: 200,
    orderPrice: "198.50 USD",
    orderValue: 39_700,
    currency: "USD",
    status: "Pending",
    action: "BUY",
    portfolioId: "execution",
    portfolioLabel: "Execution",
  },
  {
    id: "exec-4",
    security: "Tesla Inc (TSLA)",
    quantity: 75,
    orderPrice: "245.00 USD",
    orderValue: 18_375,
    currency: "USD",
    status: "Filled",
    action: "SELL",
    portfolioId: "execution",
    portfolioLabel: "Execution",
  },
  {
    id: "exec-5",
    security: "UnitedHealth (UNH)",
    quantity: 40,
    orderPrice: "528.75 USD",
    orderValue: 21_150,
    currency: "USD",
    status: "Pending",
    action: "BUY",
    portfolioId: "execution",
    portfolioLabel: "Execution",
  },
  {
    id: "exec-6",
    security: "JPMorgan Chase (JPM)",
    quantity: 150,
    orderPrice: "198.30 USD",
    orderValue: 29_745,
    currency: "USD",
    status: "Filled",
    action: "BUY",
    portfolioId: "execution",
    portfolioLabel: "Execution",
  },
  {
    id: "exec-7",
    security: "Eli Lilly (LLY)",
    quantity: 25,
    orderPrice: "842.00 USD",
    orderValue: 21_050,
    currency: "USD",
    status: "Partial",
    action: "BUY",
    portfolioId: "execution",
    portfolioLabel: "Execution",
  },
  {
    id: "exec-8",
    security: "Exxon Mobil (XOM)",
    quantity: 300,
    orderPrice: "108.45 USD",
    orderValue: 32_535,
    currency: "USD",
    status: "Cancelled",
    action: "Reorder",
    portfolioId: "execution",
    portfolioLabel: "Execution",
  },
  {
    id: "exec-9",
    security: "Visa Inc (V)",
    quantity: 60,
    orderPrice: "278.90 USD",
    orderValue: 16_734,
    currency: "USD",
    status: "Pending",
    action: "BUY",
    portfolioId: "execution",
    portfolioLabel: "Execution",
  },
  {
    id: "exec-10",
    security: "Caterpillar (CAT)",
    quantity: 45,
    orderPrice: "342.60 USD",
    orderValue: 15_417,
    currency: "USD",
    status: "Filled",
    action: "BUY",
    portfolioId: "execution",
    portfolioLabel: "Execution",
  },
  {
    id: "exec-11",
    security: "Invesco QQQ Trust",
    quantity: 50,
    orderPrice: "445.20 USD",
    orderValue: 22_260,
    currency: "USD",
    status: "Pending",
    action: "SELL",
    portfolioId: "execution",
    portfolioLabel: "Execution",
  },
];

const ADVISORY_ORDERS: StandingOrder[] = [
  {
    id: "adv-1",
    security: "iShares Core US Aggregate Bond",
    quantity: 2_800,
    orderPrice: "98.45 USD",
    orderValue: 275_660,
    currency: "USD",
    status: "Pending",
    action: "BUY",
    portfolioId: "advisory",
    portfolioLabel: "Advisory",
  },
  {
    id: "adv-2",
    security: "Vanguard FTSE All-World UCITS",
    quantity: 1_200,
    orderPrice: "112.30 EUR",
    orderValue: 134_760,
    currency: "EUR",
    status: "Pending",
    action: "SELL",
    portfolioId: "advisory",
    portfolioLabel: "Advisory",
  },
  {
    id: "adv-3",
    security: "iShares MSCI Emerging Markets",
    quantity: 420,
    orderPrice: "58.765 EUR",
    orderValue: 24_681.3,
    currency: "EUR",
    status: "Filled",
    action: "BUY",
    portfolioId: "advisory",
    portfolioLabel: "Advisory",
  },
];

const RETIREMENT_ORDERS: StandingOrder[] = [
  {
    id: "ret-1",
    security: "Vanguard Target Retirement 2045",
    quantity: 180,
    orderPrice: "42.125 USD",
    orderValue: 7_582.5,
    currency: "USD",
    status: "Partial",
    action: "BUY",
    portfolioId: "retirement",
    portfolioLabel: "Retirement",
  },
];

const ALL_ORDERS: StandingOrder[] = [
  ...EXECUTION_ORDERS.slice(0, 3),
  ADVISORY_ORDERS[0],
  ADVISORY_ORDERS[1],
  RETIREMENT_ORDERS[0],
  EXECUTION_ORDERS[3],
];

function ordersForPortfolio(portfolioId: PortfolioId): StandingOrder[] {
  switch (portfolioId) {
    case "execution":
      return EXECUTION_ORDERS;
    case "advisory":
      return ADVISORY_ORDERS;
    case "retirement":
      return RETIREMENT_ORDERS;
    default:
      return ALL_ORDERS;
  }
}

export function useStandingOrdersData(
  portfolioId: PortfolioId = "all",
): UseStandingOrdersDataResult {
  const orders = ordersForPortfolio(portfolioId);

  return {
    data: { orders },
    loading: false,
    error: null,
    totalCount: orders.length,
  };
}
