"use client";

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { DataTable } from '../../components/layout/DataTable';
import { Modal } from '../../components/layout/Modal';

interface Customer {
  id: number;
  name: string;
  code: string;
  phone: string;
  email: string;
  address: string;
  totalPurchases: number;
}

export function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([
    { id: 1, name: 'Nguyễn Văn A', code: 'KH001', phone: '0901111111', email: 'a@example.com', address: 'Hà Nội', totalPurchases: 5000000 },
    { id: 2, name: 'Trần Thị B', code: 'KH002', phone: '0902222222', email: 'b@example.com', address: 'TP HCM', totalPurchases: 3000000 },
    { id: 3, name: 'Lê Văn C', code: 'KH003', phone: '0903333333', email: 'c@example.com', address: 'Đà Nẵng', totalPurchases: 7000000 },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    phone: '',
    email: '',
    address: '',
  });

  const columns = [
    { key: 'code', label: 'Mã KH' },
    { key: 'name', label: 'Tên khách hàng' },
    { key: 'phone', label: 'Số điện thoại' },
    { key: 'email', label: 'Email' },
    { key: 'address', label: 'Địa chỉ' },
    { key: 'totalPurchases', label: 'Tổng mua', render: (value: number) => value.toLocaleString('vi-VN') + ' đ' },
  ];

  const handleAdd = () => {
    setEditingCustomer(null);
    setFormData({ name: '', code: '', phone: '', email: '', address: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData(customer);
    setIsModalOpen(true);
  };

  const handleDelete = (customer: Customer) => {
    if (confirm(`Bạn có chắc muốn xóa khách hàng "${customer.name}"?`)) {
      setCustomers(customers.filter(c => c.id !== customer.id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCustomer) {
      setCustomers(customers.map(c => c.id === editingCustomer.id ? { ...formData, id: c.id, totalPurchases: c.totalPurchases } : c));
    } else {
      setCustomers([...customers, { ...formData, id: Date.now(), totalPurchases: 0 }]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-semibold text-2xl text-gray-800">Quản lý khách hàng</h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Thêm khách hàng
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <DataTable
          columns={columns}
          data={customers}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCustomer ? 'Chỉnh sửa khách hàng' : 'Thêm khách hàng mới'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium text-gray-700 mb-2">Mã khách hàng</label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-2">Tên khách hàng</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-2">Số điện thoại</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-2">Địa chỉ</label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              required
            />
          </div>
          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {editingCustomer ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}