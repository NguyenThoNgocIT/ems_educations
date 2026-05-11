"use client";
import React from "react";
import {
  Plus,
  Edit3,
  Trash2,
  Settings,
  FileInput,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const Gradebook = () => {
  // Dữ liệu mẫu học viên
  const students = [
    {
      id: "HV2408280001",
      name: "Nguyễn Minh Trang",
      quizScore: "-",
      essayScore: "-",
    },
  ];

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white font-sans shadow-sm dark:border-slate-700 dark:bg-slate-900">
      {/* --- HEADER ACTIONS: BỘ NÚT ĐIỀU KHIỂN --- */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-50 p-6 dark:border-slate-700">
        <div className="flex items-center gap-2">
          {/* Nút Tạo mới (Xanh lá) */}
          <button className="flex items-center gap-2 rounded-xl bg-[#22C55E] px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-green-600 active:scale-95">
            <Plus size={18} /> Bảng điểm mới
          </button>

          {/* Dropdown chọn bảng điểm */}
          <div className="relative min-w-[150px]">
            <select className="w-full cursor-pointer appearance-none rounded-xl border border-slate-100 bg-slate-50 p-2.5 text-sm font-bold outline-none dark:border-slate-600 dark:bg-slate-800">
              <option>d</option>
            </select>
          </div>

          {/* Nút Sửa (Vàng) & Xóa (Đỏ) */}
          <button className="rounded-xl bg-[#EAB308] p-2.5 text-white shadow-sm transition-all hover:bg-yellow-600">
            <Edit3 size={18} />
          </button>
          <button className="rounded-xl bg-[#EF4444] p-2.5 text-white shadow-sm transition-all hover:bg-red-600">
            <Trash2 size={18} />
          </button>
        </div>

        <div className="flex items-center gap-3">
          {/* Nút Cấu hình (Cam) */}
          <button className="flex items-center gap-2 rounded-xl bg-[#F97316] px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-orange-600 active:scale-95">
            Cấu hình bảng điểm
          </button>
          {/* Nút Nhập điểm (Xanh dương) */}
          <button className="flex items-center gap-2 rounded-xl bg-[#3B82F6] px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-blue-600 active:scale-95">
            Nhập điểm
          </button>
        </div>
      </div>

      {/* --- TABLE: DANH SÁCH ĐIỂM SỐ --- */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b bg-slate-50/50 text-sm font-extrabold tracking-wider text-slate-900 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white">
              <th className="px-8 py-4">Học viên</th>
              <th className="px-8 py-4">Trắc nghiệm</th>
              <th className="px-8 py-4">Tự luận</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
            {students.map((student) => (
              <tr
                key={student.id}
                className="group transition-colors hover:bg-slate-50/30"
              >
                <td className="px-8 py-6">
                  <div className="flex flex-col">
                    <span className="text-[15px] font-bold text-slate-900 dark:text-white/90">
                      {student.name}
                    </span>
                    <span className="mt-1 text-[10px] font-bold tracking-wider text-slate-400">
                      {student.id}
                    </span>
                  </div>
                </td>
                <td className="text-slate-4 leading-relaxed00 px-8 py-6 text-sm font-bold">
                  {student.quizScore}
                </td>
                <td className="text-slate-4 leading-relaxed00 px-8 py-6 text-sm font-bold">
                  {student.essayScore}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- FOOTER: PHÂN TRANG --- */}
      <div className="flex justify-end border-t bg-slate-50/30 p-6 dark:border-slate-700 dark:bg-slate-800/20">
        <div className="flex items-center gap-4 text-xs font-semibold text-slate-900 dark:text-slate-300">
          <span>Tổng cộng: {students.length}</span>
          <div className="flex items-center gap-1">
            <button className="cursor-not-allowed p-1 text-slate-300 transition-colors">
              <ChevronLeft size={16} />
            </button>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-indigo-700 shadow-sm">
              1
            </span>
            <button className="cursor-not-allowed p-1 text-slate-300 transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gradebook;
