"use client";

import { LayoutGroup } from "framer-motion";
import type { ReactNode } from "react";
import { DashboardFocusLayer } from "./DashboardFocusLayer";
import { DashboardFocusProvider } from "@/context/DashboardFocusContext";

interface PrototypeLayoutProps {
  children: ReactNode;
  layoutGroupId?: string;
}

/** Isolated component canvas for prototype recording — no sidebar, no sibling widgets. */
export function PrototypeLayout({ children, layoutGroupId = "prototype" }: PrototypeLayoutProps) {
  return (
    <DashboardFocusProvider>
      <LayoutGroup id={layoutGroupId}>
        <div className="relative w-full">
          {children}
          <DashboardFocusLayer variant="prototype" />
        </div>
      </LayoutGroup>
    </DashboardFocusProvider>
  );
}
