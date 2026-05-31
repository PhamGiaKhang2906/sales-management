import { ReactNode } from 'react';
import { AppShell } from '@/components/layout/AppShell';

export default function SalesLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell role="sales" title="Quan ly nhan vien ban hang">
      {children}
    </AppShell>
  );
}
