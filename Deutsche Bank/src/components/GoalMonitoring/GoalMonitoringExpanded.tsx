"use client";

import { AlertCircle, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import type { GoalPortfolioData, GoalTimeframe } from "@/types/goalMonitoring";
import { GoalChartInteractive } from "./GoalChartInteractive";
import { GoalMonitoringExtended } from "./GoalMonitoringExtended";
import { TIMEFRAME_OPTIONS } from "./chartUtils";

interface GoalMonitoringExpandedProps {
  portfolio: GoalPortfolioData;
  showLevel3: boolean;
  selectedTimeframe: GoalTimeframe;
  onToggleLevel3: () => void;
  onTimeframeChange: (timeframe: GoalTimeframe) => void;
}

function MetricValue({
  value,
  tone = "primary",
}: {
  value: number;
  tone?: "primary" | "negative";
}) {
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";
  const abs = Math.abs(value).toFixed(1);
  const color =
    tone === "negative" || value < 0
      ? "text-[#d8331d]"
      : "text-[var(--db-primary)]";

  return (
    <p className={`font-display leading-none ${color}`}>
      <span className="text-[22px]">
        {sign}
        {abs}
      </span>
      <span className="text-[12px]">%</span>
    </p>
  );
}

/** Level 2 — narrative, chart, metrics, and Level 3 toggle */
export function GoalMonitoringExpanded({
  portfolio,
  showLevel3,
  selectedTimeframe,
  onToggleLevel3,
  onTimeframeChange,
}: GoalMonitoringExpandedProps) {
  const isOnTrack = portfolio.status === "on-track";

  return (
    <div className="flex w-full flex-col gap-5">
      <div className="flex flex-col gap-2.5">
        <div className="flex flex-col items-start justify-between gap-3 lg:flex-row lg:items-center">
          <div
            className="flex items-center gap-2.5 rounded-[6px] bg-[#f6f6f6] p-2.5"
            role="status"
            aria-live="polite"
          >
            {isOnTrack ? (
              <CheckCircle2
                size={16}
                className="shrink-0 text-[var(--db-success)]"
                aria-hidden
              />
            ) : (
              <AlertCircle
                size={16}
                className="shrink-0 text-[var(--db-warning)]"
                aria-hidden
              />
            )}
            <p className="text-[14px] leading-normal text-[#3a404a]">
              {portfolio.narrativeMessage}
            </p>
          </div>

          <div
            className="flex items-start pl-[11px]"
            role="group"
            aria-label="Chart timeframe"
          >
            {TIMEFRAME_OPTIONS.map((option) => {
              const isActive = selectedTimeframe === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onTimeframeChange(option.value)}
                  aria-pressed={isActive}
                  className={[
                    "px-[7px] py-[7px] text-[10px] leading-[14px] transition-colors",
                    isActive
                      ? "rounded-[6px] bg-[#cbd3e3] text-[var(--db-primary)]"
                      : "rounded-[4px] text-[#6b7587] hover:text-[var(--db-primary)]",
                  ].join(" ")}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <GoalChartInteractive
          data={portfolio.chartData}
          timeframe={selectedTimeframe}
          chartKey={portfolio.type}
        />
      </div>

      <div className="flex flex-col gap-5 p-2.5">
        <div className="flex flex-wrap gap-[50px]">
          <div className="flex flex-col gap-1.5">
            <p className="text-[14px] text-[var(--db-muted)]">YTD return</p>
            <MetricValue value={portfolio.metrics.ytdReturn} />
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="text-[14px] text-[var(--db-muted)]">Volatility</p>
            <MetricValue value={portfolio.metrics.volatility} />
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="text-[14px] text-[var(--db-muted)]">Max drawdown</p>
            <MetricValue value={portfolio.metrics.maxDrawdown} tone="negative" />
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="text-[14px] text-[var(--db-muted)]">Expected annual return</p>
            <MetricValue value={portfolio.metrics.expectedAnnualReturn} />
          </div>
        </div>

        <div className="h-px w-full bg-[var(--db-border-secondary)]" />

        <button
          type="button"
          onClick={onToggleLevel3}
          aria-expanded={showLevel3}
          aria-label={showLevel3 ? "Hide scenario analysis" : "View scenario analysis"}
          className="flex items-center gap-1 self-start text-[14px] text-[var(--db-muted)] transition-colors hover:text-[var(--db-primary)]"
        >
          {showLevel3 ? "Hide scenario analysis" : "View scenario analysis"}
          {showLevel3 ? (
            <ChevronUp size={18} strokeWidth={1.5} aria-hidden />
          ) : (
            <ChevronDown size={18} strokeWidth={1.5} aria-hidden />
          )}
        </button>
      </div>

      <div
        className="grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{ gridTemplateRows: showLevel3 ? "1fr" : "0fr" }}
        aria-hidden={!showLevel3}
      >
        <div className="min-h-0 overflow-hidden">
          {showLevel3 ? <GoalMonitoringExtended portfolio={portfolio} /> : null}
        </div>
      </div>
    </div>
  );
}

export default GoalMonitoringExpanded;
