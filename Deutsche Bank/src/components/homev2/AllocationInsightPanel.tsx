"use client";

import type { AllAllocationMode } from "@/context/DashboardPortfolioContext";
import type { HomeV2ContentFocus } from "@/hooks/useHomeV2HomeData";
import {
  allocationInsightStatusStyles,
  getAllocationInsight,
  type AllocationDriftItem,
  type AllocationInsightAction,
} from "@/hooks/useAllocationInsight";
import type { PortfolioId } from "@/types/wealth";
import { ChevronRight } from "./ui/homev2Ui";

const BAR_TRACK = "#eef3f7";

function DriftBar({ item }: { item: AllocationDriftItem }) {
  const gap = item.target - item.current;
  const gapLabel =
    gap === 0 ? "On target" : gap > 0 ? `${gap}% below target` : `${Math.abs(gap)}% above target`;
  const gapColor = gap === 0 ? "text-[#11810d]" : gap > 0 ? "text-[#d72735]" : "text-[#b45309]";

  return (
    <div className="flex w-full flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[13px] leading-normal text-[#07132a]">{item.name}</span>
        <span className={`shrink-0 text-[11px] leading-normal ${gapColor}`}>{gapLabel}</span>
      </div>
      <div className="relative h-2 w-full overflow-hidden rounded-full" style={{ backgroundColor: BAR_TRACK }}>
        <div
          className="absolute left-0 top-0 h-full rounded-full opacity-35"
          style={{ width: `${item.target}%`, backgroundColor: item.color }}
          aria-hidden
        />
        <div
          className="absolute left-0 top-0 z-10 h-full rounded-full"
          style={{ width: `${item.current}%`, backgroundColor: item.color }}
          aria-hidden
        />
      </div>
      <div className="flex justify-between text-[10px] leading-normal text-[#3c4556]">
        <span>
          Current <span className="font-display text-[#07132a]">{item.current}%</span>
        </span>
        <span>
          Target <span className="font-display text-[#07132a]">{item.target}%</span>
        </span>
      </div>
    </div>
  );
}

function LensToggle({
  active,
  onChange,
}: {
  active: AllAllocationMode;
  onChange: (mode: AllAllocationMode) => void;
}) {
  const options: { id: AllAllocationMode; label: string }[] = [
    { id: "currency", label: "Currency" },
    { id: "sector", label: "Sector" },
  ];

  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-[10px] uppercase leading-normal text-[#3c4556]">Break down by</p>
      <div className="flex gap-1">
        {options.map((option) => {
          const isActive = active === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.id)}
              className={`rounded-full px-3 py-1 text-[13px] leading-[1.4] transition-colors ${
                isActive
                  ? "bg-[#e6ecf3] text-[#07132a]"
                  : "text-[#3c4556] hover:bg-black/[0.03]"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function InsightActionButton({
  action,
  variant,
  onAction,
}: {
  action: AllocationInsightAction;
  variant: "primary" | "secondary";
  onAction: (action: AllocationInsightAction) => void;
}) {
  const isPrimary = variant === "primary";
  return (
    <button
      type="button"
      onClick={() => onAction(action)}
      className={`flex items-center gap-2 rounded-[4px] px-2.5 py-1.5 text-[13px] leading-[1.4] transition-colors ${
        isPrimary
          ? "bg-[#00205b] text-white hover:opacity-90"
          : "border border-[#00205b]/40 bg-white text-[#00205b] hover:bg-[#edf0f3]"
      }`}
    >
      {action.label}
      <ChevronRight className={isPrimary ? "text-white" : "text-[#00205b]"} />
    </button>
  );
}

/**
 * Action-oriented allocation guidance — explains what the breakdown means
 * and what the client can do next. Adapts to portfolio and breakdown lens.
 */
export function AllocationInsightPanel({
  portfolioId,
  allMode,
  highlightRebalance,
  onAction,
  onLensChange,
}: {
  portfolioId: PortfolioId;
  allMode: AllAllocationMode;
  highlightRebalance?: boolean;
  onAction: (focus: HomeV2ContentFocus) => void;
  onLensChange: (mode: AllAllocationMode) => void;
}) {
  const insight = getAllocationInsight(portfolioId, allMode);
  const styles = allocationInsightStatusStyles(insight.status);

  const handleAction = (action: AllocationInsightAction) => {
    if (action.lens) {
      onLensChange(action.lens);
      return;
    }
    if (action.focus) {
      onAction(action.focus);
    }
  };

  return (
    <div className="flex h-full w-full max-w-[291px] flex-col justify-between gap-5">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <span
            className="inline-flex w-fit items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] leading-normal"
            style={{ backgroundColor: styles.bg, color: styles.text }}
          >
            <span
              className="size-[5px] shrink-0 rounded-full"
              style={{ backgroundColor: styles.dot }}
              aria-hidden
            />
            {insight.statusLabel}
          </span>
          <h3 className="font-display text-[15px] leading-normal text-[#07132a]">
            {insight.headline}
          </h3>
        </div>

        <p className="text-[13px] leading-[1.45] text-[#07132a]">{insight.summary}</p>

        {insight.drifts.length > 0 ? (
          <div className="flex flex-col gap-3 rounded-[6px] border border-[#dfe3e9] bg-white p-3">
            {insight.drifts.map((item) => (
              <DriftBar key={item.name} item={item} />
            ))}
          </div>
        ) : null}

        {highlightRebalance && portfolioId === "advisory" ? (
          <div className="rounded-[6px] border border-[#448de2]/30 bg-[#448de2]/[0.06] p-3">
            <p className="text-[11px] uppercase leading-normal text-[#3c4556]">CIO rebalance proposal</p>
            <ul className="mt-2 flex flex-col gap-1.5 text-[13px] leading-normal text-[#07132a]">
              <li>Sell $135K Vanguard FTSE All-World</li>
              <li>Buy $275K iShares Core US Aggregate Bond</li>
            </ul>
            <p className="mt-2 text-[11px] leading-normal text-[#3c4556]">
              Est. cost 0.08% · Restores 40% IG bond mandate
            </p>
          </div>
        ) : null}

        <p className="text-[12px] leading-[1.45] text-[#3c4556]">
          <span className="font-medium text-[#07132a]">What you can do: </span>
          {insight.implication}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {insight.showLensToggle ? (
          <LensToggle active={allMode} onChange={onLensChange} />
        ) : null}

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <InsightActionButton
            action={insight.primaryAction}
            variant="primary"
            onAction={handleAction}
          />
          <InsightActionButton
            action={insight.secondaryAction}
            variant="secondary"
            onAction={handleAction}
          />
        </div>
      </div>
    </div>
  );
}
