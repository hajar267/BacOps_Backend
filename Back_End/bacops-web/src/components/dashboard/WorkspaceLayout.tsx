'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu } from 'lucide-react';
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
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
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
    <div className="min-h-screen">
      {mobileSidebarOpen && (
        <button
          type="button"
          aria-label="Fermer la barre latérale"
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
        />
      )}
      <aside className={`fixed left-0 top-0 z-[1100] h-screen w-64 transition-transform duration-200 md:hidden ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar
          items={items}
          collapsed={false}
          onMobileClose={() => setMobileSidebarOpen(false)}
        />
      </aside>
      <aside className={`fixed left-0 top-0 z-[1100] hidden h-screen md:block ${sidebarCollapsed ? 'w-16' : 'w-64'}`}>
        <Sidebar
          items={items}
          collapsed={sidebarCollapsed}
          onCollapsedChange={setSidebarCollapsed}
        />
      </aside>
      <main className={`min-w-0 transition-[margin] duration-200 ${sidebarCollapsed ? 'md:ml-16' : 'md:ml-64'}`}>
        <div className="flex h-14 items-center border-b border-surface-border bg-white px-4 md:hidden">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-text-primary hover:bg-surface-bg"
            aria-label="Ouvrir la barre latérale"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
        {children}
      </main>
    </div>
  );
}