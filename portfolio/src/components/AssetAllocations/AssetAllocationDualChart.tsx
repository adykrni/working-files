"use client";

import type { AssetClass } from "@/types/assetAllocations";
import { formatInteger } from "@/lib/format";

interface AssetAllocationDualChartProps {
  /** Asset classes with actual vs target allocation and inline metrics */
  assetClasses: AssetClass[];
}

/** Layer 1 — very light neutral track */
const BAR_BASE = "#eef3f7";

interface MetricPairProps {
  label: string;
  value: string | null;
  valueClassName?: string;
  labelGap?: "sm" | "md";
}

/** Inline label + value pair aligned horizontally */
function MetricPair({
  label,
  value,
  valueClassName = "text-[var(--db-primary)]",
  labelGap = "md",
}: MetricPairProps) {
  return (
    <div
      className={[
        "flex items-center whitespace-nowrap text-[14px] leading-normal",
        labelGap === "sm" ? "gap-1.5" : "gap-2.5",
      ].join(" ")}
    >
      <span className="text-[var(--db-muted)]">{label}</span>
      {value !== null && (
        <span className={`font-display tabular-nums ${valueClassName}`}>{value}</span>
      )}
    </div>
  );
}

/** Derives a lighter tint of the asset colour for the target layer */
function assetColorLight(hex: string): string {
  return `color-mix(in srgb, ${hex} 38%, white)`;
}

interface AllocationBarLayersProps {
  assetClass: AssetClass;
}

/**
 * Three stacked bar layers:
 * 1. Base line (very light)
 * 2. Target line (lighter asset tint)
 * 3. Current line (asset colour)
 */
function AllocationBarLayers({ assetClass }: AllocationBarLayersProps) {
  const { currentAllocation, targetAllocation, color, name } = assetClass;
  const showTarget = targetAllocation > 0;
  const currentWidth = Math.min(currentAllocation, 100);
  const targetWidth = Math.min(targetAllocation, 100);

  return (
    <div
      className="relative h-2.5 w-full overflow-hidden rounded-full"
      style={{ backgroundColor: BAR_BASE }}
      role="img"
      aria-label={`${name} allocation ${currentAllocation} percent${
        showTarget ? `, target ${targetAllocation} percent` : ""
      }`}
    >
      {showTarget && (
        <div
          className="absolute left-0 top-0 z-10 h-full rounded-full"
          style={{ width: `${targetWidth}%`, backgroundColor: assetColorLight(color) }}
          aria-hidden
        />
      )}
      <div
        className="absolute left-0 top-0 z-20 h-full rounded-full"
        style={{ width: `${currentWidth}%`, backgroundColor: color }}
        aria-hidden
      />
    </div>
  );
}

interface AllocationBarLabelProps {
  currentAllocation: number;
}

/** Single current % label centred under the end of layer 3 */
function AllocationBarLabel({ currentAllocation }: AllocationBarLabelProps) {
  const currentWidth = Math.min(currentAllocation, 100);

  return (
    <div className="relative mt-[5px] h-[14px]">
      <span
        className="absolute top-0 -translate-x-1/2 whitespace-nowrap text-[12px] leading-normal text-[var(--db-primary)] tabular-nums"
        style={{ left: `${currentWidth}%` }}
      >
        {currentAllocation}%
      </span>
    </div>
  );
}

function formatYtdReturn(value: number): string | null {
  if (value === 0) return null;
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

function formatContribution(value: number): string | null {
  if (value === 0) return null;
  return `${formatInteger(value)}.00 USD`;
}

/** Volatility contribution at or above this % is shown as high risk (red) */
const HIGH_VOLATILITY_THRESHOLD = 18;

interface RiskMetric {
  value: string | null;
  valueClassName: string;
}

/** High contributors show % of volatility (red); lower ones show Low volatility (green) */
function formatRiskMetric(volatilityContribution: number): RiskMetric {
  if (volatilityContribution === 0) {
    return { value: null, valueClassName: "text-[var(--db-success)]" };
  }

  if (volatilityContribution >= HIGH_VOLATILITY_THRESHOLD) {
    return {
      value: `${volatilityContribution}% of volatility`,
      valueClassName: "text-[#d8331d]",
    };
  }

  return {
    value: "Low volatility",
    valueClassName: "text-[var(--db-success)]",
  };
}

function formatSharpe(value: number): string | null {
  if (value === 0) return null;
  return value.toFixed(1);
}

/**
 * Level 2 dual-bar comparison with inline metrics per asset class.
 * Bar uses 3 stacked layers; metrics row is vertically centered on the bar track.
 *
 * @param props.assetClasses - Array of asset classes with allocation and performance data
 * @returns Rows of layered bars and horizontal metrics (~600–700px total height)
 */
export function AssetAllocationDualChart({ assetClasses }: AssetAllocationDualChartProps) {
  return (
    <div className="flex w-full flex-col gap-[25px]" aria-label="Asset allocation detail">
      {assetClasses.map((assetClass, index) => {
        const isOthers = assetClass.id === "others";
        const ytdValue = isOthers ? "-" : formatYtdReturn(assetClass.ytdReturn);
        const contributionValue = formatContribution(assetClass.dollarContribution);
        const riskMetric = formatRiskMetric(assetClass.volatilityContribution);
        const sharpeValue = isOthers ? "-" : formatSharpe(assetClass.sharpeRatio);
        const mutedMetricClass = "text-[var(--db-secondary-light)]";

        return (
          <div key={assetClass.id} className="w-full">
            {index > 0 && (
              <hr className="mb-[25px] border-0 border-t border-[var(--db-border-secondary)]" />
            )}

            <article className="grid w-full grid-cols-1 gap-y-2.5 sm:grid-cols-[286px_1fr] sm:grid-rows-[auto_10px_auto] sm:gap-x-5 sm:gap-y-2.5">
              <h3 className="text-[14px] capitalize leading-normal text-[var(--db-primary)] sm:col-start-1 sm:row-start-1">
                {assetClass.name} {assetClass.targetAllocation}%
              </h3>

              <div className="sm:col-start-1 sm:row-start-2 sm:self-center">
                <AllocationBarLayers assetClass={assetClass} />
              </div>

              <div className="sm:col-start-1 sm:row-start-3">
                <AllocationBarLabel currentAllocation={assetClass.currentAllocation} />
              </div>

              <div className="flex min-w-0 flex-wrap items-center justify-between gap-x-4 gap-y-2 sm:col-start-2 sm:row-start-2 sm:self-center sm:gap-x-6 lg:gap-x-8">
                <MetricPair
                  label="YTD return"
                  value={ytdValue}
                  valueClassName={isOthers ? mutedMetricClass : undefined}
                />
                <MetricPair label="Contribution" value={contributionValue} />
                <MetricPair
                  label="Risk"
                  value={riskMetric.value}
                  valueClassName={riskMetric.valueClassName}
                />
                <MetricPair
                  label="Sharpe ratio"
                  value={sharpeValue}
                  valueClassName={isOthers ? mutedMetricClass : undefined}
                  labelGap="sm"
                />
              </div>
            </article>
          </div>
        );
      })}
    </div>
  );
}

export default AssetAllocationDualChart;
