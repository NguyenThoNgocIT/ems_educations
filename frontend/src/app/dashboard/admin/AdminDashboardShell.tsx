"use client";

import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import React from "react";

export default function AdminDashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
      ? "lg:ml-[290px]"
      : "lg:ml-[90px]";

  return (
    <div className="min-h-screen bg-muted/30 pt-20 text-foreground">
      <AppSidebar />
      <Backdrop />

      <div className={`transition-all duration-300 ease-in-out ${mainContentMargin}`}>
        <AppHeader />

        <main className="mx-auto w-full max-w-none p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
