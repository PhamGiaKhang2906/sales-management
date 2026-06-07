"use client";

import { useState } from 'react';
import { CornerDownLeft, User, Phone, MapPin } from 'lucide-react';
import { Modal } from '../../components/layout/Modal';

// Khai báo kiểu dữ liệu
interface ReturnItem {
  id: number;
  product_name: string;
  sku: string;
  quantity: number;
  price: number;
}

interface OrderToReturn {
  id: number;
  order_code: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  total_amount: number;
  status: 'purchased' | 'returned'; // Đã đổi thành Đã mua / Đã trả
  created_at: string;
  items: ReturnItem[];
}

export function ReturnOrdersPage() {
  // Dữ liệu mẫu khởi tạo
  const [orders, setOrders] = useState<OrderToReturn[]>([
    {
      id: 1,
      order_code: 'DH-10023',
      customer_name: 'Nguyễn Đình Hoàng',
      customer_phone: '0935123456',
      customer_address: '45 Lê Lợi, Phú Hội, Thành phố Huế',
      total_amount: 350000,
      status: 'purchased',
      created_at: '2026-06-06 14:25:00',
      items: [
        { id: 101, product_name: 'Cà phê muối hảo hạng', sku: 'CFM-01', quantity: 2, price: 35000 },
        { id: 102, product_name: 'Trà thạch đào size L', sku: 'TTD-L', quantity: 3, price: 45000 },
        { id: 103, product_name: 'Bánh sừng bò trứng muối', sku: 'BSB-TM', quantity: 3, price: 48000 }
      ]
    },
    {
      id: 2,
      order_code: 'DH-10024',
      customer_name: 'Trần Thị Thu Thảo',
      customer_phone: '0905777888',
      customer_address: 'Kiệt 112 Hùng Vương, Thành phố Huế',
      total_amount: 120000,
      status: 'returned',
      created_at: '2026-06-05 10:12:00',
      items: [
        { id: 104, product_name: 'Bạc xỉu cốt dừa', sku: 'BXD-01', quantity: 2, price: 40000 },
        { id: 105, product_name: 'Trà xanh Nhật Bản', sku: 'TXN-01', quantity: 1, price: 40000 }
      ]
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderToReturn | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const handleOpenReturn = (order: OrderToReturn) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleConfirmReturn = () => {
    alert(`Đã thực hiện trả hàng cho đơn: ${selectedOrder?.order_code}`);
    setIsModalOpen(false);
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
          <h1 className="text-2xl font-bold text-gray-800">Xử lý trả hàng</h1>
          <p className="text-gray-500 text-sm">Quản lý và thực hiện nghiệp vụ trả hàng từ khách hàng</p>
        </div>
        
        {/* Bộ lọc 3 mục: Tất cả, Đã mua, Đã trả */}
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
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Ngày đặt</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Tổng tiền</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-400">
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
                    <td className="px-6 py-4 text-sm text-gray-500 font-mono">{order.created_at}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">
                      {order.total_amount.toLocaleString('vi-VN')} đ
                    </td>
                    <td className="px-6 py-4 text-sm text-right">
                      <div className="flex gap-2 justify-end">
                        <button 
                          onClick={() => handleOpenReturn(order)} 
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-600 hover:bg-orange-100 hover:text-orange-700 rounded-lg font-semibold transition-colors border border-orange-200"
                        >
                          <CornerDownLeft size={16} />
                          Trả hàng
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

      {/* MODAL GIAO DIỆN TRẢ HÀNG */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={`Thực hiện trả hàng - Đơn gốc: ${selectedOrder?.order_code}`}
        size="xl" // Đã đổi về xl để hết lỗi TypeScript
      >
        {selectedOrder && (
          <div className="flex flex-col md:flex-row gap-4 max-h-[70vh] overflow-hidden p-1">
            
            {/* ================= CỘT TRÁI (60%) ================= */}
            <div className="w-full md:w-[60%] flex flex-col gap-4">
              
              <div className="flex-1 rounded-lg border border-gray-200 p-4 overflow-y-auto">
                <h3 className="text-sm font-bold text-gray-800 mb-3 pb-2 border-b">Danh sách sản phẩm</h3>
                <div className="flex flex-col gap-3">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-3 border border-gray-100 rounded-lg bg-gray-50">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 text-sm">{item.product_name}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">SKU: {item.sku}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center">
                          <span className="text-[11px] text-gray-500 mb-0.5">SL</span>
                          <span className="px-2 font-medium text-sm bg-white border rounded min-w-[32px] text-center">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="text-right w-24">
                          <span className="text-[11px] text-gray-500 block mb-0.5">Thành tiền</span>
                          <p className="font-semibold text-sm text-gray-800">
                            {(item.price * item.quantity).toLocaleString('vi-VN')} đ
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ================= CỘT PHẢI (40%) ================= */}
            <div className="w-full md:w-[40%] flex flex-col gap-4">
              
              {/* Thông tin khách hàng */}
              <div className="flex-1 rounded-lg border border-gray-200 p-4 overflow-y-auto">
                <h3 className="text-sm font-bold text-gray-800 mb-3 border-b pb-2">Thông tin khách hàng</h3>
                
                <div className="flex flex-col gap-3">
                  <div className="flex items-start gap-2">
                    <User className="text-gray-400 mt-0.5" size={16} />
                    <div>
                      <p className="font-medium text-sm text-gray-800">{selectedOrder.customer_name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Phone className="text-gray-400 mt-0.5" size={16} />
                    <div>
                      <p className="text-sm text-gray-700">{selectedOrder.customer_phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin className="text-gray-400 mt-0.5" size={16} />
                    <div>
                      <p className="text-sm text-gray-700">{selectedOrder.customer_address}</p>
                    </div>
                  </div>
                </div>

                {/* Thông tin giá trị đã được làm đơn giản */}
                <h3 className="text-sm font-bold text-gray-800 mt-6 mb-3 border-b pb-2">Thông tin thanh toán</h3>
                <div className="flex flex-col gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm">
                  <div className="flex justify-between items-center text-gray-600">
                    <span>Ngày đặt hàng:</span>
                    <span>{selectedOrder.created_at}</span>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200 mt-1">
                    <span className="font-medium text-gray-800">Cần hoàn trả:</span>
                    <span className="font-bold text-gray-900">
                      {selectedOrder.total_amount.toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                </div>
              </div>

              {/* Nút trả hàng đã được làm nhỏ lại */}
              <button 
                onClick={handleConfirmReturn}
                className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <CornerDownLeft size={18} />
                Trả hàng
              </button>
            </div>

          </div>
        )}
      </Modal>
    </div>
  );
}