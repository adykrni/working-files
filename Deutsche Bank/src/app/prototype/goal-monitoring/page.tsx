import { DashboardShell } from "@/components/layout/DashboardShell";
import { PrototypeLayout } from "@/components/layout/PrototypeLayout";
import { GoalMonitoring } from "@/components/GoalMonitoring";

export default function GoalMonitoringPrototypePage() {
  return (
    <DashboardShell>
      <PrototypeLayout layoutGroupId="prototype-goal-monitoring">
        <GoalMonitoring />
      </PrototypeLayout>
    </DashboardShell>
  );
}
