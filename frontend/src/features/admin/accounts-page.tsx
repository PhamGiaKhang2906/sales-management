"use client";
import { useState } from 'react';
import { Users, ShoppingBag, CheckCircle, XCircle, Eye } from 'lucide-react';
import { DataTable } from '../../components/layout/DataTable';
import { Modal } from '../../components/layout/Modal';

interface UserAccount {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  storeName: string;
  address: string;
  categories: string[];
  status: 'pending' | 'approved' | 'rejected';
  registeredDate: string;
}

export function AccountsPage() {
  const [accounts, setAccounts] = useState<UserAccount[]>([
    {
      id: 1,
      fullName: 'Nguyễn Văn A',
      phone: '0901234567',
      email: 'a@example.com',
      storeName: 'Cửa hàng Thời trang ABC',
      address: 'Hà Nội',
      categories: ['Thời trang', 'Mỹ phẩm'],
      status: 'pending',
      registeredDate: '2026-05-28',
    },
    {
      id: 2,
      fullName: 'Trần Thị B',
      phone: '0902345678',
      email: 'b@example.com',
      storeName: 'Siêu thị Mini B',
      address: 'TP HCM',
      categories: ['Tạp hóa & Siêu thị', 'Nông sản & Thực phẩm'],
      status: 'approved',
      registeredDate: '2026-05-27',
    },
    {
      id: 3,
      fullName: 'Lê Văn C',
      phone: '0903456789',
      email: 'c@example.com',
      storeName: 'Cửa hàng Điện máy C',
      address: 'Đà Nẵng',
      categories: ['Điện thoại & Điện máy'],
      status: 'approved',
      registeredDate: '2026-05-26',
    },
  ]);

  const [viewingAccount, setViewingAccount] = useState<UserAccount | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = [
    { key: 'fullName', label: 'Họ và tên' },
    { key: 'phone', label: 'Số điện thoại' },
    { key: 'storeName', label: 'Tên cửa hàng' },
    {
      key: 'categories',
      label: 'Danh mục',
      render: (value: string[]) => (
        <div className="flex flex-wrap gap-1">
          {value.slice(0, 2).map((cat, idx) => (
            <span key={idx} className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs">
              {cat}
            </span>
          ))}
          {value.length > 2 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
              +{value.length - 2}
            </span>
          )}
        </div>
      ),
    },
    { key: 'registeredDate', label: 'Ngày đăng ký' },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (value: string) => {
        const statusConfig = {
          pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Chờ duyệt' },
          approved: { bg: 'bg-green-100', text: 'text-green-700', label: 'Đã duyệt' },
          rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'Từ chối' },
        };
        const config = statusConfig[value as keyof typeof statusConfig];
        return (
          <span className={`px-2 py-1 rounded text-sm ${config.bg} ${config.text}`}>
            {config.label}
          </span>
        );
      },
    },
  ];

  const handleView = (account: UserAccount) => {
    setViewingAccount(account);
    setIsModalOpen(true);
  };

  const handleApprove = (account: UserAccount) => {
    setAccounts(accounts.map(a => a.id === account.id ? { ...a, status: 'approved' } : a));
  };

  const handleReject = (account: UserAccount) => {
    if (confirm(`Bạn có chắc muốn từ chối tài khoản "${account.storeName}"?`)) {
      setAccounts(accounts.map(a => a.id === account.id ? { ...a, status: 'rejected' } : a));
    }
  };

  const stats = {
    total: accounts.length,
    pending: accounts.filter(a => a.status === 'pending').length,
    approved: accounts.filter(a => a.status === 'approved').length,
    rejected: accounts.filter(a => a.status === 'rejected').length,
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="font-semibold text-2xl text-gray-800">Quản lý tài khoản đăng ký</h2>
        <p className="text-gray-600">Duyệt và quản lý các tài khoản người dùng</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mb-1">Tổng số tài khoản</p>
              <p className="font-bold text-3xl text-gray-800">{stats.total}</p>
            </div>
            <Users className="w-12 h-12 text-blue-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mb-1">Chờ duyệt</p>
              <p className="font-bold text-3xl text-gray-800">{stats.pending}</p>
            </div>
            <ShoppingBag className="w-12 h-12 text-yellow-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mb-1">Đã duyệt</p>
              <p className="font-bold text-3xl text-gray-800">{stats.approved}</p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mb-1">Từ chối</p>
              <p className="font-bold text-3xl text-gray-800">{stats.rejected}</p>
            </div>
            <XCircle className="w-12 h-12 text-red-500 opacity-20" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md">
        <DataTable
          columns={columns}
          data={accounts}
          onView={handleView}
          actions={true}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Chi tiết tài khoản"
        size="lg"
      >
        {viewingAccount && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-gray-500 mb-1">Họ và tên</p>
                <p className="font-medium text-lg">{viewingAccount.fullName}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Số điện thoại</p>
                <p className="font-medium text-lg">{viewingAccount.phone}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Email</p>
                <p className="font-medium text-lg">{viewingAccount.email || 'Chưa cập nhật'}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Ngày đăng ký</p>
                <p className="font-medium text-lg">{viewingAccount.registeredDate}</p>
              </div>
            </div>

            <div>
              <p className="text-gray-500 mb-1">Tên cửa hàng</p>
              <p className="font-medium text-lg">{viewingAccount.storeName}</p>
            </div>

            <div>
              <p className="text-gray-500 mb-1">Địa chỉ</p>
              <p className="font-medium text-lg">{viewingAccount.address}</p>
            </div>

            <div>
              <p className="text-gray-500 mb-2">Danh mục kinh doanh</p>
              <div className="flex flex-wrap gap-2">
                {viewingAccount.categories.map((cat, idx) => (
                  <span key={idx} className="px-3 py-2 bg-emerald-100 text-emerald-700 rounded-lg font-medium">
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-gray-500 mb-2">Trạng thái</p>
              <div className="inline-block">
                {viewingAccount.status === 'pending' && (
                  <span className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg font-medium">
                    Chờ duyệt
                  </span>
                )}
                {viewingAccount.status === 'approved' && (
                  <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium">
                    Đã duyệt
                  </span>
                )}
                {viewingAccount.status === 'rejected' && (
                  <span className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium">
                    Từ chối
                  </span>
                )}
              </div>
            </div>

            {viewingAccount.status === 'pending' && (
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    handleApprove(viewingAccount);
                    setIsModalOpen(false);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium"
                >
                  <CheckCircle className="w-5 h-5" />
                  Duyệt tài khoản
                </button>
                <button
                  onClick={() => {
                    handleReject(viewingAccount);
                    setIsModalOpen(false);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
                >
                  <XCircle className="w-5 h-5" />
                  Từ chối
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}