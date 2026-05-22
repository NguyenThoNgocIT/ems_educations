"use client";

import React from "react";
import {
  Award,
  BookOpen,
  Building,
  Calendar,
  CalendarDays,
  CheckSquare,
  ClipboardList,
  Clock,
  Database,
  DoorOpen,
  FileText,
  GraduationCap,
  Landmark,
  Layers,
  LayoutDashboard,
  Network,
  ShieldCheck,
  Target,
  User,
  Users,
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

const iconClassName = "h-[18px] w-[18px]";

export const adminNavItems: NavItem[] = [
  { name: "Tổng quan", icon: <LayoutDashboard className={iconClassName} />, path: "/dashboard/admin" },
  { name: "Sinh viên", icon: <Users className={iconClassName} />, path: "/dashboard/admin/students" },
  { name: "Giảng viên", icon: <User className={iconClassName} />, path: "/dashboard/admin/lecturers" },
  { name: "Nhân viên", icon: <Users className={iconClassName} />, path: "/dashboard/admin/staffs", badge: "BE" },
  { name: "Khoa / đơn vị", icon: <Landmark className={iconClassName} />, path: "/dashboard/admin/departments" },
  { name: "Ngành học", icon: <GraduationCap className={iconClassName} />, path: "/dashboard/admin/majors" },
  { name: "Khóa đào tạo", icon: <Network className={iconClassName} />, path: "/dashboard/admin/academic-cohorts" },
  { name: "Chương trình đào tạo", icon: <Target className={iconClassName} />, path: "/dashboard/admin/training-programs" },
  { name: "Năm học", icon: <Calendar className={iconClassName} />, path: "/dashboard/admin/school-years", badge: "BE" },
  { name: "Học kỳ", icon: <CalendarDays className={iconClassName} />, path: "/dashboard/admin/semesters", badge: "BE" },
  { name: "Lớp hành chính", icon: <Users className={iconClassName} />, path: "/dashboard/admin/classes", badge: "BE" },
  { name: "Môn học", icon: <BookOpen className={iconClassName} />, path: "/dashboard/admin/courses" },
  { name: "Lớp học phần", icon: <Layers className={iconClassName} />, path: "/dashboard/admin/course-classes" },
  { name: "Thời khóa biểu", icon: <CalendarDays className={iconClassName} />, path: "/dashboard/admin/schedules" },
  { name: "Tài khoản người dùng", icon: <User className={iconClassName} />, path: "/dashboard/admin/users", badge: "BE" },
  { name: "Phân quyền (RBAC)", icon: <ShieldCheck className={iconClassName} />, path: "/dashboard/admin/rbac" },
];

export const adminNavGroups: NavGroup[] = [
  {
    groupName: "Tổng quan",
    icon: <LayoutDashboard className={iconClassName} />,
    items: [
      { name: "Bảng điều khiển", icon: <LayoutDashboard className={iconClassName} />, path: "/dashboard/admin" },
    ],
  },
  {
    groupName: "Hồ sơ nhân sự",
    icon: <Users className={iconClassName} />,
    items: [
      { name: "Sinh viên", icon: <Users className={iconClassName} />, path: "/dashboard/admin/students" },
      { name: "Giảng viên", icon: <User className={iconClassName} />, path: "/dashboard/admin/lecturers" },
      { name: "Nhân viên", icon: <Users className={iconClassName} />, path: "/dashboard/admin/staffs", badge: "BE" },
      { name: "Phân lớp theo học kỳ", icon: <Layers className={iconClassName} />, path: "/dashboard/admin/student-class-assignments", badge: "NEW" },
    ],
  },
  {
    groupName: "Cơ cấu đào tạo",
    icon: <Landmark className={iconClassName} />,
    items: [
      { name: "Khoa / đơn vị", icon: <Landmark className={iconClassName} />, path: "/dashboard/admin/departments" },
      { name: "Bộ phận chuyên môn", icon: <Building className={iconClassName} />, path: "/dashboard/admin/divisions", badge: "BE" },
      { name: "Chức vụ", icon: <Award className={iconClassName} />, path: "/dashboard/admin/positions", badge: "BE" },
      { name: "Ngành học", icon: <GraduationCap className={iconClassName} />, path: "/dashboard/admin/majors" },
      { name: "Khóa đào tạo", icon: <Network className={iconClassName} />, path: "/dashboard/admin/academic-cohorts" },
      { name: "Chương trình đào tạo", icon: <Target className={iconClassName} />, path: "/dashboard/admin/training-programs" },
      { name: "Chuyên ngành", icon: <Target className={iconClassName} />, path: "/dashboard/admin/specializations", badge: "NEW" },
    ],
  },
  {
    groupName: "Niên khóa & lớp",
    icon: <CalendarDays className={iconClassName} />,
    items: [
      { name: "Năm học", icon: <Calendar className={iconClassName} />, path: "/dashboard/admin/school-years", badge: "BE" },
      { name: "Học kỳ", icon: <CalendarDays className={iconClassName} />, path: "/dashboard/admin/semesters", badge: "BE" },
      { name: "Lớp hành chính", icon: <Users className={iconClassName} />, path: "/dashboard/admin/classes", badge: "BE" },
    ],
  },
  {
    groupName: "Giảng dạy",
    icon: <BookOpen className={iconClassName} />,
    items: [
      { name: "Môn học", icon: <BookOpen className={iconClassName} />, path: "/dashboard/admin/courses" },
      { name: "Môn tiên quyết", icon: <CheckSquare className={iconClassName} />, path: "/dashboard/admin/course-prerequisites", badge: "BE" },
      { name: "Lớp học phần", icon: <Layers className={iconClassName} />, path: "/dashboard/admin/course-classes" },
      { name: "Đăng ký học phần", icon: <ClipboardList className={iconClassName} />, path: "/dashboard/admin/registrations", badge: "DB" },
      { name: "Điểm sinh viên", icon: <FileText className={iconClassName} />, path: "/dashboard/admin/grades", badge: "DB" },
      { name: "Lịch học", icon: <CalendarDays className={iconClassName} />, path: "/dashboard/admin/schedules" },
    ],
  },
  {
    groupName: "Cơ sở vật chất",
    icon: <Building className={iconClassName} />,
    items: [
      { name: "Tòa nhà", icon: <Building className={iconClassName} />, path: "/dashboard/admin/buildings" },
      { name: "Phòng học", icon: <DoorOpen className={iconClassName} />, path: "/dashboard/admin/rooms" },
      { name: "Ca học", icon: <Clock className={iconClassName} />, path: "/dashboard/admin/time-slots" },
    ],
  },
  {
    groupName: "Hành chính",
    icon: <FileText className={iconClassName} />,
    items: [
      { name: "Hợp đồng", icon: <FileText className={iconClassName} />, path: "/dashboard/admin/contracts", badge: "BE" },
      { name: "Bằng cấp", icon: <Award className={iconClassName} />, path: "/dashboard/admin/degrees", badge: "BE" },
    ],
  },
  {
    groupName: "Dữ liệu nền",
    icon: <Database className={iconClassName} />,
    items: [
      { name: "Hồ sơ cá nhân", icon: <User className={iconClassName} />, path: "/dashboard/admin/persons", badge: "BE" },
      { name: "Dữ liệu nhân viên", icon: <Users className={iconClassName} />, path: "/dashboard/admin/employees", badge: "BE" },
    ],
  },
  {
    groupName: "Hệ thống",
    icon: <ShieldCheck className={iconClassName} />,
    items: [
      { name: "Tài khoản người dùng", icon: <User className={iconClassName} />, path: "/dashboard/admin/users", badge: "BE" },
      { name: "Phân quyền (RBAC)", icon: <ShieldCheck className={iconClassName} />, path: "/dashboard/admin/rbac" },
      {
        name: "Reset mật khẩu",
        icon: <ShieldCheck className={iconClassName} />,
        path: "/dashboard/admin/password-reset-requests",
        badge: "BE",
      },
      { name: "Danh mục trạng thái SV", icon: <CheckSquare className={iconClassName} />, path: "/dashboard/admin/student-status-catalog", badge: "NEW" },
    ],
  },
];

export const lecturerNavItems: NavItem[] = [
  { name: "Lịch giảng dạy", icon: <Calendar className={iconClassName} />, path: "/dashboard/lecturer/my-schedule" },
  { name: "Lớp của tôi", icon: <Users className={iconClassName} />, path: "/dashboard/lecturer/my-classes" },
  { name: "Nhập điểm", icon: <FileText className={iconClassName} />, path: "/dashboard/lecturer/enter-grades" },
  { name: "Điểm danh", icon: <CheckSquare className={iconClassName} />, path: "/dashboard/lecturer/attendance" },
  { name: "Thông tin phòng", icon: <DoorOpen className={iconClassName} />, path: "/dashboard/lecturer/room-info" },
];

export const studentNavItems: NavItem[] = [
  { name: "Thời khóa biểu", icon: <Calendar className={iconClassName} />, path: "/dashboard/student/my-schedule" },
  { name: "Kết quả học tập", icon: <Award className={iconClassName} />, path: "/dashboard/student/academic-results" },
];

export const CenterItems: NavItem[] = adminNavItems;
export const LearingItems: NavItem[] = [];
export const navItems: NavItem[] = [];
export const othersItems: NavItem[] = [];
