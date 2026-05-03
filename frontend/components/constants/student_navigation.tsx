import {
  Activity,
  BookOpen,
  Calendar,
  Library,
  PenTool,
  MessageSquare,
  Newspaper,
} from "lucide-react";

export const STUDENT_NAV_ITEMS = [
  {
    name: "Tiến trình học tập",
    path: "/",                    // Trang chính của Student
    icon: <Activity size={18} />,
  },
  {
    name: "Lớp học",
    path: "/class-list",
    icon: <BookOpen size={18} />,
  },
  {
    name: "Lịch học",
    path: "/exam-schedule",
    icon: <Calendar size={18} />,
  },
  {
    name: "Thư viện",
    path: "/reference-materials",
    icon: <Library size={18} />,
  },
  {
    name: "Luyện đề",
    path: "/exam-bank",
    icon: <PenTool size={18} />,
  },
  {
    name: "Phản hồi",
    path: "/feedback",
    icon: <MessageSquare size={18} />,
  },
  {
    name: "Tin tức",
    path: "/News",
    icon: <Newspaper size={18} />,
  },
];