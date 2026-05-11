"use client";
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TeacherAttendance = () => {
  // Dữ liệu mẫu giáo viên chuẩn theo ảnh
  const attendanceData = [
    {
      id: 1,
      name: "Phan Thành Châu 1",
      date: "30-01-2026",
      time: "11:00 - 12:00",
      status: false,
    },
    {
      id: 2,
      name: "Trinh Le",
      date: "31-01-2026",
      time: "10:00 - 11:00",
      status: false,
    },
  ];

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white font-sans shadow-sm dark:border-slate-700 dark:bg-slate-900">
      {/* --- BẢNG DANH SÁCH ĐIỂM DANH --- */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b bg-slate-50/30 text-sm font-extrabold tracking-wider text-slate-900 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white">
              <th className="px-8 py-5">Giáo viên</th>
              <th className="px-8 py-5">Ngày</th>
              <th className="px-8 py-5">Thời gian học</th>
              <th className="px-8 py-5 text-center">Điểm danh</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
            {attendanceData.map((item) => (
              <tr
                key={item.id}
                className="group transition-colors hover:bg-slate-50/20"
              >
                {/* Tên giáo viên (Màu xanh dương đặc trưng) */}
                <td className="cursor-pointer px-8 py-6 text-[15px] font-bold text-indigo-700 hover:underline">
                  {item.name}
                </td>

                {/* Ngày dạy */}
                <td className="dark:text-slate-3 leading-relaxed00 px-8 py-6 text-sm font-bold text-slate-600">
                  {item.date}
                </td>

                {/* Khung giờ dạy */}
                <td className="dark:text-slate-3 leading-relaxed00 px-8 py-6 text-sm font-bold text-slate-600">
                  {item.time}
                </td>

                {/* Nút gạt điểm danh (Toggle Switch) */}
                <td className="px-8 py-6">
                  <div className="flex justify-center">
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        checked={item.status}
                        readOnly
                      />
                      <div className="peer h-6 w-11 rounded-full bg-slate-200 peer-checked:bg-blue-600 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white dark:bg-slate-700"></div>
                      {/* Icon X nhỏ bên trong nút gạt khi tắt */}
                      {!item.status && (
                        <span className="pointer-events-none absolute right-2 text-[10px] font-bold text-slate-400">
                          ✕
                        </span>
                      )}
                    </label>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- FOOTER: TỔNG CỘNG & PHÂN TRANG --- */}
      <div className="flex items-center justify-end border-t bg-slate-50/20 p-6 dark:border-slate-700">
        <div className="flex items-center gap-6 text-xs font-bold text-slate-900 dark:text-slate-300">
          <span>Tổng cộng: {attendanceData.length}</span>
          <div className="flex items-center gap-2">
            <button className="cursor-not-allowed p-1 text-slate-300">
              <ChevronLeft size={18} />
            </button>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-indigo-700 shadow-sm">
              1
            </span>
            <button className="cursor-not-allowed p-1 text-slate-300">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherAttendance;
