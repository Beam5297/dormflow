'use client';

import React, { useState } from 'react';
import { PaymentRecord } from '@/services/paymentService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (paymentId: string) => void;
  payment: PaymentRecord | null;
}

export function PaymentModal({ isOpen, onClose, onConfirm, payment }: Props) {
  const [selectedMethod, setSelectedMethod] = useState<'PROMPTPAY' | 'CASH'>('PROMPTPAY');
  const [slipPreview, setSlipPreview] = useState<string | null>(payment?.slipUrl || null);

  if (!isOpen || !payment) return null;

  // PromptPay QR Code Generator API (ใช้ ยอดเงิน + เบอร์พร้อมเพย์จำลอง)
  const promptpayPhone = '0812345678';
  const qrCodeUrl = `https://promptpay.io/${promptpayPhone}/${payment.amount}.png`;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSlipPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 text-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold">รับชำระเงิน - ห้อง {payment.roomNumber}</h3>
            <p className="text-xs text-slate-400">ผู้เช่า: {payment.tenantName}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>

        {/* ยอดเงินชำระ */}
        <div className="p-3 rounded-xl bg-blue-600/10 border border-blue-500/30 text-center">
          <p className="text-xs text-slate-400">ยอดที่ต้องชำระ</p>
          <p className="text-2xl font-black text-blue-400 mt-0.5">฿{payment.amount.toLocaleString()}</p>
        </div>

        {/* ตัวเลือกช่องทางชำระเงิน */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSelectedMethod('PROMPTPAY')}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-all ${
              selectedMethod === 'PROMPTPAY'
                ? 'bg-blue-600 border-blue-500 text-white'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            📱 สแกน QR PromptPay
          </button>
          <button
            type="button"
            onClick={() => setSelectedMethod('CASH')}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-all ${
              selectedMethod === 'CASH'
                ? 'bg-blue-600 border-blue-500 text-white'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            💵 เงินสด
          </button>
        </div>

        {/* QR Code Section */}
        {selectedMethod === 'PROMPTPAY' && (
          <div className="space-y-3 text-center">
            <div className="bg-white p-4 rounded-xl inline-block border border-slate-700 shadow-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrCodeUrl} alt="PromptPay QR Code" className="w-44 h-44 mx-auto" />
              <p className="text-[10px] text-slate-800 font-bold mt-1">สแกนจ่ายผ่านแอปธนาคาร</p>
            </div>

            {/* อัปโหลดสลิป */}
            <div className="text-left space-y-1">
              <label className="block text-xs text-slate-300">แนบสลิปการโอนเงิน</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700 cursor-pointer"
              />
            </div>

            {slipPreview && (
              <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 text-center">
                <p className="text-[10px] text-slate-400 mb-1">ตัวอย่างสลิปที่แนบ:</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={slipPreview} alt="Slip" className="max-h-48 mx-auto rounded border border-slate-800" />
              </div>
            )}
          </div>
        )}

        {selectedMethod === 'CASH' && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-2">
            <p className="text-sm font-semibold text-emerald-400">รับชำระด้วยเงินสด</p>
            <p className="text-xs text-slate-400">กรุณาตรวจสอบจำนวนเงินสด ฿{payment.amount.toLocaleString()} จากผู้เช่าก่อนกดรับยืนยัน</p>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 rounded-lg border border-slate-700 text-slate-300 text-xs font-medium"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm(payment.id);
              onClose();
            }}
            className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium shadow-md shadow-emerald-600/20"
          >
            ✓ ยืนยันรับชำระเงิน
          </button>
        </div>
      </div>
    </div>
  );
}