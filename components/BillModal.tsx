'use client';

import React, { useState, useEffect } from 'react';
import { Bill } from '@/services/billService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (bill: Bill) => void;
  initialData?: Bill | null;
}

export function BillModal({ isOpen, onClose, onSave, initialData }: Props) {
  const [roomNumber, setRoomNumber] = useState('101');
  const [tenantName, setTenantName] = useState('สมชาย ใจดี');
  const [month, setMonth] = useState('2026-07');
  const [rentPrice, setRentPrice] = useState(3500);

  // ค่าน้ำ (ตั้งต้น 25 บาท/หน่วย)
  const [waterOld, setWaterOld] = useState(100);
  const [waterNew, setWaterNew] = useState(105);
  const [waterPricePerUnit, setWaterPricePerUnit] = useState(25);

  // ค่าไฟ (ตั้งต้น 7 บาท/หน่วย)
  const [electricOld, setElectricOld] = useState(400);
  const [electricNew, setElectricNew] = useState(480);
  const [electricPricePerUnit, setElectricPricePerUnit] = useState(7);

  const [otherPrice, setOtherPrice] = useState(100);
  const [status, setStatus] = useState<'PENDING' | 'PAID' | 'OVERDUE'>('PENDING');

  // คำนวณอัตโนมัติ
  const waterUnits = Math.max(0, waterNew - waterOld);
  const waterTotal = waterUnits * waterPricePerUnit;

  const electricUnits = Math.max(0, electricNew - electricOld);
  const electricTotal = electricUnits * electricPricePerUnit;

  const totalPrice = rentPrice + waterTotal + electricTotal + otherPrice;

  useEffect(() => {
    if (initialData) {
      setRoomNumber(initialData.roomNumber);
      setTenantName(initialData.tenantName);
      setMonth(initialData.month);
      setRentPrice(initialData.rentPrice);
      setWaterOld(initialData.waterOld);
      setWaterNew(initialData.waterNew);
      setWaterPricePerUnit(initialData.waterPricePerUnit || 25);
      setElectricOld(initialData.electricOld);
      setElectricNew(initialData.electricNew);
      setElectricPricePerUnit(initialData.electricPricePerUnit || 7);
      setOtherPrice(initialData.otherPrice);
      setStatus(initialData.status);
    } else {
      setRoomNumber('101');
      setTenantName('');
      setMonth('2026-07');
      setRentPrice(3500);
      setWaterOld(100);
      setWaterNew(105);
      setWaterPricePerUnit(25);
      setElectricOld(400);
      setElectricNew(480);
      setElectricPricePerUnit(7);
      setOtherPrice(100);
      setStatus('PENDING');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: initialData?.id || String(Date.now()),
      roomNumber,
      tenantName,
      month,
      rentPrice: Number(rentPrice),
      waterOld: Number(waterOld),
      waterNew: Number(waterNew),
      waterPricePerUnit: Number(waterPricePerUnit),
      electricOld: Number(electricOld),
      electricNew: Number(electricNew),
      electricPricePerUnit: Number(electricPricePerUnit),
      otherPrice: Number(otherPrice),
      totalPrice,
      status,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 text-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold">
            {initialData ? 'แก้ไขบิลค่าเช่า' : 'ออกบิลใหม่ประจำเดือน'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 mb-1">เลขห้อง</label>
              <input
                type="text"
                required
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1">ผู้เช่า</label>
              <input
                type="text"
                required
                value={tenantName}
                onChange={(e) => setTenantName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 mb-1">ประจำเดือน</label>
              <input
                type="month"
                required
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1">ค่าเช่าห้อง (บาท)</label>
              <input
                type="number"
                required
                value={rentPrice}
                onChange={(e) => setRentPrice(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* ค่าน้ำ */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center">
              <p className="font-semibold text-blue-400">💧 ค่าน้ำประปา</p>
              <span className="text-[10px] text-slate-400">
                ราคาต่อหน่วย:{' '}
                <input
                  type="number"
                  value={waterPricePerUnit}
                  onChange={(e) => setWaterPricePerUnit(Number(e.target.value))}
                  className="w-12 px-1 py-0.5 rounded bg-slate-900 border border-slate-700 text-center font-bold text-blue-400"
                />{' '}
                บาท
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">มิเตอร์เก่า</label>
                <input
                  type="number"
                  value={waterOld}
                  onChange={(e) => setWaterOld(Number(e.target.value))}
                  className="w-full px-2 py-1.5 rounded bg-slate-900 border border-slate-800"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">มิเตอร์ใหม่</label>
                <input
                  type="number"
                  value={waterNew}
                  onChange={(e) => setWaterNew(Number(e.target.value))}
                  className="w-full px-2 py-1.5 rounded bg-slate-900 border border-slate-800"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">รวม ({waterUnits} หน่วย)</label>
                <input
                  type="text"
                  readOnly
                  value={`฿${waterTotal}`}
                  className="w-full px-2 py-1.5 rounded bg-slate-800 text-emerald-400 font-bold"
                />
              </div>
            </div>
          </div>

          {/* ค่าไฟ */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center">
              <p className="font-semibold text-amber-400">⚡ ค่าไฟฟ้า</p>
              <span className="text-[10px] text-slate-400">
                ราคาต่อหน่วย:{' '}
                <input
                  type="number"
                  value={electricPricePerUnit}
                  onChange={(e) => setElectricPricePerUnit(Number(e.target.value))}
                  className="w-12 px-1 py-0.5 rounded bg-slate-900 border border-slate-700 text-center font-bold text-amber-400"
                />{' '}
                บาท
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">มิเตอร์เก่า</label>
                <input
                  type="number"
                  value={electricOld}
                  onChange={(e) => setElectricOld(Number(e.target.value))}
                  className="w-full px-2 py-1.5 rounded bg-slate-900 border border-slate-800"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">มิเตอร์ใหม่</label>
                <input
                  type="number"
                  value={electricNew}
                  onChange={(e) => setElectricNew(Number(e.target.value))}
                  className="w-full px-2 py-1.5 rounded bg-slate-900 border border-slate-800"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">รวม ({electricUnits} หน่วย)</label>
                <input
                  type="text"
                  readOnly
                  value={`฿${electricTotal}`}
                  className="w-full px-2 py-1.5 rounded bg-slate-800 text-amber-400 font-bold"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 mb-1">ค่าส่วนกลาง / อื่นๆ (บาท)</label>
              <input
                type="number"
                value={otherPrice}
                onChange={(e) => setOtherPrice(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1">สถานะชำระเงิน</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 focus:outline-none focus:border-blue-500"
              >
                <option value="PENDING">รอชำระเงิน</option>
                <option value="PAID">ชำระแล้ว</option>
                <option value="OVERDUE">เกินกำหนดชำระ</option>
              </select>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-blue-600/10 border border-blue-500/30 flex justify-between items-center">
            <span className="font-semibold text-slate-200">ยอดรวมสุทธิทั้งสิ้น:</span>
            <span className="text-xl font-black text-blue-400">฿{totalPrice.toLocaleString()}</span>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-lg border border-slate-700 text-slate-300 font-medium"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-md shadow-blue-600/20"
            >
              บันทึกบิล
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}