'use client';

import React, { useState, useEffect } from 'react';
import { Room } from '@/services/roomService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (room: Room) => void;
  initialData?: Room | null;
}

export function RoomModal({ isOpen, onClose, onSave, initialData }: Props) {
  const [roomNumber, setRoomNumber] = useState('');
  const [building, setBuilding] = useState('อาคาร A');
  const [floor, setFloor] = useState(1);
  const [price, setPrice] = useState(3500);
  const [status, setStatus] = useState<'VACANT' | 'OCCUPIED' | 'MAINTENANCE'>('VACANT');

  useEffect(() => {
    if (initialData) {
      setRoomNumber(initialData.roomNumber);
      setBuilding(initialData.building);
      setFloor(initialData.floor);
      setPrice(initialData.price);
      setStatus(initialData.status);
    } else {
      setRoomNumber('');
      setBuilding('อาคาร A');
      setFloor(1);
      setPrice(3500);
      setStatus('VACANT');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: initialData?.id || String(Date.now()),
      roomNumber,
      building,
      floor: Number(floor),
      price: Number(price),
      status,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 text-slate-100">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold">
            {initialData ? 'แก้ไขข้อมูลห้องพัก' : 'เพิ่มห้องพักใหม่'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-300 mb-1">เลขห้อง</label>
              <input
                type="text"
                required
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                placeholder="เช่น 101"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1">อาคาร</label>
              <select
                value={building}
                onChange={(e) => setBuilding(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="อาคาร A">อาคาร A</option>
                <option value="อาคาร B">อาคาร B</option>
                <option value="อาคาร C">อาคาร C</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-300 mb-1">ชั้น</label>
              <input
                type="number"
                min={1}
                required
                value={floor}
                onChange={(e) => setFloor(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1">ค่าเช่า/เดือน (บาท)</label>
              <input
                type="number"
                step={100}
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-1">สถานะห้องพัก</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="VACANT">ห้องว่าง</option>
              <option value="OCCUPIED">มีผู้เช่า</option>
              <option value="MAINTENANCE">ปิดปรับปรุง</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-lg border border-slate-700 text-slate-300 text-xs font-medium"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium shadow-md shadow-blue-600/20"
            >
              บันทึกข้อมูล
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}