import { Holdings } from "@/components/Holdings";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { PrototypeLayout } from "@/components/layout/PrototypeLayout";

export default function HoldingsPrototypePage() {
  return (
    <DashboardShell>
      <PrototypeLayout layoutGroupId="prototype-holdings">
        <div className="mx-auto w-[600px]">
          <Holdings />
        </div>
      </PrototypeLayout>
    </DashboardShell>
  );
}
