'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen bg-slate-950">
      {/* Sidebar เมนูทางซ้าย */}
      <Sidebar />

      {/* เนื้อหาหลักทางขวา */}
      <main className="flex-1 p-8 text-white">
        <h1 className="text-2xl font-bold mb-2">ตั้งค่าระบบ (Settings)</h1>
        <p className="text-slate-400 mb-6">จัดการข้อมูลหอพัก บัญชีธนาคาร และค่าน้ำค่าไฟได้ที่นี่</p>

        {/* ตัวอย่างกล่องตั้งค่า (สามารถปรับแต่งเพิ่มได้) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-2xl space-y-4">
          <h2 className="text-lg font-semibold text-slate-200 border-b border-slate-800 pb-3">
            ข้อมูลหอพัก
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">ชื่อหอพัก</label>
              <input 
                type="text" 
                defaultValue="BAN (DormFlow)" 
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">เบอร์โทรศัพท์</label>
              <input 
                type="text" 
                defaultValue="089-605-0124" 
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">ที่อยู่</label>
            <textarea 
              rows={2}
              defaultValue="354 หมู่ 1 ต.วัฒนานคร อ.วัฒนานคร จ.สระแก้ว 27160" 
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </main>
    </div>
  );
}