"use client";

import { PORTFOLIO_ROWS } from "@/data/portfoliosHomeData";
import { PortfolioSparkline } from "./PortfolioSparkline";
import { SidebarBrandHeader } from "./SidebarBrandHeader";

type SidebarProps = {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
  onNewPortfolio?: () => void;
};

const ICON = {
  home: "/sidebar/homev2/home-default.svg",
  markets: "/sidebar/homev2/markets.svg",
  news: "/sidebar/homev2/news.svg",
  reports: "/sidebar/homev2/reports.svg",
  transactions: "/sidebar/homev2/transactions.svg",
  notifications: "/sidebar/homev2/notifications.svg",
  messages: "/sidebar/homev2/messages.svg",
  folder: "/sidebar/homev2/portfolio-folder-default.svg",
  chevrons: "/sidebar/chevrons-up-down.svg",
  newPortfolio: "/sidebar/homev2/quick-action-new-portfolio.svg",
  standingOrder: "/sidebar/homev2/quick-action-standing-order.svg",
  payment: "/sidebar/homev2/quick-action-payment.svg",
} as const;

const PRIMARY_NAV = [
  { id: "home", label: "Home", icon: ICON.home, active: true },
  { id: "markets", label: "Markets", icon: ICON.markets },
  { id: "news", label: "News", icon: ICON.news },
  { id: "reports", label: "Reports", icon: ICON.reports },
  { id: "transactions", label: "Transactions", icon: ICON.transactions },
  { id: "notifications", label: "Notifications", icon: ICON.notifications, status: "17+" },
  { id: "messages", label: "Messages", icon: ICON.messages, status: "4 new" },
] as const;

const QUICK_ACTIONS = [
  { id: "new-portfolio", label: "New portfolio", icon: ICON.newPortfolio },
  { id: "standing-order", label: "Standing order", icon: ICON.standingOrder },
  { id: "payment", label: "Payment", icon: ICON.payment },
] as const;

const SIDEBAR_PORTFOLIOS = PORTFOLIO_ROWS.filter((row) => !row.isTotalRow);

const SIDEBAR_FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00205b]/35";
const SIDEBAR_ICON_NAV = 14;
const SIDEBAR_ICON_LIST = 14;
const SIDEBAR_TEXT_NAV = "text-[12px] leading-[1.35]";
const SIDEBAR_SECTION_LABEL = "text-[12px] leading-none text-[#3c4556]";
const SIDEBAR_NAV_ROW_H = "flex h-7 w-full items-center rounded-[4px] px-2 text-left transition-colors";

function SidebarIcon({ src, size = SIDEBAR_ICON_NAV }: { src: string; size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" width={size} height={size} aria-hidden className="block shrink-0" />
  );
}

function formatDayMovementPct(pct: number) {
  const sign = pct >= 0 ? "+" : "−";
  return `${sign}${Math.abs(pct).toFixed(2)}%`;
}

/** Figma 1034:3610 — sidebar column (211px). No invented chrome beyond file nodes. */
function SidebarColumn({ onNewPortfolio }: { onNewPortfolio?: () => void }) {
  return (
    <>
      <SidebarBrandHeader />
      <div data-node-id="1034:3301" className="flex min-h-0 flex-1 flex-col bg-[#f9fbfd]">
        <div className="flex min-h-0 flex-1 flex-col px-[10px] pb-3 pt-[10px]">
          <div className="flex min-h-0 flex-1 flex-col gap-4">
            <div className="flex shrink-0 flex-col gap-0.5">
              {PRIMARY_NAV.map((item) => {
                const isActive = "active" in item && item.active;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`${SIDEBAR_NAV_ROW_H} ${SIDEBAR_FOCUS} ${
                      isActive ? "bg-[#eef2f5] text-[#07132a]" : "text-[#3c4556] hover:bg-[#eef2f5]/70"
                    } ${"status" in item && item.status ? "justify-between" : "gap-2"}`}
                  >
                    <span className="flex items-center gap-2">
                      <SidebarIcon src={item.icon} size={SIDEBAR_ICON_NAV} />
                      <span className={`whitespace-nowrap ${SIDEBAR_TEXT_NAV}`}>{item.label}</span>
                    </span>
                    {"status" in item && item.status ? (
                      <span
                        className={`shrink-0 rounded-[3px] px-1.5 py-0.5 text-[10px] leading-none tabular-nums ${
                          item.id === "notifications"
                            ? "bg-[#00205b] text-white"
                            : "bg-[#dfe7f0] text-[#3c4556]"
                        }`}
                      >
                        {item.status}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>

            <div className="h-px w-full shrink-0 bg-[#dfe3e9]" aria-hidden />

            <div className="flex min-h-0 flex-1 flex-col gap-1 overflow-hidden">
              <div className="shrink-0 px-2 py-1">
                <p className={SIDEBAR_SECTION_LABEL}>Your portfolios</p>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex flex-col gap-0.5">
                  {SIDEBAR_PORTFOLIOS.map((row) => {
                    const up = row.dayGain ? row.dayGain.pct >= 0 : true;
                    const pctLabel = row.dayGain ? formatDayMovementPct(row.dayGain.pct) : "–";

                    return (
                      <button
                        key={row.id}
                        type="button"
                        className={`flex w-full flex-col gap-1 rounded-[4px] px-2 py-1.5 text-left ${SIDEBAR_FOCUS} hover:bg-[#edf0f3]/80`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <div className="flex min-w-0 items-center gap-1.5">
                            <SidebarIcon src={ICON.folder} size={SIDEBAR_ICON_LIST} />
                            <span className={`truncate ${SIDEBAR_TEXT_NAV} text-[#3c4556]`}>
                              {row.name}
                            </span>
                          </div>
                          <span
                            className={`shrink-0 whitespace-nowrap text-[12px] tabular-nums ${
                              up ? "text-[#11810d]" : "text-[#d72735]"
                            }`}
                          >
                            {pctLabel}
                          </span>
                        </div>
                        <PortfolioSparkline id={row.id} positive={up} width={184} height={13} />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="h-px w-full shrink-0 bg-[#dfe3e9]" aria-hidden />

            <div data-node-id="1034:3554" className="flex shrink-0 flex-col gap-2">
              <div className="px-2 py-1">
                <p className={SIDEBAR_SECTION_LABEL}>Quick Actions</p>
              </div>
              <div className="flex flex-col gap-1.5">
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action.id}
                    type="button"
                    onClick={action.id === "new-portfolio" ? onNewPortfolio : undefined}
                    className={`inline-flex h-[29px] w-fit max-w-full items-center gap-2 rounded-[4px] border border-[#dfe3e9] bg-white px-2.5 ${SIDEBAR_FOCUS} hover:bg-[#fafbfd]`}
                  >
                    <SidebarIcon src={action.icon} size={SIDEBAR_ICON_LIST} />
                    <span className={`whitespace-nowrap ${SIDEBAR_TEXT_NAV} text-[#3c4556]`}>
                      {action.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        data-node-id="1034:3586"
        className="flex h-[34px] shrink-0 items-center justify-between bg-[#f5f5f5] px-2"
      >
        <div className="flex items-center gap-2">
          <div className="flex size-[30px] shrink-0 items-center justify-center rounded-full bg-[#e2eaf5]">
            <span className="text-[10px] font-semibold leading-none text-[#0a0a0a]">NT</span>
          </div>
          <p className="whitespace-nowrap text-[14px] leading-none text-[#171717]">Nick Thomas</p>
        </div>
        <button
          type="button"
          aria-label="Account menu"
          className="flex shrink-0 items-center justify-center rounded-[6px] p-1.5 hover:bg-[#eef2f5]"
        >
          <SidebarIcon src={ICON.chevrons} size={SIDEBAR_ICON_LIST} />
        </button>
      </div>
    </>
  );
}

export function PortfoliosHomeSidebar({
  mobileOpen = false,
  onMobileClose,
  onNewPortfolio,
}: SidebarProps) {
  return (
    <>
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-30 bg-[#07132a]/20 backdrop-blur-[1px] lg:hidden"
          onClick={onMobileClose}
        />
      ) : null}

      <aside
        data-node-id="1034:3610"
        className="hidden h-full w-[211px] shrink-0 flex-col border-r border-[#dfe3e9] bg-[#f9fbfd] lg:flex"
        aria-label="Main navigation"
      >
        <SidebarColumn onNewPortfolio={onNewPortfolio} />
      </aside>

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[min(85vw,260px)] flex-col border-r border-[#dfe3e9] bg-[#f9fbfd] shadow-xl transition-transform duration-200 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Main navigation"
      >
        <SidebarColumn onNewPortfolio={onNewPortfolio} />
      </aside>
    </>
  );
}
