const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

// ดึงข้อมูลห้องพักจาก Google Sheets
export async function fetchRoomsFromSheet() {
  try {
    const res = await fetch(`${API_URL}?action=getRooms`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch rooms from sheet:', error);
    return [];
  }
}

// ดึงข้อมูลผู้เช่าจาก Google Sheets
export async function fetchTenantsFromSheet() {
  try {
    const res = await fetch(`${API_URL}?action=getTenants`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch tenants from sheet:', error);
    return [];
  }
}

// บันทึกห้องพักใหม่ลง Google Sheets
export async function addRoomToSheet(roomData: any) {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'addRoom', ...roomData }),
    });
    return await res.json();
  } catch (error) {
    console.error('Failed to add room:', error);
  }
}