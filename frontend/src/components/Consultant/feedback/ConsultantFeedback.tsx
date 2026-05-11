"use client";
import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Calendar, ChevronRight, Inbox, MessageSquare } from "lucide-react";
// Đảm bảo dữ liệu đã được thêm vào file data-feedback.ts như hướng dẫn trước
import {
  FEEDBACK_STATS,
  FEEDBACK_CHART_DATA,
  FEEDBACK_LIST,
} from "./data-feedback";

const ConsultantFeedback = () => {
  const [selectedYear, setSelectedYear] = useState(2026);

  return (
    <div className="animate-in fade-in space-y-6 pb-10 duration-500">
      {/* 1. THỐNG KÊ PHẢN HỒI - CHỈ SỐ TỔNG QUÁT */}
      <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-50 p-4">
          <h3 className="text-sm font-bold text-slate-9 leading-relaxed00 leading-tight leading-snug">
            Thống kê phản hồi
          </h3>
          <div className="flex items-center gap-2 rounded border px-3 py-1 text-[10px] font-bold text-slate-400">
            Năm {selectedYear} <Calendar size={12} />
          </div>
        </div>

        <div className="grid grid-cols-1 divide-y divide-slate-100 py-6 md:grid-cols-4 md:divide-x md:divide-y-0">
          {[
            {
              label: "Số lượng phản hồi",
              val: FEEDBACK_STATS.total,
              color: "text-slate-900",
            },
            {
              label: "Phản hồi tích cực",
              val: FEEDBACK_STATS.positive,
              color: "text-green-600",
            },
            {
              label: "Phản hồi tiêu cực",
              val: FEEDBACK_STATS.negative,
              color: "text-red-500",
            },
            {
              label: "Phản hồi chưa trả lời",
              val: FEEDBACK_STATS.unanswered,
              color: "text-orange-500",
            },
          ].map((item, i) => (
            <div key={i} className="group px-4 text-center">
              <p className="mb-1 text-[10px] font-bold tracking-tight text-slate-400 leading-relaxed">
                {item.label}
              </p>
              <p
                className={`text-2xl font-bold ${item.color} transition-transform group-hover:scale-110`}
              >
                {item.val}
              </p>
            </div>
          ))}
        </div>

        {/* 2. BIỂU ĐỒ CỘT THỐNG KÊ */}
        <div className="h-[300px] w-full border-t border-slate-50 bg-slate-50/30 p-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={FEEDBACK_CHART_DATA}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e5e7eb"
              />
              <XAxis
                dataKey="name"
                fontSize={10}
                tickLine={false}
                axisLine={{ stroke: "#eee" }}
                fontWeight="bold"
              />
              <YAxis
                fontSize={10}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                cursor={{ fill: "#f1f5f9" }}
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
              <Bar
                dataKey="count"
                fill="#3b82f6"
                radius={[6, 6, 0, 0]}
                barSize={45}
                className="transition-opacity hover:opacity-80"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. DANH SÁCH PHẢN HỒI CHI TIẾT */}
      <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-50 p-4">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-9 leading-relaxed00 leading-tight leading-snug">
            <MessageSquare size={16} className="text-indigo-600" /> Danh sách
            phản hồi
          </h3>
          <button className="flex items-center gap-1 text-[10px] font-bold text-indigo-700 transition-all hover:underline">
            Xem danh sách <ChevronRight size={14} strokeWidth={3} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px]">
            <thead className="border-b bg-slate-50 font-bold tracking-wider text-slate-600">
              <tr>
                <th className="w-16 px-6 py-4">STT</th>
                <th className="px-6 py-4">Họ tên</th>
                <th className="px-6 py-4">Nội dung phản hồi</th>
                <th className="px-6 py-4 text-center">Trạng thái</th>
                <th className="px-6 py-4">Ngày gửi phản hồi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-medium">
              {FEEDBACK_LIST.length > 0 ? (
                FEEDBACK_LIST.map((item: any, i) => (
                  <tr
                    key={i}
                    className="group transition-colors hover:bg-blue-50/30"
                  >
                    <td className="px-6 py-4 font-bold text-slate-400">
                      {item.stt}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                      {item.name}
                    </td>
                    <td className="max-w-xs truncate px-6 py-4 text-slate-600 italic">
                      "{item.content}"
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`rounded px-2 py-1 text-[10px] font-bold text-white shadow-sm ${
                          item.status === "Tích cực"
                            ? "bg-green-500"
                            : item.status === "Tiêu cực"
                              ? "bg-red-500"
                              : item.status === "Chưa trả lời"
                                ? "bg-orange-500"
                                : "bg-slate-400"
                        }`}
                      >
                        {item.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-400">
                      {item.date}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-24 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-30">
                      <div className="rounded-full bg-slate-50 p-4">
                        <Inbox size={48} className="text-slate-400" />
                      </div>
                      <p className="text-xs font-bold tracking-widest text-slate-600 leading-relaxed">
                        Dữ liệu trống
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

export default ConsultantFeedback;



