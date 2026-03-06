import { Sidebar } from "@/components/dashboard/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[var(--gradient-purple-pink)]">
      <Sidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}