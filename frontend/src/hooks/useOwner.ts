import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

// ==========================================
// 1. ĐỊNH NGHĨA TẤT CẢ INTERFACES (TYPES)
// ==========================================
export interface Customer { id?: number; name: string; code?: string; phone: string; email?: string; address?: string; totalPurchases?: number; }
export interface CustomerCreatePayload { name: string; code?: string; phone: string; email?: string; address?: string; }
export interface CustomerUpdatePayload { name?: string; code?: string; phone?: string; email?: string; address?: string; }

export interface Employee { id: number; user_id: number; username: string; fullname: string; phone: string; cccd?: string; address?: string; birthday?: string | null; salary_factor: number; work_shift: string; status: string; created_at: string; role_id: number; User?: any; }
export interface EmployeeCreatePayload { fullname: string; username: string; password?: string; phone: string; cccd?: string; address?: string; birthday?: string | null; salary_factor: number; work_shift: string; role_id: number; }
export interface EmployeeUpdatePayload { fullname?: string; phone?: string; cccd?: string; address?: string; birthday?: string | null; salary_factor?: number; work_shift?: string; role_id?: number; }

export interface Supplier { id?: number; name: string; phone: string; email: string; address: string; code?: string; contact?: string; }
export interface SupplierCreatePayload { name: string; phone: string; email: string; address: string; code?: string; contact?: string; }
export interface SupplierUpdatePayload { name?: string; phone?: string; email?: string; address?: string; code?: string; contact?: string; }

export interface Product { id?: number; code: string; name: string; price: number; cost: number; stock: number; category_id?: number; group?: string; supplier?: string; image?: string; Inventory?: any; Category?: any; Supplier?: any; }
export interface ProductCreatePayload { code: string; name: string; price: number; cost: number; stock: number; category_id?: number; group?: string; supplier_id?: number; image?: string; }
export interface ProductUpdatePayload { code?: string; name?: string; price?: number; cost?: number; stock?: number; category_id?: number; group?: string; supplier_id?: number; image?: string; }

export interface Category { id?: number; name: string; Name?: string; }
export interface StoreInfo { id?: number; name: string; taxCode?: string; tax_code?: string; address: string; phone: string; email?: string; website?: string; ownerName?: string; owner_name?: string; businessType?: string; business_type?: string; openingHours?: string; opening_hours?: string; }
export interface Order { id: number; order_code: string; total_amount: number; status: string; created_at: string; Customer?: any; User?: any; OrderItems?: any[]; }

// BỘ TRỊ LỖI CACHE: Luôn gắn thêm thời gian thực vào các request GET để ép lấy dữ liệu mới nhất
const withCacheBuster = (params: any = {}) => ({ ...params, _t: Date.now() });

const extractArray = (response: any) => {
  const data = response?.data?.data || response?.data || response;
  return Array.isArray(data) ? data : [];
};

const extractObject = (response: any) => {
  return response?.data?.data || response?.data || response;
};

// ==========================================
// 2. GỘP TẤT CẢ SERVICES
// ==========================================
export const ownerService = {
  customers: {
    getAll: async () => {
      const res = await api.get('/owner/customers', { params: withCacheBuster() });
      const obj = extractObject(res);
      return obj?.customers || obj?.Customers || [];
    },
    create: async (data: CustomerCreatePayload) => extractObject(await api.post('/owner/customers', data)),
    update: async (id: number, data: CustomerUpdatePayload) => extractObject(await api.put(`/owner/customers/${id}`, data)),
    delete: async (id: number) => extractObject(await api.delete(`/owner/customers/${id}`)),
  },
  employees: {
    getAll: async () => {
      const res = await api.get('/owner/employees', { params: withCacheBuster() });
      const obj = extractObject(res);
      return obj?.employees || obj?.Employees || [];
    },
    create: async (data: EmployeeCreatePayload) => extractObject(await api.post('/owner/employees', data)),
    update: async (id: number, data: EmployeeUpdatePayload) => extractObject(await api.put(`/owner/employees/${id}`, data)),
    delete: async (id: number) => extractObject(await api.delete(`/owner/employees/${id}`)),
  },
  suppliers: {
    getAll: async () => {
      const res = await api.get('/owner/suppliers', { params: withCacheBuster() });
      const obj = extractObject(res);
      return obj?.suppliers || obj?.Suppliers || [];
    },
    create: async (data: SupplierCreatePayload) => extractObject(await api.post('/owner/suppliers', data)),
    update: async (id: number, data: SupplierUpdatePayload) => extractObject(await api.put(`/owner/suppliers/${id}`, data)),
    delete: async (id: number) => extractObject(await api.delete(`/owner/suppliers/${id}`)),
  },
  products: {
    getAll: async (params?: any) => {
      const res = await api.get('/owner/products', { params: withCacheBuster(params) });
      const obj = extractObject(res);
      return obj?.products || obj?.Products || [];
    },
    getCategories: async () => {
      const res = await api.get('/owner/categories', { params: withCacheBuster() });
      const obj = extractObject(res);
      return obj?.categories || obj?.Categories || [];
    },
    create: async (data: ProductCreatePayload) => extractObject(await api.post('/owner/products', data)),
    update: async (id: number, data: ProductUpdatePayload) => extractObject(await api.put(`/owner/products/${id}`, data)),
    delete: async (id: number) => extractObject(await api.delete(`/owner/products/${id}`)),
    createCategory: async (data: Category) => extractObject(await api.post('/owner/categories', data)),
  },
  store: {
    getMyStore: async () => extractObject(await api.get('/owner/store', { params: withCacheBuster() })),
    updateMyStore: async (data: StoreInfo) => extractObject(await api.put('/owner/store', data)),
  },
  orders: {
    getAll: async () => {
      const res = await api.get('/owner/orders', { params: withCacheBuster() });
      const obj = extractObject(res);
      return obj?.orders || obj?.Orders || [];
    },
    delete: async (id: number) => extractObject(await api.delete(`/owner/orders/${id}`)),
    returnOrder: async (id: number) => extractObject(await api.patch(`/owner/orders/${id}/return`)),
  }
};

// ==========================================
// 3. HOOKS QUẢN LÝ
// ==========================================
export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const fetchCustomers = useCallback(async () => { setLoading(true); try { setCustomers(await ownerService.customers.getAll()); } catch (err) { console.error(err); } finally { setLoading(false); } }, []);
  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);
  const createCustomer = async (data: CustomerCreatePayload) => { const res = await ownerService.customers.create(data); await fetchCustomers(); return res; };
  const updateCustomer = async (id:number, data: CustomerUpdatePayload) => { const res = await ownerService.customers.update(id, data); await fetchCustomers(); return res; };
  const removeCustomer = async (id:number) => { const res = await ownerService.customers.delete(id); await fetchCustomers(); return res; };
  return { customers, loading, refresh: fetchCustomers, create: createCustomer, update: updateCustomer, remove: removeCustomer };
}

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const fetchEmployees = useCallback(async () => { setLoading(true); try { setEmployees(await ownerService.employees.getAll()); } catch (err) { console.error(err); } finally { setLoading(false); } }, []);
  useEffect(() => { fetchEmployees(); }, [fetchEmployees]);
  const createEmployee = async (data: EmployeeCreatePayload) => { const res = await ownerService.employees.create(data); await fetchEmployees(); return res; };
  const updateEmployee = async (id:number, data: EmployeeUpdatePayload) => { const res = await ownerService.employees.update(id, data); await fetchEmployees(); return res; };
  const removeEmployee = async (id:number) => { const res = await ownerService.employees.delete(id); await fetchEmployees(); return res; };
  return { employees, loading, refresh: fetchEmployees, create: createEmployee, update: updateEmployee, remove: removeEmployee };
}

export function useSuppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const fetchSuppliers = useCallback(async () => { setLoading(true); try { setSuppliers(await ownerService.suppliers.getAll()); } catch (err) { console.error(err); } finally { setLoading(false); } }, []);
  useEffect(() => { fetchSuppliers(); }, [fetchSuppliers]);
  const createSupplier = async (data: SupplierCreatePayload) => { const res = await ownerService.suppliers.create(data); await fetchSuppliers(); return res; };
  const updateSupplier = async (id:number, data: SupplierUpdatePayload) => { const res = await ownerService.suppliers.update(id, data); await fetchSuppliers(); return res; };
  const removeSupplier = async (id:number) => { const res = await ownerService.suppliers.delete(id); await fetchSuppliers(); return res; };
  return { suppliers, loading, refresh: fetchSuppliers, create: createSupplier, update: updateSupplier, remove: removeSupplier };
}

export function useProducts(filters?: any) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const filterString = JSON.stringify(filters || {});
  
  const fetchData = useCallback(async () => { 
    setLoading(true); 
    try { 
      const parsedFilters = filterString !== "{}" ? JSON.parse(filterString) : undefined; 
      const [prodData, catData] = await Promise.all([ 
        ownerService.products.getAll(parsedFilters), 
        ownerService.products.getCategories() 
      ]); 
      setProducts(prodData); 
      setCategories(catData); 
    } catch (err) { console.error(err); } finally { setLoading(false); } 
  }, [filterString]);
  
  useEffect(() => { fetchData(); }, [fetchData]);

  // Wrap mutating operations so UI refreshes after success
  const createProductWrapper = async (data: any) => {
    // robust mapping: accept multiple field name variants and auto-generate SKU if missing
    const getCategoryId = () => data.category_id ?? data.CategoryID ?? data.Category?.id ?? data.Category?.ID ?? 0;
    const getSupplierId = () => data.supplier_id ?? data.SupplierID ?? data.supplier_id ?? data.Supplier?.id ?? data.Supplier?.ID ?? 0;
    const getName = () => data.name ?? data.Name ?? '';
    let sku = data.sku ?? data.SKU ?? data.code ?? data.Code ?? '';
    if (!sku) {
      const base = (getName() || 'item').toString().trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      sku = `${base || 'item'}-${Date.now().toString().slice(-5)}`;
    }

    const payload: any = {
      category_id: getCategoryId(),
      supplier_id: getSupplierId(),
      sku,
      barcode: data.barcode ?? data.Barcode ?? '',
      name: getName(),
      unit: data.unit ?? data.Unit ?? '',
      price: Number(data.price ?? data.Price ?? 0),
      status: data.status ?? data.Status ?? 'active',
    };

    const res = await ownerService.products.create(payload);
    await fetchData();
    return res;
  };

  const updateProductWrapper = async (id: number, data: any) => {
    const getCategoryId = () => data.category_id ?? data.CategoryID ?? data.Category?.id ?? data.Category?.ID ?? 0;
    const getSupplierId = () => data.supplier_id ?? data.SupplierID ?? data.supplier_id ?? data.Supplier?.id ?? data.Supplier?.ID ?? 0;
    const getName = () => data.name ?? data.Name ?? '';
    let sku = data.sku ?? data.SKU ?? data.code ?? data.Code ?? '';
    if (!sku) {
      const base = (getName() || 'item').toString().trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      sku = `${base || 'item'}-${Date.now().toString().slice(-5)}`;
    }

    const payload: any = {
      category_id: getCategoryId(),
      supplier_id: getSupplierId(),
      sku,
      barcode: data.barcode ?? data.Barcode ?? '',
      name: getName(),
      unit: data.unit ?? data.Unit ?? '',
      price: Number(data.price ?? data.Price ?? 0),
      status: data.status ?? data.Status ?? 'active',
    };
    const res = await ownerService.products.update(id, payload);
    await fetchData();
    return res;
  };

  const removeProductWrapper = async (id: number) => {
    const res = await ownerService.products.delete(id);
    await fetchData();
    return res;
  };

  const createCategoryWrapper = async (data: Category) => {
    const res = await ownerService.products.createCategory({ name: data.name });
    await fetchData();
    return res;
  };

  return { products, categories, loading, refresh: fetchData, createProduct: createProductWrapper, updateProduct: updateProductWrapper, removeProduct: removeProductWrapper, createCategory: createCategoryWrapper };
}

export function useStore() {
  const [storeInfo, setStoreInfo] = useState<StoreInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const fetchStore = useCallback(async () => { setLoading(true); try { setStoreInfo(await ownerService.store.getMyStore()); } catch (err) { console.error(err); } finally { setLoading(false); } }, []);
  useEffect(() => { fetchStore(); }, [fetchStore]);
  const updateStoreWrapper = async (data: StoreInfo) => { const res = await ownerService.store.updateMyStore(data); await fetchStore(); return res; };
  return { storeInfo, loading, refresh: fetchStore, updateStore: updateStoreWrapper };
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const fetchOrders = useCallback(async () => { setLoading(true); try { setOrders(await ownerService.orders.getAll()); } catch (err) { console.error(err); } finally { setLoading(false); } }, []);
  useEffect(() => { fetchOrders(); }, [fetchOrders]);
  const removeOrder = async (id:number) => { const res = await ownerService.orders.delete(id); await fetchOrders(); return res; };
  const returnOrder = async (id:number) => { const res = await ownerService.orders.returnOrder(id); await fetchOrders(); return res; };
  return { orders, loading, refresh: fetchOrders, remove: removeOrder, returnOrder };
}