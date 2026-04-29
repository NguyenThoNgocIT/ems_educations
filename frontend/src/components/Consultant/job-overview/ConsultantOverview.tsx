"use client";
import React from "react";
import { Mail, Info, ChevronRight, AlertCircle } from "lucide-react";
// Import dữ liệu từ file data bạn đã tách
import { CONSULTANT_STATS, MOCK_LEADS, SUB_TABS } from "./consultant_data";

// 1. Định nghĩa Interface cho Props để nhận hàm từ DashboardMain
interface ConsultantOverviewProps {
  onViewList: () => void;
}

const ConsultantOverview: React.FC<ConsultantOverviewProps> = ({
  onViewList,
}) => {
  // Hàm format tiền VND
  const formatVND = (amount: number) => amount.toLocaleString("vi-VN");

  return (
    <div className="animate-in fade-in space-y-6 duration-500">
      {/* 1. Alert Banner */}
      <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700 shadow-sm">
        <AlertCircle size={18} className="text-indigo-600" />
        <span>
          Trung bình 1 học viên có thể deal được 12 triệu trong 5 ngày
        </span>
      </div>

      {/* 2. Stat Cards Section */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Card Lương & Thu nhập */}
        <div className="grid grid-cols-2 gap-4 rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
          <div>
            <p className="mb-1 text-xs font-medium text-slate-400 leading-relaxed">
              Lương cứng
            </p>
            <p className="text-2xl font-bold leading-snug">
              {formatVND(CONSULTANT_STATS.baseSalary)}
            </p>
          </div>
          <div className="text-right">
            <p className="mb-1 text-xs font-medium text-slate-400 leading-relaxed">
              KPI Mục tiêu
            </p>
            <p className="text-sm font-semibold text-slate-6 leading-relaxed00 leading-relaxed">
              {formatVND(CONSULTANT_STATS.kpiTarget)}
            </p>
          </div>
          <div className="mt-4">
            <p className="mb-1 text-xs font-medium text-indigo-600 text-slate-400 leading-relaxed">
              Thu nhập hiện tại
            </p>
            <p className="text-2xl font-bold text-indigo-700 leading-snug">
              {formatVND(CONSULTANT_STATS.currentIncome)}
            </p>
          </div>
          <div className="mt-4 text-right">
            <p className="mb-1 text-xs font-medium text-green-500 text-slate-400 italic leading-relaxed">
              Thu nhập tối đa
            </p>
            <p className="text-2xl font-bold text-green-600 underline decoration-2 leading-snug">
              {formatVND(CONSULTANT_STATS.maxIncome)}
            </p>
          </div>
        </div>

        {/* Card Tiến độ KPI & Hoa hồng */}
        <div className="flex flex-col justify-between rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
          <div>
            <div className="mb-2 flex items-end justify-between">
              <div>
                <p className="mb-1 text-xs font-medium text-slate-400 leading-relaxed">
                  Doanh số hiện tại
                </p>
                <p className="text-2xl font-bold leading-snug">
                  {formatVND(CONSULTANT_STATS.currentSales)}
                </p>
              </div>
              <span className="rounded bg-blue-50 px-2 py-1 text-xs font-bold text-indigo-700">
                {CONSULTANT_STATS.kpiPercentage}%
              </span>
            </div>
            {/* Thanh Progress Bar */}
            <div className="mb-6 h-3 w-full overflow-hidden rounded-full bg-slate-50">
              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-1000"
                style={{ width: `${CONSULTANT_STATS.kpiPercentage}%` }}
              ></div>
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div>
              <p className="mb-1 text-xs font-medium text-slate-400 leading-relaxed">
                Hoa hồng hiện tại
              </p>
              <p className="text-2xl font-bold leading-snug">
                {formatVND(CONSULTANT_STATS.currentCommission)}
              </p>
            </div>
            <div className="text-right">
              <p className="mb-1 text-xs font-medium text-slate-400 leading-relaxed">
                Hoa hồng tối đa
              </p>
              <p className="text-2xl font-bold leading-snug">
                {formatVND(CONSULTANT_STATS.maxCommission)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Table Section (Danh sách rút gọn) */}
      <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
        {/* Subtabs bên trong bảng */}
        <div className="flex gap-6 overflow-x-auto border-b border-slate-50 px-6 py-4">
          {SUB_TABS.map((tab, idx) => (
            <button
              key={tab}
              className={`text-xs font-bold whitespace-nowrap transition-colors ${
                idx === 0
                  ? "border-b-2 border-blue-600 pb-1 text-indigo-700"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Bảng dữ liệu */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50 font-bold tracking-wider text-slate-600">
              <tr>
                <th className="px-6 py-4">Họ tên</th>
                <th className="px-6 py-4">Số điện thoại</th>
                <th className="px-6 py-4">Khóa học quan tâm</th>
                <th className="px-6 py-4 text-center">Trạng thái</th>
                <th className="px-6 py-4">Nguồn</th>
                <th className="px-6 py-4">Mục đích học</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {/* THÊM .slice(0, 10) ĐỂ GIỚI HẠN 10 NGƯỜI */}
              {MOCK_LEADS.slice(0, 10).map((lead, i) => (
                <tr
                  key={i}
                  className="group transition-colors hover:bg-blue-50/40"
                >
                  <td className="cursor-pointer px-6 py-4 font-bold text-indigo-700 underline">
                    {lead.name}
                  </td>
                  <td className="px-6 py-4 font-semibold text-indigo-600">
                    {lead.phone}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{lead.course}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 font-medium text-slate-600">
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{lead.source}</td>
                  <td className="px-6 py-4 text-slate-600">{lead.goal}</td>
                  <td className="flex items-center justify-end gap-3 px-6 py-4 text-right">
                    <Mail
                      size={16}
                      className="cursor-pointer text-green-500 transition-transform hover:scale-120"
                    />
                    <Info
                      size={16}
                      className="cursor-pointer text-indigo-600 transition-transform hover:scale-120"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 4. Footer: Nút chuyển sang danh sách chi tiết */}
        <div className="border-t border-slate-100 bg-slate-50/50 p-4">
          <button
            onClick={onViewList}
            className="flex cursor-pointer items-center gap-1 text-[11px] font-bold text-slate-600 transition-colors hover:text-blue-700"
          >
            Xem danh sách <ChevronRight size={14} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsultantOverview;



