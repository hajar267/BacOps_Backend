'use client';

import { useAuthStore } from '@/stores/authStore';
import  AdminDashboard  from '@/components/dashboard/admin/AdminDashboard';
import  InstallHome  from '@/components/dashboard/install/InstallHome';
import MagasinHome from '@/components/dashboard/magasin/MagasinHome';

export default function DashboardPage() {
  const roleName = useAuthStore((s) => s.user?.role.name);

  switch (roleName) {
    case 'admin':
      return <AdminDashboard />;
    case 'install':
      return <InstallHome />;
    case 'magasin':
      return <MagasinHome />;
    default:
      return <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        HELLO FROM DASHBOARD PAGE
      </div>;
  }
}