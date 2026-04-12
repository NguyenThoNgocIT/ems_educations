export interface GradeTemplate {
  id: number;
  name: string;
  creator: string;
  createdAt: string;
}

export const gradeTemplateData: GradeTemplate[] = [
  {
    id: 1,
    name: "Bảng điểm IELTS Writing Task 1",
    creator: "Admin",
    createdAt: "15/01/2026",
  },
  {
    id: 2,
    name: "Sổ điểm Môn Văn - Khối 6",
    creator: "Admin",
    createdAt: "20/01/2026",
  },
  {
    id: 3,
    name: "Sổ điểm Môn Toán - Cơ bản",
    creator: "Admin",
    createdAt: "27/01/2026",
  },
  {
    id: 4,
    name: "Đánh giá kỹ năng Vovinam",
    creator: "Võ Phương Duy",
    createdAt: "02/02/2026",
  },
];
