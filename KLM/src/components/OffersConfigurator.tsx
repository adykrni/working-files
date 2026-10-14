"use client";

import { useCallback, useState } from "react";
import { OffersCard } from "./OffersCard";
import { PropertiesPanel } from "./PropertiesPanel";
import { defaultState, DEVICE_FRAME_WIDTH, type ComponentState } from "@/types";

function DeviceFrame({
  device,
  children,
}: {
  device: ComponentState["device"];
  children: React.ReactNode;
}) {
  const frameWidth = DEVICE_FRAME_WIDTH[device];
  const labels: Record<ComponentState["device"], string> = {
    Desktop: "Desktop preview",
    Tablet: "Tablet preview",
    Mobile: "Mobile preview",
  };

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
        {labels[device]} · {frameWidth}px
      </span>
      <div
        className="mx-auto flex shrink-0 items-start justify-center transition-[width] duration-300 ease-in-out"
        style={{ width: frameWidth }}
      >
        {children}
      </div>
    </div>
  );
}

export function OffersConfigurator() {
  const [state, setState] = useState<ComponentState>(defaultState);

  const onChange = useCallback((patch: Partial<ComponentState>) => {
    setState((prev) => ({ ...prev, ...patch }));
  }, []);

  return (
    <div className="flex w-full flex-col gap-6 overflow-hidden rounded-xl border border-divider bg-[#f5f5f5] lg:flex-row lg:gap-0">
      <div className="flex min-h-[480px] flex-[1.75] items-center justify-center px-6 py-10 sm:px-10 sm:py-12 lg:min-h-[600px] lg:px-12 lg:py-14">
        <DeviceFrame device={state.device}>
          <OffersCard state={state} />
        </DeviceFrame>
      </div>
      <div className="flex flex-1 flex-col lg:max-h-[600px] lg:min-w-[340px] lg:max-w-[400px]">
        <PropertiesPanel state={state} onChange={onChange} />
      </div>
    </div>
  );
}
