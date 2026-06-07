"use client";

import { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Modal } from '../../components/layout/Modal';
import { useCustomers } from '@/hooks/useOwner';
import { Customer, CustomerCreatePayload, CustomerUpdatePayload } from '@/hooks/useOwner';

export function CustomersPage() {
  const { customers, loading, create, update, remove, refresh } = useCustomers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const [formData, setFormData] = useState<CustomerCreatePayload | CustomerUpdatePayload>({
    name: '',
    code: '',
    phone: '',
    email: '',
    address: '',
  });

  const handleAddClick = () => {
    setEditingCustomer(null);
    setFormData({ name: '', code: '', phone: '', email: '', address: '' });
    setIsModalOpen(true);
  };

  const handleEditClick = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name || (customer as any).Name || '',
      code: customer.code || (customer as any).Code || '',
      phone: customer.phone || (customer as any).Phone || '',
      email: customer.email || (customer as any).Email || '',
      address: customer.address || (customer as any).Address || '',
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa khách hàng này?")) {
      try {
        await remove(id);
        alert("Đã xóa khách hàng thành công!");
        refresh(); 
      } catch (err) {
        alert("Có lỗi xảy ra khi xóa khách hàng!");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCustomer) {
        const id = editingCustomer.id || (editingCustomer as any).ID;
        await update(id, formData as any);
      } else {
        await create(formData as any);
      }
      setIsModalOpen(false);
      refresh(); 
    } catch (err) {
      alert("Có lỗi xảy ra khi lưu dữ liệu khách hàng!");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Danh sách khách hàng</h1>
          <p className="text-gray-500 text-sm">Quản lý thông tin và danh bạ khách hàng của cửa hàng</p>
        </div>
        <button onClick={handleAddClick} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition shadow-sm">
          <Plus size={20} /> Thêm khách hàng
        </button>
      </div>

      <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">ID</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Mã KH</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Tên khách hàng</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Số điện thoại</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Email</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Địa chỉ</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-400">Đang tải dữ liệu khách hàng...</td></tr>
            ) : customers.length === 0 ? (
              <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-400">Chưa có khách hàng nào trong hệ thống</td></tr>
            ) : (
              customers.map((customer: Customer, index: number) => {
                const id = customer.id || (customer as any).ID;
                const code = customer.code || (customer as any).Code;
                const name = customer.name || (customer as any).Name;
                const phone = customer.phone || (customer as any).Phone;
                const email = customer.email || (customer as any).Email;
                const address = customer.address || (customer as any).Address;

                return (
                  <tr key={id || index} className="hover:bg-gray-50/70 transition">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">#{id}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">{code || '---'}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">{name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{phone}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{email || '---'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{address || '---'}</td>
                    <td className="px-6 py-4 text-sm text-right">
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => handleEditClick(customer)} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition"><Edit2 size={16} /></button>
                        <button onClick={() => handleDeleteClick(id)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingCustomer ? `Chỉnh sửa: ${formData.name}` : 'Thêm khách hàng mới'}>
        <div className="p-2">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Tên khách hàng</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Nhập tên" className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Mã KH</label>
                <input type="text" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} placeholder="VD: KH001" className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Số điện thoại</label>
                <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Địa chỉ</label>
              <textarea value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none" />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 border rounded-lg">Hủy</button>
              <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-lg">{editingCustomer ? 'Lưu' : 'Tạo'}</button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}