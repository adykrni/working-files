"use client";

type FindDealsButtonProps = {
  className?: string;
};

export function FindDealsButton({ className = "" }: FindDealsButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex h-10 min-w-[130px] shrink-0 items-center justify-center rounded px-4 text-sm font-medium leading-6 text-white transition-colors bg-[#2058a0] hover:bg-[#1a4a88] active:bg-[#153d72] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2058a0] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      onClick={(e) => e.preventDefault()}
    >
      Find deals
    </button>
  );
}
