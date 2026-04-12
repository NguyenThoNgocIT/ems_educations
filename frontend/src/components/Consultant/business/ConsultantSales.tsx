"use client";
import React, { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  Calendar,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
// Import data từ file của bạn
import { SALES_CHART_DATA, FEEDBACK_CHART_DATA } from "./data-business";

const ConsultantSales = () => {
  // --- LOGIC LỊCH ĐỘNG ---
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

  const handleMonthSelect = (monthIdx: number) => {
    setSelectedDate({ ...selectedDate, month: monthIdx + 1 });
    setShowDatePicker(false);
    // Tại đây bạn có thể thêm logic fetch lại data theo tháng/năm nếu có API
  };

  const formatVND = (amount?: number) => {
    if (amount === undefined || amount === null) return "0";
    return amount.toLocaleString("vi-VN");
  };

  // 1. TỰ ĐỘNG TÍNH TOÁN CÁC CHỈ SỐ TỪ DATA
  const stats = useMemo(() => {
    const totalCollected = SALES_CHART_DATA.reduce(
      (sum, item) => sum + (item.collected || 0),
      0,
    );
    const totalRemaining = SALES_CHART_DATA.reduce(
      (sum, item) => sum + (item.remaining || 0),
      0,
    );
    return {
      collected: totalCollected,
      remaining: totalRemaining,
      total: totalCollected + totalRemaining,
    };
  }, []);

  return (
    <div className="animate-in fade-in space-y-6 pb-10 duration-500">
      {/* SECTION 1: THỐNG KÊ PHẢN HỒI */}
      <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
        <div className="relative flex items-center justify-between border-b border-slate-50 p-4">
          <h3 className="text-sm font-bold text-slate-9 leading-relaxed00 leading-tight leading-snug">
            Thống kê phản hồi
          </h3>

          {/* BỘ LỌC LỊCH CHO PHẦN PHẢN HỒI */}
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
              <div className="animate-in zoom-in-95 absolute right-0 z-[110] mt-2 w-64 rounded-xl border border-slate-100 bg-white p-4 shadow-2xl duration-150">
                <div className="mb-4 flex items-center justify-between border-b pb-2">
                  <button className="rounded p-1 text-slate-400 hover:bg-slate-50">
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-sm font-bold text-slate-9 leading-relaxed00">
                    {selectedDate.year}
                  </span>
                  <button className="rounded p-1 text-slate-400 hover:bg-slate-50">
                    <ChevronRight size={16} />
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

        <div className="h-[300px] w-full p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={FEEDBACK_CHART_DATA}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f0f0f0"
              />
              <XAxis
                dataKey="day"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                fontSize={10}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip formatter={(value: any) => [value, "Số lượng"]} />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                wrapperStyle={{ fontSize: "10px", paddingTop: "20px" }}
              />
              <Line
                name="Học viên mới"
                type="monotone"
                dataKey="new"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line
                name="Học viên tái ký"
                type="monotone"
                dataKey="renew"
                stroke="#ec4899"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* SECTION 2: THỐNG KÊ CÔNG NỢ */}
      <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-50 p-4">
          <h3 className="text-sm font-bold text-slate-9 leading-relaxed00 leading-tight leading-snug">
            Thống kê công nợ
          </h3>
          <div className="flex items-center gap-2 rounded border px-3 py-1 text-[10px] font-medium text-slate-600">
            Tháng{" "}
            {selectedDate.month < 10
              ? `0${selectedDate.month}`
              : selectedDate.month}
            , {selectedDate.year} <Calendar size={12} />
          </div>
        </div>

        {/* 4 Chỉ số công nợ */}
        <div className="grid grid-cols-1 divide-x divide-slate-100 border-b border-slate-100 md:grid-cols-4">
          <div className="p-4">
            <p className="mb-1 text-[11px] font-bold text-slate-400 leading-relaxed">
              Tổng giá trị công nợ
            </p>
            <p className="text-xl font-bold text-indigo-700 leading-snug">
              {formatVND(stats.total)}
            </p>
            <p className="mt-1 text-[10px] text-slate-400 leading-relaxed">
              ↑ 0%{" "}
              <span className="text-slate-300 italic">so với tháng trước</span>
            </p>
          </div>
          <div className="p-4">
            <p className="mb-1 text-[11px] font-bold text-slate-400 leading-relaxed">
              Công nợ đã thu
            </p>
            <p className="text-xl font-bold text-green-600 leading-snug">
              {formatVND(stats.collected)}
            </p>
            <p className="mt-1 text-[10px] text-slate-400 leading-relaxed">
              ↑ 0%{" "}
              <span className="text-slate-300 italic">so với tháng trước</span>
            </p>
          </div>
          <div className="p-4">
            <p className="mb-1 text-[11px] font-bold text-slate-400 leading-relaxed">
              Công nợ quá hạn
            </p>
            <p className="text-xl font-bold text-red-600 leading-snug">0</p>
            <div className="mt-1 flex w-fit items-center gap-1 rounded bg-orange-500 px-2 py-0.5 text-[9px] font-bold text-white shadow-sm">
              <AlertTriangle size={10} /> Quá hạn so với ngày 07/
              {selectedDate.month < 10
                ? `0${selectedDate.month}`
                : selectedDate.month}
              /{selectedDate.year}
            </div>
          </div>
          <div className="p-4">
            <p className="mb-1 text-[11px] font-bold text-slate-400 leading-relaxed">
              Công nợ chưa thu
            </p>
            <p className="text-xl font-bold text-black leading-snug leading-relaxed">
              {formatVND(stats.remaining)}
            </p>
            <p className="mt-1 text-[10px] text-slate-400 leading-relaxed">
              ↑ 0%{" "}
              <span className="text-slate-300 italic">so với tháng trước</span>
            </p>
          </div>
        </div>

        {/* Biểu đồ cột công nợ 12 tháng */}
        <div className="h-[350px] w-full p-6">
          <div className="mb-6 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 italic">
              Biểu đồ 12 tháng năm {selectedDate.year}
            </span>
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={SALES_CHART_DATA}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f0f0f0"
              />
              <XAxis
                dataKey="month"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) =>
                  value >= 1000 ? `${value / 1000}k` : value
                }
              />
              <Tooltip
                formatter={(value: any) => formatVND(Number(value))}
                cursor={{ fill: "#f8fafc" }}
              />
              <Legend
                align="right"
                verticalAlign="top"
                iconType="circle"
                wrapperStyle={{ fontSize: "10px", paddingBottom: "20px" }}
              />
              <Bar
                name="Đã thu"
                dataKey="collected"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                barSize={30}
              />
              <Bar
                name="Chưa thu"
                dataKey="remaining"
                fill="#ec4899"
                radius={[4, 4, 0, 0]}
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ConsultantSales;



