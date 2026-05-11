export interface PopupItem {
  id: number;
  name: string;
  start: { time: string; date: string };
  end: { time: string; date: string };
  delay: string;
  creator: { name: string; time: string; date: string };
  editor: { name: string; time: string; date: string };
  isActive: boolean;
}

export const initialPopupData: PopupItem[] = [
  {
    id: 1,
    name: "Thông báo Lịch nghỉ Tết 2026",
    start: { time: "00:00", date: "2026-01-20" },
    end: { time: "23:59", date: "2026-02-05" },
    delay: "2 giây",
    creator: { name: "Admin", time: "23:01", date: "09-10-2025" },
    editor: { name: "Admin", time: "23:01", date: "09-10-2025" },
    isActive: true,
  },
  {
    id: 2,
    name: "Khuyến mãi khóa học IELTS Tháng 2",
    start: { time: "09:00", date: "2026-02-01" },
    end: { time: "00:00", date: "2026-02-28" },
    delay: "5 giây",
    creator: { name: "Admin", time: "22:51", date: "09-10-2025" },
    editor: { name: "Admin", time: "15:21", date: "10-10-2025" },
    isActive: false,
  },
];
