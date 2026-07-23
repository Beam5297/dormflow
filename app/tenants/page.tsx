'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { mockTenants, Tenant } from '@/services/tenantService';
import { TenantModal } from '@/components/TenantModal';

export default function TenantsPage() {
  const [tenants, setTenants] = useState<Tenant[]>(mockTenants);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);

  const filteredTenants = tenants.filter((tenant) => {
    const matchSearch =
      tenant.name.toLowerCase().includes(search.toLowerCase()) ||
      tenant.roomNumber.toLowerCase().includes(search.toLowerCase()) ||
      tenant.phone.includes(search);
    const matchStatus = statusFilter === 'ALL' || tenant.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleSaveTenant = (savedTenant: Tenant) => {
    if (editingTenant) {
      setTenants(tenants.map((t) => (t.id === savedTenant.id ? savedTenant : t)));
    } else {
      setTenants([...tenants, savedTenant]);
    }
  };

  const handleEdit = (tenant: Tenant) => {
    setEditingTenant(tenant);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('คุณต้องการลบข้อมูลผู้เช่ารายนี้ใช่หรือไม่?')) {
      setTenants(tenants.filter((t) => t.id !== id));
    }
  };

  const renderBadge = (status: string) => {
    if (status === 'ACTIVE')
      return <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">ปกติ</span>;
    if (status === 'EXPIRED')
      return <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">ใกล้/หมดสัญญา</span>;
    return <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-500/10 text-slate-400 border border-slate-500/20">ย้ายออก</span>;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-20">
          <h2 className="text-base font-semibold text-slate-200">ผู้เช่า & สัญญา</h2>
          <button
            onClick={() => {
              setEditingTenant(null);
              setIsModalOpen(true);
            }}
            className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium shadow-md shadow-blue-600/20"
          >
            ＋ เพิ่มผู้เช่าใหม่
          </button>
        </header>

        <main className="p-6 space-y-4">
          {/* Controls Bar */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap gap-3 items-center">
            <input
              type="text"
              placeholder="ค้นหาชื่อ, ห้อง, เบอร์โทร..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-blue-500 w-full sm:w-60"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">ทุกสถานะสัญญา</option>
              <option value="ACTIVE">ปกติ</option>
              <option value="EXPIRED">ใกล้/หมดสัญญา</option>
              <option value="MOVED_OUT">ย้ายออกแล้ว</option>
            </select>
          </div>

          {/* Table */}
          <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3.5">ผู้เช่า</th>
                  <th className="px-5 py-3.5">ห้อง</th>
                  <th className="px-5 py-3.5">เบอร์โทรศัพท์</th>
                  <th className="px-5 py-3.5">ระยะเวลาสัญญา</th>
                  <th className="px-5 py-3.5">เงินประกัน</th>
                  <th className="px-5 py-3.5">สถานะ</th>
                  <th className="px-5 py-3.5 text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredTenants.map((tenant) => (
                  <tr key={tenant.id} className="hover:bg-slate-800/40">
                    <td className="px-5 py-3.5">
                      <p className="font-bold text-slate-100">{tenant.name}</p>
                      <p className="text-[10px] text-slate-500">{tenant.idCard}</p>
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-blue-400">ห้อง {tenant.roomNumber}</td>
                    <td className="px-5 py-3.5 text-slate-300">{tenant.phone}</td>
                    <td className="px-5 py-3.5 text-slate-400">
                      {tenant.startDate} ถึง {tenant.endDate}
                    </td>
                    <td className="px-5 py-3.5 font-medium text-slate-200">฿{tenant.deposit.toLocaleString()}</td>
                    <td className="px-5 py-3.5">{renderBadge(tenant.status)}</td>
                    <td className="px-5 py-3.5 text-right space-x-2">
                      <button
                        onClick={() => handleEdit(tenant)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px]"
                      >
                        แก้ไข
                      </button>
                      <button
                        onClick={() => handleDelete(tenant.id)}
                        className="px-2.5 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-[11px]"
                      >
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

      <TenantModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTenant}
        initialData={editingTenant}
      />
    </div>
  );
}