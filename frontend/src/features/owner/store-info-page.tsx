"use client";

import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { useStore } from '@/hooks/useOwner';

export function StoreInfoPage() {
  const { storeInfo, loading, updateStore, refresh } = useStore();
  const [formData, setFormData] = useState({
    name: '', taxCode: '', address: '', phone: '', email: '',
    website: '', ownerName: '', businessType: 'Bán lẻ', openingHours: '',
  });

  // Tự động điền dữ liệu khi load xong API
  useEffect(() => {
    if (storeInfo) {
      setFormData({
        name: storeInfo.name || (storeInfo as any).Name || '',
        taxCode: storeInfo.taxCode || storeInfo.tax_code || (storeInfo as any).TaxCode || '',
        address: storeInfo.address || (storeInfo as any).Address || '',
        phone: storeInfo.phone || (storeInfo as any).Phone || '',
        email: storeInfo.email || (storeInfo as any).Email || '',
        website: storeInfo.website || (storeInfo as any).Website || '',
        ownerName: storeInfo.ownerName || storeInfo.owner_name || (storeInfo as any).OwnerName || '',
        businessType: storeInfo.businessType || storeInfo.business_type || (storeInfo as any).BusinessType || 'Bán lẻ',
        openingHours: storeInfo.openingHours || storeInfo.opening_hours || (storeInfo as any).OpeningHours || '',
      });
    }
  }, [storeInfo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Chuẩn hóa key theo struct Go (snake_case)
      const payload = {
        name: formData.name,
        tax_code: formData.taxCode,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        website: formData.website,
        owner_name: formData.ownerName,
        business_type: formData.businessType,
        opening_hours: formData.openingHours,
      };
      
      await updateStore(payload as any);
      alert('Đã cập nhật thông tin cửa hàng thành công!');
      refresh();
    } catch (err) {
      alert('Có lỗi xảy ra khi lưu thông tin cửa hàng!');
    }
  };

  if (loading) return <div className="p-6 text-gray-500 text-center">Đang tải thông tin...</div>;

  return (
    <div className="p-6">
      <h2 className="font-semibold text-2xl text-gray-800 mb-6">Thông tin cửa hàng</h2>
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium text-gray-700 mb-2">Tên cửa hàng</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-2">Mã số thuế</label>
              <input type="text" value={formData.taxCode} onChange={(e) => setFormData({ ...formData, taxCode: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-2">Địa chỉ</label>
            <textarea value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" rows={3} required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium text-gray-700 mb-2">Số điện thoại</label>
              <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-2">Email</label>
              <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium text-gray-700 mb-2">Website</label>
              <input type="text" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-2">Chủ cửa hàng</label>
              <input type="text" value={formData.ownerName} onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium text-gray-700 mb-2">Loại hình kinh doanh</label>
              <select value={formData.businessType} onChange={(e) => setFormData({ ...formData, businessType: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white outline-none" required>
                <option value="Bán lẻ">Bán lẻ</option>
                <option value="Bán sỉ">Bán sỉ</option>
                <option value="Cả hai">Cả hai</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-2">Giờ mở cửa</label>
              <input type="text" value={formData.openingHours} onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="VD: 8:00 - 22:00" />
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <button type="submit" className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 shadow-sm transition">
              <Save className="w-5 h-5" /> Lưu thông tin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}