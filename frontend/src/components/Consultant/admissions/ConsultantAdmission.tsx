"use client";
import React, { useState } from "react";
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
import { Calendar, ArrowRight } from "lucide-react";
// Import data thực tế từ file hằng số
import {
  ADMISSION_STATS,
  RESPONSE_TIME_DATA,
  SOURCE_STATS,
  CONVERSION_TIME_DATA, // Data cho phần chuyển đổi
  STATUS_OPTIONS,
  LEAD_STATUS_COUNTS,
} from "./data-tuyensinh";

const ConsultantAdmission = () => {
  const [fromStatus, setFromStatus] = useState("Mới");
  const [toStatus, setToStatus] = useState("Đã liên hệ");

  return (
    <div className="animate-in fade-in space-y-6 pb-10 duration-500">
      {/* 1. THỐNG KÊ TƯ VẤN LEADS */}
      <div className="rounded-xl border border-slate-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-50 p-4">
          <h3 className="text-sm font-bold text-slate-9 leading-relaxed00 leading-tight leading-snug">
            Thống kê tư vấn leads
          </h3>
          <div className="flex cursor-pointer items-center gap-2 rounded border px-3 py-1 text-[10px] text-slate-600">
            <Calendar size={12} /> <span>Tháng 02, 2026</span>
          </div>
        </div>
        <div className="grid grid-cols-4 divide-x divide-slate-50 py-6">
          {[
            {
              label: "Tổng số leads tư vấn",
              val: ADMISSION_STATS.totalLeads,
              color: "text-indigo-700",
            },
            {
              label: "Tư vấn thành công",
              val: ADMISSION_STATS.successLeads,
              color: "text-green-600",
            },
            {
              label: "Tư vấn thất bại",
              val: ADMISSION_STATS.failedLeads,
              color: "text-red-500",
            },
            {
              label: "Leads chưa liên hệ",
              val: ADMISSION_STATS.uncontactedLeads,
              color: "text-slate-900",
            },
          ].map((item, i) => (
            <div key={i} className="px-4 text-center">
              <p className="mb-2 text-[10px] font-bold text-slate-400 leading-relaxed">
                {item.label}
              </p>
              <p className={`text-2xl font-bold ${item.color}`}>{item.val}</p>
              <p className="mt-2 text-[9px] font-bold text-green-500 italic">
                ~ 0% <span className="text-slate-300">so với tháng 1</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. THỜI GIAN PHẢN HỒI */}
      <div className="rounded-xl border border-slate-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-50 p-4 font-bold">
          <h3 className="text-sm text-slate-9 leading-relaxed00">
            Thời gian phản hồi
          </h3>
          <div className="flex items-center gap-2 rounded border px-3 py-1 text-[10px] text-slate-600">
            <Calendar size={12} /> <span>Tháng 02, 2026</span>
          </div>
        </div>
        <div className="h-[250px] w-full p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={RESPONSE_TIME_DATA}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f5f5f5"
              />
              <XAxis
                dataKey="time"
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
                wrapperStyle={{ fontSize: "10px" }}
              />
              <Line
                name="Tổng số leads"
                type="monotone"
                dataKey="count"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 4, fill: "#3b82f6" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. THỜI GIAN CHUYỂN ĐỔI TRẠNG THÁI (PHẦN MỚI CẬP NHẬT) */}
      <div className="rounded-xl border border-slate-100 bg-white shadow-sm">
        <div className="space-y-4 border-b border-slate-50 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-9 leading-relaxed00 leading-tight leading-snug">
              Thời gian chuyển đổi trạng thái
            </h3>
            <div className="flex items-center gap-2 rounded border px-3 py-1 text-[10px] text-slate-600">
              <Calendar size={12} /> <span>Tháng 02, 2026</span>
            </div>
          </div>

          {/* Bộ chọn trạng thái theo ảnh thiết kế */}
          <div className="flex items-center gap-3">
            <select
              value={fromStatus}
              onChange={(e) => setFromStatus(e.target.value)}
              className="rounded border border-slate-200 bg-slate-50/50 px-2 py-1 text-[11px] font-bold text-slate-600 outline-none"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <ArrowRight size={14} className="text-slate-400" />
            <select
              value={toStatus}
              onChange={(e) => setToStatus(e.target.value)}
              className="rounded border border-slate-200 bg-slate-50/50 px-2 py-1 text-[11px] font-bold text-slate-600 outline-none"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="h-[250px] w-full p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={CONVERSION_TIME_DATA}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f5f5f5"
              />
              <XAxis
                dataKey="time"
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
              <Line
                name={`Từ ${fromStatus} sang ${toStatus}`}
                type="monotone"
                dataKey="count"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 4, fill: "#3b82f6" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* 4. THỐNG KÊ TRẠNG THÁI LEADS (UI TINH CHỈNH) */}
        <div className="space-y-3">
          {LEAD_STATUS_COUNTS.map((item) => (
            <div key={item.label} className="flex items-center gap-4">
              <span className="w-6 text-xs font-bold text-slate-900">
                {item.val}
              </span>
              <span className="flex-1 rounded border border-slate-100 bg-slate-50/80 px-4 py-2 text-[11px] font-bold text-slate-600 shadow-sm">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* 5. THỐNG KÊ NGUỒN LEADS */}
        <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="mb-6 flex items-center justify-between font-bold">
            <h3 className="text-sm text-slate-9 leading-relaxed00">
              Thống kê nguồn leads
            </h3>
            <div className="flex items-center gap-2 rounded border px-3 py-1 text-[10px] text-slate-600">
              <Calendar size={12} /> <span>Tháng 02, 2026</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-y-4">
            {SOURCE_STATS.map((source) => (
              <div key={source.name} className="flex items-center gap-2">
                <div
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: source.color }}
                />
                <span className="w-5 text-[11px] font-bold text-slate-900">
                  {source.value}
                </span>
                <span className="truncate text-[10px] font-bold text-slate-400">
                  {source.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultantAdmission;



