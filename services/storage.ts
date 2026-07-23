// services/storage.ts

export interface SettingsData {
  dormName: string;
  phone: string;
  address: string;
  waterRate: number;
  electricRate: number;
  commonFee: number;
  bankName: string;
  accountNo: string;
  accountName: string;
  promptPay: string;
}

export interface RoomData {
  id: string;
  roomNumber: string;
  status: 'vacant' | 'occupied' | 'maintenance';
  rentPrice: number;
  tenantName?: string;
}

export interface TenantData {
  id: string;
  name: string;
  phone: string;
  roomNumber: string;
  startDate: string;
}

export interface BillData {
  id: string;
  roomNumber: string;
  tenantName: string;
  month: string;
  rentPrice: number;
  waterOld: number;
  waterNew: number;
  waterPricePerUnit: number;
  electricOld: number;
  electricNew: number;
  electricPricePerUnit: number;
  otherPrice: number;
  totalPrice: number;
  status: 'paid' | 'pending';
}

const DEFAULT_SETTINGS: SettingsData = {
  dormName: 'BAN (DormFlow)',
  phone: '089-605-0124',
  address: '354 หมู่ 1 ต.วัฒนานคร อ.วัฒนานคร จ.สระแก้ว 27160',
  waterRate: 18,
  electricRate: 8,
  commonFee: 100,
  bankName: 'ttb (ทหารไทยธนชาต)',
  accountNo: '6792059567',
  accountName: 'นายมานะ จงบริบูรณ์',
  promptPay: '089-605-0124',
};

// --- Settings ---
export const getSettings = (): SettingsData => {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  const data = localStorage.getItem('dorm_settings');
  return data ? JSON.parse(data) : DEFAULT_SETTINGS;
};

export const saveSettings = (data: SettingsData) => {
  localStorage.setItem('dorm_settings', JSON.stringify(data));
};

// --- Rooms ---
export const getRooms = (): RoomData[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem('dorm_rooms');
  return data ? JSON.parse(data) : [
    { id: '1', roomNumber: '101', status: 'occupied', rentPrice: 3500, tenantName: 'สมชาย ใจดี' },
    { id: '2', roomNumber: '102', status: 'vacant', rentPrice: 3500 },
  ];
};

export const saveRooms = (rooms: RoomData[]) => {
  localStorage.setItem('dorm_rooms', JSON.stringify(rooms));
};

// --- Tenants ---
export const getTenants = (): TenantData[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem('dorm_tenants');
  return data ? JSON.parse(data) : [
    { id: '1', name: 'สมชาย ใจดี', phone: '081-234-5678', roomNumber: '101', startDate: '2026-01-01' }
  ];
};

export const saveTenants = (tenants: TenantData[]) => {
  localStorage.setItem('dorm_tenants', JSON.stringify(tenants));
};

// --- Bills ---
export const getBills = (): BillData[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem('dorm_bills');
  return data ? JSON.parse(data) : [];
};

export const saveBills = (bills: BillData[]) => {
  localStorage.setItem('dorm_bills', JSON.stringify(bills));
};