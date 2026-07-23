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