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
  new?: boolean;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

// 1. Mục Trung tâm học tập (Cả Admin và Teacher đều thấy)
export const CenterItems: NavItem[] = [
  {
    icon: <PageIcon />,
    name: "Thông tin chung",
    subItems: [
      {
        name: "Tin tức",
        path: "/dashboard/branch-management/News",
        pro: false,
      },
      {
        name: "Quản lý thông báo",
        path: "/dashboard/branch-management/business-notifications",
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
        path: "/dashboard/branch-management/statistical/revenue",
        pro: false,
      },
      {
        name: "Khách hàng",
        path: "/dashboard/branch-management/statistical/customers",
        pro: false,
      },
      {
        name: "Học viên",
        path: "/dashboard/branch-management/statistical/students",
        pro: false,
      },
      {
        name: "Lớp học",
        path: "/dashboard/branch-management/statistical/classes",
        pro: false,
      },
      {
        name: "Nhân viên",
        path: "/dashboard/branch-management/statistical/employees",
        pro: false,
      },
      {
        name: "Ngân Hàng đề thi",
        path: "/dashboard/branch-management/statistical/exam-bank",
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
        path: "/dashboard/branch-management/client/leads",
        pro: false,
      },
      {
        name: "Đăng kí học",
        path: "/dashboard/branch-management/client/course-registrations",
        pro: false,
      },
      {
        name: "Mã khuyến mãi",
        path: "/dashboard/branch-management/client/promotions",
        pro: false,
      },
      {
        name: "Combo chương trình",
        path: "/dashboard/branch-management/client/combo-programs",
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
        path: "/dashboard/branch-management/class/class-proposals",
        pro: false,
      },
      {
        name: "Danh sách lớp học",
        path: "/dashboard/branch-management/class/class-list",
        pro: false,
      },
      {
        name: "Kiểm tra lịch thi",
        path: "/dashboard/branch-management/class/exam-schedule",
        pro: false,
      },
      {
        name: "Danh sách phòng Zoom",
        path: "/dashboard/branch-management/class/zoom-rooms",
        pro: false,
      },
      {
        name: "Lịch Trống giáo viên",
        path: "/dashboard/branch-management/class/teacher-availability",
        pro: false,
      },
      {
        name: "Kiểm tra Phòng trống",
        path: "/dashboard/branch-management/class/room-availability",
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
        path: "/dashboard/branch-management/students/students-list",
        pro: false,
      },
      {
        name: "Học viên trong lớp",
        path: "/dashboard/branch-management/students/students-in-class",
        pro: false,
      },
      {
        name: "Chuyển Lớp",
        path: "/dashboard/branch-management/students/class-transfer",
        pro: false,
      },
      {
        name: "Bảo lưu",
        path: "/dashboard/branch-management/students/class-hold",
        pro: false,
      },
      {
        name: "kho tài liệu tham khảo",
        path: "/dashboard/branch-management/students/reference-materials",
        pro: false,
      },
      {
        name: "Ngân Hàng đề thi",
        path: "/dashboard/branch-management/students/exam-bank",
        pro: false,
      },
      {
        name: "Học viên sắp Học xong",
        path: "/dashboard/branch-management/students/coming-soon-students",
        pro: false,
      },
      {
        name: "Quản lý hợp đồng",
        path: "/dashboard/branch-management/students/contract-management",
        pro: false,
      },
      {
        name: "Chờ xếp lớp",
        path: "/dashboard/branch-management/students/waiting-class-assignment",
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
        path: "/dashboard/branch-management/connect_parents/parents-list",
        pro: false,
      },
      {
        name: "Phản hồi",
        path: "/dashboard/branch-management/connect_parents/feedback",
        pro: false,
      },
      {
        name: "Cảnh báo học viên",
        path: "/dashboard/branch-management/connect_parents/student-warnings",
        pro: false,
      },
    ],
  },
  {
    icon: <GridIcon />,
    name: "Đề thi",
    subItems: [
      {
        name: "Bộ đề",
        path: "/dashboard/branch-management/exam/examSets",
        pro: false,
      },
      {
        name: "Ngân hàng đề thi",
        path: "/dashboard/branch-management/exam/exam-bank",
        pro: false,
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
      {
        name: "Danh sách nhân viên",
        path: "/dashboard/branch-management/hr/staff-list",
      },
      {
        name: "Duyệt lịch nghỉ",
        path: "/dashboard/branch-management/hr/leave-requests",
      },
      {
        name: "Cấu hình lương",
        path: "/dashboard/branch-management/hr/salary-config",
      },
      { name: "Bảng lương", path: "/dashboard/branch-management/hr/payroll" },
      {
        name: "Bảng lương dự kiến",
        path: "/dashboard/branch-management/hr/projected-payroll",
      },
    ],
  },
  {
    name: "Quản lý tài chính",
    icon: <TableIcon />,
    subItems: [
      {
        name: "Thông tin thanh toán",
        path: "/dashboard/branch-management/finance/payment-info",
      },
      {
        name: "Thu chi",
        path: "/dashboard/branch-management/finance/income-expense",
      },
      {
        name: "Duyệt thanh toán",
        path: "/dashboard/branch-management/finance/payment-approval",
      },
      {
        name: "Hoàn tiền",
        path: "/dashboard/branch-management/finance/refunds",
      },
      {
        name: "Hoa hồng",
        path: "/dashboard/branch-management/finance/commissions",
      },
    ],
  },
  {
    icon: <PlugInIcon />,
    name: "Thông báo nổi",
    subItems: [
      {
        name: "Danh sách popup",
        path: "/dashboard/branch-management/popups/list",
        pro: true,
      },
      {
        name: "Tạo thông báo",
        path: "/dashboard/branch-management/popups/create",
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
      {
        name: "Chuyên môn",
        path: "/dashboard/branch-management/config/expertise",
      },
      {
        name: "Chương trình học",
        path: "/dashboard/branch-management/config/curriculum",
      },
      { name: "Ca học", path: "/dashboard/branch-management/config/shifts" },
      {
        name: "Cấu hình Zoom",
        path: "/dashboard/branch-management/config/zoom",
        pro: true,
      },
      {
        name: "Bảng điểm mẫu",
        path: "/dashboard/branch-management/config/grade-templates",
      },
      {
        name: "Gói học phí",
        path: "/dashboard/branch-management/config/tuition-packages",
      },
    ],
  },
  {
    icon: <SettingsIcon />,
    name: "Hệ thống",
    subItems: [
      {
        name: "Trung tâm",
        path: "/dashboard/branch-management/system/centers",
      },
      {
        name: "Ngày nghỉ",
        path: "/dashboard/branch-management/system/holidays",
      },
      {
        name: "Phương thức thanh toán",
        path: "/dashboard/branch-management/system/payment-methods",
      },
      {
        name: "Cấp quyền thanh toán",
        path: "/dashboard/branch-management/system/payment-permissions",
      },
      {
        name: "Câu hỏi thường gặp",
        path: "/dashboard/branch-management/system/faqs",
      },
      {
        name: "Mẫu hợp đồng",
        path: "/dashboard/branch-management/system/contract-templates",
      },
      {
        name: "Kiểm duyệt tài khoản",
        path: "/dashboard/branch-management/system/account-moderation",
      },
    ],
  },
  {
    icon: <FolderIcon />,
    name: "Danh mục",
    subItems: [
      {
        name: "Nhu cầu học",
        path: "/dashboard/branch-management/category/learning-needs",
      },
      {
        name: "Nguồn khách hàng",
        path: "/dashboard/branch-management/category/customer-sources",
      },
      { name: "Công việc", path: "/dashboard/branch-management/category/jobs" },
      {
        name: "Trạng thái khách hàng",
        path: "/dashboard/branch-management/category/customer-status",
      },
      {
        name: "Cấu hình loại phiếu chi",
        path: "/dashboard/branch-management/category/expense-types",
      },
      {
        name: "Cấu hình lý do từ chối học",
        path: "/dashboard/branch-management/category/rejection-reasons",
      },
      {
        name: "Mục đích học",
        path: "/dashboard/branch-management/category/learning-purposes",
      },
      {
        name: "Từ khoá",
        path: "/dashboard/branch-management/category/keywords",
      },
    ],
  },
];
