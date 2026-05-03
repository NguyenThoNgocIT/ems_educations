"use client";
import React from "react";
import { 
  Grid, 
  FileText, 
  Table, 
  UserCircle, 
  Plug, 
  Folder, 
  Settings, 
  Sliders 
} from "lucide-react";

export type NavItem = {
  name: string;
  icon?: React.ReactNode;
  path?: string;
  pro?: boolean;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

// 1. Mục Trung tâm học tập
export const CenterItems: NavItem[] = [
  {
    icon: <FileText />,
    name: "Thông tin chung",
    subItems: [
      { name: "Tin tức", path: "/News" },
      { name: "Quản lý thông báo", path: "/business-notifications" },
    ],
  },
  {
    icon: <Grid />,
    name: "Thống kê",
    subItems: [
      { name: "Doanh thu", path: "/statistical/revenue" },
      { name: "Khách hàng", path: "/statistical/customers" },
      { name: "Học viên", path: "/statistical/students" },
      { name: "Lớp học", path: "/statistical/classes" },
      { name: "Nhân viên", path: "/statistical/employees" },
      { name: "Ngân Hàng đề thi", path: "/statistical/exam-bank" },
    ],
  },
  {
    icon: <Grid />,
    name: "Khách hàng",
    subItems: [
      { name: "Quản lý Leads", path: "/client/leads" },
      { name: "Đăng kí học", path: "/client/course-registrations" },
      { name: "Mã khuyến mãi", path: "/client/promotions" },
      { name: "Combo chương trình", path: "/client/combo-programs" },
    ],
  },
];

// 2. Mục Học tập
export const LearingItems: NavItem[] = [
  {
    icon: <FileText />,
    name: "Lớp học",
    subItems: [
      { name: "Đề xuất mở lớp", path: "/class/class-proposals" },
      { name: "Danh sách lớp học", path: "/class/class-list" },
      { name: "Kiểm tra lịch thi", path: "/class/exam-schedule" },
      { name: "Danh sách phòng Zoom", path: "/class/zoom-rooms" },
      { name: "Lịch Trống giáo viên", path: "/class/teacher-availability" },
      { name: "Kiểm tra Phòng trống", path: "/class/room-availability" },
    ],
  },
  {
    icon: <Grid />,
    name: "Học viên",
    subItems: [
      { name: "Danh sách học viên", path: "/students/students-list" },
      { name: "Học viên trong lớp", path: "/students/students-in-class" },
      { name: "Chuyển Lớp", path: "/students/class-transfer" },
      { name: "Bảo lưu", path: "/students/class-hold" },
      { name: "Kho tài liệu tham khảo", path: "/students/reference-materials" },
      { name: "Ngân Hàng đề thi", path: "/students/exam-bank" },
      { name: "Học viên sắp Học xong", path: "/students/coming-soon-students" },
      { name: "Quản lý hợp đồng", path: "/students/contract-management" },
      { name: "Chờ xếp lớp", path: "/students/waiting-class-assignment" },
    ],
  },
  {
    icon: <Grid />,
    name: "Kết nối phụ huynh",
    subItems: [
      { name: "Danh sách phụ huynh", path: "/connect_parents/parents-list" },
      { name: "Phản hồi", path: "/connect_parents/feedback" },
      { name: "Cảnh báo học viên", path: "/connect_parents/student-warnings" },
    ],
  },
  {
    icon: <Grid />,
    name: "Đề thi",
    pro: true,
    subItems: [
      { name: "Bộ đề", path: "/exam/examSets" },
      { name: "Ngân hàng đề thi", path: "/exam/exam-bank" },
    ],
  },
];

// 3. Mục Quản lý (Chỉ Admin)
export const navItems: NavItem[] = [
  {
    name: "Quản lý nhân viên",
    icon: <UserCircle />,
    subItems: [
      { name: "Danh sách nhân viên", path: "/hr/staff-list" },
      { name: "Duyệt lịch nghỉ", path: "/hr/leave-requests" },
      { name: "Cấu hình lương", path: "/hr/salary-config" },
      { name: "Bảng lương", path: "/hr/payroll" },
      { name: "Bảng lương dự kiến", path: "/hr/projected-payroll" },
    ],
  },
  {
    name: "Quản lý tài chính",
    icon: <Table />,
    subItems: [
      { name: "Thông tin thanh toán", path: "/finance/payment-info" },
      { name: "Thu chi", path: "/finance/income-expense" },
      { name: "Duyệt thanh toán", path: "/finance/payment-approval" },
      { name: "Hoàn tiền", path: "/finance/refunds" },
      { name: "Hoa hồng", path: "/finance/commissions" },
    ],
  },
  {
    icon: <Plug />,
    name: "Thông báo nổi",
    subItems: [
      { name: "Danh sách popup", path: "/popups/list", pro: true },
      { name: "Tạo thông báo", path: "/popups/create", pro: true },
    ],
  },
];

// 4. Mục Cấu hình (Chỉ Admin)
export const othersItems: NavItem[] = [
  {
    icon: <Sliders />,
    name: "Cấu hình học",
    subItems: [
      { name: "Chuyên môn", path: "/config/expertise" },
      { name: "Chương trình học", path: "/config/curriculum" },
      { name: "Ca học", path: "/config/shifts" },
      { name: "Cấu hình Zoom", path: "/config/zoom", pro: true },
      { name: "Bảng điểm mẫu", path: "/config/grade-templates" },
      { name: "Gói học phí", path: "/config/tuition-packages" },
    ],
  },
  {
    icon: <Settings />,
    name: "Hệ thống",
    subItems: [
      { name: "Trung tâm", path: "/system/centers" },
      { name: "Ngày nghỉ", path: "/system/holidays" },
      { name: "Phương thức thanh toán", path: "/system/payment-methods" },
      { name: "Cấp quyền thanh toán", path: "/system/payment-permissions" },
      { name: "Câu hỏi thường gặp", path: "/system/faqs" },
      { name: "Mẫu hợp đồng", path: "/system/contract-templates" },
      { name: "Kiểm duyệt tài khoản", path: "/system/account-moderation" },
    ],
  },
  {
    icon: <Folder />,
    name: "Danh mục",
    subItems: [
      { name: "Nhu cầu học", path: "/category/learning-needs" },
      { name: "Nguồn khách hàng", path: "/category/customer-sources" },
      { name: "Công việc", path: "/category/jobs" },
      { name: "Trạng thái khách hàng", path: "/category/customer-status" },
      { name: "Cấu hình loại phiếu chi", path: "/category/expense-types" },
      { name: "Cấu hình lý do từ chối học", path: "/category/rejection-reasons" },
      { name: "Mục đích học", path: "/category/learning-purposes" },
      { name: "Từ khoá", path: "/category/keywords" },
    ],
  },
];