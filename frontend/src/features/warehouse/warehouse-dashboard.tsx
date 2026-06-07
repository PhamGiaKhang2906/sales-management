"use client";

import { 
  User, 
  CreditCard, 
  Calendar, 
  Briefcase, 
  Clock, 
  Coins,
  FileText,
  PackagePlus,
  AlertTriangle,
  DollarSign
} from 'lucide-react';
import { useWarehouse } from '@/hooks/useWarehouse';
import { useEmployees, useSuppliers, useProducts, useStore } from '@/hooks/useOwner';
import { useState, useMemo, useEffect } from 'react';

export default function WarehouseDashboardPage() {
  const { dashboard, loading, createPurchaseOrder } = useWarehouse();
  const { employees } = useEmployees();
  const { suppliers } = useSuppliers();
  const { products } = useProducts();
  const { storeInfo } = useStore();

  // Use the first employee from API if available; otherwise use an empty object
  const employee = useMemo(() => (employees && employees.length > 0 ? employees[0] : {}) as any, [employees]);

  // Create PO modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [poSupplierId, setPoSupplierId] = useState<number | null>(null);
  const [poStoreId, setPoStoreId] = useState<number | null>(null);
  const [poItems, setPoItems] = useState<Array<{ product_id: number | null; quantity: number; import_price: number }>>([
    { product_id: null, quantity: 1, import_price: 0 }
  ]);

  useEffect(() => {
    if (!poSupplierId && suppliers && suppliers.length > 0) setPoSupplierId(suppliers[0].id as number);
  }, [suppliers]);
  useEffect(() => {
    if (!poStoreId && storeInfo?.id) setPoStoreId(storeInfo.id as number);
  }, [storeInfo]);

  const warehouseStats = {
    importOrdersToday: dashboard?.importOrdersToday ?? 0,
    importedProductsToday: dashboard?.importedProductsToday ?? 0,
    totalImportAmount: dashboard?.totalImportAmount ?? 0,
    lowStockAlerts: dashboard?.lowStockAlerts ?? 0,
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Tiêu đề trang */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Tổng quan nhân viên kho</h2>
        <p className="text-gray-500 text-sm mt-1">Xem thông tin cá nhân và số liệu nhập xuất kho trong ngày.</p>
      </div>

      {/* 1. PHẦN THÔNG TIN NHÂN VIÊN */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <User className="text-blue-500" size={20} />
            Thông tin nhân viên
          </h3>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><User size={18} /></div>
              <div>
                <p className="text-sm text-gray-500 mb-0.5">Họ và tên</p>
                <p className="font-semibold text-gray-800">{employee.fullname}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-gray-50 text-gray-600 rounded-lg"><User size={18} /></div>
              <div>
                <p className="text-sm text-gray-500 mb-0.5">Tên đăng nhập</p>
                <p className="font-semibold text-gray-800">{employee.username ?? ''}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><CreditCard size={18} /></div>
              <div>
                <p className="text-sm text-gray-500 mb-0.5">Số CCCD</p>
                <p className="font-semibold text-gray-800">{employee.cccd ?? ''}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-pink-50 text-pink-600 rounded-lg"><Calendar size={18} /></div>
              <div>
                <p className="text-sm text-gray-500 mb-0.5">Ngày sinh</p>
                <p className="font-semibold text-gray-800">{employee.birthday ?? ''}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><PackagePlus size={18} /></div>
              <div>
                <p className="text-sm text-gray-500 mb-0.5">Số điện thoại</p>
                <p className="font-semibold text-gray-800">{employee.phone ?? ''}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><Briefcase size={18} /></div>
              <div>
                <p className="text-sm text-gray-500 mb-0.5">Chức vụ</p>
                <p className="font-semibold text-gray-800">{employee.role_name || employee.position || ''}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-teal-50 text-teal-600 rounded-lg"><Clock size={18} /></div>
              <div>
                <p className="text-sm text-gray-500 mb-0.5">Ca làm việc</p>
                <p className="font-semibold text-gray-800">{employee.work_shift || employee.shift || ''}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><FileText size={18} /></div>
              <div>
                <p className="text-sm text-gray-500 mb-0.5">Địa chỉ</p>
                <p className="font-semibold text-gray-800">{employee.address ?? ''}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Coins size={18} /></div>
              <div>
                <p className="text-sm text-gray-500 mb-0.5">Hệ số lương</p>
                <p className="font-semibold text-gray-800">{employee.salary_factor ?? employee.salaryCoef ?? ''}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-sky-50 text-sky-600 rounded-lg"><DollarSign size={18} /></div>
              <div>
                <p className="text-sm text-gray-500 mb-0.5">Trạng thái</p>
                <p className="font-semibold text-gray-800">{employee.status ?? ''}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-gray-50 text-gray-600 rounded-lg"><Calendar size={18} /></div>
              <div>
                <p className="text-sm text-gray-500 mb-0.5">Ngày tạo tài khoản</p>
                <p className="font-semibold text-gray-800">{employee.created_at ?? ''}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Button: tạo phiếu nhập */}
      <div className="flex justify-end">
        <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">
          <PackagePlus size={16} /> Tạo phiếu nhập
        </button>
      </div>

      {/* Modal: tạo phiếu nhập (đơn giản, 1..n items) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-full max-w-3xl rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold">Tạo phiếu nhập</h4>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500">Đóng</button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Nhà cung cấp</label>
                  <select value={poSupplierId ?? ''} onChange={(e) => setPoSupplierId(Number(e.target.value))} className="mt-1 w-full border rounded px-2 py-2">
                    <option value="">-- Chọn nhà cung cấp --</option>
                    {suppliers?.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                  {(!suppliers || suppliers.length===0) && <p className="text-sm text-gray-500 mt-2">Không có nhà cung cấp nào hoặc không có quyền truy cập.</p>}
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-600">Sản phẩm</label>
                <div className="space-y-2 mt-2">
                  {poItems.map((it, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-7">
                        <select value={it.product_id ?? ''} onChange={(e) => {
                          const pid = Number(e.target.value) || null;
                          setPoItems(prev => prev.map((p, i) => i===idx ? { ...p, product_id: pid } : p));
                        }} className="w-full border rounded px-2 py-2">
                          <option value="">-- Chọn sản phẩm --</option>
                          {products?.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                      </div>
                      <div className="col-span-3">
                        <input type="number" min={0} value={it.import_price} onChange={(e) => setPoItems(prev => prev.map((p,i)=> i===idx ? { ...p, import_price: Number(e.target.value) } : p))} className="w-full border rounded px-2 py-2" placeholder="Giá nhập" />
                      </div>
                      <div className="col-span-2">
                        <input type="number" min={1} value={it.quantity} onChange={(e) => setPoItems(prev => prev.map((p,i)=> i===idx ? { ...p, quantity: Number(e.target.value) } : p))} className="w-full border rounded px-2 py-2" />
                      </div>
                      <div className="col-span-1 text-right">
                        <button className="text-red-500" onClick={() => setPoItems(prev => prev.filter((_,i)=>i!==idx))}>Xóa</button>
                      </div>
                    </div>
                  ))}

                  <div>
                    <button className="text-indigo-600" onClick={() => setPoItems(prev => [...prev, { product_id: null, quantity: 1, import_price: 0 }])}>+ Thêm sản phẩm</button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button className="px-4 py-2 rounded border" onClick={() => setIsModalOpen(false)}>Hủy</button>
                <button className="px-4 py-2 rounded bg-indigo-600 text-white" onClick={async () => {
                  // build payload (store_id is derived from current store if not shown)
                  if (!poSupplierId) return alert('Vui lòng chọn nhà cung cấp');
                  const storeIdToUse = poStoreId ?? storeInfo?.id;
                  const itemsPayload = poItems.filter(i=>i.product_id).map(i=>({ product_id: i.product_id as number, quantity: i.quantity, import_price: i.import_price }));
                  if (itemsPayload.length===0) return alert('Vui lòng thêm ít nhất 1 sản phẩm');
                  try {
                    await createPurchaseOrder({ supplier_id: poSupplierId, store_id: storeIdToUse as number, tax: 0, items: itemsPayload });
                    alert('Tạo phiếu nhập thành công');
                    setIsModalOpen(false);
                  } catch (err) {
                    console.error(err);
                    alert('Tạo phiếu nhập thất bại');
                  }
                }}>Tạo phiếu nhập</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. PHẦN THỐNG KÊ KHO HÀNG */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card: Đơn nhập hôm nay */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Đơn nhập hôm nay</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{warehouseStats.importOrdersToday} <span className="text-sm font-normal text-gray-500">đơn</span></p>
          </div>
        </div>

        {/* Card: Số sản phẩm nhập */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
            <PackagePlus size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Số sản phẩm nhập</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{warehouseStats.importedProductsToday} <span className="text-sm font-normal text-gray-500">sp</span></p>
          </div>
        </div>

        {/* Card: Số tiền đã nhập */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Số tiền đã nhập</p>
            <p className="text-xl font-bold text-indigo-600 mt-1">
              {warehouseStats.totalImportAmount.toLocaleString('vi-VN')} <span className="text-base font-medium underline">đ</span>
            </p>
          </div>
        </div>

        {/* Card: Cảnh báo tồn thấp */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Cảnh báo tồn thấp</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{warehouseStats.lowStockAlerts} <span className="text-sm font-normal text-gray-500">mã SP</span></p>
          </div>
        </div>

      </div>
    </div>
  );
}