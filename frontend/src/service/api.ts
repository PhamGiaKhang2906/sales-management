const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
  phone: string;
}

export interface LoginResponse {
  user_id: number;
  username: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  phone: string;
  fullname: string;
  store_type: string;
}

export interface RegisterResponse {
  user_id: number;
  store_id: number;
}

class ApiClient {
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
          'Content-Type': 'application/json',
          ...options.headers,
        },
        credentials: 'include', // Send cookies with request
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Lỗi khi gửi yêu cầu',
          error: data.message || 'Unknown error',
        };
      }

      return {
        success: true,
        message: data.message || 'Thành công',
        data: data.data,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Lỗi mạng';
      return {
        success: false,
        message: errorMessage,
        error: errorMessage,
      };
    }
  }

  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(data: RegisterRequest): Promise<ApiResponse<RegisterResponse>> {
    return this.request<RegisterResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
