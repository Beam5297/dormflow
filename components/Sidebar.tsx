'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 min-h-screen p-4 flex flex-col justify-between text-white">
      <div className="space-y-4">
        <h2 className="text-lg font-bold px-3">DormFlow</h2>
        
        <nav className="space-y-1">
          <Link
            href="/"
            className={`flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
              pathname === '/'
                ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <span>🏠</span>
            <span>หน้าแรก</span>
          </Link>

          <Link
            href="/settings"
            className={`flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
              pathname === '/settings'
                ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <span>⚙️</span>
            <span>ตั้งค่าระบบ</span>
          </Link>
        </nav>
      </div>
    </aside>
  );
}