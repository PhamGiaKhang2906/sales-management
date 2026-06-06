import { ReactNode } from 'react';
import { Menu, LogOut } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  currentUser: {
    name: string;
    role: string;
  };
  onLogout: () => void;
  onToggleSidebar: () => void;
}

export function Layout({ children, currentUser, onLogout, onToggleSidebar }: LayoutProps) {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="font-bold text-xl text-gray-800">Hệ Thống Quản Lý Bán Hàng</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-medium text-gray-800">{currentUser.name}</p>
            <p className="text-sm text-gray-500">{currentUser.role}</p>
          </div>
          <button
            onClick={onLogout}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
}