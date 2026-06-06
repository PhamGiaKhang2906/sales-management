export type AuthRole = 'owner' | 'sales' | 'warehouse' | 'admin';

export interface AuthAccount {
  username: string;
  name: string; // Add name field
  role: AuthRole;
  roleId: number; // Add roleId field
}


const AUTH_USER_KEY = 'authUser';
// const REGISTRATION_KEY = 'salesManagementRegistrations'; // No longer needed



function readJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;

  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getAuthUser(): AuthAccount | null {
  return readJson<AuthAccount | null>(AUTH_USER_KEY, null);
}

export function storeAuthUser(account: AuthAccount) {
  writeJson(AUTH_USER_KEY, account);
}