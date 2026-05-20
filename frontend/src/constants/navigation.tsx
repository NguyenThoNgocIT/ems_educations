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
  Target,
  ShieldCheck,
} from "lucide-react";

export type NavItem = {
  name: string;
  icon: React.ReactNode;
  path: string;
};

export type NavGroup = {
  groupName: string;
  items: NavItem[];
};

// ==================== ADMIN MENU FLAT LIST (Để tương thích ngược nếu cần) ====================
export const adminNavItems: NavItem[] = [
  { name: "Sinh viên", icon: <Users className="h-[18px] w-[18px]" />, path: "/dashboard/admin/students" },
  { name: "Giảng viên", icon: <User className="h-[18px] w-[18px]" />, path: "/dashboard/admin/lecturers" },
  { name: "Ngành học", icon: <GraduationCap className="h-[18px] w-[18px]" />, path: "/dashboard/admin/majors" },
  { name: "Chương trình đào tạo", icon: <Target className="h-[18px] w-[18px]" />, path: "/dashboard/admin/training-programs" },
  { name: "Môn học", icon: <BookOpen className="h-[18px] w-[18px]" />, path: "/dashboard/admin/courses" },
  { name: "Lớp học phần", icon: <Layers className="h-[18px] w-[18px]" />, path: "/dashboard/admin/course-classes" },
  { name: "Năm học", icon: <Calendar className="h-[18px] w-[18px]" />, path: "/dashboard/admin/school-years" },
  { name: "Học kỳ", icon: <CalendarDays className="h-[18px] w-[18px]" />, path: "/dashboard/admin/semesters" },
  { name: "Tòa nhà", icon: <Building className="h-[18px] w-[18px]" />, path: "/dashboard/admin/buildings" },
  { name: "Phòng học", icon: <DoorOpen className="h-[18px] w-[18px]" />, path: "/dashboard/admin/rooms" },
  { name: "Ca học", icon: <Clock className="h-[18px] w-[18px]" />, path: "/dashboard/admin/time-slots" },
  { name: "Thời khóa biểu", icon: <CalendarDays className="h-[18px] w-[18px]" />, path: "/dashboard/admin/schedules" },
];

// ==================== ADMIN MENU GROUPED (Giải pháp 1 - Chia nhóm danh mục) ====================
export const adminNavGroups: NavGroup[] = [
  {
    groupName: "Nhân sự & Người dùng",
    items: [
      { name: "Sinh viên", icon: <Users className="h-[18px] w-[18px]" />, path: "/dashboard/admin/students" },
      { name: "Giảng viên", icon: <User className="h-[18px] w-[18px]" />, path: "/dashboard/admin/lecturers" },
    ],
  },
  {
    groupName: "Quản lý Đào tạo",
    items: [
      { name: "Ngành học", icon: <GraduationCap className="h-[18px] w-[18px]" />, path: "/dashboard/admin/majors" },
      { name: "Chương trình đào tạo", icon: <Target className="h-[18px] w-[18px]" />, path: "/dashboard/admin/training-programs" },
      { name: "Môn học", icon: <BookOpen className="h-[18px] w-[18px]" />, path: "/dashboard/admin/courses" },
      { name: "Lớp học phần", icon: <Layers className="h-[18px] w-[18px]" />, path: "/dashboard/admin/course-classes" },
      { name: "Năm học", icon: <Calendar className="h-[18px] w-[18px]" />, path: "/dashboard/admin/school-years" },
      { name: "Học kỳ", icon: <CalendarDays className="h-[18px] w-[18px]" />, path: "/dashboard/admin/semesters" },
      { name: "Thời khóa biểu", icon: <CalendarDays className="h-[18px] w-[18px]" />, path: "/dashboard/admin/schedules" },
    ],
  },
  {
    groupName: "Cơ sở vật chất",
    items: [
      { name: "Tòa nhà", icon: <Building className="h-[18px] w-[18px]" />, path: "/dashboard/admin/buildings" },
      { name: "Phòng học", icon: <DoorOpen className="h-[18px] w-[18px]" />, path: "/dashboard/admin/rooms" },
      { name: "Ca học", icon: <Clock className="h-[18px] w-[18px]" />, path: "/dashboard/admin/time-slots" },
    ],
  },
  {
    groupName: "Quản trị hệ thống",
    items: [
      { name: "Phân quyền (RBAC)", icon: <ShieldCheck className="h-[18px] w-[18px]" />, path: "/dashboard/admin/rbac" },
    ],
  },
];

// ==================== LECTURER MENU (5 mục) ====================
export const lecturerNavItems: NavItem[] = [
  { name: "Lịch giảng dạy", icon: <Calendar className="h-[18px] w-[18px]" />, path: "/dashboard/lecturer/my-schedule" },
  { name: "Lớp của tôi", icon: <Users className="h-[18px] w-[18px]" />, path: "/dashboard/lecturer/my-classes" },
  { name: "Nhập điểm", icon: <FileText className="h-[18px] w-[18px]" />, path: "/dashboard/lecturer/enter-grades" },
  { name: "Điểm danh", icon: <CheckSquare className="h-[18px] w-[18px]" />, path: "/dashboard/lecturer/attendance" },
  { name: "Thông tin phòng", icon: <DoorOpen className="h-[18px] w-[18px]" />, path: "/dashboard/lecturer/room-info" },
];

// ==================== STUDENT MENU (3 mục) ====================
export const studentNavItems: NavItem[] = [
  { name: "Thời khóa biểu", icon: <Calendar className="h-[18px] w-[18px]" />, path: "/dashboard/student/my-schedule" },
  { name: "Kết quả học tập", icon: <Award className="h-[18px] w-[18px]" />, path: "/dashboard/student/academic-results" },
  { name: "Đăng ký học phần", icon: <ClipboardList className="h-[18px] w-[18px]" />, path: "/dashboard/student/course-registration" },
];

export const CenterItems: NavItem[] = adminNavItems;
export const LearingItems: NavItem[] = [];
export const navItems: NavItem[] = [];
export const othersItems: NavItem[] = [];