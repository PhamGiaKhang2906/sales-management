"use client";

import { useState } from 'react';
import {
  CalendarDays,
  ChevronDown,
  Filter,
  ImagePlus,
  Layers3,
  PackageSearch,
  Plus,
  Search,
  Star,
  Store,
} from 'lucide-react';
import { Modal } from '../../components/layout/Modal';

interface Product {
  id: number;
  code: string;
  name: string;
  price: number;
  cost: number;
  stock: number;
  orders: number;
  createdAt: string;
  image?: string;
  group: string;
  supplier: string;
}

interface ProductGroup {
  id: number;
  name: string;
  parentGroup: string;
}

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      code: 'SP00025',
      name: 'Hộp phở bò phố cổ',
      price: 10000,
      cost: 8000,
      stock: 0,
      orders: 0,
      createdAt: '30/05/2026 16:58',
      group: 'Thực phẩm',
      supplier: 'NCC A',
      image: '🍜',
    },
    {
      id: 2,
      code: 'SP00024',
      name: 'Mì bò hầm cải chua Reeva hộp 100g',
      price: 15000,
      cost: 14000,
      stock: 0,
      orders: 0,
      createdAt: '30/05/2026 16:58',
      group: 'Thực phẩm',
      supplier: 'NCC A',
      image: '🍜',
    },
    {
      id: 3,
      code: 'SP00023',
      name: 'Thịt bò khô Nhật Bảo',
      price: 45000,
      cost: 44000,
      stock: 0,
      orders: 0,
      createdAt: '30/05/2026 16:58',
      group: 'Đặc sản',
      supplier: 'NCC B',
      image: '🥩',
    },
  ]);

  const [groups, setGroups] = useState<ProductGroup[]>([
    { id: 1, name: 'Thực phẩm', parentGroup: 'Tất cả' },
    { id: 2, name: 'Đặc sản', parentGroup: 'Tất cả' },
    { id: 3, name: 'Đồ uống', parentGroup: 'Tất cả' },
  ]);

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchText, setSearchText] = useState('');
  const [groupSearchText, setGroupSearchText] = useState('');
  const [stockFilter, setStockFilter] = useState('Tất cả');
  const [supplierFilter, setSupplierFilter] = useState('Tất cả');
  const [groupFilter, setGroupFilter] = useState('Tất cả');
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupParent, setNewGroupParent] = useState('Tất cả');
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    price: 0,
    stock: 0,
    cost: 0,
    group: '',
    supplier: '',
    image: '',
  });

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(groupSearchText.toLowerCase())
  );

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.code.toLowerCase().includes(searchText.toLowerCase()) ||
      product.name.toLowerCase().includes(searchText.toLowerCase()) ||
      product.group.toLowerCase().includes(searchText.toLowerCase()) ||
      product.supplier.toLowerCase().includes(searchText.toLowerCase());

    const matchesGroup = groupFilter === 'Tất cả' || product.group === groupFilter;
    const matchesStock = stockFilter === 'Tất cả' || (stockFilter === 'Còn hàng' ? product.stock > 0 : product.stock === 0);
    const matchesSupplier = supplierFilter === 'Tất cả' || product.supplier === supplierFilter;

    return matchesSearch && matchesGroup && matchesStock && matchesSupplier;
  });

  const handleOpenProductModal = () => {
    setEditingProduct(null);
    setFormData({ code: '', name: '', price: 0, stock: 0, cost: 0, group: groupFilter === 'Tất cả' ? '' : groupFilter, supplier: '', image: '' });
    setIsProductModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({ ...product, image: product.image ?? '' });
    setIsProductModalOpen(true);
  };

  const handleDelete = (product: Product) => {
    if (confirm(`Bạn có chắc muốn xóa sản phẩm "${product.name}"?`)) {
      setProducts(products.filter((p) => p.id !== product.id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      setProducts(products.map((p) => (p.id === editingProduct.id ? { ...formData, id: p.id, orders: p.orders, createdAt: p.createdAt, image: formData.image || p.image } : p)));
    } else {
      setProducts([
        {
          ...formData,
          id: Date.now(),
          orders: 0,
          createdAt: new Date().toLocaleString('vi-VN', { hour12: false }),
          image: formData.image || '🛍️',
        },
        ...products,
      ]);
    }
    setIsProductModalOpen(false);
  };

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();

    setGroups([
      { id: Date.now(), name: newGroupName, parentGroup: newGroupParent },
      ...groups,
    ]);

    setNewGroupName('');
    setNewGroupParent('Tất cả');
    setIsGroupModalOpen(false);
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
                placeholder="Theo mã, tên hàng"
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
                className="inline-flex items-center gap-2 rounded-2xl border border-blue-300 bg-white px-4 py-3 font-semibold text-blue-600 shadow-sm transition hover:bg-blue-50"
              >
                <Plus className="h-5 w-5" />
                Tạo mới
              </button>
              <button
                type="button"
                onClick={handleOpenProductModal}
                className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700"
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
              Nhóm hàng
            </div>
            <button type="button" onClick={() => setIsGroupModalOpen(true)} className="font-semibold text-blue-600 hover:text-blue-700">
              Tạo mới
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <div className="mb-2 text-sm font-semibold text-slate-700">Chọn nhóm hàng</div>
              <div className="relative">
                <input
                  value={groupSearchText}
                  onChange={(e) => setGroupSearchText(e.target.value)}
                  placeholder="Chọn nhóm hàng"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 pr-10 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
              <div className="mt-2 max-h-40 overflow-y-auto rounded-2xl border border-slate-100 bg-slate-50 p-2">
                <button
                  type="button"
                  onClick={() => setGroupFilter('Tất cả')}
                  className={`mb-1 w-full rounded-xl px-3 py-2 text-left text-sm ${groupFilter === 'Tất cả' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-white'}`}
                >
                  Tất cả
                </button>
                {filteredGroups.map((group) => (
                  <button
                    key={group.id}
                    type="button"
                    onClick={() => setGroupFilter(group.name)}
                    className={`mb-1 w-full rounded-xl px-3 py-2 text-left text-sm ${groupFilter === group.name ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-white'}`}
                  >
                    {group.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2 text-sm font-semibold text-slate-700">Tồn kho</div>
              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
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
                onChange={(e) => setSupplierFilter(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              >
                <option>Tất cả</option>
                <option>NCC A</option>
                <option>NCC B</option>
                <option>NCC C</option>
              </select>
            </div>

            <div>
              <div className="mb-2 text-sm font-semibold text-slate-700">Vị trí</div>
              <input
                placeholder="Chọn vị trí"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                setGroupFilter('Tất cả');
                setStockFilter('Tất cả');
                setSupplierFilter('Tất cả');
                setSearchText('');
                setGroupSearchText('');
              }}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Xóa bộ lọc
            </button>
          </div>
        </aside>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px] border-collapse text-sm">
              <thead>
                <tr className="bg-sky-50/80 text-slate-700">
                  <th className="w-12 px-3 py-4 text-left">
                    <input type="checkbox" className="h-4 w-4 rounded border-slate-300" />
                  </th>
                  <th className="w-12 px-3 py-4 text-left">
                    <Star className="h-5 w-5 text-slate-400" />
                  </th>
                  <th className="px-4 py-4 text-left font-semibold">Hình</th>
                  <th className="px-4 py-4 text-left font-semibold">Mã hàng</th>
                  <th className="px-4 py-4 text-left font-semibold">Tên hàng</th>
                  <th className="px-4 py-4 text-left font-semibold">Giá bán</th>
                  <th className="px-4 py-4 text-left font-semibold">Giá vốn</th>
                  <th className="px-4 py-4 text-left font-semibold">Tồn kho</th>
                  <th className="px-4 py-4 text-left font-semibold">Thời gian tạo</th>
                  <th className="px-4 py-4 text-left font-semibold">Thao tác</th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-b border-slate-100 bg-slate-50/60 font-semibold text-slate-900">
                  <td className="px-3 py-4" />
                  <td className="px-3 py-4" />
                  <td className="px-4 py-4" />
                  <td className="px-4 py-4" />
                  <td className="px-4 py-4" />
                  <td className="px-4 py-4" />
                  <td className="px-4 py-4" />
                  <td className="px-4 py-4 text-center">184</td>
                  <td className="px-4 py-4">---</td>
                </tr>

                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-3 py-4">
                      <input type="checkbox" className="h-4 w-4 rounded border-slate-300" />
                    </td>
                    <td className="px-3 py-4 text-slate-400">
                      <Star className="h-5 w-5" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-amber-100 text-lg">
                        {product.image ?? '🛍️'}
                      </div>
                    </td>
                    <td className="px-4 py-4 font-medium text-slate-900">{product.code}</td>
                    <td className="max-w-[320px] px-4 py-4 text-slate-900">
                      <div className="truncate">{product.name}</div>
                    </td>
                    <td className="px-4 py-4 text-slate-900">{product.price.toLocaleString('vi-VN')}</td>
                    <td className="px-4 py-4 text-slate-900">{product.cost.toLocaleString('vi-VN')}</td>
                    <td className="px-4 py-4 text-center text-slate-900">{product.stock}</td>
                    <td className="px-4 py-4 text-slate-900">{product.createdAt}</td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(product)} className="rounded-lg border border-emerald-200 px-3 py-1.5 font-semibold text-emerald-700 hover:bg-emerald-50">
                          Sửa
                        </button>
                        <button onClick={() => handleDelete(product)} className="rounded-lg border border-rose-200 px-3 py-1.5 font-semibold text-rose-700 hover:bg-rose-50">
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-slate-500">
              <PackageSearch className="h-12 w-12 text-slate-300" />
              <p className="mt-4 font-medium">Không có mặt hàng phù hợp bộ lọc</p>
            </div>
          )}
        </section>
      </div>

      <Modal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        title="Tạo nhóm hàng"
        size="sm"
      >
        <form onSubmit={handleCreateGroup} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Tên nhóm</label>
            <input
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              placeholder="Nhập tên nhóm"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Nhóm cha</label>
            <select
              value={newGroupParent}
              onChange={(e) => setNewGroupParent(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              <option>Tất cả</option>
              {groups.map((group) => (
                <option key={group.id} value={group.name}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsGroupModalOpen(false)}
              className="rounded-2xl border border-slate-300 px-5 py-2.5 font-semibold text-slate-700 hover:bg-slate-50"
            >
              Bỏ qua
            </button>
            <button
              type="submit"
              className="rounded-2xl bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
            >
              Lưu
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        title={editingProduct ? 'Chỉnh sửa mặt hàng' : 'Tạo hàng hóa'}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Mã sản phẩm</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  placeholder="Tự động"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Tên sản phẩm</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  placeholder="Bắt buộc"
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="block text-sm font-medium text-slate-700">Danh mục</label>
                    <button type="button" className="text-sm font-semibold text-sky-600 hover:text-sky-700">
                      Tạo mới
                    </button>
                  </div>
                  <select
                    value={formData.group}
                    onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    required
                  >
                    <option value="">Chọn danh mục</option>
                    {groups.map((group) => (
                      <option key={group.id} value={group.name}>
                        {group.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="block text-sm font-medium text-slate-700">Nhà cung cấp</label>
                    <button type="button" className="text-sm font-semibold text-sky-600 hover:text-sky-700">
                      Tạo mới
                    </button>
                  </div>
                  <input
                    type="text"
                    value={formData.supplier}
                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    placeholder="Chọn nhà cung cấp"
                    required
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="font-semibold text-slate-900">Giá vốn, giá bán</h4>
                  <button type="button" className="text-sm font-semibold text-sky-600 hover:text-sky-700">
                    Thiết lập giá
                  </button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Giá vốn</label>
                    <input
                      type="number"
                      value={formData.cost}
                      onChange={(e) => setFormData({ ...formData, cost: Number(e.target.value) })}
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-right outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Giá bán</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-right outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <h4 className="mb-2 font-semibold text-slate-900">Tồn kho</h4>
                <p className="mb-4 text-sm leading-6 text-slate-600">
                  Quản lý số lượng tồn kho và định mức tồn. Khi tồn kho chạm đến định mức, bạn sẽ nhận được cảnh báo từ hệ thống.
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Số lượng tồn</label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-right outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Định mức tồn thấp nhất</label>
                    <input
                      type="number"
                      value={0}
                      readOnly
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-right outline-none bg-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Ảnh</label>
                <input
                  type="text"
                  value={formData.image ?? ''}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  placeholder="Nhập link hoặc tên ảnh"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-end">
            <button
              type="button"
              onClick={() => setIsProductModalOpen(false)}
              className="rounded-2xl border border-slate-300 px-5 py-2.5 font-semibold text-slate-700 hover:bg-slate-50"
            >
              Hủy
            </button>
            <button
              type="button"
              className="rounded-2xl border border-slate-300 px-5 py-2.5 font-semibold text-slate-700 hover:bg-slate-50"
            >
              Thêm & Tạo thêm mặt hàng mới
            </button>
            <button
              type="submit"
              className="rounded-2xl bg-blue-600 px-6 py-2.5 font-semibold text-white hover:bg-blue-700"
            >
              {editingProduct ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}