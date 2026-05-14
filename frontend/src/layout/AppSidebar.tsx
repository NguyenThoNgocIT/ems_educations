"use client";

import { useSidebar } from "@/context/SidebarContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  User,
  BookOpen,
  Layers,
  Building,
  DoorOpen,
  Clock,
  CalendarDays,
} from "lucide-react";

// Menu trực tiếp trong file (không cần qua navigation.tsx)
const adminMenu = [
  { name: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" />, path: "/dashboard/admin" },
  { name: "Sinh viên", icon: <Users className="h-5 w-5" />, path: "/dashboard/admin/students" },
  { name: "Giảng viên", icon: <User className="h-5 w-5" />, path: "/dashboard/admin/lecturers" },
  { name: "Môn học", icon: <BookOpen className="h-5 w-5" />, path: "/dashboard/admin/courses" },
  { name: "Lớp học phần", icon: <Layers className="h-5 w-5" />, path: "/dashboard/admin/course-classes" },
  { name: "Tòa nhà", icon: <Building className="h-5 w-5" />, path: "/dashboard/admin/buildings" },
  { name: "Phòng học", icon: <DoorOpen className="h-5 w-5" />, path: "/dashboard/admin/rooms" },
  { name: "Ca học", icon: <Clock className="h-5 w-5" />, path: "/dashboard/admin/time-slots" },
  { name: "Thời khóa biểu", icon: <CalendarDays className="h-5 w-5" />, path: "/dashboard/admin/schedules" },
];

export default function AppSidebar() {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const pathname = usePathname();

  return (
    <aside className={`fixed left-0 top-0 z-50 h-full bg-white dark:bg-gray-900 shadow-xl transition-all duration-300 ${isExpanded || isHovered ? 'w-64' : 'w-20'}`}>
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center justify-center border-b">
          <span className={`font-bold text-primary ${!(isExpanded || isHovered) && 'hidden'}`}>
            ĐẠI HỌC ĐÔNG Á
          </span>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {adminMenu.map((item) => {
            const isActive = pathname === item.path || pathname?.startsWith(item.path + '/');
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                }`}
              >
                {item.icon}
                <span className={`${!(isExpanded || isHovered) && 'hidden'}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}