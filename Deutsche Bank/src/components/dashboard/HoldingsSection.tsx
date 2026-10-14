"use client";

import { useCallback, useEffect, useState } from "react";
import { useDashboardPortfolio } from "@/context/DashboardPortfolioContext";
import {
  getHoldingsSecurityDetails,
  useHoldingsData,
} from "@/hooks/useHoldingsData";
import { formatCurrencyParts, formatSignedPercent, percentColorClass } from "@/lib/format";
import type { HoldingsAssetClass } from "@/types/holdings";
import { DashboardCard, DashboardSection } from "./DashboardSection";

const FILTER_OPTIONS: { value: HoldingsAssetClass | "cash"; label: string }[] = [
  { value: "equities", label: "Equities" },
  { value: "fixed-income", label: "Fixed Income" },
  { value: "money-market", label: "Money market" },
  { value: "alternatives", label: "Alternatives" },
  { value: "others", label: "Others" },
  { value: "cash", label: "Cash" },
];

const COLUMN_HEADER_CLASS = "text-[10px] uppercase leading-normal text-[#5b606a]";

function formatQuantity(units: number): string {
  return units.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

function formatSignedCurrency(value: number, currency = "USD"): string {
  const sign = value >= 0 ? "+" : "-";
  const { whole, decimals } = formatCurrencyParts(Math.abs(value));
  return `${sign}${whole}.${decimals} ${currency}`;
}

function SplitAllocationValue({ value, currency = "USD" }: { value: number; currency?: string }) {
  const { whole, decimals } = formatCurrencyParts(value);
  return (
    <span className="text-[#00205b]">
      <span className="text-[14px] leading-normal">{whole}.</span>
      <span className="text-[10px] leading-normal">
        {decimals} {currency}
      </span>
    </span>
  );
}

export function HoldingsSection() {
  const { selectedPortfolioId } = useDashboardPortfolio();
  const [selectedClass, setSelectedClass] = useState<HoldingsAssetClass>("equities");
  const { data, loading, error } = useHoldingsData(selectedClass, selectedPortfolioId);

  useEffect(() => {
    setSelectedClass("equities");
  }, [selectedPortfolioId]);

  const handleFilterChange = useCallback((value: HoldingsAssetClass | "cash") => {
    if (value !== "cash") {
      setSelectedClass(value);
    }
  }, []);

  return (
    <DashboardSection
      title="Holdings"
      compact
      className="min-h-[328px]"
      titleRight={
        <div className="flex flex-wrap items-center gap-[4px]">
          {FILTER_OPTIONS.map((option) => {
            const isActive = option.value !== "cash" && option.value === selectedClass;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleFilterChange(option.value)}
                className={`rounded-full px-2 pb-[3px] pt-[2px] text-[12px] leading-[1.4] ${
                  isActive
                    ? "border-[0.4px] border-solid border-[#00205b] bg-white text-[#00205b]"
                    : "bg-[#e6ecf3] text-[#535b61]"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      }
    >
      <DashboardCard variant="table" className="flex min-h-[280px] flex-col gap-2.5 overflow-x-auto">
        <div className="flex w-full min-w-[720px] items-center">
          {["Security", "Quantity", "Value", "Returns", "Allocation"].map((header) => (
            <span key={header} className={`min-w-0 flex-[1_0_0] ${COLUMN_HEADER_CLASS}`}>
              {header}
            </span>
          ))}
          <span className={`w-[100px] shrink-0 text-center ${COLUMN_HEADER_CLASS}`}>
            Performance
          </span>
        </div>

        {loading ? (
          <p className="text-[14px] text-[var(--db-muted)]">Loading holdings…</p>
        ) : error || !data ? (
          <p className="text-[14px] text-red-600">{error ?? "Unable to load holdings."}</p>
        ) : data.holdings.length === 0 ? (
          <p className="text-[14px] text-[var(--db-muted)]">
            No holdings in this category for the selected portfolio.
          </p>
        ) : (
          <div className="flex min-w-[720px] flex-1 flex-col justify-between">
            {data.holdings.slice(0, 6).map((security, index) => {
              const details = getHoldingsSecurityDetails(selectedClass, security.id);
              const returnDollar =
                details?.performance.ytdReturnDollar ??
                security.currentValue - security.investedAmount;
              const perf = details?.performance.ytdReturn ?? 0;

              return (
                <div key={security.id}>
                  <div className="flex w-full items-center">
                    <span className="min-w-0 flex-[1_0_0] truncate text-[14px] leading-[1.4] text-[#00205b]">
                      {security.name}
                    </span>
                    <span className="min-w-0 flex-[1_0_0] text-[14px] leading-[1.4] text-[#00205b]">
                      {formatQuantity(security.units)}
                    </span>
                    <span className="min-w-0 flex-[1_0_0] text-[14px] leading-[1.4] text-[#00205b]">
                      <SplitAllocationValue value={security.currentValue} />
                    </span>
                    <span
                      className={`min-w-0 flex-[1_0_0] text-[14px] leading-[1.4] ${percentColorClass(returnDollar)}`}
                    >
                      {formatSignedCurrency(returnDollar)}
                    </span>
                    <span className="min-w-0 flex-[1_0_0] text-[14px] leading-normal text-[#00205b]">
                      <SplitAllocationValue value={security.investedAmount} />
                    </span>
                    <span
                      className={`w-[100px] shrink-0 text-center text-[14px] leading-normal ${percentColorClass(perf)}`}
                    >
                      {formatSignedPercent(perf, { parens: true })}
                    </span>
                  </div>
                  {index < Math.min(data.holdings.length, 6) - 1 && (
                    <div className="h-px bg-[#dee3ec]" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </DashboardCard>
    </DashboardSection>
  );
}
