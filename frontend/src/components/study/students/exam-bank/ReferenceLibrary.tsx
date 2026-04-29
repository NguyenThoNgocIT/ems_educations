"use client";
import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Plus,
  FileText,
  Download,
  Edit3,
  Trash2,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { referenceData } from "./referenceData";
import AddDocumentModal from "./AddDocumentModal"; // Import Modal mới

const ReferenceLibrary = () => {
  // --- TRẠNG THÁI (STATE) ---
  const [isModalOpen, setIsModalOpen] = useState(false); // Quản lý mở modal thêm mới
  const [searchQuery, setSearchQuery] = useState(""); // Quản lý nội dung tìm kiếm

  // --- LOGIC LỌC DỮ LIỆU ---
  const filteredData = useMemo(() => {
    return referenceData.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery]);

  return (
    <div className="overflow-hidden rounded-[32px] border border-slate-100 bg-white font-sans shadow-sm dark:border-slate-700 dark:bg-slate-900">
      {/* --- HEADER HOÀN CHỈNH --- */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b p-6 dark:border-slate-700">
        <div className="flex min-w-[300px] flex-1 items-center gap-3">
          {/* Ô tìm kiếm đã hoạt động */}
          <div className="relative w-full max-w-sm">
            <input
              type="text"
              placeholder="Tra cứu tên hoặc mã tài liệu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-100 bg-slate-50 py-2.5 pr-10 pl-4 text-sm font-bold outline-none focus:border-indigo-500 dark:bg-slate-800"
            />
            <Search
              size={18}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400"
            />
          </div>
        </div>

        {/* Nút Thêm mới đã hoạt động (Màu xanh lá đặc trưng) */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-[#22C55E] px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-green-500/20 transition-all active:scale-95"
        >
          <Plus size={18} /> Thêm tài liệu
        </button>
      </div>

      {/* --- PHẦN BẢNG DỮ LIỆU --- */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1200px] border-collapse text-left">
          <thead>
            <tr className="border-b bg-slate-50/30 text-sm font-extrabold tracking-wider text-slate-900 dark:border-slate-700 dark:text-white">
              <th className="w-10 px-6 py-4 text-center">+</th>
              <th className="px-6 py-4">Tên tài liệu</th>
              <th className="px-6 py-4">Phân loại</th>
              <th className="px-6 py-4 text-center">Định dạng</th>
              <th className="px-6 py-4 text-center">Dung lượng</th>
              <th className="px-6 py-4 text-center">Lượt tải</th>
              <th className="px-6 py-4">Người tải lên</th>
              <th className="px-6 py-4 text-center">Chức năng</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-[13px] dark:divide-slate-800">
            {filteredData.map((doc, index) => (
              <tr
                key={index}
                className="group transition-colors hover:bg-slate-50/20"
              >
                <td className="px-6 py-5 text-center font-bold text-slate-300">
                  +
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="cursor-pointer font-bold text-indigo-700 hover:underline">
                      {doc.title}
                    </span>
                    <span className="mt-0.5 text-[10px] font-bold text-slate-400">
                      {doc.id}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-1 text-[10px] font-bold text-indigo-700">
                    {doc.category}
                  </span>
                </td>
                <td className="px-6 py-5 text-center">
                  <FileText
                    size={18}
                    className={
                      doc.format === "PDF" ? "text-rose-500" : "text-indigo-600"
                    }
                  />
                </td>
                <td className="px-6 py-5 text-center font-bold text-slate-600">
                  {doc.size}
                </td>
                <td className="px-6 py-5 text-center">
                  <span className="rounded-md border border-slate-100 bg-slate-50 px-2 py-1 font-bold text-slate-600">
                    {doc.downloadCount}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50">
                      <User size={14} className="text-slate-400" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 dark:text-slate-300">
                        {doc.creator}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">
                        {doc.createdAt}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center justify-center gap-4 text-slate-400">
                    <button
                      title="Tải xuống"
                      className="transition-colors hover:text-emerald-500"
                    >
                      <Download size={18} />
                    </button>
                    <button
                      title="Sửa"
                      className="transition-colors hover:text-indigo-600"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button
                      title="Xóa"
                      className="transition-colors hover:text-rose-500"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal được gọi ở đây */}
      <AddDocumentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default ReferenceLibrary;
