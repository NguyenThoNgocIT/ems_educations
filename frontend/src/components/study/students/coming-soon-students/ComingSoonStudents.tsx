"use client";
import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Plus,
  Info,
  User,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  RotateCcw,
  Minus,
} from "lucide-react";
import { comingSoonData } from "./comingSoonData";

const ComingSoonStudents = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [remainingLimit, setRemainingLimit] = useState(5);

  // --- LOGIC LỌC KÉP HOẠT ĐỘNG ---
  const filteredData = useMemo(() => {
    return comingSoonData.filter((item) => {
      // 1. Lọc theo tên hoặc mã
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase());

      // 2. Lọc theo số buổi còn lại (Chỉ hiện những người có buổi học <= hạn mức chọn)
      const matchSessions = item.remainingSessions <= remainingLimit;

      return matchSearch && matchSessions;
    });
  }, [searchQuery, remainingLimit]); // Lắng nghe cả 2 thay đổi

  // --- HÀM KHÔI PHỤC BỘ LỌC ---
  const handleReset = () => {
    setSearchQuery("");
    setRemainingLimit(5);
    setShowFilter(false);
  };

  return (
    <div className="overflow-hidden rounded-[32px] border border-slate-100 bg-white font-sans shadow-sm dark:border-slate-700 dark:bg-slate-900">
      {/* --- HEADER & POPOVER FILTER --- */}
      <div className="relative flex items-center gap-3 border-b border-slate-50 p-5 dark:border-slate-700">
        <button
          onClick={() => setShowFilter(!showFilter)}
          className={`rounded-xl border p-2.5 transition-all ${
            showFilter
              ? "border-indigo-500 bg-blue-50 text-indigo-700"
              : "border-slate-100 bg-slate-50 text-slate-400"
          }`}
        >
          <Filter size={20} />
        </button>

        {showFilter && (
          <div className="animate-in fade-in slide-in-from-top-2 absolute top-full left-5 z-[120] mt-2 w-[340px] rounded-2xl border border-slate-50 bg-white p-6 shadow-2xl duration-200">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-slate-9 leading-relaxed00 text-sm font-bold">
                  Sắp xếp
                </label>
                <div className="relative">
                  <select className="text-slate-4 leading-relaxed00 w-full appearance-none rounded-xl border border-slate-100 bg-white p-3 text-sm font-bold outline-none">
                    <option>Sắp xếp</option>
                  </select>
                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-slate-300"
                  />
                </div>
              </div>

              {/* BỘ TĂNG GIẢM SỐ BUỔI */}
              <div className="space-y-2">
                <label className="text-slate-9 leading-relaxed00 text-sm font-bold">
                  Buổi còn lại (Dưới mức này)
                </label>
                <div className="flex items-center overflow-hidden rounded-xl border border-slate-100 bg-white">
                  <button
                    onClick={() =>
                      setRemainingLimit(Math.max(0, remainingLimit - 1))
                    }
                    className="border-r p-3 text-slate-400 hover:bg-slate-50"
                  >
                    <Minus size={16} />
                  </button>
                  <div className="w-full text-center text-sm font-bold text-indigo-700">
                    {remainingLimit} buổi
                  </div>
                  <button
                    onClick={() => setRemainingLimit(remainingLimit + 1)}
                    className="border-l p-3 text-slate-400 hover:bg-slate-50"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleReset}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#E15B5B] py-2.5 text-xs font-bold text-white transition-all active:scale-95"
                >
                  <RotateCcw size={16} /> Khôi phục
                </button>
                <button
                  onClick={() => setShowFilter(false)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#3B82F6] py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                >
                  <Search size={16} /> Áp dụng
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="relative w-full max-w-sm">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-100 bg-slate-50 py-2 pr-10 pl-4 text-sm font-bold outline-none dark:bg-slate-800"
          />
          <Search
            size={18}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-300"
          />
        </div>
      </div>

      {/* --- TABLE DỮ LIỆU --- */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] border-collapse text-left">
          {/* ... Phần table header giữ nguyên ... */}
          <thead>
            <tr className="border-b bg-slate-50/30 text-sm font-extrabold tracking-wider text-slate-900 dark:border-slate-700 dark:text-white">
              <th className="w-10 px-4 py-4 text-center">+</th>
              <th className="px-6 py-4">Thông tin</th>
              <th className="px-6 py-4">Liên hệ</th>
              <th className="px-6 py-4 text-center">Giới tính</th>
              <th className="px-6 py-4">Lớp học</th>
              <th className="px-6 py-4 text-center">Buổi còn lại</th>
              <th className="w-10 px-4 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-[13px] dark:divide-slate-800">
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr
                  key={index}
                  className="group transition-colors hover:bg-slate-50/20"
                >
                  <td className="px-4 py-5 text-center font-bold text-slate-300">
                    +
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-slate-50">
                        <User size={20} className="text-slate-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 dark:text-slate-200">
                          {item.name}
                        </span>
                        <span className="text-[10px] font-bold tracking-tight text-slate-400">
                          {item.id}
                        </span>
                      </div>
                    </div>
                  </td>
                  {/* ... Các cột khác ... */}
                  <td className="px-6 py-5 text-[11px] font-bold text-slate-600 dark:text-slate-400">
                    <div className="space-y-0.5">
                      <div>
                        <span className="font-bold">Điện thoại:</span>{" "}
                        {item.phone}
                      </div>
                      <div>
                        <span className="font-bold">Email:</span> {item.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    {item.gender && (
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-bold text-white ${item.gender === "Nữ" ? "bg-[#22C55E]" : "bg-[#3B82F6]"}`}
                      >
                        {item.gender}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-5 font-bold text-indigo-600">
                    {item.class}
                  </td>

                  {/* Highlight số buổi thực tế */}
                  <td className="px-6 py-5 text-center font-bold text-rose-500 italic underline decoration-rose-100">
                    {item.remainingSessions}
                  </td>

                  <td className="px-4 py-5">
                    <Info
                      size={18}
                      className="cursor-pointer text-slate-400 hover:text-indigo-600"
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="text-slate-4 leading-relaxed00 px-6 py-20 text-center text-sm font-bold italic"
                >
                  Không có học viên nào còn dưới {remainingLimit} buổi...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* FOOTER ĐÃ CẬP NHẬT TỔNG SỐ THẬT */}
      <div className="flex items-center justify-end border-t bg-slate-50/20 p-5 dark:border-slate-700">
        <div className="flex items-center gap-4 text-[11px] font-bold text-slate-900 dark:text-slate-300">
          <span>Tổng cộng: {filteredData.length}</span>
          <div className="flex items-center gap-1">
            <button className="p-1 text-slate-300 hover:text-indigo-600">
              <ChevronLeft size={16} />
            </button>
            <span className="flex h-6 w-6 items-center justify-center rounded border border-blue-100 bg-blue-50 text-[10px] font-bold text-indigo-700">
              1
            </span>
            <button className="p-1 text-slate-300 hover:text-indigo-600">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonStudents;
