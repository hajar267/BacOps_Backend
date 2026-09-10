import { WorkspaceLayout } from '@/components/dashboard/WorkspaceLayout';
import { NAV_ITEMS } from '@/constants/navigation';

export default function MagasinLayout({ children }: { children: React.ReactNode }) {
  return (
    <WorkspaceLayout role="magasin" items={NAV_ITEMS.magasin}>
      {children}
    </WorkspaceLayout>
  );
}