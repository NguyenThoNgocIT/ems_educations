"use client";

import { useAuth } from "@/context/AuthContext";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { LogOut, UserRound } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface UserDropdownProps {
  role?: string;
}

export default function UserDropdown({ role = "admin" }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { user, logout } = useAuth();

  const roleLabels: Record<string, string> = {
    admin: "Quản trị viên",
    "branch-management": "Quản lý chi nhánh",
    consultant: "Tư vấn viên",
    lecturer: "Giảng viên",
    student: "Sinh viên",
    parents: "Phụ huynh",
  };
  const currentRoleLabel = roleLabels[role] || "Người dùng";

  const handleSignOut = () => {
    document.cookie = "user-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    document.cookie = "user-role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    router.push("/");
    router.refresh();
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          setIsOpen((current) => !current);
        }}
        className="flex items-center text-slate-700 transition hover:text-emerald-700 dark:text-slate-300"
      >
        <span className="mr-3 h-10 w-10 overflow-hidden rounded-full border-2 border-emerald-50 shadow-sm dark:border-emerald-950">
          <Image width={40} height={40} src="/images/user/owner.jpg" alt="Người dùng" className="object-cover" />
        </span>
        <span className="mr-1 hidden text-sm font-bold sm:block">{currentRoleLabel}</span>
        <span className={`text-xs text-slate-400 transition ${isOpen ? "rotate-180" : ""}`}>v</span>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        className="absolute right-0 mt-4 flex w-60 flex-col rounded-lg border border-slate-100 bg-white p-3 shadow-xl dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="mb-2 border-b border-slate-100 px-3 py-2 dark:border-slate-800">
          <span className="block text-sm font-bold text-slate-950 dark:text-white">{currentRoleLabel}</span>
          <span className="mt-0.5 block text-xs text-slate-400">Phiên đăng nhập hiện tại</span>
        </div>

        <DropdownItem
          onItemClick={() => setIsOpen(false)}
          tag="a"
          href="/profile"
          className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 dark:text-slate-300 dark:hover:bg-emerald-950/30"
        >
          <UserRound size={18} className="text-slate-400 group-hover:text-emerald-600" />
          Hồ sơ cá nhân
        </DropdownItem>

        <button
          type="button"
          onClick={handleSignOut}
          className="group mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold text-rose-600 transition hover:bg-rose-50 dark:hover:bg-rose-500/10"
        >
          <LogOut size={18} className="text-rose-500" />
          Đăng xuất
        </button>
      </Dropdown>
    </div>
  );
}
