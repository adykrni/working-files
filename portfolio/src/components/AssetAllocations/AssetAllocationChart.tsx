"use client";

import type { AssetClass } from "@/types/assetAllocations";

interface AssetAllocationChartProps {
  /** Asset classes to render as horizontal allocation bars */
  assetClasses: AssetClass[];
}

const TRACK_COLOR = "#eef3f7";

/**
 * Level 1 horizontal bar chart — one row per asset class showing current allocation.
 *
 * @param props.assetClasses - Array of asset classes with name, color, and currentAllocation
 * @returns Semantic list of allocation bars (~250px total height)
 */
export function AssetAllocationChart({ assetClasses }: AssetAllocationChartProps) {
  return (
    <ul
      className="flex h-full min-h-[230px] w-full flex-1 flex-col justify-between"
      aria-label="Asset class allocation breakdown"
    >
      {assetClasses.map((assetClass) => (
        <li key={assetClass.id} className="flex w-full flex-col gap-2.5">
          <p className="text-[14px] capitalize leading-normal text-[var(--db-primary)]">
            {assetClass.name} {assetClass.currentAllocation}%
          </p>
          <div
            className="h-2.5 w-full overflow-hidden rounded-md"
            style={{ backgroundColor: TRACK_COLOR }}
            role="meter"
            aria-valuenow={assetClass.currentAllocation}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${assetClass.name} allocation ${assetClass.currentAllocation} percent`}
          >
            <div
              className="h-full rounded-md transition-[width] duration-300 ease-out"
              style={{
                width: `${assetClass.currentAllocation}%`,
                backgroundColor: assetClass.color,
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default AssetAllocationChart;
