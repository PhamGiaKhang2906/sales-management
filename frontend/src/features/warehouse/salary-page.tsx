"use client";

import { DollarSign, TrendingUp, Calendar } from 'lucide-react';

export function SalaryPage() {
  const salaryData = {
    baseSalary: 8000000,
    bonus: 2500000,
    commission: 1200000,
    total: 11700000,
    thisMonth: {
      workDays: 22,
      sales: 18000000,
      orders: 62,
    },
  };

  return (
    <div className="p-6">
      <h2 className="font-semibold text-2xl text-gray-800 mb-6">Lương thưởng</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-500">Lương cơ bản</p>
              <p className="font-semibold text-2xl">{salaryData.baseSalary.toLocaleString('vi-VN')} đ</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-gray-500">Thưởng hiệu suất</p>
              <p className="font-semibold text-2xl">{salaryData.bonus.toLocaleString('vi-VN')} đ</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-gray-500">Hoa hồng</p>
              <p className="font-semibold text-2xl">{salaryData.commission.toLocaleString('vi-VN')} đ</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-lg shadow-lg mb-6">
        <p className="text-lg mb-2">Tổng lương tháng này</p>
        <p className="font-semibold text-4xl mb-4">{salaryData.total.toLocaleString('vi-VN')} đ</p>
        <p className="text-blue-100">Dự kiến thanh toán: 30/04/2026</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="font-semibold text-lg mb-4">Chi tiết tháng này</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
            <span className="text-gray-600">Số ngày công</span>
            <span className="font-medium">{salaryData.thisMonth.workDays} ngày</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
            <span className="text-gray-600">Doanh số bán hàng</span>
            <span className="font-medium">{salaryData.thisMonth.sales.toLocaleString('vi-VN')} đ</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
            <span className="text-gray-600">Số đơn hàng</span>
            <span className="font-medium">{salaryData.thisMonth.orders} đơn</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
            <span className="text-gray-600">Tỷ lệ hoa hồng</span>
            <span className="font-medium">7%</span>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="font-semibold text-gray-800">Tổng cộng</span>
            <span className="font-semibold text-xl text-blue-600">{salaryData.total.toLocaleString('vi-VN')} đ</span>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800">
          <strong>Ghi chú:</strong> Lương thưởng được tính dựa trên số ngày công, doanh số bán hàng và hiệu suất làm việc.
          Hoa hồng được tính 7% trên tổng doanh số.
        </p>
      </div>
    </div>
  );
}