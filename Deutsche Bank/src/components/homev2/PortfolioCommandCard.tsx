"use client";

import { motion } from "framer-motion";
import type { HomeV2ContentFocus } from "@/hooks/useHomeV2HomeData";
import {
  getPortfolioInsight,
  getPortfolioMetrics,
  getPortfolioSummary,
} from "@/hooks/useHomeV2HomeData";
import { formatSignedPercentTab } from "@/lib/format";
import type { PortfolioId } from "@/types/wealth";
import { ChevronRight, CommandMetricRow, PANEL_SHADOW } from "./ui/homev2Ui";

const fade = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as const },
};

function TrendUpIcon({ className = "" }: { className?: string }) {
  return (
    <svg width={18} height={18} viewBox="0 0 18 18" fill="none" aria-hidden className={className}>
      <path
        d="M3 13L8 8L11 11L15 5"
        stroke="currentColor"
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11 5H15V9"
        stroke="currentColor"
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrendDownIcon({ className = "" }: { className?: string }) {
  return (
    <svg width={18} height={18} viewBox="0 0 18 18" fill="none" aria-hidden className={className}>
      <path
        d="M3 5L8 10L11 7L15 13"
        stroke="currentColor"
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11 13H15V9"
        stroke="currentColor"
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Figma 732:2974 — combined metrics + insight command card */
export function PortfolioCommandCard({
  portfolioId,
  onPrimary,
  onSecondary,
}: {
  portfolioId: PortfolioId;
  onPrimary: (focus: HomeV2ContentFocus) => void;
  onSecondary: (focus: HomeV2ContentFocus) => void;
}) {
  const metrics = getPortfolioMetrics(portfolioId);
  const insight = getPortfolioInsight(portfolioId);
  const summary = getPortfolioSummary(portfolioId);
  const isPositive = summary.changeYtd >= 0;
  const ytdColor = isPositive ? "text-[#2ba13f]" : "text-[#d72735]";

  const metricRows = [
    { label: "Market value", value: metrics.marketValue },
    { label: "Net asset value", value: metrics.netAssetValue },
    { label: "Liabilities", value: metrics.liabilities },
    { label: "Cash", value: metrics.cash },
    { label: "Available borrowing", value: metrics.availableBorrowing },
  ];

  return (
    <motion.div
      {...fade}
      className="flex w-full flex-col gap-[30px] overflow-hidden rounded-[8px] bg-[#fafbfd] p-5 lg:flex-row lg:items-stretch"
      style={{ boxShadow: PANEL_SHADOW }}
    >
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-4">
        {metricRows.map((row) => (
          <CommandMetricRow key={row.label} label={row.label} value={row.value} />
        ))}
      </div>

      <div className="hidden w-px shrink-0 self-stretch bg-[#dce4f3] lg:block" aria-hidden />

      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <div className={`flex items-center gap-1 ${ytdColor}`}>
            <span className="text-[14px] leading-[1.3]">
              {formatSignedPercentTab(summary.changeYtd)}
            </span>
            {isPositive ? <TrendUpIcon /> : <TrendDownIcon />}
          </div>
          <h2 className="font-display text-[16px] leading-normal text-[#07132a]">
            {insight.headline}
          </h2>
        </div>

        <p className="text-[14px] leading-[1.4] text-[#07132a]">{insight.summary}</p>

        <div className="flex flex-wrap gap-4">
          <button
            type="button"
            onClick={() => onPrimary(insight.primaryAction.focus)}
            className="flex items-center gap-2.5 rounded-[4px] bg-[#00205b] px-2.5 py-1.5 text-[14px] leading-[1.4] text-white transition-opacity hover:opacity-90"
          >
            {insight.primaryAction.label}
            <ChevronRight className="text-white" />
          </button>
          <button
            type="button"
            onClick={() => onSecondary(insight.secondaryAction.focus)}
            className="flex items-center gap-2.5 rounded-[4px] border border-[#00205b]/40 bg-white px-2.5 py-1.5 text-[14px] leading-[1.4] text-[#00205b] transition-colors hover:bg-[#edf0f3]"
          >
            {insight.secondaryAction.label}
            <ChevronRight className="text-[#00205b]" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
