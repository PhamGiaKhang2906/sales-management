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
      console.log("👥 Dữ liệu Accounts từ API:", res); // LOG ĐỂ KIỂM TRA

      // Linh hoạt bắt dữ liệu chữ Hoa hoặc chữ thường từ Backend Golang
      if (res && res.data) {
        setAccounts(res.data.Accounts || res.data.accounts || []);
        setStats(res.data.Stats || res.data.stats || null);
      } else if (res && (res.Accounts || res.accounts)) {
        // Trường hợp backend trả thẳng dữ liệu không bọc trong field 'data'
        setAccounts(res.Accounts || res.accounts || []);
        setStats(res.Stats || res.stats || null);
      } else if (Array.isArray(res)) {
        setAccounts(res);
      } else {
        setAccounts([]);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách tài khoản:', error);
      setAccounts([]);
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
      await fetchAccounts(); // Luôn load lại sau khi duyệt/từ chối
      return res?.success !== false; // Xem như thành công trừ khi API báo lỗi rõ ràng
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
      console.log("📦 Dữ liệu StoreTypes từ API:", res);

      if (res && res.data) {
        if (Array.isArray(res.data.store_types)) {
          setStoreTypes(res.data.store_types);
        } else if (Array.isArray(res.data)) {
          setStoreTypes(res.data);
        } else {
          setStoreTypes([]);
        }
      } else if (Array.isArray(res)) {
        setStoreTypes(res);
      } else {
        setStoreTypes([]);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách loại cửa hàng:', error);
      setStoreTypes([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStoreTypes();
  }, []);

  const addStoreType = async (name: string) => {
    const res = await adminService.createStoreType(name);
    await fetchStoreTypes(); 
    return res;
  };

  const editStoreType = async (id: number, name: string) => {
    const res = await adminService.updateStoreType(id, name);
    await fetchStoreTypes(); 
    return res;
  };

  const removeStoreType = async (id: number) => {
    const res = await adminService.deleteStoreType(id);
    await fetchStoreTypes(); 
    return res;
  };

  return { storeTypes, isLoading, addStoreType, editStoreType, removeStoreType };
}