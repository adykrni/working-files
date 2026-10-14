"use client";

import Link from "next/link";
import {
  SidebarChevronsIcon,
  SidebarCollapseIcon,
  SidebarNavIcon,
  type SidebarNavIconId,
} from "./SidebarNavIcon";
import { SidebarLogoLockup } from "./SidebarLogoLockup";

type PrimaryNavItem = {
  id: SidebarNavIconId;
  label: string;
  active?: boolean;
  statusLabel?: string;
};

type SecondaryNavItem = {
  id: Extract<SidebarNavIconId, "security" | "settings">;
  label: string;
};

const primaryNav: PrimaryNavItem[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "net-wealth", label: "Wealth overview", active: true },
  { id: "markets", label: "Markets" },
  { id: "news", label: "News" },
  { id: "reports", label: "Reports" },
  { id: "transactions", label: "Transactions" },
  { id: "notifications", label: "Notifications", statusLabel: "17+" },
  { id: "messages", label: "Messages", statusLabel: "3 new" },
];

const secondaryNav: SecondaryNavItem[] = [
  { id: "security", label: "Security" },
  { id: "settings", label: "Settings" },
];

function NavStatusIndicator({ label }: { label: string }) {
  return (
    <span className="flex shrink-0 items-center gap-1.5">
      <span className="text-[10px] leading-[1.3] text-[var(--db-primary)]">{label}</span>
      <span className="size-1.5 shrink-0 rounded-full bg-[#ec6b10]" aria-hidden />
    </span>
  );
}

function PrimaryNavLink({ item }: { item: PrimaryNavItem }) {
  const rowClass = `flex w-full items-center rounded-[4px] px-2 py-1.5 text-left text-[14px] leading-[1.3] transition-colors ${
    item.active
      ? "bg-[#dee6f3] text-[var(--db-primary)]"
      : "text-[#3d4c67] hover:bg-[rgba(15,79,175,0.06)]"
  }`;

  if (item.statusLabel) {
    return (
      <button type="button" className={`${rowClass} justify-between`}>
        <span className="flex min-w-0 items-center gap-2">
          <span className="flex size-4 shrink-0 items-center justify-center overflow-hidden">
            <SidebarNavIcon id={item.id} />
          </span>
          <span className="truncate">{item.label}</span>
        </span>
        <NavStatusIndicator label={item.statusLabel} />
      </button>
    );
  }

  return (
    <button
      type="button"
      className={`${rowClass} gap-2`}
      aria-current={item.active ? "page" : undefined}
    >
      <span className="flex size-4 shrink-0 items-center justify-center overflow-hidden">
        <SidebarNavIcon id={item.id} />
      </span>
      <span className="min-w-0 flex-1">{item.label}</span>
    </button>
  );
}

function SecondaryNavLink({ item }: { item: SecondaryNavItem }) {
  return (
    <button
      type="button"
      className="flex w-full items-center gap-2 rounded-[4px] py-1.5 pl-[18px] pr-3.5 text-left text-[14px] leading-[1.1] text-[#3d4c67] transition-colors hover:bg-[rgba(15,79,175,0.06)]"
    >
      <span className="flex size-4 shrink-0 items-center justify-center overflow-hidden">
        <SidebarNavIcon id={item.id} />
      </span>
      <span>{item.label}</span>
    </button>
  );
}

export function DashboardSidebar() {
  return (
    <aside
      className="relative z-20 hidden h-full w-[200px] shrink-0 flex-col gap-1.5 bg-[#f9fbfd] lg:flex"
      aria-label="Main navigation"
    >
      <div className="flex shrink-0 items-center justify-between p-[10px]">
        <SidebarLogoLockup />
        <button
          type="button"
          className="flex size-4 shrink-0 items-center justify-center rounded-[4px] transition-colors hover:bg-[rgba(15,79,175,0.06)]"
          aria-label="Collapse sidebar"
        >
          <SidebarCollapseIcon />
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col justify-between">
        <div className="flex w-full flex-col gap-[9px]">
          <div className="flex flex-col">
            <nav className="flex flex-col p-[10px]" aria-label="Primary">
              <div className="flex flex-col gap-1">
                {primaryNav.map((item) => (
                  <PrimaryNavLink key={item.id} item={item} />
                ))}
              </div>
              <div className="mt-2.5 h-px w-full shrink-0 bg-[var(--db-border)]" aria-hidden />
            </nav>
          </div>
          <div className="flex flex-col gap-1">
            {secondaryNav.map((item) => (
              <SecondaryNavLink key={item.id} item={item} />
            ))}
          </div>
        </div>

        <div className="rounded-[10px] p-[8px]">
          <Link
            href="/homev2"
            className="mb-1 block rounded-[4px] px-2 py-1.5 text-[12px] font-medium text-[var(--db-primary)] transition-colors hover:bg-[#dee6f3]"
          >
            Home v2 →
          </Link>
          <Link
            href="/dashboardv2"
            className="mb-2 block rounded-[4px] px-2 py-1.5 text-[12px] font-medium text-[var(--db-primary)] transition-colors hover:bg-[#dee6f3]"
          >
            Dashboard v2 →
          </Link>
          <div className="flex items-center justify-between py-0.5">
            <div className="flex items-center gap-2">
              <div className="flex size-[30px] shrink-0 items-center justify-center rounded-full bg-[#e2eaf5]">
                <span className="text-[10px] font-semibold leading-none text-[#0a0a0a]">NT</span>
              </div>
              <p className="text-[14px] leading-none text-[#171717]">Nick Thomas</p>
            </div>
            <button
              type="button"
              className="flex size-7 shrink-0 items-center justify-center rounded-[6px] p-2 transition-colors hover:bg-[rgba(15,79,175,0.06)]"
              aria-label="Account menu"
            >
              <SidebarChevronsIcon />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
