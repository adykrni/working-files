import {
  applyHoldingsFilters,
  ASSET_CLASS_OPTIONS,
  countHoldingsDataRows,
  EMPTY_HOLDINGS_FILTERS,
  HELD_IN_OPTIONS,
  HOLDING_SORT_OPTIONS,
  HOLDING_VALUE_OPTIONS,
  HOLDING_WEALTH_OPTIONS,
  HOLDING_YTD_OPTIONS,
  getHoldingAssetClass,
  filterHoldingsRowsBySearch,
  HOLDINGS_ROWS,
  parseHeldInTags,
  type AssetClassId,
  type HeldInTag,
  type HoldingRow,
  type HoldingSortId,
  type HoldingValueFilterId,
  type HoldingWealthFilterId,
  type HoldingYtdFilterId,
  type HoldingsAppliedFilters,
} from "@/data/holdingsHomeData";

export type HoldingsFilterFacetCategory =
  | "heldIn"
  | "assetClass"
  | "value"
  | "wealth"
  | "ytd";

export type FormulaToken = { chipId: string; label: string };

export type FormulaClause = {
  id: HoldingsFilterFacetCategory | "sort";
  property: string;
  operator: string;
  tokens: FormulaToken[];
};

export type HoldingsQuickFilterOption = {
  id: string;
  category: HoldingsFilterFacetCategory;
  categoryLabel: string;
  valueId: string;
  label: string;
  count: number;
  keywords: string;
};

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

export function getHoldingsFacetBaseRows(searchQuery: string): HoldingRow[] {
  return filterHoldingsRowsBySearch(HOLDINGS_ROWS, searchQuery);
}

function matchesDraftExcept(
  row: HoldingRow,
  draft: HoldingsAppliedFilters,
  except: HoldingsFilterFacetCategory,
): boolean {
  if (except !== "heldIn" && draft.heldIn.length > 0) {
    const tags = parseHeldInTags(row.heldIn);
    if (!draft.heldIn.some((t) => tags.includes(t))) return false;
  }
  if (
    except !== "assetClass" &&
    draft.assetClass.length > 0 &&
    !draft.assetClass.includes(getHoldingAssetClass(row))
  ) {
    return false;
  }
  if (except !== "value" && !matchesHoldingValue(row, draft.value)) return false;
  if (except !== "wealth" && !matchesHoldingWealth(row, draft.wealth)) return false;
  if (except !== "ytd" && !matchesHoldingYtd(row, draft.ytd)) return false;
  return true;
}

export function holdingsFacetCountForOption(
  baseRows: HoldingRow[],
  draft: HoldingsAppliedFilters,
  category: HoldingsFilterFacetCategory,
  optionId: string,
): number {
  return baseRows.filter((row) => {
    if (!matchesDraftExcept(row, draft, category)) return false;
    switch (category) {
      case "heldIn":
        return parseHeldInTags(row.heldIn).includes(optionId as HeldInTag);
      case "assetClass":
        return getHoldingAssetClass(row) === optionId;
      case "value":
        return matchesHoldingValue(row, [optionId as HoldingValueFilterId]);
      case "wealth":
        return matchesHoldingWealth(row, [optionId as HoldingWealthFilterId]);
      case "ytd":
        return matchesHoldingYtd(row, [optionId as HoldingYtdFilterId]);
      default:
        return false;
    }
  }).length;
}

export function previewHoldingsCount(
  draft: HoldingsAppliedFilters,
  searchQuery: string,
): number {
  return countHoldingsDataRows(applyHoldingsFilters(HOLDINGS_ROWS, draft, searchQuery));
}

export function holdingsFiltersToFormulaClauses(filters: HoldingsAppliedFilters): FormulaClause[] {
  const clauses: FormulaClause[] = [];

  if (filters.heldIn.length > 0) {
    clauses.push({
      id: "heldIn",
      property: "Held in",
      operator: "is",
      tokens: filters.heldIn.map((t) => ({
        chipId: `heldIn-${t}`,
        label: HELD_IN_OPTIONS.find((o) => o.id === t)?.label ?? t,
      })),
    });
  }
  if (filters.assetClass.length > 0) {
    clauses.push({
      id: "assetClass",
      property: "Asset class",
      operator: "is",
      tokens: filters.assetClass.map((a) => ({
        chipId: `assetClass-${a}`,
        label: ASSET_CLASS_OPTIONS.find((o) => o.id === a)?.label ?? a,
      })),
    });
  }
  if (filters.value.length > 0) {
    clauses.push({
      id: "value",
      property: "Value",
      operator: "is",
      tokens: filters.value.map((v) => ({
        chipId: `value-${v}`,
        label: HOLDING_VALUE_OPTIONS.find((o) => o.id === v)?.label ?? v,
      })),
    });
  }
  if (filters.wealth.length > 0) {
    clauses.push({
      id: "wealth",
      property: "% of wealth",
      operator: "is",
      tokens: filters.wealth.map((w) => ({
        chipId: `wealth-${w}`,
        label: HOLDING_WEALTH_OPTIONS.find((o) => o.id === w)?.label ?? w,
      })),
    });
  }
  if (filters.ytd.length > 0) {
    clauses.push({
      id: "ytd",
      property: "YTD",
      operator: "is",
      tokens: filters.ytd.map((y) => ({
        chipId: `ytd-${y}`,
        label: HOLDING_YTD_OPTIONS.find((o) => o.id === y)?.label ?? y,
      })),
    });
  }
  if (filters.sort !== "value-desc") {
    clauses.push({
      id: "sort",
      property: "Sort",
      operator: "is",
      tokens: [
        {
          chipId: `sort-${filters.sort}`,
          label: HOLDING_SORT_OPTIONS.find((o) => o.id === filters.sort)?.label ?? filters.sort,
        },
      ],
    });
  }

  return clauses;
}

export function activeHoldingsFilterCount(
  filters: HoldingsAppliedFilters,
  searchQuery: string,
): number {
  let n = holdingsFiltersToFormulaClauses(filters).reduce((sum, c) => sum + c.tokens.length, 0);
  if (searchQuery.trim()) n += 1;
  return n;
}

export { removeHoldingsFilterChip as removeChipFromHoldingsFilters } from "@/data/holdingsHomeData";

export function toggleHoldingsQuickFilter(
  filters: HoldingsAppliedFilters,
  category: HoldingsFilterFacetCategory,
  valueId: string,
): HoldingsAppliedFilters {
  switch (category) {
    case "heldIn":
      return { ...filters, heldIn: toggleInList(filters.heldIn, valueId as HeldInTag) };
    case "assetClass":
      return {
        ...filters,
        assetClass: toggleInList(filters.assetClass, valueId as AssetClassId),
      };
    case "value":
      return { ...filters, value: toggleInList(filters.value, valueId as HoldingValueFilterId) };
    case "wealth":
      return {
        ...filters,
        wealth: toggleInList(filters.wealth, valueId as HoldingWealthFilterId),
      };
    case "ytd":
      return { ...filters, ytd: toggleInList(filters.ytd, valueId as HoldingYtdFilterId) };
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

export function buildHoldingsQuickFilterOptions(
  draft: HoldingsAppliedFilters,
  searchQuery: string,
): HoldingsQuickFilterOption[] {
  const base = getHoldingsFacetBaseRows(searchQuery);
  const options: HoldingsQuickFilterOption[] = [];

  for (const opt of HELD_IN_OPTIONS) {
    options.push({
      id: `heldIn-${opt.id}`,
      category: "heldIn",
      categoryLabel: "Held in",
      valueId: opt.id,
      label: opt.label,
      count: holdingsFacetCountForOption(base, draft, "heldIn", opt.id),
      keywords: `held in ${opt.label}`.toLowerCase(),
    });
  }
  for (const opt of ASSET_CLASS_OPTIONS) {
    options.push({
      id: `assetClass-${opt.id}`,
      category: "assetClass",
      categoryLabel: "Asset class",
      valueId: opt.id,
      label: opt.label,
      count: holdingsFacetCountForOption(base, draft, "assetClass", opt.id),
      keywords: `asset class ${opt.label}`.toLowerCase(),
    });
  }
  for (const opt of HOLDING_VALUE_OPTIONS) {
    options.push({
      id: `value-${opt.id}`,
      category: "value",
      categoryLabel: "Value",
      valueId: opt.id,
      label: opt.label,
      count: holdingsFacetCountForOption(base, draft, "value", opt.id),
      keywords: `value ${opt.label}`.toLowerCase(),
    });
  }
  for (const opt of HOLDING_WEALTH_OPTIONS) {
    options.push({
      id: `wealth-${opt.id}`,
      category: "wealth",
      categoryLabel: "% of wealth",
      valueId: opt.id,
      label: opt.label,
      count: holdingsFacetCountForOption(base, draft, "wealth", opt.id),
      keywords: `wealth ${opt.label}`.toLowerCase(),
    });
  }
  for (const opt of HOLDING_YTD_OPTIONS) {
    options.push({
      id: `ytd-${opt.id}`,
      category: "ytd",
      categoryLabel: "YTD",
      valueId: opt.id,
      label: opt.label,
      count: holdingsFacetCountForOption(base, draft, "ytd", opt.id),
      keywords: `ytd ${opt.label}`.toLowerCase(),
    });
  }

  return options;
}

export function clearAllHoldingsFilters(): HoldingsAppliedFilters {
  return { ...EMPTY_HOLDINGS_FILTERS };
}
