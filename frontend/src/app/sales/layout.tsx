import { ReactNode } from 'react';
import { AppShell } from '@/components/layout/AppShell';

export default function SalesLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell role="sales" title="TRANG NHÂN VIÊN BÁN HÀNG">
      {children}
    </AppShell>
  );
}
