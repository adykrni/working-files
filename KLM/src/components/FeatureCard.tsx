type FeatureCardProps = {
  title: string;
  description: string;
};

export function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <div className="flex w-full flex-col gap-2.5 rounded-[10px] bg-surface-card p-5">
      <h3 className="text-base font-semibold leading-[1.2] text-foreground">{title}</h3>
      <p className="text-base font-normal leading-[1.4] text-muted">{description}</p>
    </div>
  );
}
