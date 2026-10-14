"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
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
import type { ChartDataPoint } from "@/types/goalMonitoring";
import {
  CHART_AXIS_STYLE,
  formatChartMonthLabel,
  formatChartTooltipValue,
  formatYAxisTick,
  getChartXAxisTicks,
  getChartYAxisConfig,
} from "@/components/GoalMonitoring/chartUtils";

interface PerformanceChartProps {
  data: ChartDataPoint[];
  height?: number;
  /** Size to the height of the parent flex container */
  fill?: boolean;
  className?: string;
}

interface TooltipPayloadItem {
  dataKey?: string;
  value?: number;
}

function PerformanceTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  const portfolio = payload.find((item) => item.dataKey === "actual")?.value;
  const benchmark = payload.find((item) => item.dataKey === "target")?.value;

  return (
    <div className="rounded-[6px] border border-[var(--db-border)] bg-white px-3 py-2 shadow-[var(--shadow-card)]">
      <p className="mb-1 text-[11px] text-[var(--db-muted)]">
        {label ? formatChartMonthLabel(String(label)) : ""}
      </p>
      {portfolio !== undefined && (
        <p className="text-[12px] text-[var(--db-primary)]">
          Portfolio: {formatChartTooltipValue(portfolio)}
        </p>
      )}
      {benchmark !== undefined && (
        <p className="text-[12px] text-[var(--db-muted)]">
          Benchmark: {formatChartTooltipValue(benchmark)}
        </p>
      )}
    </div>
  );
}

function useChartHeight(enabled: boolean, fallback: number) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(fallback);

  useEffect(() => {
    if (!enabled) {
      setHeight(fallback);
      return;
    }

    const element = containerRef.current;
    if (!element) return;

    const updateHeight = () => {
      const nextHeight = element.clientHeight;
      if (nextHeight > 0) {
        setHeight(nextHeight);
      }
    };

    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(element);
    return () => observer.disconnect();
  }, [enabled, fallback]);

  return { containerRef, height };
}

/** All-portfolios performance — line with area fill, benchmark, and hover tooltip */
export function PerformanceChart({
  data,
  height: fixedHeight = 360,
  fill = false,
  className = "",
}: PerformanceChartProps) {
  const fillGradientId = useId();
  const { domain, ticks } = useMemo(() => getChartYAxisConfig(data), [data]);
  const xTicks = useMemo(() => getChartXAxisTicks(data), [data]);
  const { containerRef, height } = useChartHeight(fill, fixedHeight);
  const defaultTooltipIndex = Math.max(0, data.length - 1);

  return (
    <div
      ref={fill ? containerRef : undefined}
      className={`w-full ${fill ? "min-h-0 flex-1" : ""} ${className}`}
      style={fill ? undefined : { height: fixedHeight }}
    >
      {height > 0 ? (
        <ResponsiveContainer width="100%" height={height}>
        <ComposedChart
          data={data}
          margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id={fillGradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--db-info)" stopOpacity={0.18} />
              <stop offset="100%" stopColor="var(--db-info)" stopOpacity={0.02} />
            </linearGradient>
          </defs>

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
            width={48}
            domain={domain}
            ticks={ticks}
          />

          <Tooltip
            defaultIndex={defaultTooltipIndex}
            content={<PerformanceTooltip />}
            cursor={{ stroke: "var(--db-border-secondary)", strokeWidth: 1 }}
          />

          <Area
            type="monotone"
            dataKey="actual"
            stroke="none"
            fill={`url(#${fillGradientId})`}
            isAnimationActive={false}
            connectNulls
          />

          <Line
            type="monotone"
            dataKey="target"
            stroke="var(--db-muted)"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            dot={false}
            isAnimationActive={false}
            connectNulls
          />

          <Line
            type="monotone"
            dataKey="actual"
            stroke="var(--db-info)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: "var(--db-info)", stroke: "#fff", strokeWidth: 2 }}
            isAnimationActive={false}
            connectNulls
          />
        </ComposedChart>
      </ResponsiveContainer>
      ) : null}
    </div>
  );
}
