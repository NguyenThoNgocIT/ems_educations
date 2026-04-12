"use client";
import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Edit3,
  Calendar as CalendarIcon,
  Trash2,
} from "lucide-react";

interface CalendarHeaderProps {
  currentRange: string;
  viewType: string;
  isEditing: boolean;
  unlearnedCount: number;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onViewChange: (view: string) => void;
  onAddEvent: () => void;
  onToggleEdit: () => void;
  onCreateSchedule: () => void;
  onDeleteUnlearned: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentRange,
  viewType,
  isEditing,
  unlearnedCount,
  onPrev,
  onNext,
  onToday,
  onViewChange,
  onAddEvent,
  onToggleEdit,
  onCreateSchedule,
  onDeleteUnlearned,
}) => {
  return (
    <div className="flex flex-col gap-5">
      {/* --- HÀNG 1: BỘ NÚT TÁC VỤ (ACTION TOOLBAR) --- */}
      <div className="flex flex-wrap justify-end gap-2 border-b pb-4 dark:border-slate-700">
        {/* Nút Chỉnh sửa / Hủy */}
        <button
          onClick={onToggleEdit}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold text-white shadow-sm transition-all active:scale-95 ${
            isEditing
              ? "bg-amber-500 hover:bg-amber-600"
              : "bg-[#EAB308] hover:bg-yellow-600"
          }`}
        >
          <Edit3 size={14} className={isEditing ? "fill-current" : ""} />
          {isEditing ? "Hủy" : "Chỉnh sửa"}
        </button>

        {/* Nút Thêm buổi */}
        <button
          onClick={onAddEvent}
          className="flex items-center gap-2 rounded-lg bg-[#22C55E] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-green-700 active:scale-95"
        >
          <Plus size={16} /> Thêm buổi
        </button>

        {/* Nút Tạo lịch học */}
        <button
          onClick={onCreateSchedule}
          className="flex items-center gap-2 rounded-lg bg-[#3B82F6] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 active:scale-95"
        >
          <CalendarIcon size={14} /> Tạo lịch học
        </button>

        {/* Nút Xóa buổi chưa học */}
        <button
          onClick={onDeleteUnlearned}
          disabled={unlearnedCount === 0}
          className={`flex items-center gap-2 rounded-xl bg-[#EF4444] px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-red-600 active:scale-95 ${
            unlearnedCount === 0 ? "cursor-not-allowed opacity-50" : ""
          }`}
        >
          <Trash2 size={14} /> Xoá (
          {unlearnedCount > 99 ? "99+" : unlearnedCount}) buổi chưa học
        </button>
      </div>

      {/* --- HÀNG 2: CHÚ THÍCH MÀU SẮC (LEGEND) --- */}
      <div className="flex items-center gap-6 px-1">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-md border border-orange-200 bg-[#F97316] shadow-sm"></div>
          <span className="text-[11px] font-extrabold tracking-wider text-slate-600">
            Chưa học
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-md border border-green-200 bg-[#22C55E] shadow-sm"></div>
          <span className="text-[11px] font-extrabold tracking-wider text-slate-600">
            Đã học
          </span>
        </div>
      </div>

      {/* --- HÀNG 3: ĐIỀU HƯỚNG VÀ CHẾ ĐỘ XEM --- */}
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex items-center gap-2">
          {/* Nhóm nút điều hướng cluster */}
          <div className="flex overflow-hidden rounded-xl bg-[#3B82F6] shadow-md">
            <button
              onClick={onPrev}
              className="border-r border-indigo-500 p-2.5 text-white transition-colors hover:bg-blue-700"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={onToday}
              className="px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-blue-700"
            >
              Hôm nay
            </button>
            <button
              onClick={onNext}
              className="border-l border-indigo-500 p-2.5 text-white transition-colors hover:bg-blue-700"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          <h2 className="ml-4 text-xl font-bold tracking-tight text-slate-900 dark:text-slate-200 leading-snug leading-snug">
            {currentRange}
          </h2>
        </div>

        {/* Tab chọn Tháng/Tuần */}
        <div className="flex gap-1 rounded-xl bg-slate-50 p-1 dark:bg-slate-800">
          {["Tháng", "Tuần"].map((view) => (
            <button
              key={view}
              onClick={() => onViewChange(view)}
              className={`rounded-lg px-8 py-2.5 text-xs font-bold transition-all duration-200 ${
                viewType === view
                  ? "bg-white text-indigo-700 shadow-sm dark:bg-slate-700"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {view}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarHeader;



