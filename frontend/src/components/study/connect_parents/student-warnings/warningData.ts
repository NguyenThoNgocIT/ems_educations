export interface WarningEntry {
  id: string;
  name: string;
  phone: string;
  content: string;
  createdBy: string;
  createdAt: string;
  severity: "low" | "medium" | "high";
}

export const warningData: WarningEntry[] = [
  {
    id: "HV260109-1",
    name: "Võ Đoàn",
    phone: "0945334535",
    content: "Nghỉ học quá 3 buổi không phép",
    createdBy: "Admin",
    createdAt: "02/02/2026",
    severity: "high",
  },
  {
    id: "HV2408280001",
    name: "Nguyễn Minh Trang",
    phone: "0859051205",
    content: "Chưa hoàn thành bài tập buổi 5",
    createdBy: "Admin",
    createdAt: "02/02/2026",
    severity: "medium",
  },
];
