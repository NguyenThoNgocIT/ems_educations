// constants/consultant_data.ts

export interface LeadItem {
  name: string;
  phone: string;
  course: string;
  status: string;
  source: string;
  goal: string;
}

export interface ConsultantStats {
  baseSalary: number;
  kpiTarget: number;
  currentIncome: number;
  maxIncome: number;
  currentSales: number;
  kpiPercentage: number;
  currentCommission: number;
  maxCommission: number;
}

export const MOCK_LEADS: LeadItem[] = [
  {
    name: "Đặng Văn Mai",
    phone: "0000919906",
    course: "THPT 0-2.5",
    status: "Cần tư vấn",
    source: "Zalo",
    goal: "Du học",
  },
  {
    name: "Hoàng Thái Dũng",
    phone: "0000919905",
    course: "THPT 2.5-3.5",
    status: "Cần tư vấn",
    source: "Zalo",
    goal: "Du học",
  },
  {
    name: "Đặng Cẩm Sơn",
    phone: "0000919904",
    course: "THPT 0-2.5",
    status: "Cần tư vấn",
    source: "Zalo",
    goal: "Du học",
  },
  {
    name: "Phạm Minh Hoa",
    phone: "0000919903",
    course: "CB2 - IELTS 5.5 - 6.5",
    status: "Cần tư vấn",
    source: "Zalo",
    goal: "Du học",
  },
  {
    name: "Đoàn Cẩm Hoa",
    phone: "0000919902",
    course: "CB2 - IELTS 4.5 - 5.5",
    status: "Cần tư vấn",
    source: "Zalo",
    goal: "Du học",
  },
];

export const CONSULTANT_STATS: ConsultantStats = {
  baseSalary: 15000000,
  kpiTarget: 250000000,
  currentIncome: 35000000,
  maxIncome: 40000000,
  currentSales: 200000000,
  kpiPercentage: 80,
  currentCommission: 20000000,
  maxCommission: 25000000,
};

export const SUB_TABS = [
  "Lead cần tư vấn",
  "Học viên cần xếp lớp",
  "Học viên cần thu học phí",
  "Học viên cần upsell",
];
