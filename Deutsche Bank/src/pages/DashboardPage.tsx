"use client";

import {
  AssetClassAllocationSection,
  HoldingsSection,
  NetWealthSection,
  PerformanceSection,
  StandingOrdersSection,
} from "@/components/dashboard";
import { DashboardPortfolioProvider } from "@/context/DashboardPortfolioContext";

export default function DashboardPage() {
  return (
    <DashboardPortfolioProvider>
      <div className="flex w-full min-w-0 flex-col gap-[10px]">
        <NetWealthSection />
        <div className="grid w-full min-w-0 grid-cols-1 items-stretch gap-[10px] lg:grid-cols-[minmax(0,682fr)_minmax(280px,367fr)] lg:min-h-[433px]">
          <PerformanceSection />
          <AssetClassAllocationSection />
        </div>
        <HoldingsSection />
        <StandingOrdersSection />
      </div>
    </DashboardPortfolioProvider>
  );
}
