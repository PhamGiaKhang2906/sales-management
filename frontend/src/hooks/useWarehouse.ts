import { useState, useEffect, useCallback } from 'react';
import warehouseService, { DashboardResponse, PurchaseOrderCreatePayload } from '@/services/warehouseService';

export function useWarehouse() {
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const res = await warehouseService.getDashboard();
      setDashboard(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPurchaseOrders = useCallback(async (params?: any) => {
    setLoading(true);
    try {
      const res = await warehouseService.getPurchaseOrders(params);
      setPurchaseOrders(res.orders || res || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDashboard(); fetchPurchaseOrders(); }, [fetchDashboard, fetchPurchaseOrders]);

  const createPurchaseOrder = async (data: PurchaseOrderCreatePayload) => {
    const res = await warehouseService.createPurchaseOrder(data);
    await fetchDashboard();
    await fetchPurchaseOrders();
    return res;
  };

  const returnPurchaseOrder = async (id: number) => {
    const res = await warehouseService.returnPurchaseOrder(id);
    await fetchDashboard();
    await fetchPurchaseOrders();
    return res;
  };

  return { dashboard, purchaseOrders, loading, refresh: { dashboard: fetchDashboard, purchaseOrders: fetchPurchaseOrders }, createPurchaseOrder, returnPurchaseOrder };
}
