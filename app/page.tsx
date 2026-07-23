'use client';

import React from 'react';
import { Sidebar } from '@/components/Sidebar';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function DashboardPage() {
  const stats = [
    { title: 'ห้องทั้งหมด', value: '48 ห้อง', sub: '3 อาคาร', color: 'border-blue-500' },
    { title: 'ห้องว่างพร้อมเช่า', value: '6 ห้อง', sub: 'คิดเป็น 12.5%', color: 'border-emerald-500' },
    { title: 'รายได้เดือนนี้', value: '฿184,500', sub: '+8.2% จากเดือนที่แล้ว', color: 'border-indigo-500' },
    { title: 'ค้างชำระ', value: '฿12,000', sub: '3 ห้องค้างจ่าย', color: 'border-amber-500' },
  ];

  // ข้อมูลกราฟแสดงแนวโน้มรายรับ 6 เดือนล่าสุด
  const chartData = {
    labels: ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.'],
    datasets: [
      {
        label: 'รายรับค่าเช่ารวม (บาท)',
        data: [165000, 172000, 168000, 175000, 180000, 182000, 184500],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.15)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'ค่าน้ำ-ค่าไฟ (บาท)',
        data: [22000, 24000, 28000, 35000, 38000, 32000, 30000],
        borderColor: '#f59e0b',
        backgroundColor: 'transparent',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#94a3b8', font: { size: 11 } },
      },
    },
    scales: {
      x: {
        ticks: { color: '#64748b' },
        grid: { color: 'rgba(51, 65, 85, 0.3)' },
      },
      y: {
        ticks: { color: '#64748b' },
        grid: { color: 'rgba(51, 65, 85, 0.3)' },
      },
    },
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-20">
          <h2 className="text-base font-semibold text-slate-200">ภาพรวมระบบ (Dashboard)</h2>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white border border-blue-400">
              AD
            </div>
            <div className="text-xs">
              <p className="font-semibold text-slate-200">ผู้ดูแลระบบ</p>
              <p className="text-slate-400 text-[10px]">Admin Account</p>
            </div>
          </div>
        </header>

        <main className="p-6 space-y-6">
          {/* Stat Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-xl bg-slate-900 border-l-4 ${stat.color} border-y border-r border-slate-800 shadow-sm`}
              >
                <p className="text-xs text-slate-400 font-medium">{stat.title}</p>
                <h3 className="text-2xl font-bold text-slate-100 mt-1">{stat.value}</h3>
                <p className="text-[11px] text-slate-500 mt-1">{stat.sub}</p>
              </div>
            ))}
          </div>

          {/* Chart & Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-5 rounded-xl bg-slate-900 border border-slate-800">
              <h3 className="text-sm font-semibold text-slate-200 mb-4">แนวโน้มรายรับประจำปี (2026)</h3>
              <div className="h-64">
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
              <h3 className="text-sm font-semibold text-slate-200 mb-4">รายการล่าสุด</h3>
              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between items-start pb-3 border-b border-slate-800">
                  <div>
                    <p className="font-medium text-slate-200">ห้อง 302 ชำระค่าเช่าแล้ว</p>
                    <p className="text-slate-500 text-[10px]">โอนผ่าน PromptPay</p>
                  </div>
                  <span className="text-emerald-400 font-semibold">+฿4,500</span>
                </div>
                <div className="flex justify-between items-start pb-3 border-b border-slate-800">
                  <div>
                    <p className="font-medium text-slate-200">ออกบิลใหม่ 48 รายการ</p>
                    <p className="text-slate-500 text-[10px]">ประจำเดือน กรกฎาคม 2026</p>
                  </div>
                  <span className="text-slate-400 font-medium">ระบบ</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}