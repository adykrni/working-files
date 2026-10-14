"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useStandingOrdersData } from "@/hooks/useStandingOrdersData";
import { formatCurrencyParts } from "@/lib/format";
import type { StandingOrderStatus } from "@/types/standingOrders";
import type { PortfolioId } from "@/types/wealth";

const STATUS_COLOR: Record<StandingOrderStatus, string> = {
  Filled: "#149d55",
  Pending: "#1a69de",
  Cancelled: "#94a3b8",
  Partial: "#f59e0b",
};

export function DashboardV2OrdersPanel({ portfolioId }: { portfolioId: PortfolioId }) {
  const { data } = useStandingOrdersData(portfolioId);
  const orders = data?.orders.slice(0, 4) ?? [];
  const showPortfolio = portfolioId === "all";

  return (
    <motion.section
      key={`orders-${portfolioId}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.12 }}
      className="px-6 py-6"
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[13px] font-medium text-[var(--db-primary)]">
          Open orders
          {orders.length > 0 ? (
            <span className="ml-2 text-[var(--db-muted)]">({orders.length})</span>
          ) : null}
        </h2>
        <button
          type="button"
          className="flex items-center gap-0.5 text-[12px] text-[var(--db-muted)] transition-colors hover:text-[var(--db-primary)]"
        >
          View all
          <ChevronRight size={14} strokeWidth={1.5} />
        </button>
      </div>

      {orders.length === 0 ? (
        <p className="text-[13px] text-[var(--db-muted)]">No open orders for this portfolio.</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-[var(--db-border)]">
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 border-b border-[var(--db-border)] bg-[#fafbfc] px-4 py-2 text-[11px] text-[var(--db-muted)] sm:grid-cols-[1fr_auto_auto_auto_auto]">
            <span>Security</span>
            {showPortfolio ? <span className="hidden sm:block">Portfolio</span> : null}
            <span className="text-right">Qty</span>
            <span className="text-right">Value</span>
            <span className="text-right">Status</span>
          </div>
          {orders.map((order, index) => {
            const { whole, decimals } = formatCurrencyParts(order.orderValue);
            return (
              <div
                key={order.id}
                className={`grid grid-cols-[1fr_auto_auto_auto] gap-4 px-4 py-3 text-[13px] sm:grid-cols-[1fr_auto_auto_auto_auto] ${
                  index < orders.length - 1 ? "border-b border-[var(--db-border)]" : ""
                } transition-colors hover:bg-black/[0.015]`}
              >
                <div className="min-w-0">
                  <p className="truncate text-[var(--db-primary)]">{order.security}</p>
                  <p className="text-[11px] capitalize text-[var(--db-muted)]">
                    {order.action.toLowerCase()}
                  </p>
                </div>
                {showPortfolio ? (
                  <span className="hidden self-center text-[12px] text-[var(--db-muted)] sm:block">
                    {order.portfolioLabel}
                  </span>
                ) : null}
                <span className="self-center tabular-nums text-[var(--db-primary)]">
                  {order.quantity}
                </span>
                <span className="self-center tabular-nums text-[12px] text-[var(--db-muted)]">
                  {whole}.{decimals}
                </span>
                <span className="flex items-center justify-end gap-1.5 self-center">
                  <span
                    className="size-1.5 rounded-full"
                    style={{ backgroundColor: STATUS_COLOR[order.status] }}
                    aria-hidden
                  />
                  <span className="text-[12px] text-[var(--db-primary)]">{order.status}</span>
                </span>
              </div>
            );
          })}
        </div>
      )}
    </motion.section>
  );
}
