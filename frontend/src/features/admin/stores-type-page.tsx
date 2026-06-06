"use client";
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { DataTable } from '../../components/layout/DataTable';
import { Modal } from '../../components/layout/Modal';

interface StoreType {
  id: number;
  name: string;
  totalStores: number;
  createdDate: string;
}

export function StoreTypesPage() {
  const [storeTypes, setStoreTypes] = useState<StoreType[]>([
    { id: 1, name: 'Thời trang', totalStores: 125, createdDate: '2026-01-15' },
    { id: 2, name: 'Điện thoại & Điện máy', totalStores: 98, createdDate: '2026-01-15' },
    { id: 3, name: 'Vật liệu xây dựng', totalStores: 45, createdDate: '2026-01-15' },
    { id: 4, name: 'Nhà thuốc', totalStores: 67, createdDate: '2026-01-15' },
    { id: 5, name: 'Mẹ & Bé', totalStores: 82, createdDate: '2026-01-15' },
    { id: 6, name: 'Sách & Văn phòng phẩm', totalStores: 54, createdDate: '2026-01-15' },
    { id: 7, name: 'Sản xuất', totalStores: 38, createdDate: '2026-01-15' },
    { id: 8, name: 'Tạp hóa & Siêu thị', totalStores: 156, createdDate: '2026-01-15' },
    { id: 9, name: 'Mỹ phẩm', totalStores: 91, createdDate: '2026-01-15' },
    { id: 10, name: 'Nông sản & Thực phẩm', totalStores: 73, createdDate: '2026-01-15' },
    { id: 11, name: 'Xe, Máy móc', totalStores: 42, createdDate: '2026-01-15' },
    { id: 12, name: 'Nội thất & Gia dụng', totalStores: 88, createdDate: '2026-01-15' },
    { id: 13, name: 'Hoa & Quà tặng', totalStores: 34, createdDate: '2026-01-15' },
    { id: 14, name: 'Khác', totalStores: 27, createdDate: '2026-01-15' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<StoreType | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
  });

  const columns = [
    { key: 'name', label: 'Tên loại cửa hàng' },
    {
      key: 'totalStores',
      label: 'Số cửa hàng',
      render: (value: number) => (
        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full font-medium">
          {value}
        </span>
      ),
    },
    { key: 'createdDate', label: 'Ngày tạo' },
  ];

  const handleAdd = () => {
    setEditingType(null);
    setFormData({ name: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (type: StoreType) => {
    setEditingType(type);
    setFormData({ name: type.name });
    setIsModalOpen(true);
  };

  const handleDelete = (type: StoreType) => {
    if (type.totalStores > 0) {
      alert(`Không thể xóa loại cửa hàng "${type.name}" vì đang có ${type.totalStores} cửa hàng sử dụng!`);
      return;
    }
    if (confirm(`Bạn có chắc muốn xóa loại cửa hàng "${type.name}"?`)) {
      setStoreTypes(storeTypes.filter(t => t.id !== type.id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingType) {
      setStoreTypes(
        storeTypes.map(t =>
          t.id === editingType.id
            ? { ...t, ...formData }
            : t
        )
      );
    } else {
      setStoreTypes([
        ...storeTypes,
        {
          id: Date.now(),
          ...formData,
          totalStores: 0,
          createdDate: new Date().toISOString().split('T')[0],
        },
      ]);
    }
    setIsModalOpen(false);
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

      {/* Đã đổi md:grid-cols-4 thành md:grid-cols-3 để hiển thị 3 ô cân đối */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-emerald-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
          <p className="text-emerald-100 mb-2">Tổng loại cửa hàng</p>
          <p className="font-bold text-4xl">{storeTypes.length}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
          <p className="text-blue-100 mb-2">Tổng cửa hàng</p>
          <p className="font-bold text-4xl">{storeTypes.reduce((sum, t) => sum + t.totalStores, 0)}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
          <p className="text-purple-100 mb-2">Phổ biến nhất</p>
          <p className="font-bold text-xl truncate">
            {storeTypes.sort((a, b) => b.totalStores - a.totalStores)[0]?.name}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md">
        <DataTable
          columns={columns}
          data={storeTypes}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingType ? 'Chỉnh sửa loại cửa hàng' : 'Thêm loại cửa hàng mới'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Tên loại cửa hàng <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Ví dụ: Thời trang"
              required
              autoFocus
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
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              {editingType ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}