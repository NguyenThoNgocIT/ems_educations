export interface CourseCategory {
  id: string;
  name: string;
  totalPending: number;
  schedules: { time: string; count: number }[];
}

export interface StudentRegistration {
  id: number;
  name: string;
  phone: string;
  latestClass: string;
  status: "Sắp diễn ra" | "Đang học" | "Đã kết thúc";
  expectedEndDate: string;
  session: string;
  consultant: string;
  registrationDate: string;
}

export const coursesData: CourseCategory[] = [
  {
    id: "vovinam",
    name: "Vovinam cơ bản",
    totalPending: 1,
    schedules: [{ time: "Chưa xác định thời gian", count: 1 }],
  },
  {
    id: "german_a2",
    name: "Tiếng Đức A2",
    totalPending: 1,
    schedules: [{ time: "Chưa xác định thời gian", count: 1 }],
  },
  {
    id: "german_a1",
    name: "Tiếng Đức A1",
    totalPending: 1,
    schedules: [{ time: "Thứ 3 (16:30 - 18:30)", count: 1 }],
  },
  {
    id: "english_6b",
    name: "English 6B",
    totalPending: 2,
    schedules: [{ time: "Chưa xác định thời gian", count: 2 }],
  },
  {
    id: "english_y8a",
    name: "English Y8A",
    totalPending: 1,
    schedules: [{ time: "Chưa xác định thời gian", count: 1 }],
  },
];

export const studentsData: StudentRegistration[] = [
  {
    id: 1,
    name: "Phạm Hải Tuấn",
    phone: "0000003822",
    latestClass: "test01",
    status: "Sắp diễn ra",
    expectedEndDate: "14/01/2026",
    session: "Chưa xác định",
    consultant: "Hoàng Hải Khoa",
    registrationDate: "03/10/2025",
  },
];
