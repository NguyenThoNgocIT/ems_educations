export const expertiseTabs = [
  "Marketing",
  "Ngữ Văn 6",
  "Tiếng Anh Sơ Cấp",
  "Toán",
  "Võ cổ truyền",
  "Vovinam - Việt Võ Đạo",
];

export interface Curriculum {
  id: string;
  name: string;
  level: number;
  fee: number;
  expertise: string;
  creator: string;
  date: string;
}

export const initialCurriculumData: Curriculum[] = [
  {
    id: "Test",
    name: "Khóa học thử nghiệm",
    level: 1,
    fee: 1010000000,
    expertise: "Marketing",
    creator: "Võ Phương Duy",
    date: "19/12/2025",
  },
  {
    id: "ENG-01",
    name: "English Basic Communication",
    level: 1,
    fee: 5000000,
    expertise: "Tiếng Anh Sơ Cấp",
    creator: "Admin",
    date: "20/01/2026",
  },
  {
    id: "MAT-01",
    name: "Toán lớp 10 - Nâng cao",
    level: 10,
    fee: 2500000,
    expertise: "Toán",
    creator: "Admin",
    date: "15/01/2026",
  },
];
