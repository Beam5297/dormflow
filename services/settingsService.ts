export interface DormSettings {
  dormName: string;
  address: string;
  phone: string;
  taxId: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  defaultWaterRate: number;
  defaultElectricRate: number;
  lateFee: number;
  dueDateDay: number;
}

export const defaultSettings: DormSettings = {
  dormName: 'BAN (DormFlow)',
  address: '354 หมู่ 1 (บ้านพร้าว) ต.วัฒนานคร อ.วัฒนานคร จ.สระแก้ว 27160',
  phone: '0896050124',
  taxId: 'XXXXXXXXXXXXX',
  bankName: 'ทหารไทยธนชาต (ttb)',
  accountNumber: '6792059567',
  accountName: 'นายมานะ จงบริบูรณ์',
  defaultWaterRate: 25,
  defaultElectricRate: 7,
  lateFee: 100,
  dueDateDay: 5,
};

export function getDormSettings(): DormSettings {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('dorm_settings');
    if (saved) return JSON.parse(saved);
  }
  return defaultSettings;
}

export function saveDormSettings(settings: DormSettings) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('dorm_settings', JSON.stringify(settings));
  }
}