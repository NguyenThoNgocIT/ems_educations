"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  BarChart3,
  Users,
  ListTodo,
  FileText,
  FolderOpen,
  PenLine,
  CreditCard,
  UserCheck,
  MessageSquare,
  Award,
  Bell,
  MoreHorizontal,
} from "lucide-react";

const Sidebar = () => {
  const pathname = usePathname();

  // Cấu trúc dữ liệu phân loại theo nhóm
  const menuGroups = [
    {
      items: [
        {
          icon: <Calendar size={20} />,
          label: "Lịch học",
          path: "/home-office/calendar",
        },
        {
          icon: <BarChart3 size={20} />,
          label: "Thống kê",
          path: "/home-office/statistics",
        },
        {
          icon: <Users size={20} />,
          label: "Học viên",
          path: "/home-office/students",
        },
        {
          icon: <ListTodo size={20} />,
          label: "Các buổi học",
          path: "/home-office/sessions",
        },
        {
          icon: <FileText size={20} />,
          label: "Bài tập",
          path: "/home-office/assignments",
          hasBadge: true,
        },
        {
          icon: <FolderOpen size={20} />,
          label: "Tài liệu",
          path: "/home-office/materials",
        },
        {
          icon: <PenLine size={20} />,
          label: "Điểm danh",
          path: "/home-office/attendance",
        },
        {
          icon: <CreditCard size={20} />,
          label: "Bảng điểm",
          path: "/home-office/grades",
        },
        {
          icon: <UserCheck size={20} />,
          label: "Điểm danh giáo viên",
          path: "/home-office/teacher-attendance",
        },
        {
          icon: <MessageSquare size={20} />,
          label: "Phản hồi buổi học",
          path: "/home-office/feedback",
        },
        {
          icon: <Award size={20} />,
          label: "Mẫu chứng chỉ",
          path: "/home-office/certificates",
        },
        {
          icon: <Bell size={20} />,
          label: "Thông báo",
          path: "/home-office/notifications",
        },
      ],
    },
  ];

  return (
    <aside className="no-scrollbar sticky top-0 flex h-screen w-[280px] flex-col overflow-y-auto border-r border-slate-100 bg-white py-6 shadow-sm transition-all dark:border-slate-700 dark:bg-slate-900">
      {/* Duyệt qua từng nhóm Menu */}
      <div className="flex flex-col gap-8">
        {menuGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="flex flex-col gap-2">
            {/* Danh sách các Item trong nhóm */}
            <nav className="flex flex-col gap-0.5">
              {group.items.map((item, index) => {
                const isActive = pathname === item.path;

                return (
                  <Link
                    key={index}
                    href={item.path}
                    className={`group relative flex items-center gap-4 px-6 py-3.5 transition-all duration-300 ${
                      isActive
                        ? "bg-blue-50/40 font-extrabold text-indigo-700"
                        : "text-slate-600 hover:bg-slate-50/50 hover:text-indigo-600 dark:hover:bg-slate-800"
                    }`}
                  >
                    {/* Icon với hiệu ứng màu sắc chuẩn */}
                    <div
                      className={`${isActive ? "scale-110 text-indigo-700" : "text-slate-400 group-hover:text-blue-400"} transition-transform`}
                    >
                      {item.icon}
                    </div>

                    {/* Nhãn menu */}
                    <span className="text-[13px] tracking-tight">
                      {item.label}
                    </span>

                    {/* Badge Add-on đặc trưng cho Bài tập */}
                    {item.hasBadge && (
                      <span className="ml-auto flex animate-pulse items-center gap-1 rounded-full bg-gradient-to-r from-pink-500 to-blue-600 px-2 py-0.5 text-[9px] font-bold text-white italic shadow-sm">
                        🚀 Add on
                      </span>
                    )}

                    {/* Thanh gờ Active bên phải */}
                    {isActive && (
                      <div className="absolute top-0 right-0 bottom-0 w-[3.5px] rounded-l-full bg-blue-600 shadow-[0_0_12px_rgba(37,99,235,0.6)]" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;

