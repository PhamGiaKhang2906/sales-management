"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, Package, TrendingUp } from 'lucide-react';

const formatCurrency = (value: unknown) => {
  const rawValue = Array.isArray(value) ? value[0] : value;
  const numericValue = Number(rawValue);

  if (Number.isNaN(numericValue)) {
    return '-';
  }

  return `${numericValue.toLocaleString('vi-VN')} đ`;
};

export function PersonalStatsPage() {
  const monthlyStats = [
    { month: 'T1', revenue: 12000000, orders: 45 },
    { month: 'T2', revenue: 15000000, orders: 52 },
    { month: 'T3', revenue: 13500000, orders: 48 },
    { month: 'T4', revenue: 18000000, orders: 62 },
  ];

  return (
    <div className="p-6">
      <h2 className="font-semibold text-2xl text-gray-800 mb-6">Thống kê cá nhân</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-500">Đơn hàng hôm nay</p>
              <p className="font-semibold text-2xl">8 đơn</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-gray-500">Doanh thu hôm nay</p>
              <p className="font-semibold text-2xl">3.2M đ</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-gray-500">Đơn hàng tháng này</p>
              <p className="font-semibold text-2xl">62 đơn</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-lg mb-4">Doanh thu theo tháng</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={formatCurrency} />
              <Legend />
              <Bar dataKey="revenue" fill="#3b82f6" name="Doanh thu" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-lg mb-4">Số đơn hàng theo tháng</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="orders" fill="#10b981" name="Số đơn" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 bg-white p-6 rounded-lg shadow">
        <h3 className="font-semibold text-lg mb-4">Tổng kết</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border-l-4 border-blue-500 pl-4">
            <p className="text-gray-500 mb-1">Tổng doanh thu trong năm</p>
            <p className="font-semibold text-xl">58,500,000 đ</p>
          </div>
          <div className="border-l-4 border-green-500 pl-4">
            <p className="text-gray-500 mb-1">Tổng đơn hàng trong năm</p>
            <p className="font-semibold text-xl">207 đơn</p>
          </div>
          <div className="border-l-4 border-purple-500 pl-4">
            <p className="text-gray-500 mb-1">Tổng doanh thu tháng này</p>
            <p className="font-semibold text-xl">18,000,000 đ</p>
          </div>
        </div>
      </div>
    </div>
  );
}