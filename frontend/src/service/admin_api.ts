// Admin API client for managing accounts and store types

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// ========== Account Management ==========

export interface AccountInfo {
  user_id: number;
  fullname: string;
  phone: string;
  store_name: string;
  category: string;
  status: string;
}

export interface AccountsStats {
  total_accounts: number;
  pending_count: number;
  approved_count: number;
  rejected_count: number;
}

export interface AccountsResponse {
  accounts: AccountInfo[];
  stats: AccountsStats;
}

export interface ChangeStatusRequest {
  user_id: number;
  status: "Đã_duyệt" | "Từ_chối";
}

export interface ChangeStatusResponse {
  user_id: number;
  status: string;
  message: string;
}

// ========== Store Type Management ==========

export interface StoreTypeResponse {
  id: number;
  name: string;
}

export interface StoreTypesListResponse {
  store_types: StoreTypeResponse[];
  total: number;
}

export interface CreateStoreTypeRequest {
  name: string;
}

export interface UpdateStoreTypeRequest {
  name: string;
}

// ========== API Client Class ==========

class AdminApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Lỗi khi gửi yêu cầu",
          error: data.message || "Unknown error",
        };
      }

      return {
        success: true,
        message: data.message || "Thành công",
        data: data.data,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Lỗi mạng";
      return {
        success: false,
        message: errorMessage,
        error: errorMessage,
      };
    }
  }

  // ===== Account Management =====

  async getAccounts(): Promise<ApiResponse<AccountsResponse>> {
    return this.request<AccountsResponse>("/admin/accounts", {
      method: "GET",
    });
  }

  async changeAccountStatus(
    req: ChangeStatusRequest
  ): Promise<ApiResponse<ChangeStatusResponse>> {
    return this.request<ChangeStatusResponse>("/admin/accounts/status", {
      method: "PUT",
      body: JSON.stringify(req),
    });
  }

  // ===== Store Type Management =====

  async getStoreTypes(): Promise<ApiResponse<StoreTypesListResponse>> {
    return this.request<StoreTypesListResponse>("/admin/store-types", {
      method: "GET",
    });
  }

  async createStoreType(
    req: CreateStoreTypeRequest
  ): Promise<ApiResponse<StoreTypeResponse>> {
    return this.request<StoreTypeResponse>("/admin/store-types", {
      method: "POST",
      body: JSON.stringify(req),
    });
  }

  async updateStoreType(
    id: number,
    req: UpdateStoreTypeRequest
  ): Promise<ApiResponse<StoreTypeResponse>> {
    return this.request<StoreTypeResponse>(`/admin/store-types/${id}`, {
      method: "PUT",
      body: JSON.stringify(req),
    });
  }

  async deleteStoreType(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/admin/store-types/${id}`, {
      method: "DELETE",
    });
  }
}

export const adminApiClient = new AdminApiClient(API_BASE_URL);
