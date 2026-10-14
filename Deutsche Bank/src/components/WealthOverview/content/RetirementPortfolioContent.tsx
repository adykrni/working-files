"use client";

import type { WealthData } from "@/types/wealth";
import { CurrencyDisplay } from "../ui/CurrencyDisplay";
import { Divider } from "../ui/Divider";
import { OverviewMetric } from "../ui/OverviewMetric";
import { SectionTitle } from "../ui/SectionTitle";
import { MotionSection } from "../ui/MotionSection";
import { formatCurrencyParts } from "@/lib/format";

interface RetirementPortfolioContentProps {
  data: WealthData;
}

export function RetirementPortfolioContent({ data }: RetirementPortfolioContentProps) {
  const retirement = data.details.retirement;
  if (!retirement) return null;

  const fillWidth = Math.min(
    (retirement.currentBalance / retirement.projectedAtRetirement) * 100,
    100,
  );
  const currentFormatted = formatCurrencyParts(retirement.currentBalance);
  const projectedFormatted = retirement.projectedAtRetirement.toLocaleString("en-US", {
    maximumFractionDigits: 0,
  });

  return (
    <div className="flex flex-col gap-5">
      <MotionSection className="flex flex-col gap-2.5">
        <SectionTitle>Overview</SectionTitle>

        {/* Mobile — stacked metrics */}
        <div className="flex flex-col gap-5 sm:flex-row sm:flex-wrap sm:items-start sm:gap-[50px] lg:hidden">
          <OverviewMetric label="Current balance">
            <CurrencyDisplay value={retirement.currentBalance} size="sm" />
          </OverviewMetric>
          <OverviewMetric label="Projected at retirement">
            <CurrencyDisplay value={retirement.projectedAtRetirement} size="sm" />
          </OverviewMetric>
          <OverviewMetric label="Target needed">
            <CurrencyDisplay value={retirement.targetNeeded} size="sm" />
          </OverviewMetric>
          <div className="flex min-w-[200px] flex-1 flex-col gap-4">
            <p className="text-[14px] leading-none text-[var(--db-muted)]">Progress</p>
            <div className="flex flex-col gap-2.5">
              <div className="flex min-h-[22px] items-center">
                <ProgressBar fillWidth={fillWidth} />
              </div>
              <ProgressLabels
                fillWidth={fillWidth}
                currentWhole={currentFormatted.whole}
                currentDecimals={currentFormatted.decimals}
                projected={projectedFormatted}
              />
            </div>
          </div>
        </div>

        {/* Desktop — 4-column grid, row 2 aligns currency + bar */}
        <div className="hidden grid-cols-[auto_auto_auto_minmax(200px,1fr)] gap-x-[50px] gap-y-0 lg:grid">
          <p className="text-[14px] leading-none text-[var(--db-muted)]">Current balance</p>
          <p className="text-[14px] leading-none text-[var(--db-muted)]">Projected at retirement</p>
          <p className="text-[14px] leading-none text-[var(--db-muted)]">Target needed</p>
          <p className="text-[14px] leading-none text-[var(--db-muted)]">Progress</p>

          <div className="pt-4">
            <CurrencyDisplay value={retirement.currentBalance} size="sm" />
          </div>
          <div className="pt-4">
            <CurrencyDisplay value={retirement.projectedAtRetirement} size="sm" />
          </div>
          <div className="pt-4">
            <CurrencyDisplay value={retirement.targetNeeded} size="sm" />
          </div>
          <div className="flex min-h-[22px] items-center pt-4">
            <ProgressBar fillWidth={fillWidth} />
          </div>

          <div className="col-start-4 pt-0.5">
            <ProgressLabels
              fillWidth={fillWidth}
              currentWhole={currentFormatted.whole}
              currentDecimals={currentFormatted.decimals}
              projected={projectedFormatted}
            />
          </div>
        </div>
      </MotionSection>

      <Divider />

      <MotionSection className="flex flex-col gap-2.5">
        <SectionTitle>Your savings rate</SectionTitle>
        <div className="flex flex-wrap gap-[100px] gap-y-4">
          <SavingsField
            label="Monthly contribution"
            value={`$${formatMoney(retirement.monthlyContribution)}`}
          />
          <SavingsField label="Annual savings" value={`$${formatMoney(retirement.annualSavings)}`} />
          <SavingsField label="Pensions" value={`$${formatMoney(retirement.pensions)}`} />
          <SavingsField label="Total savings" value={`$${formatMoney(retirement.totalSavings)}`} />
        </div>
        <div className="inline-flex w-fit items-center gap-2 rounded-[4px] bg-[#f6f6f6] px-2 py-1">
          <span className="size-[8px] shrink-0 rounded-full bg-[var(--db-alert-dot)]" />
          <p className="text-[14px] text-[#3a404a]">{retirement.savingsStatusMessage}</p>
        </div>
      </MotionSection>
    </div>
  );
}

function ProgressBar({ fillWidth }: { fillWidth: number }) {
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-[6px] bg-[#eef3f7]">
      <div
        className="h-full rounded-[6px] bg-[var(--db-equities)]"
        style={{ width: `${fillWidth}%` }}
      />
    </div>
  );
}

function ProgressLabels({
  fillWidth,
  currentWhole,
  currentDecimals,
  projected,
}: {
  fillWidth: number;
  currentWhole: string;
  currentDecimals: string;
  projected: string;
}) {
  return (
    <div className="relative h-3 w-full text-[12px] leading-none text-[var(--db-primary)]">
      <span
        className="absolute top-0 whitespace-nowrap"
        style={{ left: `${fillWidth}%`, transform: "translateX(-100%)" }}
      >
        {currentWhole}.{currentDecimals}
      </span>
      <span className="absolute right-0 top-0 text-[var(--db-muted)]">{projected}</span>
    </div>
  );
}

function SavingsField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-[14px] text-[var(--db-muted)]">{label}</p>
      <p className="font-display text-[20px] text-[var(--db-primary)]">{value}</p>
    </div>
  );
}

function formatMoney(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
