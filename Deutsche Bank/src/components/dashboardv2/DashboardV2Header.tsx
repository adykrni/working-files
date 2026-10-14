"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { useDashboardPortfolio } from "@/context/DashboardPortfolioContext";
import { usePortfolioSummaries, usePortfolioSummary } from "@/hooks/usePortfolioSummary";
import { useWealthData } from "@/hooks/useWealthData";
import type { PortfolioId } from "@/types/wealth";

export function DashboardV2Header() {
  const { selectedPortfolioId, setSelectedPortfolioId } = useDashboardPortfolio();
  const summary = usePortfolioSummary(selectedPortfolioId);
  const summaries = usePortfolioSummaries();
  const { timestamp } = useWealthData();

  return (
    <header className="flex shrink-0 items-center justify-between border-b border-[var(--db-border)] px-4 py-3 sm:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button
          type="button"
          className="flex size-8 shrink-0 items-center justify-center rounded-md text-[var(--db-primary)] lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={18} strokeWidth={1.5} />
        </button>
        <div className="min-w-0 flex-1">
          <p className="hidden truncate text-[13px] text-[var(--db-muted)] sm:block">
            Wealth overview
            <span className="mx-1.5 text-[var(--db-border)]">/</span>
            <span className="text-[var(--db-primary)]">{summary.name}</span>
          </p>
          <select
            value={selectedPortfolioId}
            onChange={(e) => setSelectedPortfolioId(e.target.value as PortfolioId)}
            className="w-full max-w-[220px] rounded-md border border-[var(--db-border)] bg-white px-2 py-1.5 text-[13px] text-[var(--db-primary)] lg:hidden"
            aria-label="Select portfolio"
          >
            {summaries.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          <p className="mt-0.5 text-[11px] text-[#94a3b8]">{timestamp}</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <Link
          href="/dashboard"
          className="rounded-md border border-[var(--db-border)] px-2.5 py-1.5 text-[12px] text-[var(--db-muted)] transition-colors hover:border-[var(--db-primary)]/20 hover:text-[var(--db-primary)]"
        >
          Classic
        </Link>
      </div>
    </header>
  );
}
