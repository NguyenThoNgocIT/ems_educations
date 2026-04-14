export interface KeywordItem {
  id: number;
  name: string;
  creator: string;
  date: string;
  type: "Câu hỏi" | "Bộ đề";
}

export const initialKeywordData: KeywordItem[] = [
  {
    id: 1,
    name: "Toán học cơ bản",
    creator: "Admin",
    date: "2024-10-03 09:37",
    type: "Câu hỏi",
  },
  {
    id: 2,
    name: "IELTS Reading",
    creator: "Admin",
    date: "2025-01-20 14:22",
    type: "Bộ đề",
  },
  {
    id: 3,
    name: "Ngữ pháp nâng cao",
    creator: "Võ Phương Duy",
    date: "2025-02-01 08:15",
    type: "Câu hỏi",
  },
  {
    id: 4,
    name: "Thi thử cuối kỳ",
    creator: "Admin",
    date: "2025-01-10 11:00",
    type: "Bộ đề",
  },
];
