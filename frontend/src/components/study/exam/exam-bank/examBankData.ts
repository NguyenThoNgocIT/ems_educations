export interface Exam {
  id: string;
  title: string;
  questions: number;
  duration: string;
  category?: string;
}

export const examsData: Exam[] = [
  {
    id: "11111",
    title: "Kiểm tra đầu vào Starter",
    questions: 10,
    duration: "23m",
  },
  {
    id: "Test-Vio",
    title: "Luyện thi Violympic",
    questions: 20,
    duration: "10m",
  },
  { id: "123", title: "Demo Đề thi thử", questions: 0, duration: "2h" },
  { id: "IETR", title: "IELTS Trial Test 2026", questions: 21, duration: "5m" },
  {
    id: "Mã đề 1",
    title: "Steven - Final Test Level 1",
    questions: 19,
    duration: "50m",
  },
  {
    id: "General-Test",
    title: "General English Test",
    questions: 4,
    duration: "30m",
  },
  {
    id: "ENGLISHBASIC",
    title: "English Basic 111",
    questions: 18,
    duration: "1h30m",
  },
  {
    id: "T400",
    title: "TOEIC 400 - Practice Set 1",
    questions: 7,
    duration: "2h2m",
  },
  { id: "IR1", title: "IELTS Reading Test 1", questions: 9, duration: "3h" },
];
