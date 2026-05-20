import React from "react";
import { 
  LayoutDashboard,
  Calendar,      // Lịch học
  GraduationCap, // Kết quả học tập
  BookOpen,      // Đăng ký học phần
  Bell,
  CreditCard,
  FileText,
  UserCircle,
} from "lucide-react"; 

export const StudentNavGroups = [
  {
    groupName: "Tổng quan",
    items: [
      {
        name: "Bảng điều khiển",
        path: "/dashboard/student",
        icon: <LayoutDashboard className="w-[18px] h-[18px]" />,
      },
    ],
  },
  {
    groupName: "Học tập",
    items: [
      {
        name: "Thời khóa biểu",
        path: "/dashboard/student/my-schedule",
        icon: <Calendar className="w-[18px] h-[18px]" />,
      },
      {
        name: "Kết quả học tập",
        path: "/dashboard/student/academic-results",
        icon: <GraduationCap className="w-[18px] h-[18px]" />,
      },
      {
        name: "Đăng ký học phần",
        path: "/dashboard/student/course-registration",
        icon: <BookOpen className="w-[18px] h-[18px]" />,
      },
      {
        name: "Học phí",
        path: "/dashboard/student/tuition",
        icon: <CreditCard className="w-[18px] h-[18px]" />,
        badge: "Sắp có",
      },
    ],
  },
  {
    groupName: "Cá nhân",
    items: [
      {
        name: "Thông báo",
        path: "/dashboard/student/notifications",
        icon: <Bell className="w-[18px] h-[18px]" />,
        badge: "Sắp có",
      },
      {
        name: "Tài liệu học tập",
        path: "/dashboard/student/documents",
        icon: <FileText className="w-[18px] h-[18px]" />,
        badge: "Sắp có",
      },
      {
        name: "Thông tin cá nhân",
        path: "/profile",
        icon: <UserCircle className="w-[18px] h-[18px]" />,
      },
    ],
  },
];
