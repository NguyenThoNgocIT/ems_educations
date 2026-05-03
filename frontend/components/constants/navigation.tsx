"use client";
import React from "react";
import { 
  Home, 
  BarChart3, 
  Users, 
  UserCircle, 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  Trophy, 
  Bell, 
  CreditCard, 
  Settings, 
  Sliders, 
  FolderTree, 
  Target, 
  Award, 
  UserCog, 
  DollarSign,
  Zap
} from "lucide-react";

export type NavItem = {
  name: string;
  icon?: React.ReactNode;
  path?: string;
  pro?: boolean;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

// ==================== 1. TRUNG TÂM ====================
export const CenterItems: NavItem[] = [
  {
    icon: <Home className="w-5 h-5" />,
    name: "Thông tin chung",
    subItems: [
      { name: "Tin tức", path: "/admin/News" },
      { name: "Quản lý thông báo", path: "/admin/business-notifications" },
    ],
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    name: "Thống kê",
    subItems: [
      { name: "Doanh thu", path: "/admin/statistical/revenue" },
      { name: "Khách hàng", path: "/admin/statistical/customers" },
      { name: "Học viên", path: "/admin/statistical/students" },
      { name: "Lớp học", path: "/admin/statistical/classes" },
      { name: "Nhân viên", path: "/admin/statistical/employees" },
      { name: "Ngân Hàng đề thi", path: "/admin/statistical/exam-bank" },
    ],
  },
  {
    icon: <Users className="w-5 h-5" />,
    name: "Khách hàng",
    subItems: [
      { name: "Quản lý Leads", path: "/admin/client/leads" },
      { name: "Đăng kí học", path: "/admin/client/course-registrations" },
      { name: "Mã khuyến mãi", path: "/admin/client/promotions" },
      { name: "Combo chương trình", path: "/admin/client/combo-programs" },
    ],
  },
];

// ==================== 2. HỌC TẬP ====================
export const LearingItems: NavItem[] = [
  {
    icon: <GraduationCap className="w-5 h-5" />,
    name: "Lớp học",
    subItems: [
      { name: "Đề xuất mở lớp", path: "/admin/class/class-proposals" },
      { name: "Danh sách lớp học", path: "/admin/class/class-list" },
      { name: "Kiểm tra lịch thi", path: "/admin/class/exam-schedule" },
      { name: "Danh sách phòng Zoom", path: "/admin/class/zoom-rooms" },
      { name: "Lịch Trống giáo viên", path: "/admin/class/teacher-availability" },
      { name: "Kiểm tra Phòng trống", path: "/admin/class/room-availability" },
    ],
  },
  {
    icon: <Users className="w-5 h-5" />,
    name: "Học viên",
    subItems: [
      { name: "Danh sách học viên", path: "/admin/students/students-list" },
      { name: "Học viên trong lớp", path: "/admin/students/students-in-class" },
      { name: "Chuyển Lớp", path: "/admin/students/class-transfer" },
      { name: "Bảo lưu", path: "/admin/students/class-hold" },
      { name: "Kho tài liệu tham khảo", path: "/admin/students/reference-materials" },
      { name: "Ngân Hàng đề thi", path: "/admin/students/exam-bank" },
      { name: "Học viên sắp Học xong", path: "/admin/students/coming-soon-students" },
      { name: "Quản lý hợp đồng", path: "/admin/students/contract-management" },
      { name: "Chờ xếp lớp", path: "/admin/students/waiting-class-assignment" },
    ],
  },
  {
    icon: <UserCircle className="w-5 h-5" />,
    name: "Kết nối phụ huynh",
    subItems: [
      { name: "Danh sách phụ huynh", path: "/admin/connect_parents/parents-list" },
      { name: "Phản hồi", path: "/admin/connect_parents/feedback" },
      { name: "Cảnh báo học viên", path: "/admin/connect_parents/student-warnings" },
    ],
  },
  {
    icon: <Award className="w-5 h-5" />,
    name: "Đề thi",
    pro: true,
    subItems: [
      { name: "Bộ đề", path: "/admin/exam/examSets" },
      { name: "Ngân hàng đề thi", path: "/admin/exam/exam-bank" },
    ],
  },
];

// ==================== 3. QUẢN LÝ (Admin) ====================
export const navItems: NavItem[] = [
  {
    name: "Quản lý nhân viên",
    icon: <UserCog className="w-5 h-5" />,
    subItems: [
      { name: "Danh sách nhân viên", path: "/admin/hr/staff-list" },
      { name: "Duyệt lịch nghỉ", path: "/admin/hr/leave-requests" },
      { name: "Cấu hình lương", path: "/admin/hr/salary-config" },
      { name: "Bảng lương", path: "/admin/hr/payroll" },
      { name: "Bảng lương dự kiến", path: "/admin/hr/projected-payroll" },
    ],
  },
  {
    name: "Quản lý tài chính",
    icon: <DollarSign className="w-5 h-5" />,
    subItems: [
      { name: "Thông tin thanh toán", path: "/admin/finance/payment-info" },
      { name: "Thu chi", path: "/admin/finance/income-expense" },
      { name: "Duyệt thanh toán", path: "/admin/finance/payment-approval" },
      { name: "Hoàn tiền", path: "/admin/finance/refunds" },
      { name: "Hoa hồng", path: "/finance/commissions" },
    ],
  },
  {
    icon: <Bell className="w-5 h-5" />,
    name: "Thông báo nổi",
    subItems: [
      { name: "Danh sách popup", path: "/admin/popups/list", pro: true },
      { name: "Tạo thông báo", path: "/admin/popups/create", pro: true },
    ],
  },
];

// ==================== 4. CẤU HÌNH ====================
export const othersItems: NavItem[] = [
  {
    icon: <Sliders className="w-5 h-5" />,
    name: "Cấu hình học",
    subItems: [
      { name: "Chuyên môn", path: "/admin/config/expertise" },
      { name: "Chương trình học", path: "/admin/config/curriculum" },
      { name: "Ca học", path: "/admin/config/shifts" },
      { name: "Cấu hình Zoom", path: "/admin/config/zoom", pro: true },
      { name: "Bảng điểm mẫu", path: "/admin/config/grade-templates" },
      { name: "Gói học phí", path: "/admin/config/tuition-packages" },
    ],
  },
  {
    icon: <Settings className="w-5 h-5" />,
    name: "Hệ thống",
    subItems: [
      { name: "Trung tâm", path: "/admin/system/centers" },
      { name: "Ngày nghỉ", path: "/admin/system/holidays" },
      { name: "Phương thức thanh toán", path: "/admin/system/payment-methods" },
      { name: "Cấp quyền thanh toán", path: "/admin/system/payment-permissions" },
      { name: "Câu hỏi thường gặp", path: "/admin/system/faqs" },
      { name: "Mẫu hợp đồng", path: "/admin/system/contract-templates" },
      { name: "Kiểm duyệt tài khoản", path: "/admin/system/account-moderation" },
    ],
  },
  {
    icon: <FolderTree className="w-5 h-5" />,
    name: "Danh mục",
    subItems: [
      { name: "Nhu cầu học", path: "/admin/category/learning-needs" },
      { name: "Nguồn khách hàng", path: "/admin/category/customer-sources" },
      { name: "Công việc", path: "/admin/category/jobs" },
      { name: "Trạng thái khách hàng", path: "/admin/category/customer-status" },
      { name: "Cấu hình loại phiếu chi", path: "/admin/category/expense-types" },
      { name: "Cấu hình lý do từ chối học", path: "/admin/category/rejection-reasons" },
      { name: "Mục đích học", path: "/admin/category/learning-purposes" },
      { name: "Từ khoá", path: "/admin/category/keywords" },
    ],
  },
];