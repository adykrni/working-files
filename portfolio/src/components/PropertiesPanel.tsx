"use client";

import { useState } from "react";
import type { ComponentState, PackagePartners } from "@/types";
import { airlinePartners, hotelPartners } from "@/data/partners";

type PropertiesPanelProps = {
  state: ComponentState;
  onChange: (patch: Partial<ComponentState>) => void;
};

function SectionHeader({
  children,
  hint,
}: {
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="border-t border-divider pt-5 first:border-t-0 first:pt-0">
      <h3 className="font-mono text-[11px] font-medium uppercase tracking-wider text-foreground">
        {children}
      </h3>
      {hint && <p className="mt-1 text-xs leading-relaxed text-muted">{hint}</p>}
    </div>
  );
}

function ControlGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-3 rounded-lg border border-divider bg-[#fafafa] p-3">
      <p className="mb-2 font-mono text-[10px] font-medium uppercase tracking-wider text-foreground">
        {title}
      </p>
      <div className="flex flex-col">{children}</div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-t border-divider py-2.5 first:border-t-0 first:pt-0">
      <span className="shrink-0 text-xs text-muted">{label}</span>
      <div className="flex min-w-0 flex-1 justify-end">{children}</div>
    </div>
  );
}

function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: T[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap justify-end gap-1">
      {options.map((opt) => {
        const selected = value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`rounded-md px-2.5 py-1 font-mono text-[10px] transition-colors ${
              selected
                ? "bg-klm-blue text-white"
                : "bg-white text-muted ring-1 ring-divider hover:text-foreground"
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function Select<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: T[];
  onChange: (v: T) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      className="max-w-[160px] rounded border border-divider bg-white px-2.5 py-1.5 font-mono text-xs text-foreground outline-none focus:border-klm-blue focus:ring-1 focus:ring-klm-blue/20"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
        checked ? "bg-klm-blue" : "bg-[#cdd9e3]"
      }`}
    >
      <span
        className={`absolute top-0.5 size-4 rounded-full bg-white transition-[left] ${
          checked ? "left-[18px]" : "left-0.5"
        }`}
      />
    </button>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full max-w-[160px] rounded border border-divider bg-white px-2.5 py-1.5 font-mono text-xs text-foreground outline-none placeholder:text-muted/60 focus:border-klm-blue focus:ring-1 focus:ring-klm-blue/20"
    />
  );
}

type PackageControlGroupProps = {
  title: string;
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  offer: string;
  onOfferChange: (offer: string) => void;
  partners: PackagePartners;
  onPartnersChange: (partners: PackagePartners) => void;
};

function PackageControlGroup({
  title,
  enabled,
  onEnabledChange,
  offer,
  onOfferChange,
  partners,
  onPartnersChange,
}: PackageControlGroupProps) {
  return (
    <ControlGroup title={title}>
      <Row label="Visible">
        <Toggle
          checked={enabled}
          onChange={onEnabledChange}
          label={`Show ${title} package`}
        />
      </Row>
      {enabled && (
        <>
          <Row label="Offer">
            <TextInput value={offer} onChange={onOfferChange} />
          </Row>
          <Row label="Brand partnership">
            <Toggle
              checked={partners.brandPartnership}
              onChange={(brandPartnership) =>
                onPartnersChange({ ...partners, brandPartnership })
              }
              label={`${title} brand partnership`}
            />
          </Row>
          {partners.brandPartnership && (
            <>
              <Row label="Airline">
                <Select
                  value={partners.partner1}
                  options={[...airlinePartners]}
                  onChange={(partner1) => onPartnersChange({ ...partners, partner1 })}
                />
              </Row>
              <Row label="Hotel">
                <Select
                  value={partners.partner2}
                  options={[...hotelPartners]}
                  onChange={(partner2) => onPartnersChange({ ...partners, partner2 })}
                />
              </Row>
            </>
          )}
        </>
      )}
    </ControlGroup>
  );
}

export function PropertiesPanel({ state, onChange }: PropertiesPanelProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const isFullPackage = state.content === "Full package";
  const isTeaser = state.content === "Teaser";

  return (
    <aside className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-[#f7f7f7] lg:rounded-r-xl">
      <div className="shrink-0 border-b border-divider px-6 py-4 lg:px-7">
        <p className="font-mono text-[11px] font-medium uppercase tracking-wider text-foreground">
          Component properties
        </p>
        <p className="mt-1 text-xs text-muted">
          Maps 1:1 to Figma variant controls
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 lg:px-7 lg:py-6">
        <SectionHeader hint="Switch between hero teaser and full offer card.">
          Variant
        </SectionHeader>
        <ControlGroup title="Content mode">
          <Row label="Content">
            <SegmentedControl
              value={state.content}
              options={["Teaser", "Full package"]}
              onChange={(content) => onChange({ content })}
            />
          </Row>
        </ControlGroup>

        <SectionHeader hint="Preview width follows device unless you override below.">
          Layout
        </SectionHeader>
        <ControlGroup title="Viewport">
          <Row label="Device">
            <SegmentedControl
              value={state.device}
              options={["Desktop", "Tablet", "Mobile"]}
              onChange={(device) => onChange({ device })}
            />
          </Row>
        </ControlGroup>

        <button
          type="button"
          onClick={() => setShowAdvanced((open) => !open)}
          className="mt-4 flex w-full items-center justify-between rounded-lg border border-divider bg-white px-3 py-2 text-left text-xs text-muted transition-colors hover:text-foreground"
        >
          <span>Advanced · card width override</span>
          <span className="font-mono text-[10px]">{showAdvanced ? "−" : "+"}</span>
        </button>

        {showAdvanced && (
          <ControlGroup title="Width override">
            <Row label="Size">
              <SegmentedControl
                value={state.size}
                options={["Default", "SM", "MD", "LG"]}
                onChange={(size) => onChange({ size })}
              />
            </Row>
          </ControlGroup>
        )}

        {isFullPackage && (
          <>
            <SectionHeader hint="Header content shown above package tiers.">
              Destination
            </SectionHeader>
            <ControlGroup title="Card header">
              <Row label="Hero image">
                <Toggle
                  checked={state.image}
                  onChange={(image) => onChange({ image })}
                  label="Show hero image"
                />
              </Row>
              <Row label="City">
                <TextInput
                  value={state.cityName}
                  onChange={(cityName) => onChange({ cityName })}
                />
              </Row>
              <Row label="Country">
                <TextInput
                  value={state.countryName}
                  onChange={(countryName) => onChange({ countryName })}
                />
              </Row>
              <Row label="Divider">
                <SegmentedControl
                  value={state.divider}
                  options={["Dotted", "Solid"]}
                  onChange={(divider) => onChange({ divider })}
                />
              </Row>
            </ControlGroup>

            <SectionHeader hint="Turn tiers on to A/B test upsell paths.">
              Packages
            </SectionHeader>
            <div className="mt-3 flex flex-wrap gap-2">
              {(
                [
                  ["Economy", "economy", state.economy],
                  ["Business", "business", state.business],
                  ["Premium", "premium", state.premium],
                ] as const
              ).map(([label, key, enabled]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => onChange({ [key]: !enabled })}
                  className={`rounded-full px-3 py-1 text-xs transition-colors ${
                    enabled
                      ? "bg-klm-blue text-white"
                      : "bg-white text-muted ring-1 ring-divider hover:text-foreground"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {state.economy && (
              <PackageControlGroup
                title="Economy"
                enabled={state.economy}
                onEnabledChange={(economy) => onChange({ economy })}
                offer={state.economyOffer}
                onOfferChange={(economyOffer) => onChange({ economyOffer })}
                partners={state.economyPartners}
                onPartnersChange={(economyPartners) => onChange({ economyPartners })}
              />
            )}
            {state.business && (
              <PackageControlGroup
                title="Business"
                enabled={state.business}
                onEnabledChange={(business) => onChange({ business })}
                offer={state.businessOffer}
                onOfferChange={(businessOffer) => onChange({ businessOffer })}
                partners={state.businessPartners}
                onPartnersChange={(businessPartners) => onChange({ businessPartners })}
              />
            )}
            {state.premium && (
              <PackageControlGroup
                title="Premium"
                enabled={state.premium}
                onEnabledChange={(premium) => onChange({ premium })}
                offer={state.premiumOffer}
                onOfferChange={(premiumOffer) => onChange({ premiumOffer })}
                partners={state.premiumPartners}
                onPartnersChange={(premiumPartners) => onChange({ premiumPartners })}
              />
            )}
          </>
        )}

        {isTeaser && (
          <>
            <SectionHeader hint="Text overlaid on the hero image.">
              Teaser
            </SectionHeader>
            <ControlGroup title="Overlay content">
              <Row label="City">
                <TextInput
                  value={state.cityName}
                  onChange={(cityName) => onChange({ cityName })}
                />
              </Row>
              <Row label="Offer">
                <TextInput
                  value={state.teaserOffer}
                  onChange={(teaserOffer) => onChange({ teaserOffer })}
                />
              </Row>
            </ControlGroup>
          </>
        )}
      </div>
    </aside>
  );
}
