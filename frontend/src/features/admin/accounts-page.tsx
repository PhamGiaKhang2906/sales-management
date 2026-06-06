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

  const safeAccounts = Array.isArray(accounts) ? accounts : [];

  const columns = [
    { 
      key: 'fullname', 
      label: 'Họ và tên',
      render: (value: any, item: any) => <span className="font-medium">{item.fullname || item.FullName || item.full_name || 'Trống'}</span>
    },
    { 
      key: 'phone', 
      label: 'Số điện thoại',
      render: (value: any, item: any) => <span>{item.phone || item.Phone || 'Trống'}</span>
    },
    { 
      key: 'store_name', 
      label: 'Tên cửa hàng',
      render: (value: any, item: any) => <span>{item.store_name || item.StoreName || 'Trống'}</span>
    },
    {
      key: 'category',
      label: 'Danh mục',
      render: (value: any, item: any) => {
        const cat = item.category || item.Category;
        return (
          <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-medium">
            {cat || 'Khác'}
          </span>
        );
      }
    },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (value: any, item: any) => {
        const rawStat = item.status || item.Status;
        const stat = (rawStat === undefined || rawStat === null || rawStat === '') ? 'Chờ duyệt' : rawStat;
        
        let config = { bg: 'bg-gray-100', text: 'text-gray-700', label: stat };
        
        if (stat === 'Chờ duyệt' || stat === 'pending') config = { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Chờ duyệt' };
        if (stat === 'Đã duyệt' || stat === 'Đã_duyệt' || stat === 'approved') config = { bg: 'bg-green-100', text: 'text-green-700', label: 'Đã duyệt' };
        if (stat === 'Từ chối' || stat === 'Từ_chối' || stat === 'rejected') config = { bg: 'bg-red-100', text: 'text-red-700', label: 'Từ chối' };

        return (
          <span className={`px-2 py-1 rounded text-sm ${config.bg} ${config.text} font-medium`}>
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
    const userId = account.user_id || (account as any).UserID;
    const success = await changeStatus(userId, "Đã_duyệt");
    if (success) {
      alert("Đã duyệt tài khoản thành công! Người dùng có thể đăng nhập ngay bây giờ.");
    } else {
      alert("Lỗi: Không thể duyệt tài khoản.");
    }
  };

  const handleReject = async (account: AdminAccountInfo) => {
    const storeName = account.store_name || (account as any).StoreName || 'này';
    const userId = account.user_id || (account as any).UserID;

    if (confirm(`Bạn có chắc muốn từ chối tài khoản "${storeName}"?`)) {
      const success = await changeStatus(userId, "Từ_chối");
      if (success) {
        alert("Đã từ chối tài khoản thành công!");
      } else {
        alert("Lỗi: Không thể cập nhật trạng thái.");
      }
    }
  };

  const statsTotal = stats?.total_accounts || (stats as any)?.TotalAccounts || safeAccounts.length;
  const statsPending = stats?.pending_count || (stats as any)?.PendingCount || safeAccounts.filter((a: any) => !a.status || a.status === 'Chờ duyệt' || a.Status === 'Chờ duyệt').length;
  const statsApproved = stats?.approved_count || (stats as any)?.ApprovedCount || safeAccounts.filter((a: any) => a.status === 'Đã_duyệt' || a.Status === 'Đã_duyệt').length;
  const statsRejected = stats?.rejected_count || (stats as any)?.RejectedCount || safeAccounts.filter((a: any) => a.status === 'Từ_chối' || a.Status === 'Từ_chối').length;

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
              <p className="font-bold text-3xl text-gray-800">{statsTotal}</p>
            </div>
            <Users className="w-12 h-12 text-blue-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mb-1">Chờ duyệt</p>
              <p className="font-bold text-3xl text-gray-800">{statsPending}</p>
            </div>
            <ShoppingBag className="w-12 h-12 text-yellow-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mb-1">Đã duyệt</p>
              <p className="font-bold text-3xl text-gray-800">{statsApproved}</p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mb-1">Từ chối</p>
              <p className="font-bold text-3xl text-gray-800">{statsRejected}</p>
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
            data={safeAccounts}
            onView={handleView}
            actions={true}
          />
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Chi tiết tài khoản" size="lg">
        {viewingAccount && (() => {
          const vName = viewingAccount.fullname || (viewingAccount as any).FullName || (viewingAccount as any).full_name;
          const vPhone = viewingAccount.phone || (viewingAccount as any).Phone;
          const vStore = viewingAccount.store_name || (viewingAccount as any).StoreName;
          const vCat = viewingAccount.category || (viewingAccount as any).Category || 'Chưa cập nhật';
          
          // Lấy ĐỊA CHỈ TỪ BACKEND TRẢ VỀ
          const vAddress = viewingAccount.address || (viewingAccount as any).Address || 'Chưa cập nhật';
          
          const rawStat = viewingAccount.status || (viewingAccount as any).Status;
          const vStat = (rawStat === undefined || rawStat === null || rawStat === '') ? 'Chờ duyệt' : rawStat;
          const isPending = !['Đã_duyệt', 'Đã duyệt', 'Từ_chối', 'Từ chối', 'approved', 'rejected'].includes(vStat);

          return (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-500 mb-1">Họ và tên</p>
                  <p className="font-medium text-lg">{vName}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Số điện thoại</p>
                  <p className="font-medium text-lg">{vPhone}</p>
                </div>
              </div>

              <div>
                <p className="text-gray-500 mb-1">Tên cửa hàng</p>
                <p className="font-medium text-lg">{vStore}</p>
              </div>

              {/* BỔ SUNG GIAO DIỆN HIỂN THỊ ĐỊA CHỈ Ở ĐÂY */}
              <div>
                <p className="text-gray-500 mb-1">Địa chỉ</p>
                <p className="font-medium text-lg">{vAddress}</p>
              </div>

              <div>
                <p className="text-gray-500 mb-2">Danh mục kinh doanh</p>
                <span className="px-3 py-2 bg-emerald-100 text-emerald-700 rounded-lg font-medium">
                  {vCat}
                </span>
              </div>

              <div>
                <p className="text-gray-500 mb-2">Trạng thái hiện tại</p>
                <span className="font-medium text-gray-800 border px-3 py-1 rounded">
                  {vStat === 'Đã_duyệt' ? 'Đã duyệt' : vStat === 'Từ_chối' ? 'Từ chối' : vStat}
                </span>
              </div>

              {isPending && (
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => { handleApprove(viewingAccount); setIsModalOpen(false); }}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium shadow-md transition"
                  >
                    <CheckCircle className="w-5 h-5" /> Duyệt tài khoản
                  </button>
                  <button
                    onClick={() => { handleReject(viewingAccount); setIsModalOpen(false); }}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium shadow-md transition"
                  >
                    <XCircle className="w-5 h-5" /> Từ chối
                  </button>
                </div>
              )}
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}