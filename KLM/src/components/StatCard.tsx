type StatCardProps = {
  value: string;
  description: string;
};

export function StatCard({ value, description }: StatCardProps) {
  return (
    <div className="flex flex-1 flex-col gap-2.5 rounded-[10px] bg-surface-card p-5">
      <p className="text-base font-semibold leading-[1.2] text-foreground">{value}</p>
      <p className="text-base font-normal leading-[1.4] text-muted">{description}</p>
    </div>
  );
}
