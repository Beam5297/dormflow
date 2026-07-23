export interface Tenant {
  id: string;
  name: string;
  phone: string;
  idCard: string;
  roomNumber: string;
  startDate: string;
  endDate: string;
  deposit: number;
  status: 'ACTIVE' | 'EXPIRED' | 'MOVED_OUT';
}

export const mockTenants: Tenant[] = [
  {
    id: '1',
    name: 'สมชาย ใจดี',
    phone: '081-234-5678',
    idCard: '1-1002-00123-45-6',
    roomNumber: '101',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    deposit: 7000,
    status: 'ACTIVE',
  },
  {
    id: '2',
    name: 'วิภาดา รักสงบ',
    phone: '089-876-5432',
    idCard: '1-5099-00987-65-4',
    roomNumber: '103',
    startDate: '2025-08-01',
    endDate: '2026-07-31',
    deposit: 7000,
    status: 'EXPIRED',
  },
  {
    id: '3',
    name: 'กิตติพงษ์ มีสุข',
    phone: '062-111-2222',
    idCard: '3-1005-00456-78-9',
    roomNumber: 'B101',
    startDate: '2026-03-15',
    endDate: '2027-03-14',
    deposit: 8400,
    status: 'ACTIVE',
  },
];