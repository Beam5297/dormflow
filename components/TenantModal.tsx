'use client';

import React, { useState, useEffect } from 'react';
import { Tenant } from '@/services/tenantService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tenant: Tenant) => void;
  initialData?: Tenant | null;
}

export function TenantModal({ isOpen, onClose, onSave, initialData }: Props) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [idCard, setIdCard] = useState('');
  const [roomNumber, setRoomNumber] = useState('101');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [deposit, setDeposit] = useState(7000);
  const [status, setStatus] = useState<'ACTIVE' | 'EXPIRED' | 'MOVED_OUT'>('ACTIVE');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setPhone(initialData.phone);
      setIdCard(initialData.idCard);
      setRoomNumber(initialData.roomNumber);
      setStartDate(initialData.startDate);
      setEndDate(initialData.endDate);
      setDeposit(initialData.deposit);
      setStatus(initialData.status);
    } else {
      setName('');
      setPhone('');
      setIdCard('');
      setRoomNumber('101');
      setStartDate(new Date().toISOString().split('T')[0]);
      setEndDate('');
      setDeposit(7000);
      setStatus('ACTIVE');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: initialData?.id || String(Date.now()),
      name,
      phone,
      idCard,
      roomNumber,
      startDate,
      endDate,
      deposit: Number(deposit),
      status,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 text-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold">
            {initialData ? 'แก้ไขข้อมูลผู้เช่า' : 'เพิ่มผู้เช่าใหม่ (ทําสัญญาเช่า)'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-300 mb-1">ชื่อ - นามสกุล</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="เช่น นายสมชาย ใจดี"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1">เบอร์โทรศัพท์</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="08X-XXX-XXXX"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-300 mb-1">เลขบัตรประชาชน</label>
              <input
                type="text"
                required
                value={idCard}
                onChange={(e) => setIdCard(e.target.value)}
                placeholder="X-XXXX-XXXXX-XX-X"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1">ห้องที่เช่า</label>
              <input
                type="text"
                required
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                placeholder="เช่น 101"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-300 mb-1">วันเริ่มสัญญา</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1">วันสิ้นสุดสัญญา</label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-300 mb-1">เงินประกัน/มัดจำ (บาท)</label>
              <input
                type="number"
                required
                value={deposit}
                onChange={(e) => setDeposit(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1">สถานะสัญญา</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="ACTIVE">ปกติ (อยู่ระหว่างสัญญา)</option>
                <option value="EXPIRED">ใกล้หมด/หมดสัญญา</option>
                <option value="MOVED_OUT">ย้ายออกแล้ว</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-3">
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
              บันทึกสัญญา
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}