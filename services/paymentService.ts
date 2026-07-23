export interface PaymentRecord {
  id: string;
  billId: string;
  roomNumber: string;
  tenantName: string;
  amount: number;
  paymentMethod: 'PROMPTPAY' | 'CASH' | 'TRANSFER';
  slipUrl?: string;
  paidAt?: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
}

export const mockPayments: PaymentRecord[] = [
  {
    id: 'pay-1',
    billId: '1',
    roomNumber: '101',
    tenantName: 'สมชาย ใจดี',
    amount: 4330,
    paymentMethod: 'PROMPTPAY',
    slipUrl: 'https://placehold.co/300x400/1e293b/38bdf8?text=Slip+101',
    paidAt: '2026-07-02 10:30',
    status: 'VERIFIED',
  },
  {
    id: 'pay-2',
    billId: '2',
    roomNumber: '103',
    tenantName: 'วิภาดา รักสงบ',
    amount: 4544,
    paymentMethod: 'PROMPTPAY',
    slipUrl: 'https://placehold.co/300x400/1e293b/38bdf8?text=Slip+103',
    paidAt: '2026-07-05 14:15',
    status: 'PENDING',
  },
  {
    id: 'pay-3',
    billId: '3',
    roomNumber: 'B101',
    tenantName: 'กิตติพงษ์ มีสุข',
    amount: 5368,
    paymentMethod: 'CASH',
    status: 'PENDING',
  },
];