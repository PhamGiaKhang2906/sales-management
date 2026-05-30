"use client";

import { useState } from 'react';
import { Plus, Eye } from 'lucide-react';
import { DataTable } from '../../components/layout/DataTable';
import { Modal } from '../../components/layout/Modal';

interface SalesOrder {
  id: number;
  orderCode: string;
  date: string;
  customerName: string;
  items: { product: string; quantity: number; price: number }[];
  total: number;
  status: string;
}

export function SalesOrdersPage() {
  const [orders, setOrders] = useState<SalesOrder[]>([
    {
      id: 1,
      orderCode: 'DH001',
      date: '2026-04-18',
      customerName: 'Nguyễn Văn A',
      items: [
        { product: 'Sản phẩm A', quantity: 2, price: 500000 },
        { product: 'Sản phẩm B', quantity: 1, price: 300000 },
      ],
      total: 1300000,
      status: 'Hoàn thành',
    },
    {
      id: 2,
      orderCode: 'DH002',
      date: '2026-04-19',
      customerName: 'Trần Thị B',
      items: [
        { product: 'Sản phẩm C', quantity: 3, price: 150000 },
      ],
      total: 450000,
      status: 'Đang xử lý',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingOrder, setViewingOrder] = useState<SalesOrder | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [orderItems, setOrderItems] = useState<{ product: string; quantity: number; price: number }[]>([]);
  const [newFormData, setNewFormData] = useState({
    customerName: '',
    date: new Date().toISOString().split('T')[0],
  });

  const columns = [
    { key: 'orderCode', label: 'Mã đơn' },
    { key: 'date', label: 'Ngày' },
    { key: 'customerName', label: 'Khách hàng' },
    { key: 'total', label: 'Tổng tiền', render: (value: number) => value.toLocaleString('vi-VN') + ' đ' },
    { key: 'status', label: 'Trạng thái', render: (value: string) => (
      <span className={`px-2 py-1 rounded text-sm ${
        value === 'Hoàn thành' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
      }`}>
        {value}
      </span>
    )},
  ];

  const handleView = (order: SalesOrder) => {
    setViewingOrder(order);
    setIsModalOpen(true);
  };

  const handleDelete = (order: SalesOrder) => {
    if (confirm(`Bạn có chắc muốn xóa đơn hàng "${order.orderCode}"?`)) {
      setOrders(orders.filter(o => o.id !== order.id));
    }
  };

  const handleAddItem = () => {
    setOrderItems([...orderItems, { product: '', quantity: 1, price: 0 }]);
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const total = orderItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const newOrder: SalesOrder = {
      id: Date.now(),
      orderCode: 'DH' + String(Date.now()).slice(-3),
      date: newFormData.date,
      customerName: newFormData.customerName,
      items: orderItems,
      total,
      status: 'Đang xử lý',
    };
    setOrders([...orders, newOrder]);
    setIsCreateModalOpen(false);
    setOrderItems([]);
    setNewFormData({ customerName: '', date: new Date().toISOString().split('T')[0] });
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-semibold text-2xl text-gray-800">Quản lý đơn bán hàng</h2>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Tạo đơn hàng
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <DataTable
          columns={columns}
          data={orders}
          onView={handleView}
          onDelete={handleDelete}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Chi tiết đơn hàng"
      >
        {viewingOrder && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500">Mã đơn hàng</p>
                <p className="font-medium">{viewingOrder.orderCode}</p>
              </div>
              <div>
                <p className="text-gray-500">Ngày</p>
                <p className="font-medium">{viewingOrder.date}</p>
              </div>
              <div>
                <p className="text-gray-500">Khách hàng</p>
                <p className="font-medium">{viewingOrder.customerName}</p>
              </div>
              <div>
                <p className="text-gray-500">Trạng thái</p>
                <p className="font-medium">{viewingOrder.status}</p>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Sản phẩm</h4>
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Tên sản phẩm</th>
                    <th className="px-4 py-2 text-left">Số lượng</th>
                    <th className="px-4 py-2 text-left">Đơn giá</th>
                    <th className="px-4 py-2 text-left">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {viewingOrder.items.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="px-4 py-2">{item.product}</td>
                      <td className="px-4 py-2">{item.quantity}</td>
                      <td className="px-4 py-2">{item.price.toLocaleString('vi-VN')} đ</td>
                      <td className="px-4 py-2">{(item.quantity * item.price).toLocaleString('vi-VN')} đ</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 text-right">
                <p className="font-semibold text-lg">Tổng: {viewingOrder.total.toLocaleString('vi-VN')} đ</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Tạo đơn hàng mới"
        size="lg"
      >
        <form onSubmit={handleSubmitOrder} className="space-y-4">
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
              <label className="block font-medium text-gray-700 mb-2">Ngày</label>
              <input
                type="date"
                value={newFormData.date}
                onChange={(e) => setNewFormData({ ...newFormData, date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block font-medium text-gray-700">Sản phẩm</label>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-blue-600 hover:text-blue-700"
              >
                + Thêm sản phẩm
              </button>
            </div>
            <div className="space-y-2">
              {orderItems.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Tên sản phẩm"
                    value={item.product}
                    onChange={(e) => {
                      const newItems = [...orderItems];
                      newItems[index].product = e.target.value;
                      setOrderItems(newItems);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                  <input
                    type="number"
                    placeholder="SL"
                    value={item.quantity}
                    onChange={(e) => {
                      const newItems = [...orderItems];
                      newItems[index].quantity = Number(e.target.value);
                      setOrderItems(newItems);
                    }}
                    className="w-20 px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Giá"
                    value={item.price}
                    onChange={(e) => {
                      const newItems = [...orderItems];
                      newItems[index].price = Number(e.target.value);
                      setOrderItems(newItems);
                    }}
                    className="w-32 px-4 py-2 border border-gray-300 rounded-lg"
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
              Tạo đơn
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}