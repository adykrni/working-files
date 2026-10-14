"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { HomeV2ContentFocus } from "@/hooks/useHomeV2HomeData";
import type { PortfolioId } from "@/types/wealth";

export type AllAllocationMode = "currency" | "sector";
export type HomeV2View = "home" | "portfolio";

interface DashboardPortfolioContextValue {
  activeView: HomeV2View;
  selectedPortfolioId: PortfolioId;
  allAllocationMode: AllAllocationMode;
  setAllAllocationMode: (mode: AllAllocationMode) => void;
  contentFocus: HomeV2ContentFocus | null;
  goHome: () => void;
  selectPortfolio: (id: PortfolioId) => void;
  openPortfolio: (id: PortfolioId, focus?: HomeV2ContentFocus) => void;
  setContentFocus: (focus: HomeV2ContentFocus | null) => void;
  clearContentFocus: () => void;
  setSelectedPortfolioId: (id: PortfolioId) => void;
}

const DashboardPortfolioContext = createContext<DashboardPortfolioContextValue | null>(null);

export function DashboardPortfolioProvider({ children }: { children: ReactNode }) {
  const [activeView, setActiveView] = useState<HomeV2View>("home");
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<PortfolioId>("all");
  const [allAllocationMode, setAllAllocationMode] = useState<AllAllocationMode>("currency");
  const [contentFocus, setContentFocus] = useState<HomeV2ContentFocus | null>(null);

  const goHome = useCallback(() => {
    setActiveView("home");
    setContentFocus(null);
    setSelectedPortfolioId("all");
  }, []);

  const openPortfolio = useCallback((id: PortfolioId, focus?: HomeV2ContentFocus) => {
    if (id === "all" && activeView === "home") {
      setAllAllocationMode("currency");
    }
    setSelectedPortfolioId(id);
    setActiveView("portfolio");
    setContentFocus(focus ?? null);
  }, [activeView]);

  const selectPortfolio = useCallback(
    (id: PortfolioId) => {
      if (id === "all") {
        setAllAllocationMode("sector");
      }
      setSelectedPortfolioId(id);
      setActiveView("portfolio");
      setContentFocus(null);
    },
    [],
  );

  const setContentFocusFn = useCallback((focus: HomeV2ContentFocus | null) => {
    setContentFocus(focus);
  }, []);

  const clearContentFocus = useCallback(() => setContentFocus(null), []);

  const value = useMemo(
    () => ({
      activeView,
      selectedPortfolioId,
      allAllocationMode,
      setAllAllocationMode,
      contentFocus,
      goHome,
      selectPortfolio,
      openPortfolio,
      setContentFocus: setContentFocusFn,
      clearContentFocus,
      setSelectedPortfolioId,
    }),
    [
      activeView,
      selectedPortfolioId,
      allAllocationMode,
      setAllAllocationMode,
      contentFocus,
      goHome,
      selectPortfolio,
      openPortfolio,
      setContentFocusFn,
      clearContentFocus,
    ],
  );

  return (
    <DashboardPortfolioContext.Provider value={value}>
      {children}
    </DashboardPortfolioContext.Provider>
  );
}

export function useDashboardPortfolio(): DashboardPortfolioContextValue {
  const context = useContext(DashboardPortfolioContext);
  if (!context) {
    throw new Error("useDashboardPortfolio must be used within DashboardPortfolioProvider");
  }
  return context;
}
