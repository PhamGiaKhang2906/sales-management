"use client";
import { useState } from 'react';
import { Users, ShoppingBag, CheckCircle, XCircle } from 'lucide-react';
import { DataTable } from '../../components/layout/DataTable';
import { Modal } from '../../components/layout/Modal';
import { useAccounts } from '@/hooks/useAdmin';
import { AdminAccountInfo } from '@/services/adminService';

export function AccountsPage() {
  const { accounts, stats, isLoading, changeStatus } = useAccounts();
  const [viewingAccount, setViewingAccount] = useState<AdminAccountInfo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = [
    { key: 'fullname', label: 'Họ và tên' },
    { key: 'phone', label: 'Số điện thoại' },
    { key: 'store_name', label: 'Tên cửa hàng' },
    {
      key: 'category',
      label: 'Danh mục',
      render: (value: string) => (
        <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs">
          {value || 'Khác'}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (value: string) => {
        let config = { bg: 'bg-gray-100', text: 'text-gray-700', label: value };
        if (value === 'Chờ duyệt') config = { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Chờ duyệt' };
        if (value === 'Đã duyệt' || value === 'Đã_duyệt') config = { bg: 'bg-green-100', text: 'text-green-700', label: 'Đã duyệt' };
        if (value === 'Từ chối' || value === 'Từ_chối') config = { bg: 'bg-red-100', text: 'text-red-700', label: 'Từ chối' };

        return (
          <span className={`px-2 py-1 rounded text-sm ${config.bg} ${config.text}`}>
            {config.label}
          </span>
        );
      },
    },
  ];

  const handleView = (account: AdminAccountInfo) => {
    setViewingAccount(account);
    setIsModalOpen(true);
  };

  const handleApprove = async (account: AdminAccountInfo) => {
    await changeStatus(account.user_id, "Đã_duyệt");
  };

  const handleReject = async (account: AdminAccountInfo) => {
    if (confirm(`Bạn có chắc muốn từ chối tài khoản "${account.store_name}"?`)) {
      await changeStatus(account.user_id, "Từ_chối");
    }
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
              <p className="font-bold text-3xl text-gray-800">{stats?.total_accounts || 0}</p>
            </div>
            <Users className="w-12 h-12 text-blue-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mb-1">Chờ duyệt</p>
              <p className="font-bold text-3xl text-gray-800">{stats?.pending_count || 0}</p>
            </div>
            <ShoppingBag className="w-12 h-12 text-yellow-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mb-1">Đã duyệt</p>
              <p className="font-bold text-3xl text-gray-800">{stats?.approved_count || 0}</p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mb-1">Từ chối</p>
              <p className="font-bold text-3xl text-gray-800">{stats?.rejected_count || 0}</p>
            </div>
            <XCircle className="w-12 h-12 text-red-500 opacity-20" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500 font-medium">Đang tải dữ liệu...</div>
        ) : (
          <DataTable
            columns={columns}
            data={accounts}
            onView={handleView}
            actions={true}
          />
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Chi tiết tài khoản" size="lg">
        {viewingAccount && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-gray-500 mb-1">Họ và tên</p>
                <p className="font-medium text-lg">{viewingAccount.fullname}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Số điện thoại</p>
                <p className="font-medium text-lg">{viewingAccount.phone}</p>
              </div>
            </div>

            <div>
              <p className="text-gray-500 mb-1">Tên cửa hàng</p>
              <p className="font-medium text-lg">{viewingAccount.store_name}</p>
            </div>

            <div>
              <p className="text-gray-500 mb-2">Danh mục kinh doanh</p>
              <span className="px-3 py-2 bg-emerald-100 text-emerald-700 rounded-lg font-medium">
                {viewingAccount.category || 'Chưa cập nhật'}
              </span>
            </div>

            <div>
              <p className="text-gray-500 mb-2">Trạng thái hiện tại</p>
              <span className="font-medium text-gray-800 border px-3 py-1 rounded">
                {viewingAccount.status}
              </span>
            </div>

            {(viewingAccount.status === 'Chờ duyệt' || viewingAccount.status === 'pending') && (
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => { handleApprove(viewingAccount); setIsModalOpen(false); }}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium"
                >
                  <CheckCircle className="w-5 h-5" /> Duyệt tài khoản
                </button>
                <button
                  onClick={() => { handleReject(viewingAccount); setIsModalOpen(false); }}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
                >
                  <XCircle className="w-5 h-5" /> Từ chối
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}