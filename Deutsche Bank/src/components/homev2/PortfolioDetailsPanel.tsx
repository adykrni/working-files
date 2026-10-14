"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { AllAllocationMode } from "@/context/DashboardPortfolioContext";
import type { HomeV2ContentFocus } from "@/hooks/useHomeV2HomeData";
import {
  useHomeV2AllocationRows,
  useHomeV2HoldingsDisplay,
  useHomeV2OrdersVisibleLimit,
} from "@/hooks/useHomeV2Data";
import type { HomeV2AllocationRow } from "@/hooks/useHomeV2Data";
import { useStandingOrdersData } from "@/hooks/useStandingOrdersData";
import { formatCurrencyParts } from "@/lib/format";
import type { StandingOrder, StandingOrderAction, StandingOrderStatus } from "@/types/standingOrders";
import type { PortfolioId } from "@/types/wealth";
import { CioInsightsPanel } from "@/components/homev2/CioInsightsPanel";
import {
  allocationMetricCell,
  allocationNameCell,
  holdingsCell,
  ordersCell,
  ordersHeaderCell,
} from "@/components/homev2/ui/detailsTableLayout";
import { ChevronRight, SplitPercent } from "./ui/homev2Ui";

export type PortfolioDetailsTab = "holdings" | "allocations" | "orders";

const STATUS_DOT: Record<StandingOrderStatus, string> = {
  Filled: "#39c67c",
  Pending: "#dc4efc",
  Cancelled: "#e95252",
  Partial: "#f19317",
};

const ACTION_ICON: Record<StandingOrderAction, string> = {
  BUY: "/sidebar/order-buy.svg",
  SELL: "/sidebar/order-sell.svg",
  Reorder: "/sidebar/order-reorder.svg",
};

const tabFade = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] as const },
};

function formatSignedPercent(value: number): string {
  const formatted = `${Math.abs(value).toFixed(2)}%`;
  return value >= 0 ? `+${formatted}` : `-${formatted}`;
}

function DetailsTabs({
  activeTab,
  pendingCount,
  onChange,
}: {
  activeTab: PortfolioDetailsTab;
  pendingCount: number;
  onChange: (tab: PortfolioDetailsTab) => void;
}) {
  const tabs: { id: PortfolioDetailsTab; label: string; badge?: number }[] = [
    { id: "holdings", label: "Holdings" },
    { id: "allocations", label: "Allocations" },
    { id: "orders", label: "Standing orders", badge: pendingCount > 0 ? pendingCount : undefined },
  ];

  return (
    <div className="flex flex-wrap gap-1">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-1 text-[14px] leading-[1.4] transition-colors ${
              isActive
                ? "rounded-full bg-[#e6ecf3] px-3 py-1 text-[#07132a]"
                : "rounded-[4px] px-2.5 py-1 text-[#3c4556] hover:bg-black/[0.03]"
            }`}
          >
            {tab.label}
            {tab.badge !== undefined ? (
              <span className="rounded-full bg-[#1a69de] px-1.5 py-0.5 text-[10px] leading-[1.3] text-white">
                {tab.badge}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

function TradeActions() {
  return (
    <>
      <button
        type="button"
        className="flex h-[22px] w-[50px] items-center justify-center rounded-[4px] bg-[#00205b] px-2.5 text-[12px] leading-4 text-white"
      >
        Buy
      </button>
      <button
        type="button"
        className="flex h-[22px] w-[50px] items-center justify-center rounded-[4px] border border-[#00205b] bg-white px-2.5 text-[12px] leading-4 text-[#00205b]"
      >
        Sell
      </button>
    </>
  );
}

function HoldingsPanel({
  portfolioId,
  highlightMeta,
}: {
  portfolioId: PortfolioId;
  highlightMeta?: boolean;
}) {
  const { holdings, totalCount, hasMore } = useHomeV2HoldingsDisplay(portfolioId);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const rowBg = (index: number) => {
    const holding = holdings[index];
    const highlighted = highlightMeta && holding.name.includes("Meta");
    const isHovered = hoveredIndex === index;
    return highlighted ? "bg-[#448de2]/[0.06]" : isHovered ? "bg-[#f9fbfd]" : "";
  };

  return (
    <div className="flex w-full flex-col" onMouseLeave={() => setHoveredIndex(null)}>
      <div className="flex w-full">
        <div className="flex min-w-0 flex-1 flex-col">
          {holdings.map((holding, index) => (
            <div
              key={`name-${holding.name}`}
              className={`${holdingsCell.name} ${rowBg(index)}`}
              onMouseEnter={() => setHoveredIndex(index)}
            >
              <p className="truncate text-[14px] leading-[1.4] text-[#07132a]">{holding.name}</p>
            </div>
          ))}
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          {holdings.map((holding, index) => {
            const { whole, decimals } = formatCurrencyParts(holding.value);
            return (
              <div
                key={`val-${holding.name}`}
                className={`${holdingsCell.value} ${rowBg(index)}`}
                onMouseEnter={() => setHoveredIndex(index)}
              >
                <p className="whitespace-nowrap text-[14px] leading-[1.4] tabular-nums text-[#3c4556]">
                  {whole}.{decimals}
                </p>
              </div>
            );
          })}
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          {holdings.map((holding, index) => {
            const changeColor = holding.change >= 0 ? "text-[#11810d]" : "text-[#d72735]";
            return (
              <div
                key={`chg-${holding.name}`}
                className={`${holdingsCell.change} ${rowBg(index)}`}
                onMouseEnter={() => setHoveredIndex(index)}
              >
                <p className={`whitespace-nowrap text-[14px] leading-[1.4] tabular-nums ${changeColor}`}>
                  {formatSignedPercent(holding.change)}
                </p>
              </div>
            );
          })}
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          {holdings.map((holding, index) => (
            <div
              key={`act-${holding.name}`}
              className={`${holdingsCell.actions} ${rowBg(index)}`}
              onMouseEnter={() => setHoveredIndex(index)}
            >
              {hoveredIndex === index ? <TradeActions /> : null}
            </div>
          ))}
        </div>
      </div>
      {hasMore ? <ViewAllLink label={`View all ${totalCount} holdings`} /> : null}
    </div>
  );
}

function AllocationValueCell({ value }: { value: number }) {
  const { whole, decimals } = formatCurrencyParts(value);
  return (
    <span className="font-display text-[#07132a]">
      <span className="text-[14px] leading-[1.4]">{whole}.</span>
      <span className="text-[10px] leading-[1.4]">{decimals}</span>
    </span>
  );
}

function AllocationSection({
  title,
  rows,
}: {
  title: string;
  rows: HomeV2AllocationRow[];
}) {
  return (
    <div className="flex w-full flex-col gap-2.5">
      <p className="font-display text-[12px] uppercase leading-[1.4] text-[#3c4556]">{title}</p>
      <div className="flex w-full items-start">
        <div className="flex min-w-0 flex-1 flex-col">
          {rows.map((row) => (
            <div key={`${title}-name-${row.name}`} className={allocationNameCell}>
              <span
                className="size-[6px] shrink-0 rounded-full"
                style={{ backgroundColor: row.color }}
                aria-hidden
              />
              <span className="truncate text-[14px] leading-normal text-[#07132a]">{row.name}</span>
            </div>
          ))}
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          {rows.map((row) => (
            <div key={`${title}-pct-${row.name}`} className={allocationMetricCell}>
              <SplitPercent value={row.percent} className="text-[#07132a]" />
            </div>
          ))}
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          {rows.map((row) => (
            <div key={`${title}-val-${row.name}`} className={allocationMetricCell}>
              <AllocationValueCell value={row.value} />
            </div>
          ))}
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          {rows.map((row) => (
            <div key={`${title}-chg-${row.name}`} className={allocationMetricCell}>
              <SplitPercent
                value={row.change}
                className={row.change >= 0 ? "text-[#11810d]" : "text-[#e31616]"}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AllocationsPanel({
  portfolioId,
  allMode,
  onAllocationAction,
  onLensChange,
}: {
  portfolioId: PortfolioId;
  allMode: AllAllocationMode;
  onAllocationAction: (focus: HomeV2ContentFocus) => void;
  onLensChange: (mode: AllAllocationMode) => void;
}) {
  const { assetClass, secondary, secondaryLabel } = useHomeV2AllocationRows(portfolioId, allMode);

  return (
    <div className="flex w-full items-start gap-5">
      <div className="flex min-w-[280px] flex-[350] self-stretch">
        <CioInsightsPanel
          portfolioId={portfolioId}
          allMode={allMode}
          onAction={onAllocationAction}
          onLensChange={onLensChange}
        />
      </div>
      <div className="flex min-w-0 flex-[505] flex-col gap-[21px]">
        <AllocationSection title="ASSET CLASSES" rows={assetClass} />
        <AllocationSection title={secondaryLabel} rows={secondary} />
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: StandingOrderStatus }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#f3f3f3] px-1.5 py-0.5">
      <span
        className="size-[6px] shrink-0 rounded-[4px]"
        style={{ backgroundColor: STATUS_DOT[status] }}
        aria-hidden
      />
      <span className="whitespace-nowrap text-[12px] leading-normal text-[#07132a]">{status}</span>
    </span>
  );
}

function ActionCell({ action }: { action: StandingOrderAction }) {
  const label = action.charAt(0).toUpperCase() + action.slice(1).toLowerCase();
  return (
    <>
      <span className="whitespace-nowrap text-[14px] leading-normal text-[#07132a]">{label}</span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={ACTION_ICON[action]} alt="" width={14} height={14} className="block shrink-0" />
    </>
  );
}

function ViewAllLink({ label }: { label: string }) {
  return (
    <div className="flex w-full justify-center pt-1">
      <button
        type="button"
        className="flex items-center gap-0.5 text-[14px] leading-normal text-[#3c4556] transition-colors hover:text-[#00205b]"
      >
        {label}
        <ChevronRight className="text-[#3c4556]" />
      </button>
    </div>
  );
}

function OrderValueCell({ value }: { value: number }) {
  const { whole, decimals } = formatCurrencyParts(value);
  return (
    <p className="whitespace-nowrap font-display text-[#07132a]">
      <span className="text-[14px] leading-[1.4]">{whole}.</span>
      <span className="text-[10px] leading-[1.4]">{decimals}</span>
    </p>
  );
}

function StandingOrdersPanel({
  portfolioId,
}: {
  portfolioId: PortfolioId;
}) {
  const visibleLimit = useHomeV2OrdersVisibleLimit(portfolioId);
  const { data, totalCount } = useStandingOrdersData(portfolioId);
  const allOrders = data?.orders ?? [];
  const orders = allOrders.slice(0, visibleLimit);
  const hasMore = totalCount > orders.length;

  return (
    <div className="flex w-full flex-col gap-2.5 pt-2.5">
      <div className="flex w-full">
        <div className="flex w-[9px] shrink-0 flex-col">
          <div className={ordersHeaderCell.dot} aria-hidden />
          {orders.map((order) => (
            <div key={`dot-${order.id}`} className={ordersCell.dot}>
                {order.status === "Pending" ? (
                  <span className="size-[5px] rounded-full bg-[#1a69de]" aria-hidden />
                ) : null}
              </div>
            ))}
          </div>
          <div className="flex min-w-0 flex-[256] flex-col">
            <div className={ordersHeaderCell.security}>
              <p className="text-[10px] uppercase leading-normal text-[#3c4556]">Security</p>
            </div>
            {orders.map((order) => (
              <div key={`sec-${order.id}`} className={ordersCell.security}>
                <p className="truncate text-[14px] leading-[1.4] text-[#07132a]">{order.security}</p>
              </div>
            ))}
          </div>
          <div className="flex min-w-0 flex-[130] flex-col">
            <div className={ordersHeaderCell.metric}>
              <p className="text-[10px] uppercase leading-normal text-[#3c4556]">Quantity</p>
            </div>
            {orders.map((order) => (
              <div key={`qty-${order.id}`} className={ordersCell.metric}>
                <p className="whitespace-nowrap text-[14px] leading-[1.4] tabular-nums text-[#3c4556]">
                  {order.quantity}
                </p>
              </div>
            ))}
          </div>
          <div className="flex min-w-0 flex-[130] flex-col">
            <div className={ordersHeaderCell.metric}>
              <p className="text-[10px] uppercase leading-normal text-[#3c4556]">Order price</p>
            </div>
            {orders.map((order) => (
              <div key={`price-${order.id}`} className={ordersCell.metric}>
                <p className="whitespace-nowrap text-[14px] leading-[1.4] tabular-nums text-[#07132a]">
                  {order.orderPrice.replace(/[^\d.,]/g, "")}
                </p>
              </div>
            ))}
          </div>
          <div className="flex min-w-0 flex-[130] flex-col">
            <div className={ordersHeaderCell.metric}>
              <p className="text-[10px] uppercase leading-normal text-[#3c4556]">Order value</p>
            </div>
            {orders.map((order) => (
              <div key={`val-${order.id}`} className={ordersCell.metric}>
                <OrderValueCell value={order.orderValue} />
              </div>
            ))}
          </div>
          <div className="flex min-w-0 flex-[130] flex-col">
            <div className={ordersHeaderCell.status}>
              <p className="text-[10px] uppercase leading-normal text-[#3c4556]">Status</p>
            </div>
            {orders.map((order) => (
              <div key={`status-${order.id}`} className={ordersCell.status}>
                <StatusBadge status={order.status} />
              </div>
            ))}
          </div>
          <div className="flex min-w-0 flex-[100] flex-col">
            <div className={ordersHeaderCell.action}>
              <p className="text-[10px] uppercase leading-normal text-[#3c4556]">CIO advice</p>
            </div>
            {orders.map((order) => (
              <div key={`action-${order.id}`} className={ordersCell.action}>
                <ActionCell action={order.action} />
              </div>
            ))}
          </div>
        </div>

      {hasMore ? (
        <ViewAllLink label={`View all ${totalCount} order${totalCount === 1 ? "" : "s"}`} />
      ) : null}
    </div>
  );
}

export function PortfolioDetailsPanel({
  portfolioId,
  allMode,
  activeTab,
  pendingCount,
  highlightMeta,
  onTabChange,
  onAllocationAction,
  onLensChange,
}: {
  portfolioId: PortfolioId;
  allMode: AllAllocationMode;
  activeTab: PortfolioDetailsTab;
  pendingCount: number;
  highlightMeta?: boolean;
  highlightRebalance?: boolean;
  onTabChange: (tab: PortfolioDetailsTab) => void;
  onAllocationAction: (focus: HomeV2ContentFocus) => void;
  onLensChange: (mode: AllAllocationMode) => void;
}) {
  return (
    <div className="flex w-full flex-col gap-5">
      <DetailsTabs activeTab={activeTab} pendingCount={pendingCount} onChange={onTabChange} />

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} {...tabFade} className="w-full">
          {activeTab === "holdings" ? (
            <HoldingsPanel portfolioId={portfolioId} highlightMeta={highlightMeta} />
          ) : null}
          {activeTab === "allocations" ? (
            <AllocationsPanel
              portfolioId={portfolioId}
              allMode={allMode}
              onAllocationAction={onAllocationAction}
              onLensChange={onLensChange}
            />
          ) : null}
          {activeTab === "orders" ? (
            <StandingOrdersPanel portfolioId={portfolioId} />
          ) : null}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
