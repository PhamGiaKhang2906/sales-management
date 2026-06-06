export interface RegisterRequest {
  username: string;
  password: string;
  phone: string;
  address: string;
  fullName: string;
  store_type: string;
}

export interface RegisterResponse {
  user_id: number;
  store_id: number;
  message: string;
}

export interface LoginRequest {
  username: string;
  password: string;
  phone: string;
}

export interface LoginResponse {
  user_id: number;
  username: string;
  role_id: number;
  message: string;
}
