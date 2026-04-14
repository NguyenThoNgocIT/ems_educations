"use client";
import React, { useState, useMemo } from "react";
import {
  Filter,
  Plus,
  Edit3,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import { refundData } from "./refundData";
import AddRefundModal from "./AddRefundModal";

const RefundManagement = () => {
  const [activeTab, setActiveTab] = useState("Tất cả");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // --- LOGIC TÍNH SỐ LƯỢNG TAB ĐỘNG ---
  const tabCounts = useMemo(
    () => ({
      "Tất cả": refundData.length,
      "Chờ duyệt": refundData.filter((i) => i.status === "Chờ duyệt").length,
      "Đã duyệt": refundData.filter((i) => i.status === "Đã duyệt").length,
      "Không duyệt": refundData.filter((i) => i.status === "Không duyệt")
        .length,
    }),
    [],
  );

  // --- LOGIC LỌC DỮ LIỆU KÉP ---
  const filteredData = useMemo(() => {
    return refundData.filter((item) => {
      const matchTab = activeTab === "Tất cả" || item.status === activeTab;
      const matchSearch = item.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchTab && matchSearch;
    });
  }, [activeTab, searchQuery]);

  // --- TỔNG TIỀN TỰ ĐỘNG THEO KẾT QUẢ LỌC ---
  const totalRefundAmount = useMemo(() => {
    return filteredData.reduce((sum, item) => sum + item.amount, 0);
  }, [filteredData]);

  const formatVND = (val: number) =>
    new Intl.NumberFormat("vi-VN").format(val) + " VND";

  return (
    <div className="overflow-hidden rounded-[32px] border border-slate-100 bg-white font-sans shadow-sm dark:border-slate-700 dark:bg-slate-900">
      {/* --- HEADER: TÌM KIẾM, TABS & TỔNG --- */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-50 p-6 dark:border-slate-700">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm tên học viên..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-56 rounded-xl border border-slate-100 bg-slate-50 py-2 pr-10 pl-4 text-sm font-bold outline-none focus:border-indigo-500 dark:bg-slate-800"
            />
            <Search
              size={18}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-300"
            />
          </div>

          <div className="flex gap-1 rounded-xl bg-slate-50 p-1 dark:bg-slate-800">
            {Object.entries(tabCounts).map(([name, count]) => (
              <button
                key={name}
                onClick={() => setActiveTab(name)}
                className={`rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                  activeTab === name
                    ? "bg-white text-indigo-700 shadow-sm dark:bg-slate-700"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {name} <span className="ml-1 opacity-40">({count})</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold tracking-widest text-slate-400">
              Tổng tiền hoàn {activeTab}
            </span>
            <span className="text-lg leading-normal font-bold tracking-normal text-rose-500 italic">
              {formatVND(totalRefundAmount)}
            </span>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-[#22C55E] px-6 py-3 text-xs font-bold text-white shadow-lg shadow-green-500/20 transition-all active:scale-95"
          >
            <Plus size={18} /> Thêm yêu cầu
          </button>
        </div>
      </div>

      {/* --- TABLE: DANH SÁCH --- */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1200px] border-collapse text-left">
          <thead>
            <tr className="border-b bg-slate-50/30 text-sm font-extrabold tracking-wider text-slate-900 dark:border-slate-700 dark:text-white">
              <th className="px-8 py-4">Thông tin học viên hoàn tiền</th>
              <th className="px-6 py-4">Số tiền yêu cầu</th>
              <th className="px-6 py-4">Loại yêu cầu</th>
              <th className="px-6 py-4">Ghi chú nghiệp vụ</th>
              <th className="px-6 py-4 text-center">Trạng thái duyệt</th>
              <th className="px-8 py-4 text-center">Tác vụ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-[13px] dark:divide-slate-800">
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr
                  key={item.id}
                  className="group animate-in fade-in transition-colors duration-300 hover:bg-slate-50/20"
                >
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-slate-900 dark:text-slate-200">
                        {item.name}
                      </span>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                        <span className="rounded bg-slate-50 px-1.5 py-0.5">
                          {item.center}
                        </span>
                        <span>Ngày tạo: {item.createdAt}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-base leading-relaxed font-bold text-rose-500 italic">
                    {formatVND(item.amount)}
                  </td>
                  <td className="px-6 py-6">
                    <span
                      className={`rounded-lg px-3 py-1.5 text-[9px] font-bold text-white ${
                        item.type === "Hoàn tiền chờ xếp lớp"
                          ? "bg-amber-500"
                          : item.type === "Hoàn tiền thủ công"
                            ? "bg-blue-500"
                            : "bg-emerald-500"
                      }`}
                    >
                      {item.type}
                    </span>
                  </td>
                  <td className="max-w-[200px] truncate px-6 py-6 font-bold text-slate-400 italic">
                    {item.note || "---"}
                  </td>
                  <td className="px-6 py-6 text-center">
                    <span
                      className={`rounded-lg px-4 py-1.5 text-[10px] font-bold text-white italic ${item.status === "Đã duyệt" ? "bg-[#22C55E]" : "bg-[#CBD5E1] text-slate-600"}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-center gap-4 opacity-0 transition-opacity group-hover:opacity-100">
                      <button className="text-slate-400 transition-colors hover:text-indigo-600">
                        <Edit3 size={18} />
                      </button>
                      <button className="text-slate-400 transition-colors hover:text-rose-500">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="text-slate-4 leading-relaxed00 px-6 py-20 text-center text-sm font-bold italic"
                >
                  Không có yêu cầu {activeTab} nào...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- FOOTER: ĐỒNG BỘ --- */}
      <div className="flex items-center justify-end border-t bg-slate-50/10 p-5 dark:border-slate-700">
        <span className="mr-6 text-[11px] font-bold text-slate-600">
          Tổng cộng: {filteredData.length} đơn hoàn tiền
        </span>
        <div className="flex items-center gap-1">
          <button className="p-1 text-slate-300 hover:text-indigo-600">
            <ChevronLeft size={16} />
          </button>
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 font-bold text-white shadow-lg">
            1
          </span>
          <button className="p-1 text-slate-300 hover:text-indigo-700">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <AddRefundModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};

export default RefundManagement;
