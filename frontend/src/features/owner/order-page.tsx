"use client";

import { useState } from 'react';
import { Eye, Trash2, User, Phone, MapPin, DollarSign, Package, ClipboardCheck } from 'lucide-react';
import { Modal } from '../../components/layout/Modal';
import { useOrders, Order } from '@/hooks/useOwner';

export function OrdersPage() {
  const { orders, loading, remove, refresh } = useOrders();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleDeleteOrder = async (id: number, code: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa đơn hàng ${code}?`)) {
      try {
        await remove(id);
        alert("Đã xóa đơn hàng thành công!");
        refresh();
      } catch (error) {
        alert("Có lỗi xảy ra khi xóa đơn hàng!");
      }
    }
  };

  // Lọc theo trạng thái (Backend Golang thường lưu "Đã_bán" hoặc "Đã_trả")
  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(o => {
        const rawStatus = o.status || (o as any).Status || '';
        if (filterStatus === 'purchased') return rawStatus === 'Đã_bán' || rawStatus === 'purchased';
        if (filterStatus === 'returned') return rawStatus === 'Đã_trả' || rawStatus === 'returned';
        return true;
      });

  const statusConfig: any = {
    all: { text: 'Tất cả' },
    purchased: { text: 'Đã mua', badgeClasses: 'bg-green-50 text-green-700 border-green-200' },
    returned: { text: 'Đã trả', badgeClasses: 'bg-red-50 text-red-700 border-red-200' }
  };

  const getStatusKey = (rawStatus: string) => {
    if (rawStatus === 'Đã_bán' || rawStatus === 'purchased') return 'purchased';
    if (rawStatus === 'Đã_trả' || rawStatus === 'returned') return 'returned';
    return 'purchased'; // default
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý đơn đặt hàng</h1>
          <p className="text-gray-500 text-sm">Theo dõi chi tiết lịch sử mua và trả hàng trên hệ thống</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200/60 shadow-inner">
          {(['all', 'purchased', 'returned'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-5 py-1.5 text-xs font-semibold rounded-lg transition min-w-[80px] ${
                filterStatus === status ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {statusConfig[status].text}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Mã đơn hàng</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Khách hàng</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Người tạo</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Ngày đặt</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Tổng tiền</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-400">Đang tải dữ liệu đơn hàng...</td></tr>
              ) : filteredOrders.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-400">Không tìm thấy dữ liệu đơn hàng nào.</td></tr>
              ) : (
                filteredOrders.map((order: any, index: number) => {
                  const id = order.id || order.ID;
                  const orderCode = order.order_code || order.OrderCode || `DH-${id}`;
                  const rawStatus = order.status || order.Status || '';
                  const statusKey = getStatusKey(rawStatus);
                  const total = order.total_amount || order.TotalAmount || 0;
                  const date = order.created_at || order.CreatedAt;
                  
                  // Trích xuất GORM Preload
                  const customer = order.Customer || {};
                  const user = order.User || {};

                  return (
                    <tr key={id || index} className="hover:bg-gray-50/70 transition">
                      <td className="px-6 py-4 text-sm font-bold text-blue-600 tracking-wide">
                        <div className="flex flex-col gap-1 items-start">
                          {orderCode}
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusConfig[statusKey].badgeClasses}`}>
                            {statusConfig[statusKey].text}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="font-medium text-gray-800">{customer.name || customer.Name || 'Khách lẻ'}</div>
                        <div className="text-gray-400 text-xs">{customer.phone || customer.Phone || '---'}</div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-700">
                        {user.fullname || user.FullName || user.username || user.Username || 'Hệ thống'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                        {date ? new Date(date).toLocaleString('vi-VN') : '---'}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">
                        {total.toLocaleString('vi-VN')} đ
                      </td>
                      <td className="px-6 py-4 text-sm text-right">
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => handleViewDetails(order)} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition"><Eye size={17} /></button>
                          <button onClick={() => handleDeleteOrder(id, orderCode)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition"><Trash2 size={17} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Thông tin chi tiết vận đơn`}>
        {selectedOrder && (() => {
          const customer = selectedOrder.Customer || {};
          const user = selectedOrder.User || {};
          const items = selectedOrder.OrderItems || selectedOrder.items || [];
          const total = selectedOrder.total_amount || selectedOrder.TotalAmount || 0;

          return (
            <div className="p-2 space-y-5 max-w-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
                  <span className="text-xs font-bold text-gray-400 tracking-wider uppercase block">Thông tin giao nhận</span>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-700"><User size={15} className="text-gray-400 shrink-0" /><span className="font-medium">{customer.name || customer.Name || 'Khách lẻ'}</span></div>
                    <div className="flex items-center gap-2 text-gray-700"><Phone size={15} className="text-gray-400 shrink-0" /><span className="font-mono">{customer.phone || customer.Phone || '---'}</span></div>
                    <div className="flex items-start gap-2 text-gray-700"><MapPin size={15} className="text-gray-400 shrink-0 mt-0.5" /><span className="text-xs line-clamp-2">{customer.address || customer.Address || 'Nhận tại cửa hàng'}</span></div>
                  </div>
                </div>

                <div className="bg-blue-50/40 p-4 rounded-xl border border-blue-100/60 space-y-3">
                  <span className="text-xs font-bold text-blue-500/80 tracking-wider uppercase block">Thông tin người tạo</span>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-700"><ClipboardCheck size={15} className="text-blue-400 shrink-0" /><span className="font-semibold text-gray-800">{user.fullname || user.FullName || user.username || user.Username || 'Hệ thống'}</span></div>
                    <div className="flex items-center gap-2 text-gray-700"><Phone size={15} className="text-gray-400 shrink-0" /><span className="font-mono text-xs text-gray-500">SĐT: {user.phone || user.Phone || '---'}</span></div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-gray-400 tracking-wider uppercase block px-1">Chi tiết kiện hàng</span>
                <div className="border border-gray-100 rounded-xl overflow-hidden bg-white max-h-[250px] overflow-y-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50/80 border-b border-gray-100 sticky top-0">
                      <tr>
                        <th className="px-4 py-2.5 font-medium text-gray-500">Sản phẩm</th>
                        <th className="px-4 py-2.5 font-medium text-gray-500 text-center">SL</th>
                        <th className="px-4 py-2.5 font-medium text-gray-500 text-right">Đơn giá</th>
                        <th className="px-4 py-2.5 font-medium text-gray-500 text-right">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {items.map((item: any, i: number) => {
                        const prod = item.Product || {};
                        const pName = prod.name || prod.Name || item.product_name || 'Sản phẩm';
                        const qty = item.quantity || item.Quantity || 0;
                        const price = item.price || item.Price || 0;
                        return (
                          <tr key={i} className="text-gray-700">
                            <td className="px-4 py-3 font-medium text-gray-800 flex items-center gap-2"><Package size={14} className="text-gray-400" /> {pName}</td>
                            <td className="px-4 py-3 text-center font-mono">{qty}</td>
                            <td className="px-4 py-3 text-right text-gray-500">{price.toLocaleString('vi-VN')} đ</td>
                            <td className="px-4 py-3 text-right font-bold text-gray-900">{(qty * price).toLocaleString('vi-VN')} đ</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <div className="w-full sm:w-80 bg-gray-900 text-white rounded-xl p-4 shadow-md">
                  <div className="flex justify-between items-center gap-4">
                    <div className="flex items-center gap-1.5 text-sm font-medium text-gray-400"><DollarSign size={16} className="text-emerald-400" /> Tổng thanh toán:</div>
                    <span className="text-xl font-bold text-emerald-400 font-mono">{total.toLocaleString('vi-VN')} đ</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}