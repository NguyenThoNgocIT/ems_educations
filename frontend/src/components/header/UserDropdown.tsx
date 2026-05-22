"use client";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { User, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// Định nghĩa Props để nhận role từ AppHeader
interface UserDropdownProps {
  role?: string;
}

export default function UserDropdown({ role = "admin" }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { user, logout } = useAuth();

  // 1. ÁNH XẠ VAI TRÒ SANG TIẾNG VIỆT
  const roleLabels: Record<string, string> = {
    admin: "Admin",
    "branch-management": "Quản lý chi nhánh",
    consultant: "Tư vấn viên",
    lecturer: "Giáo Viên",
    student: "Học viên",
    parents: "Phụ huynh",
  };

  const activeRole = user?.role || role;
  const currentRoleLabel = roleLabels[activeRole] || "Người dùng";
  const displayName = user?.fullName || user?.username || currentRoleLabel;
  const displayEmail = user?.email || user?.username || "";
  const initials = useMemo(() => {
    const parts = displayName.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "U";
    const first = parts[0]?.[0] || "";
    const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
    return `${first}${last}`.toUpperCase();
  }, [displayName]);

  // 2. LOGIC ĐĂNG XUẤT: Xóa sạch Cookie gác cổng
  const handleSignOut = () => {
    // Xóa cookie bằng cách set thời gian hết hạn về quá khứ
    document.cookie =
      "user-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    document.cookie =
      "user-role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    localStorage.removeItem("refresh_token");
    logout();

    // Đẩy về trang chủ và làm mới Middleware
    router.push("/");
    router.refresh();
  };

  function toggleDropdown(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center text-slate-700 transition-colors hover:text-indigo-600 dark:text-slate-300"
      >
        <span className="mr-3 flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-indigo-50 bg-emerald-600 text-sm font-bold text-white shadow-sm">
          {initials}
        </span>

        <span className="mr-1 hidden max-w-44 flex-col items-start sm:flex">
          <span className="max-w-full truncate text-sm font-bold">{displayName}</span>
          <span className="max-w-full truncate text-xs text-slate-400">{currentRoleLabel}</span>
        </span>

        <svg
          className={`stroke-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          width="18"
          height="18"
          viewBox="0 0 18 20"
          fill="none"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] flex w-[240px] flex-col rounded-2xl border border-slate-100 bg-white p-3 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="mb-2 border-b border-slate-50 px-3 py-2 dark:border-slate-800">
          <span className="block text-sm font-bold text-slate-9 leading-relaxed00 dark:text-white">
            {displayName}
          </span>
          <span className="mt-0.5 block text-xs text-slate-400">
            {displayEmail || currentRoleLabel}
          </span>
        </div>

        <ul className="flex flex-col gap-1">
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              href="/profile"
              className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 dark:text-slate-4 leading-relaxed00 dark:hover:bg-white/5"
            >
              <User
                size={18}
                className="text-slate-400 group-hover:text-indigo-600"
              />
              Edit profile
            </DropdownItem>
          </li>
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              href="/settings"
              className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 dark:text-slate-4 leading-relaxed00 dark:hover:bg-white/5"
            >
              <Settings
                size={18}
                className="text-slate-400 group-hover:text-indigo-600"
              />
              Account settings
            </DropdownItem>
          </li>
        </ul>

        {/* NÚT ĐĂNG XUẤT THỰC TẾ */}
        <button
          onClick={handleSignOut}
          className="group mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-rose-600 transition-colors hover:bg-rose-50 dark:hover:bg-rose-500/10"
        >
          <LogOut size={18} className="text-rose-500" />
          Sign out
        </button>
      </Dropdown>
    </div>
  );
}

