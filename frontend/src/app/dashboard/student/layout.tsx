import StudentNavbar from "@/layout/StudentNavbar";
import React from "react";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Navbar nằm ở trên cùng thay cho Sidebar */}
      <StudentNavbar />

      {/* Vùng nội dung chính tràn màn hình, không bị Sidebar che mất */}
      <main className="mx-auto max-w-screen-2xl p-4 md:p-8">{children}</main>
    </div>
  );
}
