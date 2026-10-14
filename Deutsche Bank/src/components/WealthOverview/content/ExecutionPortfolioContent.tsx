"use client";

import type { ReactNode } from "react";
import type { WealthData } from "@/types/wealth";
import { AllocationTooltip } from "../ui/AllocationTooltip";
import { CurrencyDisplay } from "../ui/CurrencyDisplay";
import { Divider } from "../ui/Divider";
import { SectionTitle } from "../ui/SectionTitle";
import { MotionSection } from "../ui/MotionSection";
import { formatSignedPercentParts } from "@/lib/format";

interface ExecutionPortfolioContentProps {
  data: WealthData;
}

function sectorBarColor(sector: string): string {
  if (sector === "Others") return "#add3ec";
  if (sector === "Consumer") return "var(--db-bonds)";
  return "var(--db-equities)";
}

export function ExecutionPortfolioContent({ data }: ExecutionPortfolioContentProps) {
  const execution = data.details.execution;
  if (!execution) return null;

  const ytdParts = formatSignedPercentParts(execution.ytdReturn);

  return (
    <div className="flex flex-col gap-5">
      <MotionSection className="flex flex-col gap-2.5">
        <SectionTitle>Performance</SectionTitle>
        <div className="flex flex-wrap items-center gap-[50px]">
          <ExecutionMetric label="Incoming">
            <CurrencyDisplay value={execution.incoming} size="sm" />
          </ExecutionMetric>
          <ExecutionMetric label="Outgoing">
            <CurrencyDisplay value={execution.outgoing} size="sm" />
          </ExecutionMetric>
          <ExecutionMetric label="Gains">
            <CurrencyDisplay value={execution.gains} size="sm" />
          </ExecutionMetric>
          <ExecutionMetric label="YTD performance">
            <div className="flex items-end gap-1.5">
              <p className="font-display leading-none text-[var(--db-primary)]">
                <span className="text-[22px]">{ytdParts.whole}</span>
                <span className="text-[14px]">{ytdParts.suffix}</span>
              </p>
              <p className="pb-px text-[14px] leading-none text-[var(--db-muted)]">
                vs Market {execution.marketReturn.toFixed(1)}%
              </p>
            </div>
          </ExecutionMetric>
        </div>
      </MotionSection>

      <Divider />

      <MotionSection className="flex flex-col gap-2.5">
        <SectionTitle>Holdings overview</SectionTitle>
        <div className="flex w-full gap-2.5">
          {execution.sectorBreakdown.map((sector) => {
            const segment = (
              <>
                <div
                  className={`h-9 w-full rounded-[6px] ${
                    sector.holdings?.length ? "transition-opacity hover:opacity-90" : ""
                  }`}
                  style={{ backgroundColor: sectorBarColor(sector.sector) }}
                />
                <div className="flex h-[14px] min-w-0 items-center gap-1.5 whitespace-nowrap text-[12px] leading-none text-[var(--db-primary)]">
                  <span className="truncate">{sector.sector}</span>
                  <span className="shrink-0 tabular-nums">{sector.percentage}%</span>
                </div>
              </>
            );

            return (
              <div
                key={sector.sector}
                className="flex min-w-0 flex-col gap-2"
                style={{ flex: `${sector.percentage} 1 0%` }}
              >
                {sector.holdings?.length ? (
                  <AllocationTooltip label={sector.sector} holdings={sector.holdings}>
                    {segment}
                  </AllocationTooltip>
                ) : (
                  segment
                )}
              </div>
            );
          })}
        </div>
      </MotionSection>
    </div>
  );
}

function ExecutionMetric({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-[14px] leading-none text-[var(--db-muted)]">{label}</p>
      <div className="min-h-[22px] leading-none">{children}</div>
    </div>
  );
}
