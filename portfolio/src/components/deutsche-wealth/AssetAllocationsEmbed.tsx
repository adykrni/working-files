"use client";

import { LayoutGroup } from "framer-motion";

import { AssetAllocations } from "@/components/AssetAllocations";
import { DashboardFocusLayer } from "@/components/layout/DashboardFocusLayer";
import { DashboardFocusProvider } from "@/context/DashboardFocusContext";

import "@/styles/deutsche-bank-embed.css";

export function AssetAllocationsEmbed() {
  return (
    <div className="db-embed h-full w-full">
      <DashboardFocusProvider>
        <LayoutGroup id="case-study-asset-allocations">
          <div className="flex h-full w-full items-center justify-center p-6 md:p-[75px]">
            <div className="w-[600px] shrink-0 origin-center scale-75">
              <AssetAllocations />
            </div>
          </div>
          <DashboardFocusLayer variant="prototype" />
        </LayoutGroup>
      </DashboardFocusProvider>
    </div>
  );
}
