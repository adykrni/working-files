"use client";

import type { ComponentState, PackagePartners } from "@/types";
import { airlinePartners, hotelPartners } from "@/data/partners";

type PropertiesPanelProps = {
  state: ComponentState;
  onChange: (patch: Partial<ComponentState>) => void;
};

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="border-t border-[#d8d8d8] pt-5 font-mono text-[11px] font-medium uppercase tracking-wider text-foreground first:border-t-0 first:pt-0">
      {children}
    </h3>
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
    <div className="mt-3 rounded-lg border border-[#d8d8d8] bg-white/70 p-3">
      <p className="mb-2 font-mono text-[10px] font-medium uppercase tracking-wider text-foreground">
        {title}
      </p>
      <div className="flex flex-col">{children}</div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-t border-[#ececec] py-2.5 first:border-t-0 first:pt-0">
      <span className="shrink-0 font-mono text-xs text-muted">{label}</span>
      <div className="flex min-w-0 flex-1 justify-end">{children}</div>
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
      className="max-w-[160px] rounded border border-[#cdd9e3] bg-white px-2.5 py-1.5 font-mono text-xs text-foreground outline-none focus:border-[#2058a0] focus:ring-1 focus:ring-[#2058a0]/20"
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
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
        checked ? "bg-[#00a1de]" : "bg-[#cdd9e3]"
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
      className="w-full max-w-[160px] rounded border border-[#cdd9e3] bg-white px-2.5 py-1.5 font-mono text-xs text-foreground outline-none placeholder:text-muted/60 focus:border-[#2058a0] focus:ring-1 focus:ring-[#2058a0]/20"
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
      <Row label="Show package">
        <Toggle checked={enabled} onChange={onEnabledChange} />
      </Row>
      <Row label="Offer">
        <TextInput value={offer} onChange={onOfferChange} />
      </Row>
      <Row label="Brand Partnership">
        <Toggle
          checked={partners.brandPartnership}
          onChange={(brandPartnership) =>
            onPartnersChange({ ...partners, brandPartnership })
          }
        />
      </Row>
      {partners.brandPartnership && (
        <>
          <Row label="Partner 1">
            <Select
              value={partners.partner1}
              options={[...airlinePartners]}
              onChange={(partner1) => onPartnersChange({ ...partners, partner1 })}
            />
          </Row>
          <Row label="Partner 2">
            <Select
              value={partners.partner2}
              options={[...hotelPartners]}
              onChange={(partner2) => onPartnersChange({ ...partners, partner2 })}
            />
          </Row>
        </>
      )}
    </ControlGroup>
  );
}

export function PropertiesPanel({ state, onChange }: PropertiesPanelProps) {
  const isFullPackage = state.content === "Full package";
  const isTeaser = state.content === "Teaser";

  return (
    <aside className="flex h-full min-h-0 flex-col overflow-hidden bg-[#f0f0f0] lg:rounded-r-xl">
      <div className="flex-1 overflow-y-auto px-6 py-6 lg:px-7 lg:py-8">
        <SectionHeader>Layout</SectionHeader>
        <ControlGroup title="Viewport">
          <Row label="Device">
            <Select
              value={state.device}
              options={["Desktop", "Tablet", "Mobile"]}
              onChange={(device) => onChange({ device })}
            />
          </Row>
          <Row label="Size">
            <Select
              value={state.size}
              options={["Default", "SM", "MD", "LG"]}
              onChange={(size) => onChange({ size })}
            />
          </Row>
          <Row label="Content">
            <Select
              value={state.content}
              options={["Teaser", "Full package"]}
              onChange={(content) => onChange({ content })}
            />
          </Row>
        </ControlGroup>

        {isFullPackage && (
          <>
            <SectionHeader>Destination</SectionHeader>
            <ControlGroup title="Card header">
              <Row label="Image">
                <Toggle checked={state.image} onChange={(image) => onChange({ image })} />
              </Row>
              <Row label="City Name">
                <TextInput
                  value={state.cityName}
                  onChange={(cityName) => onChange({ cityName })}
                />
              </Row>
              <Row label="Country Name">
                <TextInput
                  value={state.countryName}
                  onChange={(countryName) => onChange({ countryName })}
                />
              </Row>
              <Row label="Divider">
                <Select
                  value={state.divider}
                  options={["Dotted", "Solid"]}
                  onChange={(divider) => onChange({ divider })}
                />
              </Row>
            </ControlGroup>

            <SectionHeader>Packages</SectionHeader>
            <PackageControlGroup
              title="Economy"
              enabled={state.economy}
              onEnabledChange={(economy) => onChange({ economy })}
              offer={state.economyOffer}
              onOfferChange={(economyOffer) => onChange({ economyOffer })}
              partners={state.economyPartners}
              onPartnersChange={(economyPartners) => onChange({ economyPartners })}
            />
            <PackageControlGroup
              title="Business"
              enabled={state.business}
              onEnabledChange={(business) => onChange({ business })}
              offer={state.businessOffer}
              onOfferChange={(businessOffer) => onChange({ businessOffer })}
              partners={state.businessPartners}
              onPartnersChange={(businessPartners) => onChange({ businessPartners })}
            />
            <PackageControlGroup
              title="Premium"
              enabled={state.premium}
              onEnabledChange={(premium) => onChange({ premium })}
              offer={state.premiumOffer}
              onOfferChange={(premiumOffer) => onChange({ premiumOffer })}
              partners={state.premiumPartners}
              onPartnersChange={(premiumPartners) => onChange({ premiumPartners })}
            />
          </>
        )}

        {isTeaser && (
          <>
            <SectionHeader>Teaser</SectionHeader>
            <ControlGroup title="Overlay content">
              <Row label="City Name">
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
