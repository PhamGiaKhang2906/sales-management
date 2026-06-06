"use client";

import { useState } from 'react';
import { Eye, Trash2, User, Phone, MapPin, DollarSign, Package, ClipboardCheck } from 'lucide-react';
import { Modal } from '../../components/layout/Modal';

interface OrderItem {
  id: number;
  product_name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  order_code: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  total_amount: number;
  status: 'purchased' | 'returned'; // Trạng thái: đã mua hoặc đã trả
  created_at: string;
  creator_name: string;  // Tên người tạo đơn
  creator_phone: string; // Số điện thoại người tạo đơn
  creator_role: string;  // Vai trò người tạo đơn
  items: OrderItem[];
}

export function OrdersPage() {
  // Dữ liệu mẫu khởi tạo cho danh sách đơn hàng
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 1,
      order_code: 'DH-10023',
      customer_name: 'Nguyễn Đình Hoàng',
      customer_phone: '0935123456',
      customer_address: '45 Lê Lợi, Phú Hội, Thành phố Huế',
      total_amount: 350000,
      status: 'purchased',
      created_at: '2026-06-06 14:25:00',
      creator_name: 'Nguyễn Văn Khang',
      creator_phone: '0905555555',
      creator_role: 'Nhân viên Sales',
      items: [
        { id: 101, product_name: 'Cà phê muối hảo hạng', quantity: 2, price: 35000 },
        { id: 102, product_name: 'Trà thạch đào size L', quantity: 3, price: 45000 },
        { id: 103, product_name: 'Bánh sừng bò trứng muối', quantity: 3, price: 48000 }
      ]
    },
    {
      id: 2,
      order_code: 'DH-10024',
      customer_name: 'Trần Thị Thu Thảo',
      customer_phone: '0905777888',
      customer_address: 'Kiệt 112 Hùng Vương, Thành phố Huế',
      total_amount: 120000,
      status: 'purchased',
      created_at: '2026-06-06 10:12:00',
      creator_name: 'Lê Thị An',
      creator_phone: '0905111222',
      creator_role: 'Nhân viên Sales',
      items: [
        { id: 104, product_name: 'Bạc xỉu cốt dừa', quantity: 2, price: 40000 },
        { id: 105, product_name: 'Trà xanh Nhật Bản', quantity: 1, price: 40000 }
      ]
    },
    {
      id: 3,
      order_code: 'DH-10025',
      customer_name: 'Lê Trung Kiên',
      customer_phone: '0888999111',
      customer_address: 'Nhận tại cửa hàng',
      total_amount: 55000,
      status: 'returned',
      created_at: '2026-06-05 19:30:00',
      creator_name: 'Hoàng Ngọc Hải',
      creator_phone: '0905333444',
      creator_role: 'Nhân viên Kho',
      items: [
        { id: 106, product_name: 'Sinh tố bơ sầu riêng', quantity: 1, price: 55000 }
      ]
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleDeleteOrder = (id: number, code: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa đơn hàng ${code}? Hành động này không thể hoàn tác.`)) {
      setOrders(orders.filter(order => order.id !== id));
    }
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  // Cấu hình nhãn và CSS cho các danh mục bộ lọc
  const statusConfig = {
    all: { text: 'Tất cả' },
    purchased: { text: 'Đã mua', badgeClasses: 'bg-green-50 text-green-700 border-green-200' },
    returned: { text: 'Đã trả', badgeClasses: 'bg-red-50 text-red-700 border-red-200' }
  };

  return (
    <div className="p-6">
      {/* TIÊU ĐỀ TRANG VÀ BỘ LỌC BA MỤC */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý đơn đặt hàng</h1>
          <p className="text-gray-500 text-sm">Theo dõi chi tiết lịch sử mua và trả hàng trên hệ thống</p>
        </div>
        
        {/* Bộ lọc rút gọn thành 3 mục: Tất cả, Đã mua, Đã trả */}
        <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200/60 shadow-inner">
          {(['all', 'purchased', 'returned'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-5 py-1.5 text-xs font-semibold rounded-lg transition min-w-[80px] ${
                filterStatus === status
                  ? 'bg-white text-gray-800 shadow-sm'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {statusConfig[status].text}
            </button>
          ))}
        </div>
      </div>

      {/* BẢNG DANH SÁCH ĐƠN HÀNG */}
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
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-400">
                    Không tìm thấy dữ liệu đơn hàng nào.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/70 transition">
                    <td className="px-6 py-4 text-sm font-bold text-blue-600 tracking-wide">
                      <div className="flex flex-col gap-1 items-start">
                        {order.order_code}
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusConfig[order.status].badgeClasses}`}>
                          {statusConfig[order.status].text}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="font-medium text-gray-800">{order.customer_name}</div>
                      <div className="text-gray-400 text-xs">{order.customer_phone}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-700">
                      {order.creator_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 font-mono">{order.created_at}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">
                      {order.total_amount.toLocaleString('vi-VN')} đ
                    </td>
                    <td className="px-6 py-4 text-sm text-right">
                      <div className="flex gap-2 justify-end">
                        <button 
                          onClick={() => handleViewDetails(order)} 
                          title="Xem chi tiết đơn" 
                          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                        >
                          <Eye size={17} />
                        </button>
                        <button 
                          onClick={() => handleDeleteOrder(order.id, order.order_code)} 
                          title="Xóa đơn hàng" 
                          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL CHI TIẾT ĐƠN HÀNG */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={`Thông tin chi tiết vận đơn: ${selectedOrder?.order_code}`}
      >
        {selectedOrder && (
          <div className="p-2 space-y-5 max-w-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* PHẦN 1: THÔNG TIN GIAO NHẬN */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
                <span className="text-xs font-bold text-gray-400 tracking-wider uppercase block">Thông tin giao nhận</span>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-700">
                    <User size={15} className="text-gray-400 shrink-0" />
                    <span className="font-medium">{selectedOrder.customer_name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Phone size={15} className="text-gray-400 shrink-0" />
                    <span className="font-mono">{selectedOrder.customer_phone}</span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-700">
                    <MapPin size={15} className="text-gray-400 shrink-0 mt-0.5" />
                    <span className="text-xs line-clamp-2">{selectedOrder.customer_address}</span>
                  </div>
                </div>
              </div>

              {/* PHẦN 2: THÔNG TIN CHI TIẾT NGƯỜI TẠO */}
              <div className="bg-blue-50/40 p-4 rounded-xl border border-blue-100/60 space-y-3">
                <span className="text-xs font-bold text-blue-500/80 tracking-wider uppercase block">Thông tin người tạo</span>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-700">
                    <ClipboardCheck size={15} className="text-blue-400 shrink-0" />
                    <span className="font-semibold text-gray-800">{selectedOrder.creator_name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-xs">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-medium">
                      {selectedOrder.creator_role}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Phone size={15} className="text-gray-400 shrink-0" />
                    <span className="font-mono text-xs text-gray-500">Liên hệ: {selectedOrder.creator_phone}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* PHẦN 3: CHI TIẾT KIỆN HÀNG */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-400 tracking-wider uppercase block px-1">Chi tiết kiện hàng</span>
              <div className="border border-gray-100 rounded-xl overflow-hidden bg-white">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50/80 border-b border-gray-100">
                    <tr>
                      <th className="px-4 py-2.5 font-medium text-gray-500">Sản phẩm / Mặt hàng</th>
                      <th className="px-4 py-2.5 font-medium text-gray-500 text-center">SL</th>
                      <th className="px-4 py-2.5 font-medium text-gray-500 text-right">Đơn giá</th>
                      <th className="px-4 py-2.5 font-medium text-gray-500 text-right">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {selectedOrder.items.map((item) => (
                      <tr key={item.id} className="text-gray-700">
                        <td className="px-4 py-3 font-medium text-gray-800 flex items-center gap-2">
                          <Package size={14} className="text-gray-400" /> {item.product_name}
                        </td>
                        <td className="px-4 py-3 text-center font-mono">{item.quantity}</td>
                        <td className="px-4 py-3 text-right text-gray-500">{item.price.toLocaleString('vi-VN')} đ</td>
                        <td className="px-4 py-3 text-right font-bold text-gray-900">
                          {(item.quantity * item.price).toLocaleString('vi-VN')} đ
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* PHẦN 4: KHU VỰC TỔNG THANH TOÁN (Đã sửa lỗi hiển thị chữ bị rớt dòng) */}
            <div className="flex justify-end pt-2">
              <div className="w-full sm:w-80 bg-gray-900 text-white border border-gray-800 rounded-xl p-4 shadow-md">
                <div className="flex justify-between items-center gap-4">
                  <div className="flex items-center gap-1.5 text-sm font-medium text-gray-400 whitespace-nowrap">
                    <DollarSign size={16} className="text-emerald-400 shrink-0" /> 
                    <span>Tổng thanh toán:</span>
                  </div>
                  <span className="text-xl font-bold text-emerald-400 font-mono tracking-wide whitespace-nowrap">
                    {selectedOrder.total_amount.toLocaleString('vi-VN')} đ
                  </span>
                </div>
              </div>
            </div>

            {/* FOOTER ĐÓNG MODAL */}
            <div className="flex justify-end pt-3 border-t border-gray-100 mt-4">
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)} 
                className="px-5 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition"
              >
                Đóng thông tin
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}