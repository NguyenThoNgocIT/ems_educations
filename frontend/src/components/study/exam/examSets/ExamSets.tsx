"use client";
import React, { useState, useMemo } from "react";
import {
  Search,
  Plus,
  MoreVertical,
  ShoppingCart,
  List,
  FileText,
} from "lucide-react";
import { examSetsData } from "./examSetsData";
import AddExamSetModal from "./AddExamSetModal";

const ExamSets = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- LOGIC TÌM KIẾM BỘ ĐỀ ---
  const filteredData = useMemo(() => {
    return examSetsData.filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery]);

  return (
    <div className="space-y-6 font-sans">
      {/* --- HEADER: TÌM KIẾM & TẠO MỚI --- */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="space-y-1">
          <h2 className="text-xl leading-snug font-bold tracking-tight text-slate-900 dark:text-white">
            Danh sách bộ đề
          </h2>
          <p className="text-[10px] leading-relaxed font-bold tracking-widest text-slate-400 italic">
            Quản lý kho đề thi hệ thống
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm tên bộ đề..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-72 rounded-xl border border-slate-100 bg-slate-50 py-3 pr-10 pl-5 text-sm font-bold transition-all outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 dark:bg-slate-800"
            />
            <Search
              size={18}
              className="absolute top-1/2 right-4 -translate-y-1/2 text-slate-300"
            />
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-2xl bg-[#22C55E] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-green-500/20 transition-all active:scale-95"
          >
            <Plus size={20} /> Tạo mới
          </button>
        </div>
      </div>

      {/* --- GRID DANH SÁCH BỘ ĐỀ --- */}
      {filteredData.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredData.map((item) => (
            <div
              key={item.id}
              className="group overflow-hidden rounded-[32px] border border-slate-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:border-slate-700 dark:bg-slate-900"
            >
              {/* Ảnh bìa */}
              <div
                className={`relative aspect-[16/10] ${item.color} flex items-center justify-center overflow-hidden`}
              >
                <div className="absolute inset-0 bg-black/5 opacity-0 transition-opacity group-hover:opacity-100" />

                <div className="absolute right-4 bottom-4 flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur-md">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px]">
                    🐼
                  </div>
                  <span className="text-[10px] font-bold tracking-normal text-white">
                    Mona.Software
                  </span>
                </div>

                <button className="absolute top-4 right-4 z-10 rounded-xl bg-white/20 p-2 text-white shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:text-slate-900">
                  <MoreVertical size={20} />
                </button>

                <FileText
                  size={100}
                  className="transform text-white/20 transition-transform group-hover:scale-110"
                  strokeWidth={1}
                />
              </div>

              {/* Nội dung chi tiết */}
              <div className="space-y-5 p-8">
                <div className="space-y-2">
                  <h3 className="truncate text-lg leading-normal leading-snug leading-tight font-bold text-slate-900 transition-colors group-hover:text-indigo-700 dark:text-white">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] font-bold tracking-tight text-slate-400">
                    <ShoppingCart size={14} className="text-slate-300" />
                    <span>{item.sales} lượt mua hệ thống</span>
                  </div>
                </div>

                <div className="text-xl leading-snug font-bold text-[#22C55E] italic">
                  {item.price}
                </div>

                <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 py-4 text-xs font-bold tracking-[0.1em] text-white shadow-lg transition-all hover:bg-blue-600 active:scale-95">
                  <List size={18} /> Chi tiết bộ đề
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-[32px] border-2 border-dashed border-slate-100 bg-white py-32 text-center">
          <FileText size={48} className="mx-auto mb-4 text-slate-200" />
          <p className="text-slate-4 leading-relaxed00 text-sm leading-relaxed font-bold italic">
            Không tìm thấy bộ đề thi nào...
          </p>
        </div>
      )}

      {/* MODAL ĐƯỢC GỌI Ở ĐÂY */}
      <AddExamSetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default ExamSets;
