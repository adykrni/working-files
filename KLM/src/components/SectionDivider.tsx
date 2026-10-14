export function SectionDivider({ className = "w-full max-w-[700px]" }: { className?: string }) {
  return <hr className={`border-0 border-t border-divider ${className}`} />;
}
