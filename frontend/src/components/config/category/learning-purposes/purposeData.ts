export interface LearningPurpose {
  name: string;
  date: string;
  creator: string;
}

export const initialPurposeData: LearningPurpose[] = [
  {
    name: "Chứng chỉ quốc tế (IELTS/TOEIC)",
    date: "2024-08-28 10:14",
    creator: "Admin",
  },
  { name: "Phục vụ Công việc", date: "2024-08-28 11:19", creator: "Admin" },
  { name: "Định cư nước ngoài", date: "2024-08-30 11:26", creator: "Admin" },
  { name: "Du học", date: "2024-08-28 10:14", creator: "Admin" },
  {
    name: "Nâng cao kỹ năng giao tiếp",
    date: "2024-08-28 10:18",
    creator: "Admin",
  },
];
