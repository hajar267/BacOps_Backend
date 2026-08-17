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
<div>
  <aside className="fixed left-0 top-0 h-screen w-64">
    <Sidebar />
  </aside>

  <main className="ml-64">
    {children}
  </main>
</div>
  );
}