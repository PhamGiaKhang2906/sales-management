"use client";

import { ReactNode, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { Menu, LogOut, X } from 'lucide-react';
import { BrandMark } from './BrandMark';
import { Sidebar } from './Sidebar';

interface AppShellProps {
  role: 'owner' | 'sales' | 'warehouse' | 'admin';
  title: string;
  children: ReactNode;
}

export function AppShell({ role, title, children }: AppShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentUserName, setCurrentUserName] = useState('');

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    const authUser = localStorage.getItem('authUser');

    if (!authUser) {
      setCurrentUserName('');
      return;
    }

    try {
      const parsed = JSON.parse(authUser) as { name?: string };
      setCurrentUserName(parsed.name ?? '');
    } catch {
      setCurrentUserName('');
    }
  }, [pathname]);

  const roleLabel = useMemo(() => {
    if (role === 'owner') return 'owner';
    if (role === 'sales') return 'sales';
    if (role === 'warehouse') return 'warehouse';
    return 'admin';
  }, [role]);

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <header className="h-24 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <BrandMark compact />
          
          <button
            onClick={() => setIsSidebarOpen((value) => !value)}
            className="lg:hidden inline-flex items-center justify-center rounded-lg p-2 transition hover:bg-emerald-50 hover:text-emerald-700"
            aria-label={isSidebarOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={isSidebarOpen}
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <h1 className="font-bold text-xl text-gray-800 hidden sm:block">{title}</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right leading-tight">
            <p className="font-semibold text-gray-800">{currentUserName || 'Người dùng'}</p>
            <p className="text-sm text-gray-500 capitalize">{roleLabel}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              // Xóa toàn bộ thông tin đăng nhập
              localStorage.removeItem('authUser');
              localStorage.removeItem('token');
              // SỬA ĐƯỜNG LINK TẠI ĐÂY: Trở về trang /signin
              router.push('/signin');
            }}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 transition hover:bg-emerald-50 hover:text-emerald-700"
          >
            <LogOut className="w-4 h-4" />
            Đăng xuất
          </button>
        </div>
      </header>

      <div className="flex-1 min-h-0 overflow-hidden flex">
        <Sidebar
          role={role}
          currentPath={pathname}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="flex-1 min-w-0 overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}