'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { getBills, saveBills, BillData } from '@/services/storage';

export default function PaymentsPage() {
  const [bills, setBills] = useState<BillData[]>([]);
  const [isScanning, setIsScanning] = useState<string | null>(null);

  useEffect(() => {
    setBills(getBills());
  }, []);

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

  // 1. ฟังก์ชันสแกนอ่านสลิปโอนเงิน (Slip Verification API Simulation)
  const handleSimulateSlipScan = (id: string) => {
    setIsScanning(id);
    setTimeout(() => {
      setIsScanning(null);
      const updated = bills.map(bill => bill.id === id ? { ...bill, status: 'paid' as const } : bill);
      setBills(updated);
      saveBills(updated);
      alert('✓ สแกนตรวจสลิปสำเร็จ! ยอดเงินถูกต้อง ระบบปรับสถานะเป็น "ชำระแล้ว"');
    }, 1500);
  };

  // 2. ฟังก์ชัน Export เป็นไฟล์ Excel / CSV
  const handleExportCSV = () => {
    if (bills.length === 0) return alert('ไม่มีข้อมูลสำหรับ Export');

    let csvContent = '\uFEFF'; // UTF-8 BOM
    csvContent += 'ห้อง,ชื่อผู้เช่า,ประจำเดือน,ค่าห้อง,ค่าน้ำ,ค่าไฟ,ส่วนกลาง,ยอดรวมสุทธิ,สถานะ\n';

    bills.forEach(b => {
      const wTotal = (b.waterNew - b.waterOld) * b.waterPricePerUnit;
      const eTotal = (b.electricNew - b.electricOld) * b.electricPricePerUnit;
      const statusText = b.status === 'paid' ? 'ชำระแล้ว' : 'รอชำระ';

      csvContent += `"${b.roomNumber}","${b.tenantName}","${b.month}",${b.rentPrice},${wTotal},${eTotal},${b.otherPrice},${b.totalPrice},"${statusText}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `รายงานรายรับ_DormFlow_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <Sidebar />

      <main className="flex-1 p-8 max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">ระบบตรวจสอบการชำระเงิน & สแกนสลิป</h1>
            <p className="text-slate-400 text-sm">ตรวจเช็กการโอนเงิน สแกนสลิปอัตโนมัติ และ Export รายงาน</p>
          </div>

          <button
            onClick={handleExportCSV}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2"
          >
            📊 Export รายงาน Excel (CSV)
          </button>
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
                  <th className="p-3 text-center">จัดการ & ตรวจสลิป</th>
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
                    <td className="p-3 text-center space-x-2">
                      {bill.status === 'pending' && (
                        <button
                          onClick={() => handleSimulateSlipScan(bill.id)}
                          disabled={isScanning === bill.id}
                          className="bg-blue-600 hover:bg-blue-500 text-xs text-white px-3 py-1.5 rounded-lg transition-colors"
                        >
                          {isScanning === bill.id ? '🔍 กำลังสแกน...' : '📱 สแกนตรวจสลิป'}
                        </button>
                      )}
                      <button
                        onClick={() => togglePaymentStatus(bill.id)}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                          bill.status === 'paid'
                            ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                        }`}
                      >
                        {bill.status === 'paid' ? 'เปลี่ยนเป็นรอชำระ' : 'อนุมัติสลิปแบบ Manual'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}