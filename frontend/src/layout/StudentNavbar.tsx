"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { STUDENT_NAV_ITEMS } from "@/constants/student_navigation";
import { ShoppingCart } from "lucide-react";
// 1. IMPORT USER DROPDOWN
import UserDropdown from "@/components/header/UserDropdown";
import { ThemeToggleButton } from "@/components/common/ThemeToggleButton";

export default function StudentNavbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
      <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6">
        {/* Logo & Brand */}
        <Link href="/dashboard/student" className="flex items-center gap-2">
          <Image
            src="/images/logo/logo.svg"
            alt="Logo"
            width={110}
            height={28}
          />
          <span className="hidden border-l border-slate-200 pl-2 text-xs font-bold text-pink-500 sm:block">
            Edutech
          </span>
        </Link>

        {/* Menu giữa dành cho Học viên */}
        <nav className="hidden items-center gap-8 lg:flex">
          {STUDENT_NAV_ITEMS.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center gap-2 text-sm font-bold transition-all ${
                pathname === item.path
                  ? "text-indigo-600"
                  : "text-slate-500 hover:text-indigo-500 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              <span
                className={
                  pathname === item.path ? "text-indigo-500" : "text-slate-400"
                }
              >
                {item.icon}
              </span>
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Cụm tính năng bên phải */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2 border-r border-slate-100 pr-2 sm:gap-3 sm:pr-4 dark:border-slate-800">
            <ThemeToggleButton />
            <button className="relative rounded-xl p-2 text-slate-500 transition-all hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-white/5">
              <ShoppingCart size={20} />
              {/* Badge giỏ hàng (nếu cần) */}
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full border-2 border-white bg-rose-500 dark:border-slate-900"></span>
            </button>
          </div>

          {/* 2. THAY THẾ AVATAR TĨNH BẰNG DROPDOWN */}
          {/* Truyền role="student" để hiện chữ "Học viên" và xử lý đăng xuất */}
          <UserDropdown role="student" />
        </div>
      </div>
    </header>
  );
}
