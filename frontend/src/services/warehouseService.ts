import api from './api';

export interface PurchaseOrderItemPayload {
  product_id: number;
  quantity: number;
  import_price: number;
}

export interface PurchaseOrderCreatePayload {
  supplier_id: number;
  store_id: number;
  tax?: number;
  items: PurchaseOrderItemPayload[];
}

export interface DashboardResponse {
  importOrdersToday: number;
  importedProductsToday: number;
  totalImportAmount: number;
  lowStockAlerts: number;
}

const unwrap = (res: any) => res?.data?.data ?? res?.data ?? res;

const warehouseService = {
  getDashboard: async (): Promise<DashboardResponse> => unwrap(await api.get('/warehouse/dashboard')),
  getPurchaseOrders: async (params?: any) => unwrap(await api.get('/warehouse/purchase-orders', { params })),
  getPurchaseOrder: async (id: number) => unwrap(await api.get(`/warehouse/purchase-orders/${id}`)),
  createPurchaseOrder: async (data: PurchaseOrderCreatePayload) => unwrap(await api.post('/warehouse/purchase-orders', data)),
  returnPurchaseOrder: async (id: number) => unwrap(await api.patch(`/warehouse/purchase-orders/${id}/return`)),
}

export default warehouseService;
