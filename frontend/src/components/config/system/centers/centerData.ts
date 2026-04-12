export interface Center {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
}

export const initialCenterData: Center[] = [
  {
    id: "CS1",
    name: "1 - Tân Bình HCM",
    address: "1073/23 CMT8",
    phone: "1900636648",
    email: "mona@gmail.com",
  },
  {
    id: "ANMD",
    name: "Anh Ngữ Dương Minh",
    address: "Quận 10, HCM",
    phone: "09767671",
    email: "tvkh@minhduong.vn",
  },
  {
    id: "ANMH",
    name: "Anh Ngữ Ms Hoa",
    address: "Quận Phú Nhuận",
    phone: "0987787778",
    email: "tvkh@mshoa.vn",
  },
  {
    id: "KDBC",
    name: "CLB Vovinam TH Kim Đồng - Bến Cát",
    address: "Bình Dương",
    phone: "0123456789",
    email: "vovinam@gmail.com",
  },
  {
    id: "CS2",
    name: "CS2 - Bình Thạnh HCM",
    address: "123 Hoàng Sa",
    phone: "1900636648",
    email: "mona@gmail.com",
  },
];
