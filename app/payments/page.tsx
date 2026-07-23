'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { getBills, saveBills, BillData } from '@/services/storage';

export default function PaymentsPage() {
  const [bills, setBills] = useState<BillData[]>([]);

  useEffect(() => {
    setBills(getBills());
  }, []);

  // ฟังก์ชันเปลี่ยนสถานะชำระเงิน
  const togglePaymentStatus = (id: string) => {
    const updated = bills.map(bill => {
      if (bill.id === id) {
        const newStatus: 'paid' | 'pending' = bill.status === 'paid' ? 'pending' : 'paid';
        return { ...bill, status: newStatus };
      }
      return bill;
    });

    setBills(updated);
    saveBills(updated);
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <Sidebar />

      <main className="flex-1 p-8 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">ระบบตรวจสอบการชำระเงิน (Payments)</h1>
          <p className="text-slate-400 text-sm">ตรวจเช็กการโอนเงินและยืนยันรับชำระค่าเช่าประจำเดือน</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-800 text-slate-400">
                <tr>
                  <th className="p-3 rounded-l-xl">ห้อง</th>
                  <th className="p-3">ชื่อผู้เช่า</th>
                  <th className="p-3">ประจำเดือน</th>
                  <th className="p-3 text-right">ยอดที่ต้องชำระ</th>
                  <th className="p-3 text-center">สถานะ</th>
                  <th className="p-3 text-center">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {bills.map((bill) => (
                  <tr key={bill.id}>
                    <td className="p-3 font-semibold text-blue-400">ห้อง {bill.roomNumber}</td>
                    <td className="p-3 font-medium">{bill.tenantName}</td>
                    <td className="p-3 text-slate-400">{bill.month}</td>
                    <td className="p-3 text-right font-bold text-white">฿{bill.totalPrice.toLocaleString()}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        bill.status === 'paid' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {bill.status === 'paid' ? '✓ ชำระเงินแล้ว' : '⏳ รอชำระเงิน'}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => togglePaymentStatus(bill.id)}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                          bill.status === 'paid'
                            ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-600/20'
                        }`}
                      >
                        {bill.status === 'paid' ? 'ยกเลิกการชำระ' : 'ยืนยันรับชำระเงิน'}
                      </button>
                    </td>
                  </tr>
                ))}
                {bills.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center p-6 text-slate-500">ไม่มีรายการใบแจ้งหนี้ให้ตรวจสอบ</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}