"use client";
import React, { useState, useMemo } from "react";
import {
  Filter,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Search,
  ChevronDown,
  RotateCcw,
} from "lucide-react";
import { approvalData, ApprovalItem } from "./approvalData";

const PaymentApproval = () => {
  const [activeTab, setActiveTab] = useState("Tất cả");
  const [showFilter, setShowFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // --- LOGIC TÍNH TOÁN TAB COUNTS ---
  const counts = useMemo(
    () => ({
      "Tất cả": approvalData.length,
      "Chờ duyệt": approvalData.filter((i) => i.status === "Chờ duyệt").length,
      "Đã duyệt": approvalData.filter((i) => i.status === "Đã duyệt").length,
      "Không duyệt": approvalData.filter((i) => i.status === "Không duyệt")
        .length,
    }),
    [],
  );

  // --- LOGIC LỌC DỮ LIỆU ---
  const filteredData = useMemo(() => {
    return approvalData.filter((item) => {
      const matchTab = activeTab === "Tất cả" || item.status === activeTab;
      const matchSearch =
        item.requester.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchTab && matchSearch;
    });
  }, [activeTab, searchQuery]);

  // --- TÍNH TỔNG TIỀN ĐỘNG THEO DỮ LIỆU ĐANG HIỆN ---
  const totalAmount = useMemo(() => {
    return filteredData.reduce((sum, item) => sum + item.amount, 0);
  }, [filteredData]);

  const formatVND = (val: number) =>
    new Intl.NumberFormat("vi-VN").format(val) + "đ";

  return (
    <div className="overflow-hidden rounded-[32px] border border-slate-100 bg-white font-sans shadow-sm dark:border-slate-700 dark:bg-slate-900">
      {/* --- HEADER: TABS & BỘ LỌC --- */}
      <div className="relative flex flex-wrap items-center justify-between gap-4 border-b border-slate-50 p-6 dark:border-slate-700">
        <div className="flex items-center gap-3">
          {/* Nút Lọc và Popover */}
          <div className="relative">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className={`rounded-xl border p-2.5 transition-all ${showFilter ? "border-indigo-500 bg-blue-50 text-indigo-700" : "border-slate-100 bg-slate-50 text-slate-400"}`}
            >
              <Filter size={20} />
            </button>

            {showFilter && (
              <div className="animate-in fade-in slide-in-from-top-2 absolute top-full left-0 z-[110] mt-3 w-[300px] rounded-2xl border border-slate-50 bg-white p-6 shadow-2xl">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400">
                      Sắp xếp theo
                    </label>
                    <select className="w-full rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm font-bold outline-none">
                      <option>Mới nhất</option>
                      <option>Số tiền lớn nhất</option>
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
                      className="flex-1 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white"
                    >
                      Áp dụng
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* TÌM KIẾM NHANH */}
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm mã hoặc người nộp..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-56 rounded-xl border border-slate-100 bg-slate-50 py-2.5 pr-10 pl-4 text-sm font-bold outline-none focus:border-indigo-500 dark:bg-slate-800"
            />
            <Search
              size={18}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-300"
            />
          </div>

          {/* CÁC TAB HOẠT ĐỘNG */}
          <div className="flex gap-1 rounded-xl bg-slate-50 p-1 dark:bg-slate-800">
            {Object.entries(counts).map(([name, count]) => (
              <button
                key={name}
                onClick={() => setActiveTab(name)}
                className={`rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                  activeTab === name
                    ? "bg-white text-indigo-700 shadow-sm dark:bg-slate-700"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {name}{" "}
                <span
                  className={`ml-1 ${activeTab === name ? "text-blue-400" : "text-slate-300"}`}
                >
                  ({count})
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* TỔNG TIỀN ĐỘNG */}
        <div className="rounded-xl bg-[#22C55E] px-6 py-2.5 shadow-lg shadow-green-500/20">
          <span className="text-sm font-bold tracking-normal text-white italic">
            Tổng tiền {activeTab}: {formatVND(totalAmount)}
          </span>
        </div>
      </div>

      {/* --- TABLE: CẬP NHẬT THEO TAB --- */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] border-collapse text-left text-[13px]">
          <thead>
            <tr className="border-b bg-slate-50/30 text-sm font-extrabold tracking-wider text-slate-900 dark:border-slate-700 dark:text-white">
              <th className="px-6 py-4">Mã đơn</th>
              <th className="px-6 py-4">Người yêu cầu duyệt</th>
              <th className="px-6 py-4 text-right">Số tiền nộp</th>
              <th className="px-6 py-4">Thời gian</th>
              <th className="px-6 py-4">Ghi chú nghiệp vụ</th>
              <th className="px-6 py-4 text-center">Trạng thái</th>
              <th className="px-6 py-4 text-center">Tác vụ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr
                  key={index}
                  className="group animate-in fade-in transition-colors duration-300 hover:bg-slate-50/20"
                >
                  <td className="px-6 py-5 font-bold text-slate-900 italic dark:text-slate-300">
                    {item.id}
                  </td>
                  <td className="cursor-pointer px-6 py-5 font-bold text-indigo-700 hover:underline">
                    {item.requester}
                  </td>
                  <td className="px-6 py-5 text-right font-bold text-slate-900 dark:text-slate-200">
                    {formatVND(item.amount)}
                  </td>
                  <td className="px-6 py-5 font-bold text-slate-400">
                    {item.time}
                  </td>
                  <td className="max-w-[150px] truncate px-6 py-5 font-medium text-slate-400">
                    {item.note || "---"}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-center">
                      <span
                        className={`rounded-lg px-4 py-1.5 text-[10px] font-bold text-white italic ${item.status === "Đã duyệt" ? "bg-[#22C55E]" : item.status === "Không duyệt" ? "bg-[#EF4444]" : "bg-orange-400"}`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-center">
                      <button
                        onClick={() => alert("Đã xóa yêu cầu " + item.id)}
                        className="text-rose-500 opacity-40 transition-all hover:scale-125 hover:opacity-100"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="text-slate-4 leading-relaxed00 px-6 py-20 text-center text-sm font-bold italic"
                >
                  Không có dữ liệu {activeTab}...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- FOOTER: ĐỒNG BỘ --- */}
      <div className="flex items-center justify-end border-t bg-slate-50/10 p-6 dark:border-slate-700">
        <div className="flex items-center gap-6 text-[11px] font-bold text-slate-600">
          <span>Đang hiển thị: {filteredData.length} kết quả</span>
          <div className="flex items-center gap-1.5">
            <button className="p-1 text-slate-300 hover:text-indigo-600">
              <ChevronLeft size={16} />
            </button>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 font-bold text-white shadow-lg">
              1
            </span>
            <button className="p-1 text-slate-300 hover:text-indigo-600">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentApproval;
