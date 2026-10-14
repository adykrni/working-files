"use client";

import { AnimatePresence } from "framer-motion";
import { DashboardPortfolioProvider, useDashboardPortfolio } from "@/context/DashboardPortfolioContext";
import { DashboardV2AllocationPanel } from "./DashboardV2AllocationPanel";
import { DashboardV2ChartSection } from "./DashboardV2ChartSection";
import { DashboardV2Header } from "./DashboardV2Header";
import { DashboardV2Hero } from "./DashboardV2Hero";
import { DashboardV2HoldingsPanel } from "./DashboardV2HoldingsPanel";
import { DashboardV2OrdersPanel } from "./DashboardV2OrdersPanel";
import { DashboardV2Sidebar } from "./DashboardV2Sidebar";

function DashboardV2Content() {
  const { selectedPortfolioId } = useDashboardPortfolio();

  return (
    <div className="flex h-full min-h-0 w-full">
      <DashboardV2Sidebar />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-white">
        <DashboardV2Header />
        <main className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain">
          <AnimatePresence mode="wait">
            <DashboardV2Hero key={`hero-${selectedPortfolioId}`} portfolioId={selectedPortfolioId} />
          </AnimatePresence>

          <div className="mx-6 border-t border-[var(--db-border)]" />

          <DashboardV2ChartSection portfolioId={selectedPortfolioId} />

          <div className="mx-6 border-t border-[var(--db-border)]" />

          <div className="grid gap-8 px-6 py-8 lg:grid-cols-2 lg:gap-12">
            <DashboardV2AllocationPanel portfolioId={selectedPortfolioId} />
            <DashboardV2HoldingsPanel portfolioId={selectedPortfolioId} />
          </div>

          <div className="mx-6 border-t border-[var(--db-border)]" />

          <DashboardV2OrdersPanel portfolioId={selectedPortfolioId} />
        </main>
      </div>
    </div>
  );
}

export function DashboardV2Shell() {
  return (
    <DashboardPortfolioProvider>
      <div className="fixed inset-0 overflow-hidden bg-white">
        <DashboardV2Content />
      </div>
    </DashboardPortfolioProvider>
  );
}
