"use client";
import React from "react";
import {
  Newspaper,
  MessageSquare,
  Calendar,
  BookOpen,
  ClipboardCheck,
  AlertCircle,
  Library,
  HelpCircle,
} from "lucide-react";

export type NavItem = {
  name: string;
  icon?: React.ReactNode;
  path?: string;
  pro?: boolean;
  new?: boolean;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

// 1. KHỐI THÔNG TIN CHUNG
export const PARENT_INFO_ITEMS: NavItem[] = [
  {
    icon: <Newspaper size={20} />,
    name: "Tin tức",
    path: "/News",
  },
  {
    icon: <MessageSquare size={20} />,
    name: "Phản hồi",
    subItems: [
      { name: "Chi tiết", path: "/feedback/detail" },
    ],
  },
];

// 2. KHỐI HỌC TẬP
export const PARENT_STUDY_ITEMS: NavItem[] = [
  {
    icon: <Calendar size={20} />,
    name: "Lịch học",
    path: "/schedule",
  },
  {
    icon: <BookOpen size={20} />,
    name: "Danh sách lớp học",
    subItems: [{ name: "Chi tiết", path: "/classes/detail" }],
  },
  {
    icon: <ClipboardCheck size={20} />,
    name: "Thông tin hẹn test",
    path: "/test-appointments",
  },
  {
    icon: <AlertCircle size={20} />,
    name: "Thông tin cảnh báo",
    path: "/warnings",
  },
  {
    icon: <Library size={20} />,
    name: "Kho tài liệu tham khảo",
    path: "/documents",
  },
  {
    icon: <HelpCircle size={20} />,
    name: "Câu hỏi thường gặp",
    path: "/faqs",
  },
];