import { ReactNode } from 'react';
import { AppShell } from '@/components/layout/AppShell';

export default function WarehouseLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell role="warehouse" title="TRANG NHÂN VIÊN KHO">
      {children}
    </AppShell>
  );
}
