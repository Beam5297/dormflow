'use client';

import React from 'react';
import Link from 'next/link';

const menuItems = [
  { label: 'ภาพรวม (Dashboard)', href: '/', icon: '📊' },
  { label: 'จัดการห้องพัก', href: '/rooms', icon: '🔑' },
  { label: 'ผู้เช่าสัญญา', href: '/tenants', icon: '👥' },
  { label: 'ออกบิล & ค่าเช่า', href: '/bills', icon: '📝' },
  { label: 'รับชำระเงิน', href: '/payments', icon: '💳' },
  { label: 'ตั้งค่าระบบ', href: '/settings', icon: '⚙️' },
];

export function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between hidden md:flex h-screen sticky top-0">
      <div>
        {/* Logo Header */}
        <div className="p-6 border-b border-slate-800/80 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-black text-white text-lg shadow-md shadow-blue-500/20">
            DF
          </div>
          <div>
            <h2 className="font-bold text-slate-100 text-base leading-none">DormFlow</h2>
            <span className="text-[10px] text-blue-400 font-mono">v1.0 Online</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-all font-medium"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-800 text-[11px] text-slate-500 text-center">
        DormFlow System © 2026
      </div>
    </aside>
  );
}