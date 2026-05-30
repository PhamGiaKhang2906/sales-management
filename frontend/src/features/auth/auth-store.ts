export type AuthRole = 'owner' | 'sales' | 'warehouse';

export interface AuthAccount {
  username: string;
  password: string;
  role: AuthRole;
  name: string;
  product?: string;
}

export interface RegistrationRequest {
  fullName: string;
  phone: string;
  product: string;
  username: string;
  password: string;
  status: 'pending' | 'approved';
  submittedAt: string;
}

const AUTH_USER_KEY = 'authUser';
const REGISTRATION_KEY = 'salesManagementRegistrations';

export const mockAccounts: AuthAccount[] = [
  { username: 'owner', password: 'owner123', role: 'owner', name: 'Nguyễn Văn Owner' },
  { username: 'sales', password: 'sales123', role: 'sales', name: 'Trần Thị Sales' },
  { username: 'warehouse', password: 'warehouse123', role: 'warehouse', name: 'Lê Văn Warehouse' },
  { username: 'admin', password: 'admin123', role: 'owner', name: 'Quản Trị Viên' },
];

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

export function getLoginAccounts() {
  const registrations = readJson<RegistrationRequest[]>(REGISTRATION_KEY, []);
  const approvedAccounts = registrations
    .filter((registration) => registration.status === 'approved')
    .map<AuthAccount>((registration) => ({
      username: registration.username,
      password: registration.password,
      role: 'sales',
      name: registration.fullName,
      product: registration.product,
    }));

  return [...mockAccounts, ...approvedAccounts];
}

export function saveRegistrationRequest(request: Omit<RegistrationRequest, 'status' | 'submittedAt'>) {
  const registrations = readJson<RegistrationRequest[]>(REGISTRATION_KEY, []);

  registrations.unshift({
    ...request,
    status: 'pending',
    submittedAt: new Date().toISOString(),
  });

  writeJson(REGISTRATION_KEY, registrations);
}

export function storeAuthUser(account: AuthAccount) {
  writeJson(AUTH_USER_KEY, {
    username: account.username,
    name: account.name,
    role: account.role,
  });
}