"use client";

import { useMemo, useState } from "react";
import { useDashboardPortfolio } from "@/context/DashboardPortfolioContext";
import { usePerformanceData } from "@/hooks/usePerformanceData";
import { DashboardCard, DashboardSection } from "./DashboardSection";
import { PerformanceChart } from "./PerformanceChart";
import {
  filterPerformanceDataByPeriod,
  type PerformancePeriod,
} from "./performanceChartUtils";

const PERIODS: PerformancePeriod[] = ["1D", "5D", "1M", "6M", "1Y", "5Y", "MAX"];

export function PerformanceSection() {
  const [activePeriod, setActivePeriod] = useState<PerformancePeriod>("1Y");
  const { selectedPortfolioId } = useDashboardPortfolio();
  const portfolioData = usePerformanceData(selectedPortfolioId);

  const chartData = useMemo(
    () => filterPerformanceDataByPeriod(portfolioData, activePeriod),
    [portfolioData, activePeriod],
  );

  return (
    <DashboardSection
      title="Performance"
      fill
      titleRight={
        <div className="flex flex-wrap items-center gap-[4px]">
          {PERIODS.map((period) => (
            <button
              key={period}
              type="button"
              onClick={() => setActivePeriod(period)}
              className={`rounded-full px-2 py-0.5 text-[12px] leading-5 ${
                period === activePeriod
                  ? "border-[0.4px] border-solid border-[#00205b] bg-white text-[#00205b]"
                  : "bg-[#e6ecf3] text-[#535b61]"
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      }
      className="min-h-[433px] w-full min-w-0"
    >
      <DashboardCard className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <PerformanceChart data={chartData} fill />
      </DashboardCard>
    </DashboardSection>
  );
}
