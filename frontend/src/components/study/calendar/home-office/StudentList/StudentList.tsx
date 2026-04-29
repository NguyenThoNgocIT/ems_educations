"use client";
import React from "react";
import {
  Plus,
  Clock,
  AlertTriangle,
  FileText,
  Trash2,
  Award,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const StudentList = () => {
  // Dữ liệu mẫu chuẩn theo ảnh
  const students = [
    {
      id: "HV2408280001",
      name: "Nguyễn Minh Trang",
      phone: "0859051205",
      email: "demo3800@gmail.com",
      type: "Học thử",
      warning: "Không có",
      note: "df",
    },
  ];

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white font-sans shadow-sm dark:border-slate-700 dark:bg-slate-900">
      {/* --- HEADER: TIÊU ĐỀ & NÚT THÊM --- */}
      <div className="flex items-center justify-between border-b border-slate-50 p-6 dark:border-slate-700">
        <h2 className="text-lg leading-normal leading-snug font-bold tracking-tight text-slate-900 italic dark:text-white/90">
          Danh sách học viên
        </h2>
        <button className="flex items-center gap-2 rounded-xl bg-[#22C55E] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-green-500/10 transition-all hover:bg-green-600 active:scale-95">
          <Plus size={18} /> Thêm học viên
        </button>
      </div>

      {/* --- TABLE: DANH SÁCH HỌC VIÊN --- */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b bg-slate-50/50 text-sm font-extrabold tracking-wider text-slate-900 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white">
              <th className="px-6 py-4">Học viên</th>
              <th className="px-6 py-4">Liên hệ</th>
              <th className="px-6 py-4">Loại</th>
              <th className="px-6 py-4">Cảnh cáo</th>
              <th className="px-6 py-4">Ghi chú</th>
              <th className="px-6 py-4 text-center">Chức năng</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
            {students.map((student) => (
              <tr
                key={student.id}
                className="group transition-colors hover:bg-slate-50/30 dark:hover:bg-slate-800/30"
              >
                {/* Cột Học viên */}
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="cursor-pointer text-sm font-semibold text-indigo-700 hover:underline">
                      {student.name}
                    </span>
                    <span className="mt-0.5 text-[10px] font-bold text-slate-400">
                      Mã: {student.id}
                    </span>
                  </div>
                </td>

                {/* Cột Liên hệ */}
                <td className="px-6 py-5">
                  <div className="flex flex-col gap-0.5">
                    <div className="flex gap-1 text-xs font-medium text-slate-900 dark:text-slate-300">
                      <span className="font-semibold">Điện thoại:</span>{" "}
                      {student.phone}
                    </div>
                    <div className="flex gap-1 text-xs font-medium text-slate-900 dark:text-slate-300">
                      <span className="font-semibold">Mail:</span>{" "}
                      {student.email}
                    </div>
                  </div>
                </td>

                {/* Cột Loại (Badge) */}
                <td className="px-6 py-5">
                  <span className="rounded-xl bg-[#BE4A53] px-3 py-1.5 text-[10px] font-semibold text-white italic shadow-sm">
                    {student.type}
                  </span>
                </td>

                {/* Cột Cảnh cáo & Ghi chú */}
                <td className="px-6 py-5 text-xs font-bold text-slate-600">
                  {student.warning}
                </td>
                <td className="px-6 py-5 text-xs font-bold text-slate-600">
                  {student.note}
                </td>

                {/* Cột Chức năng (Icon Group) */}
                <td className="px-6 py-5">
                  <div className="flex items-center justify-center gap-4">
                    <button
                      title="Lịch sử"
                      className="text-purple-500 transition-transform hover:scale-110"
                    >
                      <Clock size={18} />
                    </button>
                    <button
                      title="Cảnh báo"
                      className="text-amber-500 transition-transform hover:scale-110"
                    >
                      <AlertTriangle size={18} />
                    </button>
                    <button
                      title="Ghi chú"
                      className="text-green-500 transition-transform hover:scale-110"
                    >
                      <FileText size={18} />
                    </button>
                    <button
                      title="Xóa"
                      className="text-rose-500 transition-transform hover:scale-110"
                    >
                      <Trash2 size={18} />
                    </button>
                    <button
                      title="Chứng chỉ"
                      className="text-indigo-600 transition-transform hover:scale-110"
                    >
                      <Award size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- FOOTER: PHÂN TRANG --- */}
      <div className="flex flex-col items-center justify-end gap-6 border-t bg-slate-50/30 p-6 md:flex-row dark:border-slate-700 dark:bg-slate-800/20">
        <div className="flex items-center gap-4 text-xs font-semibold text-slate-900 dark:text-slate-300">
          <span>Tổng cộng: {students.length}</span>
          <div className="flex items-center gap-1">
            <button className="cursor-not-allowed p-1 text-slate-300">
              <ChevronLeft size={16} />
            </button>
            <span className="flex h-6 w-6 items-center justify-center rounded-md border border-blue-100 bg-blue-50 text-indigo-700">
              1
            </span>
            <button className="cursor-not-allowed p-1 text-slate-300">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentList;
