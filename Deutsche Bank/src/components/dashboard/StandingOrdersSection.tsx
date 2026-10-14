"use client";

import { Fragment } from "react";
import { useDashboardPortfolio } from "@/context/DashboardPortfolioContext";
import { useStandingOrdersData } from "@/hooks/useStandingOrdersData";
import { formatCurrencyParts } from "@/lib/format";
import type { StandingOrder, StandingOrderAction, StandingOrderStatus } from "@/types/standingOrders";

const TABLE_CARD_SHADOW =
  "0px 0.5px 1px 0px rgba(0,32,91,0.1), 0px 1px 0px -1px rgba(0,32,91,0.2), 0px 0px 0px 0.5px rgba(0,32,91,0.2)";

const TABLE_ROW = "flex w-full shrink-0 items-center";

const HEADER_CLASS = "min-w-0 flex-[1_0_0] text-[10px] uppercase leading-normal text-[#5b606a]";
const CELL_CLASS = "min-w-0 flex-[1_0_0] text-[14px] leading-[1.4] text-[#00205b]";
const QUANTITY_OFFSET = "ml-[65px]";

const STATUS_DOT: Record<StandingOrderStatus, string> = {
  Filled: "#149d55",
  Pending: "#1a69de",
  Cancelled: "#e95252",
  Partial: "#f19317",
};

const ACTION_ICON: Record<StandingOrderAction, string> = {
  BUY: "/sidebar/order-buy.svg",
  SELL: "/sidebar/order-sell.svg",
  Reorder: "/sidebar/order-reorder.svg",
};

function formatActionLabel(action: StandingOrderAction): string {
  return action.charAt(0).toUpperCase() + action.slice(1).toLowerCase();
}

function SplitOrderPrice({ orderPrice }: { orderPrice: string }) {
  const match = orderPrice.match(/^([\d.,]+)\s*(.+)$/);
  if (!match) {
    return <span className={CELL_CLASS}>{orderPrice}</span>;
  }
  const [, amount, currency] = match;
  return (
    <span className={`${CELL_CLASS} leading-normal`}>
      <span className="text-[14px] leading-normal">{amount} </span>
      <span className="text-[10px] leading-normal">{currency}</span>
    </span>
  );
}

function SplitOrderValue({ value, currency }: { value: number; currency: string }) {
  const { whole, decimals } = formatCurrencyParts(value);
  return (
    <span className={`${CELL_CLASS} leading-normal`}>
      <span className="text-[14px] leading-normal">{whole}.</span>
      <span className="text-[10px] leading-normal">
        {decimals} {currency}
      </span>
    </span>
  );
}

function TableHeader({ showPortfolio }: { showPortfolio: boolean }) {
  return (
    <div className={`${TABLE_ROW} shrink-0`}>
      <span className={HEADER_CLASS}>Security</span>
      <span className={`${HEADER_CLASS} ${QUANTITY_OFFSET}`}>Quantity</span>
      <span className={HEADER_CLASS}>Order price</span>
      <span className={HEADER_CLASS}>Order value</span>
      {showPortfolio ? (
        <span className="w-[100px] shrink-0 text-[10px] uppercase leading-normal text-[#5b606a]">
          Portfolio
        </span>
      ) : null}
      <span className="w-[160px] shrink-0 text-[10px] uppercase leading-normal text-[#5b606a]">
        Status
      </span>
      <span className="w-[70px] shrink-0 text-[10px] uppercase leading-normal text-[#5b606a]">
        Action
      </span>
    </div>
  );
}

function StatusBadge({ status }: { status: StandingOrderStatus }) {
  return (
    <div className="flex w-[160px] shrink-0 items-center justify-start">
      <span className="inline-flex items-center gap-1 rounded-full bg-[#f3f3f3] px-1.5 py-0.5">
        <span
          className="size-[6px] shrink-0 rounded-[4px]"
          style={{ backgroundColor: STATUS_DOT[status] }}
          aria-hidden
        />
        <span className="whitespace-nowrap text-[12px] leading-normal text-[#1f2838]">
          {status}
        </span>
      </span>
    </div>
  );
}

function ActionCell({ action }: { action: StandingOrderAction }) {
  return (
    <div className="flex w-[70px] shrink-0 items-center gap-1">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={ACTION_ICON[action]}
        alt=""
        width={14}
        height={14}
        aria-hidden
        className="block shrink-0"
      />
      <span className="whitespace-nowrap text-[12px] leading-normal text-[#1f2838]">
        {formatActionLabel(action)}
      </span>
    </div>
  );
}

function OrderRow({ order, showPortfolio }: { order: StandingOrder; showPortfolio: boolean }) {
  return (
    <div className={TABLE_ROW}>
      <span className={`${CELL_CLASS} truncate`}>{order.security}</span>
      <span className={`${CELL_CLASS} ${QUANTITY_OFFSET}`}>{order.quantity}</span>
      <SplitOrderPrice orderPrice={order.orderPrice} />
      <SplitOrderValue value={order.orderValue} currency={order.currency} />
      {showPortfolio ? (
        <span className="w-[100px] shrink-0 truncate text-[14px] leading-[1.4] text-[#00205b]">
          {order.portfolioLabel}
        </span>
      ) : null}
      <StatusBadge status={order.status} />
      <ActionCell action={order.action} />
    </div>
  );
}

function RowDivider() {
  return <div className="h-px w-full shrink-0 bg-[#dee3ec]" aria-hidden />;
}

/** Standing orders table — Figma node 680:1765 */
export function StandingOrdersSection() {
  const { selectedPortfolioId } = useDashboardPortfolio();
  const { data, loading, error } = useStandingOrdersData(selectedPortfolioId);
  const showPortfolio = selectedPortfolioId === "all";

  return (
    <section className="flex min-h-[328px] w-full min-w-0 flex-col gap-[8px] rounded-[10px] bg-[#f5f7f9] p-[6px]">
      <div className="flex w-full shrink-0 items-center py-[2px] pr-0.5 pl-[6px]">
        <h2 className="font-display text-[14px] leading-normal text-[#00205b]">Standing orders</h2>
      </div>

      <div
        className="flex min-h-0 w-full flex-1 flex-col gap-[10px] overflow-hidden rounded-[6px] bg-white p-[10px]"
        style={{ boxShadow: TABLE_CARD_SHADOW }}
      >
        <TableHeader showPortfolio={showPortfolio} />

        {loading ? (
          <p className="text-[14px] text-[var(--db-muted)]">Loading standing orders…</p>
        ) : error || !data ? (
          <p className="text-[14px] text-red-600">{error ?? "Unable to load standing orders."}</p>
        ) : data.orders.length === 0 ? (
          <p className="text-[14px] text-[var(--db-muted)]">
            No standing orders for the selected portfolio.
          </p>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col justify-between">
            {data.orders.map((order, index) => (
              <Fragment key={order.id}>
                <OrderRow order={order} showPortfolio={showPortfolio} />
                {index < data.orders.length - 1 ? <RowDivider /> : null}
              </Fragment>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
