type MediaPlaceholderProps = {
  label: string;
  className?: string;
};

export function MediaPlaceholder({ label, className = "" }: MediaPlaceholderProps) {
  return (
    <div
      className={`flex items-center justify-center overflow-hidden rounded-[10px] bg-surface-media ${className}`}
    >
      <span className="font-mono text-base font-semibold leading-[1.4] text-foreground">
        {label}
      </span>
    </div>
  );
}
