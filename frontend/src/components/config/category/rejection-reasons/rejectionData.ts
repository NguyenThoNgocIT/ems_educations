export interface RejectionReason {
  id: number;
  name: string;
  description: string;
  date: string;
  creator: string;
}

export const initialRejectionData: RejectionReason[] = [
  {
    id: 1,
    name: "Khách hàng chỉ hỏi",
    description: "Khách hàng khảo sát giá, chưa có ý định học ngay",
    date: "2024-08-28 10:14",
    creator: "Admin",
  },
  {
    id: 2,
    name: "Chưa đủ chi phí",
    description: "Học phí vượt quá ngân sách của học viên",
    date: "2024-08-28 10:14",
    creator: "Admin",
  },
  {
    id: 3,
    name: "Chưa có chương trình phù hợp",
    description: "Trung tâm chưa mở lớp đúng trình độ yêu cầu",
    date: "2024-08-28 10:12",
    creator: "Admin",
  },
  {
    id: 4,
    name: "Vị trí địa lý",
    description: "Cơ sở quá xa nhà học viên",
    date: "2025-01-15 09:30",
    creator: "Hệ thống",
  },
];
