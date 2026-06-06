"use client";

import { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Modal } from '../../components/layout/Modal';

interface Employee {
  id: number;
  user_id: number;
  username: string;
  fullname: string;
  phone: string;
  cccd: string;
  address: string;
  birthday: string | null;
  salary_factor: number;
  work_shift: string;
  status: string;
  created_at: string;
  rolename: string; // Thể hiện vai trò sales / warehouse
}

export function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([
    { 
      id: 1, 
      user_id: 10, 
      username: 'khanhnv', 
      fullname: 'Nguyễn Văn Khang', 
      phone: '0905555555', 
      cccd: '048096001234', 
      address: '123 Nguyễn Huệ, Huế',
      birthday: '1995-05-20',
      salary_factor: 2.5, 
      work_shift: 'Ca hành chính',
      status: 'Đã_duyệt',
      created_at: '2026-01-01 08:00:00',
      rolename: 'sales'
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  
  const [formData, setFormData] = useState({
    fullname: '',
    username: '',     
    password: '',     
    phone: '',
    cccd: '',
    address: '',
    birthday: '',
    salary_factor: 1.0,
    work_shift: 'Ca sáng',
    role_name: 'sales', // Trường mới thêm để lưu vai trò được chọn
  });

  const handleAddClick = () => {
    setEditingEmployee(null);
    setFormData({
      fullname: '',
      username: '',
      password: '',
      phone: '',
      cccd: '',
      address: '',
      birthday: '',
      salary_factor: 1.0,
      work_shift: 'Ca sáng',
      role_name: 'sales',
    });
    setIsModalOpen(true);
  };

  const handleEditClick = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData({
      fullname: employee.fullname,
      username: employee.username, 
      password: '',                
      phone: employee.phone,
      cccd: employee.cccd,
      address: employee.address,
      birthday: employee.birthday || '',
      salary_factor: employee.salary_factor,
      work_shift: employee.work_shift,
      role_name: employee.rolename, // Gán vai trò hiện tại khi xem/sửa
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) {
      setEmployees(employees.filter(emp => emp.id !== id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingEmployee) {
      const updatePayload = {
        fullname: formData.fullname,
        phone: formData.phone,
        cccd: formData.cccd,
        address: formData.address,
        birthday: formData.birthday ? formData.birthday : null,
        salary_factor: formData.salary_factor,
        work_shift: formData.work_shift,
        role_name: formData.role_name, // Gửi kèm vai trò cập nhật lên API (nếu backend hỗ trợ sửa role)
      };
      
      setEmployees(employees.map(emp => 
        emp.id === editingEmployee.id ? { ...emp, ...updatePayload, rolename: formData.role_name } : emp
      ));

    } else {
      const createPayload = {
        fullname: formData.fullname,
        username: formData.username,
        password: formData.password,
        phone: formData.phone,
        cccd: formData.cccd,
        address: formData.address,
        birthday: formData.birthday ? formData.birthday : null,
        salary_factor: formData.salary_factor,
        work_shift: formData.work_shift,
        role_name: formData.role_name, // Gửi vai trò được admin chỉ định lên backend
      };

      console.log("Payload gửi lên POST /api/owner/employees:", createPayload);
      
      const mockNewId = employees.length > 0 ? Math.max(...employees.map(e => e.id)) + 1 : 1;
      setEmployees([...employees, {
        id: mockNewId,
        user_id: mockNewId + 100,
        username: formData.username,
        fullname: formData.fullname,
        phone: formData.phone,
        cccd: formData.cccd,
        address: formData.address,
        birthday: formData.birthday || null,
        salary_factor: formData.salary_factor,
        work_shift: formData.work_shift,
        status: 'Đã_duyệt',
        created_at: '2026-06-06 12:00:00',
        rolename: formData.role_name
      }]);
    }
    setIsModalOpen(false);
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
            {employees.map((employee) => (
              <tr key={employee.id} className="hover:bg-gray-50/70 transition">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">#{employee.id}</td>
                <td className="px-6 py-4 text-sm text-gray-700 font-medium">{employee.fullname}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    employee.rolename === 'sales' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {employee.rolename === 'sales' ? 'Sales (Bán hàng)' : 'Warehouse (Kho)'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{employee.phone}</td>
                <td className="px-6 py-4 text-sm text-gray-600 tracking-wider">{employee.cccd || '---'}</td>
                <td className="px-6 py-4 text-sm text-gray-700 font-mono">{employee.salary_factor.toFixed(2)}</td>
                <td className="px-6 py-4 text-sm"><span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">{employee.work_shift}</span></td>
                <td className="px-6 py-4 text-sm text-right">
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => handleEditClick(employee)} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition"><Edit2 size={16} /></button>
                    <button onClick={() => handleDeleteClick(employee.id)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingEmployee ? `Chi tiết & Chỉnh sửa: ${editingEmployee.username}` : 'Thêm nhân viên & Cấp tài khoản'}
      >
        <div className="p-2">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* PHẦN 1: TÀI KHOẢN HỆ THỐNG & VAI TRÒ (Có ô chọn role_name) */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-4">
              <span className="text-xs font-bold text-gray-400 tracking-wider uppercase block">Tài khoản & Phân quyền</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Tên đăng nhập</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    disabled={!!editingEmployee}
                    placeholder="Ví dụ: khanhnv95"
                    className={`w-full px-4 py-2 border rounded-lg outline-none text-sm transition ${
                      editingEmployee ? 'bg-gray-200/60 text-gray-500 border-gray-300 cursor-not-allowed' : 'border-gray-300 focus:ring-2 focus:ring-blue-500/20'
                    }`}
                    required={!editingEmployee}
                  />
                </div>
                
                {/* THÀNH PHẦN QUAN TRỌNG: LỰA CHỌN VAI TRÒ */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Vai trò làm việc</label>
                  <select
                    value={formData.role_name}
                    onChange={(e) => setFormData({ ...formData, role_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm transition bg-white"
                  >
                    <option value="sales">Sales (Nhân viên bán hàng)</option>
                    <option value="warehouse">Warehouse (Nhân viên kho)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Mật khẩu khởi tạo</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    disabled={!!editingEmployee}
                    placeholder={editingEmployee ? "********" : "Tối thiểu 6 ký tự"}
                    className={`w-full px-4 py-2 border rounded-lg outline-none text-sm transition ${
                      editingEmployee ? 'bg-gray-200/60 border-gray-300 cursor-not-allowed text-gray-400' : 'border-gray-300 focus:ring-2 focus:ring-blue-500/20'
                    }`}
                    required={!editingEmployee}
                  />
                </div>
              </div>
            </div>

            {/* PHẦN 2: THÔNG TIN NHÂN SỰ */}
            <div className="space-y-4 pt-2">
              <span className="text-xs font-bold text-gray-400 tracking-wider uppercase block px-1">Thông tin nhân sự</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Họ và tên</label>
                  <input type="text" value={formData.fullname} onChange={(e) => setFormData({ ...formData, fullname: e.target.value })} placeholder="Nhập họ tên đầy đủ" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Số điện thoại</label>
                  <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="Nhập số điện thoại" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Số định danh CCCD</label>
                  <input type="text" value={formData.cccd} onChange={(e) => setFormData({ ...formData, cccd: e.target.value })} placeholder="Mã định danh 12 số" maxLength={20} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Ngày sinh</label>
                  <input type="date" value={formData.birthday} onChange={(e) => setFormData({ ...formData, birthday: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Hệ số lương</label>
                  <input type="number" step="0.01" min="0" value={formData.salary_factor} onChange={(e) => setFormData({ ...formData, salary_factor: parseFloat(e.target.value) || 0 })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" required />
                </div>
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Địa chỉ thường trú</label>
                <input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="Nhập địa chỉ chi tiết" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
              </div>
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