// src/services/adminService.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

export interface AdminAccountInfo {
  user_id: number;
  fullname: string;
  phone: string;
  store_name: string;
  category: string;
  status: string;
  address?: string; // BỔ SUNG TRƯỜNG ĐỊA CHỈ
}

export interface AdminAccountsStats {
  total_accounts: number;
  pending_count: number;
  approved_count: number;
  rejected_count: number;
}

export interface StoreTypeDTO {
  ID: number;
  name: string;
  CreatedAt?: string;
  totalStores?: number;
}

const getAuthHeaders = (): HeadersInit => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token'); 
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`; 
    }
  }

  return headers;
};

export const adminService = {
  // ================= Accounts =================
  async getAccounts() {
    const response = await fetch(`${API_BASE_URL}/admin/accounts`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  },

  async changeAccountStatus(userId: number, status: string) {
    const response = await fetch(`${API_BASE_URL}/admin/accounts/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ user_id: userId, status }),
    });
    return response.json();
  },

  // ================= Store Types =================
  async getStoreTypes() {
    const response = await fetch(`${API_BASE_URL}/admin/store-types`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  },

  async createStoreType(name: string) {
    const response = await fetch(`${API_BASE_URL}/admin/store-types`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ name }),
    });
    return response.json();
  },

  async updateStoreType(id: number, name: string) {
    const response = await fetch(`${API_BASE_URL}/admin/store-types/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ name }),
    });
    return response.json();
  },

  async deleteStoreType(id: number) {
    const response = await fetch(`${API_BASE_URL}/admin/store-types/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return response.json();
  },
};