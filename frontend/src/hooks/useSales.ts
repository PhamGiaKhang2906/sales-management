import { useState, useEffect, useCallback } from 'react';
import salesService from '@/services/salesService';

export function useSales() {
  // Orders
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      const data = await salesService.orders.getAll();
      setOrders(Array.isArray(data) ? data : (data.orders || data.Orders || []));
    } catch (err) {
      console.error(err);
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const createOrder = async (payload: any) => {
    const res = await salesService.orders.create(payload);
    await fetchOrders();
    return res;
  };

  const returnOrder = async (id: number) => {
    const res = await salesService.orders.return(id);
    await fetchOrders();
    await fetchCustomers();
    return res;
  };

  const deleteOrder = async (id: number) => {
    const res = await salesService.orders.delete(id);
    await fetchOrders();
    return res;
  };

  // Stats (derived from orders)
  const [stats, setStats] = useState<{ revenueByMonth: any[]; ordersByMonth: any[] }>({ revenueByMonth: [], ordersByMonth: [] });
  const [statsLoading, setStatsLoading] = useState(false);

  // Customers who purchased
  const [customers, setCustomers] = useState<any[]>([]);
  const [customersLoading, setCustomersLoading] = useState(false);

  const fetchCustomers = useCallback(async () => {
    setCustomersLoading(true);
    try {
      const data = await salesService.customers.getAll();
      setCustomers(Array.isArray(data) ? data : (data.customers || data.customers || []));
    } catch (err) {
      console.error(err);
    } finally {
      setCustomersLoading(false);
    }
  }, []);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const data = await salesService.orders.getAll();
      const ordersList = Array.isArray(data) ? data : (data.orders || data.Orders || []);
      const revenueMap: Record<string, number> = {};
      const ordersCountMap: Record<string, number> = {};
      ordersList.forEach((o: any) => {
        const d = new Date(o.created_at || o.createdAt || o.CreatedAt);
        if (isNaN(d.getTime())) return;
        const key = `T${d.getMonth() + 1}`;
        revenueMap[key] = (revenueMap[key] || 0) + (o.total_amount || o.totalAmount || 0);
        ordersCountMap[key] = (ordersCountMap[key] || 0) + 1;
      });
      const months = Array.from(new Set([...Object.keys(revenueMap), ...Object.keys(ordersCountMap)])).sort();
      const revenueByMonth = months.map(m => ({ month: m, revenue: revenueMap[m] || 0 }));
      const ordersByMonth = months.map(m => ({ month: m, orders: ordersCountMap[m] || 0 }));
      setStats({ revenueByMonth, ordersByMonth });
    } catch (err) {
      console.error(err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  // Product search helper
  const searchProducts = async (q: string) => {
    if (!q) return [];
    const results = await salesService.products.search(q);
    return Array.isArray(results) ? results : (results.products || results.Products || []);
  };

  return {
    // orders
    orders,
    ordersLoading,
    refreshOrders: fetchOrders,
    createOrder,
    deleteOrder,
    // stats
    stats,
    statsLoading,
    refreshStats: fetchStats,
    // products
    searchProducts,
    // customers
    customers,
    customersLoading,
    refreshCustomers: fetchCustomers,
    // return
    returnOrder,
  };
}

export default useSales;
