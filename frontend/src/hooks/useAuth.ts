import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import { AuthAccount, storeAuthUser } from '@/features/auth/auth-store'; // Assuming you'll update auth-store
import { LoginRequest, RegisterRequest } from '@/backend-types';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<AuthAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // On mount, check for existing session or stored user
    // For now, we'll mock it or retrieve from local storage if available
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginRequest) => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      if (response.success && response.data) {
        const authUser: AuthAccount = {
          username: response.data.username,
          name: credentials.username, // Assuming name from username for now
          role: response.data.role_id === 1 ? 'owner' : 'sales', // Map role_id to role name
        };
        storeAuthUser(authUser);
        setUser(authUser);
        setIsAuthenticated(true);
        router.push(authUser.role === 'owner' ? '/owner' : '/sales'); // Redirect based on role
        return { success: true, message: response.message };
      } else {
        return { success: false, message: response.message || 'Đăng nhập thất bại' };
      }
    } catch (error: any) {
      return { success: false, message: error.message || 'Lỗi kết nối server' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (registrationData: RegisterRequest) => {
    setIsLoading(true);
    try {
      const response = await authService.register(registrationData);
      if (response.success) {
        // After successful registration, owner needs to be approved by admin
        // No direct login after registration for owner roles
        router.push('/auth/signin?registrationSuccess=true'); // Redirect to login with success message
        return { success: true, message: response.message };
      } else {
        return { success: false, message: response.message || 'Đăng ký thất bại' };
      }
    } catch (error: any) {
      return { success: false, message: error.message || 'Lỗi kết nối server' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authUser');
    setUser(null);
    setIsAuthenticated(false);
    router.push('/auth/signin');
  };

  return {
    isAuthenticated,
    user,
    isLoading,
    login,
    register,
    logout,
  };
}
