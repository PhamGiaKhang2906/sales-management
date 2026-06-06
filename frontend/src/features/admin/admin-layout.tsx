import { useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { Users, Store, Menu, X } from 'lucide-react';

interface AdminLayoutProps {
  currentUser: { name: string; role: string };
  onLogout: () => void;
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function AdminLayout({ currentUser, onLogout, children, currentPage, onNavigate }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'accounts', label: 'Quản lý tài khoản', icon: Users },
    { id: 'store-types', label: 'Loại cửa hàng', icon: Store },
  ];

  return (
    <Layout
      currentUser={currentUser}
      onLogout={onLogout}
      onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
    >
      <div className="flex h-full">
        {/* Sidebar Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="flex items-center justify-between p-4 lg:hidden border-b border-gray-200">
            <h2 className="font-semibold text-gray-800">Menu Admin</h2>
            <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    currentPage === item.id
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </Layout>
  );
}