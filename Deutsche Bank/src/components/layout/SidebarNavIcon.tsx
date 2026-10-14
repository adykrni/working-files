export type SidebarNavIconId =
  | "dashboard"
  | "net-wealth"
  | "markets"
  | "news"
  | "reports"
  | "transactions"
  | "notifications"
  | "messages"
  | "security"
  | "settings";

const ICON_SRC: Record<SidebarNavIconId, string> = {
  dashboard: "/sidebar/dashboard.svg",
  "net-wealth": "/sidebar/net-wealth.svg",
  markets: "/sidebar/markets.svg",
  news: "/sidebar/news.svg",
  reports: "/sidebar/reports.svg",
  transactions: "/sidebar/transactions.svg",
  notifications: "/sidebar/notifications.svg",
  messages: "/sidebar/messages.svg",
  security: "/sidebar/security.svg",
  settings: "/sidebar/settings.svg",
};

interface SidebarNavIconProps {
  id: SidebarNavIconId;
  size?: number;
  className?: string;
}

export function SidebarNavIcon({ id, size = 16, className = "" }: SidebarNavIconProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={ICON_SRC[id]}
      alt=""
      width={size}
      height={size}
      aria-hidden
      className={`block shrink-0 ${className}`}
    />
  );
}

export function SidebarChevronsIcon({ size = 14 }: { size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/sidebar/chevrons-up-down.svg"
      alt=""
      width={size}
      height={size}
      aria-hidden
      className="block shrink-0"
    />
  );
}

export function SidebarCollapseIcon({ size = 16 }: { size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/sidebar/collapse.svg"
      alt=""
      width={size}
      height={size}
      aria-hidden
      className="block shrink-0"
    />
  );
}
