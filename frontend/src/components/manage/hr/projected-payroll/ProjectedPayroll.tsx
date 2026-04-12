"use client";
import React, { useState, useMemo } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Search,
  ChevronDown,
} from "lucide-react";
import { projectedPayrollData } from "./projectedPayrollData";

const ProjectedPayroll = () => {
  // --- TRẠNG THÁI THỜI GIAN (Mặc định tháng hiện tại) ---
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // 1 - 12
  const [selectedYear, setSelectedYear] = useState(2026);
  const [searchQuery, setSearchQuery] = useState("");

  // Logic tính toán ngày bắt đầu và kết thúc của tháng đã chọn
  const dateRange = useMemo(() => {
    const start = `01/${selectedMonth.toString().padStart(2, "0")}/${selectedYear}`;
    const lastDay = new Date(selectedYear, selectedMonth, 0).getDate();
    const end = `${lastDay}/${selectedMonth.toString().padStart(2, "0")}/${selectedYear}`;
    return { start, end };
  }, [selectedMonth, selectedYear]);

  // Logic Tìm kiếm Giáo viên
  const filteredData = useMemo(() => {
    return projectedPayrollData.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery]);

  const formatVND = (value: number) =>
    new Intl.NumberFormat("vi-VN").format(value);

  return (
    <div className="space-y-6 px-2 font-sans md:px-0">
      {/* --- HEADER: BỘ LỌC THÁNG & TÌM KIẾM --- */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-[32px] border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="flex items-center gap-3">
          <h2 className="mr-4 text-xl leading-snug font-bold tracking-tight text-slate-900 dark:text-white">
            Dự kiến lương
          </h2>
          <div className="relative hidden w-64 md:block">
            <input
              type="text"
              placeholder="Tìm giáo viên..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-100 bg-slate-50 py-2.5 pr-10 pl-4 text-sm font-bold outline-none focus:border-indigo-500 dark:bg-slate-800"
            />
            <Search
              size={18}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400"
            />
          </div>
        </div>

        {/* BỘ CHỌN THÁNG CHUYÊN NGHIỆP (Đủ 12 tháng) */}
        <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-1.5 dark:bg-slate-800">
          <div className="relative">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="appearance-none rounded-xl bg-white px-4 py-2 pr-10 text-sm font-bold text-indigo-700 shadow-sm outline-none dark:bg-slate-700"
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  Tháng {i + 1}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-blue-400"
            />
          </div>

          <div className="relative">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="dark:text-slate-3 leading-relaxed00 appearance-none rounded-xl bg-white px-4 py-2 pr-10 text-sm font-bold text-slate-600 shadow-sm outline-none dark:bg-slate-700"
            >
              <option value={2025}>2025</option>
              <option value={2026}>2026</option>
              <option value={2027}>2027</option>
            </select>
            <ChevronDown
              size={14}
              className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-slate-400"
            />
          </div>

          <div className="cursor-pointer rounded-xl bg-blue-600 px-3 py-2 text-white shadow-lg shadow-blue-500/20 transition-all active:scale-95">
            <Calendar size={18} />
          </div>
        </div>
      </div>

      {/* --- CARD CHỨA BẢNG DỮ LIỆU --- */}
      <div className="overflow-hidden rounded-[32px] border border-slate-100 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1500px] border-collapse text-left">
            <thead>
              <tr className="border-b bg-slate-50/30 text-sm font-extrabold tracking-wider text-slate-900 dark:border-slate-700 dark:text-white">
                <th className="px-8 py-5">Giáo viên</th>
                <th className="px-6 py-5 text-center">Lương cơ bản</th>
                <th className="bg-blue-50/30 px-6 py-5 text-center text-indigo-700">
                  Lương thực tế
                </th>
                <th className="px-6 py-5 text-center">Lương dự kiến</th>
                <th className="px-6 py-5 text-center font-bold">
                  Tổng lương thực tế
                </th>
                <th className="px-6 py-5 text-center">Buổi thực tế</th>
                <th className="px-6 py-5 text-center text-green-600">
                  Tổng lương dự kiến
                </th>
                <th className="px-6 py-5 text-center">Buổi dự kiến</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-[13px] dark:divide-slate-800">
              {filteredData.map((item, index) => (
                <tr
                  key={index}
                  className="group transition-colors hover:bg-slate-50/20"
                >
                  <td className="cursor-pointer px-8 py-6 font-bold text-indigo-700 hover:underline">
                    {item.name}
                  </td>
                  <td className="px-6 py-6 text-center font-bold text-slate-600 dark:text-slate-400">
                    {formatVND(item.base)}
                  </td>
                  <td className="px-6 py-6 text-center">
                    <span className="rounded-lg bg-[#3B82F6] px-6 py-1.5 text-xs font-bold text-white shadow-md">
                      {formatVND(item.actualTeaching)}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <span className="rounded-lg bg-slate-400 px-6 py-1.5 text-xs font-bold text-white">
                      {formatVND(item.expectedTeaching)}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-center font-bold text-slate-900 dark:text-slate-200">
                    {formatVND(item.actualTotal)}
                  </td>
                  <td className="px-6 py-6 text-center font-bold text-indigo-600">
                    {item.actualSessions} buổi
                  </td>
                  <td className="px-6 py-6 text-center text-base leading-relaxed font-bold text-green-600 italic underline decoration-green-100">
                    {formatVND(item.expectedTotal)}
                  </td>
                  <td className="px-6 py-6 text-center font-bold text-slate-600">
                    {item.expectedSessions} buổi
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- FOOTER: HIỂN THỊ KHOẢNG NGÀY TỰ ĐỘNG --- */}
        <div className="flex items-center justify-end border-t bg-slate-50/10 p-6 dark:border-slate-700">
          <div className="flex flex-wrap items-center gap-6 text-[11px] font-bold tracking-widest text-slate-900 dark:text-slate-300">
            <div className="flex items-center gap-2 rounded-lg border border-slate-100 bg-white px-4 py-1.5 shadow-sm dark:bg-slate-800">
              <span className="text-slate-400">Chu kỳ:</span>
              <span className="text-indigo-700">{dateRange.start}</span>
              <span className="text-slate-300">→</span>
              <span className="text-indigo-700">{dateRange.end}</span>
            </div>
            <span>{filteredData.length} nhân sự</span>
            <div className="flex items-center gap-2">
              <button className="p-1 text-slate-300 transition-colors hover:text-indigo-700">
                <ChevronLeft size={18} />
              </button>
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 font-bold text-white shadow-lg">
                1
              </span>
              <button className="p-1 text-slate-300 transition-colors hover:text-indigo-700">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectedPayroll;
