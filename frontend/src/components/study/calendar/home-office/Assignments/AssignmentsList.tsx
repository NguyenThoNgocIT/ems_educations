"use client";
import React from "react";
import {
  Plus,
  Edit3,
  Trash2,
  UserCheck,
  ArrowUpDown,
  CheckSquare,
} from "lucide-react";

const assignmentsData = [
  {
    id: 1,
    order: 1,
    session: "Buổi 1",
    title: "sdf",
    type: "Giải đề",
    minScore: 32,
    startDate: "18/02/2026",
    endDate: "26/02/2026",
    content: "dsdcsdc",
    teacher: "Trinh Le",
    creator: "Admin",
    note: "",
  },
];

export default function AssignmentsList() {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white font-sans shadow-sm dark:border-slate-700 dark:bg-slate-900">
      {/* --- HEADER: TIÊU ĐỀ & NÚT TÁC VỤ --- */}
      <div className="flex items-center justify-between border-b border-slate-50 p-6 dark:border-slate-700">
        <h2 className="text-lg leading-normal leading-snug font-bold tracking-tight text-slate-900 italic dark:text-white/90">
          Danh sách bài tập
        </h2>
        <div className="flex gap-3">
          <button className="rounded-xl bg-blue-500 px-4 py-2 text-xs font-semibold text-white shadow-md transition-all hover:bg-blue-600 active:scale-95">
            Bắt buộc tuần tự
          </button>
          <button className="flex items-center gap-2 rounded-xl bg-[#22C55E] px-4 py-2 text-xs font-semibold text-white shadow-md shadow-green-500/10 transition-all hover:bg-green-600 active:scale-95">
            <Plus size={16} /> Thêm bài tập
          </button>
        </div>
      </div>

      {/* --- TABLE: DANH SÁCH CHI TIẾT --- */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1200px] border-collapse text-left">
          <thead>
            <tr className="border-b bg-slate-50/50 text-sm font-extrabold tracking-wider text-slate-900 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white">
              <th className="w-12 px-4 py-4 text-center">
                <CheckSquare size={14} />
              </th>
              <th className="px-4 py-4">Thứ tự</th>
              <th className="px-4 py-4">Buổi của bài tập</th>
              <th className="px-4 py-4">Tên bài</th>
              <th className="px-4 py-4">Loại bài tập</th>
              <th className="px-4 py-4">Điểm sàn</th>
              <th className="px-4 py-4">Bắt đầu</th>
              <th className="px-4 py-4">Kết thúc</th>
              <th className="px-4 py-4">Nội dung</th>
              <th className="px-4 py-4">GV chấm bài</th>
              <th className="px-4 py-4">Người tạo</th>
              <th className="px-4 py-4">Ghi chú</th>
              <th className="px-4 py-4 text-center">Chức năng</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
            {assignmentsData.map((item) => (
              <tr
                key={item.id}
                className="group transition-colors hover:bg-slate-50/30 dark:hover:bg-slate-800/30"
              >
                <td className="px-4 py-5 text-center">
                  <input type="checkbox" className="rounded border-slate-300" />
                </td>
                <td className="text-slate-6 leading-relaxed00 px-4 py-5 text-sm font-bold">
                  {item.order}
                </td>
                <td className="text-slate-6 leading-relaxed00 px-4 py-5 text-sm font-bold">
                  {item.session}
                </td>
                <td className="cursor-pointer px-4 py-5 text-sm font-bold text-indigo-700 hover:underline">
                  {item.title}
                </td>

                {/* Loại bài tập (Badge xanh lá nhạt) */}
                <td className="px-4 py-5">
                  <span className="rounded-lg border border-green-200 bg-green-50 px-3 py-1 text-[10px] font-bold text-green-600">
                    {item.type}
                  </span>
                </td>

                <td className="text-slate-6 leading-relaxed00 px-4 py-5 text-sm font-bold">
                  {item.minScore}
                </td>
                <td className="text-slate-6 leading-relaxed00 px-4 py-5 text-sm font-bold">
                  {item.startDate}
                </td>
                <td className="text-slate-6 leading-relaxed00 px-4 py-5 text-sm font-bold">
                  {item.endDate}
                </td>

                {/* Nội dung (Màu hồng đặc trưng) */}
                <td className="px-4 py-5 text-sm font-bold text-pink-500">
                  {item.content}
                </td>

                <td className="text-slate-6 leading-relaxed00 px-4 py-5 text-sm font-bold">
                  {item.teacher}
                </td>
                <td className="text-slate-6 leading-relaxed00 px-4 py-5 text-sm font-bold">
                  {item.creator}
                </td>
                <td className="text-slate-4 leading-relaxed00 px-4 py-5 text-sm font-bold italic">
                  {item.note || "Trống"}
                </td>

                {/* Bộ icon chức năng chuẩn */}
                <td className="px-4 py-5">
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
                    <button
                      title="Phân công"
                      className="text-green-600 transition-transform hover:scale-110"
                    >
                      <UserCheck size={18} />
                    </button>
                    <button
                      title="Sắp xếp"
                      className="text-purple-600 transition-transform hover:scale-110"
                    >
                      <ArrowUpDown size={18} />
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
