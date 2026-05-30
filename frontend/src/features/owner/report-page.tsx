"use client";

import { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

const formatCurrency = (value: unknown) => {
  const rawValue = Array.isArray(value) ? value[0] : value;
  const numericValue = Number(rawValue);

  if (Number.isNaN(numericValue)) {
    return '-';
  }

  return `${numericValue.toLocaleString('vi-VN')} đ`;
};

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState('overview');

  const topProducts = [
    { name: 'Sản phẩm A', sold: 120 },
    { name: 'Sản phẩm B', sold: 98 },
    { name: 'Sản phẩm C', sold: 86 },
    { name: 'Sản phẩm D', sold: 75 },
    { name: 'Sản phẩm E', sold: 65 },
  ];

  const topEmployees = [
    { name: 'Nguyễn Văn X', revenue: 45000000 },
    { name: 'Trần Thị Y', revenue: 38000000 },
    { name: 'Lê Văn Z', revenue: 32000000 },
  ];

  const topCustomers = [
    { name: 'KH001 - Nguyễn Văn A', purchases: 15000000 },
    { name: 'KH003 - Lê Văn C', purchases: 12000000 },
    { name: 'KH002 - Trần Thị B', purchases: 9000000 },
  ];

  const monthlyData = [
    { month: 'T1', sales: 120, imports: 80, returns: 15, revenue: 45000000 },
    { month: 'T2', sales: 135, imports: 90, returns: 12, revenue: 52000000 },
    { month: 'T3', sales: 148, imports: 85, returns: 18, revenue: 58000000 },
    { month: 'T4', sales: 162, imports: 95, returns: 14, revenue: 65000000 },
  ];

  const dailyStats = [
    { date: '15/04', sales: 45, returns: 3, imports: 20, income: 18000000, expense: 8000000 },
    { date: '16/04', sales: 52, returns: 2, imports: 15, income: 21000000, expense: 6000000 },
    { date: '17/04', sales: 48, returns: 4, imports: 25, income: 19000000, expense: 10000000 },
    { date: '18/04', sales: 58, returns: 5, imports: 18, income: 23000000, expense: 7000000 },
    { date: '19/04', sales: 62, returns: 3, imports: 22, income: 25000000, expense: 9000000 },
  ];

  return (
    <div className="p-6">
      <h2 className="font-semibold text-2xl text-gray-800 mb-6">Báo cáo thống kê</h2>

      <div className="mb-6 flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedReport('overview')}
          className={`px-4 py-2 rounded-lg ${selectedReport === 'overview' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
        >
          Tổng quan
        </button>
        <button
          onClick={() => setSelectedReport('products')}
          className={`px-4 py-2 rounded-lg ${selectedReport === 'products' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
        >
          Top mặt hàng
        </button>
        <button
          onClick={() => setSelectedReport('employees')}
          className={`px-4 py-2 rounded-lg ${selectedReport === 'employees' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
        >
          Top nhân viên
        </button>
        <button
          onClick={() => setSelectedReport('customers')}
          className={`px-4 py-2 rounded-lg ${selectedReport === 'customers' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
        >
          Top khách hàng
        </button>
        <button
          onClick={() => setSelectedReport('monthly')}
          className={`px-4 py-2 rounded-lg ${selectedReport === 'monthly' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
        >
          Theo tháng
        </button>
        <button
          onClick={() => setSelectedReport('daily')}
          className={`px-4 py-2 rounded-lg ${selectedReport === 'daily' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
        >
          Theo ngày
        </button>
      </div>

      {selectedReport === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-500 mb-2">Doanh thu tháng này</p>
            <p className="font-semibold text-2xl text-gray-800 mb-2">65,000,000 đ</p>
            <div className="flex items-center gap-1 text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">+12% so với quý trước</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-500 mb-2">Đơn hàng tháng này</p>
            <p className="font-semibold text-2xl text-gray-800 mb-2">162 đơn</p>
            <div className="flex items-center gap-1 text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">+8% so với quý trước</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-500 mb-2">Đơn trả hàng</p>
            <p className="font-semibold text-2xl text-gray-800 mb-2">14 đơn</p>
            <div className="flex items-center gap-1 text-red-600">
              <TrendingDown className="w-4 h-4" />
              <span className="text-sm">-3% so với quý trước</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-500 mb-2">Khách hàng mới</p>
            <p className="font-semibold text-2xl text-gray-800 mb-2">28 người</p>
            <div className="flex items-center gap-1 text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">+15% so với quý trước</span>
            </div>
          </div>
        </div>
      )}

      {selectedReport === 'products' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-lg mb-4">Top mặt hàng bán chạy</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={topProducts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sold" fill="#3b82f6" name="Số lượng bán" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {selectedReport === 'employees' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-lg mb-4">Top nhân viên bán nhiều</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={topEmployees}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={formatCurrency} />
              <Legend />
              <Bar dataKey="revenue" fill="#10b981" name="Doanh thu" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {selectedReport === 'customers' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-lg mb-4">Top khách hàng mua nhiều</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={topCustomers}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={formatCurrency} />
              <Legend />
              <Bar dataKey="purchases" fill="#f59e0b" name="Tổng mua" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {selectedReport === 'monthly' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold text-lg mb-4">Doanh thu theo tháng</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={formatCurrency} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" name="Doanh thu" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold text-lg mb-4">Số lượng hàng hóa</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#10b981" name="Hàng bán" />
                <Bar dataKey="imports" fill="#3b82f6" name="Hàng nhập" />
                <Bar dataKey="returns" fill="#ef4444" name="Hàng trả" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {selectedReport === 'daily' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold text-lg mb-4">Thu chi theo ngày</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={formatCurrency} />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="#10b981" name="Tiền thu" strokeWidth={2} />
                <Line type="monotone" dataKey="expense" stroke="#ef4444" name="Tiền chi" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold text-lg mb-4">Hoạt động theo ngày</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#10b981" name="Hàng bán" />
                <Bar dataKey="returns" fill="#ef4444" name="Hàng trả" />
                <Bar dataKey="imports" fill="#3b82f6" name="Hàng nhập" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}