"use client";

import { SidebarProvider, useSidebar } from "@/components/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import React from "react";

function DashboardLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  // Tính toán khoảng trống (margin) để nội dung không bị Sidebar che mất
  // Cố định 290px khi mở rộng và 90px khi thu nhỏ
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
      ? "lg:ml-[290px]"
      : "lg:ml-[90px]";

  return (
    <div className="min-h-screen bg-slate-50 xl:flex dark:bg-slate-950">
      {/* 1. Sidebar bên tay trái */}
      <AppSidebar role="consultant" />

      {/* 2. Lớp phủ khi mở Sidebar trên điện thoại */}
      <Backdrop />

      {/* 3. Vùng nội dung chính bên tay phải */}
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}
      >
        {/* Thanh Header nằm trên cùng */}
        <AppHeader role="consultant" />

        {/* Nội dung chi tiết của từng trang (page.tsx) */}
        <main className="mx-auto max-w-screen-2xl p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </SidebarProvider>
  );
}
