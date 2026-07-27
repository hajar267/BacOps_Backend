'use client';

import { Sidebar } from '@/components/dashboard/Sidebar';
import { useRequireAuth } from '@/hooks/useAuth';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = useRequireAuth();

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen flex bg-surface-bg">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}