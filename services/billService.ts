import { supabase } from './supabase';

export interface BillData {
  id: string;
  roomNumber: string;
  tenantName: string;
  month: string;
  rentPrice: number;
  waterOld: number;
  waterNew: number;
  waterPricePerUnit: number;
  electricOld: number;
  electricNew: number;
  electricPricePerUnit: number;
  otherPrice: number;
  totalPrice: number;
  status: string;
}

export async function getBills(): Promise<BillData[]> {
  const { data } = await supabase.from('bills').select('*');
  if (!data) return [];
  return data.map((b: any) => ({
    id: b.id,
    roomNumber: b.room_number,
    tenantName: b.tenant_name,
    month: b.month,
    rentPrice: Number(b.rent_price),
    waterOld: Number(b.water_old),
    waterNew: Number(b.water_new),
    waterPricePerUnit: Number(b.water_price_per_unit),
    electricOld: Number(b.electric_old),
    electricNew: Number(b.electric_new),
    electricPricePerUnit: Number(b.electric_price_per_unit),
    otherPrice: Number(b.other_price),
    totalPrice: Number(b.total_price),
    status: b.status,
  }));
}

export async function saveBills(bills: BillData[]) {
  const formatted = bills.map(b => ({
    id: b.id,
    room_number: b.roomNumber,
    tenant_name: b.tenantName,
    month: b.month,
    rent_price: b.rentPrice,
    water_old: b.waterOld,
    water_new: b.waterNew,
    water_price_per_unit: b.waterPricePerUnit,
    electric_old: b.electricOld,
    electric_new: b.electricNew,
    electric_price_per_unit: b.electricPricePerUnit,
    other_price: b.otherPrice,
    total_price: b.totalPrice,
    status: b.status,
  }));
  await supabase.from('bills').upsert(formatted);
}