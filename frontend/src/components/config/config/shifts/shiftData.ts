export interface Shift {
  id: number;
  name: string;
  duration: number; // Tính theo phút
  start: string;
  end: string;
}

export const initialShiftData: Shift[] = [
  { id: 1, name: "06:00 - 10:00", duration: 240, start: "06:00", end: "10:00" },
  { id: 2, name: "08:00 - 12:00", duration: 240, start: "08:00", end: "12:00" },
  { id: 3, name: "16:30 - 18:30", duration: 120, start: "16:30", end: "18:30" },
  { id: 4, name: "19:00 - 21:00", duration: 120, start: "19:00", end: "21:00" },
];
