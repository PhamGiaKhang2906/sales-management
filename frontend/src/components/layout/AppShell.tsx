"use client";

import { ReactNode, useEffect, useMemo, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
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
  
  // Bạn có thể đổi thành true nếu muốn lúc mới vào web menu luôn mở
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const [currentUserName, setCurrentUserName] = useState('');

  // Tự động đóng Sidebar mỗi khi chuyển trang (thoả mãn yêu cầu click menu tự động ẩn)
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
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* HEADER: Luôn giữ Full Width trên cùng */}
      <header className="h-24 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between gap-4 z-20 shadow-sm">
        <div className="flex items-center gap-4">
          
          {/* NÚT HAMBURGER / X: Đã bỏ lg:hidden để có thể điều khiển trên cả Desktop */}
          <button
            onClick={() => setIsSidebarOpen((value) => !value)}
            className="inline-flex items-center justify-center rounded-lg p-2 transition hover:bg-emerald-50 hover:text-emerald-700"
            aria-label={isSidebarOpen ? 'Đóng navigation' : 'Mở navigation'}
            aria-expanded={isSidebarOpen}
          >
            {isSidebarOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
          </button>
          
          <BrandMark compact />
          
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
              localStorage.removeItem('authUser');
              localStorage.removeItem('token');
              router.push('/signin');
            }}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 transition hover:bg-emerald-50 hover:text-emerald-700"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Đăng xuất</span>
          </button>
        </div>
      </header>

      {/* BODY: Chứa Sidebar và Main Content */}
      <div className="flex-1 min-h-0 flex relative">
        
        {/* SIDEBAR WRAPPER: Bọc Sidebar lại để xử lý animation thu hẹp/mở rộng */}
        <div 
          className={`transition-all duration-300 ease-in-out shrink-0 bg-white h-full overflow-hidden
            ${isSidebarOpen ? "w-64 border-r border-gray-200 translate-x-0" : "w-0 border-r-0 -translate-x-full"}
          `}
        >
          {/* Cố định w-64 bên trong để nội dung menu không bị bóp méo dồn cục trong lúc đang animation */}
          <div className="w-64 h-full">
            <Sidebar
              role={role}
              currentPath={pathname}
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
            />
          </div>
        </div>

        {/* MAIN CONTENT: Sẽ tự động giãn ra chiếm hết khoảng trống khi Sidebar w-0 */}
        <main className="flex-1 min-w-0 overflow-y-auto bg-gray-50 p-6 transition-all duration-300">
          {children}
        </main>
        
      </div>
    </div>
  );
}