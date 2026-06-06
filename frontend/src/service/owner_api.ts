// Owner API client for managing suppliers and categories

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// ========== Supplier Management ==========

export interface SupplierResponse {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  tax_code: string;
  status: string;
}

export interface SuppliersListResponse {
  suppliers: SupplierResponse[];
  total: number;
}

export interface CreateSupplierRequest {
  name: string;
  phone: string;
  email: string;
  address?: string;
  tax_code?: string;
}

export interface UpdateSupplierRequest {
  name: string;
  phone: string;
  email: string;
  address?: string;
  tax_code?: string;
}

// ========== Category Management ==========

export interface CategoryResponse {
  id: number;
  name: string;
}

export interface CategoriesListResponse {
  categories: CategoryResponse[];
  total: number;
}

export interface CreateCategoryRequest {
  name: string;
}

export interface UpdateCategoryRequest {
  name: string;
}

// ========== Owner API Client Class ==========

class OwnerApiClient {
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

  // ===== Supplier Management =====

  async getSuppliers(): Promise<ApiResponse<SuppliersListResponse>> {
    return this.request<SuppliersListResponse>("/owner/suppliers", {
      method: "GET",
    });
  }

  async getAllSuppliers(): Promise<ApiResponse<SuppliersListResponse>> {
    return this.request<SuppliersListResponse>("/owner/suppliers");
  }

  async getSupplierById(id: number): Promise<ApiResponse<SupplierResponse>> {
    return this.request<SupplierResponse>(`/owner/suppliers/${id}`);
  }

  async createSupplier(
    req: CreateSupplierRequest
  ): Promise<ApiResponse<SupplierResponse>> {
    return this.request<SupplierResponse>("/owner/suppliers", {
      method: "POST",
      body: JSON.stringify(req),
    });
  }

  async updateSupplier(
    id: number,
    req: UpdateSupplierRequest
  ): Promise<ApiResponse<SupplierResponse>> {
    return this.request<SupplierResponse>(`/owner/suppliers/${id}`, {
      method: "PUT",
      body: JSON.stringify(req),
    });
  }

  async deleteSupplier(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/owner/suppliers/${id}`, {
      method: "DELETE",
    });
  }

  // ===== Category Management =====

  async getCategories(): Promise<ApiResponse<CategoriesListResponse>> {
    return this.request<CategoriesListResponse>("/owner/categories", {
      method: "GET",
    });
  }

  async createCategory(
    req: CreateCategoryRequest
  ): Promise<ApiResponse<CategoryResponse>> {
    return this.request<CategoryResponse>("/owner/categories", {
      method: "POST",
      body: JSON.stringify(req),
    });
  }

  async updateCategory(
    id: number,
    req: UpdateCategoryRequest
  ): Promise<ApiResponse<CategoryResponse>> {
    return this.request<CategoryResponse>(`/owner/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(req),
    });
  }

  async deleteCategory(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/owner/categories/${id}`, {
      method: "DELETE",
    });
  }

  // ===== Employee Management =====

  async getEmployees(): Promise<ApiResponse<EmployeesListResponse>> {
    return this.request<EmployeesListResponse>("/owner/employees", {
      method: "GET",
    });
  }

  async createEmployee(
    req: CreateEmployeeRequest
  ): Promise<ApiResponse<EmployeeResponse>> {
    return this.request<EmployeeResponse>("/owner/employees", {
      method: "POST",
      body: JSON.stringify(req),
    });
  }

  async updateEmployee(
    id: number,
    req: UpdateEmployeeRequest
  ): Promise<ApiResponse<EmployeeResponse>> {
    return this.request<EmployeeResponse>(`/owner/employees/${id}`, {
      method: "PUT",
      body: JSON.stringify(req),
    });
  }

  async deleteEmployee(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/owner/employees/${id}`, {
      method: "DELETE",
    });
  }
}

export const ownerApiClient = new OwnerApiClient(API_BASE_URL);

// ========== Employee Management ==========

export interface EmployeeResponse {
  id: number;
  user_id: number;
  username: string;
  fullname: string;
  phone: string;
  cccd: string;
  address: string;
  birthday: string | null;
  salary_factor: number;
  work_shift: string;
  status: string;
  created_at: string;
}

export interface EmployeesListResponse {
  employees: EmployeeResponse[];
  total: number;
}

export interface CreateEmployeeRequest {
  fullname: string;
  username: string;
  password: string;
  phone: string;
  cccd?: string;
  address?: string;
  birthday?: string; // Format: YYYY-MM-DD
  salary_factor?: number;
  work_shift?: string;
}

export interface UpdateEmployeeRequest {
  fullname: string;
  phone: string;
  cccd?: string;
  address?: string;
  birthday?: string; // Format: YYYY-MM-DD
  salary_factor?: number;
  work_shift?: string;
}
