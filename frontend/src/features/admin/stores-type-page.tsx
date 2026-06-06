"use client";
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { DataTable } from '../../components/layout/DataTable';
import { Modal } from '../../components/layout/Modal';
import { useStoreTypes } from '@/hooks/useAdmin';
import { StoreTypeDTO } from '@/services/adminService';

export function StoreTypesPage() {
  const { storeTypes, isLoading, addStoreType, editStoreType, removeStoreType } = useStoreTypes();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<StoreTypeDTO | null>(null);
  const [formData, setFormData] = useState({ name: '' });

  const columns = [
    { key: 'name', label: 'Tên loại cửa hàng' },
    {
      key: 'totalStores',
      label: 'Số cửa hàng',
      render: (value: number) => (
        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full font-medium">
          {value || 0}
        </span>
      ),
    },
    { 
      key: 'CreatedAt', 
      label: 'Ngày tạo',
      render: (value: string) => value ? new Date(value).toLocaleDateString('vi-VN') : 'Mới'
    },
  ];

  const handleAdd = () => {
    setEditingType(null);
    setFormData({ name: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (type: StoreTypeDTO) => {
    setEditingType(type);
    setFormData({ name: type.name });
    setIsModalOpen(true);
  };

  const handleDelete = async (type: StoreTypeDTO) => {
    if (confirm(`Bạn có chắc muốn xóa loại cửa hàng "${type.name}"?`)) {
      const res = await removeStoreType(type.ID);
      if (res && res.success) {
        alert(res.message || "Xóa loại cửa hàng thành công!");
      } else {
        alert("Lỗi: " + (res?.message || "Không thể kết nối đến server"));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let res; // Biến lưu kết quả trả về từ API
    
    if (editingType) {
      res = await editStoreType(editingType.ID, formData.name);
    } else {
      res = await addStoreType(formData.name);
    }

    // Kiểm tra kết quả từ backend
    if (res && res.success) {
      alert(res.message || "Lưu loại cửa hàng thành công!");
      setIsModalOpen(false);
    } else {
      // Nếu thất bại, giữ nguyên Modal và hiện lỗi để người dùng biết
      alert("Lỗi: " + (res?.message || "Không thể kết nối đến server"));
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-2xl text-gray-800">Quản lý loại cửa hàng</h2>
          <p className="text-gray-600">Tạo và quản lý các danh mục cho cửa hàng đăng ký</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg shadow-md transition-colors"
        >
          <Plus className="w-5 h-5" />
          Thêm loại cửa hàng
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-emerald-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
          <p className="text-emerald-100 mb-2">Tổng loại cửa hàng</p>
          <p className="font-bold text-4xl">{storeTypes.length}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
          <p className="text-blue-100 mb-2">Tổng cửa hàng</p>
          <p className="font-bold text-4xl">
            {storeTypes.reduce((sum, t) => sum + (t.totalStores || 0), 0)}
          </p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
          <p className="text-purple-100 mb-2">Mới cập nhật</p>
          <p className="font-bold text-xl truncate">
            {storeTypes.length > 0 ? storeTypes[storeTypes.length - 1].name : 'Chưa có dữ liệu'}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500 font-medium">Đang tải dữ liệu...</div>
        ) : (
          <DataTable
            columns={columns}
            data={storeTypes}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingType ? 'Chỉnh sửa' : 'Thêm mới'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium text-gray-700 mb-2">Tên loại cửa hàng <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500"
              required autoFocus
            />
          </div>
          <div className="flex gap-3 justify-end pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 border rounded-lg">Hủy</button>
            <button type="submit" className="px-6 py-2 bg-emerald-600 text-white rounded-lg">{editingType ? 'Cập nhật' : 'Thêm mới'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}