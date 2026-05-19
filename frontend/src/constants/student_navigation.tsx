import React from "react";
import { 
  Calendar,      // Lịch học
  GraduationCap, // Kết quả học tập
  BookOpen,      // Đăng ký học phần
  CreditCard,    // Học phí
  Bell,          // Thông báo
  FileText,      // Tài liệu học tập
  UserCircle     // Thông tin cá nhân
} from "lucide-react"; 

export const StudentNavGroups = [
  {
    groupName: "Chức năng học tập",
    items: [
      {
        name: "Lịch học",
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
        path: "/dashboard/student/tuition", // Có thể cập nhật lại path khi bạn tạo thêm folder tương ứng
        icon: <CreditCard className="w-[18px] h-[18px]" />,
      },
      {
        name: "Thời khóa biểu",
        path: "/dashboard/student/my-schedule", // Có thể cập nhật lại path khi bạn tạo thêm folder tương ứng
        icon: <Calendar className="w-[18px] h-[18px]" />,
      },
      {
        name: "Kết quả học tập",
        path: "/dashboard/student/academic-results", // Có thể cập nhật lại path khi bạn tạo thêm folder tương ứng
        icon: <GraduationCap className="w-[18px] h-[18px]" />,
      },
    ],
  },
  {
    groupName: "Cá nhân & Hỗ trợ",
    items: [
      {
        name: "Thông báo",
        path: "/dashboard/student/notifications",
        icon: <Bell className="w-[18px] h-[18px]" />,
      },
      {
        name: "Tài liệu học tập",
        path: "/dashboard/student/documents",
        icon: <FileText className="w-[18px] h-[18px]" />,
      },
      {
        name: "Thông tin cá nhân",
        path: "/profile", // Khớp với folder src/app/profile chung của hệ thống
        icon: <UserCircle className="w-[18px] h-[18px]" />,
      },
    ],
  },
];
