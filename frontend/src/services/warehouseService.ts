import api from './api';

export interface PurchaseOrderItemPayload {
  product_id: number;
  quantity: number;
  import_price: number;
}

export interface PurchaseOrderCreatePayload {
  supplier_id: number;
  store_id?: number;
  tax?: number;
  items: PurchaseOrderItemPayload[];
}

export interface DashboardResponse {
  importOrdersToday: number;
  importedProductsToday: number;
  totalImportAmount: number;
  lowStockAlerts: number;
}

export interface SimpleListItem {
  id?: number;
  ID?: number;
  name?: string;
  Name?: string;
  code?: string;
  Code?: string;
  sku?: string;
  SKU?: string;
  supplier_id?: number;
  SupplierID?: number;
  category_id?: number;
  CategoryID?: number;
  stock?: number;
  Inventory?: any;
}

const unwrap = (res: any) => res?.data?.data ?? res?.data ?? res;

const warehouseService = {
  getDashboard: async (): Promise<DashboardResponse> => unwrap(await api.get('/warehouse/dashboard')),
  getProducts: async (params?: any): Promise<SimpleListItem[]> => {
    const res = unwrap(await api.get('/warehouse/products', { params }));
    return res?.products || res?.Products || res || [];
  },
  getSuppliers: async (): Promise<SimpleListItem[]> => {
    const res = unwrap(await api.get('/warehouse/suppliers'));
    return res?.suppliers || res?.Suppliers || res || [];
  },
  getProfile: async () => unwrap(await api.get('/warehouse/profile')),
  getPurchaseOrders: async (params?: any) => unwrap(await api.get('/warehouse/purchase-orders', { params })),
  getPurchaseOrder: async (id: number) => unwrap(await api.get(`/warehouse/purchase-orders/${id}`)),
  createPurchaseOrder: async (data: PurchaseOrderCreatePayload) => unwrap(await api.post('/warehouse/purchase-orders', data)),
  returnPurchaseOrder: async (id: number) => unwrap(await api.patch(`/warehouse/purchase-orders/${id}/return`)),
}

export default warehouseService;
