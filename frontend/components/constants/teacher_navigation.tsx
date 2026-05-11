"use client";
import React from "react";
import { 
  FileText,     
  Grid,         
  UserCircle,   
  BookOpen, 
  MessageSquare, 
  Database, 
  BriefcaseBusiness 
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
    icon: <FileText />,
    name: "Thông tin chung",
    subItems: [
      { name: "Tin tức", path: "/News" },
      { name: "Bảng lương", path: "/payroll" },
      { name: "Đăng ký lịch nghỉ", path: "/leave-requests" },
    ],
  },
  {
    icon: <Grid />,
    name: "Thống kê",
    subItems: [{ name: "Lớp học", path: "/classes" }],
  },
  {
    icon: <BriefcaseBusiness size={20} />,
    name: "Khách hàng",
    subItems: [{ name: "Quản lý Leads", path: "/leads" }],
  },
];

// 2. KHỐI HỌC TẬP (Chuyên môn giảng dạy)
export const TEACHER_LEARNING_ITEMS: NavItem[] = [
  {
    icon: <BookOpen size={20} />,
    name: "Lớp học",
    subItems: [
      { name: "Danh sách lớp học", path: "/class-list" },
      { name: "Lịch dạy", path: "/exam-schedule" },
      { name: "Chỉnh sửa video bài học", path: "/edit-video-lessons" },
    ],
  },
  {
    icon: <UserCircle />,
    name: "Học viên",
    subItems: [
      { name: "Danh sách học viên", path: "/students-list" },
      { name: "Kho tài liệu tham khảo", path: "/reference-materials" },
    ],
  },
  {
    icon: <MessageSquare size={20} />,
    name: "Kết nối phụ huynh",
    subItems: [
      { name: "Phản hồi", path: "/feedback" },
      { name: "Cảnh báo học viên", path: "/waiting-class-assignment" },
    ],
  },
  {
    icon: <Database size={20} />,
    name: "Đề thi",
    subItems: [
      { name: "Bộ đề", path: "/examSets", pro: true },
      { name: "Ngân hàng đề", path: "/exam-bank", pro: true },
    ],
  },
];