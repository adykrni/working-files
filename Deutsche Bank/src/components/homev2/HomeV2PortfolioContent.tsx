"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useDashboardPortfolio } from "@/context/DashboardPortfolioContext";
import type { HomeV2ContentFocus } from "@/hooks/useHomeV2HomeData";
import { usePerformanceData } from "@/hooks/usePerformanceData";
import { useStandingOrdersData } from "@/hooks/useStandingOrdersData";
import { ValuationChart } from "@/components/homev2/ValuationChart";
import { PortfolioCommandCard } from "@/components/homev2/PortfolioCommandCard";
import {
  PortfolioDetailsPanel,
  type PortfolioDetailsTab,
} from "@/components/homev2/PortfolioDetailsPanel";
import type { PortfolioId } from "@/types/wealth";
import { HOME_V2_PANEL_PADDING } from "./ui/homev2Ui";

const fade = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as const },
};

function focusToTab(focus: HomeV2ContentFocus | null): PortfolioDetailsTab {
  if (focus === "orders") return "orders";
  if (focus === "allocation" || focus === "rebalance") return "allocations";
  return "holdings";
}

function PerformanceSection({
  portfolioId,
  sectionRef,
}: {
  portfolioId: PortfolioId;
  sectionRef: React.RefObject<HTMLElement | null>;
}) {
  const data = usePerformanceData(portfolioId);

  return (
    <motion.section
      ref={sectionRef}
      {...fade}
      className="flex w-full scroll-mt-24 flex-col gap-5"
    >
      <h2 className="text-[14px] leading-normal text-[#07132a]">Performance</h2>
      <ValuationChart data={data} height={181} className="w-full" />
    </motion.section>
  );
}

export function HomeV2PortfolioContent() {
  const { selectedPortfolioId, allAllocationMode, setAllAllocationMode, contentFocus, setContentFocus } =
    useDashboardPortfolio();

  const [activeTab, setActiveTab] = useState<PortfolioDetailsTab>("holdings");
  const performanceRef = useRef<HTMLElement>(null);
  const detailsRef = useRef<HTMLElement>(null);

  const { data: ordersData } = useStandingOrdersData(selectedPortfolioId);
  const pendingCount =
    ordersData?.orders.filter((o) => o.status === "Pending").length ?? 0;

  useEffect(() => {
    if (contentFocus === "performance") {
      setActiveTab("holdings");
      requestAnimationFrame(() => {
        performanceRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      return;
    }

    if (contentFocus) {
      setActiveTab(focusToTab(contentFocus));
      requestAnimationFrame(() => {
        detailsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      return;
    }

    setActiveTab("holdings");
  }, [contentFocus, selectedPortfolioId]);

  const handleInsightAction = (focus: HomeV2ContentFocus) => {
    setContentFocus(focus);
  };

  return (
    <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-y-contain bg-white">
      <div className={`flex w-full min-h-full flex-col gap-10 ${HOME_V2_PANEL_PADDING}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedPortfolioId}-${allAllocationMode}`}
            className="flex w-full flex-col gap-10"
          >
            <PortfolioCommandCard
              portfolioId={selectedPortfolioId}
              onPrimary={handleInsightAction}
              onSecondary={handleInsightAction}
            />

            <PerformanceSection
              portfolioId={selectedPortfolioId}
              sectionRef={performanceRef}
            />

            <section ref={detailsRef} className="flex w-full scroll-mt-24 flex-col">
              <PortfolioDetailsPanel
                portfolioId={selectedPortfolioId}
                allMode={allAllocationMode}
                activeTab={activeTab}
                pendingCount={pendingCount}
                highlightMeta={
                  contentFocus === "holdings" && selectedPortfolioId === "execution"
                }
                highlightRebalance={
                  contentFocus === "rebalance" && selectedPortfolioId === "advisory"
                }
                onTabChange={(tab) => {
                  setActiveTab(tab);
                  setContentFocus(null);
                }}
                onAllocationAction={setContentFocus}
                onLensChange={setAllAllocationMode}
              />
            </section>
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
