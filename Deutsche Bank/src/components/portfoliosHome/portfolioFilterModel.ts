import {
  AMOUNT_OPTIONS,
  CURRENCY_OPTIONS,
  DAY_MOVEMENT_OPTIONS,
  EMPTY_FILTERS,
  PORTFOLIO_ROWS,
  RISK_OPTIONS,
  TOTAL_GAIN_OPTIONS,
  TYPE_OPTIONS,
  countPortfolioDataRows,
  filterPortfolioRows,
  filterPortfolioRowsBySearch,
  type AppliedFilters,
  type DayMovementFilterId,
  type PortfolioRow,
  type PortfolioType,
  type RiskLevel,
} from "@/data/portfoliosHomeData";

export type FilterFacetCategory =
  | "type"
  | "risk"
  | "currency"
  | "amount"
  | "dayMovement"
  | "totalGain";

export type FormulaToken = { chipId: string; label: string };

export type FormulaClause = {
  id: FilterFacetCategory;
  property: string;
  operator: string;
  tokens: FormulaToken[];
};

export type QuickFilterOption = {
  id: string;
  category: FilterFacetCategory;
  categoryLabel: string;
  valueId: string;
  label: string;
  count: number;
  keywords: string;
};

function matchesAmount(row: PortfolioRow, amountIds: string[]): boolean {
  if (amountIds.length === 0) return true;
  return amountIds.some((id) => {
    if (id === "over-1m") return row.valueUsd >= 1_000_000;
    if (id === "over-5m") return row.valueUsd >= 5_000_000;
    if (id === "over-10m") return row.valueUsd >= 10_000_000;
    return true;
  });
}

function matchesDayMovement(row: PortfolioRow, filters: AppliedFilters): boolean {
  if (filters.dayMovement.length === 0) return true;
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

function matchesTotalGain(row: PortfolioRow, ids: AppliedFilters["totalGain"]): boolean {
  if (ids.length === 0) return true;
  return ids.some((id) => {
    if (id === "positive") return row.totalGain.amount >= 0;
    if (id === "negative") return row.totalGain.amount < 0;
    return true;
  });
}

/** Rows in scope for facets: data rows after name search only. */
export function getPortfolioFacetBaseRows(searchQuery: string): PortfolioRow[] {
  return filterPortfolioRowsBySearch(PORTFOLIO_ROWS, searchQuery).filter((r) => !r.isTotalRow);
}

function matchesDraftExcept(
  row: PortfolioRow,
  draft: AppliedFilters,
  except: FilterFacetCategory,
): boolean {
  if (except !== "type" && draft.type.length > 0 && !draft.type.includes(row.type)) return false;
  if (except !== "risk" && draft.risk.length > 0 && !draft.risk.includes(row.risk)) return false;
  if (except !== "currency" && draft.currency.length > 0 && !draft.currency.includes(row.currency))
    return false;
  if (except !== "amount" && !matchesAmount(row, draft.amount)) return false;
  if (except !== "dayMovement" && !matchesDayMovement(row, draft)) return false;
  if (except !== "totalGain" && !matchesTotalGain(row, draft.totalGain)) return false;
  return true;
}

export function facetCountForOption(
  baseRows: PortfolioRow[],
  draft: AppliedFilters,
  category: FilterFacetCategory,
  optionId: string,
): number {
  return baseRows.filter((row) => {
    if (!matchesDraftExcept(row, draft, category)) return false;
    switch (category) {
      case "type":
        return row.type === optionId;
      case "risk":
        return row.risk === optionId;
      case "currency":
        return row.currency === optionId;
      case "amount":
        return matchesAmount(row, [optionId]);
      case "dayMovement":
        return matchesDayMovement(row, {
          ...draft,
          dayMovement: [optionId as DayMovementFilterId],
          dayMovementCustom: optionId === "custom" ? draft.dayMovementCustom : undefined,
        });
      case "totalGain":
        return matchesTotalGain(row, [optionId as "positive" | "negative"]);
      default:
        return false;
    }
  }).length;
}

export function previewPortfolioCount(draft: AppliedFilters, searchQuery: string): number {
  const filtered = filterPortfolioRows(PORTFOLIO_ROWS, draft);
  return countPortfolioDataRows(filterPortfolioRowsBySearch(filtered, searchQuery));
}

export function activeFilterCount(filters: AppliedFilters, searchQuery: string): number {
  let n = filtersToFormulaClauses(filters).reduce((sum, c) => sum + c.tokens.length, 0);
  if (searchQuery.trim()) n += 1;
  return n;
}

export function filtersToFormulaClauses(filters: AppliedFilters): FormulaClause[] {
  const clauses: FormulaClause[] = [];

  if (filters.type.length > 0) {
    clauses.push({
      id: "type",
      property: "Type",
      operator: "is",
      tokens: filters.type.map((t) => ({
        chipId: `type-${t}`,
        label: TYPE_OPTIONS.find((o) => o.id === t)?.label ?? t,
      })),
    });
  }
  if (filters.currency.length > 0) {
    clauses.push({
      id: "currency",
      property: "Currency",
      operator: "is",
      tokens: filters.currency.map((c) => ({
        chipId: `currency-${c}`,
        label: c,
      })),
    });
  }
  if (filters.risk.length > 0) {
    clauses.push({
      id: "risk",
      property: "Risk",
      operator: "is",
      tokens: filters.risk.map((r) => ({
        chipId: `risk-${r}`,
        label: r,
      })),
    });
  }
  if (filters.amount.length > 0) {
    clauses.push({
      id: "amount",
      property: "Value",
      operator: "is",
      tokens: filters.amount.map((a) => ({
        chipId: `amount-${a}`,
        label: AMOUNT_OPTIONS.find((o) => o.id === a)?.label ?? a,
      })),
    });
  }
  if (filters.dayMovement.length > 0) {
    const tokens: FormulaToken[] = [];
    for (const d of filters.dayMovement) {
      if (d === "custom" && filters.dayMovementCustom) {
        const { min, max } = filters.dayMovementCustom;
        tokens.push({
          chipId: "dayMovement-custom",
          label: `Day ${min}% to ${max}%`,
        });
      } else {
        tokens.push({
          chipId: `dayMovement-${d}`,
          label: DAY_MOVEMENT_OPTIONS.find((o) => o.id === d)?.label ?? d,
        });
      }
    }
    clauses.push({
      id: "dayMovement",
      property: "Day gain",
      operator: "is",
      tokens,
    });
  }
  if (filters.totalGain.length > 0) {
    clauses.push({
      id: "totalGain",
      property: "Total gain",
      operator: "is",
      tokens: filters.totalGain.map((g) => ({
        chipId: `totalGain-${g}`,
        label: TOTAL_GAIN_OPTIONS.find((o) => o.id === g)?.label ?? g,
      })),
    });
  }

  return clauses;
}

export function removeChipFromFilters(filters: AppliedFilters, chipId: string): AppliedFilters {
  if (chipId.startsWith("type-")) {
    const id = chipId.replace("type-", "") as PortfolioType;
    return { ...filters, type: filters.type.filter((t) => t !== id) };
  }
  if (chipId.startsWith("risk-")) {
    const id = chipId.replace("risk-", "") as RiskLevel;
    return { ...filters, risk: filters.risk.filter((r) => r !== id) };
  }
  if (chipId.startsWith("currency-")) {
    const id = chipId.replace("currency-", "") as AppliedFilters["currency"][number];
    return { ...filters, currency: filters.currency.filter((c) => c !== id) };
  }
  if (chipId.startsWith("amount-")) {
    const id = chipId.replace("amount-", "");
    return { ...filters, amount: filters.amount.filter((a) => a !== id) };
  }
  if (chipId.startsWith("dayMovement-")) {
    const id = chipId.replace("dayMovement-", "") as DayMovementFilterId;
    const next = filters.dayMovement.filter((d) => d !== id);
    return {
      ...filters,
      dayMovement: next,
      dayMovementCustom: id === "custom" ? undefined : filters.dayMovementCustom,
    };
  }
  if (chipId.startsWith("totalGain-")) {
    const id = chipId.replace("totalGain-", "") as AppliedFilters["totalGain"][number];
    return { ...filters, totalGain: filters.totalGain.filter((g) => g !== id) };
  }
  return filters;
}

export function toggleQuickFilter(
  filters: AppliedFilters,
  category: FilterFacetCategory,
  valueId: string,
): AppliedFilters {
  switch (category) {
    case "type":
      return {
        ...filters,
        type: toggleInList(filters.type, valueId as PortfolioType),
      };
    case "risk":
      return {
        ...filters,
        risk: toggleInList(filters.risk, valueId as RiskLevel),
      };
    case "currency":
      return {
        ...filters,
        currency: toggleInList(filters.currency, valueId as AppliedFilters["currency"][number]),
      };
    case "amount":
      return { ...filters, amount: toggleInList(filters.amount, valueId) };
    case "dayMovement":
      return {
        ...filters,
        dayMovement: toggleInList(filters.dayMovement, valueId as DayMovementFilterId),
      };
    case "totalGain":
      return {
        ...filters,
        totalGain: toggleInList(filters.totalGain, valueId as AppliedFilters["totalGain"][number]),
      };
    default:
      return filters;
  }
}

function toggleInList<T extends string>(list: T[], id: T): T[] {
  const set = new Set(list);
  if (set.has(id)) set.delete(id);
  else set.add(id);
  return [...set];
}

export function buildQuickFilterOptions(
  draft: AppliedFilters,
  searchQuery: string,
): QuickFilterOption[] {
  const base = getPortfolioFacetBaseRows(searchQuery);
  const options: QuickFilterOption[] = [];

  for (const opt of TYPE_OPTIONS) {
    options.push({
      id: `type-${opt.id}`,
      category: "type",
      categoryLabel: "Type",
      valueId: opt.id,
      label: opt.label,
      count: facetCountForOption(base, draft, "type", opt.id),
      keywords: `type ${opt.label}`.toLowerCase(),
    });
  }
  for (const opt of CURRENCY_OPTIONS) {
    options.push({
      id: `currency-${opt.id}`,
      category: "currency",
      categoryLabel: "Currency",
      valueId: opt.id,
      label: opt.label,
      count: facetCountForOption(base, draft, "currency", opt.id),
      keywords: `currency ${opt.label}`.toLowerCase(),
    });
  }
  for (const opt of RISK_OPTIONS) {
    options.push({
      id: `risk-${opt.id}`,
      category: "risk",
      categoryLabel: "Risk",
      valueId: opt.id,
      label: opt.label,
      count: facetCountForOption(base, draft, "risk", opt.id),
      keywords: `risk ${opt.label}`.toLowerCase(),
    });
  }
  for (const opt of AMOUNT_OPTIONS) {
    if (opt.id === "custom") continue;
    options.push({
      id: `amount-${opt.id}`,
      category: "amount",
      categoryLabel: "Value",
      valueId: opt.id,
      label: opt.label,
      count: facetCountForOption(base, draft, "amount", opt.id),
      keywords: `value amount ${opt.label}`.toLowerCase(),
    });
  }
  for (const opt of DAY_MOVEMENT_OPTIONS) {
    if (opt.id === "custom") continue;
    options.push({
      id: `dayMovement-${opt.id}`,
      category: "dayMovement",
      categoryLabel: "Day gain",
      valueId: opt.id,
      label: opt.label,
      count: facetCountForOption(base, draft, "dayMovement", opt.id),
      keywords: `day gain movement ${opt.label} gainers losers`.toLowerCase(),
    });
  }
  for (const opt of TOTAL_GAIN_OPTIONS) {
    options.push({
      id: `totalGain-${opt.id}`,
      category: "totalGain",
      categoryLabel: "Total gain",
      valueId: opt.id,
      label: opt.label,
      count: facetCountForOption(base, draft, "totalGain", opt.id),
      keywords: `total gain ${opt.label}`.toLowerCase(),
    });
  }

  return options;
}

export function clearAllPortfolioFilters(): AppliedFilters {
  return { ...EMPTY_FILTERS };
}
