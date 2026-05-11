export interface ProjectedSalary {
  name: string;
  base: number;
  actualTeaching: number;
  expectedTeaching: number;
  actualTotal: number;
  actualSessions: number;
  expectedTotal: number;
  expectedSessions: number;
}

export const projectedPayrollData: ProjectedSalary[] = [
  {
    name: "Justin",
    base: 8000000,
    actualTeaching: 1200000,
    expectedTeaching: 2500000,
    actualTotal: 9200000,
    actualSessions: 12,
    expectedTotal: 10500000,
    expectedSessions: 24,
  },
  {
    name: "Mr Hung",
    base: 9000000,
    actualTeaching: 3000000,
    expectedTeaching: 4500000,
    actualTotal: 12000000,
    actualSessions: 20,
    expectedTotal: 13500000,
    expectedSessions: 30,
  },
  {
    name: "Trinh Le",
    base: 7500000,
    actualTeaching: 800000,
    expectedTeaching: 1800000,
    actualTotal: 8300000,
    actualSessions: 8,
    expectedTotal: 9300000,
    expectedSessions: 18,
  },
  {
    name: "Phan Thành Châu 1",
    base: 8500000,
    actualTeaching: 0,
    expectedTeaching: 3000000,
    actualTotal: 8500000,
    actualSessions: 0,
    expectedTotal: 11500000,
    expectedSessions: 25,
  },
];
