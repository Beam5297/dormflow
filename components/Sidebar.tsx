'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: 'หน้าแรก', path: '/', icon: '🏠' },
    { name: 'จัดการห้องพัก', path: '/rooms', icon: '🏢' },
    { name: 'จัดการผู้เช่า', path: '/tenants', icon: '👤' },
    { name: 'ออกใบแจ้งหนี้', path: '/bills', icon: '📄' },
    { name: 'ตรวจการชำระเงิน', path: '/payments', icon: '💳' },
    { name: 'ตั้งค่าระบบ', path: '/settings', icon: '⚙️' },
  ];

  return (
    <aside className="w-64 bg-slate-900 min-h-screen p-4 flex flex-col justify-between text-white border-r border-slate-800">
      <div className="space-y-6">
        {/* Logo */}
        <div className="px-3 py-2 flex items-center gap-3">
          <div className="bg-blue-600 text-white p-2 rounded-xl font-bold text-lg">DF</div>
          <span className="text-xl font-bold tracking-wide">DormFlow</span>
        </div>
        
        {/* Nav Link */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Info Bottom */}
      <div className="border-t border-slate-800 pt-4 px-3 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-xs">
          AD
        </div>
        <div className="overflow-hidden">
          <p className="text-xs font-semibold truncate">ผู้ดูแลระบบ</p>
          <p className="text-[10px] text-slate-400 truncate">Admin Account</p>
        </div>
      </div>
    </aside>
  );
}