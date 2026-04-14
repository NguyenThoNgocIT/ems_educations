"use client";
import React, { useState, useMemo } from "react";
import {
  format,
  startOfWeek,
  addDays,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  subMonths,
  addMonths,
} from "date-fns";
import { vi } from "date-fns/locale"; // Để hiển thị tiếng Việt chuẩn
import {
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Inbox,
} from "lucide-react";

const ScheduleManagement = () => {
  const [showCalendar, setShowCalendar] = useState(false);
  // 1. Quản lý ngày đang được chọn (mặc định là hôm nay)
  const [selectedDate, setSelectedDate] = useState(new Date());
  // 2. Quản lý tháng đang hiển thị trong Popover
  const [viewDate, setViewDate] = useState(new Date());

  // --- LOGIC TÍNH TOÁN DỰA TRÊN SELECTED DATE ---

  // Tính toán 7 ngày trong tuần của ngày được chọn
  const daysInWeek = useMemo(() => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Bắt đầu từ Thứ 2
    return Array.from({ length: 7 }).map((_, i) => {
      const date = addDays(start, i);
      return {
        label: format(date, "EEEE", { locale: vi }), // Thứ hai, Thứ ba...
        date: format(date, "dd/MM/yyyy"),
      };
    });
  }, [selectedDate]);

  // Dải ngày hiển thị ở Header
  const dateRangeLabel = `${daysInWeek[0].date} - ${daysInWeek[6].date}`;

  // Logic cho Popover Lịch
  const calendarDays = useMemo(() => {
    const start = startOfMonth(viewDate);
    const end = endOfMonth(viewDate);
    return eachDayOfInterval({ start, end });
  }, [viewDate]);

  return (
    <div className="flex min-h-[600px] flex-col overflow-hidden rounded-[32px] border border-slate-100 bg-white font-sans shadow-sm dark:border-slate-700 dark:bg-slate-900">
      {/* --- TOOLBAR --- */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-50 p-6 dark:border-slate-700">
        <div className="flex flex-wrap items-center gap-4">
          <div className="space-y-1.5">
            <p className="text-[11px] leading-relaxed font-bold tracking-tight text-slate-400">
              Chọn tuần
            </p>
            <div className="relative">
              <button
                onClick={() => setShowCalendar(!showCalendar)}
                className="text-slate-9 leading-relaxed00 flex min-w-48 items-center justify-between rounded-xl border border-indigo-500 bg-white px-4 py-2.5 text-sm font-bold shadow-sm"
              >
                {/* Hiển thị số tuần trong năm hoặc ngày hiện tại */}
                {format(selectedDate, "dd/MM/yyyy")}
                <CalendarIcon size={16} className="text-slate-400" />
              </button>

              {/* CALENDAR POPOVER ĐỘNG */}
              {showCalendar && (
                <div className="absolute top-full left-0 z-50 mt-2 w-72 rounded-2xl border border-slate-100 bg-white p-4 shadow-2xl">
                  <div className="mb-4 flex items-center justify-between">
                    <button
                      onClick={() => setViewDate(subMonths(viewDate, 1))}
                      className="rounded-lg p-1 hover:bg-slate-50"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <span className="text-slate-9 leading-relaxed00 text-sm font-bold">
                      {format(viewDate, "MMMM yyyy", { locale: vi })}
                    </span>
                    <button
                      onClick={() => setViewDate(addMonths(viewDate, 1))}
                      className="rounded-lg p-1 hover:bg-slate-50"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>

                  <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400">
                    <span>T2</span>
                    <span>T3</span>
                    <span>T4</span>
                    <span>T5</span>
                    <span>T6</span>
                    <span>T7</span>
                    <span>CN</span>
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((day, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setSelectedDate(day);
                          setShowCalendar(false);
                        }}
                        className={`rounded-lg py-2 text-xs font-bold transition-colors ${
                          isSameDay(day, selectedDate)
                            ? "bg-blue-600 text-white"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {format(day, "d")}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="text-right">
          <span className="text-lg leading-normal font-bold tracking-normal text-slate-900">
            {dateRangeLabel}
          </span>
        </div>
      </div>

      {/* --- GRID LỊCH HỌC DỰA TRÊN TÍNH TOÁN ĐỘNG --- */}
      <div className="flex-1 overflow-x-auto">
        <div className="flex h-full min-w-[1200px] flex-col">
          <div className="grid grid-cols-7 border-b border-slate-50 bg-slate-50/30">
            {daysInWeek.map((day, index) => (
              <div
                key={index}
                className="border-r border-slate-50 px-4 py-4 text-center last:border-r-0"
              >
                <p className="mb-1 text-[11px] leading-relaxed font-bold tracking-widest text-slate-400">
                  {day.label}
                </p>
                <p className="text-xs leading-relaxed font-bold text-slate-900">
                  {day.date}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-1 flex-col items-center justify-center py-20">
            <Inbox size={40} className="mb-2 text-slate-200" />
            <span className="text-slate-3 leading-relaxed00 text-sm font-bold italic">
              Chưa có lịch dạy
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleManagement;
