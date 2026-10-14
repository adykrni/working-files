"use client";

import { useMemo } from "react";
import { useDashboardPortfolio } from "@/context/DashboardPortfolioContext";
import { useAssetAllocationsData } from "@/hooks/useAssetAllocationsData";
import { useWealthData } from "@/hooks/useWealthData";
import { formatCurrencyParts, percentColorClass } from "@/lib/format";
import type { AssetClass } from "@/types/assetAllocations";
import { CARD_SHADOW } from "./DashboardSection";

interface AllocationRowProps {
  name: string;
  color: string;
  allocation: number;
  value: number;
  performance: number;
  isLast?: boolean;
}

function SplitAllocationPercent({ value }: { value: number }) {
  return (
    <span className="text-[#00205b]">
      <span className="text-[14px] leading-normal">{value}</span>
      <span className="text-[10px] leading-normal">%</span>
    </span>
  );
}

function SplitCurrencyValue({ value }: { value: number }) {
  const { whole, decimals } = formatCurrencyParts(value);
  return (
    <span className="text-[#00205b]">
      <span className="text-[14px] leading-normal">{whole}.</span>
      <span className="text-[10px] leading-normal">{decimals}</span>
    </span>
  );
}

function SplitPerformancePercent({ value }: { value: number }) {
  const sign = value >= 0 ? "+" : "-";
  const abs = Math.abs(value).toFixed(2);
  return (
    <span className={`text-right ${percentColorClass(value)}`}>
      <span className="text-[14px] leading-normal">
        {sign}
        {abs}
      </span>
      <span className="text-[10px] leading-normal">%</span>
    </span>
  );
}

function AllocationRow({
  name,
  color,
  allocation,
  value,
  performance,
  isLast = false,
}: AllocationRowProps) {
  return (
    <div
      className={`flex w-full items-center justify-between ${
        isLast ? "" : "border-b border-[#dce4f3] pb-[10px]"
      }`}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <span
          className="size-[6px] shrink-0 rounded-[7.834px]"
          style={{ backgroundColor: color }}
          aria-hidden
        />
        <span className="whitespace-nowrap text-[14px] leading-normal text-[#00205b]">
          {name}
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-[20px] whitespace-nowrap">
        <SplitAllocationPercent value={allocation} />
        <SplitCurrencyValue value={value} />
        <SplitPerformancePercent value={performance} />
      </div>
    </div>
  );
}

function AllocationGroup({
  title,
  items,
}: {
  title: string;
  items: AssetClass[];
}) {
  const visibleItems = items.filter((item) => item.currentAllocation > 0);
  if (visibleItems.length === 0) return null;

  return (
    <div className="flex w-full min-w-0 flex-col gap-[10px]">
      <p className="font-display text-[14px] leading-normal text-[#00205b]">{title}</p>
      <div className="flex w-full min-w-0 flex-col gap-[14px]">
        {visibleItems.map((item, index) => (
          <AllocationRow
            key={item.id}
            name={item.name}
            color={item.color}
            allocation={item.currentAllocation}
            value={item.dollarContribution}
            performance={item.ytdReturn}
            isLast={index === visibleItems.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

/** Allocations — scoped to selected portfolio */
export function AssetClassAllocationSection() {
  const { selectedPortfolioId } = useDashboardPortfolio();
  const wealth = useWealthData();
  const { data, loading, error } = useAssetAllocationsData(selectedPortfolioId);

  const portfolioLabel = useMemo(
    () => wealth.portfolios.find((p) => p.id === selectedPortfolioId)?.name ?? "All portfolios",
    [wealth.portfolios, selectedPortfolioId],
  );

  return (
    <section className="flex h-full min-h-[433px] w-full min-w-0 flex-col gap-[8px] rounded-[10px] bg-[#f5f7f9] p-[6px]">
      <div className="flex shrink-0 flex-col gap-0.5 px-[6px] py-[2px]">
        <h2 className="font-display text-[14px] leading-normal text-[#00205b]">Allocations</h2>
        <p className="text-[10px] leading-normal text-[#6b717b]">{portfolioLabel}</p>
      </div>

      <div
        className="flex min-h-0 w-full flex-1 flex-col justify-between overflow-hidden rounded-[8px] bg-white p-[10px]"
        style={{ boxShadow: CARD_SHADOW }}
      >
        {loading ? (
          <p className="text-[14px] text-[var(--db-muted)]">Loading…</p>
        ) : error || !data ? (
          <p className="text-[14px] text-red-600">{error ?? "Unable to load allocation data."}</p>
        ) : (
          <div key={selectedPortfolioId} className="flex min-h-0 flex-1 flex-col justify-between gap-4 overflow-y-auto">
            <AllocationGroup title="Asset class" items={data.assetClasses} />
            {data.sectors && data.sectors.length > 0 ? (
              <AllocationGroup title="Sector" items={data.sectors} />
            ) : null}
            {data.currencies.some((c) => c.currentAllocation > 0) ? (
              <AllocationGroup title="Currency" items={data.currencies} />
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}
