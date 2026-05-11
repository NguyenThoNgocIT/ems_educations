"use client";
import React from "react";
import {
  Trophy,
  BookOpen,
  Brain,
  Calendar,
  Clock,
  ArrowRight,
} from "lucide-react";

export default function StudentDashboardPage() {
  return (
    <div className="animate-in fade-in flex flex-col gap-8 duration-500 lg:flex-row">
      {/* --- CỘT TRÁI: BIỂU ĐỒ KỸ NĂNG --- */}
      <div className="w-full space-y-6 lg:w-1/3">
        <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-8 text-center text-lg text-black leading-normal">
            Điểm kỹ năng đầu vào
          </h2>

          {/* Placeholder cho Radar Chart (Công có thể dùng Recharts hoặc SVG) */}
          <div className="relative mx-auto flex h-64 w-64 items-center justify-center">
            <div className="absolute inset-0 rounded-full border-[1px] border-dashed border-slate-200 dark:border-slate-700"></div>
            <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-xl">
              <polygon
                points="50,10 90,50 50,90 10,50"
                className="fill-blue-500/20 stroke-blue-500 stroke-[1.5]"
              />
              <line
                x1="50"
                y1="10"
                x2="50"
                y2="90"
                className="stroke-gray-100 dark:stroke-gray-800"
              />
              <line
                x1="10"
                y1="50"
                x2="90"
                y2="50"
                className="stroke-gray-100 dark:stroke-gray-800"
              />
            </svg>
            <span className="absolute -top-4 text-[10px] font-semibold font-Inter text-slate-400">
              NaN
            </span>
            <span className="absolute -bottom-4 text-[10px] font-semibold font-Inter text-slate-400">
              NaN
            </span>
            <span className="absolute -left-4 text-[10px] font-semibold font-Inter text-slate-400">
              NaN
            </span>
            <span className="absolute -right-4 text-[10px] font-semibold font-Inter text-slate-400">
              NaN
            </span>
          </div>

          <button className="mt-12 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-50 py-4 text-sm font-bold text-blue-600 transition-all hover:bg-blue-100 dark:bg-blue-900/20">
            Lộ trình của tôi <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* --- CỘT PHẢI: NỘI DUNG CHÍNH --- */}
      <div className="flex-1 space-y-6">
        {/* Banner Lớp học sắp diễn ra */}
        <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-orange-50 px-4 py-2 text-sm font-semibold font-Inter text-orange-600 dark:bg-orange-900/20">
                PRE-IELTS 11
              </div>
              <div className="text-sm font-semibold font-Inter text-slate-5 leading-relaxed00">
                Buổi 1 •{" "}
                <span className="font-semibold font-Inter text-orange-500">Online</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-slate-4 leading-relaxed00">
                <Calendar size={14} /> Thứ 2, 12/08
              </div>
              <div className="flex items-center gap-1 border-l border-slate-100 pl-4 text-sm text-slate-4 leading-relaxed00">
                <Clock size={14} /> 18:30 - 20:00
              </div>
              <span className="rounded-lg bg-slate-50 px-2 py-1 text-[10px] text-slate-400">
                Sắp diễn ra
              </span>
            </div>
            <button className="rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-semibold font-Inter text-white shadow-lg shadow-orange-200 transition-all hover:bg-orange-600 active:scale-95">
              Tham gia học ➔
            </button>
          </div>
        </div>

        {/* Khối Thống kê bài tập */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            {
              label: "Bài tập đã hoàn thành",
              color: "bg-blue-50",
              iconColor: "bg-blue-500",
              icon: Trophy,
            },
            {
              label: "Bài tập đã hoàn thành",
              color: "bg-pink-50",
              iconColor: "bg-pink-500",
              icon: BookOpen,
            },
            {
              label: "Bài tập đã hoàn thành",
              color: "bg-purple-50",
              iconColor: "bg-purple-500",
              icon: Brain,
            },
          ].map((item, i) => (
            <div
              key={i}
              className={`flex flex-col items-center justify-center rounded-3xl p-8 ${item.color} dark:bg-opacity-10`}
            >
              <div
                className={`mb-4 rounded-xl ${item.iconColor} p-3 text-white shadow-md`}
              >
                <item.icon size={24} />
              </div>
              <p className="mb-2 text-center text-[11px] font-Inter text-slate-500 leading-relaxed">
                {item.label}
              </p>
              <p className="text-4xl font-semibold font-Inter text-slate-800 dark:text-white leading-relaxed">
                0
              </p>
            </div>
          ))}
        </div>

        {/* Các phần danh sách bên dưới */}
        <div className="grid grid-cols-1 gap-8 pt-4 md:grid-cols-2">
          <div className="space-y-4">
            <h3 className="font-semibold font-Inter text-slate-800 dark:text-white leading-tight leading-snug">
              Tiến độ học tập của bạn
            </h3>
            <div className="flex h-32 items-center justify-center rounded-2xl border-2 border-dashed border-slate-100 text-sm text-slate-3 leading-relaxed00 dark:border-slate-800">
              Đang cập nhật dữ liệu...
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold font-Inter text-slate-800 dark:text-white leading-tight leading-snug">
              Bài tập cần làm
            </h3>
            <div className="flex h-32 items-center justify-center rounded-2xl border-2 border-dashed border-slate-100 text-sm text-slate-3 leading-relaxed00 dark:border-slate-800">
              Chưa có bài tập mới
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



