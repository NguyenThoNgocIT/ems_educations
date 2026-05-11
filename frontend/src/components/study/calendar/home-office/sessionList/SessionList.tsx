"use client";
import React from "react";

const SessionList = () => {
  // Dữ liệu mẫu chuẩn theo ảnh
  const sessions = [
    {
      id: 1,
      date: "30/01/2026",
      time: "11:00 - 12:00",
    },
    {
      id: 2,
      date: "31/01/2026",
      time: "10:00 - 11:00",
    },
  ];

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-8 font-sans shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="flex flex-wrap gap-12 md:gap-20">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="group flex cursor-pointer flex-col items-center gap-4"
          >
            {/* Vòng tròn số thứ tự buổi học */}
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#007BFF] text-lg font-bold text-white shadow-md transition-transform duration-200 group-hover:scale-110 leading-normal">
              {session.id}
            </div>

            {/* Thông tin thời gian */}
            <div className="space-y-1 text-center">
              <p className="text-[15px] font-bold tracking-tight text-slate-900 dark:text-white leading-relaxed">
                {session.date}
              </p>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-4 leading-relaxed00 leading-relaxed">
                {session.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SessionList;


