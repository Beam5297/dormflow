export interface Room {
  id: string;
  roomNumber: string;
  building: string;
  floor: number;
  price: number;
  status: 'VACANT' | 'OCCUPIED' | 'MAINTENANCE';
}

export const mockRooms: Room[] = [
  { id: '1', roomNumber: '101', building: 'อาคาร A', floor: 1, price: 3500, status: 'OCCUPIED' },
  { id: '2', roomNumber: '102', building: 'อาคาร A', floor: 1, price: 3500, status: 'VACANT' },
  { id: '3', roomNumber: '103', building: 'อาคาร A', floor: 1, price: 3500, status: 'OCCUPIED' },
  { id: '4', roomNumber: '201', building: 'อาคาร A', floor: 2, price: 3800, status: 'MAINTENANCE' },
  { id: '5', roomNumber: '202', building: 'อาคาร A', floor: 2, price: 3800, status: 'VACANT' },
  { id: '6', roomNumber: 'B101', building: 'อาคาร B', floor: 1, price: 4200, status: 'OCCUPIED' },
];