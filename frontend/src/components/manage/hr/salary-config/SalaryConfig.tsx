"use client";
import React from "react";
import { Edit3, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

const salaryData = [
  {
    id: "110924-1",
    name: "Bùi Đức Việt",
    role: "",
    amount: "1,000,000",
    addedAt: "13/09/2024",
    note: "",
  },
  {
    id: "100924-25",
    name: "Nguyễn Phi Long",
    role: "",
    amount: "1,000,000",
    addedAt: "22/10/2025",
    note: "",
  },
  {
    id: "250924-2",
    name: "Nguyễn Yến Nhi",
    role: "",
    amount: "0",
    addedAt: "01/10/2025",
    note: "",
  },
];

const SalaryConfig = () => {
  return (
    <div className="overflow-hidden rounded-[32px] border border-slate-100 bg-white font-sans shadow-sm dark:border-slate-700 dark:bg-slate-900">
      {/* --- BẢNG CẤU HÌNH LƯƠNG --- */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] border-collapse text-left">
          <thead>
            <tr className="border-b bg-slate-50/30 text-sm font-extrabold tracking-wider text-slate-900 dark:border-slate-700 dark:text-white">
              <th className="w-32 px-6 py-4">Mã</th>
              <th className="px-6 py-4">Họ tên</th>
              <th className="px-6 py-4 text-center">Chức vụ</th>
              <th className="px-6 py-4">Mức lương</th>
              <th className="px-6 py-4">Thêm lúc</th>
              <th className="px-6 py-4">Ghi chú</th>
              <th className="w-28 px-6 py-4 text-center"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-[13px] dark:divide-slate-800">
            {salaryData.map((item, index) => (
              <tr
                key={index}
                className="group transition-colors hover:bg-slate-50/20"
              >
                {/* Mã nhân viên */}
                <td className="px-6 py-6 font-bold text-slate-900 dark:text-slate-200">
                  {item.id}
                </td>

                {/* Họ tên (Link xanh dương) */}
                <td className="px-6 py-6">
                  <span className="cursor-pointer font-bold text-indigo-700 hover:underline">
                    {item.name}
                  </span>
                </td>

                <td className="px-6 py-6 text-center font-bold text-slate-600 italic">
                  {item.role}
                </td>

                {/* Mức lương (Màu xanh lá rực rỡ) */}
                <td className="px-6 py-6 font-bold text-green-600">
                  {item.amount}
                </td>

                {/* Thời gian thêm */}
                <td className="px-6 py-6 font-bold text-slate-600">
                  {item.addedAt}
                </td>

                <td className="px-6 py-6 font-medium text-slate-400">
                  {item.note}
                </td>

                {/* Chức năng (Sửa & Xóa) */}
                <td className="px-6 py-6">
                  <div className="flex items-center justify-center gap-4">
                    <button
                      title="Sửa"
                      className="text-slate-900 transition-colors hover:text-indigo-600 dark:text-slate-300"
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

      {/* --- FOOTER PHÂN TRANG --- */}
      <div className="flex items-center justify-end border-t bg-slate-50/20 p-6 dark:border-slate-700">
        <div className="flex items-center gap-4 text-[11px] font-bold text-slate-900 dark:text-slate-300">
          <span>Tổng cộng: {salaryData.length}</span>
          <div className="flex items-center gap-1">
            <button className="cursor-not-allowed p-1 text-slate-300">
              <ChevronLeft size={16} />
            </button>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-[11px] text-indigo-700">
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

export default SalaryConfig;
