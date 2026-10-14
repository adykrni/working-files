export type StoryTab = "agentic" | "design-system";

type StoryTagsProps = {
  active: StoryTab;
  onSelect: (tab: StoryTab) => void;
};

const tabs: { id: StoryTab; label: string; disabled?: boolean }[] = [
  { id: "agentic", label: "Agentic workflow" },
  { id: "design-system", label: "Design system", disabled: true },
];

export function StoryTags({ active, onSelect }: StoryTagsProps) {
  return (
    <div className="flex items-center gap-2.5">
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        const isDisabled = tab.disabled === true;
        return (
          <button
            key={tab.id}
            type="button"
            disabled={isDisabled}
            onClick={() => {
              if (!isDisabled) onSelect(tab.id);
            }}
            aria-pressed={isActive}
            className={`font-radio inline-flex items-center gap-1.5 rounded-full py-1.5 text-sm transition-colors ${
              isDisabled
                ? "cursor-default bg-white px-2.5 text-[#d0d0d0]"
                : isActive
                  ? "bg-[#f0f0f0] pl-2.5 pr-3 text-foreground"
                  : "bg-white px-2.5 text-foreground hover:bg-surface-card"
            }`}
          >
            {isActive && !isDisabled ? (
              <span className="size-1.5 shrink-0 rounded-full bg-[#e57e2a]" aria-hidden />
            ) : null}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
