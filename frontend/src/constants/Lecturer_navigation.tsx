import React from "react";
import { 
  LayoutDashboard,
  Calendar,       // Thay cho CalendarDays để khớp icon chuẩn
  Users,          // Thay cho FolderKanban để hiển thị "Lớp của tôi" chuẩn bài
  FileText,       // Thay cho Award để hiển thị "Nhập điểm"
  CheckSquare,    // Giữ nguyên cho "Điểm danh"
  DoorOpen,       // Thêm icon mới cho "Thông tin phòng"
  Bell,
  HeadphonesIcon,
  UserCircle,
} from "lucide-react"; 

export type NavItem = {
  name: string;
  path: string;
  icon: React.ReactNode;
  badge?: string;
};

export type NavGroup = {
  groupName: string;
  items: NavItem[];
};

export const LecturerNavGroups: NavGroup[] = [
  {
    groupName: "Tổng quan",
    items: [
      {
        name: "Bảng điều khiển",
        path: "/dashboard/lecturer",
        icon: <LayoutDashboard className="w-[18px] h-[18px]" />,
      },
    ],
  },
  {
    groupName: "Giảng dạy",
    items: [
      {
        name: "Lịch giảng dạy",
        path: "/dashboard/lecturer/my-schedule",
        icon: <Calendar className="w-[18px] h-[18px]" />,
      },
      {
        name: "Lớp của tôi",
        path: "/dashboard/lecturer/my-classes",
        icon: <Users className="w-[18px] h-[18px]" />,
      },
      {
        name: "Nhập điểm",
        path: "/dashboard/lecturer/enter-grades",
        icon: <FileText className="w-[18px] h-[18px]" />,
      },
      {
        name: "Điểm danh",
        path: "/dashboard/lecturer/attendance",
        icon: <CheckSquare className="w-[18px] h-[18px]" />,
      },
      {
        name: "Thông tin phòng",
        path: "/dashboard/lecturer/room-info",
        icon: <DoorOpen className="w-[18px] h-[18px]" />,
      },
    ],
  },
  {
    groupName: "Cá nhân",
    items: [
      {
        name: "Thông tin cá nhân",
        path: "/dashboard/lecturer/profile",
        icon: <UserCircle className="w-[18px] h-[18px]" />,
      },
    ],
  },
];
