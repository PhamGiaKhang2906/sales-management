"use client";

import Link from 'next/link';
import { Home, Package, Users, ShoppingCart, TrendingUp, Warehouse, FileText, DollarSign, BarChart3, X } from 'lucide-react';

interface SidebarProps {
  role: string;
  currentPath: string;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ role, currentPath, isOpen, onClose }: SidebarProps) {
  const ownerMenuItems = [
    { id: 'owner-dashboard', href: '/owner', label: 'Tổng quan', icon: Home },
    { id: 'owner-products', href: '/owner/products', label: 'Mặt hàng', icon: Package },
    { id: 'owner-suppliers', href: '/owner/suppliers', label: 'Nhà cung cấp', icon: Warehouse },
    { id: 'owner-customers', href: '/owner/customers', label: 'Khách hàng', icon: Users },
    { id: 'owner-employees', href: '/owner/employees', label: 'Nhân viên', icon: Users },
    { id: 'owner-store-info', href: '/owner/store-info', label: 'Thông tin cửa hàng', icon: Home },
    { id: 'owner-reports', href: '/owner/reports', label: 'Báo cáo thống kê', icon: BarChart3 },
  ];

  const salesMenuItems = [
    { id: 'sales-dashboard', href: '/sales', label: 'Tổng quan', icon: Home },
    { id: 'sales-orders', href: '/sales/sales-orders', label: 'Đơn bán hàng', icon: ShoppingCart },
    { id: 'sales-returns', href: '/sales/returns', label: 'Đơn trả hàng', icon: FileText },
    { id: 'sales-personal-stats', href: '/sales/personal-stats', label: 'Thống kê cá nhân', icon: TrendingUp },
    { id: 'sales-salary', href: '/sales/salary', label: 'Lương thưởng', icon: DollarSign },
  ];

  const warehouseMenuItems = [
    { id: 'warehouse-dashboard', href: '/warehouse', label: 'Tổng quan', icon: Home },
    { id: 'warehouse-inventory', href: '/warehouse/inventory', label: 'Tồn kho', icon: BarChart3 },
    { id: 'warehouse-salary', href: '/warehouse/salary', label: 'Lương thưởng', icon: DollarSign },
  ];

  const adminMenuItems = [
    { id: 'admin-users', href: '/admin/accounts-page', label: 'Quản lý người dùng', icon: Users },
    { id: 'admin-store-types', href: '/admin/stores-type-page', label: 'Loại hàng', icon: Package },
  ];

  let menuItems = [];
  if (role === 'owner') {
    menuItems = ownerMenuItems;
  } else if (role === 'sales') {
    menuItems = salesMenuItems;
  } else if (role === 'admin') {
    menuItems = adminMenuItems;
  } else {
    menuItems = warehouseMenuItems;
  }

  return (
    <>
      {/* Thêm lg:hidden để ẩn lớp nền mờ trên màn hình máy tính */}
      {isOpen && <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={onClose} />}
      
      <aside
        // Thêm lg:static, lg:translate-x-0 và lg:shadow-none để menu luôn cố định trên PC
        className={`fixed lg:static left-0 top-24 z-50 h-[calc(100vh-6rem)] w-72 bg-white border-r border-gray-200 shadow-xl lg:shadow-none transform transition-transform duration-300 ease-in-out flex-shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Nút X đóng menu cũng chỉ hiện trên Mobile */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
          <h2 className="font-semibold text-gray-800">Menu</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="p-4 space-y-2 overflow-y-auto h-full">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.href || currentPath.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={onClose}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}