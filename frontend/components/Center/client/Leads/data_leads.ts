export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  status: "Mới" | "Đăng ký học" | "Cần tư vấn lại";
  quality: "Chưa nhận định" | "Gọi lại sau" | "Tiềm năng" | "Đăng ký học";
  consultant: string;
  createdDate: string;
}

const leadsData: Lead[] = [
  {
    id: "241225-1",
    name: "Đỗ Hoàng Vũ",
    phone: "0969455217",
    status: "Mới",
    quality: "Chưa nhận định",
    consultant: "Tư vấn 1",
    createdDate: "25/12/2024",
  },
  {
    id: "031225-2",
    name: "Võ Đoàn",
    phone: "0945334535",
    status: "Cần tư vấn lại",
    quality: "Gọi lại sau",
    consultant: "Tư vấn 2",
    createdDate: "03/12/2024",
  },
  {
    id: "190126-1",
    name: "MM",
    phone: "0964507564",
    status: "Đăng ký học",
    quality: "Đăng ký học",
    consultant: "Tư vấn 1",
    createdDate: "19/01/2026",
  },
];

export default leadsData;
