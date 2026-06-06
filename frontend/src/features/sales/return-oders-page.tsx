"use client";

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { DataTable } from '../../components/layout/DataTable';
import { Modal } from '../../components/layout/Modal';

interface ReturnOrder {
  id: number;
  returnCode: string;
  date: string;
  customerName: string;
  originalOrder: string;
  items: { product: string; quantity: number; price: number; reason: string }[];
  total: number;
  status: string;
}

export function ReturnOrdersPage() {
  const [returns, setReturns] = useState<ReturnOrder[]>([
    {
      id: 1,
      returnCode: 'TH001',
      date: '2026-04-17',
      customerName: 'Nguyễn Văn A',
      originalOrder: 'DH001',
      items: [
        { product: 'Sản phẩm B', quantity: 1, price: 300000, reason: 'Lỗi sản phẩm' },
      ],
      total: 300000,
      status: 'Đã xử lý',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingReturn, setViewingReturn] = useState<ReturnOrder | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [returnItems, setReturnItems] = useState<{ product: string; quantity: number; price: number; reason: string }[]>([]);
  const [newFormData, setNewFormData] = useState({
    customerName: '',
    originalOrder: '',
    date: new Date().toISOString().split('T')[0],
  });

  const columns = [
    { key: 'returnCode', label: 'Mã đơn trả' },
    { key: 'date', label: 'Ngày' },
    { key: 'customerName', label: 'Khách hàng' },
    { key: 'originalOrder', label: 'Đơn gốc' },
    { key: 'total', label: 'Tổng tiền', render: (value: number) => value.toLocaleString('vi-VN') + ' đ' },
    { key: 'status', label: 'Trạng thái', render: (value: string) => (
      <span className={`px-2 py-1 rounded text-sm ${
        value === 'Đã xử lý' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
      }`}>
        {value}
      </span>
    )},
  ];

  const handleView = (returnOrder: ReturnOrder) => {
    setViewingReturn(returnOrder);
    setIsModalOpen(true);
  };

  const handleDelete = (returnOrder: ReturnOrder) => {
    if (confirm(`Bạn có chắc muốn xóa đơn trả "${returnOrder.returnCode}"?`)) {
      setReturns(returns.filter(r => r.id !== returnOrder.id));
    }
  };

  const handleAddItem = () => {
    setReturnItems([...returnItems, { product: '', quantity: 1, price: 0, reason: '' }]);
  };

  const handleSubmitReturn = (e: React.FormEvent) => {
    e.preventDefault();
    const total = returnItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const newReturn: ReturnOrder = {
      id: Date.now(),
      returnCode: 'TH' + String(Date.now()).slice(-3),
      date: newFormData.date,
      customerName: newFormData.customerName,
      originalOrder: newFormData.originalOrder,
      items: returnItems,
      total,
      status: 'Chờ xử lý',
    };
    setReturns([...returns, newReturn]);
    setIsCreateModalOpen(false);
    setReturnItems([]);
    setNewFormData({ customerName: '', originalOrder: '', date: new Date().toISOString().split('T')[0] });
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-semibold text-2xl text-gray-800">Quản lý đơn trả hàng</h2>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Tạo đơn trả hàng
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <DataTable
          columns={columns}
          data={returns}
          onView={handleView}
          onDelete={handleDelete}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Chi tiết đơn trả hàng"
      >
        {viewingReturn && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500">Mã đơn trả</p>
                <p className="font-medium">{viewingReturn.returnCode}</p>
              </div>
              <div>
                <p className="text-gray-500">Ngày</p>
                <p className="font-medium">{viewingReturn.date}</p>
              </div>
              <div>
                <p className="text-gray-500">Khách hàng</p>
                <p className="font-medium">{viewingReturn.customerName}</p>
              </div>
              <div>
                <p className="text-gray-500">Đơn gốc</p>
                <p className="font-medium">{viewingReturn.originalOrder}</p>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Sản phẩm trả</h4>
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Tên sản phẩm</th>
                    <th className="px-4 py-2 text-left">SL</th>
                    <th className="px-4 py-2 text-left">Đơn giá</th>
                    <th className="px-4 py-2 text-left">Lý do</th>
                  </tr>
                </thead>
                <tbody>
                  {viewingReturn.items.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="px-4 py-2">{item.product}</td>
                      <td className="px-4 py-2">{item.quantity}</td>
                      <td className="px-4 py-2">{item.price.toLocaleString('vi-VN')} đ</td>
                      <td className="px-4 py-2">{item.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 text-right">
                <p className="font-semibold text-lg">Tổng hoàn trả: {viewingReturn.total.toLocaleString('vi-VN')} đ</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Tạo đơn trả hàng mới"
        size="lg"
      >
        <form onSubmit={handleSubmitReturn} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-2">Tên khách hàng</label>
              <input
                type="text"
                value={newFormData.customerName}
                onChange={(e) => setNewFormData({ ...newFormData, customerName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-2">Mã đơn gốc</label>
              <input
                type="text"
                value={newFormData.originalOrder}
                onChange={(e) => setNewFormData({ ...newFormData, originalOrder: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-2">Ngày trả</label>
            <input
              type="date"
              value={newFormData.date}
              onChange={(e) => setNewFormData({ ...newFormData, date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block font-medium text-gray-700">Sản phẩm trả</label>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-blue-600 hover:text-blue-700"
              >
                + Thêm sản phẩm
              </button>
            </div>
            <div className="space-y-2">
              {returnItems.map((item, index) => (
                <div key={index} className="grid grid-cols-4 gap-2">
                  <input
                    type="text"
                    placeholder="Tên SP"
                    value={item.product}
                    onChange={(e) => {
                      const newItems = [...returnItems];
                      newItems[index].product = e.target.value;
                      setReturnItems(newItems);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                  <input
                    type="number"
                    placeholder="SL"
                    value={item.quantity}
                    onChange={(e) => {
                      const newItems = [...returnItems];
                      newItems[index].quantity = Number(e.target.value);
                      setReturnItems(newItems);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Giá"
                    value={item.price}
                    onChange={(e) => {
                      const newItems = [...returnItems];
                      newItems[index].price = Number(e.target.value);
                      setReturnItems(newItems);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Lý do"
                    value={item.reason}
                    onChange={(e) => {
                      const newItems = [...returnItems];
                      newItems[index].reason = e.target.value;
                      setReturnItems(newItems);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Tạo đơn trả
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}