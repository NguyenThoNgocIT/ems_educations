"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { Plus, MapPin, Search, Command } from "lucide-react";
import QuickLeadForm from "./QuickLeadForm";
import NotificationDropdown from "@/header/NotificationDropdown";
import UserDropdown from "@/header/UserDropdown";
import { ThemeToggleButton } from "@/components/common/ThemeToggleButton";
import { useSidebar } from "@/components/context/SidebarContext";

const BRANCHES = [
  { value: "cs2", label: "CS2 - Bình Thạnh HCM" },
  { value: "cs1", label: "CS1 - Quận 1 HCM" },
  { value: "cs3", label: "CS3 - Hà Nội" },
];

interface AppHeaderProps {
  role?: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({ role = "admin" }) => {
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(BRANCHES[0].value);
  const [showQuickLead, setShowQuickLead] = useState(false);

  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();
  const inputRef = useRef<HTMLInputElement>(null);

  const isAdmin = role === "admin";
  const isBranchManager = role === "branch-management";
  const isConsultant = role === "consultant";
  const canCreateLead = isAdmin || isBranchManager || isConsultant;
  const displayBranches = isAdmin ? BRANCHES : [BRANCHES[0]];

  const handleToggle = () => {
    if (window.innerWidth >= 1024) toggleSidebar();
    else toggleMobileSidebar();
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 flex w-full border-b border-slate-200 bg-white/80 backdrop-blur-md transition-colors duration-300 lg:px-6 dark:border-slate-800 dark:bg-slate-900/80">
        <div className="flex w-full grow flex-col items-center justify-between lg:flex-row">
          {/* PHẦN TRÁI: Toggle & Search */}
          <div className="flex w-full items-center justify-between gap-2 border-b border-slate-200 px-3 py-3 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4 dark:border-slate-800">
            <button
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 shadow-sm transition-all hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
              onClick={handleToggle}
            >
              {isMobileOpen ? (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  width="20"
                  height="16"
                  viewBox="0 0 20 16"
                  fill="currentColor"
                >
                  <path d="M1.33325 1.75H18.6666C19.0808 1.75 19.4166 1.41421 19.4166 1C19.4166 0.585786 19.0808 0.25 18.6666 0.25H1.33325C0.919038 0.25 0.583252 0.585786 0.583252 1C0.583252 1.41421 0.919038 1.75 1.33325 1.75Z" />
                </svg>
              )}
            </button>

            <Link href="/" className="ml-2 lg:hidden">
              <Image
                width={120}
                height={30}
                src="/images/logo/logo.svg"
                alt="Logo"
                className="dark:hidden"
              />
              <Image
                width={120}
                height={30}
                src="/images/logo/logo-dark.svg"
                alt="Logo"
                className="hidden dark:block"
              />
            </Link>

            {/* Ô TÌM KIẾM: Đã chỉnh màu text tự động */}
            <div className="relative ml-6 hidden lg:block">
              <Search
                className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                ref={inputRef}
                type="text"
                placeholder="Tìm kiếm học viên, khóa học..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 pr-16 pl-12 text-sm font-medium text-slate-9 leading-relaxed00 transition-colors outline-none focus:border-indigo-500 xl:w-[350px] dark:border-slate-800 dark:bg-white/[0.03] dark:text-white"
              />
              <div className="absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-1 rounded-md border border-slate-200 bg-white px-1.5 py-1 text-[10px] font-medium text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500">
                <Command size={10} /> K
              </div>
            </div>

            <button
              onClick={() => setApplicationMenuOpen(!isApplicationMenuOpen)}
              className="p-2 text-slate-500 lg:hidden dark:text-slate-400"
            >
              <Plus
                className={`transition-transform duration-300 ${isApplicationMenuOpen ? "rotate-45" : ""}`}
              />
            </button>
          </div>

          {/* PHẦN PHẢI: Lead, Chi nhánh & Profile */}
          <div
            className={`${isApplicationMenuOpen ? "flex" : "hidden"} w-full flex-col items-center gap-4 px-5 py-4 lg:flex lg:w-auto lg:flex-row lg:justify-end lg:px-0 lg:py-0`}
          >
            <div className="flex w-full items-center gap-3 lg:w-auto">
              {canCreateLead && (
                <button
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-200 transition-all hover:bg-indigo-700 lg:flex-none dark:shadow-none"
                  onClick={() => setShowQuickLead(true)}
                >
                  <Plus size={18} strokeWidth={3} /> Tạo lead
                </button>
              )}

              {/* DROPDOWN CHI NHÁNH: Chỉnh text đen/trắng */}
              <div className="relative flex-1 lg:flex-none">
                <MapPin
                  className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <select
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-10 pl-9 text-xs font-bold text-slate-700 transition-colors outline-none lg:min-w-[210px] dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  disabled={!isAdmin}
                >
                  {displayBranches.map((branch) => (
                    <option
                      key={branch.value}
                      value={branch.value}
                      className="dark:bg-slate-900"
                    >
                      {branch.label}
                    </option>
                  ))}
                </select>
                {isAdmin && (
                  <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                      <path
                        d="M1L5 5L9 1"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 border-l border-slate-100 pl-4 lg:ml-2 dark:border-slate-800">
              <ThemeToggleButton />
              <NotificationDropdown />
              <UserDropdown role={role} />
            </div>
          </div>
        </div>
      </header>

      {showQuickLead && (
        <div className="animate-in fade-in fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm duration-300">
          <QuickLeadForm
            onClose={() => setShowQuickLead(false)}
            createdBy="MONA User"
            createdDate="10/02/2026"
          />
        </div>
      )}
    </>
  );
};

export default AppHeader;

