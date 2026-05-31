"use client";

import { ShoppingCart, RotateCcw, DollarSign, UserPlus, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function OwnerDashboard() {
  const todayStats = {
    orders: 24,
    returns: 3,
    profit: 8500000,
    newCustomers: 5,
  };

  const topProducts = [
    { name: 'Sản phẩm A', sold: 15, revenue: 7500000 },
    { name: 'Sản phẩm B', sold: 12, revenue: 3600000 },
    { name: 'Sản phẩm C', sold: 10, revenue: 1500000 },
    { name: 'Sản phẩm D', sold: 8, revenue: 2400000 },
    { name: 'Sản phẩm E', sold: 6, revenue: 1800000 },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="font-semibold text-2xl text-gray-800">Tổng quan hôm nay</h2>
        <p className="text-gray-600">Thứ Bảy, 30 tháng 5, 2026</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <ShoppingCart className="w-8 h-8" />
            </div>
            <div className="text-right">
              <p className="text-blue-100 text-sm mb-1">Hôm nay</p>
              <p className="text-3xl font-bold">{todayStats.orders}</p>
            </div>
          </div>
          <div className="border-t border-white border-opacity-20 pt-3">
            <p className="font-medium">Đơn hàng mua</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <RotateCcw className="w-8 h-8" />
            </div>
            <div className="text-right">
              <p className="text-red-100 text-sm mb-1">Hôm nay</p>
              <p className="text-3xl font-bold">{todayStats.returns}</p>
            </div>
          </div>
          <div className="border-t border-white border-opacity-20 pt-3">
            <p className="font-medium">Đơn hàng trả</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <DollarSign className="w-8 h-8" />
            </div>
            <div className="text-right">
              <p className="text-green-100 text-sm mb-1">Hôm nay</p>
              <p className="text-3xl font-bold">{(todayStats.profit / 1000000).toFixed(1)}M</p>
            </div>
          </div>
          <div className="border-t border-white border-opacity-20 pt-3">
            <p className="font-medium">Lợi nhuận</p>
            <p className="text-green-100 text-sm">{todayStats.profit.toLocaleString('vi-VN')} đ</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <UserPlus className="w-8 h-8" />
            </div>
            <div className="text-right">
              <p className="text-purple-100 text-sm mb-1">Hôm nay</p>
              <p className="text-3xl font-bold">{todayStats.newCustomers}</p>
            </div>
          </div>
          <div className="border-t border-white border-opacity-20 pt-3">
            <p className="font-medium">Khách hàng mới</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-orange-100 rounded-lg">
            <TrendingUp className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h3 className="font-semibold text-xl text-gray-800">Top mặt hàng bán chạy hôm nay</h3>
            <p className="text-gray-600 text-sm">Sản phẩm có doanh thu cao nhất</p>
          </div>
        </div>

        <div className="mb-6">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={topProducts}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="name"
                tick={{ fill: '#6b7280' }}
                tickLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis
                tick={{ fill: '#6b7280' }}
                tickLine={{ stroke: '#e5e7eb' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
                formatter={(value, name) => {
                  if (name === 'Doanh thu') {
                    return `${Number(value).toLocaleString('vi-VN')} đ`;
                  }
                  return value;
                }}
              />
              <Legend />
              <Bar dataKey="sold" fill="#3b82f6" name="Số lượng bán" radius={[8, 8, 0, 0]} />
              <Bar dataKey="revenue" fill="#10b981" name="Doanh thu" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-200">
                  <th className="pb-3 font-semibold text-gray-700">#</th>
                  <th className="pb-3 font-semibold text-gray-700">Tên sản phẩm</th>
                  <th className="pb-3 font-semibold text-gray-700 text-right">Số lượng bán</th>
                  <th className="pb-3 font-semibold text-gray-700 text-right">Doanh thu</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 text-gray-600">{index + 1}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                          <span className="font-semibold text-blue-600">{product.name.slice(-1)}</span>
                        </div>
                        <span className="font-medium text-gray-800">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-4 text-right">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        {product.sold} sp
                      </span>
                    </td>
                    <td className="py-4 text-right font-medium text-green-600">
                      {product.revenue.toLocaleString('vi-VN')} đ
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-600 text-sm font-medium mb-1">Tổng số lượng</p>
            <p className="font-bold text-2xl text-blue-700">
              {topProducts.reduce((sum, p) => sum + p.sold, 0)} sản phẩm
            </p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-600 text-sm font-medium mb-1">Tổng doanh thu</p>
            <p className="font-bold text-2xl text-green-700">
              {topProducts.reduce((sum, p) => sum + p.revenue, 0).toLocaleString('vi-VN')} đ
            </p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-purple-600 text-sm font-medium mb-1">Trung bình/sản phẩm</p>
            <p className="font-bold text-2xl text-purple-700">
              {(topProducts.reduce((sum, p) => sum + p.revenue, 0) / topProducts.length / 1000000).toFixed(1)}M đ
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
