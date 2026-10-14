"use client";

import { useMemo } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ReactElement } from "react";
import type { ChartDataPoint } from "@/types/goalMonitoring";
import {
  CHART_AXIS_STYLE,
  formatChartMonthLabel,
  formatYAxisTick,
  getChartXAxisTicks,
  getChartYAxisConfig,
  type GoalChartVariant,
} from "./chartUtils";

/** Toggle ±2σ volatility band on Level 2 charts */
const SHOW_VOLATILITY_BAND = false;

interface GoalChartCanvasProps {
  data: ChartDataPoint[];
  height?: number;
  animated?: boolean;
  tooltip?: ReactElement;
  variant?: GoalChartVariant;
}

type ChartDatum = ChartDataPoint & {
  /** Recharts range fill — [lowerBand, upperBand] */
  volatilityRange: [number, number];
};

/** Shared chart canvas — Level 1: actual + target. Level 2: band + target + actual. */
export function GoalChartCanvas({
  data,
  height = 264,
  animated = false,
  tooltip,
  variant = "level1",
}: GoalChartCanvasProps) {
  const showVolatilityBand = SHOW_VOLATILITY_BAND && variant === "level2";
  const chartData = useMemo<ChartDataPoint[] | ChartDatum[]>(() => {
    if (!showVolatilityBand) return data;
    return data.map((point) => ({
      ...point,
      volatilityRange: [point.lowerBand, point.upperBand],
    }));
  }, [data, showVolatilityBand]);
  const { domain, ticks } = getChartYAxisConfig(data, showVolatilityBand);
  const xTicks = getChartXAxisTicks(data);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart
        data={chartData}
        margin={{ top: 12, right: 28, left: 4, bottom: 4 }}
      >
        <CartesianGrid
          stroke="var(--db-border-secondary)"
          strokeDasharray="3 3"
          vertical
        />
        <XAxis
          dataKey="month"
          ticks={xTicks}
          tickFormatter={formatChartMonthLabel}
          tick={CHART_AXIS_STYLE.tick}
          axisLine={CHART_AXIS_STYLE.axisLine}
          tickLine={CHART_AXIS_STYLE.tickLine}
          interval={0}
          minTickGap={24}
        />
        <YAxis
          tickFormatter={formatYAxisTick}
          tick={CHART_AXIS_STYLE.tick}
          axisLine={CHART_AXIS_STYLE.axisLine}
          tickLine={CHART_AXIS_STYLE.tickLine}
          width={52}
          domain={domain}
          ticks={ticks}
        />
        {tooltip ? <Tooltip content={tooltip} /> : null}

        {/* Layer 1 (back): ±2σ envelope — flat fill + faint dashed bounds (Option C) */}
        {showVolatilityBand && (
          <>
            <Area
              type="linear"
              dataKey="volatilityRange"
              stroke="none"
              fill="var(--db-equities)"
              fillOpacity={0.08}
              tooltipType="none"
              isAnimationActive={animated}
              animationDuration={300}
              connectNulls
            />
            <Line
              type="linear"
              dataKey="lowerBand"
              stroke="var(--db-info)"
              strokeOpacity={0.3}
              strokeWidth={1}
              strokeDasharray="3 3"
              dot={false}
              isAnimationActive={false}
              connectNulls
            />
            <Line
              type="linear"
              dataKey="upperBand"
              stroke="var(--db-info)"
              strokeOpacity={0.3}
              strokeWidth={1}
              strokeDasharray="3 3"
              dot={false}
              isAnimationActive={false}
              connectNulls
            />
          </>
        )}

        {/* Layer 2: target trajectory */}
        <Line
          type="monotone"
          dataKey="target"
          stroke="var(--db-muted)"
          strokeWidth={1.5}
          strokeDasharray="4 4"
          dot={false}
          isAnimationActive={animated}
          animationDuration={300}
          connectNulls
        />

        {/* Layer 3 (front): actual portfolio line */}
        <Line
          type="monotone"
          dataKey="actual"
          stroke="var(--db-info)"
          strokeWidth={2}
          dot={false}
          isAnimationActive={animated}
          animationDuration={300}
          connectNulls
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

interface GoalChartProps {
  data: ChartDataPoint[];
  height?: number;
}

/** Level 1 — actual line + target line only */
export function GoalChart({ data, height = 264 }: GoalChartProps) {
  return (
    <div className="h-[264px] w-full" aria-hidden>
      <GoalChartCanvas data={data} height={height} variant="level1" />
    </div>
  );
}

export default GoalChart;
