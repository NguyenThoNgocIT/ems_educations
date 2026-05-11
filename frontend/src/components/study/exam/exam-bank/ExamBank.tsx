"use client";
import React, { useState, useMemo } from "react";
import {
  Search,
  Plus,
  LayoutGrid,
  List,
  FileText,
  Clock,
  Info,
  ChevronRight,
  Edit3,
  Trash2,
} from "lucide-react";

import { examsData } from "./examBankData";
import AddExamModal from "./AddExamModal";

const ExamBank = () => {
  // --- GIẢ LẬP ROLE (Sau này kết nối Backend sẽ lấy từ Auth) ---
  const [userRole] = useState("admin"); // Thử đổi thành "user" để test ẩn nút

  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredExams = useMemo(() => {
    return examsData.filter(
      (exam) =>
        exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exam.id.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery]);

  return (
    <div className="space-y-4 px-2 font-sans md:space-y-6 md:px-0">
      {/* --- HEADER: TOOLBAR --- */}
      <div className="flex flex-col items-stretch justify-between gap-4 rounded-[24px] border border-slate-100 bg-white p-4 shadow-sm md:flex-row md:items-center md:rounded-[32px] md:p-5 dark:border-slate-700 dark:bg-slate-900">
        <div className="flex items-center gap-3">
          <div className="flex rounded-xl bg-slate-50 p-1 dark:bg-slate-800">
            <button
              onClick={() => setViewMode("grid")}
              className={`rounded-lg p-2 transition-all ${viewMode === "grid" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-400"}`}
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`rounded-lg p-2 transition-all ${viewMode === "list" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-400"}`}
            >
              <List size={18} />
            </button>
          </div>

          <div className="relative flex-1 md:flex-none">
            <input
              type="text"
              placeholder="Tìm đề..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-100 bg-slate-50 py-2.5 pr-10 pl-4 text-sm font-bold outline-none focus:border-indigo-500 md:w-64 md:py-3 md:pl-5 dark:bg-slate-800"
            />
            <Search
              size={16}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-300"
            />
          </div>
        </div>

        {/* Nút Tạo mới cũng chỉ dành cho Admin */}
        {userRole === "admin" && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 rounded-2xl bg-[#22C55E] px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-green-600 active:scale-95"
          >
            <Plus size={20} /> Tạo đề mới
          </button>
        )}
      </div>

      {/* --- PHẦN HIỂN THỊ NỘI DUNG --- */}
      {filteredExams.length > 0 ? (
        viewMode === "grid" ? (
          <div className="animate-in fade-in grid grid-cols-1 gap-4 duration-500 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {filteredExams.map((exam, index) => (
              <div
                key={index}
                className="group relative flex flex-col justify-between rounded-[24px] border border-slate-100 bg-white p-5 shadow-sm transition-all hover:shadow-xl md:rounded-[28px] md:p-6 dark:border-slate-700 dark:bg-slate-900"
              >
                {/* --- NÚT CHỈNH SỬA Ở TRÊN (DÀNH CHO ADMIN) --- */}
                {userRole === "admin" && (
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      title="Chỉnh sửa đề thi"
                      className="rounded-xl bg-blue-50 p-2 text-indigo-700 shadow-sm transition-all hover:bg-blue-600 hover:text-white"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      title="Xóa đề thi"
                      className="rounded-xl bg-rose-50 p-2 text-rose-600 shadow-sm transition-all hover:bg-rose-600 hover:text-white"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}

                <div className="space-y-3 md:space-y-4">
                  <span className="inline-block rounded-lg bg-blue-50 px-2.5 py-1 text-[9px] font-bold text-indigo-700 md:text-[10px] dark:bg-blue-900/30">
                    CODE: {exam.id}
                  </span>

                  <h3 className="line-clamp-2 pr-12 text-base leading-snug font-bold text-slate-900 md:text-lg dark:text-white leading-normal leading-relaxed leading-tight leading-snug">
                    {exam.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold text-slate-400 md:gap-4 md:text-xs">
                    <div className="flex items-center gap-1.5">
                      <FileText size={14} />
                      <span>{exam.questions} câu</span>
                    </div>
                    <div className="flex items-center gap-1.5 border-l border-slate-100 pl-3 md:pl-4">
                      <Clock size={14} />
                      <span>{exam.duration}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Card: Chỉ giữ lại nút Chi tiết */}
                <div className="mt-6 flex items-center justify-between border-t border-slate-50 pt-4 md:mt-8 md:pt-5 dark:border-slate-700">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-50 text-slate-400 md:h-8 md:w-8">
                    <Info size={14} />
                  </div>
                  <button className="flex items-center gap-1 text-xs font-bold text-indigo-700 hover:underline md:text-sm">
                    Chi tiết đề thi <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* --- LIST VIEW --- */
          <div className="overflow-x-auto rounded-[24px] border border-slate-100 shadow-sm md:rounded-[32px]">
            <table className="w-full min-w-[600px] border-collapse bg-white text-left dark:bg-slate-900">
              <thead>
                <tr className="border-b bg-slate-50/30 text-[10px] font-bold tracking-widest text-slate-600 md:text-[11px] dark:border-slate-700">
                  <th className="px-4 py-4 md:px-8">Mã đề</th>
                  <th className="px-4 py-4 md:px-6">Tiêu đề</th>
                  <th className="px-4 py-4 text-center md:px-6">Câu hỏi</th>
                  <th className="px-4 py-4 text-center md:px-6">Thời gian</th>
                  {userRole === "admin" && (
                    <th className="px-4 py-4 text-center md:px-8">Quản lý</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {filteredExams.map((exam, index) => (
                  <tr
                    key={index}
                    className="group text-xs hover:bg-slate-50/20 md:text-sm"
                  >
                    <td className="px-4 py-4 font-bold text-indigo-700 md:px-8">
                      {exam.id}
                    </td>
                    <td className="px-4 py-4 font-bold text-slate-900 md:px-6 dark:text-slate-200">
                      {exam.title}
                    </td>
                    <td className="px-4 py-4 text-center text-slate-600 md:px-6">
                      {exam.questions}
                    </td>
                    <td className="px-4 py-4 text-center font-bold text-indigo-600 italic md:px-6">
                      {exam.duration}
                    </td>
                    {userRole === "admin" && (
                      <td className="px-4 py-4 md:px-8">
                        <div className="flex items-center justify-center gap-2">
                          <button className="rounded-lg p-1 text-indigo-600 hover:bg-blue-50">
                            <Edit3 size={16} />
                          </button>
                          <button className="rounded-lg p-1 text-rose-500 hover:bg-rose-50">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        <div className="rounded-[24px] border-2 border-dashed border-slate-100 bg-white py-20 text-center">
          <FileText size={40} className="mx-auto mb-4 text-slate-200" />
          <p className="text-xs font-bold text-slate-400 italic md:text-sm leading-relaxed">
            Không tìm thấy đề thi...
          </p>
        </div>
      )}

      <AddExamModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default ExamBank;



