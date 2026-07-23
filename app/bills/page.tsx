'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { getSettings, getRooms, getBills, saveBills, BillData } from '@/services/storage';

export default function BillsPage() {
  const [bills, setBills] = useState<BillData[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});

  const [selectedRoom, setSelectedRoom] = useState('');
  const [month, setMonth] = useState('กรกฎาคม 2026');
  const [waterOld, setWaterOld] = useState(0);
  const [waterNew, setWaterNew] = useState(0);
  const [electricOld, setElectricOld] = useState(0);
  const [electricNew, setElectricNew] = useState(0);

  useEffect(() => {
    setSettings(getSettings());
    setRooms(getRooms());
    setBills(getBills());
  }, []);

  const waterUnits = Math.max(0, waterNew - waterOld);
  const waterTotal = waterUnits * (settings.waterRate || 0);

  const electricUnits = Math.max(0, electricNew - electricOld);
  const electricTotal = electricUnits * (settings.electricRate || 0);

  const currentRoom = rooms.find(r => r.roomNumber === selectedRoom);
  const rentPrice = currentRoom ? currentRoom.rentPrice : 0;
  const commonFee = settings.commonFee || 0;
  const grandTotal = rentPrice + waterTotal + electricTotal + commonFee;

  const handleCreateBill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom) return alert('กรุณาเลือกห้องพัก');

    const newBill: BillData = {
      id: Date.now().toString(),
      roomNumber: selectedRoom,
      tenantName: currentRoom?.tenantName || 'ผู้เช่า',
      month,
      rentPrice,
      waterOld,
      waterNew,
      waterPricePerUnit: settings.waterRate || 0,
      electricOld,
      electricNew,
      electricPricePerUnit: settings.electricRate || 0,
      otherPrice: commonFee,
      totalPrice: grandTotal,
      status: 'pending',
    };

    const updatedBills = [newBill, ...bills];
    setBills(updatedBills);
    saveBills(updatedBills);
    alert('บันทึกใบแจ้งหนี้เรียบร้อยแล้ว!');
  };

  // ฟังก์ชันส่งใบแจ้งหนี้เข้า LINE
  const handleSendLine = (bill: BillData) => {
    const text = `🏢 *ใบแจ้งค่าเช่าห้อง ${bill.roomNumber} (${settings.dormName})*
ประจำเดือน: ${bill.month}
คุณ: ${bill.tenantName}

ค่าห้อง: ฿${bill.rentPrice.toLocaleString()}
ค่าไฟ: ฿${((bill.electricNew - bill.electricOld) * bill.electricPricePerUnit).toLocaleString()}
ค่าน้ำ: ฿${((bill.waterNew - bill.waterOld) * bill.waterPricePerUnit).toLocaleString()}
ส่วนกลาง: ฿${bill.otherPrice.toLocaleString()}

*ยอดรวมสุทธิ: ฿${bill.totalPrice.toLocaleString()}*

โอนชำระได้ที่:
${settings.bankName} ${settings.accountNo} (${settings.accountName})
พร้อมเพย์: ${settings.promptPay}`;

    const lineUrl = `https://line.me/R/msg/text/?${encodeURIComponent(text)}`;
    window.open(lineUrl, '_blank');
  };

  // ฟังก์ชันพิมพ์ใบเสร็จ (handlePrintDirect)
  const handlePrintDirect = (bill: BillData) => {
    const wUnits = Math.max(0, bill.waterNew - bill.waterOld);
    const wTotal = wUnits * bill.waterPricePerUnit;
    const eUnits = Math.max(0, bill.electricNew - bill.electricOld);
    const eTotal = eUnits * bill.electricPricePerUnit;
    const qrPromptpayUrl = settings.promptPay 
      ? `https://promptpay.io/${settings.promptPay.replace(/-/g, '')}/${bill.totalPrice}.png` 
      : '';

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>พิมพ์ใบแจ้งค่าเช่า - ห้อง ${bill.roomNumber}</title>
          <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@400;600;700&display=swap" rel="stylesheet">
          <style>
            @page { size: auto; margin: 0; }
            body { font-family: 'Sarabun', sans-serif; padding: 20px; font-size: 12px; color: #000; }
            .bill-box { border: 2px solid #000; padding: 18px; max-width: 650px; margin: 0 auto; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #000; padding-bottom: 8px; margin-bottom: 10px; }
            .header h1 { margin: 0; font-size: 18px; }
            .header h2 { margin: 0; font-size: 16px; }
            .info { display: flex; justify-content: space-between; margin-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
            th, td { padding: 5px; text-align: left; }
            th { border-top: 1px solid #000; border-bottom: 1px solid #000; }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
            .payment-section { display: flex; justify-content: space-between; align-items: center; border-top: 2px solid #000; padding-top: 10px; margin-top: 10px; }
            .qr-code { text-align: center; }
            .qr-code img { width: 110px; height: 110px; border: 1px solid #ccc; padding: 3px; }
          </style>
        </head>
        <body>
          <div class="bill-box">
            <div class="header">
              <div>
                <h1>${settings.dormName || 'BAN (DormFlow)'}</h1>
                <p style="margin: 2px 0 0 0; font-size: 10px;">${settings.address}</p>
                <p style="margin: 0; font-size: 10px;">โทรศัพท์: ${settings.phone}</p>
              </div>
              <div><h2>- ใบแจ้งค่าเช่า -</h2></div>
            </div>
            <div class="info">
              <span><strong>ชื่อผู้เช่า:</strong> ${bill.tenantName} | <strong>ห้อง:</strong> ${bill.roomNumber}</span>
              <span><strong>ประจำเดือน:</strong> ${bill.month}</span>
            </div>
            <table>
              <thead>
                <tr>
                  <th class="text-center" style="width: 35px;">ลำดับ</th>
                  <th>รายการ</th>
                  <th class="text-right">หน่วย</th>
                  <th class="text-right">ราคา/หน่วย</th>
                  <th class="text-right">จำนวนเงิน</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="text-center">1</td>
                  <td>อัตราค่าห้องพัก</td>
                  <td class="text-right">1.00</td>
                  <td class="text-right">${bill.rentPrice.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
                  <td class="text-right">${bill.rentPrice.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
                </tr>
                <tr>
                  <td class="text-center">2</td>
                  <td>ค่าไฟฟ้า (${bill.electricOld} - ${bill.electricNew})</td>
                  <td class="text-right">${eUnits.toFixed(2)}</td>
                  <td class="text-right">${bill.electricPricePerUnit.toFixed(2)}</td>
                  <td class="text-right">${eTotal.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
                </tr>
                <tr>
                  <td class="text-center">3</td>
                  <td>ค่าน้ำประปา (${bill.waterOld} - ${bill.waterNew})</td>
                  <td class="text-right">${wUnits.toFixed(2)}</td>
                  <td class="text-right">${bill.waterPricePerUnit.toFixed(2)}</td>
                  <td class="text-right">${wTotal.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
                </tr>
                <tr>
                  <td class="text-center">4</td>
                  <td>ส่วนกลาง / อื่นๆ</td>
                  <td class="text-right">1.00</td>
                  <td class="text-right">${bill.otherPrice.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
                  <td class="text-right">${bill.otherPrice.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
                </tr>
              </tbody>
            </table>
            <div class="payment-section">
              <div>
                <p style="margin: 0 0 4px 0; font-weight: bold;">ช่องทางการชำระเงิน:</p>
                <p style="margin: 0; font-size: 11px;">ธนาคาร: ${settings.bankName}</p>
                <p style="margin: 0; font-size: 11px;">เลขบัญชี: <strong>${settings.accountNo}</strong></p>
                <p style="margin: 0; font-size: 11px;">ชื่อบัญชี: ${settings.accountName}</p>
              </div>
              ${qrPromptpayUrl ? `
                <div class="qr-code">
                  <img src="${qrPromptpayUrl}" alt="PromptPay QR Code">
                  <p style="margin: 2px 0 0 0; font-size: 9px;">สแกนเพื่อจ่าย ฿${bill.totalPrice.toLocaleString()}</p>
                </div>
              ` : ''}
              <div style="text-align: right;">
                <span style="font-size: 14px; font-weight: bold;">รวมทั้งสิ้น: ฿${bill.totalPrice.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      };
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <Sidebar />
      <main className="flex-1 p-8 max-w-6xl">
        <h1 className="text-2xl font-bold mb-6">คำนวณมิเตอร์ & ออกใบแจ้งหนี้ (Bills)</h1>

        <form onSubmit={handleCreateBill} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8 space-y-4">
          <h2 className="text-lg font-semibold border-b border-slate-800 pb-3">📝 จดมิเตอร์ประจำเดือน</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">เลือกห้องพัก</label>
              <select value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white">
                <option value="">-- เลือกห้องพัก --</option>
                {rooms.map(r => (
                  <option key={r.id} value={r.roomNumber}>ห้อง {r.roomNumber} ({r.tenantName || 'ไม่มีผู้เช่า'})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">ประจำเดือน</label>
              <input type="text" value={month} onChange={e => setMonth(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="bg-slate-800/50 p-4 rounded-xl space-y-3 border border-slate-700/50">
              <span className="text-sm font-semibold text-blue-400">💧 ค่าน้ำประปา (อัตรา {settings.waterRate} บาท/หน่วย)</span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-slate-400">เลขครั้งก่อน</label>
                  <input type="number" value={waterOld} onChange={e => setWaterOld(Number(e.target.value))} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400">เลขครั้งนี้</label>
                  <input type="number" value={waterNew} onChange={e => setWaterNew(Number(e.target.value))} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm" />
                </div>
              </div>
              <div className="text-xs text-slate-300 text-right">ใช้ไป {waterUnits} หน่วย = <span className="font-bold text-white">{waterTotal.toLocaleString()} บาท</span></div>
            </div>

            <div className="bg-slate-800/50 p-4 rounded-xl space-y-3 border border-slate-700/50">
              <span className="text-sm font-semibold text-amber-400">⚡ ค่าไฟฟ้า (อัตรา {settings.electricRate} บาท/หน่วย)</span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-slate-400">เลขครั้งก่อน</label>
                  <input type="number" value={electricOld} onChange={e => setElectricOld(Number(e.target.value))} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400">เลขครั้งนี้</label>
                  <input type="number" value={electricNew} onChange={e => setElectricNew(Number(e.target.value))} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm" />
                </div>
              </div>
              <div className="text-xs text-slate-300 text-right">ใช้ไป {electricUnits} หน่วย = <span className="font-bold text-white">{electricTotal.toLocaleString()} บาท</span></div>
            </div>
          </div>

          <div className="flex justify-between items-center bg-blue-950/40 border border-blue-500/20 p-4 rounded-xl">
            <div>
              <span className="text-xs text-slate-400">ยอดรวมทั้งหมด (รวมค่าห้อง {rentPrice.toLocaleString()} + ส่วนกลาง {commonFee.toLocaleString()})</span>
              <div className="text-2xl font-bold text-blue-400">฿{grandTotal.toLocaleString()}</div>
            </div>
            <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-6 py-2.5 rounded-xl shadow-lg shadow-blue-600/20">
              ➕ ออกใบแจ้งหนี้
            </button>
          </div>
        </form>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">📄 รายการใบแจ้งหนี้ล่าสุด</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-800 text-slate-400">
                <tr>
                  <th className="p-3 rounded-l-xl">ห้อง</th>
                  <th className="p-3">ผู้เช่า</th>
                  <th className="p-3">ประจำเดือน</th>
                  <th className="p-3 text-right">ยอดรวม</th>
                  <th className="p-3 text-center">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {bills.map((bill) => (
                  <tr key={bill.id}>
                    <td className="p-3 font-semibold">ห้อง {bill.roomNumber}</td>
                    <td className="p-3">{bill.tenantName}</td>
                    <td className="p-3 text-slate-400">{bill.month}</td>
                    <td className="p-3 text-right font-bold text-emerald-400">฿{bill.totalPrice.toLocaleString()}</td>
                    <td className="p-3 text-center space-x-2">
                      <button
                        onClick={() => handlePrintDirect(bill)}
                        className="bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        🖨️ พิมพ์
                      </button>
                      <button
                        onClick={() => handleSendLine(bill)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-xs text-white px-3 py-1.5 rounded-lg transition-colors"
                      >
                        🟢 ส่ง LINE
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