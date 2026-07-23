'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { mockPayments, PaymentRecord } from '@/services/paymentService';
import { PaymentModal } from '@/components/PaymentModal';

export default function PaymentsPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>(mockPayments);
  const [search, setSearch] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredPayments = payments.filter((p) =>
    p.roomNumber.toLowerCase().includes(search.toLowerCase()) ||
    p.tenantName.toLowerCase().includes(search.toLowerCase())
  );

  const handleConfirmPayment = (paymentId: string) => {
    setPayments(
      payments.map((p) =>
        p.id === paymentId
          ? { ...p, status: 'VERIFIED', paidAt: new Date().toLocaleString('th-TH') }
          : p
      )
    );
  };

  const renderBadge = (status: string) => {
    if (status === 'VERIFIED')
      return <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">ชำระแล้ว</span>;
    if (status === 'PENDING')
      return <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">รอตรวจสอบ</span>;
    return <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">ปฏิเสธ</span>;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-20">
          <h2 className="text-base font-semibold text-slate-200">รับชำระเงิน & ตรวจสลิป</h2>
        </header>

        <main className="p-6 space-y-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <input
              type="text"
              placeholder="ค้นหาเลขห้อง, ชื่อผู้เช่า..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-blue-500 w-full sm:w-60"
            />
          </div>

          <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3.5">ห้อง</th>
                  <th className="px-5 py-3.5">ผู้เช่า</th>
                  <th className="px-5 py-3.5">ยอดชำระ</th>
                  <th className="px-5 py-3.5">ช่องทาง</th>
                  <th className="px-5 py-3.5">เวลาชำระเงิน</th>
                  <th className="px-5 py-3.5">สถานะ</th>
                  <th className="px-5 py-3.5 text-right">ดำเนินการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/40">
                    <td className="px-5 py-3.5 font-bold text-blue-400">ห้อง {p.roomNumber}</td>
                    <td className="px-5 py-3.5 font-medium text-slate-100">{p.tenantName}</td>
                    <td className="px-5 py-3.5 font-bold text-slate-100">฿{p.amount.toLocaleString()}</td>
                    <td className="px-5 py-3.5 text-slate-400">
                      {p.paymentMethod === 'PROMPTPAY' ? '📱 PromptPay' : '💵 เงินสด'}
                    </td>
                    <td className="px-5 py-3.5 text-slate-400">{p.paidAt || 'ยังไม่ได้ชำระ'}</td>
                    <td className="px-5 py-3.5">{renderBadge(p.status)}</td>
                    <td className="px-5 py-3.5 text-right">
                      {p.status === 'PENDING' ? (
                        <button
                          onClick={() => {
                            setSelectedPayment(p);
                            setIsModalOpen(true);
                          }}
                          className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-[11px] shadow-sm shadow-emerald-600/20"
                        >
                          รับชำระ / ตรวจสลิป
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-500 font-medium">✓ เสร็จสิ้น</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmPayment}
        payment={selectedPayment}
      />
    </div>
  );
}