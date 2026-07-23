import { supabase } from './supabase';

export interface RoomData {
  id: string;
  roomNumber: string;
  rentPrice: number;
  status: string;
  tenantName: string;
}

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

export interface SettingsData {
  dormName: string;
  address: string;
  phone: string;
  waterRate: number;
  electricRate: number;
  commonFee: number;
  bankName: string;
  accountNo: string;
  accountName: string;
  promptPay: string;
}

// --- SETTINGS ---
export async function getSettings(): Promise<SettingsData> {
  const { data } = await supabase.from('settings').select('*').eq('id', 'default_settings').single();
  if (!data) {
    return {
      dormName: 'หอพัก DormFlow',
      address: '123/45 ถนนสุขุมวิท',
      phone: '081-234-5678',
      waterRate: 18,
      electricRate: 8,
      commonFee: 100,
      bankName: 'กสิกรไทย',
      accountNo: 'xxx-x-xxxxx-x',
      accountName: 'เจ้าของหอพัก',
      promptPay: '0812345678',
    };
  }
  return {
    dormName: data.dorm_name || '',
    address: data.address || '',
    phone: data.phone || '',
    waterRate: Number(data.water_rate) || 0,
    electricRate: Number(data.electric_rate) || 0,
    commonFee: Number(data.common_fee) || 0,
    bankName: data.bank_name || '',
    accountNo: data.account_no || '',
    accountName: data.account_name || '',
    promptPay: data.prompt_pay || '',
  };
}

export async function saveSettings(settings: SettingsData) {
  await supabase.from('settings').upsert({
    id: 'default_settings',
    dorm_name: settings.dormName,
    address: settings.address,
    phone: settings.phone,
    water_rate: settings.waterRate,
    electric_rate: settings.electricRate,
    common_fee: settings.commonFee,
    bank_name: settings.bankName,
    account_no: settings.accountNo,
    account_name: settings.accountName,
    prompt_pay: settings.promptPay,
  });
}

// --- ROOMS ---
export async function getRooms(): Promise<RoomData[]> {
  const { data } = await supabase.from('rooms').select('*');
  if (!data) return [];
  return data.map((r: any) => ({
    id: r.id,
    roomNumber: r.room_number,
    rentPrice: Number(r.rent_price),
    status: r.status,
    tenantName: r.tenant_name || '',
  }));
}

export async function saveRooms(rooms: RoomData[]) {
  const formatted = rooms.map(r => ({
    id: r.id,
    room_number: r.roomNumber,
    rent_price: r.rentPrice,
    status: r.status,
    tenant_name: r.tenantName,
  }));
  await supabase.from('rooms').upsert(formatted);
}

// --- BILLS ---
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