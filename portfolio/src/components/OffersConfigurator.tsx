"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { OffersCard } from "./OffersCard";
import { PropertiesPanel } from "./PropertiesPanel";
import {
  CONFIGURATOR_PRESETS,
  type PresetId,
} from "@/data/configuratorPresets";
import {
  getHighlightFromPatch,
  type HighlightRegion,
} from "@/lib/configuratorHighlight";
import { defaultState, DEVICE_FRAME_WIDTH, type ComponentState } from "@/types";

function DeviceFrame({
  device,
  highlighted,
  children,
}: {
  device: ComponentState["device"];
  highlighted: boolean;
  children: React.ReactNode;
}) {
  const frameWidth = DEVICE_FRAME_WIDTH[device];
  const labels: Record<ComponentState["device"], string> = {
    Desktop: "Desktop",
    Tablet: "Tablet",
    Mobile: "Mobile",
  };

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
        Preview · {labels[device]} · {frameWidth}px
      </span>
      <div
        className={`mx-auto flex shrink-0 items-start justify-center rounded-lg transition-[width,box-shadow] duration-300 ease-in-out ${
          highlighted ? "ring-2 ring-klm-blue/35 ring-offset-2 ring-offset-white" : ""
        }`}
        style={{ width: frameWidth }}
      >
        {children}
      </div>
    </div>
  );
}

function statesMatch(a: ComponentState, b: ComponentState): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function OffersConfigurator() {
  const [state, setState] = useState<ComponentState>(defaultState);
  const [activePreset, setActivePreset] = useState<PresetId | "custom">(
    "economy-single",
  );
  const [highlight, setHighlight] = useState<HighlightRegion | null>(null);
  const highlightTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearHighlightTimer = useCallback(() => {
    if (highlightTimer.current) {
      clearTimeout(highlightTimer.current);
      highlightTimer.current = null;
    }
  }, []);

  const flashHighlight = useCallback(
    (region: HighlightRegion | null) => {
      if (!region) return;
      clearHighlightTimer();
      setHighlight(region);
      highlightTimer.current = setTimeout(() => setHighlight(null), 700);
    },
    [clearHighlightTimer],
  );

  useEffect(() => clearHighlightTimer, [clearHighlightTimer]);

  const onChange = useCallback(
    (patch: Partial<ComponentState>) => {
      setState((prev) => {
        const next = { ...prev, ...patch };
        const matched = CONFIGURATOR_PRESETS.find((preset) =>
          statesMatch(next, preset.state),
        );
        setActivePreset(matched?.id ?? "custom");
        return next;
      });
      flashHighlight(getHighlightFromPatch(patch));
    },
    [flashHighlight],
  );

  const applyPreset = useCallback(
    (presetId: PresetId) => {
      const preset = CONFIGURATOR_PRESETS.find((item) => item.id === presetId);
      if (!preset) return;
      setState(preset.state);
      setActivePreset(presetId);
      flashHighlight("frame");
    },
    [flashHighlight],
  );

  const resetDemo = useCallback(() => {
    applyPreset("economy-single");
  }, [applyPreset]);

  const activePresetMeta =
    activePreset === "custom"
      ? null
      : CONFIGURATOR_PRESETS.find((preset) => preset.id === activePreset);

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 md:gap-[25px]">
      <section className="mx-auto flex w-full max-w-[900px] flex-col gap-6 md:gap-[25px]">
        <div className="mx-auto flex w-full max-w-[700px] flex-col gap-2.5">
          <p className="text-[13px] font-semibold uppercase leading-[1.4] text-foreground">
            Configure it
          </p>
          <p className="text-base font-normal leading-[1.4] text-muted">
            Try a preset, then use the component properties — the same toggles PMs
            used in Figma to ship A/B variants without a design ticket.
          </p>
        </div>

        <div className="mx-auto flex w-full max-w-[700px] flex-col gap-2.5">
          <div className="flex flex-wrap items-center gap-2">
            {CONFIGURATOR_PRESETS.map((preset) => {
              const isActive = activePreset === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => applyPreset(preset.id)}
                  className={`rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#171717] text-white"
                      : "bg-[#f1f1ef] text-[#171717] hover:bg-surface-card"
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
            <button
              type="button"
              onClick={resetDemo}
              className="text-base leading-[1.4] text-muted underline underline-offset-2 transition-colors hover:text-foreground"
            >
              Reset demo
            </button>
          </div>

          <p className="text-base font-normal leading-[1.4] text-muted">
            {activePresetMeta?.description ??
              "Custom configuration — adjust any property below."}
          </p>
        </div>
      </section>

      <div className="flex w-full flex-col overflow-hidden rounded-xl border border-divider bg-white lg:flex-row lg:items-stretch">
        <div className="flex flex-[1.75] items-center justify-center px-6 py-10 sm:px-10 sm:py-12 lg:sticky lg:top-[55px] lg:self-start lg:px-12 lg:py-14">
          <DeviceFrame
            device={state.device}
            highlighted={highlight === "frame"}
          >
            <OffersCard state={state} highlight={highlight} />
          </DeviceFrame>
        </div>

        <div className="flex min-h-0 flex-1 flex-col self-stretch border-t border-divider lg:min-w-[340px] lg:max-w-[400px] lg:border-l lg:border-t-0">
          <PropertiesPanel state={state} onChange={onChange} />
        </div>
      </div>
    </div>
  );
}
