import { supabase } from './supabase';

export interface RoomData {
  id: string;
  roomNumber: string;
  rentPrice: number;
  status: string;
  tenantName: string;
}

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