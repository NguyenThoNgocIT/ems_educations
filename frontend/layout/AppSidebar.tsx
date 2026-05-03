"use client";
import React, { useRef, useState, useCallback, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Rocket, ChevronDown, MoreHorizontal } from "lucide-react";

import {
  CenterItems,
  LearingItems,
  navItems,
  othersItems,
  NavItem,
} from "@/components/constants/navigation";
import {
  CenterItems as BranchCenter,
  LearingItems as BranchLearning,
  navItems as BranchNav,
  othersItems as BranchOthers,
} from "@/components/constants/branch-management";

import {
  TEACHER_CENTER_ITEMS,
  TEACHER_LEARNING_ITEMS,
} from "@/components/constants/teacher_navigation";
import {
  CONSULTANT_CENTER_ITEMS,
  CONSULTANT_LEARNING_ITEMS,
  CONSULTANT_MANAGEMENT_ITEMS,
} from "@/components/constants/consultant_navigation";
import {
  PARENT_INFO_ITEMS,
  PARENT_STUDY_ITEMS,
} from "@/components/constants/ParentNavigation";
import { useSidebar } from "@/components/context/SidebarContext";

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
    [isActive]
  );

  useEffect(() => {
    const findActiveMenu = (items: NavItem[], menuType: string) => {
      items.forEach((nav, index) => {
        if (nav.subItems?.some((sub) => sub.path === pathname)) {
          setOpenSubmenu({ type: menuType, index });
        }
      });
    };

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
  }, [pathname, displayCenterItems, displayLearningItems, isAdmin, isBranch, isConsultant]);

  const handleSubmenuToggle = (index: number, menuType: string) => {
    setOpenSubmenu((prev) =>
      prev?.type === menuType && prev?.index === index ? null : { type: menuType, index }
    );
  };

  const renderMenuItems = (items: NavItem[], menuType: string) => (
    <ul className="flex flex-col gap-1">
      {items.map((nav, index) => {
        const isOpen = openSubmenu?.type === menuType && openSubmenu?.index === index;
        const active = isParentActive(nav);

        return (
          <li key={nav.name} className="relative">
            {/* Item chính */}
            {nav.subItems ? (
              <button
                onClick={() => handleSubmenuToggle(index, menuType)}
                className={`group flex w-full items-center gap-3 rounded-2xl px-4 py-3 font-Inter font-semibold text-[14px] transition-all duration-200
                  ${active || isOpen
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                    : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  }
                  ${!isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"}
                `}
              >
                <span className="text-2xl">{nav.icon}</span>

                {(isExpanded || isHovered || isMobileOpen) && (
                  <div className="flex flex-1 items-center justify-between">
                    <span>{nav.name}</span>

                    {nav.pro && (
                      <span className="rounded bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-slate-900 flex items-center gap-1">
                        <Rocket size={12} />
                        Pro
                      </span>
                    )}

                    <ChevronDown
                      size={18}
                      className={`ml-auto transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </div>
                )}
              </button>
            ) : (
              nav.path && (
                <Link
                  href={nav.path}
                  className={`group flex w-full items-center gap-3 rounded-2xl px-4 py-3 font-Inter font-semibold text-[14px] transition-all duration-200
                    ${isParentActive(nav)
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                      : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    }
                    ${!isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"}
                  `}
                >
                  <span className="text-2xl">{nav.icon}</span>

                  {(isExpanded || isHovered || isMobileOpen) && (
                    <div className="flex flex-1 items-center justify-between">
                      <span>{nav.name}</span>
                      {nav.pro && (
                        <span className="rounded bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-slate-900 flex items-center gap-1">
                          <Rocket size={12} />
                          Pro
                        </span>
                      )}
                    </div>
                  )}
                </Link>
              )
            )}

            {/* Submenu */}
            {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
              <div
                ref={(el) => {
                  subMenuRefs.current[`${menuType}-${index}`] = el;
                }}
                className="overflow-hidden transition-all duration-300"
                style={{
                  height: isOpen
                    ? `${subMenuRefs.current[`${menuType}-${index}`]?.scrollHeight}px`
                    : "0px",
                }}
              >
                <ul className="mt-1 ml-8 space-y-1 border-l-2 border-slate-200 dark:border-slate-700">
                  {nav.subItems.map((sub) => (
                    <li key={sub.name}>
                      <Link
                        href={sub.path}
                        className={`flex items-center gap-3 rounded-xl px-4 py-2.5 font-Inter font-normal text-[13px] transition-all
                          ${isActive(sub.path)
                            ? "bg-indigo-100 font-semibold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400"
                            : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                          }
                        `}
                      >
                        <span>{sub.name}</span>
                        {sub.pro && (
                          <span className="rounded bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-slate-900">
                            Pro
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );

  if (role === "student") return null;

  return (
    <aside
      className={`fixed top-0 left-0 z-50 mt-16 flex h-screen flex-col border-r border-slate-200 bg-white transition-all duration-300 lg:mt-0 dark:border-slate-800 dark:bg-slate-950
        ${isExpanded || isHovered || isMobileOpen ? "w-72" : "w-20"} 
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-8">
        <Image
          src="/images/logo/logo.svg"
          alt="Logo"
          width={42}
          height={42}
          className="dark:hidden"
        />
        <Image
          src="/images/logo/logo-dark.svg"
          alt="Logo"
          width={42}
          height={42}
          className="hidden dark:block"
        />
        {(isExpanded || isHovered || isMobileOpen) && (
          <span className="text-2xl font-bold font-Inter">Admin</span>
        )}
      </div>

      {/* Navigation */}
      <div className="no-scrollbar flex-1 overflow-y-auto px-3">
        <nav className="space-y-8">
          <div>
            <h2 className="mb-3 px-4 text-xs font-semibold tracking-widest text-slate-500 font-Inter">
              {isExpanded || isHovered || isMobileOpen
                ? isParent ? "THÔNG TIN CHUNG" : "TRUNG TÂM"
                : <MoreHorizontal size={20} />}
            </h2>
            {renderMenuItems(displayCenterItems, "center")}
          </div>

          <div>
            <h2 className="mb-3 px-4 text-xs font-semibold tracking-widest text-slate-500 font-Inter">
              {isExpanded || isHovered || isMobileOpen ? "HỌC TẬP" : <MoreHorizontal size={20} />}
            </h2>
            {renderMenuItems(displayLearningItems, "learning")}
          </div>

          {(isAdmin || isBranch || isConsultant) && (
            <div>
              <h2 className="mb-3 px-4 text-xs font-semibold tracking-widest text-slate-500 font-Inter">
                {isExpanded || isHovered || isMobileOpen ? "QUẢN LÝ" : <MoreHorizontal size={20} />}
              </h2>
              {isAdmin && renderMenuItems(navItems, "main")}
              {isBranch && renderMenuItems(BranchNav, "main")}
              {isConsultant && renderMenuItems(CONSULTANT_MANAGEMENT_ITEMS, "management")}
            </div>
          )}

          {(isAdmin || isBranch) && (
            <div>
              <h2 className="mb-3 px-4 text-xs font-semibold tracking-widest text-slate-500 font-Inter">
                {isExpanded || isHovered || isMobileOpen ? "CẤU HÌNH" : <MoreHorizontal size={20} />}
              </h2>
              {isAdmin && renderMenuItems(othersItems, "cauhinh")}
              {isBranch && renderMenuItems(BranchOthers, "cauhinh")}
            </div>
          )}
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;