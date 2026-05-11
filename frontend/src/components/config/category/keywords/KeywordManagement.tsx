"use client";
import React, { useState, useMemo } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Hash,
  Search,
} from "lucide-react";
import { initialKeywordData, KeywordItem } from "./keywordData";
import AddKeywordModal from "./AddKeywordModal";

const KeywordManagement = () => {
  const [activeTab, setActiveTab] = useState<"Câu hỏi" | "Bộ đề">("Câu hỏi");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- LOGIC LỌC DỮ LIỆU THEO TAB ---
  const filteredData = useMemo(() => {
    return initialKeywordData.filter((item) => item.type === activeTab);
  }, [activeTab]);

  return (
    <div className="overflow-hidden rounded-[32px] border border-slate-100 bg-white font-sans shadow-sm dark:border-slate-700 dark:bg-slate-900">
      {/* --- HEADER: TABS & THÊM MỚI --- */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b p-6 dark:border-slate-700">
        <div className="flex items-center gap-8">
          <button
            onClick={() => setActiveTab("Câu hỏi")}
            className={`relative pb-4 text-sm font-bold tracking-widest transition-all ${
              activeTab === "Câu hỏi"
                ? "text-indigo-700 after:absolute after:bottom-[-1.55rem] after:left-0 after:h-1 after:w-full after:rounded-full after:bg-blue-600"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            Từ khóa Câu hỏi
          </button>
          <button
            onClick={() => setActiveTab("Bộ đề")}
            className={`relative pb-4 text-sm font-bold tracking-widest transition-all ${
              activeTab === "Bộ đề"
                ? "text-indigo-700 after:absolute after:bottom-[-1.55rem] after:left-0 after:h-1 after:w-full after:rounded-full after:bg-blue-600"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            Từ khóa Bộ đề
          </button>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-[#22C55E] px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-green-500/20 transition-all hover:bg-green-600 active:scale-95"
        >
          <Plus size={18} /> Thêm mới
        </button>
      </div>

      {/* --- TABLE: DANH SÁCH --- */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] border-collapse text-left text-[13px]">
          <thead>
            <tr className="border-b bg-slate-50/30 text-sm font-extrabold tracking-wider text-slate-900 dark:border-slate-700 dark:text-white">
              <th className="w-16 px-6 py-5 text-center">#ID</th>
              <th className="px-6 py-5">Tên từ khóa hiển thị</th>
              <th className="px-6 py-5">Người khởi tạo</th>
              <th className="px-6 py-5">Ngày giờ tạo</th>
              <th className="px-8 py-5 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-slate-900 dark:divide-slate-800 dark:text-slate-300">
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <tr
                  key={item.id}
                  className="group animate-in fade-in transition-colors duration-300 hover:bg-slate-50/20"
                >
                  <td className="px-6 py-6 text-center font-bold text-slate-400 italic">
                    {item.id.toString().padStart(2, "0")}
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-blue-50 p-2 text-indigo-700 dark:bg-blue-900/20">
                        <Hash size={16} />
                      </div>
                      <span className="cursor-pointer font-bold text-slate-900 hover:text-indigo-700 hover:underline dark:text-slate-200">
                        {item.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-6 font-bold text-slate-600 dark:text-slate-400">
                    {item.creator}
                  </td>
                  <td className="px-6 py-6 font-bold text-slate-400">
                    {item.date}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-center gap-4 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        title="Chỉnh sửa"
                        className="text-slate-400 transition-colors hover:text-indigo-600"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        title="Xóa từ khóa"
                        className="text-slate-400 transition-transform hover:scale-125 hover:text-rose-500"
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
                  colSpan={5}
                  className="text-slate-4 leading-relaxed00 px-6 py-20 text-center text-sm font-bold italic"
                >
                  Chưa có từ khóa nào cho mục {activeTab}...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- FOOTER: ĐỒNG BỘ --- */}
      <div className="flex items-center justify-end border-t bg-slate-50/10 p-5 dark:border-slate-700">
        <span className="mr-6 text-[11px] font-bold text-slate-600">
          Tổng cộng: {filteredData.length} tag
        </span>
        <div className="flex items-center gap-1.5">
          <button className="p-1 text-slate-300 transition-colors hover:text-indigo-700">
            <ChevronLeft size={16} />
          </button>
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 font-bold text-white shadow-lg shadow-blue-200">
            1
          </span>
          <button className="p-1 text-slate-300 transition-colors hover:text-indigo-700">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <AddKeywordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default KeywordManagement;
