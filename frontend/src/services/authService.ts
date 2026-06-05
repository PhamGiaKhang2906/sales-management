import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '@/backend-types'; // Assuming you'll create this file from backend DTOs

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export const authService = {
  async register(data: RegisterRequest): Promise<ApiResponse<RegisterResponse>> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },
};
