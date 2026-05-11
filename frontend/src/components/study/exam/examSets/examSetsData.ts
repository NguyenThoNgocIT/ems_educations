export interface ExamSet {
  id: number;
  title: string;
  sales: number;
  price: string;
  image: string;
  color: string;
}

export const examSetsData: ExamSet[] = [
  {
    id: 1,
    title: "21111",
    sales: 0,
    price: "11,111 VNĐ",
    image: "/images/exam/xmas.jpg",
    color: "bg-[#7c1d1d]",
  },
  {
    id: 2,
    title: "Test vio",
    sales: 0,
    price: "10,000 VNĐ",
    image: "/images/exam/panda.jpg",
    color: "bg-[#3B82F6]",
  },
  {
    id: 3,
    title: "Toiec cho người mới bắt đầu",
    sales: 12,
    price: "50,000 VNĐ",
    image: "/images/exam/panda.jpg",
    color: "bg-[#22C55E]",
  },
];
