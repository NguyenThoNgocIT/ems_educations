"use client";
import React from "react";
import {
  LayoutDashboard,
  Users,
  User,
  BookOpen,
  Layers,
  Building,
  DoorOpen,
  Clock,
  CalendarDays,
  Calendar,
  FileText,
  CheckSquare,
  GraduationCap,
  Award,
  ClipboardList,
} from "lucide-react";

export type NavItem = {
  name: string;
  icon: React.ReactNode;
  path: string;
};

// ==================== ADMIN MENU (9 mục) ====================
export const adminNavItems: NavItem[] = [
  { name: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" />, path: "/dashboard/admin" },
  { name: "Sinh viên", icon: <Users className="h-5 w-5" />, path: "/dashboard/admin/students" },
  { name: "Giảng viên", icon: <User className="h-5 w-5" />, path: "/dashboard/admin/lecturers" },
  { name: "Môn học", icon: <BookOpen className="h-5 w-5" />, path: "/dashboard/admin/courses" },
  { name: "Lớp học phần", icon: <Layers className="h-5 w-5" />, path: "/dashboard/admin/course-classes" },
  { name: "Tòa nhà", icon: <Building className="h-5 w-5" />, path: "/dashboard/admin/buildings" },
  { name: "Phòng học", icon: <DoorOpen className="h-5 w-5" />, path: "/dashboard/admin/rooms" },
  { name: "Ca học", icon: <Clock className="h-5 w-5" />, path: "/dashboard/admin/time-slots" },
  { name: "Thời khóa biểu", icon: <CalendarDays className="h-5 w-5" />, path: "/dashboard/admin/schedules" },
];

// ==================== LECTURER MENU (6 mục) ====================
export const lecturerNavItems: NavItem[] = [
  { name: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" />, path: "/dashboard/lecturer" },
  { name: "Lịch giảng dạy", icon: <Calendar className="h-5 w-5" />, path: "/dashboard/lecturer/my-schedule" },
  { name: "Lớp của tôi", icon: <Users className="h-5 w-5" />, path: "/dashboard/lecturer/my-classes" },
  { name: "Nhập điểm", icon: <FileText className="h-5 w-5" />, path: "/dashboard/lecturer/enter-grades" },
  { name: "Điểm danh", icon: <CheckSquare className="h-5 w-5" />, path: "/dashboard/lecturer/attendance" },
  { name: "Thông tin phòng", icon: <DoorOpen className="h-5 w-5" />, path: "/dashboard/lecturer/room-info" },
];

// ==================== STUDENT MENU (4 mục) ====================
export const studentNavItems: NavItem[] = [
  { name: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" />, path: "/dashboard/student" },
  { name: "Thời khóa biểu", icon: <Calendar className="h-5 w-5" />, path: "/dashboard/student/my-schedule" },
  { name: "Kết quả học tập", icon: <Award className="h-5 w-5" />, path: "/dashboard/student/academic-results" },
  { name: "Đăng ký học phần", icon: <ClipboardList className="h-5 w-5" />, path: "/dashboard/student/course-registration" },
];

// Giữ nguyên cho tương thích code cũ
export const CenterItems: NavItem[] = adminNavItems;
export const LearingItems: NavItem[] = [];
export const navItems: NavItem[] = [];
export const othersItems: NavItem[] = [];