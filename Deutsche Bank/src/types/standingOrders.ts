export type StandingOrderAction = "BUY" | "SELL" | "Reorder";

export type StandingOrderStatus = "Filled" | "Pending" | "Cancelled" | "Partial";

export type StandingOrderPortfolioId = "advisory" | "execution" | "retirement";

export interface StandingOrder {
  id: string;
  security: string;
  quantity: number;
  orderPrice: string;
  orderValue: number;
  currency: string;
  status: StandingOrderStatus;
  action: StandingOrderAction;
  portfolioId: StandingOrderPortfolioId;
  portfolioLabel: string;
}

export interface StandingOrdersData {
  orders: StandingOrder[];
}
