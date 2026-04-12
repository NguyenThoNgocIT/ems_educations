"use client";
import React, { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  RotateCcw,
  Edit3,
  Trash2,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";

const RoomList = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [rooms, setRooms] = useState([]); // Giả định ban đầu chưa có dữ liệu

  return (
    <div className="space-y-6 font-sans">
      {/* --- THANH CÔNG CỤ: TÌM KIẾM & BỘ LỌC --- */}
      <div className="relative flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="flex flex-1 items-center gap-4">
          {/* Nút lọc */}
          <button
            onClick={() => setShowFilter(!showFilter)}
            className={`rounded-xl border p-2.5 transition-all ${
              showFilter
                ? "border-blue-200 bg-blue-50 text-indigo-700"
                : "border-slate-100 bg-slate-50 text-slate-600"
            }`}
          >
            <Filter size={20} />
          </button>

          {/* Ô tìm kiếm */}
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Tìm kiếm"
              className="w-full rounded-xl border border-slate-100 bg-slate-50 py-2.5 pr-10 pl-4 text-sm font-medium transition-all outline-none focus:ring-2 focus:ring-indigo-500/10 dark:border-slate-600 dark:bg-slate-800"
            />
            <Search
              size={18}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400"
            />
          </div>
        </div>

        {/* Nút Thêm phòng */}
        <button className="flex items-center gap-2 rounded-xl bg-[#22C55E] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-green-500/20 transition-all hover:bg-green-600 active:scale-95">
          <Plus size={18} /> Thêm phòng
        </button>

        {/* --- DROPDOWN BỘ LỌC CHI TIẾT --- */}
        {showFilter && (
          <div className="animate-in fade-in zoom-in-95 absolute top-full left-4 z-50 mt-2 w-80 rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl duration-200 dark:border-slate-700 dark:bg-slate-900">
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-wider text-slate-600">
                  Chọn lớp học
                </label>
                <div className="relative">
                  <select className="w-full appearance-none rounded-xl border border-slate-100 bg-slate-50 p-2.5 text-sm font-bold text-slate-4 leading-relaxed00 outline-none dark:border-slate-600 dark:bg-slate-800">
                    <option>Chọn lớp học</option>
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold tracking-wider text-slate-600">
                  Chọn giáo viên
                </label>
                <div className="relative">
                  <select className="w-full appearance-none rounded-xl border border-slate-100 bg-slate-50 p-2.5 text-sm font-bold text-slate-4 leading-relaxed00 outline-none dark:border-slate-600 dark:bg-slate-800">
                    <option>Chọn giáo viên</option>
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400"
                  />
                </div>
              </div>

              {/* Nhóm nút bấm */}
              <div className="flex gap-3 pt-2">
                <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#D66161] py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-red-600">
                  <RotateCcw size={14} /> Khôi phục
                </button>
                <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#3B82F6] py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-blue-600">
                  <Search size={14} /> Áp dụng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* --- NỘI DUNG: TRẠNG THÁI KHÔNG CÓ DỮ LIỆU --- */}
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-[32px] border border-slate-100 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
        {rooms.length === 0 ? (
          <div className="animate-in fade-in space-y-4 text-center duration-500">
            {/* Placeholder cho icon rỗng */}
            <div className="mx-auto mb-2 flex h-32 w-32 items-center justify-center rounded-full bg-slate-50 opacity-60 dark:bg-slate-800">
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-slate-300"
              >
                <path d="M21 8V21H3V8M1 3H23V8H1V3ZM10 12H14" />
              </svg>
            </div>
            <p className="text-sm font-bold tracking-tight text-slate-4 leading-relaxed00 leading-relaxed">
              Không có dữ liệu
            </p>
          </div>
        ) : (
          <div className="w-full p-6">
            {/* Table render logic ở đây (tương tự StudentList) */}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomList;



