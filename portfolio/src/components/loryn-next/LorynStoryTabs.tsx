"use client";

import { useEffect, useState } from "react";

import { StoryTags, type StoryTab } from "@/components/loryn-next/StoryTags";
import { AgenticWorkflowsStory } from "@/components/loryn-next/AgenticWorkflowsStory";
import { DesignSystemStory } from "@/components/loryn-next/DesignSystemStory";

// A fresh instance mounts per tab (keyed by id) so switching always starts
// from the same blurred/faded-out state and eases in — consistent with the
// blur+opacity entrance language used for the "Read full story" reveal.
function TabContent({ tab }: { tab: StoryTab }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      className={`flex w-full min-w-0 flex-col items-center gap-11 transition-[filter,opacity] duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
        isVisible ? "opacity-100 blur-0" : "opacity-0 blur-[10px]"
      }`}
    >
      {tab === "agentic" ? <AgenticWorkflowsStory /> : <DesignSystemStory />}
    </div>
  );
}

export function LorynStoryTabs() {
  const [activeTab, setActiveTab] = useState<StoryTab>("agentic");

  return (
    <>
      <div className="flex w-full max-w-[700px] flex-col items-start">
        <StoryTags active={activeTab} onSelect={setActiveTab} />
      </div>

      <TabContent key={activeTab} tab={activeTab} />
    </>
  );
}
