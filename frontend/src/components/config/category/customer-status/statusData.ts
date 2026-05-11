export interface CustomerStatus {
  pos: number;
  name: string;
  color: string;
  creator: string;
  date: string;
}

export const initialStatusData: CustomerStatus[] = [
  {
    pos: 1,
    name: "Đã tư vấn",
    color: "bg-blue-600",
    creator: "Admin",
    date: "2024-06-05",
  },
  {
    pos: 2,
    name: "Từ chối học",
    color: "bg-rose-600",
    creator: "Admin",
    date: "2024-07-12",
  },
  {
    pos: 3,
    name: "Sai thông tin",
    color: "bg-rose-500",
    creator: "Admin",
    date: "2024-08-29",
  },
  {
    pos: 4,
    name: "Đã liên hệ",
    color: "bg-cyan-500",
    creator: "Hệ thống",
    date: "2022-10-18",
  },
  {
    pos: 5,
    name: "Spam",
    color: "bg-slate-400",
    creator: "Admin",
    date: "2024-08-29",
  },
  {
    pos: 6,
    name: "Đã học",
    color: "bg-emerald-500",
    creator: "Admin",
    date: "2024-06-05",
  },
  {
    pos: 7,
    name: "Cần tư vấn",
    color: "bg-orange-500",
    creator: "Hệ thống",
    date: "2022-10-18",
  },
];
