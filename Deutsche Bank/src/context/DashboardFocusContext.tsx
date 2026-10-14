"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { DashboardFocusTarget } from "@/types/dashboardFocus";

interface DashboardFocusContextValue {
  focusTarget: DashboardFocusTarget | null;
  requestFocus: (target: DashboardFocusTarget) => void;
  releaseFocus: () => void;
  focusPortalNode: HTMLDivElement | null;
  setFocusPortalNode: (node: HTMLDivElement | null) => void;
}

const DashboardFocusContext = createContext<DashboardFocusContextValue | null>(null);

export function DashboardFocusProvider({ children }: { children: ReactNode }) {
  const [focusTarget, setFocusTarget] = useState<DashboardFocusTarget | null>(null);
  const [focusPortalNode, setFocusPortalNode] = useState<HTMLDivElement | null>(null);

  const requestFocus = useCallback((target: DashboardFocusTarget) => {
    setFocusTarget(target);
  }, []);

  const releaseFocus = useCallback(() => {
    setFocusTarget(null);
  }, []);

  const value = useMemo(
    () => ({
      focusTarget,
      requestFocus,
      releaseFocus,
      focusPortalNode,
      setFocusPortalNode,
    }),
    [focusTarget, requestFocus, releaseFocus, focusPortalNode],
  );

  return (
    <DashboardFocusContext.Provider value={value}>{children}</DashboardFocusContext.Provider>
  );
}

export function useDashboardFocus() {
  const context = useContext(DashboardFocusContext);
  if (!context) {
    throw new Error("useDashboardFocus must be used within DashboardFocusProvider");
  }
  return context;
}
