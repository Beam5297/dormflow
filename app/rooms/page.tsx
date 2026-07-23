'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { getRooms, saveRooms, RoomData } from '@/services/roomService';

export default function RoomsPage() {
  const [rooms, setRooms] = useState<RoomData[]>([]);
  const [roomNumber, setRoomNumber] = useState('');
  const [rentPrice, setRentPrice] = useState<number>(3500);
  const [status, setStatus] = useState('ห้องว่าง');
  const [tenantName, setTenantName] = useState('');

  const loadData = async () => {
    const data = await getRooms();
    setRooms(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomNumber) return alert('กรุณากรอกหมายเลขห้อง');

    const newRoom: RoomData = {
      id: Date.now().toString(),
      roomNumber,
      rentPrice: Number(rentPrice) || 0,
      status,
      tenantName: status === 'มีผู้เช่า' ? tenantName : '',
    };

    const updated = [newRoom, ...rooms];
    setRooms(updated);
    await saveRooms(updated);

    setRoomNumber('');
    setTenantName('');
    alert('บันทึกห้องพักลง Supabase เรียบร้อยแล้ว!');
  };

  const handleDeleteRoom = async (id: string) => {
    if (!confirm('คุณต้องการลบห้องนี้ใช่หรือไม่?')) return;
    const updated = rooms.filter(r => r.id !== id);
    setRooms(updated);
    await saveRooms(updated);
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <Sidebar />
      <main className="flex-1 p-8 max-w-6xl">
        <h1 className="text-2xl font-bold mb-6">จัดการห้องพัก (Rooms)</h1>

        <form onSubmit={handleAddRoom} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8 space-y-4">
          <h2 className="text-lg font-semibold border-b border-slate-800 pb-3">➕ เพิ่มห้องพักใหม่</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">หมายเลขห้อง</label>
              <input
                type="text"
                placeholder="เช่น 101"
                value={roomNumber}
                onChange={e => setRoomNumber(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">ค่าเช่า (บาท/เดือน)</label>
              <input
                type="number"
                value={rentPrice}
                onChange={e => setRentPrice(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">สถานะห้อง</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
              >
                <option value="ห้องว่าง">🟢 ห้องว่าง</option>
                <option value="มีผู้เช่า">🔴 มีผู้เช่า</option>
              </select>
            </div>
          </div>

          {status === 'มีผู้เช่า' && (
            <div>
              <label className="block text-xs text-slate-400 mb-1">ชื่อผู้เช่า</label>
              <input
                type="text"
                placeholder="ระบุชื่อผู้เช่า"
                value={tenantName}
                onChange={e => setTenantName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
              />
            </div>
          )}

          <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-6 py-2.5 rounded-xl shadow-lg shadow-blue-600/20">
            บันทึกห้องพัก
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {rooms.map(room => (
            <div key={room.id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold">ห้อง {room.roomNumber}</h3>
                  <button onClick={() => handleDeleteRoom(room.id)} className="text-slate-500 hover:text-red-400 p-1">
                    🗑️
                  </button>
                </div>
                <p className="text-sm text-slate-400 mb-3">฿{room.rentPrice.toLocaleString()} / เดือน</p>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                <span className={`text-xs px-2.5 py-1 rounded-full ${room.status === 'มีผู้เช่า' ? 'bg-red-950/60 text-red-400 border border-red-800/50' : 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/50'}`}>
                  {room.status} {room.tenantName ? `(${room.tenantName})` : ''}
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}