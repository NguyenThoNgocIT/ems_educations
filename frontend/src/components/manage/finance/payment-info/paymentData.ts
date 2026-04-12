export interface Payment {
  id: string;
  type: "Đăng ký học" | "Phí chuyển lớp" | "Phí tài liệu";
  payer: string;
  payerId: string;
  total: number;
  paid: number;
  balance: number;
  creator: string;
  createdAt: string; // Định dạng chuẩn: YYYY-MM-DD HH:mm
}

export const paymentData: Payment[] = [
  {
    id: "B260203-1",
    type: "Đăng ký học",
    payer: "Nguyễn Bảo Châu",
    payerId: "HV260130-1",
    total: 9000000,
    paid: 9000000,
    balance: 0,
    creator: "Admin",
    createdAt: "2026-02-03 09:50",
  },
  {
    id: "B260202-2",
    type: "Đăng ký học",
    payer: "Lê Văn Tám",
    payerId: "HV260202-1",
    total: 5000000,
    paid: 0,
    balance: 5000000,
    creator: "Admin",
    createdAt: "2026-02-02 14:20",
  },
  {
    id: "B260128-1",
    type: "Phí tài liệu",
    payer: "Trần Thị B",
    payerId: "HV260128-1",
    total: 200000,
    paid: 200000,
    balance: 0,
    creator: "Admin",
    createdAt: "2026-01-28 10:00",
  },
  {
    id: "B251118-1",
    type: "Phí chuyển lớp",
    payer: "Nguyễn Hữu Phước",
    payerId: "HV251009-1",
    total: 1000000,
    paid: 0,
    balance: 1000000,
    creator: "Admin",
    createdAt: "2025-11-18 08:21",
  },
];
