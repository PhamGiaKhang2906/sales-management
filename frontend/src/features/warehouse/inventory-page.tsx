"use client";

import { useState } from 'react';
import {
  ChevronDown,
  Filter,
  Layers3,
  PackageSearch,
  Search,
  Store,
  ArrowDownCircle,
  ArrowUpCircle,
} from 'lucide-react';
import { useProducts, useSuppliers } from '@/hooks/useOwner';
import { useWarehouse } from '@/hooks/useWarehouse';

export function InventoryPage() {
  // State tìm kiếm
  const [searchText, setSearchText] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');

  // Lấy dữ liệu từ hook
  const { 
    products, 
    categories, 
    loading: productsLoading, 
    refresh 
  } = useProducts({ search: appliedSearch });

  const { suppliers } = useSuppliers();
  const { dashboard } = useWarehouse();

  // State bộ lọc
  const [groupSearchText, setGroupSearchText] = useState('');
  const [stockFilter, setStockFilter] = useState('Tất cả');
  const [supplierFilter, setSupplierFilter] = useState<number | 'Tất cả'>('Tất cả'); 
  const [groupFilter, setGroupFilter] = useState<number | 'Tất cả'>('Tất cả');
  const [isGroupDropdownOpen, setIsGroupDropdownOpen] = useState(false);

  // Xử lý tìm kiếm
  const handleSearchClick = async () => {
    setAppliedSearch(searchText);
    await refresh();
  };

  // 1. Lọc dữ liệu theo các điều kiện tìm kiếm/bộ lọc
  const safeCategories = Array.isArray(categories) ? categories : [];
  const filteredGroups = safeCategories.filter((category: any) => {
    const catName = category.name || category.Name || '';
    return catName.toLowerCase().includes(groupSearchText.toLowerCase());
  });

  const safeProducts = Array.isArray(products) ? products : [];
  const filteredProducts = safeProducts.filter((product: any) => {
    const searchLower = appliedSearch.toLowerCase();
    const pCode = product.code || product.Code || product.sku || product.SKU || '';
    const pName = product.name || product.Name || '';
    const matchesSearch = pCode.toLowerCase().includes(searchLower) || pName.toLowerCase().includes(searchLower);

    const catId = product.category_id || product.CategoryID || product.Category?.id || product.Category?.ID || 0;
    const matchesGroup = groupFilter === 'Tất cả' || catId === groupFilter;
    
    const supId = product.supplier_id || product.SupplierID || product.Supplier?.id || product.Supplier?.ID || 0;
    const matchesSupplier = supplierFilter === 'Tất cả' || supId === supplierFilter;

    const currentStock = product.stock ?? product.Inventory?.current_stock ?? product.Inventory?.CurrentStock ?? 0;
    const matchesStock = stockFilter === 'Tất cả' || (stockFilter === 'Còn hàng' ? currentStock > 0 : currentStock === 0);
    
    return matchesSearch && matchesGroup && matchesStock && matchesSupplier;
  });

  // 2. THAY ĐỔI QUAN TRỌNG: Sắp xếp sản phẩm có số lượng tồn kho THẤP LÊN TRƯỚC
  const sortedProducts = [...filteredProducts].sort((a: any, b: any) => {
    const stockA = a.stock ?? a.Inventory?.current_stock ?? a.Inventory?.CurrentStock ?? 0;
    const stockB = b.stock ?? b.Inventory?.current_stock ?? b.Inventory?.CurrentStock ?? 0;
    return stockA - stockB; // Số lượng nhỏ xếp trước, lớn xếp sau
  });

  // Tính tổng tồn kho của các mặt hàng đang hiển thị
  const totalStock = filteredProducts.reduce((acc, p: any) => 
    acc + (p.stock ?? p.Inventory?.current_stock ?? p.Inventory?.CurrentStock ?? 0), 0
  );

  return (
    <div className="min-h-full bg-slate-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white px-4 py-3 shadow-sm sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
              <Store className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Kho hàng</h2>
              <p className="text-sm text-slate-500">Ưu tiên hiển thị sản phẩm sắp hết hàng lên đầu danh sách</p>
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

      <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-5 lg:p-5">
        {/* Sidebar Bộ lọc */}
        <aside className="sticky top-4 h-fit rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold text-slate-900">
              <Layers3 className="h-5 w-5 text-blue-600" />
              Bộ lọc kho
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs text-slate-500">Tổng tồn hiển thị</div>
                <div className="font-semibold text-slate-900">{totalStock}</div>
              </div>
              <button
                type="button"
                onClick={handleSearchClick}
                className="rounded-lg bg-slate-800 px-4 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-900"
              >
                Lọc kho
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {/* Nhóm hàng */}
            <div>
              <div className="mb-2 text-sm font-semibold text-slate-700">Nhóm hàng</div>
              <div className="relative">
                <input
                  value={groupSearchText}
                  onChange={(e) => setGroupSearchText(e.target.value)}
                  onFocus={() => setIsGroupDropdownOpen(true)}
                  onBlur={() => setTimeout(() => setIsGroupDropdownOpen(false), 200)}
                  placeholder={groupFilter === 'Tất cả' ? "Chọn nhóm hàng" : (safeCategories.find((c:any) => (c.id || c.ID) === groupFilter) as any)?.name || "Chọn nhóm hàng"}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 pr-10 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
                <ChevronDown className={`pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-transform ${isGroupDropdownOpen ? 'rotate-180' : ''}`} />
                
                {isGroupDropdownOpen && (
                  <div className="absolute left-0 top-full z-10 mt-1 w-full max-h-40 overflow-y-auto rounded-2xl border border-slate-100 bg-white p-2 shadow-lg">
                    <button
                      type="button"
                      onMouseDown={() => { setGroupFilter('Tất cả'); setGroupSearchText(''); setIsGroupDropdownOpen(false); }}
                      className={`mb-1 w-full rounded-xl px-3 py-2 text-left text-sm ${groupFilter === 'Tất cả' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'}`}
                    >
                      Tất cả
                    </button>
                    {filteredGroups.map((group: any) => {
                      const gId = group.id || group.ID;
                      const gName = group.name || group.Name;
                      return (
                        <button
                          key={gId}
                          type="button"
                          onMouseDown={() => { setGroupFilter(gId); setGroupSearchText(''); setIsGroupDropdownOpen(false); }}
                          className={`mb-1 w-full rounded-xl px-3 py-2 text-left text-sm ${groupFilter === gId ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'}`}
                        >
                          {gName}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Trạng thái tồn */}
            <div>
              <div className="mb-2 text-sm font-semibold text-slate-700">Trạng thái tồn</div>
              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 bg-white appearance-none"
              >
                <option>Tất cả</option>
                <option>Còn hàng</option>
                <option>Hết hàng</option>
              </select>
            </div>

            {/* Nhà cung cấp */}
            <div>
              <div className="mb-2 text-sm font-semibold text-slate-700">Nhà cung cấp</div>
              <select
                value={supplierFilter}
                onChange={(e) => setSupplierFilter(e.target.value === 'Tất cả' ? 'Tất cả' : Number(e.target.value))}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 bg-white appearance-none"
              >
                <option value="Tất cả">Tất cả</option>
                {(suppliers || []).map((sup: any) => (
                  <option key={sup.id || sup.ID} value={sup.id || sup.ID}>{sup.name || sup.Name}</option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => {
                setGroupFilter('Tất cả');
                setStockFilter('Tất cả');
                setSupplierFilter('Tất cả');
                setSearchText('');
                setGroupSearchText('');
                setAppliedSearch('');
              }}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Xóa bộ lọc
            </button>
          </div>
        </aside>

        {/* Danh sách hàng hóa trong kho */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] border-collapse text-sm">
              <thead>
                <tr className="bg-sky-50/80 text-slate-700">
                  <th className="px-4 py-4 text-left font-semibold">Mã hàng</th>
                  <th className="px-4 py-4 text-left font-semibold">Tên hàng</th>
                  <th className="px-4 py-4 text-left font-semibold">Danh mục</th>
                  <th className="px-4 py-4 text-left font-semibold">Giá vốn</th>
                  <th className="px-4 py-4 text-left font-semibold">Giá bán</th>
                  <th className="px-4 py-4 text-left font-semibold">Tồn kho</th>
                  <th className="px-4 py-4 text-center font-semibold">Thao tác</th>
                </tr>
              </thead>

              <tbody>
                {/* Dòng tổng cộng */}
                <tr className="border-b border-slate-100 bg-slate-50/60 font-semibold text-slate-900">
                  <td className="px-4 py-4 font-bold text-blue-600">TỔNG CỘNG</td>
                  <td className="px-4 py-4" />
                  <td className="px-4 py-4" />
                  <td className="px-4 py-4" />
                  <td className="px-4 py-4" />
                  <td className="px-4 py-4 text-center text-blue-700 text-lg">{totalStock}</td>
                  <td className="px-4 py-4" />
                </tr>

                {productsLoading ? (
                  <tr><td colSpan={7} className="text-center py-10 text-slate-400 italic">Đang tải dữ liệu kho...</td></tr>
                ) : sortedProducts.map((product: any) => {
                  const pId = product.id || product.ID;
                  const pCode = product.code || product.Code || product.sku || product.SKU || '---';
                  const pName = product.name || product.Name;
                  const catName = product.category_name || product.CategoryName || (product.Category && (product.Category.name || product.Category.Name)) || '---';
                  const pPrice = product.price || product.Price || 0;
                  const pCost = product.cost || product.Cost || 0;
                  const pStock = product.stock ?? product.Inventory?.current_stock ?? product.Inventory?.CurrentStock ?? 0;

                  // Đánh dấu các sản phẩm cần ưu tiên nhập (ví dụ dưới 5 sản phẩm)
                  const isLowStock = pStock <= 5;

                  return (
                    <tr key={pId} className={`border-b border-slate-100 transition-colors hover:bg-slate-50 ${isLowStock ? 'bg-red-50/30' : ''}`}>
                      <td className="px-4 py-4 font-medium text-slate-900">
                        {pCode}
                        {isLowStock && (
                          <span className="ml-2 inline-block rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-700 animate-pulse">
                            Cần nhập
                          </span>
                        )}
                      </td>
                      <td className="max-w-[250px] px-4 py-4 text-slate-900 truncate font-medium">{pName}</td>
                      <td className="px-4 py-4 text-slate-600">
                        <span className="px-2 py-1 bg-gray-100 rounded-lg text-xs">{catName}</span>
                      </td>
                      <td className="px-4 py-4 text-slate-600 text-right">{pCost.toLocaleString('vi-VN')} đ</td>
                      <td className="px-4 py-4 text-slate-900 font-semibold text-right">{pPrice.toLocaleString('vi-VN')} đ</td>
                      
                      {/* Cột Tồn kho nổi bật số lượng thấp */}
                      <td className="px-4 py-4 text-center">
                        <span className={`inline-block min-w-[2rem] rounded-full px-2 py-0.5 text-center text-sm font-bold ${isLowStock ? 'bg-red-100 text-red-700' : 'text-slate-900'}`}>
                          {pStock}
                        </span>
                      </td>

                      {/* Cột Thao tác chứa hai nút Nhập hàng và Trả hàng */}
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            type="button"
                            className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 shadow-sm transition hover:bg-blue-100 active:scale-95"
                            title="Nhập thêm hàng hóa vào kho"
                          >
                            <ArrowDownCircle className="h-4 w-4" />
                            Nhập hàng
                          </button>
                          <button 
                            type="button"
                            className="inline-flex items-center gap-1.5 rounded-xl border border-orange-200 bg-orange-50 px-3 py-2 text-xs font-bold text-orange-700 shadow-sm transition hover:bg-orange-100 active:scale-95"
                            title="Xuất trả hàng cho nhà cung cấp"
                          >
                            <ArrowUpCircle className="h-4 w-4" />
                            Trả hàng
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {!productsLoading && sortedProducts.length === 0 && (
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