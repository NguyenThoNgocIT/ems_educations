export interface LearningNeed {
  id: number;
  name: string;
  creator: string;
}

export const initialNeedsData: LearningNeed[] = [
  { id: 1, name: "AEROBIC", creator: "Admin" },
  { id: 2, name: "Giao tiếp cơ bản", creator: "Admin" },
  { id: 3, name: "Luyện thi IELTS 7.0+", creator: "Admin" },
  { id: 4, name: "Tiếng Anh doanh nghiệp", creator: "Admin" },
  { id: 5, name: "Tiếng Anh trẻ em", creator: "Admin" },
  { id: 6, name: "Vovinam cơ bản", creator: "Admin" },
];
