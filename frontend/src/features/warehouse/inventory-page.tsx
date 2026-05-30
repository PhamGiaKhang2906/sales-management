"use client";

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Package, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

export function InventoryPage() {
  const [selectedView, setSelectedView] = useState('overview');

  const inventoryData = [
    { category: 'Điện tử', stock: 450, imports: 120, returns: 15 },
    { category: 'Thời trang', stock: 320, imports: 95, returns: 22 },
    { category: 'Gia dụng', stock: 580, imports: 150, returns: 18 },
    { category: 'Mỹ phẩm', stock: 280, imports: 80, returns: 12 },
  ];

  const lowStockItems = [
    { name: 'Sản phẩm X', sku: 'SP015', stock: 15, minStock: 50 },
    { name: 'Sản phẩm Y', sku: 'SP022', stock: 8, minStock: 30 },
    { name: 'Sản phẩm Z', sku: 'SP031', stock: 22, minStock: 40 },
  ];

  const supplierStats = [
    { supplier: 'NCC A', imports: 450, returns: 15 },
    { supplier: 'NCC B', imports: 380, returns: 22 },
    { supplier: 'NCC C', imports: 520, returns: 18 },
  ];

  return (
    <div className="p-6">
      <h2 className="font-semibold text-2xl text-gray-800 mb-6">Thống kê tồn kho</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-500">Tổng tồn kho</p>
              <p className="font-semibold text-2xl">1,630</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-gray-500">Hàng nhập tháng này</p>
              <p className="font-semibold text-2xl">445</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-red-100 rounded-lg">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-gray-500">Hàng trả tháng này</p>
              <p className="font-semibold text-2xl">67</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-gray-500">Cảnh báo tồn thấp</p>
              <p className="font-semibold text-2xl">3</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setSelectedView('overview')}
          className={`px-4 py-2 rounded-lg ${selectedView === 'overview' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
        >
          Tổng quan tồn kho
        </button>
        <button
          onClick={() => setSelectedView('suppliers')}
          className={`px-4 py-2 rounded-lg ${selectedView === 'suppliers' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
        >
          Theo nhà cung cấp
        </button>
        <button
          onClick={() => setSelectedView('alerts')}
          className={`px-4 py-2 rounded-lg ${selectedView === 'alerts' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
        >
          Cảnh báo tồn kho
        </button>
      </div>

      {selectedView === 'overview' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-lg mb-4">Tồn kho theo danh mục</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={inventoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="stock" fill="#3b82f6" name="Tồn kho" />
              <Bar dataKey="imports" fill="#10b981" name="Hàng nhập" />
              <Bar dataKey="returns" fill="#ef4444" name="Hàng trả" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {selectedView === 'suppliers' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-lg mb-4">Thống kê theo nhà cung cấp</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={supplierStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="supplier" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="imports" fill="#10b981" name="Hàng nhập" />
              <Bar dataKey="returns" fill="#ef4444" name="Hàng trả" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {selectedView === 'alerts' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-lg mb-4">Sản phẩm tồn kho thấp</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Mã SP</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Tên sản phẩm</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Tồn kho hiện tại</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Tồn kho tối thiểu</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {lowStockItems.map((item, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="px-4 py-3">{item.sku}</td>
                    <td className="px-4 py-3">{item.name}</td>
                    <td className="px-4 py-3 font-medium">{item.stock}</td>
                    <td className="px-4 py-3">{item.minStock}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-sm">
                        Cần nhập hàng
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}