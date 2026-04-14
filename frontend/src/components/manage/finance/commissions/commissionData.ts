export interface CommissionItem {
  id: string;
  staff: string;
  staffId: string;
  student: string;
  invoiceValue: number;
  rate: number; // Ví dụ: 5 đại diện cho 5%
  amount: number;
  date: string;
  status: "Đã chi trả" | "Chờ đối soát" | "Hủy bỏ";
}

export const commissionData: CommissionItem[] = [
  {
    id: "HH260130-1",
    staff: "Võ Minh Nam",
    staffId: "NV2408280009",
    student: "Nguyễn Bảo Châu",
    invoiceValue: 9000000,
    rate: 5,
    amount: 450000,
    date: "30/01/2026",
    status: "Đã chi trả",
  },
  {
    id: "HH260122-1",
    staff: "Hoàng Hải Khoa",
    staffId: "NV2408280010",
    student: "Phạm Hải Tuấn",
    invoiceValue: 15000000,
    rate: 3,
    amount: 450000,
    date: "22/01/2026",
    status: "Chờ đối soát",
  },
  {
    id: "HH260113-1",
    staff: "Võ Minh Nam",
    staffId: "NV2408280009",
    student: "Hoàng Anh Vy",
    invoiceValue: 12000000,
    rate: 5,
    amount: 600000,
    date: "13/01/2026",
    status: "Đã chi trả",
  },
];
