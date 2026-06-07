"use client";

import { useEffect, useMemo, useState } from 'react';
import {
  ArrowDownCircle,
  ArrowUpCircle,
  ChevronDown,
  Filter,
  Layers3,
  PackageSearch,
  Plus,
  Search,
  Store,
  Trash2,
} from 'lucide-react';
import { useWarehouse } from '@/hooks/useWarehouse';

type ImportRow = { product_id: number | null; quantity: number; import_price: number };

export function InventoryPage() {
  const { products, suppliers, purchaseOrders, loading, createPurchaseOrder, returnPurchaseOrder, refresh } = useWarehouse();

  const [searchText, setSearchText] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [stockFilter, setStockFilter] = useState('Tất cả');
  const [supplierFilter, setSupplierFilter] = useState<number | 'Tất cả'>('Tất cả');

  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isReturnOpen, setIsReturnOpen] = useState(false);
  const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState<any | null>(null);

  const [poSupplierId, setPoSupplierId] = useState<number | null>(null);
  const [poItems, setPoItems] = useState<ImportRow[]>([{ product_id: null, quantity: 1, import_price: 0 }]);

  const getProductDefaultImportPrice = (productId?: number | null) => {
    if (!productId) return 0;
    const product = safeProducts.find((p: any) => Number(p.id ?? p.ID) === Number(productId));
    if (!product) return 0;
    return Number(product.cost ?? product.Cost ?? product.price ?? product.Price ?? 0);
  };

  useEffect(() => {
    if (!poSupplierId && suppliers.length > 0) {
      setPoSupplierId(Number(suppliers[0].id ?? suppliers[0].ID));
    }
  }, [suppliers, poSupplierId]);

  useEffect(() => {
    if (!selectedPurchaseOrder && purchaseOrders.length > 0) {
      setSelectedPurchaseOrder(purchaseOrders[0]);
    }
  }, [purchaseOrders, selectedPurchaseOrder]);

  const handleSearchClick = async () => {
    setAppliedSearch(searchText);
    await refresh.products({ search: searchText });
  };

  const safeProducts = Array.isArray(products) ? products : [];
  const safeSuppliers = Array.isArray(suppliers) ? suppliers : [];
  const safePurchaseOrders = Array.isArray(purchaseOrders) ? purchaseOrders : [];

  const filteredProducts = safeProducts.filter((product: any) => {
    const searchLower = appliedSearch.toLowerCase();
    const pCode = product.code || product.Code || product.sku || product.SKU || '';
    const pName = product.name || product.Name || '';
    const matchesSearch = pCode.toLowerCase().includes(searchLower) || pName.toLowerCase().includes(searchLower);
    const currentStock = product.current_stock ?? product.CurrentStock ?? product.stock ?? product.Inventory?.current_stock ?? product.Inventory?.CurrentStock ?? 0;
    const matchesStock = stockFilter === 'Tất cả' || (stockFilter === 'Còn hàng' ? currentStock > 0 : currentStock === 0);
    const supId = product.supplier_id || product.SupplierID || product.Supplier?.id || product.Supplier?.ID || 0;
    const matchesSupplier = supplierFilter === 'Tất cả' || supId === supplierFilter;
    return matchesSearch && matchesStock && matchesSupplier;
  });

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a: any, b: any) => {
      const stockA = a.current_stock ?? a.CurrentStock ?? a.stock ?? a.Inventory?.current_stock ?? a.Inventory?.CurrentStock ?? 0;
      const stockB = b.current_stock ?? b.CurrentStock ?? b.stock ?? b.Inventory?.current_stock ?? b.Inventory?.CurrentStock ?? 0;
      return stockA - stockB;
    });
  }, [filteredProducts]);

  const totalStock = filteredProducts.reduce((acc: number, p: any) => acc + (p.current_stock ?? p.CurrentStock ?? p.stock ?? p.Inventory?.current_stock ?? p.Inventory?.CurrentStock ?? 0), 0);

  const openImportModal = (productId?: number) => {
    if (productId) {
      setPoItems([{ product_id: productId, quantity: 1, import_price: getProductDefaultImportPrice(productId) }]);
    }
    setIsImportOpen(true);
  };

  const openReturnModal = (purchaseOrder?: any) => {
    if (purchaseOrder) {
      setSelectedPurchaseOrder(purchaseOrder);
    }
    setIsReturnOpen(true);
  };

  const selectedOrderItems = selectedPurchaseOrder?.items || selectedPurchaseOrder?.Items || [];

  return (
    <div className="min-h-full bg-slate-50">
      <div className="border-b border-slate-200 bg-white px-4 py-3 shadow-sm sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
              <Store className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Kho hàng</h2>
              <p className="text-sm text-slate-500">Dữ liệu tồn kho, phiếu nhập và phiếu trả lấy trực tiếp từ database</p>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-3 xl:max-w-xl xl:flex-row xl:items-center xl:justify-end">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchClick()}
                placeholder="Tìm mã hoặc tên hàng trong kho..."
                className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-12 pr-12 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
              <button onClick={handleSearchClick} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl p-2 text-slate-500 hover:bg-slate-100" type="button">
                <Filter className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {isImportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-4xl rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Nhập hàng</h3>
              <button onClick={() => setIsImportOpen(false)} className="text-slate-500 hover:text-slate-700">Đóng</button>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-slate-600">Nhà cung cấp</label>
                <select value={poSupplierId ?? ''} onChange={(e) => setPoSupplierId(Number(e.target.value))} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2">
                  <option value="">-- Chọn nhà cung cấp --</option>
                  {safeSuppliers.map((sup: any) => (
                    <option key={sup.id ?? sup.ID} value={sup.id ?? sup.ID}>{sup.name ?? sup.Name}</option>
                  ))}
                </select>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                Chọn sản phẩm và số lượng nhập. Hệ thống sẽ tự cộng tồn kho khi tạo phiếu.
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {poItems.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-6">
                    <select value={item.product_id ?? ''} onChange={(e) => {
                      const productId = Number(e.target.value) || null;
                      setPoItems(prev => prev.map((row, i) => i === idx ? { ...row, product_id: productId, import_price: getProductDefaultImportPrice(productId) || row.import_price } : row));
                    }} className="w-full rounded-xl border border-slate-200 px-3 py-2">
                      <option value="">-- Chọn sản phẩm --</option>
                      {sortedProducts.map((p: any) => (
                        <option key={p.id ?? p.ID} value={p.id ?? p.ID}>{p.name ?? p.Name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <input type="number" min={1} value={item.quantity} onChange={(e) => setPoItems(prev => prev.map((row, i) => i === idx ? { ...row, quantity: Number(e.target.value) } : row))} className="w-full rounded-xl border border-slate-200 px-3 py-2" placeholder="SL" />
                  </div>
                  <div className="col-span-3">
                    <input type="number" min={0} value={item.import_price} onChange={(e) => setPoItems(prev => prev.map((row, i) => i === idx ? { ...row, import_price: Number(e.target.value) } : row))} className="w-full rounded-xl border border-slate-200 px-3 py-2" placeholder="Giá nhập" />
                  </div>
                  <div className="col-span-1 text-right">
                    <button type="button" className="rounded-lg p-2 text-red-600 hover:bg-red-50" onClick={() => setPoItems(prev => prev.filter((_, i) => i !== idx))}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => setPoItems(prev => [...prev, { product_id: null, quantity: 1, import_price: 0 }])} className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800">
                <Plus className="h-4 w-4" /> Thêm dòng hàng
              </button>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setIsImportOpen(false)} className="rounded-xl border border-slate-200 px-4 py-2 text-slate-700">Hủy</button>
              <button
                onClick={async () => {
                  if (!poSupplierId) return alert('Vui lòng chọn nhà cung cấp');
                  const itemsPayload = poItems.filter(i => i.product_id).map(i => ({
                    product_id: i.product_id as number,
                    quantity: i.quantity,
                    import_price: i.import_price > 0 ? i.import_price : getProductDefaultImportPrice(i.product_id),
                  }));
                  if (itemsPayload.length === 0) return alert('Vui lòng chọn ít nhất 1 sản phẩm');
                  try {
                    await createPurchaseOrder({ supplier_id: poSupplierId, tax: 0, items: itemsPayload });
                    await refresh.products();
                    await refresh.dashboard();
                    setIsImportOpen(false);
                  } catch (err: any) {
                    const message = err?.response?.data?.message || err?.message || 'Tạo phiếu nhập thất bại';
                    alert(message);
                  }
                }}
                className="rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Tạo phiếu nhập
              </button>
            </div>
          </div>
        </div>
      )}

      {isReturnOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-5xl rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Trả hàng</h3>
              <button onClick={() => setIsReturnOpen(false)} className="text-slate-500 hover:text-slate-700">Đóng</button>
            </div>

            <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
              <div className="rounded-xl border border-slate-200 p-3">
                <div className="mb-3 text-sm font-semibold text-slate-700">Phiếu nhập đã tạo</div>
                <div className="max-h-[420px] space-y-2 overflow-auto">
                  {safePurchaseOrders.map((order: any) => {
                    const orderId = order.id ?? order.ID;
                    const isSelected = (selectedPurchaseOrder?.id ?? selectedPurchaseOrder?.ID) === orderId;
                    return (
                      <button key={orderId} type="button" onClick={() => setSelectedPurchaseOrder(order)} className={`w-full rounded-xl border px-3 py-3 text-left ${isSelected ? 'border-orange-300 bg-orange-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                        <div className="text-sm font-semibold text-slate-900">#{orderId} - {order.supplier_name || order.Supplier || 'Nhà cung cấp'}</div>
                        <div className="text-xs text-slate-500">{order.status || order.Status || 'completed'} · {new Date(order.created_at || order.CreatedAt || Date.now()).toLocaleString('vi-VN')}</div>
                      </button>
                    );
                  })}
                  {safePurchaseOrders.length === 0 && <p className="text-sm text-slate-500">Chưa có phiếu nhập nào.</p>}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-4">
                {selectedPurchaseOrder ? (
                  <>
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <div className="text-base font-semibold text-slate-900">Phiếu nhập #{selectedPurchaseOrder.id ?? selectedPurchaseOrder.ID}</div>
                        <div className="text-sm text-slate-500">{selectedPurchaseOrder.supplier_name || selectedPurchaseOrder.Supplier || ''}</div>
                      </div>
                      <div className="text-sm font-semibold text-orange-700">{selectedPurchaseOrder.status || selectedPurchaseOrder.Status || 'completed'}</div>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-slate-200">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-50 text-slate-600">
                          <tr>
                            <th className="px-3 py-2 text-left">Sản phẩm</th>
                            <th className="px-3 py-2 text-right">SL</th>
                            <th className="px-3 py-2 text-right">Giá nhập</th>
                            <th className="px-3 py-2 text-right">Thành tiền</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedOrderItems.map((item: any, index: number) => (
                            <tr key={index} className="border-t border-slate-100">
                              <td className="px-3 py-2">{item.product_name || item.ProductName || item.product_id || item.ProductID}</td>
                              <td className="px-3 py-2 text-right">{item.quantity || item.Quantity || 0}</td>
                              <td className="px-3 py-2 text-right">{Number(item.import_price || item.ImportPrice || 0).toLocaleString('vi-VN')} đ</td>
                              <td className="px-3 py-2 text-right">{Number(item.subtotal || item.Subtotal || 0).toLocaleString('vi-VN')} đ</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-4 flex justify-end gap-2">
                      <button onClick={() => setIsReturnOpen(false)} className="rounded-xl border border-slate-200 px-4 py-2 text-slate-700">Đóng</button>
                      <button
                        onClick={async () => {
                          const orderId = selectedPurchaseOrder.id ?? selectedPurchaseOrder.ID;
                          try {
                            await returnPurchaseOrder(orderId);
                            await refresh.products();
                            await refresh.dashboard();
                            await refresh.purchaseOrders();
                            setIsReturnOpen(false);
                          } catch (err: any) {
                            const message = err?.response?.data?.message || err?.message || 'Trả phiếu nhập thất bại';
                            alert(message);
                          }
                        }}
                        className="rounded-xl bg-orange-600 px-4 py-2 text-white hover:bg-orange-700"
                      >
                        Trả toàn bộ
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-slate-500">Chọn một phiếu nhập để xem chi tiết.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-5 lg:p-5">
        <aside className="sticky top-4 h-fit rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold text-slate-900">
              <Layers3 className="h-5 w-5 text-blue-600" />
              Bộ lọc kho
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500">Tổng tồn hiển thị</div>
              <div className="font-semibold text-slate-900">{totalStock}</div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="mb-2 text-sm font-semibold text-slate-700">Trạng thái tồn</div>
              <select value={stockFilter} onChange={(e) => setStockFilter(e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 bg-white appearance-none">
                <option>Tất cả</option>
                <option>Còn hàng</option>
                <option>Hết hàng</option>
              </select>
            </div>

            <div>
              <div className="mb-2 text-sm font-semibold text-slate-700">Nhà cung cấp</div>
              <select value={supplierFilter} onChange={(e) => setSupplierFilter(e.target.value === 'Tất cả' ? 'Tất cả' : Number(e.target.value))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 bg-white appearance-none">
                <option value="Tất cả">Tất cả</option>
                {safeSuppliers.map((sup: any) => (
                  <option key={sup.id ?? sup.ID} value={sup.id ?? sup.ID}>{sup.name ?? sup.Name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={() => openImportModal()} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700">
                <ArrowDownCircle className="h-4 w-4" /> Nhập hàng
              </button>
              <button type="button" onClick={() => openReturnModal()} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-600 px-4 py-3 text-sm font-semibold text-white hover:bg-orange-700">
                <ArrowUpCircle className="h-4 w-4" /> Trả hàng
              </button>
            </div>

            <button type="button" onClick={async () => { setSearchText(''); setAppliedSearch(''); setStockFilter('Tất cả'); setSupplierFilter('Tất cả'); await refresh.products(); await refresh.suppliers(); }} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              Xóa bộ lọc
            </button>
          </div>
        </aside>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] border-collapse text-sm">
              <thead>
                <tr className="bg-sky-50/80 text-slate-700">
                  <th className="px-4 py-4 text-left font-semibold">Mã hàng</th>
                  <th className="px-4 py-4 text-left font-semibold">Tên hàng</th>
                  <th className="px-4 py-4 text-left font-semibold">Danh mục</th>
                  <th className="px-4 py-4 text-left font-semibold text-right">Giá vốn</th>
                  <th className="px-4 py-4 text-left font-semibold text-right">Giá bán</th>
                  <th className="px-4 py-4 text-left font-semibold text-center">Tồn kho</th>
                  <th className="px-4 py-4 text-center font-semibold">Thao tác</th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-b border-slate-100 bg-slate-50/60 font-semibold text-slate-900">
                  <td className="px-4 py-4 font-bold text-blue-600">TỔNG CỘNG</td>
                  <td className="px-4 py-4" />
                  <td className="px-4 py-4" />
                  <td className="px-4 py-4" />
                  <td className="px-4 py-4" />
                  <td className="px-4 py-4 text-center text-blue-700 text-lg">{totalStock}</td>
                  <td className="px-4 py-4" />
                </tr>

                {loading ? (
                  <tr><td colSpan={7} className="text-center py-10 text-slate-400 italic">Đang tải dữ liệu kho...</td></tr>
                ) : sortedProducts.map((product: any) => {
                  const pId = product.id || product.ID;
                  const pCode = product.code || product.Code || product.sku || product.SKU || '---';
                  const pName = product.name || product.Name || '---';
                  const catName = product.category_name || product.CategoryName || (product.Category && (product.Category.name || product.Category.Name)) || '---';
                  const pPrice = product.price || product.Price || 0;
                  const pCost = product.cost || product.Cost || 0;
                  const pStock = product.current_stock ?? product.CurrentStock ?? product.stock ?? product.Inventory?.current_stock ?? product.Inventory?.CurrentStock ?? 0;
                  const isLowStock = pStock <= 5;

                  return (
                    <tr key={pId} className={`border-b border-slate-100 transition-colors hover:bg-slate-50 ${isLowStock ? 'bg-red-50/30' : ''}`}>
                      <td className="px-4 py-4 font-medium text-slate-900">
                        {pCode}
                        {isLowStock && <span className="ml-2 inline-block rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-700 animate-pulse">Cần nhập</span>}
                      </td>
                      <td className="max-w-[250px] px-4 py-4 text-slate-900 truncate font-medium">{pName}</td>
                      <td className="px-4 py-4 text-slate-600"><span className="px-2 py-1 bg-gray-100 rounded-lg text-xs">{catName}</span></td>
                      <td className="px-4 py-4 text-slate-600 text-right">{pCost.toLocaleString('vi-VN')} đ</td>
                      <td className="px-4 py-4 text-slate-900 font-semibold text-right">{pPrice.toLocaleString('vi-VN')} đ</td>
                      <td className="px-4 py-4 text-center"><span className={`inline-block min-w-[2rem] rounded-full px-2 py-0.5 text-center text-sm font-bold ${isLowStock ? 'bg-red-100 text-red-700' : 'text-slate-900'}`}>{pStock}</span></td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button type="button" onClick={() => openImportModal(pId)} className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 shadow-sm transition hover:bg-blue-100 active:scale-95">
                            <ArrowDownCircle className="h-4 w-4" /> Nhập hàng
                          </button>
                          <button type="button" onClick={() => openReturnModal(safePurchaseOrders[0])} className="inline-flex items-center gap-1.5 rounded-xl border border-orange-200 bg-orange-50 px-3 py-2 text-xs font-bold text-orange-700 shadow-sm transition hover:bg-orange-100 active:scale-95">
                            <ArrowUpCircle className="h-4 w-4" /> Trả hàng
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {!loading && sortedProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
              <PackageSearch className="h-16 w-16 text-slate-200" />
              <p className="mt-4 text-lg font-medium">Không tìm thấy mặt hàng nào trong kho</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}