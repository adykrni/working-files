"use client";

import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import type {
  CostBasisInfo,
  PerformanceHistoryPoint,
  RiskLevel,
  RiskMetrics,
  Security,
  SecurityPerformance,
} from "@/types/holdings";
import { formatSignedPercent } from "@/lib/format";
import { HoldingsChartPlaceholder } from "./HoldingsChartPlaceholder";
import { HoldingsCurrencyValue } from "./HoldingsCurrencyValue";

interface HoldingsRowExpandedProps {
  security: Security;
  performance: SecurityPerformance;
  riskMetrics: RiskMetrics;
  costBasis: CostBasisInfo;
  benchmarkLabel: string;
  performanceHistory: PerformanceHistoryPoint[];
}

function narrativeDotColor(status: SecurityPerformance["performanceStatus"]): string {
  if (status === "outperforming") return "bg-[var(--db-success)]";
  if (status === "in-line") return "bg-[#7f858f]";
  return "bg-[#ec6b10]";
}

function riskLevelLabel(level: RiskLevel): string {
  if (level === "higher-risk") return "Higher risk than average";
  if (level === "lower-risk") return "Lower risk than average";
  return "Average risk profile";
}

function riskDotColor(level: RiskLevel): string {
  if (level === "higher-risk") return "bg-[#ff5040]";
  if (level === "lower-risk") return "bg-[var(--db-success)]";
  return "bg-[#ec6b10]";
}

function betaDescriptor(beta: number): string {
  if (beta >= 1.5) return "High market sensitivity";
  if (beta >= 0.8) return "Moderate market sensitivity";
  return "Low market sensitivity";
}

function MetricPair({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex w-full items-center justify-between gap-4 whitespace-nowrap text-[14px]">
      <span className="text-[var(--db-muted)]">{label}</span>
      <span className="text-[var(--db-primary)]">{value}</span>
    </div>
  );
}

export function HoldingsRowExpanded({
  security: _security,
  performance,
  riskMetrics,
  costBasis,
  benchmarkLabel: _benchmarkLabel,
  performanceHistory,
}: HoldingsRowExpandedProps) {
  const isGain = costBasis.unrealizedGainLoss >= 0;
  const gainLossLabel = isGain ? "Unrealised gain" : "Unrealised loss";
  const percentColor = isGain ? "text-[var(--db-success)]" : "text-[#ff5040]";

  const handleTradingInsights = () => {
    console.info("[Holdings] View trading insights — placeholder handoff");
  };

  return (
    <>
      <div className="flex items-center gap-[5px] rounded-[6px] bg-white px-2 py-1.5">
        <span
          className={`size-2 shrink-0 rounded-full ${narrativeDotColor(performance.performanceStatus)}`}
          aria-hidden
        />
        <p className="text-[14px] leading-normal text-[#3a404a]">
          {performance.benchmarkComparison}
        </p>
      </div>

      <div className="flex w-full flex-col items-stretch gap-[50px] lg:flex-row">
        <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-2.5">
          <p className="text-[10px] uppercase tracking-wide text-[#59616f]">
            12-month performance
          </p>
          <HoldingsChartPlaceholder data={performanceHistory} />
          <button
            type="button"
            onClick={handleTradingInsights}
            className="inline-flex w-fit items-center gap-2.5 rounded-[4px] bg-[var(--db-primary)] px-2.5 py-1.5 text-[12px] text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--db-primary)] focus-visible:ring-offset-2"
          >
            View trading insights
            <ArrowRight size={10} strokeWidth={2} className="text-white" aria-hidden />
          </button>
        </div>

        <div className="flex w-full shrink-0 flex-col gap-[25px] lg:w-[313px]">
          <div className="flex flex-col gap-2.5">
            <p className="text-[10px] uppercase tracking-wide text-[#59616f]">
              Risk profile
            </p>
            <div className="flex flex-col gap-1.5">
              <MetricPair
                label="Volatility"
                value={`${riskMetrics.volatility.toFixed(1)}% (Annualised)`}
              />
              <MetricPair
                label="Beta"
                value={`${riskMetrics.beta.toFixed(1)} (${betaDescriptor(riskMetrics.beta)})`}
              />
              <MetricPair
                label="Max drawdown"
                value={`${riskMetrics.maxDrawdown.toFixed(0)}% (last 12 months)`}
              />
              <div className="flex items-center gap-1.5 pt-0.5">
                <span
                  className={`size-2 shrink-0 rounded-full ${riskDotColor(riskMetrics.riskLevel)}`}
                  aria-hidden
                />
                <span className="text-[14px] text-[#3a404a]">
                  {riskLevelLabel(riskMetrics.riskLevel)}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-2 shrink-0 rounded-full bg-[#7f858f]" aria-hidden />
                <span className="text-[14px] text-[#3a404a]">
                  {riskMetrics.portfolioAllocationPercent.toFixed(1)}% of your portfolio
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <p className="text-[10px] uppercase tracking-wide text-[#59616f]">
              Cost basis &amp; allocation
            </p>
            <div className="flex flex-col gap-1.5">
              <MetricPair
                label="Cost basis"
                value={<HoldingsCurrencyValue value={costBasis.costBasis} />}
              />
              <MetricPair
                label="Current value"
                value={<HoldingsCurrencyValue value={costBasis.currentValue} />}
              />
              <div className="flex w-full items-center justify-between gap-4 whitespace-nowrap text-[14px]">
                <span className="text-[var(--db-muted)]">{gainLossLabel}</span>
                <span>
                  <HoldingsCurrencyValue
                    value={costBasis.unrealizedGainLoss}
                    showSign
                  />
                  <span className={`text-[8px] leading-normal ${percentColor}`}>
                    ({formatSignedPercent(costBasis.unrealizedGainLossPercent)})
                  </span>
                </span>
              </div>
              <MetricPair
                label="Held for"
                value={`${costBasis.timeHeldMonths} months`}
              />
              <div className="flex items-center gap-1.5 pt-0.5">
                <span className="size-2 shrink-0 rounded-full bg-[#7f858f]" aria-hidden />
                <span className="text-[14px] text-[#3a404a]">
                  {costBasis.actionableInsight}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default HoldingsRowExpanded;
