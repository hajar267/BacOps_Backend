import { WorkspaceLayout } from '@/components/dashboard/WorkspaceLayout';
import { NAV_ITEMS } from '@/constants/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <WorkspaceLayout role="admin" items={NAV_ITEMS.admin}>
      {children}
    </WorkspaceLayout>
  );
}