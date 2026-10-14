"use client";

import type { GoalPortfolioData } from "@/types/goalMonitoring";
import { formatSignedPercentWhole } from "@/lib/format";
import { SectionTitle } from "@/components/WealthOverview/ui/SectionTitle";

interface GoalMonitoringExtendedProps {
  portfolio: GoalPortfolioData;
}

function scheduleLabel(status: GoalPortfolioData["scenario"]["scheduleStatus"]): string {
  if (status === "ahead") return "Ahead of schedule";
  if (status === "behind") return "Behind schedule";
  return "On schedule";
}

/** Level 3 — scenario analysis, volatility histogram, asset contributions, risk context */
export function GoalMonitoringExtended({ portfolio }: GoalMonitoringExtendedProps) {
  const { scenario, monthlyReturns, assetClassContributions, riskContext } = portfolio;
  const maxBucketPercentage = Math.max(...monthlyReturns.map((bucket) => bucket.percentage));

  return (
    <div className="flex flex-col gap-5 border-t border-[var(--db-border-secondary)] pt-4">
      <section aria-labelledby="scenario-heading">
        <SectionTitle>
          <span id="scenario-heading">Scenario analysis</span>
        </SectionTitle>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <div className="rounded-[8px] bg-[var(--db-surface-light)] p-3">
            <p className="text-[12px] text-[var(--db-muted)]">Projected months to goal</p>
            <p className="mt-1 font-display text-[20px] text-[var(--db-primary)]">
              {scenario.projectedMonthsToGoal}
            </p>
          </div>
          <div className="rounded-[8px] bg-[var(--db-surface-light)] p-3">
            <p className="text-[12px] text-[var(--db-muted)]">Schedule status</p>
            <p
              className={`mt-1 font-display text-[20px] ${
                scenario.scheduleStatus === "behind"
                  ? "text-[var(--db-warning)]"
                  : "text-[var(--db-success)]"
              }`}
            >
              {scheduleLabel(scenario.scheduleStatus)}
            </p>
          </div>
          <div className="rounded-[8px] bg-[var(--db-surface-light)] p-3">
            <p className="text-[12px] text-[var(--db-muted)]">Ahead / behind</p>
            <p className="mt-1 font-display text-[20px] text-[var(--db-primary)]">
              {scenario.monthsAheadOrBehind >= 0 ? "+" : ""}
              {scenario.monthsAheadOrBehind} mo
            </p>
          </div>
        </div>
      </section>

      <section aria-label="Return distribution and asset class contribution">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-[100px]">
          <div aria-labelledby="volatility-heading" className="min-w-0 flex-1">
            <SectionTitle>
              <span id="volatility-heading">Volatility histogram</span>
            </SectionTitle>
            <p className="mt-1 text-[12px] text-[var(--db-muted)]">
              Distribution of monthly returns (last 5 years)
            </p>
            <div
              className="mt-3 flex flex-col gap-2"
              role="img"
              aria-label="Monthly return distribution"
            >
              {monthlyReturns.map((bucket) => (
                <div
                  key={bucket.id}
                  className="grid grid-cols-[88px_1fr_40px] items-center gap-2"
                >
                  <span className="text-[11px] text-[var(--db-secondary)]">{bucket.range}</span>
                  <div className="h-2 overflow-hidden rounded-full bg-[var(--db-border-secondary)]">
                    <div
                      className="h-full rounded-full bg-[var(--db-info)] transition-[width] duration-300 ease-out"
                      style={{
                        width: `${(bucket.percentage / maxBucketPercentage) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-right text-[11px] text-[var(--db-muted)]">
                    {bucket.percentage.toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div aria-labelledby="contributions-heading" className="min-w-0 flex-1">
            <SectionTitle>
              <span id="contributions-heading">Asset class contribution</span>
            </SectionTitle>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[240px] text-left text-[12px]">
                <thead>
                  <tr className="border-b border-[var(--db-border-secondary)] text-[var(--db-muted)]">
                    <th scope="col" className="pb-2 pr-4 font-normal">
                      Asset class
                    </th>
                    <th scope="col" className="pb-2 pr-4 font-normal">
                      Contribution
                    </th>
                    <th scope="col" className="pb-2 font-normal">
                      Return
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {assetClassContributions.map((row) => (
                    <tr
                      key={row.assetClass}
                      className="border-b border-[var(--db-border-secondary)] last:border-0"
                    >
                      <td className="py-2 pr-4 text-[var(--db-primary)]">{row.assetClass}</td>
                      <td className="py-2 pr-4 text-[var(--db-secondary)]">
                        {row.contribution}%
                      </td>
                      <td
                        className={`py-2 ${
                          row.returnPct >= 0
                            ? "text-[var(--db-success)]"
                            : "text-red-600"
                        }`}
                      >
                        {formatSignedPercentWhole(row.returnPct)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="risk-heading">
        <SectionTitle>
          <span id="risk-heading">Risk context</span>
        </SectionTitle>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <div className="rounded-[8px] border border-[var(--db-border-secondary)] p-3">
            <p className="text-[12px] text-[var(--db-muted)]">Max drawdown</p>
            <p className="mt-1 text-[16px] text-red-600">
              {riskContext.maxDrawdown.toFixed(1)}%
            </p>
          </div>
          <div className="rounded-[8px] border border-[var(--db-border-secondary)] p-3">
            <p className="text-[12px] text-[var(--db-muted)]">Recovery time</p>
            <p className="mt-1 text-[16px] text-[var(--db-primary)]">
              {riskContext.recoveryTimeMonths} months
            </p>
          </div>
          <div className="rounded-[8px] border border-[var(--db-border-secondary)] p-3">
            <p className="text-[12px] text-[var(--db-muted)]">Normal volatility range</p>
            <p className="mt-1 text-[16px] text-[var(--db-primary)]">
              {riskContext.normalVolatilityRange.min.toFixed(1)}% –{" "}
              {riskContext.normalVolatilityRange.max.toFixed(1)}%
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default GoalMonitoringExtended;
