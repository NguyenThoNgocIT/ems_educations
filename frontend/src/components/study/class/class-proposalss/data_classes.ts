export interface ClassInfo {
  id: string;
  name: string;
  status: "Đang diễn ra" | "Sắp diễn ra" | "Kết thúc";
  startDate: string;
  endDate: string;
  paymentType: string;
  teachers: string[];
  lessonsLearned: number;
  totalLessons: number;
  studentsCount: number;
  maxStudents: number;
  price: string;
  bannerColor: string;
}

const classesData: ClassInfo[] = [
  {
    id: "C01",
    name: "test",
    status: "Đang diễn ra",
    startDate: "30/01/2026",
    endDate: "31/01/2026",
    paymentType: "Thanh toán một lần",
    teachers: ["Trinh Le", "Phan Thành Châu 1"],
    lessonsLearned: 0,
    totalLessons: 2,
    studentsCount: 0,
    maxStudents: 20,
    price: "1,010,000,000 VNĐ",
    bannerColor: "bg-blue-400",
  },
  {
    id: "C02",
    name: "test01",
    status: "Sắp diễn ra",
    startDate: "Không xác định",
    endDate: "Không xác định",
    paymentType: "Thanh toán một lần",
    teachers: [],
    lessonsLearned: 0,
    totalLessons: 0,
    studentsCount: 5,
    maxStudents: 10,
    price: "9,000,000 VNĐ",
    bannerColor: "bg-blue-300",
  },
  {
    id: "C03",
    name: "EBU 1G",
    status: "Kết thúc",
    startDate: "12/01/2026",
    endDate: "14/01/2026",
    paymentType: "Thanh toán một lần",
    teachers: ["Trinh Le"],
    lessonsLearned: 1,
    totalLessons: 2,
    studentsCount: 2,
    maxStudents: 20,
    price: "2,250,000 VNĐ",
    bannerColor: "bg-blue-500",
  },
];

export default classesData;
