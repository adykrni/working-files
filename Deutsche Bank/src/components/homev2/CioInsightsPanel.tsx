"use client";

import { useState } from "react";
import type { AllAllocationMode } from "@/context/DashboardPortfolioContext";
import type { HomeV2ContentFocus } from "@/hooks/useHomeV2HomeData";
import {
  getCioInsightSlides,
  type CioDriftBar,
  type CioInsightAction,
} from "@/hooks/useCioInsights";
import type { PortfolioId } from "@/types/wealth";
import { ChevronRight } from "./ui/homev2Ui";

const BAR_TRACK = "#eef3f7";

function DriftMeter({ drift }: { drift: CioDriftBar }) {
  const gap = drift.current - drift.target;
  const gapLabel =
    gap === 0
      ? "On target"
      : gap > 0
        ? `${gap}% above target`
        : `${Math.abs(gap)}% below target`;
  const gapColor = gap === 0 ? "text-[#6d7686]" : gap > 0 ? "text-[#de2b2e]" : "text-[#11810d]";
  const fillPct = Math.min(100, Math.max(0, (drift.current / Math.max(drift.target, drift.current, 1)) * 100));

  return (
    <div className="flex w-full flex-col gap-1.5">
      <div className="flex w-full items-center justify-between text-[10px] leading-normal whitespace-nowrap">
        <span className="text-[#07132a]">{drift.name}</span>
        <span className={gapColor}>{gapLabel}</span>
      </div>
      <div
        className="relative h-1.5 w-full overflow-hidden rounded-[6px]"
        style={{ backgroundColor: BAR_TRACK }}
      >
        <div
          className="h-full rounded-[6px]"
          style={{
            width: `${fillPct}%`,
            backgroundColor: drift.barColor ?? drift.color,
          }}
        />
      </div>
      <div className="flex w-full items-center justify-between text-[10px] leading-normal text-[#6d7686]">
        <span>Current {drift.current}%</span>
        <span>Target {drift.target}%</span>
      </div>
    </div>
  );
}

function InsightActionButton({
  action,
  variant,
  onAction,
}: {
  action: CioInsightAction;
  variant: "primary" | "secondary";
  onAction: (action: CioInsightAction) => void;
}) {
  const isPrimary = variant === "primary";
  return (
    <button
      type="button"
      onClick={() => onAction(action)}
      className={`flex items-center gap-1 rounded-[4px] px-2.5 py-1 text-[12px] leading-[1.4] ${
        isPrimary
          ? "bg-[#00205b] text-white"
          : "h-[25px] bg-[#eaecf2] py-0.5 text-[#132340]"
      }`}
    >
      {action.label}
      <ChevronRight className={isPrimary ? "size-3 text-white" : "size-3 text-[#132340]"} />
    </button>
  );
}

function DocumentIcon() {
  return (
    <svg width={12} height={12} viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d="M7 1H3.5A1.5 1.5 0 002 2.5v7A1.5 1.5 0 003.5 11h5A1.5 1.5 0 0010 9.5v-5L7 1z"
        stroke="#3c4556"
        strokeWidth={0.8}
      />
      <path d="M7 1v3h3" stroke="#3c4556" strokeWidth={0.8} />
    </svg>
  );
}

/** Figma 758:2290 — CIO Insights carousel panel */
export function CioInsightsPanel({
  portfolioId,
  allMode,
  onAction,
  onLensChange,
}: {
  portfolioId: PortfolioId;
  allMode: AllAllocationMode;
  onAction: (focus: HomeV2ContentFocus) => void;
  onLensChange: (mode: AllAllocationMode) => void;
}) {
  const slides = getCioInsightSlides(portfolioId, allMode);
  const [activeIndex, setActiveIndex] = useState(0);
  const slide = slides[activeIndex] ?? slides[0];

  const handleAction = (action: CioInsightAction) => {
    if (action.lens) {
      onLensChange(action.lens);
      return;
    }
    if (action.focus) {
      onAction(action.focus);
    }
  };

  return (
    <div className="flex h-full w-full flex-col items-center gap-2.5 self-stretch rounded-[6px] bg-[#f9f9f9] p-2.5">
      <div className="flex w-full flex-col gap-2.5">
        <div className="flex w-full items-center justify-between">
          <p className="font-display text-[12px] uppercase leading-[1.4] text-[#3c4556]">
            CIO Insights
          </p>
          <button
            type="button"
            className="flex size-5 items-center justify-center rounded-[2px]"
            aria-label="View insight documents"
          >
            <DocumentIcon />
          </button>
        </div>

        <div className="flex w-full flex-col gap-2.5 rounded-[6px] border border-[#e1e2e7] bg-white p-4">
          <div className="flex w-full flex-col gap-2.5">
            <p className="font-display text-[16px] leading-[1.4] text-[#07132a]">{slide.headline}</p>
            {slide.drift ? <DriftMeter drift={slide.drift} /> : null}
          </div>

          <div className="h-px w-full bg-[#dfe3e9]" />

          <div className="flex w-full flex-col gap-[30px]">
            <p className="text-[12px] leading-[1.4] text-[#07132a]">{slide.body}</p>
            <div className="flex flex-col gap-2">
              <InsightActionButton
                action={slide.primaryAction}
                variant="primary"
                onAction={handleAction}
              />
              <InsightActionButton
                action={slide.secondaryAction}
                variant="secondary"
                onAction={handleAction}
              />
            </div>
          </div>
        </div>
      </div>

      {slides.length > 1 ? (
        <div className="flex gap-1.5">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`size-1.5 rounded-full ${
                index === activeIndex ? "bg-[#00205b]" : "bg-[#b2bdd1]"
              }`}
              aria-label={`Insight ${index + 1} of ${slides.length}`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
