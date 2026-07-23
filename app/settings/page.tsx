'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';

export default function SettingsPage() {
  // State สำหรับเก็บข้อมูลตั้งค่าระบบ
  const [formData, setFormData] = useState({
    // 1. ข้อมูลหอพัก
    dormName: 'BAN (DormFlow)',
    phone: '089-605-0124',
    address: '354 หมู่ 1 ต.วัฒนานคร อ.วัฒนานคร จ.สระแก้ว 27160',
    
    // 2. อัตราค่าน้ำ/ค่าไฟ/ส่วนกลาง (เริ่มต้น)
    waterRate: '18',
    electricRate: '8',
    commonFee: '100',

    // 3. ข้อมูลบัญชีธนาคารสำหรับรับโอน
    bankName: 'ttb (ทหารไทยธนชาต)',
    accountNo: '6792059567',
    accountName: 'นายมานะ จงบริบูรณ์',
    promptPay: '089-605-0124',
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // จำลองการบันทึกข้อมูล (นำไปเชื่อมกับ Database / LocalStorage ได้ในอนาคต)
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />

      <main className="flex-1 p-8 text-white max-w-5xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">ตั้งค่าระบบ (Settings)</h1>
            <p className="text-slate-400 text-sm">จัดการข้อมูลหอพัก อัตราค่าน้ำค่าไฟ และช่องทางชำระเงิน</p>
          </div>

          {/* แจ้งเตือนเมื่อบันทึกสำเร็จ */}
          {isSaved && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-4 py-2 rounded-xl animate-fade-in">
              ✓ บันทึกข้อมูลเรียบร้อยแล้ว!
            </div>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* ส่วนที่ 1: ข้อมูลหอพัก */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-semibold text-slate-200 border-b border-slate-800 pb-3 flex items-center gap-2">
              <span>🏢</span> ข้อมูลหอพัก
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">ชื่อหอพัก</label>
                <input 
                  type="text" 
                  name="dormName"
                  value={formData.dormName} 
                  onChange={handleChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">เบอร์โทรศัพท์</label>
                <input 
                  type="text" 
                  name="phone"
                  value={formData.phone} 
                  onChange={handleChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">ที่อยู่หอพัก</label>
              <textarea 
                rows={2}
                name="address"
                value={formData.address} 
                onChange={handleChange}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* ส่วนที่ 2: อัตราค่าน้ำ / ค่าไฟ / ส่วนกลาง (เริ่มต้น) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-semibold text-slate-200 border-b border-slate-800 pb-3 flex items-center gap-2">
              <span>⚡</span> อัตราค่าบริการพื้นฐาน (ต่อหน่วย)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">ค่าไฟ (บาท/หน่วย)</label>
                <input 
                  type="number" 
                  name="electricRate"
                  value={formData.electricRate} 
                  onChange={handleChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">ค่าน้ำ (บาท/หน่วย)</label>
                <input 
                  type="number" 
                  name="waterRate"
                  value={formData.waterRate} 
                  onChange={handleChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">ค่าส่วนกลาง / อื่นๆ (บาท)</label>
                <input 
                  type="number" 
                  name="commonFee"
                  value={formData.commonFee} 
                  onChange={handleChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* ส่วนที่ 3: บัญชีธนาคารสำหรับรับโอน */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-semibold text-slate-200 border-b border-slate-800 pb-3 flex items-center gap-2">
              <span>💳</span> บัญชีธนาคารชำระเงิน
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">ธนาคาร</label>
                <input 
                  type="text" 
                  name="bankName"
                  value={formData.bankName} 
                  onChange={handleChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">เลขที่บัญชี</label>
                <input 
                  type="text" 
                  name="accountNo"
                  value={formData.accountNo} 
                  onChange={handleChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">ชื่อบัญชี</label>
                <input 
                  type="text" 
                  name="accountName"
                  value={formData.accountName} 
                  onChange={handleChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">เบอร์ PromptPay (ถ้ามี)</label>
                <input 
                  type="text" 
                  name="promptPay"
                  value={formData.promptPay} 
                  onChange={handleChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* ปุ่มบันทึกข้อมูล */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm px-6 py-2.5 rounded-xl transition-colors shadow-lg shadow-blue-600/20"
            >
              💾 บันทึกการเปลี่ยนแปลง
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}