/** Figma 703:5318 sidebar interaction tokens */
export const HOME_V2_SIDEBAR = {
  hoverBg: "rgba(15,79,175,0.06)",
  portfolioActiveBg: "#edf0f3",
  primaryActiveBg: "#dee6f3",
  labelDefault: "#505c73",
  labelActivePortfolio: "#07132a",
  labelActivePrimary: "#00205b",
  sectionLabel: "#445064",
  statusDot: "#ec6b10",
} as const;

export type SidebarRowKind = "primary" | "portfolio" | "secondary";

export type SidebarInteractionState = "default" | "hover" | "active";

export function resolveSidebarState(isActive: boolean, isHovered: boolean): SidebarInteractionState {
  if (isActive) return "active";
  if (isHovered) return "hover";
  return "default";
}

export function sidebarRowSurfaceClass(state: SidebarInteractionState, kind: SidebarRowKind): string {
  if (state === "active") {
    if (kind === "portfolio") return "bg-[#edf0f3]";
    if (kind === "primary") return "bg-[#dee6f3]";
  }
  if (state === "hover") return "bg-[rgba(15,79,175,0.06)]";
  return "bg-transparent";
}

export function sidebarLabelClass(state: SidebarInteractionState, kind: SidebarRowKind): string {
  if (state === "active") {
    if (kind === "portfolio") return "text-[#07132a]";
    if (kind === "primary") return "text-[#00205b]";
  }
  return "text-[#505c73]";
}

export function sidebarStatusClass(state: SidebarInteractionState): string {
  if (state === "active") return "text-[#00205b]";
  return "text-[#505c73]";
}

export function portfolioIconSrc(id: "all" | "folder", state: SidebarInteractionState): string {
  const active = state === "active";
  if (id === "all") {
    return active ? "/sidebar/homev2/portfolio-all-active.svg" : "/sidebar/homev2/portfolio-all-default.svg";
  }
  return active ? "/sidebar/homev2/portfolio-folder-active.svg" : "/sidebar/homev2/portfolio-folder-default.svg";
}
