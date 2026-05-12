"use client";
import React, { useRef, useState, useCallback, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import { ChevronDown as ChevronDownIcon, MoreHorizontal as HorizontaLDots } from "lucide-react";
// 1. IMPORT ICON ROCKET
import { Rocket } from "lucide-react";

import {
  CenterItems,
  LearingItems,
  navItems,
  othersItems,
  NavItem,
} from "../constants/navigation";
import {
  CenterItems as BranchCenter,
  LearingItems as BranchLearning,
  navItems as BranchNav,
  othersItems as BranchOthers,
} from "../constants/branch-management";

import {
  TEACHER_CENTER_ITEMS,
  TEACHER_LEARNING_ITEMS,
} from "../constants/teacher_navigation";
import {
  CONSULTANT_CENTER_ITEMS,
  CONSULTANT_LEARNING_ITEMS,
  CONSULTANT_MANAGEMENT_ITEMS,
} from "../constants/consultant_navigation";
import {
  PARENT_INFO_ITEMS,
  PARENT_STUDY_ITEMS,
} from "@/constants/ParentNavigation";

interface AppSidebarProps {
  role?: string;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ role = "admin" }) => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const [openSubmenu, setOpenSubmenu] = useState<{
    type: string;
    index: number;
  } | null>(null);
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isAdmin = role === "admin";
  const isBranch = role === "branch-management";
  const isTeacher = role === "teacher";
  const isConsultant = role === "consultant";
  const isParent = role === "parents";

  const displayCenterItems = isTeacher
    ? TEACHER_CENTER_ITEMS
    : isConsultant
      ? CONSULTANT_CENTER_ITEMS
      : isParent
        ? PARENT_INFO_ITEMS
        : isBranch
          ? BranchCenter
          : CenterItems;
  const displayLearningItems = isTeacher
    ? TEACHER_LEARNING_ITEMS
    : isConsultant
      ? CONSULTANT_LEARNING_ITEMS
      : isParent
        ? PARENT_STUDY_ITEMS
        : isBranch
          ? BranchLearning
          : LearingItems;

  const isActive = useCallback((path: string) => path === pathname, [pathname]);
  const isParentActive = useCallback(
    (nav: NavItem) => {
      if (nav.path && isActive(nav.path)) return true;
      return nav.subItems?.some((sub) => isActive(sub.path)) || false;
    },
    [isActive],
  );

  // Tự động mở menu chứa route hiện tại khi component mount
  useEffect(() => {
    const findActiveMenu = (items: NavItem[], menuType: string) => {
      items.forEach((nav, index) => {
        if (nav.subItems?.some((sub) => sub.path === pathname)) {
          setOpenSubmenu({ type: menuType, index });
        }
      });
    };

    // Kiểm tra tất cả các menu groups
    findActiveMenu(displayCenterItems, "center");
    findActiveMenu(displayLearningItems, "learning");

    if (isAdmin) {
      findActiveMenu(navItems, "main");
      findActiveMenu(othersItems, "cauhinh");
    }
    if (isBranch) {
      findActiveMenu(BranchNav, "main");
      findActiveMenu(BranchOthers, "cauhinh");
    }
    if (isConsultant) {
      findActiveMenu(CONSULTANT_MANAGEMENT_ITEMS, "management");
    }
  }, [
    pathname,
    displayCenterItems,
    displayLearningItems,
    isAdmin,
    isBranch,
    isConsultant,
  ]);

  const handleSubmenuToggle = (index: number, menuType: string) => {
    setOpenSubmenu((prev) =>
      prev?.type === menuType && prev?.index === index
        ? null
        : { type: menuType, index },
    );
  };
  const renderMenuItems = (items: NavItem[], menuType: string) => (
    <ul className="flex flex-col gap-2">
      {items.map((nav, index) => (
        <li key={nav.name} className="relative">
          {/* --- TRƯỜNG HỢP 1: MỤC CHA CÓ MENU CON --- */}
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group transition-all duration-200 ${(openSubmenu?.type === menuType && openSubmenu?.index === index) || isParentActive(nav) ? "bg-indigo-50/50 text-indigo-600 shadow-[inset_0_0_0_1px_rgba(79,70,229,0.1)] dark:bg-indigo-500/5" : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-white/5"} ${!isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"}`}
            >
              <span
                className={`${(openSubmenu?.type === menuType && openSubmenu?.index === index) || isParentActive(nav) ? "text-indigo-600" : "text-slate-400"}`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <div className="flex flex-1 items-center justify-between overflow-hidden">
                  <span className="menu-item-text truncate font-bold">
                    {nav.name}
                  </span>

                  {/* BADGE CHA - GOLD MAX POWER */}
                  {nav.pro && (
                    <span className="relative flex scale-[0.8] items-center justify-center overflow-hidden rounded-sm p-[2px] shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                      <span className="absolute inset-[-1000%] animate-[spin_1.5s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#f59e0b_0%,#fff_25%,#fbbf24_50%,#fff_75%,#f59e0b_100%)]" />
                      <div className="relative z-10 flex items-center gap-1 rounded-sm bg-amber-400 px-2 py-0.5 text-[8px] font-bold text-slate-950 italic">
                        <Rocket size={8} fill="currentColor" />
                        <span>Addon</span>
                        <span className="absolute inset-0 animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                      </div>
                    </span>
                  )}

                  <ChevronDownIcon
                    className={`ml-auto h-4 w-4 transition-transform duration-300 ${openSubmenu?.type === menuType && openSubmenu?.index === index ? "rotate-180 text-indigo-500" : "text-slate-400"}`}
                  />
                </div>
              )}
            </button>
          ) : (
            /* --- TRƯỜNG HỢP 2: MỤC CHA LÀ LINK TRỰC TIẾP --- */
            nav.path && (
              <Link
                href={nav.path}
                className={`menu-item group transition-all ${isParentActive(nav) ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none" : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-white/5"}`}
              >
                <span
                  className={`${isParentActive(nav) ? "text-white" : "text-white"}`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <div className="flex flex-1 items-center justify-between">
                    <span className="menu-item-text font-bold">{nav.name}</span>
                    {/* BADGE LINK - GOLD MAX POWER */}
                    {nav.pro && (
                      <span className="relative flex scale-[0.8] items-center justify-center overflow-hidden rounded-sm p-[2px] shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                        <span className="absolute inset-[-1000%] animate-[spin_1.5s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#f59e0b_0%,#fff_25%,#fbbf24_50%,#fff_75%,#f59e0b_100%)]" />
                        <div className="relative z-10 flex items-center gap-1 rounded-sm bg-amber-400 px-2 py-0.5 text-[8px] font-bold text-slate-950 italic">
                          <Rocket size={8} fill="currentColor" />
                          <span>Addon</span>
                          <span className="absolute inset-0 animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                        </div>
                      </span>
                    )}
                  </div>
                )}
              </Link>
            )
          )}

          {/* --- HỆ THỐNG SUBMENU DÁN SÁT CHỮ --- */}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuRefs.current[`${menuType}-${index}`]?.scrollHeight}px`
                    : "0px",
              }}
            >
              <ul className="mt-1 ml-6 space-y-1 border-l-2 border-slate-100 dark:border-slate-800">
                {nav.subItems.map((sub) => (
                  <li key={sub.name} className="relative">
                    <Link
                      href={sub.path}
                      className={`menu-dropdown-item flex items-center justify-start gap-2 pl-5 before:absolute before:top-1/2 before:left-0 before:h-px before:w-3 before:bg-slate-100 dark:before:bg-slate-800 ${isActive(sub.path) ? "bg-indigo-50/30 font-bold text-indigo-600 dark:bg-indigo-500/5" : "text-slate-500 hover:text-indigo-500 dark:text-slate-400"}`}
                    >
                      <span className="text-[13px] whitespace-nowrap">
                        {sub.name}
                      </span>

                      {/* BADGE CON - GOLD MAX POWER (Dán sát chữ) */}
                      {sub.pro && (
                        <span className="relative flex scale-[0.75] items-center justify-center overflow-hidden rounded-sm p-[1.5px] shadow-[0_0_12px_rgba(245,158,11,0.25)]">
                          <span className="absolute inset-[-1000%] animate-[spin_1.5s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#f59e0b_0%,#fff_25%,#fbbf24_50%,#fff_75%,#f59e0b_100%)]" />
                          <div className="relative z-10 flex items-center gap-1 rounded-sm bg-amber-400 px-2 py-0.5 text-[8px] font-bold text-slate-950 italic">
                            <Rocket size={8} fill="currentColor" />
                            <span>Addon</span>
                            <span className="absolute inset-0 animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                          </div>
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
  if (role === "student") return null;

  return (
    <aside
      className={`fixed top-0 left-0 z-50 mt-16 flex h-screen flex-col border-r border-slate-200 bg-white px-5 transition-all duration-300 lg:mt-0 dark:border-slate-800 dark:bg-slate-900 ${isExpanded || isHovered || isMobileOpen ? "w-[290px]" : "w-[90px]"} lg:translate-x-0 ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`flex py-8 ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}
      >
        <Link href="/">
          <Image
            src="/images/logo/logo.svg"
            alt="Logo"
            width={150}
            height={40}
            className="dark:hidden"
          />
          <Image
            src="/images/logo/logo-dark.svg"
            alt="Logo"
            width={150}
            height={40}
            className="hidden dark:block"
          />
        </Link>
      </div>

      <div className="no-scrollbar flex flex-col overflow-y-auto">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            {/* Nhóm menu giữ nguyên logic lọc theo role */}
            <div>
              <h2
                className={`mb-4 flex text-xs text-black ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  isParent ? (
                    "Thông tin chung"
                  ) : (
                    "Trung tâm"
                  )
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(displayCenterItems, "center")}
            </div>
            <div className="mt-6">
              <h2
                className={`mb-4 flex text-xs text-black ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Học Tập"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(displayLearningItems, "learning")}
            </div>
            {(isAdmin || isBranch || isConsultant) && (
              <div className="mt-6">
                <h2
                  className={`mb-4 flex text-xs text-black ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}
                >
                  {isExpanded || isHovered || isMobileOpen ? (
                    "Quản lý"
                  ) : (
                    <HorizontaLDots />
                  )}
                </h2>
                {isAdmin && renderMenuItems(navItems, "main")}
                {isBranch && renderMenuItems(BranchNav, "main")}
                {isConsultant &&
                  renderMenuItems(CONSULTANT_MANAGEMENT_ITEMS, "management")}
              </div>
            )}
            {(isAdmin || isBranch) && (
              <div className="mt-6">
                <h2
                  className={`mb-4 flex text-xs text-black ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}
                >
                  {isExpanded || isHovered || isMobileOpen ? (
                    "Cấu hình"
                  ) : (
                    <HorizontaLDots />
                  )}
                </h2>
                {isAdmin && renderMenuItems(othersItems, "cauhinh")}
                {isBranch && renderMenuItems(BranchOthers, "cauhinh")}
              </div>
            )}
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;

