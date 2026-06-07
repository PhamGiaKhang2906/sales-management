import api from './api';

export const salesService = {
  orders: {
    getAll: async (params?: any) => {
      const res = await api.get('/sales/orders', { params });
      return res.data?.data || res.data || [];
    },
    get: async (id: number) => {
      const res = await api.get(`/sales/orders/${id}`);
      return res.data?.data || res.data;
    },
    create: async (data: any) => {
      const res = await api.post('/sales/orders', data);
      return res.data?.data || res.data;
    },
    update: async (id: number, data: any) => {
      const res = await api.put(`/sales/orders/${id}`, data);
      return res.data?.data || res.data;
    },
    delete: async (id: number) => {
      const res = await api.delete(`/sales/orders/${id}`);
      return res.data?.data || res.data;
    },
    // mark as returned
    return: async (id: number) => {
      const res = await api.patch(`/sales/orders/${id}/return`);
      return res.data?.data || res.data;
    },
  },
  customers: {
    getAll: async () => {
      const res = await api.get('/sales/customers');
      return res.data?.data || res.data || [];
    }
  },
  // For product search, sales UI uses owner products endpoint (shared)
  products: {
    search: async (q: string) => {
      const res = await api.get('/sales/products', { params: { search: q } });
      return res.data?.data?.products || res.data?.data || res.data || [];
    }
  }
};

export default salesService;
