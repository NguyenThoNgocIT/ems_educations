"use client";

import { useSidebar } from "@/context/SidebarContext";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { adminNavGroups } from "@/constants/navigation";

export default function AppSidebar() {
  const pathname = usePathname();
  const { isExpanded, isHovered, isMobileOpen } = useSidebar(); 
  const isOpen = isExpanded || isHovered;

  return (
    <aside 
      className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-100 flex flex-col z-50 shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-all duration-300 ease-in-out dark:bg-slate-900 dark:border-slate-800 
        ${isOpen ? "w-[290px]" : "w-[78px]"} 
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
    >
      {/* 💥 ĐỒNG BỘ CHIỀU CAO VỀ h-[70px] ĐỂ ĐƯỜNG GẠCH NGANG BẰNG NHAU VỚI HEADER */}
      <div className="h-[80px] border-b border-gray-100 flex items-center justify-center px-4 overflow-hidden dark:border-slate-800 flex-shrink-0">
        {/* Link trỏ về trang chủ hệ thống, an toàn không lo đăng xuất */}
        <Link href="/dashboard/admin" className="relative flex items-center justify-center w-full h-full">
          {isOpen ? (
            /* Khi Sidebar MỞ TO -> Tỉ lệ h-[48px] phù hợp hoàn hảo với khối cha h-[70px] */
            <div className="relative w-[310px] h-[88px] transition-all duration-300 flex items-center justify-center">
              <Image
                src="/images/logo/logo-sidebar-admin-big.png"
                alt="Đại Học Đông Á"
                fill
                priority
                sizes="310px"
                className="object-contain"
              />
            </div>
          ) : (
            /* Khi Sidebar THU NHỎ -> Giữ nguyên icon nhỏ gọn gàng ở giữa */
            <div className="relative w-9 h-9 transition-all duration-300">
              <Image
                src="/images/logo/logo-sidebar-admin-small.png"
                alt="UDA"
                fill
                priority
                sizes="36px"
                className="object-contain"
              />
            </div>
          )}
        </Link>
      </div>

      {/* DANH SÁCH MENU - GIỮ NGUYÊN CĂN TRÁI CHUẨN UI KHI MỞ TO */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4 custom-scrollbar overflow-x-hidden">
        {adminNavGroups.map((group, groupIdx) => (
          <div key={group.groupName || groupIdx} className="space-y-1">
            {/* Tên nhóm danh mục */}
            {isOpen ? (
              <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 tracking-wider uppercase px-4 py-1 mt-2 select-none">
                {group.groupName}
              </p>
            ) : (
              groupIdx > 0 && <div className="border-t border-gray-100 dark:border-slate-800/80 my-3 mx-2" />
            )}

            {group.items.map((item) => {
              const active = pathname === item.path || pathname.startsWith(item.path + "/");

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  title={!isOpen ? item.name : undefined} // Tooltip khi thu nhỏ sidebar
                  className={`flex items-center py-3 rounded-xl transition-all duration-200 whitespace-nowrap ${
                    isOpen 
                      ? "justify-between px-4" // Khi mở to: chữ bám trái, mũi tên bám phải
                      : "justify-center px-0"  // Khi thu nhỏ: icon căn giữa
                  } ${
                    active
                      ? "bg-emerald-100 text-emerald-700 font-bold shadow-sm dark:bg-emerald-900/60 dark:text-emerald-300"
                      : "text-gray-800 hover:bg-emerald-50 hover:text-emerald-600 dark:text-slate-200 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-300"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <span className={`transition-colors ${active ? "text-emerald-600 dark:text-emerald-400" : "text-gray-500 dark:text-slate-400"}`}>
                      {item.icon}
                    </span>
                    {/* Ẩn / Hiện tên text của danh mục menu */}
                    <span className={`text-[13px] font-medium tracking-wide transition-opacity duration-200 ${isOpen ? "opacity-100" : "opacity-0 md:w-0 overflow-hidden"}`}>
                      {item.name}
                    </span>
                  </div>
                  
                  {/* Mũi tên góc phải */}
                  {isOpen && (
                    <ChevronRight className={`h-3.5 w-3.5 transition-transform ${active ? "text-emerald-500 translate-x-0.5 dark:text-emerald-400" : "text-gray-400 dark:text-slate-500"}`} />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/50 whitespace-nowrap overflow-hidden dark:border-slate-800 dark:bg-slate-900/50 flex flex-col items-center justify-center flex-shrink-0">
        <div className="text-center flex flex-col items-center justify-center w-full">
          <p className="text-[12px] font-bold text-gray-800 dark:text-slate-200 tracking-wider">
            {isOpen ? "EMS" : "E"}
          </p>
          {isOpen && <p className="text-[10px] text-gray-500 dark:text-slate-400 mt-0.5 text-center">Education Management System</p>}
        </div>
      </div>
    </aside>
  );
}