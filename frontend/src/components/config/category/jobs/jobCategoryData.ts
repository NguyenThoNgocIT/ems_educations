export interface JobCategoryItem {
  id: number;
  name: string;
  creator: string;
  createdAt: string;
}

export const initialJobData: JobCategoryItem[] = [
  {
    id: 1,
    name: "Doanh nhân/ quản lý",
    creator: "Admin",
    createdAt: "2024-08-28",
  },
  { id: 2, name: "Freelancer", creator: "Admin", createdAt: "2024-08-30" },
  { id: 3, name: "Học sinh", creator: "Admin", createdAt: "2024-08-28" },
  {
    id: 4,
    name: "Nhân viên văn phòng",
    creator: "Admin",
    createdAt: "2024-08-30",
  },
  { id: 5, name: "Sinh viên", creator: "Admin", createdAt: "2024-08-28" },
];
