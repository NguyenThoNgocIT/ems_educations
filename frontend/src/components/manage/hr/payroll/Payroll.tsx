"use client";
import React, { useState, useMemo } from "react";
import {
  Search,
  Plus,
  User,
  Edit3,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Calculator,
  Calendar,
  History,
  FileSpreadsheet,
} from "lucide-react";
import { payrollData } from "./payrollData";
import AddSalaryModal from "./AddSalaryModal";

const Payroll = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // --- LOGIC TÌM KIẾM ---
  const filteredData = useMemo(() => {
    return payrollData.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery]);

  // Hàm format tiền tệ VNĐ cho chuyên nghiệp
  const formatVND = (amount: number) =>
    new Intl.NumberFormat("vi-VN").format(amount);

  return (
    <div className="space-y-6 px-2 font-sans md:px-0">
      {/* --- TOOLBAR TRÊN CÙNG: MÀU SẮC ĐỒNG BỘ --- */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative">
          <input
            type="month"
            defaultValue="2026-01"
            className="text-slate-9 leading-relaxed00 w-44 rounded-2xl border border-slate-100 bg-white px-4 py-2.5 text-sm font-bold shadow-sm transition-all outline-none focus:ring-4 focus:ring-indigo-500/5 dark:bg-slate-800"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => alert("Đang tính toán lương...")}
            className="flex items-center gap-2 rounded-2xl bg-[#22C55E] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-green-500/20 transition-all hover:bg-green-600 active:scale-95"
          >
            <Calculator size={18} /> Tính lương ngay
          </button>
          <button
            onClick={() => alert("Đang sao chép lương tháng trước...")}
            className="flex items-center gap-2 rounded-2xl bg-[#3B82F6] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-600 active:scale-95"
          >
            <History size={18} /> Lương tháng trước
          </button>
          <button
            onClick={() => alert("Đã xuất file bảng lương!")}
            className="flex items-center gap-2 rounded-2xl bg-[#A855F7] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-purple-500/20 transition-all hover:bg-purple-600 active:scale-95"
          >
            <FileSpreadsheet size={18} /> Xuất Excel
          </button>
        </div>
      </div>

      {/* --- CARD CHỨA BẢNG LƯƠNG --- */}
      <div className="overflow-hidden rounded-[32px] border border-slate-100 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
        {/* --- HEADER: TÌM KIẾM --- */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 p-6 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <h2 className="mr-2 text-lg leading-normal leading-snug font-bold tracking-tight text-black dark:text-white">
              Chi tiết bảng lương
            </h2>
            <div className="relative hidden w-64 md:block">
              <input
                type="text"
                placeholder="Tìm nhân viên..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-100 bg-slate-50 py-2.5 pr-10 pl-4 text-sm font-bold outline-none dark:bg-slate-800"
              />
              <Search
                size={18}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 dark:text-slate-500"
              />
            </div>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-black active:scale-95"
          >
            <Plus size={18} /> Thêm dòng lương
          </button>
        </div>

        {/* --- TABLE: BẢNG TÍNH LƯƠNG --- */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px] border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/30 text-sm font-extrabold tracking-wider text-slate-900 dark:border-slate-700 dark:text-white">
                <th className="w-10 px-4 py-4 text-center">+</th>
                <th className="px-6 py-4">Nhân viên</th>
                <th className="px-6 py-4">Lương cơ bản</th>
                <th className="px-6 py-4">Lương giảng dạy</th>
                <th className="px-6 py-4">Tạm ứng</th>
                <th className="px-6 py-4 text-indigo-700">Thưởng</th>
                <th className="px-6 py-4 text-green-600">Thực lĩnh</th>
                <th className="px-6 py-4 text-center">Tác vụ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[13px] dark:divide-slate-700">
              {filteredData.map((item, index) => (
                <tr
                  key={index}
                  className="group transition-colors hover:bg-slate-50/20"
                >
                  <td className="px-4 py-6 text-center font-bold text-slate-400 dark:text-slate-600">
                    +
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        <User size={18} />
                      </div>
                      <div className="flex flex-col">
                        <span className="cursor-pointer font-bold text-indigo-700 hover:underline">
                          {item.name}
                        </span>
                        <span className="text-[10px] font-bold tracking-normal text-slate-400">
                          {item.id}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 font-bold text-slate-900 dark:text-slate-300">
                    {formatVND(item.baseSalary)}
                  </td>
                  <td className="px-6 py-6 font-bold text-slate-900 dark:text-slate-300">
                    {formatVND(item.teachingSalary)}
                  </td>
                  <td className="px-6 py-6 font-bold text-rose-500">
                    {item.advanceDeduction > 0
                      ? `-${formatVND(item.advanceDeduction)}`
                      : "0"}
                  </td>
                  <td className="px-6 py-6 font-bold text-indigo-600">
                    {formatVND(item.bonus)}
                  </td>
                  <td className="px-6 py-6 text-base leading-relaxed font-bold text-green-600 italic">
                    {formatVND(item.totalSalary)}
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center justify-center gap-4 opacity-0 transition-opacity group-hover:opacity-100">
                      <button className="text-slate-400 transition-colors hover:text-indigo-600 dark:text-slate-500">
                        <Edit3 size={18} />
                      </button>
                      <button className="text-slate-400 transition-colors hover:text-rose-500 dark:text-slate-500">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- FOOTER: ĐỒNG BỘ --- */}
        <div className="flex items-center justify-end border-t border-slate-100 bg-slate-50/10 p-6 text-[11px] font-bold text-slate-600 dark:border-slate-700">
          <span className="mr-6">Tổng nhân sự: {filteredData.length}</span>
          <div className="flex items-center gap-1">
            <button className="p-1 text-slate-400 transition-colors hover:text-indigo-700 dark:text-slate-500">
              <ChevronLeft size={16} />
            </button>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-lg shadow-indigo-500/30">
              1
            </span>
            <button className="p-1 text-slate-400 transition-colors hover:text-indigo-700 dark:text-slate-500">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <AddSalaryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};

export default Payroll;
