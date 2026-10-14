"use client";

import { useState } from "react";
import type { ChartRange } from "@/data/portfoliosHomeData";
import { DEFAULT_BENCHMARK_ID, getWealthBenchmark, type WealthBenchmarkId } from "@/data/wealthBenchmarks";
import { HeroMetricsColumn } from "./HeroMetricsColumn";
import { IndexedComparisonChart } from "./IndexedComparisonChart";
import { heroModuleClassName } from "./heroModuleStyles";

export function SummaryMetricsCard() {
  const [range, setRange] = useState<ChartRange>("YTD");
  const [benchmarkId, setBenchmarkId] = useState<WealthBenchmarkId>(DEFAULT_BENCHMARK_ID);
  const benchmark = getWealthBenchmark(benchmarkId);

  return (
    <div className="flex w-full flex-col gap-2.5 lg:h-[320px] lg:flex-row lg:items-stretch">
      <HeroMetricsColumn />

      <div className={`${heroModuleClassName} min-w-0 flex-1 flex-col p-[16px]`}>
        <IndexedComparisonChart
          range={range}
          onRangeChange={setRange}
          benchmarkId={benchmarkId}
          onBenchmarkChange={setBenchmarkId}
          benchmarkLabel={benchmark.shortName}
        />
      </div>
    </div>
  );
}
