import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import { AuthAccount, storeAuthUser, getAuthUser } from '@/features/auth/auth-store';
import { LoginRequest, RegisterRequest } from '@/backend-types';

// Định nghĩa kiểu dữ liệu AuthRole ngay tại đây để TypeScript hiểu
export type AuthRole = 'owner' | 'sales' | 'admin' | 'warehouse';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<AuthAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = getAuthUser();
    if (storedUser) {
      setUser(storedUser);
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
          name: credentials.username,
          role: mapRoleIdToAuthRole(response.data.role_id),
          roleId: response.data.role_id,
        };
        storeAuthUser(authUser);
        setUser(authUser);
        setIsAuthenticated(true);
        router.push(getRedirectPath(authUser.role));
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

function mapRoleIdToAuthRole(roleId: number): AuthRole {
  switch (roleId) {
    case 1: // owner
      return 'owner';
    case 2: // sales
      return 'sales';
    case 3: // storemanage (warehouse)
      return 'warehouse';
    case 4: // admin
      return 'admin';
    default:
      console.warn(`Unknown roleId: ${roleId}. Defaulting to 'admin' for safety.`);
      return 'admin'; // Changed default to 'admin'
  }
}

function getRedirectPath(role: AuthRole): string {
  switch (role) {
    case 'owner':
      return '/owner';
    case 'sales':
      return '/sales';
    case 'warehouse':
      return '/warehouse';
    case 'admin':
      return '/admin';
    default:
      console.warn(`Unknown AuthRole: ${role}. Defaulting to '/'.`);
      return '/';
  }
}