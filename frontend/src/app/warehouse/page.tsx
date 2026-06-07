"use client";

import { 
  User, 
  CreditCard, 
  Calendar, 
  Briefcase, 
  Clock, 
  Coins,
  FileText,
  Package,
  PackagePlus,
  AlertTriangle,
  DollarSign
} from 'lucide-react';

export default function WarehouseDashboardPage() {
  // Dữ liệu mẫu (sau này bạn có thể gọi API để thay thế)
  const employeeInfo = {
    name: "Trần Thị B",
    cccd: "046200005678",
    dob: "22/10/1995",
    salaryCoef: "2.50",
    position: "Nhân viên kho",
    shift: "Ca Chiều (14:00 - 22:00)"
  };

  const warehouseStats = {
    importOrdersToday: 12,
    importedProductsToday: 450,
    totalImportAmount: 24500000,
    lowStockAlerts: 3
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Tiêu đề trang */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Tổng quan nhân viên kho</h2>
        <p className="text-gray-500 text-sm mt-1">Xem thông tin cá nhân và số liệu nhập xuất kho trong ngày.</p>
      </div>

      {/* 1. PHẦN THÔNG TIN NHÂN VIÊN */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <User className="text-blue-500" size={20} />
            Thông tin nhân viên
          </h3>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><User size={18} /></div>
              <div>
                <p className="text-sm text-gray-500 mb-0.5">Họ và tên</p>
                <p className="font-semibold text-gray-800">{employeeInfo.name}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><CreditCard size={18} /></div>
              <div>
                <p className="text-sm text-gray-500 mb-0.5">Số CCCD</p>
                <p className="font-semibold text-gray-800">{employeeInfo.cccd}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-pink-50 text-pink-600 rounded-lg"><Calendar size={18} /></div>
              <div>
                <p className="text-sm text-gray-500 mb-0.5">Ngày sinh</p>
                <p className="font-semibold text-gray-800">{employeeInfo.dob}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><Briefcase size={18} /></div>
              <div>
                <p className="text-sm text-gray-500 mb-0.5">Chức vụ</p>
                <p className="font-semibold text-gray-800">{employeeInfo.position}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-teal-50 text-teal-600 rounded-lg"><Clock size={18} /></div>
              <div>
                <p className="text-sm text-gray-500 mb-0.5">Ca làm việc</p>
                <p className="font-semibold text-gray-800">{employeeInfo.shift}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Coins size={18} /></div>
              <div>
                <p className="text-sm text-gray-500 mb-0.5">Hệ số lương</p>
                <p className="font-semibold text-gray-800">{employeeInfo.salaryCoef}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. PHẦN THỐNG KÊ KHO HÀNG */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card: Đơn nhập hôm nay */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Đơn nhập hôm nay</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{warehouseStats.importOrdersToday} <span className="text-sm font-normal text-gray-500">đơn</span></p>
          </div>
        </div>

        {/* Card: Số sản phẩm nhập */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
            <PackagePlus size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Số sản phẩm nhập</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{warehouseStats.importedProductsToday} <span className="text-sm font-normal text-gray-500">sp</span></p>
          </div>
        </div>

        {/* Card: Số tiền đã nhập */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Số tiền đã nhập</p>
            <p className="text-xl font-bold text-indigo-600 mt-1">
              {warehouseStats.totalImportAmount.toLocaleString('vi-VN')} <span className="text-base font-medium underline">đ</span>
            </p>
          </div>
        </div>

        {/* Card: Cảnh báo tồn thấp */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Cảnh báo tồn thấp</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{warehouseStats.lowStockAlerts} <span className="text-sm font-normal text-gray-500">mã SP</span></p>
          </div>
        </div>

      </div>
    </div>
  );
}