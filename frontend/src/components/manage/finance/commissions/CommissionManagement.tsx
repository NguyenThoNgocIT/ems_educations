"use client";
import React, { useState, useMemo } from "react";
import {
  Banknote,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  FileSpreadsheet,
  User,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  RotateCcw,
} from "lucide-react";
import { commissionData } from "./commissionData";

const CommissionManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);

  // --- LOGIC TÌM KIẾM ---
  const filteredData = useMemo(() => {
    return commissionData.filter(
      (item) =>
        item.staff.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.staffId.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery]);

  // --- LOGIC TÍNH THỐNG KÊ ĐỘNG ---
  const stats = useMemo(() => {
    const total = filteredData.reduce((acc, curr) => acc + curr.amount, 0);
    const paid = filteredData
      .filter((i) => i.status === "Đã chi trả")
      .reduce((acc, curr) => acc + curr.amount, 0);
    const pending = filteredData
      .filter((i) => i.status === "Chờ đối soát")
      .reduce((acc, curr) => acc + curr.amount, 0);
    return { total, paid, pending };
  }, [filteredData]);

  const formatVND = (val: number) =>
    new Intl.NumberFormat("vi-VN").format(val) + "đ";

  return (
    <div className="space-y-6 px-2 font-sans md:px-0">
      {/* --- STATS CARDS: TỰ ĐỘNG NHẢY SỐ --- */}
      <div className="animate-in fade-in grid grid-cols-1 gap-4 duration-500 md:grid-cols-3">
        <StatCard
          label="Tổng hoa hồng kỳ này"
          value={formatVND(stats.total)}
          icon={<Banknote className="text-indigo-600" />}
          color="text-indigo-700"
          bgColor="bg-blue-50"
        />
        <StatCard
          label="Đã chi trả thực tế"
          value={formatVND(stats.paid)}
          icon={<CheckCircle2 className="text-emerald-500" />}
          color="text-emerald-600"
          bgColor="bg-emerald-50"
        />
        <StatCard
          label="Hoa hồng chờ xử lý"
          value={formatVND(stats.pending)}
          icon={<Clock className="text-amber-500" />}
          color="text-amber-600"
          bgColor="bg-amber-50"
        />
      </div>

      {/* --- TOOLBAR HOẠT ĐỘNG --- */}
      <div className="relative flex flex-wrap items-center justify-between gap-4 rounded-[28px] border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="flex max-w-md flex-1 items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className={`rounded-xl border p-2.5 transition-all ${showFilter ? "border-indigo-500 bg-blue-50 text-indigo-700" : "border-slate-100 bg-slate-50 text-slate-400"}`}
            >
              <Filter size={20} />
            </button>

            {showFilter && (
              <div className="animate-in fade-in slide-in-from-top-2 absolute top-full left-0 z-[110] mt-3 w-[280px] rounded-2xl border border-slate-50 bg-white p-6 shadow-2xl">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400">
                      Trạng thái
                    </label>
                    <select className="w-full rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm font-bold outline-none">
                      <option>Tất cả</option>
                      <option>Đã chi trả</option>
                      <option>Chờ đối soát</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowFilter(false)}
                      className="flex-1 rounded-xl bg-slate-50 py-2.5 text-xs font-bold text-slate-400"
                    >
                      <RotateCcw size={14} className="mr-1 inline" /> Reset
                    </button>
                    <button
                      onClick={() => setShowFilter(false)}
                      className="flex-1 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-200"
                    >
                      Lọc
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="relative w-full">
            <input
              type="text"
              placeholder="Tìm tên nhân viên, mã số hoặc học viên..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-100 bg-slate-50 py-2.5 pr-10 pl-4 text-sm font-bold transition-all outline-none focus:border-indigo-500 dark:bg-slate-800"
            />
            <Search
              size={18}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-300"
            />
          </div>
        </div>

        <button
          onClick={() => alert("🚀 Đã chuẩn bị báo cáo hoa hồng Excel!")}
          className="flex items-center gap-2 rounded-xl bg-[#9C27B0] px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-500/10 transition-all hover:bg-purple-700 active:scale-95"
        >
          <FileSpreadsheet size={18} /> Xuất báo cáo
        </button>
      </div>

      {/* --- TABLE: DANH SÁCH --- */}
      <div className="overflow-hidden rounded-[32px] border border-slate-100 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px] border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b bg-slate-50/30 text-sm font-extrabold tracking-wider text-slate-900 dark:border-slate-700 dark:text-white">
                <th className="px-8 py-5">Nhân viên thụ hưởng</th>
                <th className="px-6 py-5">Nguồn từ học viên</th>
                <th className="px-6 py-5 text-center">Giá trị hóa đơn</th>
                <th className="px-6 py-5 text-center">Tỷ lệ %</th>
                <th className="px-6 py-5 text-center">Tiền hoa hồng</th>
                <th className="px-6 py-4 text-center">Trạng thái</th>
                <th className="px-6 py-4 text-center">Ngày ghi nhận</th>
                <th className="px-8 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr
                    key={index}
                    className="group animate-in fade-in transition-colors duration-300 hover:bg-slate-50/20"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-indigo-600 dark:bg-blue-900/20">
                          <User size={18} />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 dark:text-slate-200">
                            {item.staff}
                          </span>
                          <span className="text-[10px] font-bold tracking-normal text-slate-400">
                            {item.staffId}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="cursor-pointer px-6 py-5 font-bold text-indigo-700 hover:underline">
                      {item.student}
                    </td>
                    <td className="px-6 py-5 text-center font-bold text-slate-600">
                      {formatVND(item.invoiceValue)}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="rounded-md bg-slate-50 px-2 py-1 text-[10px] font-bold text-slate-600 dark:bg-slate-800">
                        {item.rate}%
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center text-base leading-relaxed font-bold tracking-tight text-emerald-600 italic">
                      {formatVND(item.amount)}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span
                        className={`rounded-lg px-3 py-1.5 text-[10px] font-bold text-white ${item.status === "Đã chi trả" ? "bg-[#22C55E]" : "bg-[#F59E0B]"}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center font-bold text-slate-400">
                      {item.date}
                    </td>
                    <td className="px-8 py-5 text-center text-slate-300 opacity-0 transition-opacity group-hover:opacity-100">
                      <button className="hover:text-slate-600">
                        <MoreHorizontal size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="text-slate-4 leading-relaxed00 px-6 py-20 text-center text-sm font-bold italic"
                  >
                    Không có dữ liệu hoa hồng phù hợp...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* --- FOOTER: ĐỒNG BỘ --- */}
        <div className="flex items-center justify-end border-t bg-slate-50/10 p-6 dark:border-slate-700">
          <span className="mr-6 text-[11px] font-bold text-slate-600">
            Tổng: {filteredData.length} bản ghi
          </span>
          <div className="flex items-center gap-1">
            <button className="p-1 text-slate-300 transition-colors hover:text-indigo-700">
              <ChevronLeft size={16} />
            </button>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 font-bold text-white shadow-lg">
              1
            </span>
            <button className="p-1 text-slate-300 transition-colors hover:text-indigo-700">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component thẻ thống kê
const StatCard = ({ label, value, icon, color, bgColor }: any) => (
  <div className="flex items-center gap-4 rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm transition-transform hover:scale-[1.02] dark:border-slate-700 dark:bg-slate-900">
    <div
      className={`h-12 w-12 ${bgColor} flex items-center justify-center rounded-2xl`}
    >
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <div className="flex flex-col">
      <span className="text-[10px] font-bold tracking-widest text-slate-400">
        {label}
      </span>
      <span className={`text-xl font-bold ${color} mt-0.5 tracking-normal`}>
        {value}
      </span>
    </div>
  </div>
);

export default CommissionManagement;
