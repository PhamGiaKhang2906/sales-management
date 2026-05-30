import { ReactNode } from 'react';
import { AppShell } from '@/components/layout/AppShell';

export default function OwnerLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell role="owner" title="Quan ly chu cua hang">
      {children}
    </AppShell>
  );
}
