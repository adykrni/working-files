"use client";

import { LayoutGroup } from "framer-motion";

import { DashboardFocusLayer } from "@/components/layout/DashboardFocusLayer";
import { WealthOverview } from "@/components/WealthOverview";
import { DashboardFocusProvider } from "@/context/DashboardFocusContext";

import "@/styles/deutsche-bank-embed.css";

export function WealthOverviewEmbed() {
  return (
    <div className="db-embed h-full w-full">
      <DashboardFocusProvider>
        <LayoutGroup id="case-study-wealth-overview">
          <div className="flex h-full w-full items-center justify-center p-6 md:p-[75px]">
            <div className="w-[700px] shrink-0 origin-center scale-75">
              <WealthOverview />
            </div>
          </div>
          <DashboardFocusLayer variant="prototype" />
        </LayoutGroup>
      </DashboardFocusProvider>
    </div>
  );
}
