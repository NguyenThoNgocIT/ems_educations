"use client";
import React from "react";
import { ChevronDown, Edit3 } from "lucide-react";

const AttendanceTable = () => {
  // Dữ liệu mẫu học viên
  const students = [
    { id: "HV001", name: "Nguyễn Minh Trang" },
    { id: "HV002", name: "Trần Văn Nam" },
  ];

  // Dữ liệu mẫu buổi học
  const sessions = [
    { id: 1, time: "11:00 - 12:00", date: "30/01/2026", active: false },
    { id: 2, time: "10:00 - 11:00", date: "31/01/2026", active: true },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white font-sans shadow-sm dark:border-slate-700 dark:bg-white/[0.03]">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            {/* --- HÀNG HEADER CHÍNH --- */}
            <tr className="border-b bg-slate-50/50 dark:border-slate-700 dark:bg-white/[0.03]">
              <th className="w-[300px] border-r px-8 py-6 text-center text-lg font-bold text-slate-900 dark:border-slate-700 dark:text-white/90 leading-normal">
                Học viên
              </th>

              {sessions.map((session) => (
                <th
                  key={session.id}
                  className={`min-w-[300px] px-6 py-4 text-center transition-colors ${
                    session.active ? "bg-blue-100/50 dark:bg-blue-900/20" : ""
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex w-full items-center justify-between px-4">
                      <span className="text-[15px] font-bold text-slate-900 dark:text-white/90">
                        Buổi {session.id} ({session.time})
                      </span>
                      {/* Nút điểm danh nhanh */}
                      <button className="rounded-xl bg-slate-200 px-3 py-1.5 text-[10px] font-semibold text-slate-600 transition-all hover:bg-slate-300 dark:border dark:border-slate-700 dark:bg-slate-700 dark:text-slate-300">
                        Điểm danh tất cả
                      </button>
                    </div>
                    <span className="text-xs font-semibold text-slate-400">
                      ({session.date})
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {students.map((student) => (
              <tr
                key={student.id}
                className="transition-colors hover:bg-slate-50/30"
              >
                {/* Cột Tên Học Viên */}
                <td className="border-r px-8 py-6 dark:border-slate-700">
                  <span className="text-lg font-bold text-slate-900 dark:text-slate-200 leading-normal">
                    {student.name}
                  </span>
                </td>

                {/* Các cột điểm danh theo buổi */}
                {sessions.map((session) => (
                  <td
                    key={`${student.id}-${session.id}`}
                    className={`px-6 py-6 text-center ${
                      session.active ? "bg-blue-50/30 dark:bg-blue-900/10" : ""
                    }`}
                  >
                    <div className="flex items-center justify-center gap-3">
                      {/* Dropdown chọn trạng thái */}
                      <div className="relative w-full max-w-[220px]">
                        <select className="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pr-10 pl-4 text-sm font-semibold text-slate-6 leading-relaxed00 transition-all outline-none focus:ring-2 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-white/[0.03]">
                          <option>Chưa điểm danh</option>
                          <option>Có mặt</option>
                          <option>Vắng có phép</option>
                          <option>Vắng không phép</option>
                        </select>
                        <ChevronDown
                          size={16}
                          className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-slate-400"
                        />
                      </div>

                      {/* Icon Ghi chú/Chỉnh sửa */}
                      <button className="rounded-xl bg-amber-100/50 p-2 text-amber-600 transition-colors hover:bg-amber-100 dark:border dark:border-slate-700">
                        <Edit3 size={16} strokeWidth={3} />
                      </button>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceTable;

