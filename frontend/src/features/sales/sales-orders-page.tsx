"use client";

import { useState, useEffect, useRef } from 'react';
import useSales from '@/hooks/useSales';
import { Search, Trash2, User, Phone, MapPin, Mail, Loader2 } from 'lucide-react';

// Khai báo kiểu dữ liệu cho Sản phẩm trả về từ API
interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
}

// Khai báo kiểu dữ liệu cho Sản phẩm trong Giỏ hàng
interface OrderItem {
  id: number;
  productName: string;
  sku: string;
  quantity: number;
  price: number;
}

export function SalesOrdersPage() {
  const [isClient, setIsClient] = useState(false); // Xử lý lỗi hydration Next.js
  const { orders, ordersLoading, refreshOrders, searchProducts, createOrder } = useSales();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // State giỏ hàng (Khởi tạo trống, sẽ load từ localStorage sau khi component mount)
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');

  // 1. CHẠY KHI MỞ TRANG: Load giỏ hàng lưu tạm từ LocalStorage
  useEffect(() => {
    setIsClient(true);
    const savedCart = localStorage.getItem('pos_cart_temp');
    if (savedCart) {
      try {
        setOrderItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Lỗi đọc giỏ hàng từ localStorage", error);
      }
    }
  }, []);

  // 2. CHẠY MỖI KHI GIỎ HÀNG THAY ĐỔI: Cập nhật lại vào LocalStorage
  useEffect(() => {
    if (isClient) {
      localStorage.setItem('pos_cart_temp', JSON.stringify(orderItems));
    }
  }, [orderItems, isClient]);

  // Xử lý đóng Dropdown khi click ra ngoài vùng tìm kiếm
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 3. HÀM GỌI API TÌM KIẾM (Kích hoạt khi bấm nút tìm)
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    setIsSearching(true);
    setShowDropdown(true);

    try {
      const results = await searchProducts(searchQuery);
      setSearchResults(Array.isArray(results) ? results : (results.products || results.Products || []));
    } catch (error) {
      console.error("Lỗi khi tìm kiếm sản phẩm:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Bắt sự kiện nhấn phím Enter trong ô tìm kiếm
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 4. HÀM THÊM SẢN PHẨM VÀO GIỎ HÀNG
  const handleSelectProduct = (product: Product) => {
    setOrderItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(item => item.id === product.id);
      
      if (existingItemIndex >= 0) {
        // Đã có trong giỏ -> Tăng số lượng
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += 1;
        return updatedItems;
      } else {
        // Chưa có trong giỏ -> Thêm mới
        return [...prevItems, {
          id: product.id,
          productName: product.name,
          sku: product.sku,
          price: product.price,
          quantity: 1
        }];
      }
    });

    // Sau khi chọn, ẩn list tìm kiếm và xóa thanh gõ
    setShowDropdown(false);
    setSearchQuery('');
  };

  // Cập nhật số lượng sản phẩm (+/-)
  const updateQuantity = (id: number, amount: number) => {
    setOrderItems((prev) => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + amount;
        return { ...item, quantity: newQty < 1 ? 1 : newQty };
      }
      return item;
    }));
  };

  const handleRemoveItem = (id: number) => {
    setOrderItems(orderItems.filter(item => item.id !== id));
  };

  // Tính toán tiền
  const totalAmount = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const discountAmount = totalAmount * (discount / 100);

  const finalAmount = Math.max(
    0,
    totalAmount - discountAmount
  );

  // Không render UI gốc cho đến khi client hydration xong (Tránh lỗi Next.js)
  if (!isClient) return null;

  return (
    <div className="flex flex-col h-screen bg-gray-100 p-4 font-sans">
      
      {/* THANH TAB TÌM KIẾM SẢN PHẨM CÓ NÚT BẤM */}
      <div className="relative w-full bg-white p-2 rounded-lg shadow-sm mb-4 flex items-center border border-gray-200" ref={dropdownRef}>
        <div className="flex flex-1 items-center px-2">
          <Search className="text-gray-400 mr-2" size={24} />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm theo tên (VD: Áo), mã SKU... và bấm nút Tìm hoặc Enter"
            className="w-full outline-none text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => { if (searchResults.length > 0) setShowDropdown(true); }}
          />
        </div>
        
        {/* Nút Tìm Kiếm ở cuối thanh */}
        <button 
          onClick={handleSearch}
          disabled={isSearching}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-semibold transition-colors flex items-center min-w-[120px] justify-center"
        >
          {isSearching ? <Loader2 className="animate-spin" size={20} /> : "Tìm kiếm"}
        </button>

        {/* Khung Dropdown Hiển thị Danh sách Kết quả Tìm kiếm */}
        {showDropdown && (
          <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto">
            {isSearching ? (
              <div className="p-4 text-center text-gray-500">Đang tìm kiếm...</div>
            ) : searchResults.length === 0 ? (
              <div className="p-4 text-center text-gray-500">Không tìm thấy sản phẩm nào!</div>
            ) : (
              searchResults.map((product) => (
                <div 
                  key={product.id}
                  onClick={() => handleSelectProduct(product)}
                  className="flex justify-between items-center p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-0"
                >
                  <div>
                    <h4 className="font-bold text-gray-800">{product.name}</h4>
                    <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                  </div>
                  <div className="font-bold text-blue-600">
                    {product.price.toLocaleString('vi-VN')} đ
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* KHU VỰC NỘI DUNG CHÍNH */}
      <div className="flex flex-1 gap-4 overflow-hidden">
        
        {/* ================= CỘT TRÁI (6/10) ================= */}
        <div className="w-[60%] flex flex-col gap-4">
          
          {/* Khu trên (8/10): Product Card List */}
          <div className="h-[80%] bg-white rounded-lg shadow-sm p-4 overflow-y-auto">
            {orderItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <Search size={48} className="mb-4 opacity-20" />
                <p>Chưa có sản phẩm nào trong đơn hàng</p>
                <p className="text-sm mt-2">Dữ liệu đơn hàng đang được lưu tự động</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {orderItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 text-lg">{item.productName}</h4>
                      <p className="text-xs text-gray-500 mb-1">SKU: {item.sku}</p>
                      <p className="text-blue-600 font-semibold">{item.price.toLocaleString('vi-VN')} đ</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border rounded-md overflow-hidden bg-gray-50">
                        <button onClick={() => updateQuantity(item.id, -1)} className="px-3 py-1 hover:bg-gray-200 font-bold">-</button>
                        <span className="px-4 font-medium bg-white py-1">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="px-3 py-1 hover:bg-gray-200 font-bold">+</button>
                      </div>
                      <p className="font-bold text-lg w-32 text-right">
                        {(item.price * item.quantity).toLocaleString('vi-VN')} đ
                      </p>
                      <button 
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Khu dưới (2/10): Tính tiền */}
          <div className="min-h-[220px] bg-white rounded-lg shadow-sm p-4 flex flex-col gap-4">

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">
                Mã khuyến mãi (%):
              </span>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={discount === 0 ? '' : discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-24 h-9 text-sm text-right border rounded px-2 outline-none focus:border-blue-500"
                />
                <span className="text-sm text-gray-700">%</span>
              </div>
            </div>

            <div className="flex justify-between items-center border-b pb-3">
              <span className="text-sm font-medium text-gray-700">
                Tổng tiền ({orderItems.length} sản phẩm):
              </span>

              <span className="text-sm font-semibold text-gray-700">
                {totalAmount.toLocaleString('vi-VN')} đ
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">
                Tiền giảm:
              </span>

              <span className="text-sm font-semibold text-gray-700">
                -{discountAmount.toLocaleString('vi-VN')} đ
              </span>
            </div>

            <div className="flex justify-between items-center pt-1">
              <span className="text-sm font-medium text-gray-700">
                Khách cần trả:
              </span>

              <span className="text-sm font-semibold text-gray-700">
                {finalAmount.toLocaleString('vi-VN')} đ
              </span>
            </div>

          </div>
        </div>

        {/* ================= CỘT PHẢI (4/10) ================= */}
        <div className="w-[40%] flex flex-col gap-4">
          <div className="h-[90%] bg-white rounded-lg shadow-sm p-5 overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-800 mb-6 border-b pb-2">Thông tin khách hàng</h3>
            <div className="flex flex-col gap-5">
              <div className="relative">
                <User className="absolute top-3 left-3 text-gray-400" size={20} />
                <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} type="text" placeholder="Tên khách hàng" className="w-full pl-10 pr-4 py-3 border rounded-lg outline-none focus:border-blue-500" />
              </div>
              <div className="relative">
                <Phone className="absolute top-3 left-3 text-gray-400" size={20} />
                <input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} type="tel" placeholder="Số điện thoại" className="w-full pl-10 pr-4 py-3 border rounded-lg outline-none focus:border-blue-500" />
              </div>
              <div className="relative">
                <Mail className="absolute top-3 left-3 text-gray-400" size={20} />
                <input
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  type="email"
                  placeholder="Email"
                  className="w-full pl-10 pr-4 py-3 border rounded-lg outline-none focus:border-blue-500"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute top-3 left-3 text-gray-400" size={20} />
                <textarea value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} placeholder="Địa chỉ giao hàng (nếu có)" rows={3} className="w-full pl-10 pr-4 py-3 border rounded-lg outline-none focus:border-blue-500 resize-none" />
              </div>
            </div>
          </div>

          <div className="h-[10%] flex items-end">
            <button 
               className="w-full h-full bg-green-600 hover:bg-green-700 text-white text-xl font-bold rounded-lg shadow-md transition-colors"
               onClick={async () => {
                 if (orderItems.length === 0) { alert('Không có sản phẩm trong đơn'); return; }
                 try {
                   const payload: any = {
                     discount: Number(discount) || 0,
                     tax: 0,
                     items: orderItems.map(it => ({ product_id: it.id, quantity: it.quantity }))
                   };
                   if (customerPhone.trim()) {
                     payload.customer = {
                       name: customerName || 'Khách hàng',
                       phone: customerPhone,
                       address: customerAddress || '',
                       email: customerEmail || '',
                     };
                   }
                   await createOrder(payload);
                   localStorage.removeItem('pos_cart_temp');
                   setOrderItems([]);
                   alert('Tạo đơn hàng thành công');
                   await refreshOrders();
                 } catch (err: any) {
                   const msg = err?.response?.data?.message || err?.message || 'Lỗi khi tạo đơn hàng';
                   alert('Lỗi: ' + msg);
                 }
               }}
            >
              TẠO ĐƠN HÀNG
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}