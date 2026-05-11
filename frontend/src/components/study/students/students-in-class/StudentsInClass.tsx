"use client";
import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Plus,
  Info,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  User,
  ChevronDown,
  RotateCcw,
} from "lucide-react";

// Import dữ liệu từ file đã tách
import { studentsInClassData } from "./studentsInClassData";

const StudentsInClass = () => {
  // --- TRẠNG THÁI HỆ THỐNG ---
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false); // Trạng thái Popover

  // --- LOGIC TÌM KIẾM & LỌC DỮ LIỆU ---
  const filteredData = useMemo(() => {
    return studentsInClassData.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSearch;
    });
  }, [searchQuery]);

  return (
    <div className="overflow-hidden rounded-[32px] border border-slate-100 bg-white font-sans shadow-sm dark:border-slate-700 dark:bg-slate-900">
      {/* --- HEADER: TÌM KIẾM & BỘ LỌC --- */}
      <div className="relative flex items-center gap-3 border-b border-slate-50 p-5 dark:border-slate-700">
        {/* Nút Lọc */}
        <button
          onClick={() => setShowFilter(!showFilter)}
          className={`rounded-xl border p-2.5 transition-all ${
            showFilter
              ? "border-indigo-500 bg-blue-50 text-indigo-700"
              : "border-slate-100 bg-slate-50 text-slate-400 hover:bg-slate-50"
          }`}
        >
          <Filter size={20} />
        </button>

        {/* POPOVER BỘ LỌC CHI TIẾT (Vertical Layout) */}
        {showFilter && (
          <div className="animate-in fade-in slide-in-from-top-2 absolute top-full left-5 z-[120] mt-2 w-[320px] rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl duration-200">
            <div className="space-y-5">
              {/* Lớp học */}
              <div className="space-y-2">
                <label className="text-slate-9 leading-relaxed00 text-sm font-semibold">
                  Lớp học
                </label>
                <div className="relative">
                  <select className="text-slate-4 leading-relaxed00 w-full appearance-none rounded-xl border border-slate-100 bg-white p-3 text-sm font-bold outline-none focus:border-indigo-500">
                    <option>Chọn lớp học</option>
                  </select>
                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-slate-300"
                  />
                </div>
              </div>

              {/* Cảnh báo */}
              <div className="space-y-2">
                <label className="text-slate-9 leading-relaxed00 text-sm font-semibold">
                  Cảnh báo
                </label>
                <div className="relative">
                  <select className="text-slate-4 leading-relaxed00 w-full appearance-none rounded-xl border border-slate-100 bg-white p-3 text-sm font-bold outline-none focus:border-indigo-500">
                    <option>Chọn trạng thái</option>
                  </select>
                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-slate-300"
                  />
                </div>
              </div>

              {/* Sắp xếp */}
              <div className="space-y-2">
                <label className="text-slate-9 leading-relaxed00 text-sm font-semibold">
                  Sắp xếp
                </label>
                <div className="relative">
                  <select className="text-slate-3 leading-relaxed00 w-full appearance-none rounded-xl border border-slate-100 bg-white p-3 text-sm font-bold outline-none focus:border-indigo-500">
                    <option>Sắp xếp</option>
                  </select>
                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-slate-200"
                  />
                </div>
              </div>

              {/* Nút hành động */}
              <div className="flex gap-3 pt-2">
                <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#E15B5B] py-2.5 text-xs font-semibold text-white transition-colors hover:bg-red-600">
                  <RotateCcw size={16} /> Khôi phục
                </button>
                <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#3B82F6] py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-500/10 transition-all active:scale-95">
                  <Search size={16} /> Áp dụng
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="max-sm relative w-full">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc mã học viên..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-100 bg-slate-50 py-2 pr-10 pl-4 text-sm font-bold transition-colors outline-none focus:border-indigo-500 dark:border-slate-600 dark:bg-slate-800"
          />
          <Search
            size={18}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-300"
          />
        </div>
      </div>

      {/* --- BẢNG DỮ LIỆU ĐẦY ĐỦ CÁC CỘT --- */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] border-collapse text-left">
          <thead>
            <tr className="border-b bg-slate-50/30 text-sm font-extrabold tracking-wider text-slate-900 dark:border-slate-700 dark:text-white">
              <th className="w-10 px-4 py-4"></th>
              <th className="px-4 py-4">Thông tin</th>
              <th className="px-4 py-4">Liên hệ</th>
              <th className="px-4 py-4">Loại học viên</th>
              <th className="px-4 py-4">Lớp</th>
              <th className="px-4 py-4">Loại lớp</th>
              <th className="px-4 py-4">Thông tin học</th>
              <th className="px-4 py-4 text-center">Cảnh báo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-[13px] dark:divide-slate-800">
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr
                  key={index}
                  className="group transition-colors hover:bg-slate-50/20"
                >
                  <td className="px-4 py-5 text-center text-slate-300">
                    <Plus size={14} />
                  </td>

                  {/* Thông tin học viên */}
                  <td className="px-4 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-slate-50 dark:bg-slate-800">
                        <User size={20} className="text-slate-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[13px] font-bold text-slate-900 dark:text-slate-200">
                          {item.name}
                        </span>
                        <span className="text-[10px] font-bold tracking-tight text-slate-400">
                          {item.id}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Liên hệ */}
                  <td className="px-4 py-5 text-[11px] font-bold text-slate-600 dark:text-slate-400">
                    <div className="space-y-0.5">
                      <div>
                        <span className="font-semibold">Điện thoại:</span>{" "}
                        {item.phone}
                      </div>
                      <div>
                        <span className="font-semibold">Email:</span>{" "}
                        {item.email}
                      </div>
                    </div>
                  </td>

                  {/* Loại học viên */}
                  <td className="px-4 py-5">
                    <span
                      className={`rounded px-2 py-1 text-[9px] font-semibold ${
                        item.studentType === "Học thử"
                          ? "bg-[#EAB308] text-white"
                          : "bg-[#22C55E] text-white"
                      }`}
                    >
                      {item.studentType}
                    </span>
                  </td>

                  {/* Lớp học */}
                  <td className="cursor-pointer px-4 py-5 text-xs font-semibold text-indigo-600 hover:underline">
                    {item.class}
                  </td>

                  {/* Loại lớp */}
                  <td className="px-4 py-5">
                    <span
                      className={`rounded px-2 py-1 text-[9px] font-semibold ${
                        item.classType === "Offline"
                          ? "bg-[#22C55E] text-white"
                          : "bg-[#EAB308] text-white"
                      }`}
                    >
                      {item.classType}
                    </span>
                  </td>

                  {/* Thông tin học (Số buổi) */}
                  <td className="px-4 py-5">
                    {item.paymentType && (
                      <div className="flex flex-col gap-1">
                        <span className="w-fit rounded bg-[#166534] px-2 py-1 text-[9px] font-semibold text-white">
                          {item.paymentType}
                        </span>
                        <div className="text-[10px] font-bold text-slate-600">
                          <div>Tổng: {item.totalSessions} buổi</div>
                          <div>Còn lại: {item.remainingSessions} buổi</div>
                        </div>
                      </div>
                    )}
                  </td>

                  {/* Cảnh báo (Action Icons) */}
                  <td className="px-4 py-5">
                    <div className="flex items-center justify-center gap-3 text-slate-400">
                      <Info
                        size={18}
                        className="cursor-pointer transition-colors hover:text-indigo-600"
                      />
                      <RefreshCw
                        size={18}
                        className="cursor-pointer transition-colors hover:text-green-500"
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="text-slate-4 leading-relaxed00 px-4 py-20 text-center text-sm font-bold italic"
                >
                  Không tìm thấy học viên phù hợp...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- FOOTER: TỔNG CỘNG --- */}
      <div className="flex items-center justify-end border-t bg-slate-50/20 p-5 dark:border-slate-700">
        <div className="flex items-center gap-4 text-[11px] font-semibold text-slate-900 dark:text-slate-300">
          <span>Tổng cộng: {filteredData.length}</span>
          <div className="flex items-center gap-1">
            <button className="p-1 text-slate-300 transition-colors hover:text-indigo-600">
              <ChevronLeft size={16} />
            </button>
            <span className="flex h-6 w-6 items-center justify-center rounded border border-blue-100 bg-blue-50 text-[10px] font-semibold text-indigo-700">
              1
            </span>
            <button className="p-1 text-slate-300 transition-colors hover:text-indigo-600">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentsInClass;
