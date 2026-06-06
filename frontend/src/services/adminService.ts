// src/services/adminService.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

export interface AdminAccountInfo {
  user_id: number;
  fullname: string;
  phone: string;
  store_name: string;
  category: string;
  status: string;
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

// HÀM MỚI: Tự động lấy token từ LocalStorage và tạo Header chứa Authorization
const getAuthHeaders = (): HeadersInit => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (typeof window !== 'undefined') {
    // Tùy thuộc vào cách bạn lưu token lúc login. 
    // Giả sử bạn lưu biến 'token' trực tiếp trong localStorage:
    const token = localStorage.getItem('token'); 
    
    // NẾU token của bạn được lưu chung trong object 'authUser', hãy dùng đoạn code dưới thay thế:
    /*
    const authUserRaw = localStorage.getItem('authUser');
    if (authUserRaw) {
      const authUser = JSON.parse(authUserRaw);
      if (authUser.token) headers['Authorization'] = `Bearer ${authUser.token}`;
    }
    */

    if (token) {
      headers['Authorization'] = `Bearer ${token}`; // Gắn chìa khóa vào Header
    }
  }

  return headers;
};

export const adminService = {
  // ================= Accounts =================
  async getAccounts() {
    const response = await fetch(`${API_BASE_URL}/admin/accounts`, {
      headers: getAuthHeaders(), // Thêm header vào đây
    });
    return response.json();
  },

  async changeAccountStatus(userId: number, status: string) {
    const response = await fetch(`${API_BASE_URL}/admin/accounts/status`, {
      method: 'PUT',
      headers: getAuthHeaders(), // Thêm header vào đây
      body: JSON.stringify({ user_id: userId, status }),
    });
    return response.json();
  },

  // ================= Store Types =================
  async getStoreTypes() {
    const response = await fetch(`${API_BASE_URL}/admin/store-types`, {
      headers: getAuthHeaders(), // Thêm header vào đây
    });
    return response.json();
  },

  async createStoreType(name: string) {
    const response = await fetch(`${API_BASE_URL}/admin/store-types`, {
      method: 'POST',
      headers: getAuthHeaders(), // Thêm header vào đây
      body: JSON.stringify({ name }),
    });
    return response.json();
  },

  async updateStoreType(id: number, name: string) {
    const response = await fetch(`${API_BASE_URL}/admin/store-types/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(), // Thêm header vào đây
      body: JSON.stringify({ name }),
    });
    return response.json();
  },

  async deleteStoreType(id: number) {
    const response = await fetch(`${API_BASE_URL}/admin/store-types/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(), // Hàm DELETE cũng cần token
    });
    return response.json();
  },
};