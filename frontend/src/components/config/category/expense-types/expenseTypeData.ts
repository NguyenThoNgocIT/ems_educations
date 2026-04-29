export interface ExpenseType {
  id: number;
  name: string;
  creator: string;
  createdAt: string;
}

export const expenseTypeData: ExpenseType[] = [
  {
    id: 1,
    name: "Chi lương giảng viên",
    creator: "Admin",
    createdAt: "15/01/2026",
  },
  {
    id: 2,
    name: "Chi phí Marketing/Quảng cáo",
    creator: "Admin",
    createdAt: "20/01/2026",
  },
  {
    id: 3,
    name: "Thanh toán tiền điện, nước",
    creator: "Admin",
    createdAt: "05/12/2025",
  },
  {
    id: 4,
    name: "Sửa chữa cơ sở vật chất",
    creator: "Admin",
    createdAt: "10/01/2026",
  },
  {
    id: 5,
    name: "Mua sắm văn phòng phẩm",
    creator: "Admin",
    createdAt: "18/12/2025",
  },
];
