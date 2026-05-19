"use client";

import React from "react";
import AppHeader from "@/layout/AppHeader";
import { useSidebar } from "@/context/SidebarContext";
import LecturerSidebar from "@/layout/LecturerSidebar";

export default function LecturerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered } = useSidebar();
  const isOpen = isExpanded || isHovered;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50/50 dark:bg-slate-950">
      {/* Sidebar hệ thống */}
      <LecturerSidebar />

      {/* Vùng nội dung chính bên phải: Tự động co giãn padding-left theo trạng thái Sidebar */}
      <div 
        className={`relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden pt-[80px] transition-all duration-300 ease-in-out
          ${isOpen ? "md:pl-[290px]" : "md:pl-[78px]"} pl-0
        `}
      >
        {/* Header điều hướng */}
        <AppHeader role="lecturer" />

        {/* Ruột Dashboard */}
        <main className="p-4 md:p-6 max-w-[1600px] w-full mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}