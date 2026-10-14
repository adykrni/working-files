import { DashboardShell } from "@/components/layout/DashboardShell";
import { PrototypeLayout } from "@/components/layout/PrototypeLayout";
import { WealthOverview } from "@/components/WealthOverview";

export default function WealthOverviewPrototypePage() {
  return (
    <DashboardShell>
      <PrototypeLayout layoutGroupId="prototype-wealth-overview">
        <WealthOverview />
      </PrototypeLayout>
    </DashboardShell>
  );
}
