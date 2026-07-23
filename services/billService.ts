export interface Bill {
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
  status: 'PENDING' | 'PAID' | 'OVERDUE';
}

export const mockBills: Bill[] = [
  {
    id: '1',
    roomNumber: '101',
    tenantName: 'สมชาย ใจดี',
    month: '2026-07',
    rentPrice: 3500,
    waterOld: 120,
    waterNew: 125,
    waterPricePerUnit: 25, // <-- เปลี่ยนเป็น 25
    electricOld: 450,
    electricNew: 530,
    electricPricePerUnit: 7, // <-- เปลี่ยนเป็น 7
    otherPrice: 100,
    totalPrice: 4285, // (3500 + (5*25) + (80*7) + 100)
    status: 'PAID',
  },
  {
    id: '2',
    roomNumber: '103',
    tenantName: 'วิภาดา รักสงบ',
    month: '2026-07',
    rentPrice: 3500,
    waterOld: 80,
    waterNew: 88,
    waterPricePerUnit: 25, // <-- เปลี่ยนเป็น 25
    electricOld: 310,
    electricNew: 410,
    electricPricePerUnit: 7, // <-- เปลี่ยนเป็น 7
    otherPrice: 100,
    totalPrice: 4500, // (3500 + (8*25) + (100*7) + 100)
    status: 'PENDING',
  },
  {
    id: '3',
    roomNumber: 'B101',
    tenantName: 'กิตติพงษ์ มีสุข',
    month: '2026-07',
    rentPrice: 4200,
    waterOld: 50,
    waterNew: 56,
    waterPricePerUnit: 25, // <-- เปลี่ยนเป็น 25
    electricOld: 200,
    electricNew: 320,
    electricPricePerUnit: 7, // <-- เปลี่ยนเป็น 7
    otherPrice: 100,
    totalPrice: 5290, // (4200 + (6*25) + (120*7) + 100)
    status: 'PENDING',
  },
];