"use client";

import { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Modal } from '../../components/layout/Modal';
import { useEmployees, Employee } from '@/hooks/useOwner';

export function EmployeesPage() {
  const { employees, loading, create, update, remove, refresh } = useEmployees();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  
  // State form lưu role theo CHỮ (sales hoặc warehouse)
  const [formData, setFormData] = useState({
    fullname: '', username: '', password: '', phone: '', cccd: '', address: '',
    birthday: '', salary_factor: 1.0, work_shift: 'Ca sáng', role_name: 'sales', 
  });

  const handleAddClick = () => {
    setEditingEmployee(null);
    setFormData({ fullname: '', username: '', password: '', phone: '', cccd: '', address: '', birthday: '', salary_factor: 1.0, work_shift: 'Ca sáng', role_name: 'sales' });
    setIsModalOpen(true);
  };

  const handleEditClick = (employee: Employee) => {
    setEditingEmployee(employee);
    // Trích xuất thông tin Role ID an toàn từ Backend
    const userObj = employee.User || (employee as any).user || {};
    const username = employee.username || (employee as any).Username || userObj.username || userObj.Username || '';
    const roleId = employee.role_id || (employee as any).RoleID || userObj.role_id || userObj.RoleID || 2;
    
    // Ánh xạ SỐ từ Backend thành CHỮ để đưa lên Form UI
    const roleNameStr = roleId === 3 ? 'warehouse' : 'sales';

    setFormData({
      fullname: employee.fullname || (employee as any).FullName || '',
      username: username,
      password: '',
      phone: employee.phone || (employee as any).Phone || '',
      cccd: employee.cccd || (employee as any).CCCD || '',
      address: employee.address || (employee as any).Address || '',
      birthday: employee.birthday || (employee as any).Birthday ? String(employee.birthday || (employee as any).Birthday).substring(0, 10) : '',
      salary_factor: employee.salary_factor || (employee as any).SalaryFactor || 1.0,
      work_shift: employee.work_shift || (employee as any).WorkShift || 'Ca sáng',
      role_name: roleNameStr,
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) {
      try {
        await remove(id);
        alert("Xóa thành công!");
        refresh();
      } catch (err) { alert("Có lỗi xảy ra khi xóa nhân viên!"); }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Tạo cục dữ liệu payload đúng chuẩn interface Backend cần
      // Backend expects `role_name` (sales | warehouse)
      const apiPayload = {
        fullname: formData.fullname,
        username: formData.username,
        password: formData.password,
        phone: formData.phone,
        cccd: formData.cccd,
        address: formData.address,
        birthday: formData.birthday || null,
        salary_factor: formData.salary_factor,
        work_shift: formData.work_shift,
        role_name: formData.role_name, // Gửi role bằng chuỗi như backend mong muốn
      };

      if (editingEmployee) {
        const id = editingEmployee.id || (editingEmployee as any).ID;
        await update(id, apiPayload as any);
      } else {
        await create(apiPayload as any);
      }
      setIsModalOpen(false);
      refresh();
    } catch (err) { alert("Có lỗi xảy ra khi lưu dữ liệu nhân viên!"); }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Danh sách nhân viên</h1>
          <p className="text-gray-500 text-sm">Quản lý tài khoản hệ thống và thông tin nhân sự</p>
        </div>
        <button onClick={handleAddClick} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition shadow-sm">
          <Plus size={20} /> Thêm nhân viên
        </button>
      </div>

      <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">ID</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Họ và tên</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Vai trò</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Số điện thoại</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Số CCCD</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Hệ số lương</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Ca làm việc</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={8} className="px-6 py-8 text-center text-gray-400">Đang tải dữ liệu nhân viên...</td></tr>
            ) : employees.length === 0 ? (
              <tr><td colSpan={8} className="px-6 py-8 text-center text-gray-400">Chưa có nhân viên nào trong hệ thống</td></tr>
            ) : (
              employees.map((employee: Employee, index: number) => {
                const id = employee.id || (employee as any).ID;
                const fullname = employee.fullname || (employee as any).FullName;
                const userObj = employee.User || (employee as any).user || {};
                
                // Lấy RoleID để phân loại Sales (2) hay Kho (3)
                const roleId = employee.role_id || (employee as any).RoleID || userObj.role_id || userObj.RoleID || 2;
                const isSales = roleId !== 3; // Role 3 là kho, các role khác mặc định là sales

                return (
                  <tr key={id || index} className="hover:bg-gray-50/70 transition">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">#{id}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">{fullname}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${isSales ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                        {isSales ? 'Sales (Bán hàng)' : 'Warehouse (Kho)'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{employee.phone || (employee as any).Phone}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 tracking-wider">{employee.cccd || (employee as any).CCCD || '---'}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 font-mono">{(employee.salary_factor || (employee as any).SalaryFactor || 0).toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm"><span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">{employee.work_shift || (employee as any).WorkShift}</span></td>
                    <td className="px-6 py-4 text-sm text-right">
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => handleEditClick(employee)} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition"><Edit2 size={16} /></button>
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingEmployee ? `Chi tiết & Chỉnh sửa: ${formData.username}` : 'Thêm nhân viên & Cấp tài khoản'}>
        <div className="p-2">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-4">
              <span className="text-xs font-bold text-gray-400 tracking-wider uppercase block">Tài khoản & Phân quyền</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Tên đăng nhập</label>
                  <input type="text" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} disabled={!!editingEmployee} placeholder="Ví dụ: khanhnv95" className={`w-full px-4 py-2 border rounded-lg outline-none text-sm transition ${editingEmployee ? 'bg-gray-200/60 text-gray-500 border-gray-300 cursor-not-allowed' : 'border-gray-300 focus:ring-2 focus:ring-blue-500/20'}`} required={!editingEmployee} />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Vai trò làm việc</label>
                  {/* SELECT THEO CHỮ BÌNH THƯỜNG */}
                  <select value={formData.role_name} onChange={(e) => setFormData({ ...formData, role_name: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm transition bg-white">
                    <option value="sales">Sales (Nhân viên bán hàng)</option>
                    <option value="warehouse">Warehouse (Nhân viên kho)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Mật khẩu khởi tạo</label>
                  <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} disabled={!!editingEmployee} placeholder={editingEmployee ? "********" : "Tối thiểu 6 ký tự"} className={`w-full px-4 py-2 border rounded-lg outline-none text-sm transition ${editingEmployee ? 'bg-gray-200/60 border-gray-300 cursor-not-allowed text-gray-400' : 'border-gray-300 focus:ring-2 focus:ring-blue-500/20'}`} required={!editingEmployee} />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <span className="text-xs font-bold text-gray-400 tracking-wider uppercase block px-1">Thông tin nhân sự</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Họ và tên</label><input type="text" value={formData.fullname} onChange={(e) => setFormData({ ...formData, fullname: e.target.value })} placeholder="Nhập họ tên đầy đủ" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" required /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Số điện thoại</label><input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="Nhập số điện thoại" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" required /></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Số định danh CCCD</label><input type="text" value={formData.cccd} onChange={(e) => setFormData({ ...formData, cccd: e.target.value })} placeholder="Mã định danh 12 số" maxLength={20} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Ngày sinh</label><input type="date" value={formData.birthday} onChange={(e) => setFormData({ ...formData, birthday: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" /></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Hệ số lương</label><input type="number" step="0.01" min="0" value={formData.salary_factor} onChange={(e) => setFormData({ ...formData, salary_factor: parseFloat(e.target.value) || 0 })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" required /></div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Ca làm việc</label>
                  <select value={formData.work_shift} onChange={(e) => setFormData({ ...formData, work_shift: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white">
                    <option value="Ca sáng">Ca sáng</option>
                    <option value="Ca chiều">Ca chiều</option>
                    <option value="Ca tối">Ca tối</option>
                    <option value="Ca hành chính">Ca hành chính</option>
                  </select>
                </div>
              </div>

              <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Địa chỉ thường trú</label><input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="Nhập địa chỉ chi tiết" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" /></div>
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-gray-100 mt-6">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50">Hủy bỏ</button>
              <button type="submit" className="px-5 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm">
                {editingEmployee ? 'Lưu thay đổi' : 'Xác nhận tạo'}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}