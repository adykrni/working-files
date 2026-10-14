"use client";

import { ChevronDown } from "lucide-react";
import type { HoldingsAssetClass } from "@/types/holdings";

const SELECT_SHADOW =
  "0px 1px 4px 0px rgba(137,146,161,0.1), 0px 1px 0px -1px rgba(137,146,161,0.8), 0px 0px 0px 0.5px rgba(137,146,161,0.8)";

const ASSET_CLASS_OPTIONS: { value: HoldingsAssetClass; label: string }[] = [
  { value: "equities", label: "Equities" },
  { value: "fixed-income", label: "Fixed Income" },
  { value: "alternatives", label: "Alternatives" },
  { value: "money-market", label: "Money Market" },
  { value: "others", label: "Others" },
];

interface AssetAllocationSelectorProps {
  assetClass: HoldingsAssetClass;
  onAssetClassChange: (assetClass: HoldingsAssetClass) => void;
}

export function AssetAllocationSelector({
  assetClass,
  onAssetClassChange,
}: AssetAllocationSelectorProps) {
  const selectedLabel =
    ASSET_CLASS_OPTIONS.find((option) => option.value === assetClass)?.label ?? "Equities";

  return (
    <div className="relative inline-flex">
      <label htmlFor="holdings-asset-class" className="sr-only">
        Asset class
      </label>
      <select
        id="holdings-asset-class"
        value={assetClass}
        onChange={(event) =>
          onAssetClassChange(event.target.value as HoldingsAssetClass)
        }
        className="cursor-pointer appearance-none rounded-[4px] bg-white py-1 pl-1.5 pr-7 text-[12px] leading-none text-[var(--db-primary)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--db-primary)] focus-visible:ring-offset-1"
        style={{ boxShadow: SELECT_SHADOW }}
        aria-label="Select asset class"
      >
        {ASSET_CLASS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        strokeWidth={1.5}
        className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-[var(--db-primary)]"
        aria-hidden
      />
      <span className="sr-only">Currently selected: {selectedLabel}</span>
    </div>
  );
}

export default AssetAllocationSelector;
