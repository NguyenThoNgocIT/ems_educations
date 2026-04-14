"use client";
import React, { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Filter,
  MessageCircle,
} from "lucide-react";
import { initialFAQData, FAQItem } from "./faqData";
import AddFAQModal from "./AddFAQModal";

const FAQManagement = () => {
  const [activeTab, setActiveTab] = useState("Tất cả");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- LOGIC TÍNH TOÁN TAB COUNTS ---
  const tabCounts = useMemo(
    () => ({
      "Tất cả": initialFAQData.length,
      "Giáo viên": initialFAQData.filter((i) => i.roles.includes("Giáo viên"))
        .length,
      "Học sinh": initialFAQData.filter((i) => i.roles.includes("Học sinh"))
        .length,
    }),
    [],
  );

  // --- LOGIC LỌC DỮ LIỆU KÉP ---
  const filteredData = useMemo(() => {
    return initialFAQData.filter((item) => {
      const matchTab = activeTab === "Tất cả" || item.roles.includes(activeTab);
      const matchSearch = item.question
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchTab && matchSearch;
    });
  }, [activeTab, searchQuery]);

  return (
    <div className="overflow-hidden rounded-[32px] border border-slate-100 bg-white font-sans shadow-sm dark:border-slate-700 dark:bg-slate-900">
      {/* --- HEADER: TABS & TÌM KIẾM --- */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b p-6 dark:border-slate-700">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-1 rounded-xl bg-slate-50 p-1 dark:bg-slate-800">
            {Object.entries(tabCounts).map(([name, count]) => (
              <button
                key={name}
                onClick={() => setActiveTab(name)}
                className={`rounded-lg px-5 py-2 text-xs font-bold transition-all ${
                  activeTab === name
                    ? "bg-white text-indigo-700 shadow-sm dark:bg-slate-700"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {name} <span className="ml-1 opacity-40">({count})</span>
              </button>
            ))}
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Tìm nội dung câu hỏi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 rounded-xl border border-slate-100 bg-slate-50 py-2.5 pr-10 pl-4 text-sm font-bold outline-none focus:border-indigo-500 dark:bg-slate-800"
            />
            <Search
              size={18}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-300"
            />
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-[#22C55E] px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-green-500/20 transition-all hover:bg-green-600 active:scale-95"
        >
          <Plus size={18} /> Thêm câu hỏi
        </button>
      </div>

      {/* --- TABLE: DANH SÁCH --- */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] border-collapse text-left text-[13px]">
          <thead>
            <tr className="border-b bg-slate-50/30 text-sm font-extrabold tracking-wider text-slate-900 dark:border-slate-700 dark:text-white">
              <th className="w-10 px-6 py-4 text-center">+</th>
              <th className="px-6 py-4 italic">Nội dung câu hỏi FAQ</th>
              <th className="px-6 py-4">Đối tượng áp dụng</th>
              <th className="px-8 py-4 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-slate-900 dark:divide-slate-800 dark:text-slate-300">
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr
                  key={item.id}
                  className="group animate-in fade-in transition-colors duration-300 hover:bg-slate-50/20"
                >
                  <td className="px-6 py-6 text-center font-bold text-slate-300">
                    {(index + 1).toString().padStart(2, "0")}
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 rounded-lg bg-blue-50 p-1.5 text-indigo-700 dark:bg-blue-900/20">
                        <MessageCircle size={14} />
                      </div>
                      <span className="cursor-pointer leading-relaxed font-bold transition-colors hover:text-indigo-700">
                        {item.question}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span
                      className={`rounded-lg px-3 py-1 text-[10px] font-bold shadow-sm ${
                        item.roles.includes("Giáo viên")
                          ? "bg-amber-500 text-white"
                          : "bg-blue-500 text-white"
                      }`}
                    >
                      {item.roles}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-center gap-4 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        title="Sửa"
                        className="text-slate-400 transition-colors hover:text-indigo-600"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        title="Xóa"
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
                  colSpan={4}
                  className="text-slate-4 leading-relaxed00 px-6 py-20 text-center text-sm font-bold italic"
                >
                  Không tìm thấy câu hỏi nào cho {activeTab}...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- FOOTER: ĐỒNG BỘ --- */}
      <div className="flex items-center justify-end border-t bg-slate-50/10 p-5 dark:border-slate-700">
        <span className="mr-6 text-[11px] font-bold tracking-widest text-slate-600">
          Tổng cộng: {filteredData.length} câu hỏi
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

      <AddFAQModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default FAQManagement;
