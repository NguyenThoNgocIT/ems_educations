// src/constants/teacherScheduleData.ts

export const TEACHERS = [
  { id: "NV250704-1", name: "Justin", avatar: null },
  { id: "NV250704-2", name: "Mr Hung", avatar: null },
  { id: "NV251222-2", name: "Trinh Le", avatar: null },
  { id: "NV260127-1", name: "Phan Thành Châu 1", avatar: null },
];

export const SHIFTS = ["06:02 - 10:05", "08:00 - 12:00", "16:30 - 18:30"];

// Mô phỏng dữ liệu lịch thực tế từ SQL Server trả về
export const MOCK_SCHEDULE_ENTRIES = [
  {
    teacherId: "NV250704-2",
    date: "03/02/2026", // Khớp với format date trong FE
    shift: "08:00 - 12:00",
  },
  {
    teacherId: "NV250704-1",
    date: "04/02/2026",
    shift: "16:30 - 18:30",
  },
];
