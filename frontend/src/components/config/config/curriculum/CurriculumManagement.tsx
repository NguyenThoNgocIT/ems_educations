"use client";
import React, { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Info,
  UserPlus,
  ArrowUp,
  ArrowDown,
  Edit3,
  Trash2,
  LayoutList,
} from "lucide-react";
import { expertiseTabs, initialCurriculumData } from "./curriculumData";
import AddCurriculumModal from "./AddCurriculumModal";

const CurriculumManagement = () => {
  const [activeTab, setActiveTab] = useState("Marketing");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- LOGIC LỌC DỮ LIỆU KÉP (TAB + SEARCH) ---
  const filteredData = useMemo(() => {
    return initialCurriculumData.filter((item) => {
      const matchTab = item.expertise === activeTab;
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchTab && matchSearch;
    });
  }, [activeTab, searchQuery]);

  const formatVND = (val: number) =>
    new Intl.NumberFormat("vi-VN").format(val) + "đ";

  return (
    <div className="space-y-6 px-2 font-sans md:px-0">
      {/* --- THANH TABS CHUYÊN MÔN: ĐỒNG BỘ --- */}
      <div className="no-scrollbar flex items-center gap-8 overflow-x-auto border-b border-slate-100 pb-1 dark:border-slate-700">
        {expertiseTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setSearchQuery("");
            }}
            className={`relative pb-4 text-sm font-bold tracking-normal whitespace-nowrap transition-all ${
              activeTab === tab
                ? "text-indigo-700 after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full after:rounded-full after:bg-blue-600"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* --- HEADER TÁC VỤ: LOGIC CHUẨN --- */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-[28px] border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder={`Tìm khóa học trong mục ${activeTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-100 bg-slate-50 py-3 pr-10 pl-5 text-sm font-bold transition-all outline-none focus:border-indigo-500 dark:bg-slate-800"
          />
          <Search
            size={18}
            className="absolute top-1/2 right-4 -translate-y-1/2 text-slate-300"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => alert("Danh sách chuyên môn")}
            className="flex items-center gap-2 rounded-xl bg-amber-50 px-5 py-2.5 text-xs font-bold text-amber-600 transition-all hover:bg-amber-100"
          >
            <LayoutList size={16} /> Chuyên môn
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-[#22C55E] px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-green-500/20 transition-all active:scale-95"
          >
            <Plus size={18} /> Thêm mới
          </button>
        </div>
      </div>

      {/* --- BẢNG DỮ LIỆU --- */}
      <div className="overflow-hidden rounded-[32px] border border-slate-100 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b bg-slate-50/30 text-sm font-extrabold tracking-wider text-slate-900 dark:border-slate-700 dark:text-white">
                <th className="px-6 py-5">Mã học phần</th>
                <th className="px-6 py-5">Tên chương trình đào tạo</th>
                <th className="px-6 py-5 text-center">Cấp bậc</th>
                <th className="px-6 py-5 text-center">Học phí niêm yết</th>
                <th className="px-6 py-5 text-center">Chuyên môn</th>
                <th className="px-6 py-5">Người tạo</th>
                <th className="px-6 py-5">Ngày tạo</th>
                <th className="px-8 py-5 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr
                    key={index}
                    className="group animate-in fade-in transition-colors duration-300 hover:bg-slate-50/20"
                  >
                    <td className="px-6 py-6 font-bold text-slate-600 italic">
                      {item.id}
                    </td>
                    <td className="cursor-pointer px-6 py-6 font-bold text-indigo-700 hover:underline">
                      {item.name}
                    </td>
                    <td className="px-6 py-6 text-center font-bold text-slate-900 dark:text-slate-300">
                      Level {item.level}
                    </td>
                    <td className="px-6 py-6 text-center text-base leading-relaxed font-bold text-emerald-600 italic">
                      {formatVND(item.fee)}
                    </td>
                    <td className="px-6 py-6 text-center">
                      <span className="rounded-lg bg-slate-50 px-3 py-1 text-[10px] font-bold text-slate-600 dark:bg-slate-800">
                        {item.expertise}
                      </span>
                    </td>
                    <td className="px-6 py-6 font-bold text-slate-600 dark:text-slate-400">
                      {item.creator}
                    </td>
                    <td className="px-6 py-6 font-bold text-slate-400">
                      {item.date}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-center gap-3 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100">
                        <Info
                          size={18}
                          className="cursor-pointer hover:text-indigo-600"
                        />
                        <UserPlus
                          size={18}
                          className="cursor-pointer hover:text-emerald-500"
                        />
                        <Edit3
                          size={18}
                          className="cursor-pointer hover:text-indigo-700"
                        />
                        <Trash2
                          size={18}
                          className="cursor-pointer hover:text-rose-500"
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="text-slate-4 leading-relaxed00 px-6 py-20 text-center text-sm font-bold italic"
                  >
                    Chưa có chương trình học cho chuyên môn {activeTab}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddCurriculumModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default CurriculumManagement;
