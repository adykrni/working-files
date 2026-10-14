export function StatusDot({
  variant = "success",
}: {
  variant?: "success" | "info" | "warning" | "danger";
}) {
  const colors = {
    success: "bg-[var(--db-success)]",
    info: "bg-[var(--db-info)]",
    warning: "bg-[var(--db-warning)]",
    danger: "bg-red-500",
  };

  return <span className={`inline-block size-[6px] shrink-0 rounded-full ${colors[variant]}`} />;
}
