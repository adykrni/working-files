"use client";

import type { AssetAllocationData } from "@/types/assetAllocations";
import { AssetAllocationDualChart } from "./AssetAllocationDualChart";

interface AssetAllocationExpandedProps {
  /** Account-wide asset allocation data */
  data: AssetAllocationData;
  /** Called when the user collapses back to Level 1 (handled by parent header) */
  onCollapse: () => void;
}

/**
 * Level 2 expanded container — dual-bar comparison with inline metrics per asset class.
 * Collapse affordance is in the parent header (matches GoalMonitoring / WealthOverview).
 *
 * @param props.data - Full asset allocation dataset
 * @param props.onCollapse - Reserved for parent coordination; collapse via header button
 * @returns Expanded card body with dual bars and metrics grid
 */
export function AssetAllocationExpanded({ data }: AssetAllocationExpandedProps) {
  return (
    <section aria-label="Asset class allocation detail" className="w-full">
      <AssetAllocationDualChart assetClasses={data.assetClasses} />
    </section>
  );
}

export default AssetAllocationExpanded;
