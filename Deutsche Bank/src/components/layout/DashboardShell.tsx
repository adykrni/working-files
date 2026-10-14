"use client";

import { DashboardSidebar } from "./DashboardSidebar";

interface DashboardShellProps {
  children: React.ReactNode;
  showShell?: boolean;
}

export function DashboardShell({ children, showShell = false }: DashboardShellProps) {
  if (!showShell) {
    return (
      <div className="flex min-h-screen flex-1 items-center justify-center bg-white p-6">
        <div className="flex w-full max-w-[1200px] justify-center">{children}</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#f9fbfd]">
      <div className="grid h-full w-full grid-cols-1 lg:grid-cols-[200px_minmax(0,1fr)]">
        <DashboardSidebar />
        <div className="flex h-full min-h-0 min-w-0 flex-col p-[10px]">
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain rounded-[10px] border border-[#c7d5ee] bg-white p-[10px]">
            <main className="w-full min-w-0">{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
}
