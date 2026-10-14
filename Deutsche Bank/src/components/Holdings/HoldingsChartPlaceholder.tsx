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
import type { PerformanceHistoryPoint } from "@/types/holdings";
import {
  formatHoldingsPrice,
  getHoldingsChartStrokeColor,
  getHoldingsChartXAxisTicks,
  getHoldingsChartYAxisConfig,
  HOLDINGS_CHART_AXIS_STYLE,
} from "./holdingsChartUtils";

interface HoldingsChartPlaceholderProps {
  data: PerformanceHistoryPoint[];
}

interface TooltipPayloadItem {
  value?: number;
  payload?: PerformanceHistoryPoint & { changePercent?: number };
}

function HoldingsChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  const point = payload[0]?.payload;
  const price = payload[0]?.value;
  if (price === undefined) return null;

  const changePercent = point?.changePercent;

  return (
    <div className="rounded-[6px] border border-[var(--db-border)] bg-white px-3 py-2 shadow-[var(--shadow-card)]">
      <p className="mb-1 text-[11px] text-[var(--db-muted)]">{label ?? point?.month}</p>
      <p className="text-[12px] font-medium text-[var(--db-primary)]">
        Price: {formatHoldingsPrice(price)}
      </p>
      {changePercent !== undefined && (
        <p
          className={`text-[11px] ${changePercent >= 0 ? "text-[var(--db-success)]" : "text-[#ff5040]"}`}
        >
          vs prior month: {changePercent >= 0 ? "+" : ""}
          {changePercent.toFixed(1)}%
        </p>
      )}
    </div>
  );
}

export function HoldingsChartPlaceholder({ data }: HoldingsChartPlaceholderProps) {
  const chartData = useMemo(() => {
    return data.map((point, index) => {
      const prev = index > 0 ? data[index - 1].value : point.value;
      const changePercent =
        prev === 0 ? 0 : ((point.value - prev) / prev) * 100;
      return { ...point, changePercent };
    });
  }, [data]);

  const strokeColor = useMemo(() => getHoldingsChartStrokeColor(data), [data]);
  const { domain, ticks: yTicks } = useMemo(
    () => getHoldingsChartYAxisConfig(data),
    [data],
  );
  const xTicks = useMemo(() => getHoldingsChartXAxisTicks(data), [data]);
  const fillColor =
    strokeColor === "var(--db-success)"
      ? "var(--db-success)"
      : strokeColor === "#ff5040"
        ? "#ff5040"
        : "var(--db-info)";

  return (
    <div
      className="flex min-h-[180px] max-h-[240px] w-full flex-1 flex-col overflow-hidden rounded-[6px] bg-white p-2.5"
      role="img"
      aria-label="12-month performance chart"
    >
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={chartData}
          margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
        >
          <CartesianGrid
            stroke="var(--db-border-secondary)"
            strokeDasharray="3 3"
            vertical={false}
          />
          <XAxis
            dataKey="month"
            ticks={xTicks}
            tick={HOLDINGS_CHART_AXIS_STYLE.tick}
            axisLine={HOLDINGS_CHART_AXIS_STYLE.axisLine}
            tickLine={HOLDINGS_CHART_AXIS_STYLE.tickLine}
            interval={0}
            minTickGap={20}
          />
          <YAxis
            tickFormatter={formatHoldingsPrice}
            tick={HOLDINGS_CHART_AXIS_STYLE.tick}
            axisLine={HOLDINGS_CHART_AXIS_STYLE.axisLine}
            tickLine={HOLDINGS_CHART_AXIS_STYLE.tickLine}
            width={52}
            domain={domain}
            ticks={yTicks}
          />
          <Tooltip
            content={<HoldingsChartTooltip />}
            cursor={{ stroke: "var(--db-border)", strokeWidth: 1 }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="none"
            fill={fillColor}
            fillOpacity={0.08}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={strokeColor}
            strokeWidth={2}
            dot={false}
            activeDot={{
              r: 4,
              fill: strokeColor,
              stroke: "#fff",
              strokeWidth: 2,
            }}
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export default HoldingsChartPlaceholder;
