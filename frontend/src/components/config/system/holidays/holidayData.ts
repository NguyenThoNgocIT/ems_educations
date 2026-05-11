export interface Holiday {
  id: number;
  name: string;
  start: string;
  end: string;
  type: "Nghỉ lễ" | "Nghỉ đặc biệt";
  applyTo: string;
  status: "Đang áp dụng" | "Chờ tới ngày" | "Đã kết thúc";
}

export const initialHolidayData: Holiday[] = [
  {
    id: 1,
    name: "Nghỉ Tết Nguyên Đán 2026",
    start: "2026-01-25",
    end: "2026-02-02",
    type: "Nghỉ lễ",
    applyTo: "Toàn hệ thống",
    status: "Đang áp dụng",
  },
  {
    id: 2,
    name: "Giỗ tổ Hùng Vương",
    start: "2026-04-25",
    end: "2026-04-25",
    type: "Nghỉ lễ",
    applyTo: "Toàn hệ thống",
    status: "Chờ tới ngày",
  },
  {
    id: 3,
    name: "Nghỉ hè cơ sở Tân Bình",
    start: "2026-06-01",
    end: "2026-06-05",
    type: "Nghỉ đặc biệt",
    applyTo: "1 - Tân Bình HCM",
    status: "Chờ tới ngày",
  },
];
