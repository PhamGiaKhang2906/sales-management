import api from './api';

// ==========================================
// 1. ĐỊNH NGHĨA TẤT CẢ INTERFACES (TYPES)
// ==========================================
export interface Customer {
  id?: number;
  name: string;
  code?: string;
  phone: string;
  email?: string;
  address?: string;
  totalPurchases?: number;
}

export interface CustomerCreatePayload {
  name: string;
  code?: string;
  phone: string;
  email?: string;
  address?: string;
}

export interface CustomerUpdatePayload {
  name?: string;
  code?: string;
  phone?: string;
  email?: string;
  address?: string;
}

export interface Employee {
  id: number;
  user_id: number;
  username: string;
  fullname: string;
  phone: string;
  cccd?: string;
  address?: string;
  birthday?: string | null;
  salary_factor: number;
  work_shift: string;
  status: string;
  created_at: string;
  rolename: string; 
  role_id: number;
}

export interface EmployeeCreatePayload {
  fullname: string;
  username: string;
  password?: string;
  phone: string;
  cccd?: string;
  address?: string;
  birthday?: string | null;
  salary_factor: number;
  work_shift: string;
  role_name: string;
}

export interface EmployeeUpdatePayload {
  fullname?: string;
  phone?: string;
  cccd?: string;
  address?: string;
  birthday?: string | null;
  salary_factor?: number;
  work_shift?: string;
  role_name?: string;
}

export interface Supplier {
  id?: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  code?: string;
  contact?: string;
}

export interface SupplierCreatePayload {
  name: string;
  phone: string;
  email: string;
  address: string;
  code?: string;
  contact?: string;
}

export interface SupplierUpdatePayload {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  code?: string;
  contact?: string;
}

export interface Product {
  id?: number;
  code: string;
  name: string;
  price: number;
  cost: number;
  stock: number;
  category_id?: number;
  group?: string;
  supplier?: string;
  image?: string;
}

export interface ProductCreatePayload {
  code: string;
  name: string;
  price: number;
  cost: number;
  stock: number;
  category_id?: number;
  group?: string;
  supplier?: string;
  image?: string;
}

export interface ProductUpdatePayload {
  code?: string;
  name?: string;
  price?: number;
  cost?: number;
  stock?: number;
  category_id?: number;
  group?: string;
  supplier?: string;
  image?: string;
}

export interface Category { id?: number; name: string; }
export interface StoreInfo { id?: number; name: string; taxCode: string; address: string; phone: string; email: string; }

// ==========================================
// 2. GỘP TẤT CẢ SERVICES (Đã nới lỏng data: any)
// ==========================================
export const ownerService = {
  customers: {
    getAll: async () => (await api.get('/customers')).data.data,
    create: async (data: CustomerCreatePayload) => (await api.post('/customers', data)).data.data,
    update: async (id: number, data: CustomerUpdatePayload) => (await api.put(`/customers/${id}`, data)).data.data,
    delete: async (id: number) => (await api.delete(`/customers/${id}`)).data.data,
  },

  employees: {
    getAll: async () => (await api.get('/employees')).data.data,
    create: async (data: EmployeeCreatePayload) => (await api.post('/employees', data)).data.data,
    update: async (id: number, data: EmployeeUpdatePayload) => (await api.put(`/employees/${id}`, data)).data.data,
    delete: async (id: number) => (await api.delete(`/employees/${id}`)).data.data,
  },

  suppliers: {
    getAll: async () => (await api.get('/suppliers')).data.data,
    create: async (data: SupplierCreatePayload) => (await api.post('/suppliers', data)).data.data,
    update: async (id: number, data: SupplierUpdatePayload) => (await api.put(`/suppliers/${id}`, data)).data.data,
    delete: async (id: number) => (await api.delete(`/suppliers/${id}`)).data.data,
  },

  products: {
    getAll: async (params?: any) => (await api.get('/products', { params })).data.data,
    create: async (data: ProductCreatePayload) => (await api.post('/products', data)).data.data,
    update: async (id: number, data: ProductUpdatePayload) => (await api.put(`/products/${id}`, data)).data.data,
    delete: async (id: number) => (await api.delete(`/products/${id}`)).data.data,
    getCategories: async () => (await api.get('/categories')).data.data,
    createCategory: async (data: Category) => (await api.post('/categories', data)).data.data,
  },

  store: {
    getMyStore: async () => (await api.get('/store/my-store')).data.data,
    updateMyStore: async (data: StoreInfo) => (await api.put('/store/my-store', data)).data.data,
  }
};