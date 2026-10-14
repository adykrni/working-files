"use client";

import { useCallback, useState } from "react";
import { useDashboardPortfolio } from "@/context/DashboardPortfolioContext";
import { HOME_V2_PORTFOLIO_NAV } from "@/hooks/useHomeV2Data";
import { formatSignedPercentTab } from "@/lib/format";
import type { PortfolioId } from "@/types/wealth";
import {
  HOME_V2_SIDEBAR,
  portfolioIconSrc,
  resolveSidebarState,
  sidebarLabelClass,
  sidebarRowSurfaceClass,
  sidebarStatusClass,
} from "./homev2SidebarStates";

const ICON = {
  home: "/sidebar/homev2/home-default.svg",
  markets: "/sidebar/homev2/markets.svg",
  news: "/sidebar/homev2/news.svg",
  reports: "/sidebar/homev2/reports.svg",
  transactions: "/sidebar/homev2/transactions.svg",
  notifications: "/sidebar/homev2/notifications.svg",
  messages: "/sidebar/homev2/messages.svg",
  trendUp: "/sidebar/homev2/trend-up-default.svg",
  trendDown: "/sidebar/homev2/trend-down.svg",
  security: "/sidebar/homev2/security.svg",
  settings: "/sidebar/homev2/settings.svg",
  collapse: "/sidebar/homev2/collapse.svg",
  chevrons: "/sidebar/chevrons-up-down.svg",
  divider: "/sidebar/homev2/divider.svg",
} as const;

const PRIMARY_NAV = [
  { id: "home", label: "Home", icon: ICON.home },
  { id: "markets", label: "Markets", icon: ICON.markets },
  { id: "news", label: "News", icon: ICON.news },
  { id: "reports", label: "Reports", icon: ICON.reports },
  { id: "transactions", label: "Transactions", icon: ICON.transactions },
  { id: "notifications", label: "Notifications", icon: ICON.notifications, status: "17+" },
  { id: "messages", label: "Messages", icon: ICON.messages, status: "3 new" },
] as const;

function useSidebarRowState(isActive: boolean) {
  const [isHovered, setIsHovered] = useState(false);
  const onMouseEnter = useCallback(() => setIsHovered(true), []);
  const onMouseLeave = useCallback(() => setIsHovered(false), []);
  const state = resolveSidebarState(isActive, isHovered);
  return { state, onMouseEnter, onMouseLeave };
}

function SidebarIcon({ src, size }: { src: string; size: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" width={size} height={size} aria-hidden className="block shrink-0" />
  );
}

function HomeV2SidebarLogo() {
  return (
    <div
      className="flex w-[97.3px] shrink-0 items-center justify-between"
      role="img"
      aria-label="Deutsche Bank Wealth Management"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/db-logo-icon.svg"
        alt=""
        width={16.1}
        height={16.1}
        aria-hidden
        className="block shrink-0"
      />
      <div className="relative shrink-0 leading-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/db-logo-title.svg"
          alt=""
          width={55.685}
          height={6.001}
          aria-hidden
          className="ml-[0.03px] block"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/db-logo-subtitle.svg"
          alt=""
          width={77.374}
          height={7.571}
          aria-hidden
          className="mt-[8.8px] block"
        />
      </div>
    </div>
  );
}

function PrimaryNavRow({
  icon,
  label,
  status,
  isActive = false,
  onClick,
}: {
  icon: string;
  label: string;
  status?: string;
  isActive?: boolean;
  onClick?: () => void;
}) {
  const { state, onMouseEnter, onMouseLeave } = useSidebarRowState(isActive);
  const labelClass = sidebarLabelClass(state, "primary");

  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      data-sidebar-state={state}
      className={`flex w-full shrink-0 items-center rounded-[4px] px-[8px] py-[6px] text-left transition-colors ${sidebarRowSurfaceClass(state, "primary")} ${
        status ? "justify-between" : "gap-[8px]"
      }`}
    >
      <span className="flex items-center gap-[8px]">
        <SidebarIcon src={icon} size={14} />
        <span className={`whitespace-nowrap text-[12px] leading-[1.3] ${labelClass}`}>{label}</span>
      </span>
      {status ? (
        <span className="flex items-center gap-[6px]">
          <span className={`whitespace-nowrap text-[10px] leading-[1.3] ${sidebarStatusClass(state)}`}>
            {status}
          </span>
          <span
            className="size-[6px] shrink-0 rounded-full"
            style={{ backgroundColor: HOME_V2_SIDEBAR.statusDot }}
            aria-hidden
          />
        </span>
      ) : null}
    </button>
  );
}

function PortfolioNavItem({
  id,
  label,
  change,
  isActive,
  onSelect,
}: {
  id: PortfolioId;
  label: string;
  change: number;
  isActive: boolean;
  onSelect: (id: PortfolioId) => void;
}) {
  const positive = change >= 0;
  const { state, onMouseEnter, onMouseLeave } = useSidebarRowState(isActive);
  const labelClass = sidebarLabelClass(state, "portfolio");
  const iconSrc = portfolioIconSrc(id === "all" ? "all" : "folder", state);
  const labelWidth = id === "execution" ? "w-[101px]" : id === "retirement" ? "w-[103px]" : undefined;

  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      aria-current={isActive ? "true" : undefined}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      data-sidebar-state={state}
      className={`flex w-[200px] shrink-0 flex-col justify-center rounded-[4px] px-[8px] py-[6px] text-left transition-colors ${sidebarRowSurfaceClass(state, "portfolio")}`}
    >
      <div className="flex w-full items-center justify-between">
        <span className="flex items-center gap-[6px]">
          <SidebarIcon src={iconSrc} size={id === "all" ? 14 : 13} />
          <span className={`truncate text-[12px] leading-[1.3] ${labelClass} ${labelWidth ?? ""}`}>
            {label}
          </span>
        </span>
        <span className="flex items-center gap-[4px]">
          <span className={`whitespace-nowrap text-[10px] leading-[1.3] tabular-nums ${labelClass}`}>
            {formatSignedPercentTab(change)}
          </span>
          {positive ? (
            <SidebarIcon src={ICON.trendUp} size={14} />
          ) : (
            <span className="-scale-y-100">
              <SidebarIcon src={ICON.trendDown} size={14} />
            </span>
          )}
        </span>
      </div>
    </button>
  );
}

function SecondaryNavRow({ icon, label }: { icon: string; label: string }) {
  const { state, onMouseEnter, onMouseLeave } = useSidebarRowState(false);
  const labelClass = sidebarLabelClass(state, "secondary");

  return (
    <button
      type="button"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      data-sidebar-state={state}
      className={`flex w-full items-center gap-[8px] rounded-[4px] py-[6px] pl-[18px] pr-[14px] text-left transition-colors ${sidebarRowSurfaceClass(state, "secondary")}`}
    >
      <SidebarIcon src={icon} size={14} />
      <span className={`whitespace-nowrap text-[12px] leading-[1.1] ${labelClass}`}>{label}</span>
    </button>
  );
}

export function HomeV2Sidebar() {
  const { activeView, selectedPortfolioId, selectPortfolio, goHome } = useDashboardPortfolio();

  const portfolioActive = (id: PortfolioId) =>
    activeView === "home" ? id === "all" : selectedPortfolioId === id;

  return (
    <aside
      className="relative z-20 hidden h-full w-[220px] shrink-0 flex-col gap-[6px] border-r border-solid border-[#c7d5ee] bg-[#f9fbfd] lg:flex"
      aria-label="Main navigation"
    >
      <div className="flex shrink-0 items-center justify-between p-[10px]">
        <HomeV2SidebarLogo />
        <button
          type="button"
          className="flex size-4 shrink-0 items-center justify-center rounded-[4px] transition-colors hover:bg-[rgba(15,79,175,0.06)]"
          aria-label="Collapse sidebar"
        >
          <SidebarIcon src={ICON.collapse} size={16} />
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col justify-between">
        <div className="flex flex-col gap-[9px]">
          <div className="w-[220px]">
            <div className="flex flex-col gap-6 p-[10px]">
              <div className="flex flex-col gap-[4px]">
                {PRIMARY_NAV.map((item) => (
                  <PrimaryNavRow
                    key={item.id}
                    icon={item.icon}
                    label={item.label}
                    status={"status" in item ? item.status : undefined}
                    onClick={item.id === "home" ? goHome : undefined}
                  />
                ))}
              </div>

              <div className="flex flex-col gap-[4px]">
                <div className="flex items-center gap-[8px] rounded-[4px] px-[8px] py-[6px]">
                  <span
                    className="whitespace-nowrap text-[11px] leading-[1.3]"
                    style={{ color: HOME_V2_SIDEBAR.sectionLabel }}
                  >
                    Wealth Overview
                  </span>
                </div>
                {HOME_V2_PORTFOLIO_NAV.map((item) => (
                  <PortfolioNavItem
                    key={item.id}
                    id={item.id}
                    label={item.label}
                    change={item.change}
                    isActive={portfolioActive(item.id)}
                    onSelect={selectPortfolio}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="relative h-0 w-full shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ICON.divider} alt="" className="block w-full max-w-none" aria-hidden />
          </div>

          <div className="flex w-[200px] flex-col gap-[4px]">
            <SecondaryNavRow icon={ICON.security} label="Security" />
            <SecondaryNavRow icon={ICON.settings} label="Settings" />
          </div>
        </div>

        <div className="shrink-0 rounded-[10px] p-[8px]">
          <div className="flex items-center justify-between px-0 py-[2px]">
            <div className="flex items-center gap-[8px]">
              <div className="flex size-[30px] shrink-0 items-center justify-center rounded-full bg-[#e2eaf5]">
                <span className="truncate text-[10px] font-semibold leading-none text-[#0a0a0a]">
                  NT
                </span>
              </div>
              <p className="whitespace-nowrap text-[14px] leading-none text-[#171717]">Nick Thomas</p>
            </div>
            <button
              type="button"
              className="flex shrink-0 items-center justify-center rounded-[6px] p-2 transition-colors hover:bg-[rgba(15,79,175,0.06)]"
              aria-label="Account menu"
            >
              <SidebarIcon src={ICON.chevrons} size={14} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
