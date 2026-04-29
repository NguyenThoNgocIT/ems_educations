export interface TuitionPackage {
  id: string;
  duration: string;
  type: "Giảm theo số tiền" | "Giảm theo %";
  discount: number;
  creator: string;
  date: string;
}

export const initialTuitionData: TuitionPackage[] = [
  {
    id: "ENG",
    duration: "3 tháng",
    type: "Giảm theo số tiền",
    discount: 200000,
    creator: "Admin",
    date: "2026-01-27 13:33",
  },
  {
    id: "QY",
    duration: "3 tháng",
    type: "Giảm theo số tiền",
    discount: 150000,
    creator: "Admin",
    date: "2025-11-21 21:45",
  },
  {
    id: "TH",
    duration: "1 tháng",
    type: "Giảm theo số tiền",
    discount: 0,
    creator: "Admin",
    date: "2025-11-21 21:44",
  },
  {
    id: "Combo A1-B1",
    duration: "8 tháng",
    type: "Giảm theo số tiền",
    discount: 5000000,
    creator: "Admin",
    date: "2025-10-25 08:48",
  },
  {
    id: "11",
    duration: "5 tháng",
    type: "Giảm theo số tiền",
    discount: 10,
    creator: "Admin",
    date: "2025-08-20 11:10",
  },
];
