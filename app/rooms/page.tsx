'use client';

import React, { useState } from 'react';
import  Sidebar  from '@/components/Sidebar';
import { mockRooms, Room } from '@/services/roomService';
import { RoomModal } from '@/components/RoomModal';

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>(mockRooms);
  const [search, setSearch] = useState('');
  const [buildingFilter, setBuildingFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  const filteredRooms = rooms.filter((room) => {
    const matchSearch = room.roomNumber.toLowerCase().includes(search.toLowerCase());
    const matchBuilding = buildingFilter === 'ALL' || room.building === buildingFilter;
    const matchStatus = statusFilter === 'ALL' || room.status === statusFilter;
    return matchSearch && matchBuilding && matchStatus;
  });

  const handleSaveRoom = (savedRoom: Room) => {
    if (editingRoom) {
      setRooms(rooms.map((r) => (r.id === savedRoom.id ? savedRoom : r)));
    } else {
      setRooms([...rooms, savedRoom]);
    }
  };

  const handleEdit = (room: Room) => {
    setEditingRoom(room);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('คุณต้องการลบห้องพักนี้ใช่หรือไม่?')) {
      setRooms(rooms.filter((r) => r.id !== id));
    }
  };

  const renderBadge = (status: string) => {
    if (status === 'VACANT') return <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">ห้องว่าง</span>;
    if (status === 'OCCUPIED') return <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">มีผู้เช่า</span>;
    return <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">ปิดปรับปรุง</span>;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-20">
          <h2 className="text-base font-semibold text-slate-200">จัดการห้องพัก</h2>
          <button
            onClick={() => {
              setEditingRoom(null);
              setIsModalOpen(true);
            }}
            className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium shadow-md shadow-blue-600/20"
          >
            ＋ เพิ่มห้องพัก
          </button>
        </header>

        <main className="p-6 space-y-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap gap-3 items-center">
            <input
              type="text"
              placeholder="ค้นหาเลขห้อง..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-blue-500 w-full sm:w-48"
            />
            <select
              value={buildingFilter}
              onChange={(e) => setBuildingFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">ทุกอาคาร</option>
              <option value="อาคาร A">อาคาร A</option>
              <option value="อาคาร B">อาคาร B</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">ทุกสถานะ</option>
              <option value="VACANT">ห้องว่าง</option>
              <option value="OCCUPIED">มีผู้เช่า</option>
              <option value="MAINTENANCE">ปิดปรับปรุง</option>
            </select>
          </div>

          <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3.5">เลขห้อง</th>
                  <th className="px-5 py-3.5">อาคาร</th>
                  <th className="px-5 py-3.5">ชั้น</th>
                  <th className="px-5 py-3.5">ค่าเช่า/เดือน</th>
                  <th className="px-5 py-3.5">สถานะ</th>
                  <th className="px-5 py-3.5 text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredRooms.map((room) => (
                  <tr key={room.id} className="hover:bg-slate-800/40">
                    <td className="px-5 py-3.5 font-bold text-slate-100">{room.roomNumber}</td>
                    <td className="px-5 py-3.5">{room.building}</td>
                    <td className="px-5 py-3.5 text-slate-400">ชั้น {room.floor}</td>
                    <td className="px-5 py-3.5 font-semibold text-slate-200">฿{room.price.toLocaleString()}</td>
                    <td className="px-5 py-3.5">{renderBadge(room.status)}</td>
                    <td className="px-5 py-3.5 text-right space-x-2">
                      <button onClick={() => handleEdit(room)} className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px]">
                        แก้ไข
                      </button>
                      <button onClick={() => handleDelete(room.id)} className="px-2.5 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-[11px]">
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

      <RoomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveRoom}
        initialData={editingRoom}
      />
    </div>
  );
}