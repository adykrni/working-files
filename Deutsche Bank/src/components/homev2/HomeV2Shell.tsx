"use client";

import {
  DashboardPortfolioProvider,
  useDashboardPortfolio,
} from "@/context/DashboardPortfolioContext";
import { HomeV2HomeContent } from "./HomeV2HomeContent";
import { HomeV2PortfolioContent } from "./HomeV2PortfolioContent";
import { HomeV2Sidebar } from "./HomeV2Sidebar";

function HomeV2MainPanel() {
  const { activeView } = useDashboardPortfolio();
  return activeView === "home" ? <HomeV2HomeContent /> : <HomeV2PortfolioContent />;
}

export function HomeV2Shell() {
  return (
    <DashboardPortfolioProvider>
      <div className="fixed inset-0 overflow-hidden bg-[#f9fbfd]">
        <div className="flex h-full min-h-0 w-full">
          <HomeV2Sidebar />
          <HomeV2MainPanel />
        </div>
      </div>
    </DashboardPortfolioProvider>
  );
}
