"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { usePerformanceData } from "@/hooks/usePerformanceData";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import {
  filterPerformanceDataByPeriod,
  type PerformancePeriod,
} from "@/components/dashboard/performanceChartUtils";
import type { PortfolioId } from "@/types/wealth";

const PERIODS: PerformancePeriod[] = ["1M", "6M", "1Y", "5Y", "MAX"];

export function DashboardV2ChartSection({ portfolioId }: { portfolioId: PortfolioId }) {
  const [period, setPeriod] = useState<PerformancePeriod>("1Y");
  const raw = usePerformanceData(portfolioId);
  const data = useMemo(() => filterPerformanceDataByPeriod(raw, period), [raw, period]);

  return (
    <motion.section
      key={`chart-${portfolioId}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.05 }}
      className="px-6 pb-6"
    >
      <div className="mb-3 flex items-center justify-between gap-4">
        <h2 className="text-[13px] font-medium text-[var(--db-primary)]">Performance</h2>
        <div className="flex items-center gap-1">
          {PERIODS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={`rounded-md px-2 py-1 text-[12px] transition-colors ${
                p === period
                  ? "bg-[var(--db-primary)] text-white"
                  : "text-[var(--db-muted)] hover:bg-black/[0.04] hover:text-[var(--db-primary)]"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
      <div className="h-[280px] w-full">
        <PerformanceChart data={data} height={280} className="[&_.recharts-cartesian-grid]:opacity-50" />
      </div>
      <div className="mt-2 flex items-center gap-4 text-[11px] text-[var(--db-muted)]">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-4 rounded bg-[var(--db-info)]" />
          Portfolio
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-4 rounded border border-dashed border-[var(--db-muted)]" />
          Benchmark
        </span>
      </div>
    </motion.section>
  );
}
