// src/hooks/useAdmin.ts
import { useState, useEffect } from 'react';
import { adminService, AdminAccountInfo, AdminAccountsStats, StoreTypeDTO } from '../services/adminService';

export function useAccounts() {
  const [accounts, setAccounts] = useState<AdminAccountInfo[]>([]);
  const [stats, setStats] = useState<AdminAccountsStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAccounts = async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getAccounts();
      if (res.success && res.data) {
        setAccounts(res.data.Accounts || []);
        setStats(res.data.Stats || null);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách tài khoản:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const changeStatus = async (userId: number, status: string) => {
    try {
      const res = await adminService.changeAccountStatus(userId, status);
      if (res.success) {
        // Tải lại dữ liệu sau khi cập nhật thành công
        await fetchAccounts();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
      return false;
    }
  };

  return { accounts, stats, isLoading, changeStatus, refresh: fetchAccounts };
}

export function useStoreTypes() {
  const [storeTypes, setStoreTypes] = useState<StoreTypeDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStoreTypes = async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getStoreTypes();
      if (res.success && res.data) {
        setStoreTypes(res.data);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách loại cửa hàng:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStoreTypes();
  }, []);

  const addStoreType = async (name: string) => {
    const res = await adminService.createStoreType(name);
    if (res.success) await fetchStoreTypes();
    return res;
  };

  const editStoreType = async (id: number, name: string) => {
    const res = await adminService.updateStoreType(id, name);
    if (res.success) await fetchStoreTypes();
    return res;
  };

  const removeStoreType = async (id: number) => {
    const res = await adminService.deleteStoreType(id);
    if (res.success) await fetchStoreTypes();
    return res;
  };

  return { storeTypes, isLoading, addStoreType, editStoreType, removeStoreType };
}