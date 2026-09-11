'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { useRequireAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/authStore';
import { NavEntry } from '@/constants/navigation';

interface WorkspaceLayoutProps {
  role: string;
  items: NavEntry[];
  children: React.ReactNode;
}

export function WorkspaceLayout({ role, items, children }: WorkspaceLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const router = useRouter();
  const isAuthenticated = useRequireAuth();
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  useEffect(() => {
    if (hasHydrated && isAuthenticated && user?.role.name !== role) {
      router.replace('/app/access-denied');
    }
  }, [hasHydrated, isAuthenticated, role, router, user]);

  if (!hasHydrated || !isAuthenticated || user?.role.name !== role) return null;

  return (
    <div>
      <aside className="fixed left-0 top-0 h-screen w-64">
        <Sidebar items={items} collapsed={sidebarCollapsed} onCollapsedChange={setSidebarCollapsed} />
      </aside>
      <main className={`transition-[margin] duration-200 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        {children}
      </main>
    </div>
  );
}