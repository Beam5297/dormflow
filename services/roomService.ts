import { supabase } from './supabase';

export interface RoomData {
  id: string;
  roomNumber: string;
  rentPrice: number;
  status: string;
  tenantName?: string;
}

// ฟังก์ชันดึงข้อมูลจาก Supabase
export async function getRooms(): Promise<RoomData[]> {
  const { data, error } = await supabase.from('rooms').select('*');
  if (error) {
    console.error('Error fetching rooms:', error);
    return [];
  }
  return (data || []).map((item: any) => ({
    id: item.id.toString(),
    roomNumber: item.room_number,
    rentPrice: item.rent_price,
    status: item.status,
    tenantName: item.tenant_name || '',
  }));
}

// ฟังก์ชันบันทึกข้อมูลลง Supabase
export async function saveRooms(rooms: RoomData[]) {
  // ลบข้อมูลทั้งหมดแล้วใส่ชุดใหม่เข้าไป เพื่อให้ข้อมูลตรงกันเป๊ะ
  await supabase.from('rooms').delete().neq('id', '0');

  const formattedRooms = rooms.map(room => ({
    id: room.id,
    room_number: room.roomNumber,
    rent_price: room.rentPrice,
    status: room.status,
    tenant_name: room.tenantName,
  }));

  const { error } = await supabase.from('rooms').insert(formattedRooms);
  if (error) {
    console.error('Error saving rooms:', error);
  }
}