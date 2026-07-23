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
  // แปลงชื่อคอลัมน์จากฐานข้อมูลให้ตรงกับหน้าเว็บ
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
  // ลบข้อมูลเก่าทั้งหมดแล้วใส่ชุดใหม่เข้าไป หรือใช้วิธี Upsert ทีละรายการ
  for (const room of rooms) {
    const { error } = await supabase.from('rooms').upsert({
      id: room.id,
      room_number: room.roomNumber,
      rent_price: room.rentPrice,
      status: room.status,
      tenant_name: room.tenantName,
    });
    if (error) {
      console.error('Error saving room:', error);
    }
  }
}