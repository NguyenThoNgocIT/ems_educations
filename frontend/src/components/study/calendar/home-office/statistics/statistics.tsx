"use client";
import React, { useState } from "react";

const AttendanceSummary = () => {
  const [activeTab, setActiveTab] = useState("Điểm danh");

  // Dữ liệu mẫu chuẩn theo ảnh
  const sessions = [
    {
      id: 2,
      date: "31/01/2026",
      stats: [
        { label: "Có mặt", value: "0/0" },
        { label: "Vắng có phép", value: "0/0" },
        { label: "Vắng không phép", value: "0/0" },
        { label: "Đi muộn", value: "0/0" },
        { label: "Về sớm", value: "0/0" },
      ],
    },
    {
      id: 1,
      date: "30/01/2026",
      stats: [
        { label: "Có mặt", value: "0/0" },
        { label: "Vắng có phép", value: "0/0" },
        { label: "Vắng không phép", value: "0/0" },
        { label: "Đi muộn", value: "0/0" },
        { label: "Về sớm", value: "0/0" },
      ],
    },
  ];

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      {/* --- HỆ THỐNG TABS --- */}
      <div className="mb-8 flex w-fit gap-1 rounded-xl bg-slate-50 p-1 dark:bg-slate-800">
        {["Điểm danh", "Làm bài tập", "Học viên"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-lg px-6 py-2 text-sm font-bold transition-all ${
              activeTab === tab
                ? "bg-white text-indigo-700 shadow-sm dark:bg-slate-700"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* --- DANH SÁCH THỐNG KÊ THEO BUỔI --- */}
      <div className="space-y-12">
        {sessions.map((session) => (
          <div key={session.id} className="space-y-6">
            {/* Tiêu đề buổi học */}
            <h3 className="flex items-center gap-2 text-[15px] font-bold text-slate-900 dark:text-white/90 leading-tight leading-snug">
              Buổi {session.id} - {session.date}
            </h3>

            {/* Các vòng tròn chỉ số */}
            <div className="flex flex-wrap gap-8 md:gap-16">
              {session.stats.map((stat, index) => (
                <div
                  key={index}
                  className="group flex flex-col items-center gap-3"
                >
                  {/* Vòng tròn biểu đồ */}
                  <div className="relative flex h-24 w-24 items-center justify-center">
                    {/* Ring background nhạt */}
                    <div className="absolute inset-0 rounded-full border-[6px] border-slate-50 dark:border-slate-700" />
                    {/* Con số trung tâm */}
                    <span className="text-xl font-bold text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-slate-200 leading-snug">
                      {stat.value}
                    </span>
                  </div>

                  {/* Nhãn bên dưới */}
                  <span className="text-xs font-extrabold tracking-tight text-slate-600 dark:text-slate-400">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendanceSummary;



