import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api', // Đổi URL theo BE của bạn
  headers: {
    'Content-Type': 'application/json',
  },
  // Send cookies (useful if backend uses cookie-based auth)
  withCredentials: true,
});

// Tự động đính kèm Token
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Xử lý lỗi chung
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - token invalid or missing: clear auth and redirect to sign-in
      localStorage.removeItem('token');
      localStorage.removeItem('authUser');
      window.location.href = '/signin';
    }
    // For 403 Forbidden, do not auto-logout; allow caller to handle permission errors
    return Promise.reject(error);
  }
);

export default api;