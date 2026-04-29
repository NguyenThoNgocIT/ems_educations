"use client";
import React, { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Calendar,
  ChevronRight,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
} from "lucide-react";
// Import data thực tế
import {
  STUDENT_STATS_BY_MONTH,
  STUDENT_YEARLY_CHART,
  UPSELL_STUDENTS,
} from "./data-student";

const ConsultantStudent = () => {
  // Logic Lịch động: Mặc định tháng 02 năm 2026
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState({ month: 2, year: 2026 });

  const months = [
    "Thg 01",
    "Thg 02",
    "Thg 03",
    "Thg 04",
    "Thg 05",
    "Thg 06",
    "Thg 07",
    "Thg 08",
    "Thg 09",
    "Thg 10",
    "Thg 11",
    "Thg 12",
  ];

  // Tự động lấy số liệu theo tháng đã chọn
  const currentStats = useMemo(() => {
    return (
      STUDENT_STATS_BY_MONTH[selectedDate.month] || STUDENT_STATS_BY_MONTH[2]
    );
  }, [selectedDate.month]);

  const handleMonthSelect = (idx: number) => {
    setSelectedDate({ ...selectedDate, month: idx + 1 });
    setShowDatePicker(false);
  };

  return (
    <div className="animate-in fade-in relative space-y-6 pb-10 duration-500">
      {/* 1. THỐNG KÊ HỌC VIÊN - THẺ CHỈ SỐ */}
      <div className="rounded-xl border border-slate-100 bg-white shadow-sm">
        <div className="relative flex items-center justify-between border-b border-slate-50 p-4">
          <h3 className="text-sm font-bold text-slate-9 leading-relaxed00 leading-tight leading-snug">
            Thống kê học viên
          </h3>

          {/* BỘ LỌC LỊCH ĐỘNG */}
          <div className="relative">
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="flex items-center gap-2 rounded-lg border border-blue-400 bg-white px-4 py-1.5 text-xs font-bold text-slate-900 shadow-sm transition-all hover:bg-slate-50"
            >
              Tháng{" "}
              {selectedDate.month < 10
                ? `0${selectedDate.month}`
                : selectedDate.month}
              , {selectedDate.year}
              <Calendar size={14} className="text-slate-400" />
            </button>

            {showDatePicker && (
              <div className="animate-in zoom-in-95 absolute right-0 z-[110] mt-2 w-64 rounded-xl border border-slate-100 bg-white p-4 text-slate-900 shadow-2xl duration-150">
                <div className="mb-4 flex items-center justify-between border-b pb-2">
                  <button className="rounded p-1 text-slate-400 hover:bg-slate-50">
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-sm font-bold">{selectedDate.year}</span>
                  <button className="rounded p-1 text-slate-400 hover:bg-slate-50">
                    <ChevronRightIcon size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {months.map((m, idx) => (
                    <button
                      key={m}
                      onClick={() => handleMonthSelect(idx)}
                      className={`rounded-lg py-2 text-[11px] font-bold transition-all ${
                        selectedDate.month === idx + 1
                          ? "scale-105 bg-blue-600 text-white shadow-md"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* THẺ CHỈ SỐ */}
        <div className="grid grid-cols-1 divide-y divide-slate-100 py-8 md:grid-cols-3 md:divide-x md:divide-y-0">
          <div className="space-y-8">
            <div className="text-center">
              <p className="mb-1 text-[10px] font-bold tracking-wider text-slate-400 leading-relaxed">
                Học viên trong tháng
              </p>
              <p className="text-3xl font-bold text-slate-900 leading-relaxed">
                {currentStats.totalInMonth}
              </p>
            </div>
            <div className="text-center">
              <p className="mb-1 text-[10px] font-bold tracking-wider text-slate-400 leading-relaxed">
                Học viên bảo lưu
              </p>
              <p className="text-3xl font-bold text-slate-900 leading-relaxed">
                {currentStats.reserved}
              </p>
            </div>
          </div>
          <div className="space-y-8 py-8 md:py-0">
            <div className="text-center">
              <p className="mb-1 text-[10px] font-bold tracking-wider text-slate-400 leading-relaxed">
                Học viên đăng ký mới
              </p>
              <p className="text-3xl font-bold text-slate-900 leading-relaxed">
                {currentStats.newRegistration}
              </p>
            </div>
            <div className="text-center">
              <p className="mb-1 text-[10px] font-bold tracking-wider text-slate-400 leading-relaxed">
                Học viên có tiềm năng upsell
              </p>
              <p className="text-3xl font-bold text-slate-900 leading-relaxed">
                {currentStats.potentialUpsell}
              </p>
            </div>
          </div>
          <div className="space-y-8 pt-8 md:pt-0">
            <div className="text-center">
              <p className="mb-1 text-[10px] font-bold tracking-wider text-slate-400 leading-relaxed">
                Học viên đăng ký học tiếp
              </p>
              <p className="text-3xl font-bold text-slate-900 leading-relaxed">
                {currentStats.continuedRegistration}
              </p>
            </div>
            <div className="text-center">
              <p className="mb-1 text-[10px] font-bold tracking-wider text-slate-400 leading-relaxed">
                Học viên dừng học tập
              </p>
              <p className="text-3xl font-bold text-slate-900 leading-relaxed">
                {currentStats.dropped}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. BIỂU ĐỒ NĂM */}
      <div className="rounded-xl border border-slate-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-50 p-4 font-bold">
          <h3 className="text-sm text-slate-9 leading-relaxed00">
            Thống kê học viên
          </h3>
          <div className="flex items-center gap-2 rounded border px-3 py-1 text-[10px] text-slate-400">
            Năm {selectedDate.year} <Calendar size={12} />
          </div>
        </div>
        <div className="h-[320px] w-full p-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={STUDENT_YEARLY_CHART}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f0f0f0"
              />
              <XAxis
                dataKey="month"
                fontSize={10}
                tickLine={false}
                axisLine={{ stroke: "#eee" }}
              />
              <YAxis
                fontSize={10}
                tickLine={false}
                axisLine={false}
                domain={[0, 4]}
                allowDecimals={false}
              />
              <Tooltip />
              <Legend
                align="right"
                verticalAlign="top"
                iconType="circle"
                wrapperStyle={{ fontSize: "10px", paddingBottom: "30px" }}
              />
              <Line
                name="Ký mới"
                type="monotone"
                dataKey="new"
                stroke="#3b82f6"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#3b82f6" }}
              />
              <Line
                name="Ký tiếp"
                type="monotone"
                dataKey="continued"
                stroke="#ec4899"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#ec4899" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. BẢNG UPSELL */}
      <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-50 p-4">
          <h3 className="text-sm font-bold text-slate-9 leading-relaxed00 leading-tight leading-snug">
            Học viên có khả năng upsell
          </h3>
          <button className="flex items-center gap-1 text-[10px] font-bold text-indigo-700 transition-colors hover:underline">
            Xem danh sách <ChevronRight size={14} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px]">
            <thead className="border-b bg-slate-50 font-bold text-slate-600">
              <tr>
                <th className="px-6 py-4">Mã hóa đơn</th>
                <th className="px-6 py-4">Họ tên</th>
                <th className="px-6 py-4">Số điện thoại</th>
                <th className="px-6 py-4">Khóa học</th>
                <th className="px-6 py-4">Ngày kết thúc</th>
                <th className="px-6 py-4">Khóa học đề xuất</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-900">
              {UPSELL_STUDENTS.length > 0 ? (
                UPSELL_STUDENTS.map((item, i) => (
                  <tr key={i} className="transition-colors hover:bg-slate-50">
                    <td className="px-6 py-4 text-slate-400">{item.id}</td>
                    <td className="px-6 py-4 font-bold">{item.name}</td>
                    <td className="px-6 py-4">{item.phone}</td>
                    <td className="px-6 py-4">{item.course}</td>
                    <td className="px-6 py-4">{item.endDate}</td>
                    <td className="px-6 py-4 font-bold text-indigo-700">
                      {item.suggestCourse}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-30">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-200">
                        <Calendar size={24} className="text-slate-400" />
                      </div>
                      <p className="text-xs font-bold text-slate-600 leading-relaxed">
                        Trống
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ConsultantStudent;



