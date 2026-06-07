"use client";

import { useState, useEffect } from 'react';
import { CornerDownLeft, User, Phone, MapPin } from 'lucide-react';
import { Modal } from '../../components/layout/Modal';
import useSales from '@/hooks/useSales';

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
  customer_id?: number | null;
  total_amount: number;
  status: 'purchased' | 'returned'; // Đã đổi thành Đã mua / Đã trả
  created_at: string;
  items: ReturnItem[];
}

export function ReturnOrdersPage() {
  const { orders: fetchedOrders, ordersLoading, refreshOrders, returnOrder, customers } = useSales();
  const [orders, setOrders] = useState<OrderToReturn[]>([]);

  useEffect(() => {
    // map fetchedOrders to OrderToReturn shape
    if (!fetchedOrders) return;
    const mapped = (Array.isArray(fetchedOrders) ? fetchedOrders : (fetchedOrders.orders || fetchedOrders)).map((o: any) => ({
      id: o.id,
      order_code: o.id ? `DH-${o.id}` : '',
      customer_id: o.customer_id || o.customer?.id || null,
      customer_name: o.customer_name || o.customer?.name || '',
      customer_phone: o.customer_phone || o.customer?.phone || '',
      customer_address: o.customer_address || o.customer?.address || o.customer?.Address || '',
      total_amount: o.final_amount || o.FinalAmount || o.total_amount || o.TotalAmount || 0,
      status: o.status === 'Đã_trả' ? 'returned' : 'purchased',
      created_at: o.created_at || o.CreatedAt || o.createdAt || '',
      items: (o.items || o.order_items || o.OrderItems || []).map((it: any) => ({
        id: it.id,
        product_name: it.product_name || it.product?.name || it.Product?.Name || '',
        sku: it.sku || it.product?.sku || it.Product?.SKU || '',
        quantity: it.quantity || it.Quantity || 0,
        price: it.unit_price || it.UnitPrice || it.price || 0,
      }))
    }));
    setOrders(mapped);
  }, [fetchedOrders]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderToReturn | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCustomerId, setFilterCustomerId] = useState<number | null>(null);

  const handleOpenReturn = (order: OrderToReturn) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleConfirmReturn = async () => {
    if (!selectedOrder) return;
    try {
      await returnOrder(selectedOrder.id);
      alert(`Đã thực hiện trả hàng cho đơn: ${selectedOrder.order_code}`);
      setIsModalOpen(false);
      await refreshOrders();
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Lỗi khi trả hàng';
      alert('Lỗi: ' + msg);
    }
  };

  const filteredOrders = (filterStatus === 'all' ? orders : orders.filter(order => order.status === filterStatus))
    .filter(order => (filterCustomerId ? order.customer_id === filterCustomerId || order.customer_phone === (customers.find(c=>c.id===filterCustomerId)?.phone) : true));

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
        <div className="flex items-center gap-4">
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

          {/* Customer filter */}
          <div className="bg-white border rounded-lg px-3 py-1">
            <select value={filterCustomerId ?? ''} onChange={(e) => setFilterCustomerId(e.target.value ? Number(e.target.value) : null)} className="bg-transparent outline-none text-sm">
              <option value="">Tất cả khách hàng</option>
              {customers && customers.map((c: any) => (
                <option key={c.id} value={c.id}>{c.name} — {c.phone}</option>
              ))}
            </select>
          </div>
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