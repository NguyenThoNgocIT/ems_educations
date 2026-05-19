"use client";

import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  // Xác định margin cho nội dung chính dựa trên trạng thái Sidebar
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
      ? "lg:ml-[290px]"
      : "lg:ml-[90px]";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      {/* Sidebar bên trái */}
      <AppSidebar />

      {/* Lớp phủ khi mở Sidebar trên mobile */}
      <Backdrop />

      {/* Vùng nội dung chính */}
      <div
        className={`transition-all duration-300 ease-in-out ${mainContentMargin}`}
      >
        {/* Header trên cùng */}
        <AppHeader />

        {/* Nội dung trang - Đã chỉnh lại padding top (pt-4) để khoảng cách ngắn lại gọn gàng */}
        <main className="p-4 md:p-6 pt-4 md:pt-4">
          {children}
        </main>
      </div>
    </div>
  );
}
