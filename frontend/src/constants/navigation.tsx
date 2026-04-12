"use client";
import React from "react";
import {
  GridIcon,
  PageIcon,
  TableIcon,
  UserCircleIcon,
  PlugInIcon,
} from "../icons/index";
import { FolderIcon, SettingsIcon, SlidersIcon } from "lucide-react";

export type NavItem = {
  name: string;
  icon?: React.ReactNode;
  path?: string;
  pro?: boolean;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

// 1. Mục Trung tâm học tập (Cả Admin và Teacher đều thấy)
export const CenterItems: NavItem[] = [
  {
    icon: <PageIcon />,
    name: "Thông tin chung",
    subItems: [
      { name: "Tin tức", path: "/dashboard/admin/News", pro: false },
      {
        name: "Quản lý thông báo",
        path: "/dashboard/admin/business-notifications",
        pro: false,
      },
    ],
  },
  {
    icon: <GridIcon />,
    name: "Thống kê",
    subItems: [
      {
        name: "Doanh thu",
        path: "/dashboard/admin/statistical/revenue",
        pro: false,
      },
      {
        name: "Khách hàng",
        path: "/dashboard/admin/statistical/customers",
        pro: false,
      },
      {
        name: "Học viên",
        path: "/dashboard/admin/statistical/students",
        pro: false,
      },
      {
        name: "Lớp học",
        path: "/dashboard/admin/statistical/classes",
        pro: false,
      },
      {
        name: "Nhân viên",
        path: "/dashboard/admin/statistical/employees",
        pro: false,
      },
      {
        name: "Ngân Hàng đề thi",
        path: "/dashboard/admin/statistical/exam-bank",
        pro: false,
      },
    ],
  },
  {
    icon: <GridIcon />,
    name: "Khách hàng",
    subItems: [
      {
        name: "Quản lý Leads",
        path: "/dashboard/admin/client/leads",
        pro: false,
      },
      {
        name: "Đăng kí học",
        path: "/dashboard/admin/client/course-registrations",
        pro: false,
      },
      {
        name: "Mã khuyến mãi",
        path: "/dashboard/admin/client/promotions",
        pro: false,
      },
      {
        name: "Combo chương trình",
        path: "/dashboard/admin/client/combo-programs",
        pro: false,
      },
    ],
  },
];

// 2. Mục Học tập (Cả Admin và Teacher đều thấy)
export const LearingItems: NavItem[] = [
  {
    icon: <PageIcon />,
    name: "Lớp học",
    subItems: [
      {
        name: "Đề xuất mở lớp",
        path: "/dashboard/admin/class/class-proposals",
        pro: false,
      },
      {
        name: "Danh sách lớp học",
        path: "/dashboard/admin/class/class-list",
        pro: false,
      },
      {
        name: "Kiểm tra lịch thi",
        path: "/dashboard/admin/class/exam-schedule",
        pro: false,
      },
      {
        name: "Danh sách phòng Zoom",
        path: "/dashboard/admin/class/zoom-rooms",
        pro: false,
      },
      {
        name: "Lịch Trống giáo viên",
        path: "/dashboard/admin/class/teacher-availability",
        pro: false,
      },
      {
        name: "Kiểm tra Phòng trống",
        path: "/dashboard/admin/class/room-availability",
        pro: false,
      },
    ],
  },
  {
    icon: <GridIcon />,
    name: "Học viên",
    subItems: [
      {
        name: "Danh sách học viên",
        path: "/dashboard/admin/students/students-list",
        pro: false,
      },
      {
        name: "Học viên trong lớp",
        path: "/dashboard/admin/students/students-in-class",
        pro: false,
      },
      {
        name: "Chuyển Lớp",
        path: "/dashboard/admin/students/class-transfer",
        pro: false,
      },
      {
        name: "Bảo lưu",
        path: "/dashboard/admin/students/class-hold",
        pro: false,
      },
      {
        name: "kho tài liệu tham khảo",
        path: "/dashboard/admin/students/reference-materials",
        pro: false,
      },
      {
        name: "Ngân Hàng đề thi",
        path: "/dashboard/admin/students/exam-bank",
        pro: false,
      },
      {
        name: "Học viên sắp Học xong",
        path: "/dashboard/admin/students/coming-soon-students",
        pro: false,
      },
      {
        name: "Quản lý hợp đồng",
        path: "/dashboard/admin/students/contract-management",
        pro: false,
      },
      {
        name: "Chờ xếp lớp",
        path: "/dashboard/admin/students/waiting-class-assignment",
        pro: false,
      },
    ],
  },
  {
    icon: <GridIcon />,
    name: "Kết nối phụ huynh",
    subItems: [
      {
        name: "Danh sách phụ huynh",
        path: "/dashboard/admin/connect_parents/parents-list",
        pro: false,
      },
      {
        name: "Phản hồi",
        path: "/dashboard/admin/connect_parents/feedback",
        pro: false,
      },
      {
        name: "Cảnh báo học viên",
        path: "/dashboard/admin/connect_parents/student-warnings",
        pro: false,
      },
    ],
  },
  {
    icon: <GridIcon />,
    name: "Đề thi",
    pro: true,
    subItems: [
      { name: "Bộ đề", path: "/dashboard/admin/exam/examSets", pro: true },
      {
        name: "Ngân hàng đề thi",
        path: "/dashboard/admin/exam/exam-bank",
        pro: true,
      },
    ],
  },
];

// 3. Mục Quản lý (Chỉ Admin thấy)
export const navItems: NavItem[] = [
  {
    name: "Quản lý nhân viên",
    icon: <UserCircleIcon />,
    subItems: [
      { name: "Danh sách nhân viên", path: "/dashboard/admin/hr/staff-list" },
      { name: "Duyệt lịch nghỉ", path: "/dashboard/admin/hr/leave-requests" },
      { name: "Cấu hình lương", path: "/dashboard/admin/hr/salary-config" },
      { name: "Bảng lương", path: "/dashboard/admin/hr/payroll" },
      {
        name: "Bảng lương dự kiến",
        path: "/dashboard/admin/hr/projected-payroll",
      },
    ],
  },
  {
    name: "Quản lý tài chính",
    icon: <TableIcon />,
    subItems: [
      {
        name: "Thông tin thanh toán",
        path: "/dashboard/admin/finance/payment-info",
      },
      { name: "Thu chi", path: "/dashboard/admin/finance/income-expense" },
      {
        name: "Duyệt thanh toán",
        path: "/dashboard/admin/finance/payment-approval",
      },
      { name: "Hoàn tiền", path: "/dashboard/admin/finance/refunds" },
      { name: "Hoa hồng", path: "/dashboard/admin/finance/commissions" },
    ],
  },
  {
    icon: <PlugInIcon />,
    name: "Thông báo nổi",
    subItems: [
      {
        name: "Danh sách popup",
        path: "/dashboard/admin/popups/list",
        pro: true,
      },
      {
        name: "Tạo thông báo",
        path: "/dashboard/admin/popups/create",
        pro: true,
      },
    ],
  },
];

// 4. Mục Cấu hình (Chỉ Admin thấy)
export const othersItems: NavItem[] = [
  {
    icon: <SlidersIcon />,
    name: "Cấu hình học",
    subItems: [
      { name: "Chuyên môn", path: "/dashboard/admin/config/expertise" },
      { name: "Chương trình học", path: "/dashboard/admin/config/curriculum" },
      { name: "Ca học", path: "/dashboard/admin/config/shifts" },
      {
        name: "Cấu hình Zoom",
        path: "/dashboard/admin/config/zoom",
        pro: true,
      },
      {
        name: "Bảng điểm mẫu",
        path: "/dashboard/admin/config/grade-templates",
      },
      { name: "Gói học phí", path: "/dashboard/admin/config/tuition-packages" },
    ],
  },
  {
    icon: <SettingsIcon />,
    name: "Hệ thống",
    subItems: [
      { name: "Trung tâm", path: "/dashboard/admin/system/centers" },
      { name: "Ngày nghỉ", path: "/dashboard/admin/system/holidays" },
      {
        name: "Phương thức thanh toán",
        path: "/dashboard/admin/system/payment-methods",
      },
      {
        name: "Cấp quyền thanh toán",
        path: "/dashboard/admin/system/payment-permissions",
      },
      { name: "Câu hỏi thường gặp", path: "/dashboard/admin/system/faqs" },
      {
        name: "Mẫu hợp đồng",
        path: "/dashboard/admin/system/contract-templates",
      },
      {
        name: "Kiểm duyệt tài khoản",
        path: "/dashboard/admin/system/account-moderation",
      },
    ],
  },
  {
    icon: <FolderIcon />,
    name: "Danh mục",
    subItems: [
      { name: "Nhu cầu học", path: "/dashboard/admin/category/learning-needs" },
      {
        name: "Nguồn khách hàng",
        path: "/dashboard/admin/category/customer-sources",
      },
      { name: "Công việc", path: "/dashboard/admin/category/jobs" },
      {
        name: "Trạng thái khách hàng",
        path: "/dashboard/admin/category/customer-status",
      },
      {
        name: "Cấu hình loại phiếu chi",
        path: "/dashboard/admin/category/expense-types",
      },
      {
        name: "Cấu hình lý do từ chối học",
        path: "/dashboard/admin/category/rejection-reasons",
      },
      {
        name: "Mục đích học",
        path: "/dashboard/admin/category/learning-purposes",
      },
      { name: "Từ khoá", path: "/dashboard/admin/category/keywords" },
    ],
  },
];
