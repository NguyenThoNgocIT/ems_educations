export interface Promotion {
  id: number;
  code: string;
  discountValue: string;
  packageType: "Gói lẻ" | "Gói combo";
  maxDiscount: string;
  status: "Đang chạy" | "Đã kết thúc";
  quantity: number;
  used: number;
  expiryDate: string;
}

const promotionsData: Promotion[] = [
  {
    id: 1,
    code: "KM5PT",
    discountValue: "5%",
    packageType: "Gói lẻ",
    maxDiscount: "2,000,000",
    status: "Đã kết thúc",
    quantity: 100,
    used: 4,
    expiryDate: "28/02/2025",
  },
  {
    id: 2,
    code: "KMT8",
    discountValue: "500,000",
    packageType: "Gói combo",
    maxDiscount: "500,000",
    status: "Đang chạy",
    quantity: 100,
    used: 14,
    expiryDate: "31/08/2024",
  },
];

export default promotionsData;
