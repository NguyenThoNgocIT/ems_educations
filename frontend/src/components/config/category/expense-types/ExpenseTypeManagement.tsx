"use client";
import React, { useState, useMemo } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import { expenseTypeData } from "./expenseTypeData";
import AddExpenseTypeModal from "./AddExpenseTypeModal";

const ExpenseTypeManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- LOGIC TÌM KIẾM ---
  const filteredData = useMemo(() => {
    return expenseTypeData.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery]);

  return (
    <div className="overflow-hidden rounded-[32px] border border-slate-100 bg-white font-sans shadow-sm dark:border-slate-700 dark:bg-slate-900">
      {/* --- HEADER: TÌM KIẾM & THÊM MỚI --- */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b p-6 dark:border-slate-700">
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            placeholder="Tìm loại phiếu chi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-100 bg-slate-50 py-2.5 pr-10 pl-4 text-sm font-bold transition-all outline-none focus:border-indigo-500 dark:bg-slate-800"
          />
          <Search
            size={18}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-300"
          />
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
        <table className="w-full min-w-[800px] border-collapse text-left">
          <thead>
            <tr className="border-b bg-slate-50/30 text-sm font-extrabold tracking-wider text-slate-900 dark:border-slate-700 dark:text-white">
              <th className="px-8 py-5">Danh mục chi phí</th>
              <th className="px-8 py-5">Người khởi tạo</th>
              <th className="px-8 py-5">Thời gian tạo</th>
              <th className="px-8 py-5 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-[13px] dark:divide-slate-800">
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr
                  key={index}
                  className="group animate-in fade-in transition-colors duration-300 hover:bg-slate-50/20"
                >
                  <td className="cursor-pointer px-8 py-6 font-bold text-indigo-700 italic hover:underline">
                    {item.name}
                  </td>
                  <td className="px-8 py-6 font-bold text-slate-900 dark:text-slate-300">
                    {item.creator}
                  </td>
                  <td className="px-8 py-6 font-bold text-slate-400">
                    {item.createdAt}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-center gap-4 text-slate-400 opacity-40 transition-opacity group-hover:opacity-100">
                      <button
                        title="Chỉnh sửa"
                        className="transition-colors hover:text-indigo-600"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        title="Xóa danh mục"
                        className="transition-transform hover:scale-125 hover:text-rose-500"
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
                  Không tìm thấy loại phiếu chi nào...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- FOOTER PHÂN TRANG --- */}
      <div className="flex items-center justify-end border-t bg-slate-50/10 p-5 dark:border-slate-700">
        <span className="mr-6 text-[11px] font-bold tracking-normal text-slate-600">
          Tổng số: {filteredData.length} danh mục
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

      <AddExpenseTypeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default ExpenseTypeManagement;
