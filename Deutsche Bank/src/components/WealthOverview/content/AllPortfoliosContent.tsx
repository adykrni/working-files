"use client";

import type { AllocationHolding, WealthData } from "@/types/wealth";
import { AllocationTooltip } from "../ui/AllocationTooltip";
import { CurrencyDisplay } from "../ui/CurrencyDisplay";
import { Divider } from "../ui/Divider";
import { OverviewMetric } from "../ui/OverviewMetric";
import { PercentDisplay } from "../ui/PercentDisplay";
import { SectionTitle } from "../ui/SectionTitle";
import { MotionSection } from "../ui/MotionSection";
import { formatMillions } from "@/lib/format";

interface AllPortfoliosContentProps {
  data: WealthData;
}

const sectorBarColors = ["var(--db-equities)", "var(--db-bonds)", "#add3ec"];

export function AllPortfoliosContent({ data }: AllPortfoliosContentProps) {
  const all = data.details.allPortfolios;
  if (!all) return null;

  const allocationSegments: {
    label: string;
    displayLabel: string;
    pct: number;
    value: number;
    holdings?: AllocationHolding[];
  }[] = [
    {
      label: "Equities",
      displayLabel: "Equities",
      pct: all.equitiesAllocation,
      value: all.equitiesValue,
      holdings: all.equitiesHoldings,
    },
    {
      label: "Bonds",
      displayLabel: "Bonds",
      pct: all.bondsAllocation,
      value: all.bondsValue,
      holdings: all.bondsHoldings,
    },
    {
      label: "Cash & Others",
      displayLabel: "Cash",
      pct: all.cashAllocation,
      value: all.cashValue,
      holdings: all.cashHoldings,
    },
  ];

  return (
    <div className="flex flex-col gap-[20px]">
      <MotionSection className="flex flex-col gap-2.5">
        <SectionTitle>Overview</SectionTitle>
        <div className="flex flex-wrap items-start gap-[50px]">
          <OverviewMetric label="Net asset value">
            <CurrencyDisplay value={all.netAssetValue} size="sm" />
          </OverviewMetric>
          <OverviewMetric label="Liabilities">
            <CurrencyDisplay value={all.liabilities} size="sm" />
          </OverviewMetric>
          <OverviewMetric label="YTD performance">
            <PercentDisplay value={all.ytdPerformance} size="sm" />
          </OverviewMetric>
          <OverviewMetric label="Available borrowing">
            <CurrencyDisplay value={all.availableBorrowing} size="sm" />
          </OverviewMetric>
        </div>
      </MotionSection>

      <Divider />

      <MotionSection className="flex flex-col gap-2.5">
        <SectionTitle>Asset allocation</SectionTitle>
        <div className="flex w-full gap-2.5">
          {allocationSegments.map((seg, i) => {
            const segment = (
              <>
                <div
                  className={`h-9 w-full rounded-[6px] ${
                    seg.holdings?.length ? "transition-opacity hover:opacity-90" : ""
                  }`}
                  style={{ backgroundColor: sectorBarColors[i] }}
                />
                <SegmentLabel displayLabel={seg.displayLabel} pct={seg.pct} value={seg.value} />
              </>
            );

            return (
              <div
                key={seg.label}
                className="flex min-w-0 flex-col gap-2"
                style={{ flex: seg.pct }}
              >
                {seg.holdings?.length ? (
                  <AllocationTooltip label={seg.label} holdings={seg.holdings}>
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

function SegmentLabel({
  displayLabel,
  pct,
  value,
}: {
  displayLabel: string;
  pct: number;
  value: number;
}) {
  return (
    <div className="flex h-[14px] items-center gap-1.5 whitespace-nowrap text-[12px] leading-none text-[var(--db-primary)]">
      <span className="truncate">{displayLabel}</span>
      <span className="shrink-0 text-[var(--db-border)]">|</span>
      <span className="shrink-0 tabular-nums">{pct}%</span>
      <span className="shrink-0 text-[var(--db-border)]">|</span>
      <span className="shrink-0 tabular-nums">{formatMillions(value)}</span>
    </div>
  );
}
