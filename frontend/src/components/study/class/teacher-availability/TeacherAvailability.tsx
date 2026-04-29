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
import { vi } from "date-fns/locale";
import {
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  User,
  Copy,
  X,
  Check,
} from "lucide-react";

// Import dữ liệu từ file riêng
import { TEACHERS, SHIFTS, MOCK_SCHEDULE_ENTRIES } from "./teacherScheduleData";

const TeacherAvailability = () => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTeacherDropdown, setShowTeacherDropdown] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewDate, setViewDate] = useState(new Date());

  // 1. CHỈNH LẠI LOGIC: Lưu ID giáo viên thay vì string hiển thị
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>("all");

  const daysInWeek = useMemo(() => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
    return Array.from({ length: 7 }).map((_, i) => {
      const date = addDays(start, i);
      return {
        label: format(date, "EEEE", { locale: vi }),
        date: format(date, "dd/MM/yyyy"),
      };
    });
  }, [selectedDate]);

  const calendarDays = useMemo(() => {
    const start = startOfMonth(viewDate);
    const end = endOfMonth(viewDate);
    return eachDayOfInterval({ start, end });
  }, [viewDate]);

  // Tìm tên giáo viên đang chọn để hiển thị lên UI
  const currentTeacherName = useMemo(() => {
    if (selectedTeacherId === "all") return "Tất cả giáo viên";
    return TEACHERS.find((t) => t.id === selectedTeacherId)?.name || "N/A";
  }, [selectedTeacherId]);

  return (
    <div className="flex min-h-[600px] flex-col overflow-hidden rounded-[32px] border border-slate-100 bg-white font-sans shadow-sm dark:border-slate-700 dark:bg-slate-900">
      {/* --- HEADER LỊCH (TOOLBAR) --- */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-50 p-6 dark:border-slate-700">
        <div className="flex flex-wrap items-center gap-6">
          <div className="space-y-1.5">
            <p className="text-[11px] leading-relaxed font-bold tracking-tight text-slate-400 italic">
              Tuần thứ
            </p>
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className="text-slate-9 leading-relaxed00 flex w-52 items-center justify-between rounded-xl border-2 border-indigo-500 bg-white px-4 py-2.5 text-sm font-bold shadow-sm"
            >
              {format(selectedDate, "dd/MM/yyyy")}
              <CalendarIcon size={16} className="text-indigo-600" />
            </button>
            {/* ... (Phần Popover Calendar giữ nguyên) ... */}
          </div>

          {/* 2. CẬP NHẬT LOGIC: Dropdown chọn giáo viên từ Data thật */}
          <div className="relative space-y-1.5">
            <p className="text-[11px] leading-relaxed font-bold tracking-tight text-slate-400">
              Giáo viên
            </p>
            <div
              onClick={() => setShowTeacherDropdown(!showTeacherDropdown)}
              className="text-slate-6 leading-relaxed00 flex min-w-[240px] cursor-pointer items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-2.5 text-sm font-bold"
            >
              <span>{currentTeacherName}</span>
              {selectedTeacherId !== "all" ? (
                <X
                  size={16}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTeacherId("all");
                  }}
                  className="text-slate-300 hover:text-rose-500"
                />
              ) : (
                <ChevronDown size={16} className="text-slate-400" />
              )}
            </div>

            {showTeacherDropdown && (
              <div className="absolute top-full left-0 z-[100] mt-2 w-full rounded-2xl border border-slate-100 bg-white py-2 shadow-2xl dark:bg-slate-900">
                <div
                  onClick={() => {
                    setSelectedTeacherId("all");
                    setShowTeacherDropdown(false);
                  }}
                  className="cursor-pointer px-4 py-2.5 text-sm font-bold text-indigo-700 hover:bg-blue-50"
                >
                  Tất cả giáo viên
                </div>
                {TEACHERS.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => {
                      setSelectedTeacherId(t.id);
                      setShowTeacherDropdown(false);
                    }}
                    className="flex cursor-pointer items-center justify-between px-4 py-2.5 text-sm font-medium hover:bg-slate-50"
                  >
                    {t.name} - {t.id}
                    {selectedTeacherId === t.id && (
                      <Check size={14} className="text-indigo-600" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="text-right">
          <span className="text-lg leading-normal font-bold tracking-normal text-slate-900">
            {format(
              startOfWeek(selectedDate, { weekStartsOn: 1 }),
              "dd/MM/yyyy",
            )}{" "}
            -{" "}
            {format(
              addDays(startOfWeek(selectedDate, { weekStartsOn: 1 }), 6),
              "dd/MM/yyyy",
            )}
          </span>
        </div>
      </div>

      {/* --- GRID: HIỂN THỊ DỮ LIỆU ĐÃ LỌC --- */}
      <div className="flex-1 overflow-x-auto">
        <table className="w-full min-w-[1200px] border-collapse">
          <thead>
            <tr className="border-b bg-slate-50/50 dark:border-slate-700">
              <th className="w-40 border-r bg-slate-100/50 px-6 py-5 text-center text-[11px] font-bold tracking-widest text-indigo-700">
                Ca dạy
              </th>
              {daysInWeek.map((day, index) => (
                <th
                  key={index}
                  className="border-r px-4 py-5 text-center last:border-r-0 dark:border-slate-700"
                >
                  <p className="mb-1 text-[11px] leading-relaxed font-bold text-slate-400">
                    {day.label}
                  </p>
                  <p className="text-sm leading-relaxed font-bold text-indigo-700">
                    {day.date}
                  </p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {SHIFTS.map((shift) => (
              <tr key={shift}>
                <td className="dark:text-slate-3 leading-relaxed00 border-r bg-slate-50/30 px-6 py-10 text-center text-sm font-bold text-slate-900">
                  {shift}
                </td>
                {daysInWeek.map((day, idx) => {
                  // 3. LOGIC LỌC THÔNG MINH: Lọc theo Ngày + Ca + (Giáo viên nếu có chọn cụ thể)
                  const entry = MOCK_SCHEDULE_ENTRIES.find((e) => {
                    const matchTime = e.date === day.date && e.shift === shift;
                    const matchTeacher =
                      selectedTeacherId === "all" ||
                      e.teacherId === selectedTeacherId;
                    return matchTime && matchTeacher;
                  });

                  const teacher = entry
                    ? TEACHERS.find((t) => t.id === entry.teacherId)
                    : null;

                  return (
                    <td
                      key={idx}
                      className="border-r px-4 py-6 last:border-0 dark:border-slate-700"
                    >
                      {teacher ? (
                        <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-400">
                            <User size={20} />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold tracking-normal text-slate-900">
                              {teacher.name}
                            </span>
                            <div className="mt-1 flex items-center gap-1 text-[9px] font-bold text-slate-400">
                              <Copy size={10} /> {teacher.id}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex h-16 items-center justify-center rounded-2xl border-2 border-dashed border-slate-50 text-[10px] font-bold text-slate-200">
                          Trống
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherAvailability;
