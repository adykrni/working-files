"use client";

import { motion } from "framer-motion";
import type { ChartDataPoint, GoalTimeframe } from "@/types/goalMonitoring";
import { tabContentTransition } from "@/components/WealthOverview/motion";
import {
  filterChartDataByTimeframe,
  formatChartMonthLabel,
  formatChartTooltipValue,
} from "./chartUtils";
import { GoalChartCanvas } from "./GoalChart";

interface GoalChartInteractiveProps {
  data: ChartDataPoint[];
  timeframe: GoalTimeframe;
  chartKey?: string;
  height?: number;
}

interface TooltipPayloadItem {
  dataKey?: string;
  value?: number;
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  const actual = payload.find((item) => item.dataKey === "actual")?.value;
  const target = payload.find((item) => item.dataKey === "target")?.value;

  return (
    <div className="rounded-[6px] border border-[var(--db-border)] bg-white px-3 py-2 shadow-[var(--shadow-card)]">
      <p className="mb-1 text-[11px] text-[var(--db-muted)]">
        {label ? formatChartMonthLabel(String(label)) : ""}
      </p>
      {actual !== undefined && (
        <p className="text-[12px] text-[var(--db-primary)]">
          Growth: {formatChartTooltipValue(actual)}
        </p>
      )}
      {target !== undefined && (
        <p className="text-[12px] text-[var(--db-muted)]">
          Target: {formatChartTooltipValue(target)}
        </p>
      )}
    </div>
  );
}

/** Level 2 interactive chart — timeframe filtering + hover tooltips */
export function GoalChartInteractive({
  data,
  timeframe,
  chartKey,
  height = 264,
}: GoalChartInteractiveProps) {
  const filteredData = filterChartDataByTimeframe(data, timeframe);

  return (
    <motion.div
      key={`${chartKey ?? "chart"}-${timeframe}`}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={tabContentTransition}
      className="h-[264px] w-full"
    >
      <GoalChartCanvas
        data={filteredData}
        height={height}
        animated={false}
        tooltip={<ChartTooltip />}
        variant="level2"
      />
    </motion.div>
  );
}

export default GoalChartInteractive;
