export type PortfolioType = "advisory" | "execution" | "retirement" | "other";
export type RiskLevel =
  | "Conservative"
  | "Moderate"
  | "Aggressive"
  | "Speculative"
  | "Moderately aggressive";

export type PortfolioRow = {
  id: string;
  name: string;
  type: PortfolioType;
  currency: "USD" | "EUR" | "GBP" | "CHF";
  risk: RiskLevel;
  valueUsd: number;
  dayGain: { amount: number; pct: number } | null;
  totalGain: { amount: number; pct: number };
  isTotalRow?: boolean;
};

export const PORTFOLIO_ROWS: PortfolioRow[] = [
  {
    id: "advisory-global",
    name: "Advisory – Global Balanced",
    type: "advisory",
    currency: "USD",
    risk: "Moderate",
    valueUsd: 12_450_180.44,
    dayGain: { amount: 353_450.05, pct: 2.84 },
    totalGain: { amount: 1_429_486.12, pct: 12.98 },
  },
  {
    id: "execution-us",
    name: "Execution US",
    type: "execution",
    currency: "USD",
    risk: "Aggressive",
    valueUsd: 5_318_747.75,
    dayGain: { amount: -80_313.09, pct: -1.51 },
    totalGain: { amount: 410_795.41, pct: 8.37 },
  },
  {
    id: "execution-eu",
    name: "Execution EU",
    type: "execution",
    currency: "EUR",
    risk: "Aggressive",
    valueUsd: 4_622_940.0,
    dayGain: { amount: 43_455.64, pct: 0.94 },
    totalGain: { amount: -218_640.0, pct: -4.52 },
  },
  {
    id: "retirement-primary",
    name: "Retirement – Primary",
    type: "retirement",
    currency: "USD",
    risk: "Conservative",
    valueUsd: 1_806_399.0,
    dayGain: { amount: 12_283.51, pct: 0.68 },
    totalGain: { amount: 102_390.32, pct: 6.01 },
  },
  {
    id: "retirement-children",
    name: "Retirement – Children",
    type: "retirement",
    currency: "USD",
    risk: "Moderate",
    valueUsd: 1_142_850.0,
    dayGain: { amount: 5_942.82, pct: 0.52 },
    totalGain: { amount: 61_284.0, pct: 5.67 },
  },
  {
    id: "private-markets",
    name: "Private Markets – Fund IV",
    type: "other",
    currency: "USD",
    risk: "Speculative",
    valueUsd: 3_750_000.0,
    dayGain: null,
    totalGain: { amount: 1_125_000.0, pct: 42.86 },
  },
  {
    id: "trust-thomas",
    name: "Trust – Thomas Family",
    type: "other",
    currency: "USD",
    risk: "Speculative",
    valueUsd: 2_914_608.3,
    dayGain: { amount: 11_949.89, pct: 0.41 },
    totalGain: { amount: 314_782.5, pct: 12.11 },
  },
  {
    id: "cash-mgmt",
    name: "Cash Management",
    type: "other",
    currency: "USD",
    risk: "Conservative",
    valueUsd: 387_420.16,
    dayGain: { amount: 38.74, pct: 0.01 },
    totalGain: { amount: 8_420.16, pct: 2.22 },
  },
  {
    id: "all",
    name: "All portfolios",
    type: "other",
    currency: "USD",
    risk: "Moderately aggressive",
    valueUsd: 19_575_327.19,
    dayGain: { amount: 285_420.47, pct: 1.46 },
    totalGain: { amount: 1_942_671.85, pct: 11.02 },
    isTotalRow: true,
  },
];

/** Hero left card — balance-sheet lines (USD reporting view). */
const HERO_BALANCE_SHEET = {
  netAssetValue: 8_199_731.0,
  liabilities: 11_375_596.0,
  cash: 232_046.0,
  availableBorrowing: 4_850_000.0,
} as const;

/** Aligned with indexed chart “Oct” end point in prototypes. */
export const HERO_PRICES_AS_OF = new Date(2026, 9, 6);

export type HeroMetricsSummary = {
  asOfDate: Date;
  totalMarketValue: number;
  reportingCurrency: "USD";
  portfolioCount: number;
  scopeLabel: string;
  dayGain: { amount: number; pct: number };
  totalReturnYtdPct: number;
  netAssetValue: number;
  liabilities: number;
  cash: number;
  investedAssets: number;
  availableBorrowing: number;
};

function heroScopeLabel(portfolioCount: number, currencies: PortfolioRow["currency"][]): string {
  const sorted = [...new Set(currencies)].sort();
  const currencyPart =
    sorted.length === 1 ? `${sorted[0]} reporting` : `${sorted.join(", ")} · USD reporting`;
  return `${portfolioCount} portfolios · ${currencyPart}`;
}

export function getHeroMetricsSummary(): HeroMetricsSummary {
  const totalRow = PORTFOLIO_ROWS.find((r) => r.isTotalRow)!;
  const dataRows = PORTFOLIO_ROWS.filter((r) => !r.isTotalRow);
  const currencies = dataRows.map((r) => r.currency);
  const totalMarketValue = totalRow.valueUsd;

  return {
    asOfDate: HERO_PRICES_AS_OF,
    totalMarketValue,
    reportingCurrency: "USD",
    portfolioCount: dataRows.length,
    scopeLabel: heroScopeLabel(dataRows.length, currencies),
    dayGain: totalRow.dayGain ?? { amount: 0, pct: 0 },
    totalReturnYtdPct: totalRow.totalGain.pct,
    netAssetValue: HERO_BALANCE_SHEET.netAssetValue,
    liabilities: HERO_BALANCE_SHEET.liabilities,
    cash: HERO_BALANCE_SHEET.cash,
    investedAssets: totalMarketValue - HERO_BALANCE_SHEET.cash,
    availableBorrowing: HERO_BALANCE_SHEET.availableBorrowing,
  };
}

export function formatHeroAsOfDate(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatHeroAsOfLabel(date: Date): string {
  return `Prices as of ${formatHeroAsOfDate(date)}`;
}

export function formatHeroUsd(value: number): string {
  return value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function formatHeroDayChange(amount: number, pct: number): string {
  const sign = amount >= 0 ? "+" : "−";
  const pctSign = pct >= 0 ? "+" : "−";
  return `${sign}${formatHeroUsd(Math.abs(amount))} (${pctSign}${Math.abs(pct).toFixed(2)}%)`;
}

export type FilterCategoryId = "type" | "risk" | "currency" | "amount" | "dayMovement";

export type DayMovementFilterId =
  | "gainers"
  | "losers"
  | "flat"
  | "up-1"
  | "down-1"
  | "custom";

export type TotalGainFilterId = "positive" | "negative";

export type AppliedFilters = {
  type: PortfolioType[];
  risk: RiskLevel[];
  currency: PortfolioRow["currency"][];
  amount: string[];
  dayMovement: DayMovementFilterId[];
  dayMovementCustom?: { min: number; max: number };
  totalGain: TotalGainFilterId[];
};

export const EMPTY_FILTERS: AppliedFilters = {
  type: [],
  risk: [],
  currency: [],
  amount: [],
  dayMovement: [],
  totalGain: [],
};

export const TOTAL_GAIN_OPTIONS: { id: TotalGainFilterId; label: string }[] = [
  { id: "positive", label: "Positive total gain" },
  { id: "negative", label: "Negative total gain" },
];

export const FILTER_CATEGORIES: { id: FilterCategoryId; label: string }[] = [
  { id: "type", label: "Type" },
  { id: "risk", label: "Risk" },
  { id: "currency", label: "Currency" },
  { id: "amount", label: "Amount" },
  { id: "dayMovement", label: "Day Movement" },
];

export const TYPE_OPTIONS: { id: PortfolioType; label: string }[] = [
  { id: "advisory", label: "Advisory" },
  { id: "execution", label: "Execution" },
  { id: "retirement", label: "Retirement" },
  { id: "other", label: "Other" },
];

export const RISK_OPTIONS: { id: RiskLevel; label: string }[] = [
  { id: "Conservative", label: "Conservative" },
  { id: "Moderate", label: "Moderate" },
  { id: "Aggressive", label: "Aggressive" },
  { id: "Speculative", label: "Speculative" },
];

export const CURRENCY_OPTIONS: { id: PortfolioRow["currency"]; label: string }[] = [
  { id: "USD", label: "USD" },
  { id: "EUR", label: "EUR" },
  { id: "GBP", label: "GBP" },
  { id: "CHF", label: "CHF" },
];

export const AMOUNT_OPTIONS = [
  { id: "over-1m", label: "Over $1M" },
  { id: "over-5m", label: "Over $5M" },
  { id: "over-10m", label: "Over $10M" },
  { id: "custom", label: "Custom" },
] as const;

export const DAY_MOVEMENT_OPTIONS: { id: DayMovementFilterId; label: string }[] = [
  { id: "gainers", label: "Gainers today" },
  { id: "losers", label: "Losers today" },
  { id: "flat", label: "Flat (±0.05%)" },
  { id: "up-1", label: "Up more than +1%" },
  { id: "down-1", label: "Down more than −1%" },
  { id: "custom", label: "Custom range…" },
];

export type FilterChip = { id: string; label: string; category: FilterCategoryId };

export function filtersToChips(filters: AppliedFilters): FilterChip[] {
  const chips: FilterChip[] = [];
  for (const t of filters.type) {
    const label = TYPE_OPTIONS.find((o) => o.id === t)?.label ?? t;
    chips.push({ id: `type-${t}`, label, category: "type" });
  }
  for (const r of filters.risk) {
    chips.push({ id: `risk-${r}`, label: r, category: "risk" });
  }
  for (const c of filters.currency) {
    chips.push({ id: `currency-${c}`, label: c, category: "currency" });
  }
  for (const a of filters.amount) {
    const label = AMOUNT_OPTIONS.find((o) => o.id === a)?.label ?? a;
    chips.push({ id: `amount-${a}`, label, category: "amount" });
  }
  for (const d of filters.dayMovement) {
    if (d === "custom" && filters.dayMovementCustom) {
      const { min, max } = filters.dayMovementCustom;
      chips.push({
        id: "dayMovement-custom",
        label: `Day ${min}% to ${max}%`,
        category: "dayMovement",
      });
    } else {
      const label = DAY_MOVEMENT_OPTIONS.find((o) => o.id === d)?.label ?? d;
      chips.push({ id: `dayMovement-${d}`, label, category: "dayMovement" });
    }
  }
  for (const g of filters.totalGain) {
    const label = TOTAL_GAIN_OPTIONS.find((o) => o.id === g)?.label ?? g;
    chips.push({ id: `totalGain-${g}`, label, category: "amount" });
  }
  return chips;
}

function matchesDayMovement(row: PortfolioRow, filters: AppliedFilters): boolean {
  if (filters.dayMovement.length === 0) return true;
  if (row.isTotalRow) return true;
  const gain = row.dayGain;
  return filters.dayMovement.some((id) => {
    if (id === "custom" && filters.dayMovementCustom) {
      if (!gain) return false;
      return gain.pct >= filters.dayMovementCustom.min && gain.pct <= filters.dayMovementCustom.max;
    }
    if (!gain) return id === "flat";
    switch (id) {
      case "gainers":
        return gain.pct > 0;
      case "losers":
        return gain.pct < 0;
      case "flat":
        return Math.abs(gain.pct) <= 0.05;
      case "up-1":
        return gain.pct > 1;
      case "down-1":
        return gain.pct < -1;
      default:
        return true;
    }
  });
}

function matchesTotalGain(row: PortfolioRow, ids: TotalGainFilterId[]): boolean {
  if (ids.length === 0) return true;
  if (row.isTotalRow) return true;
  return ids.some((id) => {
    if (id === "positive") return row.totalGain.amount >= 0;
    if (id === "negative") return row.totalGain.amount < 0;
    return true;
  });
}

function matchesAmount(row: PortfolioRow, amountIds: string[]): boolean {
  if (amountIds.length === 0) return true;
  return amountIds.some((id) => {
    if (id === "over-1m") return row.valueUsd >= 1_000_000;
    if (id === "over-5m") return row.valueUsd >= 5_000_000;
    if (id === "over-10m") return row.valueUsd >= 10_000_000;
    return true;
  });
}

export function countPortfolioDataRows(rows: PortfolioRow[]): number {
  return rows.filter((r) => !r.isTotalRow).length;
}

/** Name search; total row omitted when query is non-empty. */
export function filterPortfolioRowsBySearch(rows: PortfolioRow[], query: string): PortfolioRow[] {
  const q = query.trim().toLowerCase();
  if (!q) return rows;
  return rows.filter((r) => !r.isTotalRow && r.name.toLowerCase().includes(q));
}

/** AND across categories; OR within each category. Total row shown only when no filters. */
export function filterPortfolioRows(rows: PortfolioRow[], filters: AppliedFilters): PortfolioRow[] {
  const hasFilters =
    filters.type.length > 0 ||
    filters.risk.length > 0 ||
    filters.currency.length > 0 ||
    filters.amount.length > 0 ||
    filters.dayMovement.length > 0 ||
    filters.totalGain.length > 0;

  const dataRows = rows.filter((r) => !r.isTotalRow);
  const totalRow = rows.find((r) => r.isTotalRow);

  const filtered = dataRows.filter((row) => {
    if (filters.type.length > 0 && !filters.type.includes(row.type)) return false;
    if (filters.risk.length > 0 && !filters.risk.includes(row.risk)) return false;
    if (filters.currency.length > 0 && !filters.currency.includes(row.currency)) return false;
    if (!matchesAmount(row, filters.amount)) return false;
    if (!matchesDayMovement(row, filters)) return false;
    if (!matchesTotalGain(row, filters.totalGain)) return false;
    return true;
  });

  if (!hasFilters && totalRow) return [...filtered, totalRow];
  return filtered;
}

export type ChartRange = "1M" | "3M" | "6M" | "YTD" | "1Y" | "All";

export function generateIndexedSeries(
  range: ChartRange,
  points = 48,
): { portfolio: number[]; benchmark: number[]; labels: string[] } {
  const seed = range.charCodeAt(0) + (range.length > 1 ? range.charCodeAt(1) : 0);
  const portfolio: number[] = [100];
  const benchmark: number[] = [100];

  for (let i = 1; i < points; i += 1) {
    const t = i / (points - 1);
    const wave = Math.sin(t * Math.PI * 1.4 + seed * 0.02) * 1.2;
    const drift = t * (range === "YTD" ? 11 : range === "1Y" ? 9 : 4);
    const portStep = drift * 0.11 + wave * 0.35 + ((seed + i * 7) % 5) * 0.04;
    const benchStep = drift * 0.09 + wave * 0.22 + ((seed + i * 3) % 4) * 0.03;
    portfolio.push(Math.max(92, portfolio[i - 1]! + portStep));
    benchmark.push(Math.max(94, benchmark[i - 1]! + benchStep * 0.85));
  }

  const labelCount = 4;
  const labels = Array.from({ length: labelCount }, (_, idx) => {
    if (range === "YTD") {
      const months = ["Jan", "Apr", "Jul", "Oct"];
      return months[idx] ?? "";
    }
    if (range === "1M") return ["W1", "W2", "W3", "W4"][idx] ?? "";
    if (range === "3M") return ["−3M", "−2M", "−1M", "Now"][idx] ?? "";
    if (range === "6M") return ["−6M", "−4M", "−2M", "Now"][idx] ?? "";
    if (range === "1Y") return ["−1Y", "−9M", "−6M", "Now"][idx] ?? "";
    return ["2022", "2023", "2024", "Now"][idx] ?? "";
  });

  return { portfolio, benchmark, labels };
}
