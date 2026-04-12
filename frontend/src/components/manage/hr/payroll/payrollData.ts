export interface PayrollEntry {
  id: string;
  name: string;
  baseSalary: number;
  teachingSalary: number;
  advanceDeduction: number;
  bonus: number;
  totalSalary: number;
  notes: string;
}

export const payrollData: PayrollEntry[] = [
  {
    id: "NV260127-1",
    name: "Phan Thành Châu 1",
    baseSalary: 8000000,
    teachingSalary: 2500000,
    advanceDeduction: 500000,
    bonus: 1000000,
    totalSalary: 11000000,
    notes: "Thưởng dự án Tết",
  },
  {
    id: "NV251222-2",
    name: "Trinh Le",
    baseSalary: 7500000,
    teachingSalary: 1200000,
    advanceDeduction: 0,
    bonus: 200000,
    totalSalary: 8900000,
    notes: "",
  },
  {
    id: "NV250704-2",
    name: "Mr Hung",
    baseSalary: 9000000,
    teachingSalary: 3000000,
    advanceDeduction: 1000000,
    bonus: 500000,
    totalSalary: 11500000,
    notes: "Trừ tạm ứng tháng 1",
  },
];
