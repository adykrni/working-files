"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import {
  getHoldingsSecurityDetails,
  useHoldingsData,
} from "@/hooks/useHoldingsData";
import { formatCurrencyParts, formatSignedPercent, percentColorClass } from "@/lib/format";
import type { PortfolioId } from "@/types/wealth";

export function DashboardV2HoldingsPanel({ portfolioId }: { portfolioId: PortfolioId }) {
  const { data, loading } = useHoldingsData("equities", portfolioId);
  const holdings = data?.holdings.slice(0, 5) ?? [];

  return (
    <motion.div
      key={`holdings-${portfolioId}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.1 }}
      className="flex min-h-0 flex-col"
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[13px] font-medium text-[var(--db-primary)]">Top holdings</h2>
        <button
          type="button"
          className="flex items-center gap-0.5 text-[12px] text-[var(--db-muted)] transition-colors hover:text-[var(--db-primary)]"
        >
          View all
          <ChevronRight size={14} strokeWidth={1.5} />
        </button>
      </div>

      {loading ? (
        <p className="text-[13px] text-[var(--db-muted)]">Loading…</p>
      ) : holdings.length === 0 ? (
        <p className="text-[13px] text-[var(--db-muted)]">No equity holdings for this portfolio.</p>
      ) : (
        <div className="divide-y divide-[var(--db-border)]">
          {holdings.map((security) => {
            const details = getHoldingsSecurityDetails("equities", security.id);
            const perf = details?.performance.ytdReturn ?? 0;
            const { whole, decimals } = formatCurrencyParts(security.currentValue);

            return (
              <div
                key={security.id}
                className="group flex items-center justify-between gap-3 py-2.5 transition-colors hover:bg-black/[0.015]"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] text-[var(--db-primary)]">{security.name}</p>
                  <p className="text-[11px] text-[var(--db-muted)]">{security.symbol}</p>
                </div>
                <div className="flex shrink-0 items-center gap-4 tabular-nums">
                  <span className="hidden text-[12px] text-[var(--db-muted)] sm:inline">
                    {whole}.{decimals}
                  </span>
                  <span className={`text-[13px] ${percentColorClass(perf)}`}>
                    {formatSignedPercent(perf)}
                  </span>
                  <ChevronRight
                    size={14}
                    className="text-[#cbd5e1] opacity-0 transition-opacity group-hover:opacity-100"
                    strokeWidth={1.5}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
