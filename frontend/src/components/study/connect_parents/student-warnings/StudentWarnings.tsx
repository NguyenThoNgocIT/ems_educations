"use client";
import React, { useState, useMemo } from "react";
import {
  Search,
  Plus,
  AlertTriangle,
  Trash2,
  Edit3,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { warningData } from "./warningData";
import AddWarningModal from "./AddWarningModal";

const StudentWarnings = () => {
  // --- TRẠNG THÁI HỆ THỐNG ---
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- LOGIC TÌM KIẾM THEO TÊN HOẶC MÃ HV ---
  const filteredData = useMemo(() => {
    return warningData.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery]);

  return (
    <div className="overflow-hidden rounded-[32px] border border-slate-100 bg-white font-sans shadow-sm dark:border-slate-700 dark:bg-slate-900">
      {/* --- HEADER HOÀN CHỈNH --- */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b p-6 dark:border-slate-700">
        <div className="flex max-w-md flex-1 items-center gap-3">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Tra cứu tên hoặc mã học viên bị cảnh báo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-100 bg-slate-50 py-2.5 pr-10 pl-4 text-sm font-bold outline-none focus:ring-2 focus:ring-amber-500/10 dark:bg-slate-800"
            />
            <Search
              size={18}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400"
            />
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-[#F59E0B] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-amber-500/20 transition-all active:scale-95"
        >
          <Plus size={18} /> Thêm cảnh báo
        </button>
      </div>

      {/* --- TABLE: DANH SÁCH CẢNH BÁO --- */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] border-collapse text-left">
          <thead>
            <tr className="border-b bg-slate-50/30 text-sm font-extrabold tracking-wider text-slate-900 dark:border-slate-700 dark:text-white">
              <th className="w-10 px-6 py-4 text-center">+</th>
              <th className="px-6 py-4">Thông tin học viên</th>
              <th className="px-6 py-4">Số điện thoại</th>
              <th className="px-6 py-4">Nội dung cảnh báo</th>
              <th className="px-6 py-4">Người tạo</th>
              <th className="px-6 py-4 text-center">Ngày tạo</th>
              <th className="px-6 py-4 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-[13px] dark:divide-slate-800">
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr
                  key={item.id}
                  className="group transition-colors hover:bg-slate-50/20"
                >
                  <td className="px-6 py-6 text-center font-bold text-slate-300">
                    +
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-900/20">
                        <User size={20} className="text-amber-500" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 dark:text-slate-200">
                          {item.name}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">
                          {item.id}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 font-bold text-slate-600 dark:text-slate-400">
                    {item.phone}
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-2 font-bold text-rose-500">
                      <AlertTriangle size={14} className="shrink-0" />
                      {item.content}
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className="font-bold text-indigo-700 underline decoration-blue-100">
                      {item.createdBy}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-center font-bold text-slate-600">
                    {item.createdAt}
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center justify-center gap-4 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        title="Sửa"
                        className="text-slate-400 hover:text-indigo-600"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        title="Xóa"
                        className="text-slate-400 hover:text-rose-500"
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
                  Không tìm thấy cảnh báo nào phù hợp...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- FOOTER: ĐỒNG BỘ --- */}
      <div className="flex items-center justify-end border-t bg-slate-50/20 p-5 dark:border-slate-700">
        <span className="mr-4 text-xs font-bold text-slate-600">
          Tổng cộng: {filteredData.length}
        </span>
        <div className="flex items-center gap-1">
          <button className="p-1 text-slate-300 transition-colors hover:text-amber-500">
            <ChevronLeft size={16} />
          </button>
          <span className="flex h-6 w-6 items-center justify-center rounded border border-amber-100 bg-amber-50 text-[10px] font-bold text-amber-600 shadow-sm">
            1
          </span>
          <button className="p-1 text-slate-300 transition-colors hover:text-amber-500">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Modal kích hoạt khi nhấn nút */}
      <AddWarningModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default StudentWarnings;
