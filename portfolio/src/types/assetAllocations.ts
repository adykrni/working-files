/** Single asset class with allocation and performance metrics */
export interface AssetClass {
  /** Unique identifier, e.g. 'equities' */
  id: string;
  /** Display name, e.g. 'Equities' */
  name: string;
  /** Hex color for bar fills */
  color: string;
  /** Current allocation percentage (0–100) */
  currentAllocation: number;
  /** Target allocation percentage (0–100) */
  targetAllocation: number;
  /** Year-to-date return percentage */
  ytdReturn: number;
  /** Dollar amount contributed to total portfolio return */
  dollarContribution: number;
  /** Share of total portfolio volatility (0–100) */
  volatilityContribution: number;
  /** Sharpe ratio, e.g. 0.8 */
  sharpeRatio: number;
}

/** Account-wide asset allocation data across all portfolios */
export interface AssetAllocationData {
  /** Total dollar value of the account */
  totalAccountValue: number;
  /** All asset classes in the account */
  assetClasses: AssetClass[];
  /** ISO date string of last update */
  lastUpdated: string;
  /** Overall account Sharpe ratio */
  overallSharpeRatio: number;
  /** Portfolio volatility as a percentage */
  portfolioVolatility: number;
}
