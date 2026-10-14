"use client";

import type { KeyboardEvent } from "react";
import type { AssetAllocationData } from "@/types/assetAllocations";
import { AssetAllocationChart } from "./AssetAllocationChart";

interface AssetAllocationCardProps {
  /** Account-wide asset allocation data */
  data: AssetAllocationData;
  /** Called when the user activates expand (click or keyboard) */
  onExpand: () => void;
}

/**
 * Level 1 card container — clickable chart surface; expand control lives in parent header.
 *
 * @param props.data - Full asset allocation dataset
 * @param props.onExpand - Callback to expand into Level 2
 * @returns Clickable card body with horizontal allocation bars
 */
export function AssetAllocationCard({ data, onExpand }: AssetAllocationCardProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onExpand();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onExpand}
      onKeyDown={handleKeyDown}
      aria-label="Expand asset class allocation"
      className="flex h-full w-full flex-1 cursor-pointer flex-col outline-none focus-visible:ring-2 focus-visible:ring-[var(--db-primary)] focus-visible:ring-offset-2"
    >
      <AssetAllocationChart assetClasses={data.assetClasses} />
    </div>
  );
}

export default AssetAllocationCard;
