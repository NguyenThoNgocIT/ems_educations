export type UserRole = "Admin" | "Giáo viên" | "Nhân viên" | "Tư vấn viên";

export interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: "Đang hoạt động" | "Tạm khóa";
  isAdmin?: boolean;
}

export const staffData: Staff[] = [
  {
    id: "NV260127-1",
    name: "Phan Thành Châu 1",
    email: "demo38851@gmail.com",
    phone: "0000 003 8851",
    role: "Giáo viên",
    status: "Đang hoạt động",
  },
  {
    id: "NV251222-2",
    name: "Trinh Le",
    email: "Tuyettrinle@gmail.com",
    phone: "090 310 2053",
    role: "Giáo viên",
    status: "Đang hoạt động",
  },
  {
    id: "NV250704-2",
    name: "Mr Hung",
    email: "abcv@gmail.com",
    phone: "0956 436 3353",
    role: "Nhân viên",
    status: "Đang hoạt động",
  },
  {
    id: "NV250704-1",
    name: "Justin",
    email: "abc@gmail.com",
    phone: "094725372",
    role: "Tư vấn viên",
    status: "Đang hoạt động",
  },
  {
    id: "QTV2207130001",
    name: "Admin",
    email: "demo1@gmail.com",
    phone: "000 000 0001",
    role: "Admin",
    status: "Đang hoạt động",
    isAdmin: true,
  },
];
