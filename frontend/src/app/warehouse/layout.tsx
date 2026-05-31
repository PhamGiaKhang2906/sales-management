import { ReactNode } from 'react';
import { AppShell } from '@/components/layout/AppShell';

export default function WarehouseLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell role="warehouse" title="Quan ly nhan vien kho">
      {children}
    </AppShell>
  );
}
