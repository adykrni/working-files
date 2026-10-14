import { DashboardShell } from "@/components/layout/DashboardShell";
import DashboardPage from "@/pages/DashboardPage";

export default function DashboardRoutePage() {
  return (
    <DashboardShell showShell>
      <DashboardPage />
    </DashboardShell>
  );
}
