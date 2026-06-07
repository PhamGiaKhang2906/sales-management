"use client";

import { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Modal } from '../../components/layout/Modal';
import { useSuppliers, Supplier } from '@/hooks/useOwner';

export function SuppliersPage() {
  const { suppliers, loading, create, update, remove, refresh } = useSuppliers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  // Form chỉ còn Name, Phone, Email, Address
  const [formData, setFormData] = useState({ 
    name: '', 
    phone: '', 
    email: '', 
    address: '' 
  });

  const handleAddClick = () => {
    setEditingSupplier(null);
    setFormData({ name: '', phone: '', email: '', address: '' });
    setIsModalOpen(true);
  };

  const handleEditClick = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      name: supplier.name || (supplier as any).Name || '',
      phone: supplier.phone || (supplier as any).Phone || '',
      email: supplier.email || (supplier as any).Email || '',
      address: supplier.address || (supplier as any).Address || '',
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (id: number) => {
    if (confirm("Xóa nhà cung cấp này?")) {
      try {
        await remove(id);
        refresh();
      } catch (err) { alert("Lỗi khi xóa!"); }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSupplier) {
        const id = editingSupplier.id || (editingSupplier as any).ID;
        await update(id, formData as any);
      } else {
        await create(formData as any);
      }
      setIsModalOpen(false);
      refresh();
    } catch (err) { alert("Lỗi khi lưu!"); }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Danh sách nhà cung cấp</h1>
          <p className="text-gray-500 text-sm">Quản lý đối tác cung ứng và nguồn hàng</p>
        </div>
        <button onClick={handleAddClick} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg">
          <Plus size={20} /> Thêm nhà cung cấp
        </button>
      </div>

      <div className="bg-white rounded-xl shadow border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              {/* Chỉ giữ lại Tên, SĐT, Email, Địa chỉ */}
              <th className="px-6 py-4 text-sm font-semibold">Tên nhà cung cấp</th>
              <th className="px-6 py-4 text-sm font-semibold">Số điện thoại</th>
              <th className="px-6 py-4 text-sm font-semibold">Email</th>
              <th className="px-6 py-4 text-sm font-semibold">Địa chỉ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={4} className="text-center py-8 text-gray-400">Đang tải...</td></tr>
            ) : suppliers.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-8 text-gray-400">Chưa có dữ liệu</td></tr>
            ) : (
              suppliers.map((supplier: Supplier, index: number) => {
                const id = supplier.id || (supplier as any).ID;
                return (
                  <tr key={id || index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium">{supplier.name || (supplier as any).Name}</td>
                    <td className="px-6 py-4 text-sm">{supplier.phone || (supplier as any).Phone}</td>
                    <td className="px-6 py-4 text-sm">{supplier.email || (supplier as any).Email || '---'}</td>
                    <td className="px-6 py-4 text-sm">{supplier.address || (supplier as any).Address || '---'}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingSupplier ? `Chỉnh sửa: ${formData.name}` : 'Thêm nhà cung cấp'}>
        <div className="p-2">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="block text-sm mb-1.5">Tên NCC</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 border rounded-lg" required /></div>
            <div><label className="block text-sm mb-1.5">Số điện thoại</label><input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-2 border rounded-lg" required /></div>
            <div><label className="block text-sm mb-1.5">Email</label><input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2 border rounded-lg" /></div>
            <div><label className="block text-sm mb-1.5">Địa chỉ</label><textarea value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} rows={3} className="w-full px-4 py-2 border rounded-lg" /></div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 border rounded-lg">Hủy</button>
              <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-lg">{editingSupplier ? 'Lưu' : 'Tạo'}</button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}