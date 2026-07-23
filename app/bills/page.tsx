'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { mockBills, Bill } from '@/services/billService';
import { BillModal } from '@/components/BillModal';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function BillsPage() {
  const [bills, setBills] = useState<Bill[]>(mockBills);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBill, setEditingBill] = useState<Bill | null>(null);

  const filteredBills = bills.filter((bill) => {
    const matchSearch =
      bill.roomNumber.toLowerCase().includes(search.toLowerCase()) ||
      bill.tenantName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || bill.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleSaveBill = (savedBill: Bill) => {
    if (editingBill) {
      setBills(bills.map((b) => (b.id === savedBill.id ? savedBill : b)));
    } else {
      setBills([...bills, savedBill]);
    }
  };

  const handleEdit = (bill: Bill) => {
    setEditingBill(bill);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('คุณต้องการลบบิลนี้ใช่หรือไม่?')) {
      setBills(bills.filter((b) => b.id !== id));
    }
  };

  // ฟังก์ชันสร้าง PDF ใบแจ้งค่าเช่าสไตล์ใหม่ (ขนาด A5 ครึ่ง A4)
  const handleExportPDF = async (bill: Bill) => {
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.top = '-9999px';
    container.style.left = '-9999px';
    container.style.width = '700px';
    container.style.padding = '24px';
    container.style.backgroundColor = '#ffffff';
    container.style.color = '#1e293b';
    container.style.fontFamily = "'Sarabun', 'Tahoma', 'Arial', sans-serif";
    container.style.boxSizing = 'border-box';

    const waterUnits = Math.max(0, bill.waterNew - bill.waterOld);
    const waterTotal = waterUnits * bill.waterPricePerUnit;
    const electricUnits = Math.max(0, bill.electricNew - bill.electricOld);
    const electricTotal = electricUnits * bill.electricPricePerUnit;

    container.innerHTML = `
      <div style="border: 2px solid #3b82f6; border-radius: 12px; padding: 20px; background: #ffffff; font-size: 12px; color: #1e293b;">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; border-bottom: 2px solid #3b82f6; padding-bottom: 12px;">
          <div>
            <h1 style="margin: 0; font-size: 22px; font-weight: 800; color: #1e40af; text-transform: uppercase;">BAN (DormFlow)</h1>
            <p style="margin: 4px 0 0 0; color: #475569; font-size: 11px;">ที่อยู่ 354 หมู่ 1 (บ้านพร้าว) ต.วัฒนานคร อ.วัฒนานคร จ.สระแก้ว 27160</p>
            <p style="margin: 2px 0 0 0; color: #475569; font-size: 11px;">โทรศัพท์: 089-605-0124</p>
          </div>
          <div style="text-align: right;">
            <h2 style="margin: 0; font-size: 20px; font-weight: 800; color: #1e40af;">- ใบแจ้งค่าเช่า -</h2>
            <p style="margin: 4px 0 0 0; color: #64748b; font-size: 10px;">เลขประจำตัวผู้เสียภาษี: XXXXXXXXXXXXX</p>
          </div>
        </div>

        <!-- Info Box -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
          <div style="border: 1px solid #cbd5e1; background-color: #f8fafc; border-radius: 8px; padding: 10px 12px;">
            <p style="margin: 0 0 4px 0;"><strong>ชื่อผู้เช่า:</strong> <span style="color: #2563eb; font-weight: bold;">${bill.tenantName}</span></p>
            <p style="margin: 0;"><strong>หมายเลขห้อง:</strong> <span style="background-color: #dbeafe; color: #1e40af; padding: 2px 8px; border-radius: 4px; font-weight: bold;">${bill.roomNumber}</span></p>
          </div>
          <div style="border: 1px solid #cbd5e1; background-color: #f8fafc; border-radius: 8px; padding: 10px 12px;">
            <p style="margin: 0 0 4px 0;"><strong>วันที่พิมพ์:</strong> ${new Date().toLocaleDateString('th-TH')}</p>
            <p style="margin: 0;"><strong>ประจำเดือน:</strong> ${bill.month}</p>
          </div>
        </div>

        <!-- Table -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 11px;">
          <thead>
            <tr style="background-color: #1e40af; color: #ffffff; text-align: left;">
              <th style="padding: 8px; border: 1px solid #1e40af; width: 40px; text-align: center;">ลำดับ</th>
              <th style="padding: 8px; border: 1px solid #1e40af;">รายละเอียด ITEM / DESCRIPTION</th>
              <th style="padding: 8px; border: 1px solid #1e40af; width: 80px; text-align: right;">จำนวนหน่วย</th>
              <th style="padding: 8px; border: 1px solid #1e40af; width: 85px; text-align: right;">ราคา/หน่วย</th>
              <th style="padding: 8px; border: 1px solid #1e40af; width: 100px; text-align: right;">จำนวนเงิน (บาท)</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: center;">1.</td>
              <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: 600;">อัตราค่าห้องพัก</td>
              <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: right;">1.00</td>
              <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: right;">${bill.rentPrice.toFixed(2)}</td>
              <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: right; font-weight: 600;">${bill.rentPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0; background-color: #f8fafc;">
              <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: center;">2.</td>
              <td style="padding: 8px; border: 1px solid #e2e8f0;">ค่าไฟฟ้า (${bill.electricOld} - ${bill.electricNew} หน่วย)</td>
              <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: right;">${electricUnits.toFixed(2)}</td>
              <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: right;">${bill.electricPricePerUnit.toFixed(2)}</td>
              <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: right; font-weight: 600;">${electricTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: center;">3.</td>
              <td style="padding: 8px; border: 1px solid #e2e8f0;">ค่าน้ำประปา (${bill.waterOld} - ${bill.waterNew} หน่วย)</td>
              <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: right;">${waterUnits.toFixed(2)}</td>
              <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: right;">${bill.waterPricePerUnit.toFixed(2)}</td>
              <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: right; font-weight: 600;">${waterTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0; background-color: #f8fafc;">
              <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: center;">4.</td>
              <td style="padding: 8px; border: 1px solid #e2e8f0;">ค่าบริการส่วนกลาง / อื่นๆ</td>
              <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: right;">1.00</td>
              <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: right;">${bill.otherPrice.toFixed(2)}</td>
              <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: right; font-weight: 600;">${bill.otherPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
            </tr>
          </tbody>
        </table>

        <!-- Summary & Signatures -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 16px;">
          <div style="flex: 1; border: 1px solid #fef3c7; background-color: #fffbebfb; border-radius: 8px; padding: 10px; font-size: 10px; color: #475569;">
            <p style="margin: 0 0 4px 0; font-weight: bold; color: #b45309;">หมายเหตุ / เงื่อนไขการชำระเงิน:</p>
            <p style="margin: 0 0 2px 0;">[1] กรุณาชำระเงินภายในวันที่ 5 ของทุกเดือน</p>
            <p style="margin: 0 0 2px 0;">[2] หากเกินกำหนด จะต้องชำระค่าปรับล่าช้าตามข้อกำหนด 100 บาท</p>
            <p style="margin: 0; font-weight: bold; color: #1e40af;">[3] ชำระเงินธนาคาร ทหารไทยธนชาต เลขที่บัญชี 6792059567 นายมานะ จงบริบูรณ์</p>
          </div>

          <div style="width: 260px; text-align: right;">
            <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 10px; margin-bottom: 16px;">
              <span style="font-size: 12px; font-weight: bold; color: #1e40af; display: block;">รวมจำนวนเงินทั้งสิ้น</span>
              <span style="font-size: 22px; font-weight: 800; color: #2563eb;">฿${bill.totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>

            <div style="text-align: center; margin-top: 20px;">
              <p style="margin: 0 0 35px 0; color: #64748b; font-size: 11px;">..........................................................</p>
              <p style="margin: 0; font-weight: bold; color: #475569; font-size: 11px;">( ผู้รับเงิน )</p>
            </div>
          </div>
        </div>

      </div>
    `;

    document.body.appendChild(container);

    try {
      const canvas = await html2canvas(container, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a5',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`ใบแจ้งค่าเช่า_ห้อง${bill.roomNumber}_${bill.month}.pdf`);
    } catch (err) {
      console.error('Export PDF Error:', err);
    } finally {
      document.body.removeChild(container);
    }
  };

  const renderBadge = (status: string) => {
    if (status === 'PAID')
      return <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">ชำระแล้ว</span>;
    if (status === 'PENDING')
      return <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">รอชำระ</span>;
    return <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">เกินกำหนด</span>;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-20">
          <h2 className="text-base font-semibold text-slate-200">ออกบิล & ค่าเช่า</h2>
          <button
            onClick={() => {
              setEditingBill(null);
              setIsModalOpen(true);
            }}
            className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium shadow-md shadow-blue-600/20"
          >
            ＋ ออกบิลประจำเดือน
          </button>
        </header>

        <main className="p-6 space-y-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap gap-3 items-center">
            <input
              type="text"
              placeholder="ค้นหาเลขห้อง, ชื่อผู้เช่า..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-blue-500 w-full sm:w-60"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">ทุกสถานะชำระเงิน</option>
              <option value="PENDING">รอชำระ</option>
              <option value="PAID">ชำระแล้ว</option>
              <option value="OVERDUE">เกินกำหนด</option>
            </select>
          </div>

          <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3.5">ห้อง</th>
                  <th className="px-5 py-3.5">ผู้เช่า</th>
                  <th className="px-5 py-3.5">ประจำเดือน</th>
                  <th className="px-5 py-3.5">ค่าน้ำ / ค่าไฟ</th>
                  <th className="px-5 py-3.5">ยอดรวมสุทธิ</th>
                  <th className="px-5 py-3.5">สถานะ</th>
                  <th className="px-5 py-3.5 text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredBills.map((bill) => (
                  <tr key={bill.id} className="hover:bg-slate-800/40">
                    <td className="px-5 py-3.5 font-bold text-blue-400">ห้อง {bill.roomNumber}</td>
                    <td className="px-5 py-3.5 font-medium text-slate-100">{bill.tenantName}</td>
                    <td className="px-5 py-3.5 text-slate-400">{bill.month}</td>
                    <td className="px-5 py-3.5 text-slate-400">
                      💧 {bill.waterNew - bill.waterOld} ย. / ⚡ {bill.electricNew - bill.electricOld} ย.
                    </td>
                    <td className="px-5 py-3.5 font-bold text-slate-100 text-sm">
                      ฿{bill.totalPrice.toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5">{renderBadge(bill.status)}</td>
                    <td className="px-5 py-3.5 text-right space-x-1.5">
                      <button
                        onClick={() => handleExportPDF(bill)}
                        className="px-2.5 py-1 rounded bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-[11px]"
                      >
                        📄 PDF
                      </button>
                      <button
                        onClick={() => handleEdit(bill)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px]"
                      >
                        แก้ไข
                      </button>
                      <button
                        onClick={() => handleDelete(bill.id)}
                        className="px-2.5 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-[11px]"
                      >
                        ลบ
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      <BillModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveBill}
        initialData={editingBill}
      />
    </div>
  );
}