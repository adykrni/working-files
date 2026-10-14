/** Holdings tab — Figma 956:22134 */

export type HeldInTag =
  | "advisory"
  | "trust"
  | "private-markets"
  | "execution-us"
  | "execution-eu"
  | "retirement"
  | "multi-portfolio";

export type AssetClassId = "equity" | "fixed-income" | "cash" | "alternatives" | "fund";

export type HoldingValueFilterId = "over-500k" | "over-1m" | "over-2m";
export type HoldingWealthFilterId = "over-5pct" | "over-10pct";
export type HoldingYtdFilterId = "gainers" | "losers" | "up-10" | "down-10";
export type HoldingSortId =
  | "value-desc"
  | "value-asc"
  | "wealth-desc"
  | "ytd-desc"
  | "ytd-asc"
  | "security-asc";

export type HoldingsAppliedFilters = {
  heldIn: HeldInTag[];
  assetClass: AssetClassId[];
  value: HoldingValueFilterId[];
  wealth: HoldingWealthFilterId[];
  ytd: HoldingYtdFilterId[];
  sort: HoldingSortId;
};

export type HoldingsFilterChip = { id: string; label: string };

export const EMPTY_HOLDINGS_FILTERS: HoldingsAppliedFilters = {
  heldIn: [],
  assetClass: [],
  value: [],
  wealth: [],
  ytd: [],
  sort: "value-desc",
};

export const HELD_IN_OPTIONS: { id: HeldInTag; label: string }[] = [
  { id: "advisory", label: "Advisory" },
  { id: "trust", label: "Trust" },
  { id: "private-markets", label: "Private markets" },
  { id: "execution-us", label: "Execution US" },
  { id: "execution-eu", label: "Execution EU" },
  { id: "retirement", label: "Retirement" },
  { id: "multi-portfolio", label: "Multiple portfolios" },
];

export const ASSET_CLASS_OPTIONS: { id: AssetClassId; label: string }[] = [
  { id: "equity", label: "Equity" },
  { id: "fixed-income", label: "Fixed income" },
  { id: "cash", label: "Cash & equivalents" },
  { id: "alternatives", label: "Alternatives" },
  { id: "fund", label: "Funds" },
];

export const HOLDING_VALUE_OPTIONS: { id: HoldingValueFilterId; label: string }[] = [
  { id: "over-500k", label: "Over $500K" },
  { id: "over-1m", label: "Over $1M" },
  { id: "over-2m", label: "Over $2M" },
];

export const HOLDING_WEALTH_OPTIONS: { id: HoldingWealthFilterId; label: string }[] = [
  { id: "over-5pct", label: "Over 5%" },
  { id: "over-10pct", label: "Over 10%" },
];

export const HOLDING_YTD_OPTIONS: { id: HoldingYtdFilterId; label: string }[] = [
  { id: "gainers", label: "YTD gainers" },
  { id: "losers", label: "YTD losers" },
  { id: "up-10", label: "Above 10%" },
  { id: "down-10", label: "Below 10%" },
];

export const HOLDING_SORT_OPTIONS: { id: HoldingSortId; label: string }[] = [
  { id: "value-desc", label: "Value (high to low)" },
  { id: "value-asc", label: "Value (low to high)" },
  { id: "wealth-desc", label: "% of wealth (high to low)" },
  { id: "ytd-desc", label: "YTD (best first)" },
  { id: "ytd-asc", label: "YTD (worst first)" },
  { id: "security-asc", label: "Security (A–Z)" },
];

const HOLDING_ASSET_CLASS: Record<string, AssetClassId> = {
  "agg-bond": "fixed-income",
  cash: "cash",
  "pe-fund": "alternatives",
  "vti-intl-1": "equity",
  brk: "equity",
  "vti-intl-2": "equity",
  "core-sp500": "equity",
  "db-ag": "equity",
  asml: "equity",
  "vti-total": "equity",
  aapl: "equity",
  sap: "equity",
  "vti-bond": "fixed-income",
  vnq: "equity",
  lvmh: "equity",
  "tdf-2045": "fund",
  msft: "equity",
  siemens: "equity",
  nvda: "equity",
  nestle: "equity",
  tsla: "equity",
  "vti-intl-3": "equity",
  "tdf-2040": "fund",
};

export function getHoldingAssetClass(row: HoldingRow): AssetClassId {
  if (row.isTotalRow) return "equity";
  return HOLDING_ASSET_CLASS[row.id] ?? "equity";
}

export function parseHeldInTags(heldIn: string): HeldInTag[] {
  const tags: HeldInTag[] = [];
  const s = heldIn.toLowerCase();
  if (s.includes("advisory")) tags.push("advisory");
  if (s.includes("trust")) tags.push("trust");
  if (s.includes("private markets")) tags.push("private-markets");
  if (s.includes("execution us")) tags.push("execution-us");
  if (s.includes("execution eu")) tags.push("execution-eu");
  if (s.includes("retirement")) tags.push("retirement");
  if (/\d+\s*portfolio/.test(s)) tags.push("multi-portfolio");
  return tags;
}

export function holdingsFiltersToChips(filters: HoldingsAppliedFilters): HoldingsFilterChip[] {
  const chips: HoldingsFilterChip[] = [];
  for (const h of filters.heldIn) {
    const label = HELD_IN_OPTIONS.find((o) => o.id === h)?.label ?? h;
    chips.push({ id: `heldIn-${h}`, label });
  }
  for (const a of filters.assetClass) {
    const label = ASSET_CLASS_OPTIONS.find((o) => o.id === a)?.label ?? a;
    chips.push({ id: `assetClass-${a}`, label });
  }
  for (const v of filters.value) {
    const label = HOLDING_VALUE_OPTIONS.find((o) => o.id === v)?.label ?? v;
    chips.push({ id: `value-${v}`, label });
  }
  for (const w of filters.wealth) {
    const label = HOLDING_WEALTH_OPTIONS.find((o) => o.id === w)?.label ?? w;
    chips.push({ id: `wealth-${w}`, label });
  }
  for (const y of filters.ytd) {
    const label = HOLDING_YTD_OPTIONS.find((o) => o.id === y)?.label ?? y;
    chips.push({ id: `ytd-${y}`, label });
  }
  if (filters.sort !== "value-desc") {
    const label = HOLDING_SORT_OPTIONS.find((o) => o.id === filters.sort)?.label ?? filters.sort;
    chips.push({ id: `sort-${filters.sort}`, label });
  }
  return chips;
}

export function removeHoldingsFilterChip(
  filters: HoldingsAppliedFilters,
  chipId: string,
): HoldingsAppliedFilters {
  if (chipId.startsWith("heldIn-")) {
    const id = chipId.replace("heldIn-", "") as HeldInTag;
    return { ...filters, heldIn: filters.heldIn.filter((h) => h !== id) };
  }
  if (chipId.startsWith("assetClass-")) {
    const id = chipId.replace("assetClass-", "") as AssetClassId;
    return { ...filters, assetClass: filters.assetClass.filter((a) => a !== id) };
  }
  if (chipId.startsWith("value-")) {
    const id = chipId.replace("value-", "") as HoldingValueFilterId;
    return { ...filters, value: filters.value.filter((v) => v !== id) };
  }
  if (chipId.startsWith("wealth-")) {
    const id = chipId.replace("wealth-", "") as HoldingWealthFilterId;
    return { ...filters, wealth: filters.wealth.filter((w) => w !== id) };
  }
  if (chipId.startsWith("ytd-")) {
    const id = chipId.replace("ytd-", "") as HoldingYtdFilterId;
    return { ...filters, ytd: filters.ytd.filter((y) => y !== id) };
  }
  if (chipId.startsWith("sort-")) {
    return { ...filters, sort: "value-desc" };
  }
  return filters;
}

function matchesHoldingValue(row: HoldingRow, ids: HoldingValueFilterId[]): boolean {
  if (ids.length === 0) return true;
  return ids.some((id) => {
    if (id === "over-500k") return row.valueUsd >= 500_000;
    if (id === "over-1m") return row.valueUsd >= 1_000_000;
    if (id === "over-2m") return row.valueUsd >= 2_000_000;
    return true;
  });
}

function matchesHoldingWealth(row: HoldingRow, ids: HoldingWealthFilterId[]): boolean {
  if (ids.length === 0) return true;
  return ids.some((id) => {
    if (id === "over-5pct") return row.wealthPct >= 5;
    if (id === "over-10pct") return row.wealthPct >= 10;
    return true;
  });
}

function matchesHoldingYtd(row: HoldingRow, ids: HoldingYtdFilterId[]): boolean {
  if (ids.length === 0) return true;
  return ids.some((id) => {
    switch (id) {
      case "gainers":
        return row.ytdPct > 0;
      case "losers":
        return row.ytdPct < 0;
      case "up-10":
        return row.ytdPct > 10;
      case "down-10":
        return row.ytdPct < -10;
      default:
        return true;
    }
  });
}

export function sortHoldingsRows(rows: HoldingRow[], sort: HoldingSortId): HoldingRow[] {
  const copy = [...rows];
  copy.sort((a, b) => {
    switch (sort) {
      case "value-asc":
        return a.valueUsd - b.valueUsd;
      case "wealth-desc":
        return b.wealthPct - a.wealthPct;
      case "ytd-desc":
        return b.ytdPct - a.ytdPct;
      case "ytd-asc":
        return a.ytdPct - b.ytdPct;
      case "security-asc":
        return a.security.localeCompare(b.security);
      case "value-desc":
      default:
        return b.valueUsd - a.valueUsd;
    }
  });
  return copy;
}

export function countHoldingsDataRows(rows: HoldingRow[]): number {
  return rows.filter((r) => !r.isTotalRow).length;
}

export function filterHoldingsRowsBySearch(rows: HoldingRow[], query: string): HoldingRow[] {
  const q = query.trim().toLowerCase();
  if (!q) return rows;
  return rows.filter((r) => !r.isTotalRow && r.security.toLowerCase().includes(q));
}

export function applyHoldingsFilters(
  allRows: HoldingRow[],
  filters: HoldingsAppliedFilters,
  searchQuery: string,
): HoldingRow[] {
  const canonicalTotal = allRows.find((r) => r.isTotalRow && r.id === "total");
  let dataRows = allRows.filter((r) => !r.isTotalRow);

  dataRows = dataRows.filter((row) => {
    if (filters.heldIn.length > 0) {
      const tags = parseHeldInTags(row.heldIn);
      if (!filters.heldIn.some((t) => tags.includes(t))) return false;
    }
    if (filters.assetClass.length > 0 && !filters.assetClass.includes(getHoldingAssetClass(row))) {
      return false;
    }
    if (!matchesHoldingValue(row, filters.value)) return false;
    if (!matchesHoldingWealth(row, filters.wealth)) return false;
    if (!matchesHoldingYtd(row, filters.ytd)) return false;
    return true;
  });

  dataRows = filterHoldingsRowsBySearch(dataRows, searchQuery);
  dataRows = sortHoldingsRows(dataRows, filters.sort);

  const hasActiveFilters =
    filters.heldIn.length > 0 ||
    filters.assetClass.length > 0 ||
    filters.value.length > 0 ||
    filters.wealth.length > 0 ||
    filters.ytd.length > 0 ||
    searchQuery.trim().length > 0 ||
    filters.sort !== "value-desc";

  if (!hasActiveFilters && canonicalTotal) {
    return sortHoldingsRows(allRows.filter((r) => !r.isTotalRow), filters.sort).concat(canonicalTotal);
  }

  if (dataRows.length === 0) return [];

  const subtotal: HoldingRow = {
    id: "filtered-total",
    security: "Total",
    heldIn: "",
    valueUsd: dataRows.reduce((sum, r) => sum + r.valueUsd, 0),
    wealthPct: 0,
    ytdPct: 0,
    isTotalRow: true,
  };
  return [...dataRows, subtotal];
}

export type HoldingRow = {
  id: string;
  security: string;
  heldIn: string;
  valueUsd: number;
  wealthPct: number;
  ytdPct: number;
  isTotalRow?: boolean;
};

export const HOLDINGS_ROWS: HoldingRow[] = [
  {
    id: "agg-bond",
    security: "iShares Aggregate Bond ETF",
    heldIn: "Advisory, Trust",
    valueUsd: 4_008_156.22,
    wealthPct: 12.4,
    ytdPct: -2.1,
  },
  {
    id: "cash",
    security: "Cash & equivalents",
    heldIn: "4 portfolios",
    valueUsd: 3_796_461.23,
    wealthPct: 11.7,
    ytdPct: 0.4,
  },
  {
    id: "pe-fund",
    security: "DB Private Equity Fund IV",
    heldIn: "Private Markets",
    valueUsd: 3_750_000.0,
    wealthPct: 11.6,
    ytdPct: 42.86,
  },
  {
    id: "vti-intl-1",
    security: "Vanguard Total Intl Stock ETF",
    heldIn: "Advisory",
    valueUsd: 3_735_054.13,
    wealthPct: 11.5,
    ytdPct: 16.2,
  },
  {
    id: "brk",
    security: "Berkshire Hathaway",
    heldIn: "Advisory",
    valueUsd: 2_490_036.09,
    wealthPct: 7.7,
    ytdPct: 12.8,
  },
  {
    id: "vti-intl-2",
    security: "Vanguard Total Intl Stock ETF",
    heldIn: "Advisory",
    valueUsd: 1_867_527.07,
    wealthPct: 5.8,
    ytdPct: 9.4,
  },
  {
    id: "core-sp500",
    security: "iShares Core S&P 500 ETF",
    heldIn: "Trust",
    valueUsd: 1_165_843.32,
    wealthPct: 3.6,
    ytdPct: 14.6,
  },
  {
    id: "db-ag",
    security: "Deutsche Bank AG",
    heldIn: "Execution US",
    valueUsd: 1_063_749.55,
    wealthPct: 3.3,
    ytdPct: 17.8,
  },
  {
    id: "asml",
    security: "ASML Holding",
    heldIn: "Execution EU",
    valueUsd: 1_017_046.8,
    wealthPct: 3.1,
    ytdPct: -12.5,
  },
  {
    id: "vti-total",
    security: "Vanguard Total Stock Market",
    heldIn: "Retirement – Primary, Children",
    valueUsd: 917_952.15,
    wealthPct: 2.8,
    ytdPct: 16.1,
  },
  {
    id: "aapl",
    security: "Apple Inc",
    heldIn: "Execution US",
    valueUsd: 850_999.64,
    wealthPct: 2.6,
    ytdPct: -31.0,
  },
  {
    id: "sap",
    security: "SAP SE",
    heldIn: "Execution EU",
    valueUsd: 832_129.2,
    wealthPct: 2.6,
    ytdPct: 4.2,
  },
  {
    id: "vti-bond",
    security: "Vanguard Total Bond Market",
    heldIn: "Execution EU",
    valueUsd: 832_129.2,
    wealthPct: 2.6,
    ytdPct: -5.8,
  },
  {
    id: "vnq",
    security: "Vanguard Real Estate ETF",
    heldIn: "Retirement – Primary, Children",
    valueUsd: 749_475.18,
    wealthPct: 2.3,
    ytdPct: -1.8,
  },
  {
    id: "lvmh",
    security: "LVMH",
    heldIn: "Trust",
    valueUsd: 728_652.07,
    wealthPct: 2.2,
    ytdPct: 4.2,
  },
  {
    id: "tdf-2045",
    security: "Target Date Fund 2045",
    heldIn: "Execution EU",
    valueUsd: 693_441.0,
    wealthPct: 2.1,
    ytdPct: -14.0,
  },
  {
    id: "msft",
    security: "Microsoft Corp",
    heldIn: "Execution US",
    valueUsd: 685_710.0,
    wealthPct: 2.1,
    ytdPct: 7.9,
  },
  {
    id: "siemens",
    security: "Siemens AG",
    heldIn: "Execution EU",
    valueUsd: 638_249.73,
    wealthPct: 2.0,
    ytdPct: 10.85,
  },
  {
    id: "nvda",
    security: "NVIDIA Corporation",
    heldIn: "Execution EU",
    valueUsd: 554_752.8,
    wealthPct: 1.7,
    ytdPct: 3.4,
  },
  {
    id: "nestle",
    security: "Nestlé SA",
    heldIn: "Execution EU",
    valueUsd: 531_874.78,
    wealthPct: 1.6,
    ytdPct: -12.0,
  },
  {
    id: "tsla",
    security: "Tesla Inc",
    heldIn: "Execution US",
    valueUsd: 462_294.0,
    wealthPct: 1.4,
    ytdPct: 1.1,
  },
  {
    id: "vti-intl-3",
    security: "Vanguard Total Intl Stock",
    heldIn: "Retirement – Primary",
    valueUsd: 425_499.82,
    wealthPct: 1.3,
    ytdPct: 24.0,
  },
  {
    id: "tdf-2040",
    security: "Target Date Fund 2040",
    heldIn: "Retirement – Primary",
    valueUsd: 316_119.83,
    wealthPct: 1.0,
    ytdPct: 9.1,
  },
  {
    id: "total",
    security: "Total",
    heldIn: "",
    valueUsd: 32_393_145.65,
    wealthPct: 0,
    ytdPct: 0,
    isTotalRow: true,
  },
];
