// Định nghĩa kiểu dữ liệu cho Hợp đồng để đảm bảo tính an toàn (TypeScript)
export interface Contract {
  title: string;
  studentName: string;
  studentId: string;
  createdAt: string;
  creator: string;
  updatedAt: string;
  updater: string;
}

export const contractData: Contract[] = [
  {
    title: "Phần 1",
    studentName: "Dương Trọng Nhân",
    studentId: "HV241007-2", // Sử dụng Business Code như yêu cầu của đồ án
    createdAt: "15:14 04/03/2025",
    creator: "Admin",
    updatedAt: "16:11 01/10/2025",
    updater: "Admin",
  },
  {
    title: "Hợp đồng cam kết chất lượng đầu ra",
    studentName: "Dương Trọng Nhân",
    studentId: "HV240920-5",
    createdAt: "17:47 20/09/2024",
    creator: "Trần Văn Hùng",
    updatedAt: "17:47 20/09/2024",
    updater: "Trần Văn Hùng",
  },
  {
    title: "Hợp đồng cam kết chất lượng đầu ra",
    studentName: "Nguyễn Thu Sơn",
    studentId: "HV2408290003",
    createdAt: "13:58 20/09/2024",
    creator: "Admin",
    updatedAt: "13:58 20/09/2024",
    updater: "Admin",
  },
];
