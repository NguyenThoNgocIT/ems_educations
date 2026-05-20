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
  Landmark,
  Network,
  Database,
} from "lucide-react";

export type NavItem = {
  name: string;
  icon: React.ReactNode;
  path: string;
  badge?: string;
};

export type NavGroup = {
  groupName: string;
  icon: React.ReactNode;
  items: NavItem[];
};

// ==================== ADMIN MENU FLAT LIST (Để tương thích ngược nếu cần) ====================
export const adminNavItems: NavItem[] = [
  { name: "Tổng quan", icon: <LayoutDashboard className="h-[18px] w-[18px]" />, path: "/dashboard/admin" },
  { name: "Sinh viên", icon: <Users className="h-[18px] w-[18px]" />, path: "/dashboard/admin/students" },
  { name: "Giảng viên", icon: <User className="h-[18px] w-[18px]" />, path: "/dashboard/admin/lecturers" },
  { name: "Khoa / đơn vị", icon: <Landmark className="h-[18px] w-[18px]" />, path: "/dashboard/admin/departments" },
  { name: "Ngành học", icon: <GraduationCap className="h-[18px] w-[18px]" />, path: "/dashboard/admin/majors" },
  { name: "Khóa đào tạo", icon: <Network className="h-[18px] w-[18px]" />, path: "/dashboard/admin/academic-cohorts" },
  { name: "Chương trình đào tạo", icon: <Target className="h-[18px] w-[18px]" />, path: "/dashboard/admin/training-programs" },
  { name: "Môn học", icon: <BookOpen className="h-[18px] w-[18px]" />, path: "/dashboard/admin/courses" },
  { name: "Lớp học phần", icon: <Layers className="h-[18px] w-[18px]" />, path: "/dashboard/admin/course-classes" },
  { name: "Tòa nhà", icon: <Building className="h-[18px] w-[18px]" />, path: "/dashboard/admin/buildings" },
  { name: "Phòng học", icon: <DoorOpen className="h-[18px] w-[18px]" />, path: "/dashboard/admin/rooms" },
  { name: "Ca học", icon: <Clock className="h-[18px] w-[18px]" />, path: "/dashboard/admin/time-slots" },
  { name: "Thời khóa biểu", icon: <CalendarDays className="h-[18px] w-[18px]" />, path: "/dashboard/admin/schedules" },
];

// ==================== ADMIN MENU GROUPED ====================
export const adminNavGroups: NavGroup[] = [
  {
    groupName: "Tổng quan",
    icon: <LayoutDashboard className="h-[18px] w-[18px]" />,
    items: [
      { name: "Bảng điều khiển", icon: <LayoutDashboard className="h-[18px] w-[18px]" />, path: "/dashboard/admin" },
    ],
  },
  {
    groupName: "Hồ sơ nhân sự",
    icon: <Users className="h-[18px] w-[18px]" />,
    items: [
      { name: "Sinh viên", icon: <Users className="h-[18px] w-[18px]" />, path: "/dashboard/admin/students" },
      { name: "Giảng viên", icon: <User className="h-[18px] w-[18px]" />, path: "/dashboard/admin/lecturers" },
      { name: "Nhân viên", icon: <Users className="h-[18px] w-[18px]" />, path: "/dashboard/admin/staffs", badge: "BE" },
    ],
  },
  {
    groupName: "Cơ cấu đào tạo",
    icon: <Landmark className="h-[18px] w-[18px]" />,
    items: [
      { name: "Khoa / đơn vị", icon: <Landmark className="h-[18px] w-[18px]" />, path: "/dashboard/admin/departments" },
      { name: "Bộ phận chuyên môn", icon: <Building className="h-[18px] w-[18px]" />, path: "/dashboard/admin/divisions", badge: "BE" },
      { name: "Chức vụ", icon: <Award className="h-[18px] w-[18px]" />, path: "/dashboard/admin/positions", badge: "BE" },
      { name: "Ngành học", icon: <GraduationCap className="h-[18px] w-[18px]" />, path: "/dashboard/admin/majors" },
      { name: "Khóa đào tạo", icon: <Network className="h-[18px] w-[18px]" />, path: "/dashboard/admin/academic-cohorts" },
      { name: "Chương trình đào tạo", icon: <Target className="h-[18px] w-[18px]" />, path: "/dashboard/admin/training-programs" },
    ],
  },
  {
    groupName: "Niên khóa & lớp",
    icon: <CalendarDays className="h-[18px] w-[18px]" />,
    items: [
      { name: "Năm học", icon: <Calendar className="h-[18px] w-[18px]" />, path: "/dashboard/admin/school-years", badge: "BE" },
      { name: "Học kỳ", icon: <CalendarDays className="h-[18px] w-[18px]" />, path: "/dashboard/admin/semesters", badge: "BE" },
      { name: "Lớp hành chính", icon: <Users className="h-[18px] w-[18px]" />, path: "/dashboard/admin/classes", badge: "BE" },
    ],
  },
  {
    groupName: "Giảng dạy",
    icon: <BookOpen className="h-[18px] w-[18px]" />,
    items: [
      { name: "Môn học", icon: <BookOpen className="h-[18px] w-[18px]" />, path: "/dashboard/admin/courses" },
      { name: "Môn tiên quyết", icon: <CheckSquare className="h-[18px] w-[18px]" />, path: "/dashboard/admin/course-prerequisites", badge: "BE" },
      { name: "Lớp học phần", icon: <Layers className="h-[18px] w-[18px]" />, path: "/dashboard/admin/course-classes" },
      { name: "Đăng ký học phần", icon: <ClipboardList className="h-[18px] w-[18px]" />, path: "/dashboard/admin/registrations", badge: "DB" },
      { name: "Điểm sinh viên", icon: <FileText className="h-[18px] w-[18px]" />, path: "/dashboard/admin/grades", badge: "DB" },
      { name: "Lịch học", icon: <CalendarDays className="h-[18px] w-[18px]" />, path: "/dashboard/admin/schedules" },
    ],
  },
  {
    groupName: "Cơ sở vật chất",
    icon: <Building className="h-[18px] w-[18px]" />,
    items: [
      { name: "Tòa nhà", icon: <Building className="h-[18px] w-[18px]" />, path: "/dashboard/admin/buildings" },
      { name: "Phòng học", icon: <DoorOpen className="h-[18px] w-[18px]" />, path: "/dashboard/admin/rooms" },
      { name: "Ca học", icon: <Clock className="h-[18px] w-[18px]" />, path: "/dashboard/admin/time-slots" },
    ],
  },
  {
    groupName: "Hành chính",
    icon: <FileText className="h-[18px] w-[18px]" />,
    items: [
      { name: "Hợp đồng", icon: <FileText className="h-[18px] w-[18px]" />, path: "/dashboard/admin/contracts", badge: "BE" },
      { name: "Bằng cấp", icon: <Award className="h-[18px] w-[18px]" />, path: "/dashboard/admin/degrees", badge: "BE" },
    ],
  },
  {
    groupName: "Dữ liệu nền",
    icon: <Database className="h-[18px] w-[18px]" />,
    items: [
      { name: "Hồ sơ cá nhân", icon: <User className="h-[18px] w-[18px]" />, path: "/dashboard/admin/persons", badge: "BE" },
      { name: "Dữ liệu nhân viên", icon: <Users className="h-[18px] w-[18px]" />, path: "/dashboard/admin/employees", badge: "BE" },
    ],
  },
  {
    groupName: "Hệ thống",
    icon: <ShieldCheck className="h-[18px] w-[18px]" />,
    items: [
      { name: "Tài khoản người dùng", icon: <User className="h-[18px] w-[18px]" />, path: "/dashboard/admin/users", badge: "BE" },
      { name: "Phân quyền (RBAC)", icon: <ShieldCheck className="h-[18px] w-[18px]" />, path: "/dashboard/admin/rbac" },
      { name: "Reset mật khẩu", icon: <ShieldCheck className="h-[18px] w-[18px]" />, path: "/dashboard/admin/password-reset-requests", badge: "BE" },
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
