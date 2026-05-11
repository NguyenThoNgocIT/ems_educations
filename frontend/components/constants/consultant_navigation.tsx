"use client";
import React from "react";
import { 
  Users,
  GraduationCap,
  MessageSquare,
  BarChart3,
  Info,
  BookOpen,
  UserCog,
  CircleDollarSign,
} from "lucide-react";

import { NavItem } from "./navigation";

export const CONSULTANT_CENTER_ITEMS: NavItem[] = [
  {
    name: "Thông tin chung",
    icon: <Info size={20} />,
    subItems: [
      { name: "Tin tức", path: "/News" },
      { name: "Bảng lương", path: "/payroll" },
    ],
  },
  {
    name: "Thống kê",
    icon: <BarChart3 size={20} />,
    subItems: [
      { name: "Thống kê & báo cáo", path: "/reports" },
    ],
  },
  {
    name: "Khách hàng",
    icon: <Users size={20} />,
    subItems: [
      { name: "Quản lý Leads", path: "/leads" },
      { name: "Đăng ký học", path: "/course-registrations" },
      { name: "Mã khuyến mãi", path: "/promotions" },
    ],
  },
];

export const CONSULTANT_LEARNING_ITEMS: NavItem[] = [
  {
    name: "Lớp học",
    icon: <BookOpen size={20} />,
    subItems: [
      { name: "Danh sách lớp học", path: "/class-list" },
      { name: "Kiểm tra lịch", path: "/schedule" },
    ],
  },
  {
    name: "Học viên",
    icon: <GraduationCap size={20} />,
    subItems: [
      { name: "Danh sách học viên", path: "/students" },
      { name: "Học viên trong lớp", path: "/students-in-class" },
      { name: "Chuyển lớp", path: "/class-transfer" },
      { name: "Bảo lưu", path: "/reserve" },
      { name: "Kho tài liệu tham khảo", path: "/documents" },
      { name: "Biên tập Video", path: "/video-editor" },
      { name: "Học viên sắp học xong", path: "/coming-soon-students" },
      { name: "Quản lý hợp đồng", path: "/contract-management" },
      { name: "Chờ xếp lớp", path: "/waiting-class-assignment" },
    ],
  },
  {
    name: "Kết nối phụ huynh",
    icon: <MessageSquare size={20} />,
    subItems: [
      { name: "Danh sách phụ huynh", path: "/parents-list" },
      { name: "Phản hồi", path: "/feedback" },
      { name: "Cảnh báo học viên", path: "/student-warnings" },
    ],
  },
];

export const CONSULTANT_MANAGEMENT_ITEMS: NavItem[] = [
  {
    name: "Quản lý tài chính",
    icon: <CircleDollarSign size={20} />,
    subItems: [
      { name: "Thông tin thanh toán", path: "/payment-info" },
      { name: "Duyệt thanh toán", path: "/payment-approval" },
      { name: "Hoàn tiền", path: "/refunds" },
      { name: "Hoa hồng", path: "/commissions" },
    ],
  },
];