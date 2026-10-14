import { AssetAllocations } from "@/components/AssetAllocations";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { PrototypeLayout } from "@/components/layout/PrototypeLayout";

export default function AssetAllocationsPrototypePage() {
  return (
    <DashboardShell>
      <PrototypeLayout layoutGroupId="prototype-asset-allocations">
        <div className="mx-auto w-[600px]">
          <AssetAllocations />
        </div>
      </PrototypeLayout>
    </DashboardShell>
  );
}
