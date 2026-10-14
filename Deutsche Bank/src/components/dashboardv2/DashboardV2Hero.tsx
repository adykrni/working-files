"use client";

import { motion } from "framer-motion";
import { usePortfolioSummary } from "@/hooks/usePortfolioSummary";
import { formatCurrencyParts, percentColorClass } from "@/lib/format";
import type { PortfolioId } from "@/types/wealth";

const fade = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as const },
};

export function DashboardV2Hero({ portfolioId }: { portfolioId: PortfolioId }) {
  const summary = usePortfolioSummary(portfolioId);
  const { whole, decimals } = formatCurrencyParts(summary.value);

  return (
    <motion.section
      key={portfolioId}
      initial={fade.initial}
      animate={fade.animate}
      exit={fade.exit}
      transition={fade.transition}
      className="px-6 pt-8 pb-2"
    >
      <p className="mb-1 text-[13px] text-[var(--db-muted)]">{summary.name}</p>
      <div className="flex flex-wrap items-end gap-x-6 gap-y-2">
        <h1 className="font-display text-[36px] leading-none tracking-tight text-[var(--db-primary)] tabular-nums">
          {whole}
          <span className="text-[18px] text-[var(--db-muted)]">.{decimals}</span>
          <span className="ml-2 text-[14px] font-normal text-[#94a3b8]">{summary.currency}</span>
        </h1>
        <div className="flex items-center gap-4 pb-1">
          <MetricPill
            label="Period"
            value={`${summary.changePercentage >= 0 ? "+" : ""}${summary.changePercentage.toFixed(2)}%`}
            tone={summary.changePercentage}
          />
          <MetricPill
            label="YTD"
            value={`${summary.ytdPerformance >= 0 ? "+" : ""}${summary.ytdPerformance.toFixed(1)}%`}
            tone={summary.ytdPerformance}
          />
        </div>
      </div>
    </motion.section>
  );
}

function MetricPill({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: number;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] uppercase tracking-wide text-[#94a3b8]">{label}</span>
      <span className={`text-[15px] font-medium tabular-nums ${percentColorClass(tone)}`}>
        {value}
      </span>
    </div>
  );
}
