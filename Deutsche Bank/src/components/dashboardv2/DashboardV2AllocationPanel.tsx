"use client";

import { motion } from "framer-motion";
import { useAssetAllocationsData } from "@/hooks/useAssetAllocationsData";
import { formatCurrencyParts, formatSignedPercent, percentColorClass } from "@/lib/format";
import type { AssetClass } from "@/types/assetAllocations";
import type { PortfolioId } from "@/types/wealth";

function AllocationBar({ items }: { items: AssetClass[] }) {
  const visible = items.filter((i) => i.currentAllocation > 0);
  if (visible.length === 0) return null;

  return (
    <div className="flex h-2 w-full overflow-hidden rounded-full bg-[#eef1f5]">
      {visible.map((item) => (
        <div
          key={item.id}
          className="h-full first:rounded-l-full last:rounded-r-full"
          style={{
            width: `${item.currentAllocation}%`,
            backgroundColor: item.color,
          }}
          title={`${item.name} ${item.currentAllocation}%`}
        />
      ))}
    </div>
  );
}

function AllocationRow({ item }: { item: AssetClass }) {
  const { whole, decimals } = formatCurrencyParts(item.dollarContribution);

  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <div className="flex min-w-0 items-center gap-2">
        <span
          className="size-2 shrink-0 rounded-full"
          style={{ backgroundColor: item.color }}
          aria-hidden
        />
        <span className="truncate text-[13px] text-[var(--db-primary)]">{item.name}</span>
      </div>
      <div className="flex shrink-0 items-center gap-4 tabular-nums">
        <span className="w-10 text-right text-[13px] text-[var(--db-primary)]">
          {item.currentAllocation}%
        </span>
        <span className="hidden w-24 text-right text-[12px] text-[var(--db-muted)] sm:inline">
          {whole}.{decimals}
        </span>
        <span
          className={`w-14 text-right text-[12px] ${percentColorClass(item.ytdReturn)}`}
        >
          {formatSignedPercent(item.ytdReturn)}
        </span>
      </div>
    </div>
  );
}

export function DashboardV2AllocationPanel({ portfolioId }: { portfolioId: PortfolioId }) {
  const { data } = useAssetAllocationsData(portfolioId);
  if (!data) return null;

  const primary = data.assetClasses.filter((i) => i.currentAllocation > 0);
  const secondary = (data.sectors ?? data.currencies).filter((i) => i.currentAllocation > 0);
  const secondaryTitle = data.sectors ? "Sector" : "Currency";

  return (
    <motion.div
      key={`alloc-${portfolioId}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.08 }}
      className="flex min-h-0 flex-col"
    >
      <h2 className="mb-4 text-[13px] font-medium text-[var(--db-primary)]">Allocation</h2>
      <AllocationBar items={primary} />
      <div className="mt-4 divide-y divide-[var(--db-border)]">
        {primary.map((item) => (
          <AllocationRow key={item.id} item={item} />
        ))}
      </div>

      {secondary.length > 0 ? (
        <>
          <p className="mb-2 mt-6 text-[11px] uppercase tracking-wide text-[#94a3b8]">
            {secondaryTitle}
          </p>
          <div className="divide-y divide-[var(--db-border)]">
            {secondary.slice(0, 5).map((item) => (
              <AllocationRow key={item.id} item={item} />
            ))}
          </div>
        </>
      ) : null}
    </motion.div>
  );
}
