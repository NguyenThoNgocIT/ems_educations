export interface RefundItem {
  id: string;
  name: string;
  center: string;
  createdAt: string;
  amount: number;
  type: "Hoàn tiền chờ xếp lớp" | "Hoàn tiền thủ công" | "Hoàn tiền bảo lưu";
  note: string;
  status: "Chờ duyệt" | "Đã duyệt" | "Không duyệt";
}

export const refundData: RefundItem[] = [
  {
    id: "REF-001",
    name: "Nguyễn Bảo Châu",
    center: "1 - Tân Bình HCM",
    createdAt: "2026-01-30",
    amount: 100000,
    type: "Hoàn tiền chờ xếp lớp",
    note: "",
    status: "Chờ duyệt",
  },
  {
    id: "REF-002",
    name: "Nguyễn Minh Trang",
    center: "1 - Tân Bình HCM",
    createdAt: "2025-06-24",
    amount: 1000000,
    type: "Hoàn tiền thủ công",
    note: "bồi hoàn về khoá học",
    status: "Đã duyệt",
  },
  {
    id: "REF-003",
    name: "Hoàng Anh Vy",
    center: "1 - Tân Bình HCM",
    createdAt: "2024-08-29",
    amount: 15200000,
    type: "Hoàn tiền bảo lưu",
    note: "",
    status: "Chờ duyệt",
  },
  {
    id: "REF-004",
    name: "Võ Quốc Trang",
    center: "1 - Tân Bình HCM",
    createdAt: "2024-08-28",
    amount: 12000000,
    type: "Hoàn tiền thủ công",
    note: "Hoàn tiền học viên không học",
    status: "Chờ duyệt",
  },
];
