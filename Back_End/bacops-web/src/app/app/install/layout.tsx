import { WorkspaceLayout } from '@/components/dashboard/WorkspaceLayout';
import { NAV_ITEMS } from '@/constants/navigation';

export default function InstallLayout({ children }: { children: React.ReactNode }) {
  return (
    <WorkspaceLayout role="install" items={NAV_ITEMS.install}>
      {children}
    </WorkspaceLayout>
  );
}