"use client";
import { NavItem } from "./navigation";
import {
  Users,
  GraduationCap,
  MessageSquare,
  BarChart3, // Thống kê
  Info, // Thông tin chung
  BookOpen, // Lớp học
  UserCog, // Quản lý
  CircleDollarSign, // Tài chính
} from "lucide-react";

// Nhóm 1: Trung tâm (Dựa theo ảnh: Thông tin chung & Thống kê)
export const CONSULTANT_CENTER_ITEMS: NavItem[] = [
  {
    name: "Thông tin chung",
    icon: <Info size={20} />,
    subItems: [
      { name: "Tin tức", path: "/dashboard/consultant/News" },
      { name: "Bảng lương", path: "/dashboard/consultant/payroll" },
    ],
  },
  {
    name: "Thống kê",
    icon: <BarChart3 size={20} />,
    subItems: [
      { name: "Thống kê & báo cáo", path: "/dashboard/consultant/reports" },
    ],
  },
  {
    name: "Khách hàng",
    icon: <Users size={20} />,
    subItems: [
      { name: "Quản lý Leads", path: "/dashboard/consultant/leads" },
      {
        name: "Đăng ký học",
        path: "/dashboard/consultant/course-registrations",
      },
      { name: "Mã khuyến mãi", path: "/dashboard/consultant/promotions" },
    ],
  },
];

// Nhóm 2: Học tập (Dựa theo ảnh: Lớp học, Học viên, Kết nối phụ huynh)
export const CONSULTANT_LEARNING_ITEMS: NavItem[] = [
  {
    name: "Lớp học",
    icon: <BookOpen size={20} />,
    subItems: [
      { name: "Danh sách lớp học", path: "/dashboard/consultant/class-list" },
      { name: "Kiểm tra lịch", path: "/dashboard/consultant/schedule" },
    ],
  },
  {
    name: "Học viên",
    icon: <GraduationCap size={20} />,
    subItems: [
      { name: "Danh sách học viên", path: "/dashboard/consultant/students" },
      {
        name: "Học viên trong lớp",
        path: "/dashboard/consultant/students-in-class",
      },
      { name: "Chuyển lớp", path: "/dashboard/consultant/class-transfer" },
      { name: "Bảo lưu", path: "/dashboard/consultant/reserve" },
      {
        name: "Kho tài liệu tham khảo",
        path: "/dashboard/consultant/documents",
      },
      { name: "Biên tập Video", path: "/dashboard/consultant/video-editor" }, // Link tới OpenCut
      {
        name: "Học viên sắp học xong",
        path: "/dashboard/consultant/coming-soon-students",
      },
      {
        name: "Quản lý hợp đồng",
        path: "/dashboard/consultant/contract-management",
      },
      {
        name: "Chờ xếp lớp",
        path: "/dashboard/consultant/waiting-class-assignment",
      },
    ],
  },
  {
    name: "Kết nối phụ huynh",
    icon: <MessageSquare size={20} />,
    subItems: [
      {
        name: "Danh sách phụ huynh",
        path: "/dashboard/consultant/parents-list",
      },
      { name: "Phản hồi", path: "/dashboard/consultant/feedback" },
      {
        name: "Cảnh báo học viên",
        path: "/dashboard/consultant/student-warnings",
      },
    ],
  },
];

// Nhóm 3: Quản lý (Dựa theo ảnh: Quản lý tài chính)
export const CONSULTANT_MANAGEMENT_ITEMS: NavItem[] = [
  {
    name: "Quản lý tài chính",
    icon: <CircleDollarSign size={20} />,
    subItems: [
      {
        name: "Thông tin thanh toán",
        path: "/dashboard/consultant/payment-info",
      },
      {
        name: "Duyệt thanh toán",
        path: "/dashboard/consultant/payment-approval",
      },
      { name: "Hoàn tiền", path: "/dashboard/consultant/refunds" },
      { name: "Hoa hồng", path: "/dashboard/consultant/commissions" },
    ],
  },
];
