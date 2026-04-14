export interface ComboProgram {
  id: number;
  name: string;
  status: "Sắp diễn ra" | "Đang diễn ra" | "Đã kết thúc";
  originalPrice: string;
  discountPrice: string;
  discountPercent: string;
  totalPrice: string;
  startDate: string;
  endDate: string;
  duration: string;
  description: string;
}

const combosData: ComboProgram[] = [
  {
    id: 1,
    name: "Trọn gói từ A1",
    status: "Sắp diễn ra",
    originalPrice: "1,010,000,000",
    discountPrice: "0",
    discountPercent: "Infinity %",
    totalPrice: "1,010,000,000",
    startDate: "01/02/2026, 05:31",
    endDate: "15/02/2026, 05:31",
    duration: "14 ngày",
    description: "-",
  },
];

export default combosData;
