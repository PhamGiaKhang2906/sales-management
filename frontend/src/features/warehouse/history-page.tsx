"use client";

import { useEffect, useState } from 'react';
import { ArrowUpCircle, PackageSearch, Trash2 } from 'lucide-react';
import { useWarehouse } from '@/hooks/useWarehouse';

export default function WarehouseHistoryPage() {
  const { purchaseOrders, suppliers, loading, returnPurchaseOrder, refresh } = useWarehouse();
  const safePurchaseOrders = Array.isArray(purchaseOrders) ? purchaseOrders : [];

  const [selected, setSelected] = useState<any | null>(null);

  useEffect(() => {
    if (!selected && safePurchaseOrders.length > 0) setSelected(safePurchaseOrders[0]);
  }, [safePurchaseOrders, selected]);

  return (
    <div className="min-h-full bg-slate-50 p-4">
      <div className="border-b border-slate-200 bg-white px-4 py-3 shadow-sm sm:px-6 lg:px-8 mb-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-green-100 p-3 text-green-700">
            <PackageSearch className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Lịch sử nhập / trả hàng</h2>
            <p className="text-sm text-slate-500">Danh sách phiếu nhập và phiếu trả, có thể xem chi tiết và trả lại phiếu.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="mb-3 text-sm font-semibold text-slate-700">Các phiếu</div>
          <div className="max-h-[64vh] overflow-auto space-y-2">
            {loading && <div className="text-sm text-slate-500">Đang tải...</div>}
            {!loading && safePurchaseOrders.length === 0 && <div className="text-sm text-slate-500">Chưa có phiếu nào.</div>}
            {safePurchaseOrders.map((o: any) => {
              const id = o.id ?? o.ID;
              const supplier = o.supplier_name || o.Supplier || o.SupplierName || '';
              const isSelected = (selected?.id ?? selected?.ID) === id;
              return (
                <button key={id} type="button" onClick={() => setSelected(o)} className={`w-full rounded-xl border px-3 py-3 text-left ${isSelected ? 'border-orange-300 bg-orange-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                  <div className="text-sm font-semibold text-slate-900">#{id} · {supplier}</div>
                  <div className="text-xs text-slate-500">{new Date(o.created_at || o.CreatedAt || Date.now()).toLocaleString('vi-VN')}</div>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="rounded-2xl border border-slate-200 bg-white p-4">
          {!selected ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
              <PackageSearch className="h-16 w-16 text-slate-200" />
              <p className="mt-4 text-lg font-medium">Chọn một phiếu để xem chi tiết</p>
            </div>
          ) : (
            <>
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <div className="text-base font-semibold text-slate-900">Phiếu #{selected.id ?? selected.ID}</div>
                  <div className="text-sm text-slate-500">{selected.supplier_name || selected.Supplier || ''}</div>
                </div>
                <div className="text-sm font-semibold text-orange-700">{selected.status || selected.Status || 'completed'}</div>
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
                    {(selected.items || selected.Items || []).map((it: any, i: number) => (
                      <tr key={i} className="border-t border-slate-100">
                        <td className="px-3 py-2">{it.product_name || it.ProductName || it.product_id || it.ProductID}</td>
                        <td className="px-3 py-2 text-right">{it.quantity || it.Quantity || 0}</td>
                        <td className="px-3 py-2 text-right">{Number(it.import_price || it.ImportPrice || 0).toLocaleString('vi-VN')} đ</td>
                        <td className="px-3 py-2 text-right">{Number(it.subtotal || it.Subtotal || 0).toLocaleString('vi-VN')} đ</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button onClick={async () => { setSelected(null); }} className="rounded-xl border border-slate-200 px-4 py-2 text-slate-700">Đóng</button>
                <button
                  onClick={async () => {
                    const id = selected.id ?? selected.ID;
                    if (!id) return;
                    try {
                      await returnPurchaseOrder(id);
                      await refresh.purchaseOrders();
                      await refresh.products();
                      setSelected(null);
                      alert('Trả hàng thành công');
                    } catch (err: any) {
                      const message = err?.response?.data?.message || err?.message || 'Trả hàng thất bại';
                      alert(message);
                    }
                  }}
                  className="rounded-xl bg-orange-600 px-4 py-2 text-white hover:bg-orange-700"
                >
                  <ArrowUpCircle className="inline-block mr-2" /> Trả toàn bộ
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
