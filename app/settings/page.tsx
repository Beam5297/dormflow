'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { getDormSettings, saveDormSettings, DormSettings } from '@/services/settingsService';

export default function SettingsPage() {
  const [settings, setSettings] = useState<DormSettings>(getDormSettings());
  const [savedMsg, setSavedMsg] = useState(false);

  useEffect(() => {
    setSettings(getDormSettings());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveDormSettings(settings);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-20">
          <h2 className="text-base font-semibold text-slate-200">ตั้งค่าระบบหอพัก</h2>
        </header>

        <main className="p-6 max-w-4xl space-y-6">
          {savedMsg && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold animate-fade-in">
              ✓ บันทึกข้อมูลการตั้งค่าเรียบร้อยแล้ว!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ข้อมูลหอพัก */}
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-blue-400 border-b border-slate-800 pb-2">🏢 ข้อมูลหอพัก & หัวใบเสร็จ</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1">ชื่อหอพัก / อาคาร</label>
                  <input
                    type="text"
                    required
                    value={settings.dormName}
                    onChange={(e) => setSettings({ ...settings, dormName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">เบอร์โทรศัพท์ติดต่อ</label>
                  <input
                    type="text"
                    required
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-slate-300 mb-1">ที่อยู่หอพัก</label>
                  <input
                    type="text"
                    required
                    value={settings.address}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">เลขประจำตัวผู้เสียภาษี</label>
                  <input
                    type="text"
                    value={settings.taxId}
                    onChange={(e) => setSettings({ ...settings, taxId: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* อัตราค่าน้ำ ค่าไฟ */}
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-amber-400 border-b border-slate-800 pb-2">⚡ อัตราสาธารณูปโภคพื้นฐาน</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1">ค่าน้ำประปา (บาท / หน่วย)</label>
                  <input
                    type="number"
                    required
                    value={settings.defaultWaterRate}
                    onChange={(e) => setSettings({ ...settings, defaultWaterRate: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">ค่าไฟฟ้า (บาท / หน่วย)</label>
                  <input
                    type="number"
                    required
                    value={settings.defaultElectricRate}
                    onChange={(e) => setSettings({ ...settings, defaultElectricRate: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">กำหนดชำระภายในวันที่ (ของทุกเดือน)</label>
                  <input
                    type="number"
                    required
                    value={settings.dueDateDay}
                    onChange={(e) => setSettings({ ...settings, dueDateDay: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">ค่าปรับชำระล่าช้า (บาท)</label>
                  <input
                    type="number"
                    required
                    value={settings.lateFee}
                    onChange={(e) => setSettings({ ...settings, lateFee: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* บัญชีรับชำระเงิน */}
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-emerald-400 border-b border-slate-800 pb-2">💳 บัญชีธนาคารสำหรับรับโอนเงิน</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1">ชื่อธนาคาร</label>
                  <input
                    type="text"
                    required
                    value={settings.bankName}
                    onChange={(e) => setSettings({ ...settings, bankName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">เลขที่บัญชี</label>
                  <input
                    type="text"
                    required
                    value={settings.accountNumber}
                    onChange={(e) => setSettings({ ...settings, accountNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">ชื่อบัญชี</label>
                  <input
                    type="text"
                    required
                    value={settings.accountName}
                    onChange={(e) => setSettings({ ...settings, accountName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/20"
            >
              บันทึกการตั้งค่าทั้งหมด
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}