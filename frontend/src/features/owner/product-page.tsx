"use client";

import { useState } from 'react';
import {
  ChevronDown,
  Filter,
  Layers3,
  PackageSearch,
  Plus,
  Search,
  Store,
} from 'lucide-react';
import { Modal } from '../../components/layout/Modal';
import { useProducts, useSuppliers } from '@/hooks/useOwner'; 

export function ProductsPage() {
  // 1. TÁCH STATE TÌM KIẾM ĐỂ KHÔNG TỰ ĐỘNG LỌC KHI ĐANG GÕ
  const [searchText, setSearchText] = useState(''); // Lưu chữ đang gõ
  const [appliedSearch, setAppliedSearch] = useState(''); // Lưu chữ khi đã bấm nút "Tìm kiếm" để gọi API

  const { 
    products, 
    categories, 
    loading: productsLoading, 
    createProduct, 
    updateProduct, 
    removeProduct, 
    createCategory, 
    refresh 
  } = useProducts({ search: appliedSearch }); // Truyền từ khóa tìm kiếm vào để fetch API

  const { suppliers } = useSuppliers();

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isGroupDropdownOpen, setIsGroupDropdownOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  
  // State bộ lọc
  const [groupSearchText, setGroupSearchText] = useState('');
  const [stockFilter, setStockFilter] = useState('Tất cả');
  const [supplierFilter, setSupplierFilter] = useState<number | 'Tất cả'>('Tất cả'); 
  const [groupFilter, setGroupFilter] = useState<number | 'Tất cả'>('Tất cả');
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupParent, setNewGroupParent] = useState('Tất cả'); 

  // State Form
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    price: 0,
    cost: 0,
    stock: 0,
    category_id: 0,
    supplier_id: 0, 
  });

  // HÀM HỖ TRỢ LẤY TỒN KHO BAO QUÁT MỌI TRƯỜNG HỢP TỪ BACKEND
  const getStock = (p: any) => {
    return Number(p.stock ?? p.current_stock ?? p.CurrentStock ?? p.Inventory?.current_stock ?? p.Inventory?.CurrentStock ?? 0);
  };

  // HÀM CHỐT TÌM KIẾM VÀ GỌI LẠI API
  const handleSearchClick = async () => {
    setAppliedSearch(searchText);
    await refresh(); // Ép fetch lại API ngay lập tức
  };

  // Lọc Danh mục an toàn
  const safeCategories = Array.isArray(categories) ? categories : [];
  const filteredGroups = safeCategories.filter((category: any) => {
    const catName = category.name || category.Name || '';
    return catName.toLowerCase().includes(groupSearchText.toLowerCase());
  });

  // Lọc Sản phẩm
  const safeProducts = Array.isArray(products) ? products : [];
  const filteredProducts = safeProducts.filter((product: any) => {
    // Chỉ lọc theo appliedSearch (chữ đã chốt khi bấm nút)
    const searchLower = appliedSearch.toLowerCase();
    const pCode = product.code || product.Code || product.sku || product.SKU || '';
    const pName = product.name || product.Name || '';
    const matchesSearch = pCode.toLowerCase().includes(searchLower) || pName.toLowerCase().includes(searchLower);

    const catId = product.category_id || product.CategoryID || product.Category?.id || product.Category?.ID || 0;
    const matchesGroup = groupFilter === 'Tất cả' || catId === groupFilter;
    
    const supId = product.supplier_id || product.SupplierID || product.Supplier?.id || product.Supplier?.ID || 0;
    const matchesSupplier = supplierFilter === 'Tất cả' || supId === supplierFilter;

    // SỬ DỤNG HÀM GETSTOCK ĐỂ LẤY SỐ LƯỢNG CHÍNH XÁC
    const currentStock = getStock(product);
    const matchesStock = stockFilter === 'Tất cả' || (stockFilter === 'Còn hàng' ? currentStock > 0 : currentStock === 0);
    
    return matchesSearch && matchesGroup && matchesStock && matchesSupplier;
  });

  // Tính tổng tồn kho bằng hàm getStock
  const totalStock = filteredProducts.reduce((acc, p: any) => acc + getStock(p), 0);

  const handleOpenProductModal = () => {
    setEditingProduct(null);
    setFormData({ 
      code: '', 
      name: '', 
      price: 0, 
      cost: 0, 
      stock: 0, 
      category_id: groupFilter === 'Tất cả' ? 0 : groupFilter, 
      supplier_id: supplierFilter === 'Tất cả' ? 0 : supplierFilter, 
    });
    setIsProductModalOpen(true);
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({ 
      code: product.code || product.Code || product.sku || product.SKU || '',
      name: product.name || product.Name || '',
      price: product.price || product.Price || 0,
      cost: product.cost || product.Cost || 0,
      stock: getStock(product), // CẬP NHẬT: Lấy tồn kho vào ô Sửa
      category_id: product.category_id || product.CategoryID || product.Category?.id || product.Category?.ID || 0,
      supplier_id: product.supplier_id || product.SupplierID || product.Supplier?.id || product.Supplier?.ID || 0,
    });
    setIsProductModalOpen(true);
  };

  const handleDelete = async (product: any) => {
    const pName = product.name || product.Name || 'sản phẩm này';
    const pId = product.id || product.ID;
    if (confirm(`Bạn có chắc muốn xóa sản phẩm "${pName}"?`)) {
      try {
        await removeProduct(pId);
        alert("Đã xóa thành công!");
        await refresh(); 
      } catch (err: any) {
        const errorMsg = err.response?.data?.message || err.message || "Lỗi khi xóa sản phẩm!";
        alert("Lỗi: " + errorMsg);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.category_id === 0) {
      alert("Vui lòng chọn Danh mục cho sản phẩm!");
      return;
    }
    
    try {
      const apiPayload = {
        ...formData,
        Name: formData.name,
        Code: formData.code,
        Price: formData.price,
        Cost: formData.cost,
        Stock: formData.stock,
        CategoryID: formData.category_id,
        SupplierID: formData.supplier_id,
        Unit: formData.cost.toString(), // Truyền kèm phòng trường hợp Backend vẫn cần field này
      };

      if (editingProduct) {
        const pId = editingProduct.id || (editingProduct as any).ID;
        await updateProduct(pId, apiPayload as any);
        alert("Cập nhật sản phẩm thành công!");
      } else {
        await createProduct(apiPayload as any);
        alert("Tạo sản phẩm mới thành công!");
      }
      setIsProductModalOpen(false);
      await refresh();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || "Lỗi khi lưu dữ liệu sản phẩm!";
      alert("Lỗi Backend: " + errorMsg);
    }
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCategory({ name: newGroupName, Name: newGroupName });
      setNewGroupName('');
      setNewGroupParent('Tất cả');
      setIsGroupModalOpen(false);
      alert("Tạo danh mục mới thành công!");
      await refresh(); 
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || "Lỗi khi tạo danh mục!";
      alert("Lỗi Backend: " + errorMsg);
    }
  };

  return (
    <div className="min-h-full bg-slate-50">
      <div className="border-b border-slate-200 bg-white px-4 py-3 shadow-sm sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-slate-100 p-3 text-slate-700">
              <Store className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Hàng hóa</h2>
              <p className="text-sm text-slate-500">Quản lý mặt hàng, tìm kiếm và lọc theo nhóm hàng</p>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-3 xl:max-w-4xl xl:flex-row xl:items-center xl:justify-end">
            
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchClick()} // Tìm kiếm nhanh khi bấm Enter
                placeholder="Theo mã, tên hàng..."
                className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-12 pr-12 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl p-2 text-slate-500 hover:bg-slate-100" type="button" aria-label="Bộ lọc nhanh">
                <Filter className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsGroupModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-2xl border border-blue-300 bg-white px-4 py-3 font-semibold text-blue-600 shadow-sm transition hover:bg-blue-50 whitespace-nowrap"
              >
                <Plus className="h-5 w-5" />
                Tạo danh mục
              </button>
              <button
                type="button"
                onClick={handleOpenProductModal}
                className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 whitespace-nowrap"
              >
                <Plus className="h-5 w-5" />
                Tạo mặt hàng
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-5 lg:p-5">
        <aside className="sticky top-4 h-fit rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold text-slate-900">
              <Layers3 className="h-5 w-5 text-blue-600" />
              Bộ lọc
            </div>
            <button
              type="button"
              onClick={handleSearchClick}
              className="rounded-lg bg-slate-800 px-4 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-900"
            >
              Tìm kiếm
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <div className="mb-2 text-sm font-semibold text-slate-700">Chọn nhóm hàng</div>
              <div className="relative">
                <input
                  value={groupSearchText}
                  onChange={(e) => setGroupSearchText(e.target.value)}
                  onFocus={() => setIsGroupDropdownOpen(true)}
                  onBlur={() => setTimeout(() => setIsGroupDropdownOpen(false), 200)}
                  placeholder={groupFilter === 'Tất cả' ? "Chọn nhóm hàng" : (safeCategories.find((c:any) => (c.id || c.ID) === groupFilter) as any)?.name || (safeCategories.find((c:any) => (c.id || c.ID) === groupFilter) as any)?.Name || "Chọn nhóm hàng"}
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

            <div>
              <div className="mb-2 text-sm font-semibold text-slate-700">Tồn kho</div>
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

            <div>
              <div className="mb-2 text-sm font-semibold text-slate-700">Nhà cung cấp</div>
              <select
                value={supplierFilter}
                onChange={(e) => setSupplierFilter(e.target.value === 'Tất cả' ? 'Tất cả' : Number(e.target.value))}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 bg-white appearance-none"
              >
                <option value="Tất cả">Tất cả</option>
                {(suppliers || []).map((sup: any) => {
                  const sId = sup.id || sup.ID;
                  const sName = sup.name || sup.Name;
                  return (
                    <option key={sId} value={sId}>{sName}</option>
                  );
                })}
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
                setAppliedSearch(''); // Dọn dẹp cả API search
              }}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
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
                  <th className="px-4 py-4 text-left font-semibold">Thao tác</th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-b border-slate-100 bg-slate-50/60 font-semibold text-slate-900">
                  <td className="px-4 py-4" />
                  <td className="px-4 py-4" />
                  <td className="px-4 py-4" />
                  <td className="px-4 py-4" />
                  <td className="px-4 py-4" />
                  <td className="px-4 py-4 text-center text-blue-600">{totalStock}</td>
                  <td className="px-4 py-4" />
                </tr>

                {productsLoading ? (
                  <tr><td colSpan={7} className="text-center py-10 text-slate-400">Đang tải dữ liệu...</td></tr>
                ) : filteredProducts.map((product: any) => {
                  const pId = product.id || product.ID;
                  const pCode = product.code || product.Code || product.sku || product.SKU || '---';
                  const pName = product.name || product.Name;
                  const catName = product.category_name || product.CategoryName || (product.Category && (product.Category.name || product.Category.Name)) || '---';
                  const pPrice = product.price || product.Price || 0;
                  const pCost = product.cost || product.Cost || 0;
                  const pStock = getStock(product); // CẬP NHẬT: Dùng hàm getStock

                  return (
                    <tr key={pId} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-4 font-medium text-slate-900">{pCode}</td>
                      <td className="max-w-[250px] px-4 py-4 text-slate-900 truncate font-medium">{pName}</td>
                      <td className="px-4 py-4 text-slate-600">
                        <span className="px-2 py-1 bg-gray-100 rounded text-xs">{catName}</span>
                      </td>
                      <td className="px-4 py-4 text-slate-600 text-right">{pCost.toLocaleString('vi-VN')} đ</td>
                      <td className="px-4 py-4 text-slate-900 font-semibold text-right">{pPrice.toLocaleString('vi-VN')} đ</td>
                      <td className="px-4 py-4 text-center font-bold text-slate-900">{pStock}</td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit(product)} className="rounded-lg border border-emerald-200 px-3 py-1.5 font-semibold text-emerald-700 hover:bg-emerald-50">Sửa</button>
                          <button onClick={() => handleDelete(product)} className="rounded-lg border border-rose-200 px-3 py-1.5 font-semibold text-rose-700 hover:bg-rose-50">Xóa</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {!productsLoading && filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-slate-500">
              <PackageSearch className="h-12 w-12 text-slate-300" />
              <p className="mt-4 font-medium">Không có mặt hàng phù hợp</p>
            </div>
          )}
        </section>
      </div>

      {/* Modal Nhóm hàng */}
      <Modal isOpen={isGroupModalOpen} onClose={() => setIsGroupModalOpen(false)} title="Tạo danh mục mới" size="sm">
        <form onSubmit={handleCreateGroup} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Tên danh mục <span className="text-red-500">*</span></label>
            <input value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" placeholder="VD: Đồ uống" required />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setIsGroupModalOpen(false)} className="rounded-2xl border border-slate-300 px-5 py-2.5 font-semibold text-slate-700 hover:bg-slate-50">Bỏ qua</button>
            <button type="submit" className="rounded-2xl bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700">Lưu</button>
          </div>
        </form>
      </Modal>

      {/* Modal Sản phẩm */}
      <Modal isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)} title={editingProduct ? 'Chỉnh sửa mặt hàng' : 'Tạo hàng hóa'} size="xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-4">
              
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Mã sản phẩm</label>
                <input type="text" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" placeholder="Nếu để trống hệ thống sẽ tự tạo" />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Tên sản phẩm <span className="text-red-500">*</span></label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" placeholder="Bắt buộc nhập" required />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="block text-sm font-medium text-slate-700">Danh mục <span className="text-red-500">*</span></label>
                    <button type="button" onClick={() => setIsGroupModalOpen(true)} className="text-sm font-semibold text-sky-600 hover:text-sky-700">Tạo mới</button>
                  </div>
                  <select value={formData.category_id} onChange={(e) => setFormData({ ...formData, category_id: Number(e.target.value) })} className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 bg-white" required>
                    <option value={0}>Chọn danh mục</option>
                    {safeCategories.map((group: any) => (
                      <option key={group.id || group.ID} value={group.id || group.ID}>{group.name || group.Name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Nhà cung cấp (Tùy chọn)</label>
                  <select value={formData.supplier_id} onChange={(e) => setFormData({ ...formData, supplier_id: Number(e.target.value) })} className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 bg-white mt-[26px]">
                    <option value={0}>-- Không chọn --</option>
                    {(suppliers || []).map((sup: any) => (
                      <option key={sup.id || sup.ID} value={sup.id || sup.ID}>{sup.name || sup.Name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <h4 className="mb-4 font-semibold text-slate-900">Giá vốn, giá bán</h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Giá vốn</label>
                    <input type="number" min="0" value={formData.cost} onChange={(e) => setFormData({ ...formData, cost: Number(e.target.value) })} className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-right outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" required />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Giá bán</label>
                    <input type="number" min="0" value={formData.price} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-right outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" required />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <h4 className="mb-2 font-semibold text-slate-900">Tồn kho</h4>
                <p className="mb-4 text-sm text-slate-600">Quản lý số lượng tồn kho ban đầu khi tạo sản phẩm mới.</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Số lượng tồn</label>
                    <input type="number" min="0" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })} disabled={!!editingProduct} className={`w-full rounded-2xl border px-4 py-3 text-right outline-none transition ${editingProduct ? 'bg-gray-200 border-gray-300 text-gray-500' : 'bg-white border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'}`} required={!editingProduct} />
                    {editingProduct && <p className="text-xs text-orange-500 mt-1">*Không thể sửa tồn kho tại đây</p>}
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-end">
            <button type="button" onClick={() => setIsProductModalOpen(false)} className="rounded-2xl border border-slate-300 px-5 py-2.5 font-semibold text-slate-700 hover:bg-slate-50">Hủy</button>
            <button type="submit" className="rounded-2xl bg-blue-600 px-6 py-2.5 font-semibold text-white hover:bg-blue-700">{editingProduct ? 'Cập nhật' : 'Thêm mới'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}