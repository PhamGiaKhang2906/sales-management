import { useState, useEffect, useCallback } from 'react';
import warehouseService, { DashboardResponse, PurchaseOrderCreatePayload } from '@/services/warehouseService';

export function useWarehouse() {
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [profile, setProfile] = useState<any | null>(null);
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

  const fetchProducts = useCallback(async (params?: any) => {
    setLoading(true);
    try {
      const res = await warehouseService.getProducts(params);
      setProducts(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSuppliers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await warehouseService.getSuppliers();
      setSuppliers(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const res = await warehouseService.getProfile();
      setProfile(res || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDashboard(); fetchPurchaseOrders(); fetchProducts(); fetchSuppliers(); fetchProfile(); }, [fetchDashboard, fetchPurchaseOrders, fetchProducts, fetchSuppliers, fetchProfile]);

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

  return { dashboard, purchaseOrders, products, suppliers, profile, loading, refresh: { dashboard: fetchDashboard, purchaseOrders: fetchPurchaseOrders, products: fetchProducts, suppliers: fetchSuppliers, profile: fetchProfile }, createPurchaseOrder, returnPurchaseOrder };
}
