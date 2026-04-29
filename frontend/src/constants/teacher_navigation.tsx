"use client";
import React from "react";
import { PageIcon, GridIcon, UserCircleIcon } from "@/icons/index";
import {
  BookOpen,
  MessageSquare,
  Database,
  BriefcaseBusiness,
} from "lucide-react";

export type NavItem = {
  name: string;
  icon?: React.ReactNode;
  path?: string;
  pro?: boolean;
  new?: boolean;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

// 1. KHỐI TRUNG TÂM (Tập trung vào cá nhân giáo viên)
export const TEACHER_CENTER_ITEMS: NavItem[] = [
  {
    icon: <PageIcon />,
    name: "Thông tin chung",
    subItems: [
      { name: "Tin tức", path: "/dashboard/teacher/News" },
      { name: "Bảng lương", path: "/dashboard/teacher/payroll" },
      { name: "Đăng ký lịch nghỉ", path: "/dashboard/teacher/leave-requests" },
    ],
  },
  {
    icon: <GridIcon />,
    name: "Thống kê",
    subItems: [{ name: "Lớp học", path: "/dashboard/teacher/classes" }],
  },
  {
    icon: <BriefcaseBusiness size={20} />,
    name: "Khách hàng",
    subItems: [{ name: "Quản lý Leads", path: "/dashboard/teacher/leads" }],
  },
];

// 2. KHỐI HỌC TẬP (Chuyên môn giảng dạy)
export const TEACHER_LEARNING_ITEMS: NavItem[] = [
  {
    icon: <BookOpen size={20} />,
    name: "Lớp học",
    subItems: [
      { name: "Danh sách lớp học", path: "/dashboard/teacher/class-list" },
      { name: "Lịch dạy", path: "/dashboard/teacher/exam-schedule" },
      {
        name: "Chỉnh sửa video bài học",
        path: "/dashboard/teacher/edit-video-lessons",
      },
    ],
  },
  {
    icon: <UserCircleIcon />,
    name: "Học viên",
    subItems: [
      { name: "Danh sách học viên", path: "/dashboard/teacher/students-list" },
      {
        name: "Kho tài liệu tham khảo",
        path: "/dashboard/teacher/reference-materials",
      },
    ],
  },
  {
    icon: <MessageSquare size={20} />,
    name: "Kết nối phụ huynh",
    subItems: [
      { name: "Phản hồi", path: "/dashboard/teacher/feedback" },
      {
        name: "Cảnh báo học viên",
        path: "/dashboard/teacher/waiting-class-assignment",
      },
    ],
  },
  {
    icon: <Database size={20} />,
    name: "Đề thi",
    subItems: [
      { name: "Bộ đề", path: "/dashboard/teacher/examSets", pro: true }, // Có badge Add on
      { name: "Ngân hàng đề", path: "/dashboard/teacher/exam-bank", pro: true }, // Có badge Add on
    ],
  },
];
