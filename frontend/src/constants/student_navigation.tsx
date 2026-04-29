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
    path: "/dashboard/student",
    icon: <Activity size={18} />,
  },
  {
    name: "Lớp học",
    path: "/dashboard/student/class-list",
    icon: <BookOpen size={18} />,
  },
  {
    name: "Lịch học",
    path: "/dashboard/student/exam-schedule",
    icon: <Calendar size={18} />,
  },
  {
    name: "Thư viện",
    path: "/dashboard/student/reference-materials",
    icon: <Library size={18} />,
  },
  {
    name: "Luyện đề",
    path: "/dashboard/student/exam-bank",
    icon: <PenTool size={18} />,
  },
  {
    name: "Phản hồi",
    path: "/dashboard/student/feedback",
    icon: <MessageSquare size={18} />,
  },
  {
    name: "Tin tức",
    path: "/dashboard/student/News",
    icon: <Newspaper size={18} />,
  },
];
