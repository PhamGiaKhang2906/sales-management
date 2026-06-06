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

  // Đảm bảo dữ liệu luôn là mảng để không lỗi hàm map/reduce
  const safeStoreTypes = Array.isArray(storeTypes) ? storeTypes : [];

  const columns = [
    { 
      key: 'name', 
      label: 'Tên loại cửa hàng',
      // Nhận diện cả chữ thường (name) và chữ hoa (Name) do Golang trả về
      render: (value: any, item: any) => <span className="font-medium">{item.name || item.Name || 'Trống'}</span>
    },
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
      // Xử lý an toàn cho ngày tháng
      render: (value: string, item: any) => {
        const dateString = value || item.created_at || item.CreatedAt;
        return dateString ? new Date(dateString).toLocaleDateString('vi-VN') : 'Mới';
      }
    },
  ];

  const handleAdd = () => {
    setEditingType(null);
    setFormData({ name: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (type: StoreTypeDTO) => {
    setEditingType(type);
    // Lấy ID và Name an toàn
    const typeName = (type as any).name || (type as any).Name || '';
    setFormData({ name: typeName });
    setIsModalOpen(true);
  };

  const handleDelete = async (type: StoreTypeDTO) => {
    const typeName = (type as any).name || (type as any).Name || 'này';
    const typeId = type.ID || (type as any).id;
    
    if (confirm(`Bạn có chắc muốn xóa loại cửa hàng "${typeName}"?`)) {
      const res = await removeStoreType(typeId);
      // Hiển thị thông báo nếu có lỗi từ server, nếu không thì cứ âm thầm xóa
      if (res && res.message && !res.success && res.success !== undefined) {
        alert("Lỗi: " + res.message);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let res; 
    if (editingType) {
      const typeId = editingType.ID || (editingType as any).id;
      res = await editStoreType(typeId, formData.name);
    } else {
      res = await addStoreType(formData.name);
    }

    // Luôn đóng popup khi submit xong, hàm fetchStoreTypes sẽ tự load lại bảng
    setIsModalOpen(false);
    
    if (res && res.message && res.success === false) {
      alert("Lỗi: " + res.message);
    }
  };

  // Xác định tên loại hàng mới nhất để hiện lên Stats
  const latestType = safeStoreTypes.length > 0 ? safeStoreTypes[safeStoreTypes.length - 1] : null;
  const latestName = latestType ? ((latestType as any).name || (latestType as any).Name) : 'Chưa có dữ liệu';

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
          <p className="font-bold text-4xl">{safeStoreTypes.length}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
          <p className="text-blue-100 mb-2">Tổng cửa hàng</p>
          <p className="font-bold text-4xl">
            {safeStoreTypes.reduce((sum, t) => sum + (t.totalStores || 0), 0)}
          </p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
          <p className="text-purple-100 mb-2">Mới cập nhật</p>
          <p className="font-bold text-xl truncate">
            {latestName}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500 font-medium">Đang tải dữ liệu...</div>
        ) : (
          <DataTable
            columns={columns}
            data={safeStoreTypes}
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
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 border rounded-lg hover:bg-gray-50">Hủy</button>
            <button type="submit" className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">{editingType ? 'Cập nhật' : 'Thêm mới'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}