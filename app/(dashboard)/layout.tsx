import DashboardShell from "./DashboardShell";
import { BASE_DB, getHost } from "@/lib/demo-data";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Fixed demo session: the single host in the bundled data.
  return <DashboardShell tourHost={getHost(BASE_DB)}>{children}</DashboardShell>;
}
