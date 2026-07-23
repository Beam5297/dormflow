'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { getTenants, saveTenants, getRooms, saveRooms, TenantData } from '@/services/storage';

export default function TenantsPage() {
  const [tenants, setTenants] = useState<TenantData[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [startDate, setStartDate] = useState('');

  useEffect(() => {
    setTenants(getTenants());
    setRooms(getRooms());
  }, []);

  const handleAddTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !roomNumber) return alert('กรุณากรอกชื่อและเลือกห้องพัก');

    const newTenant: TenantData = {
      id: Date.now().toString(),
      name,
      phone,
      roomNumber,
      startDate: startDate || new Date().toISOString().split('T')[0],
    };

    const updatedTenants = [...tenants, newTenant];
    setTenants(updatedTenants);
    saveTenants(updatedTenants);

    // อัปเดตสถานะห้องใน Rooms เป็น occupied
    const updatedRooms = rooms.map(r => r.roomNumber === roomNumber ? { ...r, status: 'occupied' as const, tenantName: name } : r);
    setRooms(updatedRooms);
    saveRooms(updatedRooms);

    setName('');
    setPhone('');
    setRoomNumber('');
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <Sidebar />
      <main className="flex-1 p-8 max-w-6xl">
        <h1 className="text-2xl font-bold mb-6">จัดการผู้เช่า (Tenants)</h1>

        {/* ฟอร์มเพิ่มผู้เช่า */}
        <form onSubmit={handleAddTenant} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8 space-y-4">
          <h2 className="text-lg font-semibold">👤 ทำสัญญา / เพิ่มผู้เช่าใหม่</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">ชื่อ-นามสกุล</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">เบอร์โทรศัพท์</label>
              <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">เลือกห้องพัก</label>
              <select value={roomNumber} onChange={e => setRoomNumber(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm">
                <option value="">-- เลือกห้องพัก --</option>
                {rooms.map(r => (
                  <option key={r.id} value={r.roomNumber}>ห้อง {r.roomNumber} ({r.status === 'vacant' ? 'ว่าง' : 'มีผู้เช่า'})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">วันที่เริ่มเข้าอยู่</label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm" />
            </div>
          </div>
          <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm px-6 py-2 rounded-xl">บันทึกผู้เช่า</button>
        </form>

        {/* รายชื่อผู้เช่า */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">📋 รายชื่อผู้เช่าปัจจุบัน</h2>
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800 text-slate-400">
              <tr>
                <th className="p-3 rounded-l-xl">ห้อง</th>
                <th className="p-3">ชื่อผู้เช่า</th>
                <th className="p-3">เบอร์โทร</th>
                <th className="p-3">วันเริ่มสัญญา</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {tenants.map(t => (
                <tr key={t.id}>
                  <td className="p-3 font-semibold text-blue-400">ห้อง {t.roomNumber}</td>
                  <td className="p-3 font-medium">{t.name}</td>
                  <td className="p-3 text-slate-400">{t.phone}</td>
                  <td className="p-3 text-slate-400">{t.startDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}