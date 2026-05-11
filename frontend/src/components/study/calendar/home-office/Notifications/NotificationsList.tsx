"use client";
import React from "react";
import { Plus, Edit3, Trash2, Mail, MessageSquare } from "lucide-react";

const notificationsData = [
  {
    id: 1,
    appNotify: true,
    emailNotify: true,
    content: "Lịch học tuần này đã được cập nhật cho tất cả các lớp cơ sở 1.",
    creator: "Admin",
    createdAt: "02-02-2026 08:30 SA",
  },
  {
    id: 2,
    appNotify: true,
    emailNotify: false,
    content: "Hệ thống sẽ bảo trì vào lúc 12h đêm nay.",
    creator: "Kỹ thuật",
    createdAt: "01-02-2026 10:15 CH",
  },
];

export default function NotificationsTable() {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white font-sans shadow-sm dark:border-slate-700 dark:bg-slate-900">
      {/* --- HEADER: TIÊU ĐỀ & NÚT THÊM THÔNG BÁO --- */}
      <div className="flex items-center justify-between border-b border-slate-50 p-6 dark:border-slate-700">
        <h2 className="text-lg leading-normal leading-snug font-bold tracking-tight text-slate-900 italic dark:text-white/90">
          Quản lý thông báo
        </h2>
        <button className="flex items-center gap-2 rounded-xl bg-[#22C55E] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-green-500/10 transition-all hover:bg-green-600 active:scale-95">
          <Plus size={18} /> Thêm thông báo
        </button>
      </div>

      {/* --- TABLE: DANH SÁCH CHI TIẾT THEO TIÊU ĐỀ BẠN CẦN --- */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b bg-slate-50/50 text-sm font-extrabold tracking-wider text-slate-900 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white">
              <th className="px-6 py-4 text-center">Lớp học</th>
              <th className="px-6 py-4 text-center">Email</th>
              <th className="px-6 py-4">Nội dung thông báo</th>
              <th className="px-6 py-4">Người tạo</th>
              <th className="px-6 py-4">Ngày tạo</th>
              <th className="px-6 py-4 text-center">Chức năng</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
            {notificationsData.map((n) => (
              <tr
                key={n.id}
                className="group transition-colors hover:bg-slate-50/30"
              >
                {/* Thông báo lớp học (Badge Icon) */}
                <td className="px-6 py-5 text-center">
                  <div
                    className={`mx-auto flex h-8 w-8 items-center justify-center rounded-lg ${n.appNotify ? "bg-blue-100 text-indigo-700" : "bg-slate-50 text-slate-400"}`}
                  >
                    <MessageSquare size={16} />
                  </div>
                </td>

                {/* Thông báo qua email (Badge Icon) */}
                <td className="px-6 py-5 text-center">
                  <div
                    className={`mx-auto flex h-8 w-8 items-center justify-center rounded-lg ${n.emailNotify ? "bg-amber-100 text-amber-600" : "bg-slate-50 text-slate-400"}`}
                  >
                    <Mail size={16} />
                  </div>
                </td>

                {/* Nội dung */}
                <td className="px-6 py-5">
                  <p className="dark:text-slate-3 leading-relaxed00 line-clamp-1 text-sm leading-relaxed font-bold text-slate-900">
                    {n.content}
                  </p>
                </td>

                {/* Người tạo */}
                <td className="px-6 py-5">
                  <span className="text-sm font-semibold text-indigo-700">
                    {n.creator}
                  </span>
                </td>

                {/* Ngày tạo */}
                <td className="px-6 py-5">
                  <span className="text-xs font-bold text-slate-400">
                    {n.createdAt}
                  </span>
                </td>

                {/* Chức năng */}
                <td className="px-6 py-5">
                  <div className="flex items-center justify-center gap-4">
                    <button
                      title="Sửa"
                      className="text-indigo-600 transition-transform hover:scale-110"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button
                      title="Xóa"
                      className="text-rose-500 transition-transform hover:scale-110"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
