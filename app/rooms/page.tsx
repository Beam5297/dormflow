'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { getRooms, saveRooms, RoomData } from '@/services/storage';

export default function RoomsPage() {
  const [rooms, setRooms] = useState<RoomData[]>([]);
  const [roomNumber, setRoomNumber] = useState('');
  const [rentPrice, setRentPrice] = useState(3500);
  const [status, setStatus] = useState<'vacant' | 'occupied' | 'maintenance'>('vacant');

  useEffect(() => {
    setRooms(getRooms());
  }, []);

  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomNumber) return alert('กรุณากรอกเลขห้อง');

    const newRoom: RoomData = {
      id: Date.now().toString(),
      roomNumber,
      rentPrice,
      status,
    };

    const updated = [...rooms, newRoom];
    setRooms(updated);
    saveRooms(updated);
    setRoomNumber('');
  };

  const handleDelete = (id: string) => {
    if (confirm('คุณต้องการลบห้องนี้ใช่ไหม?')) {
      const updated = rooms.filter(r => r.id !== id);
      setRooms(updated);
      saveRooms(updated);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <Sidebar />
      <main className="flex-1 p-8 max-w-6xl">
        <h1 className="text-2xl font-bold mb-6">จัดการห้องพัก (Rooms)</h1>

        {/* ฟอร์มเพิ่มห้อง */}
        <form onSubmit={handleAddRoom} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">➕ เพิ่มห้องพักใหม่</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">หมายเลขห้อง</label>
              <input type="text" value={roomNumber} onChange={e => setRoomNumber(e.target.value)} placeholder="เช่น 101" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">ค่าเช่า (บาท/เดือน)</label>
              <input type="number" value={rentPrice} onChange={e => setRentPrice(Number(e.target.value))} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">สถานะห้อง</label>
              <select value={status} onChange={e => setStatus(e.target.value as any)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm">
                <option value="vacant">🟢 ห้องว่าง</option>
                <option value="occupied">🔴 มีผู้เช่าแล้ว</option>
                <option value="maintenance">🟡 ปรับปรุง</option>
              </select>
            </div>
          </div>
          <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm px-6 py-2 rounded-xl">บันทึกห้องพัก</button>
        </form>

        {/* รายการห้องพัก */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {rooms.map(room => (
            <div key={room.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex justify-between items-center">
              <div>
                <span className="text-xl font-bold">ห้อง {room.roomNumber}</span>
                <p className="text-xs text-slate-400">฿{room.rentPrice.toLocaleString()} / เดือน</p>
                <span className={`inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full font-medium ${
                  room.status === 'vacant' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                  room.status === 'occupied' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                  'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}>
                  {room.status === 'vacant' ? 'ห้องว่าง' : room.status === 'occupied' ? `มีผู้เช่า (${room.tenantName || '-'})` : 'ปรับปรุง'}
                </span>
              </div>
              <button onClick={() => handleDelete(room.id)} className="text-xs text-slate-500 hover:text-rose-400 p-2">🗑️</button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}