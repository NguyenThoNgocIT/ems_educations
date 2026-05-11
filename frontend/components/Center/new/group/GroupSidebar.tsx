"use client";
import React from "react";
import Link from "next/link";
import { Plus, ChevronDown, MessageCircle } from "lucide-react";
import groupsData from "./data_groups";

// Thêm Interface cho Props
interface GroupSidebarProps {
  onAddGroup: () => void; // Hàm này sẽ được gọi khi nhấn nút "Thêm nhóm"
}

const GroupSidebar: React.FC<GroupSidebarProps> = ({ onAddGroup }) => {
  return (
    <div className="sticky top-6 hidden h-fit w-80 space-y-4 font-sans lg:block">
      {/* Box Danh sách nhóm */}
      <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-bold text-slate-900 dark:text-white leading-snug">
            Danh sách nhóm
          </h2>

          {/* SỬA ĐỔI: Thêm onClick={onAddGroup} vào đây */}
          <button
            onClick={onAddGroup}
            className="flex items-center gap-1 rounded-lg bg-blue-500 px-3 py-1.5 text-[11px] font-bold text-white transition-all hover:bg-blue-600 active:scale-95"
          >
            <Plus size={14} /> Thêm nhóm
          </button>
        </div>

        <div className="space-y-1">
          {groupsData.map((group) => (
            <Link
              key={group.id}
              href={`?group=${group.id}`}
              scroll={false}
              className="group flex cursor-pointer items-center gap-3 rounded-xl p-2 transition-all hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg border border-slate-100 dark:border-slate-600">
                {group.name === "Không" ? (
                  <div className="flex h-full w-full items-center justify-center bg-slate-50 dark:bg-slate-800">
                    <ChevronDown size={18} className="text-slate-400" />
                  </div>
                ) : (
                  <img
                    src={group.avatar}
                    alt="group"
                    className="h-full w-full object-cover"
                  />
                )}
              </div>

              <div className="flex-1 overflow-hidden">
                <h4 className="truncate text-[13px] font-bold text-slate-900 transition-colors group-hover:text-indigo-700 dark:text-white leading-tight leading-snug">
                  {group.name}
                </h4>
                <p className="text-[11px] font-medium text-slate-400 leading-relaxed">
                  {group.members} thành viên
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GroupSidebar;


