"use client";
import React, { useState } from "react";
import { Plus, MoreHorizontal, Box, MessageSquare } from "lucide-react";

const topics = [
  "Lịch sử 11",
  "1",
  "Nu",
  "Tips chinh phục 8.0 ielts trong vòng 6 tháng",
  "Tài liệu từ vựng và ngữ pháp nâng cao cho IELTS",
  "Tài liệu Luyện nói (Speaking) cho IELTS",
  "Tài liệu Luyện Nghe (Listening) và Luyện Đọc (Reading) cho IELTS",
  "Tài liệu Luyện kỹ năng Viết (Writing) cho IELTS",
  "Tài liệu về Cấu trúc và Chiến lược Làm bài IELTS",
];

const ReferenceMaterials = () => {
  const [activeTopic, setActiveTopic] = useState("Lịch sử 11");

  return (
    <div className="flex flex-col gap-6 font-sans md:flex-row">
      {/* --- CỘT TRÁI: DANH SÁCH CHỦ ĐỀ --- */}
      <div className="h-fit w-full overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm md:w-[400px] dark:border-slate-700 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b p-5 dark:border-slate-700">
          <h2 className="text-sm font-bold tracking-tight text-slate-9 leading-relaxed00 dark:text-white/90 leading-snug">
            Danh sách chủ đề
          </h2>
          <button className="flex items-center gap-1.5 rounded-lg bg-[#22C55E] px-3 py-1.5 text-[10px] font-semibold text-white transition-all hover:bg-green-600">
            <Plus size={14} /> Thêm mới
          </button>
        </div>

        <div className="no-scrollbar max-h-[700px] space-y-3 overflow-y-auto p-4">
          {topics.map((topic) => (
            <div
              key={topic}
              onClick={() => setActiveTopic(topic)}
              className={`group flex cursor-pointer items-center justify-between rounded-xl border-2 p-4 transition-all ${
                activeTopic === topic
                  ? "border-indigo-500 bg-white shadow-sm"
                  : "border-slate-50 bg-slate-50/30 hover:border-slate-200"
              }`}
            >
              <span
                className={`flex-1 pr-4 text-xs font-bold ${
                  activeTopic === topic ? "text-indigo-700" : "text-slate-600"
                }`}
              >
                {topic}
              </span>
              <button className="text-slate-400 hover:text-slate-600">
                <MoreHorizontal size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* --- CỘT PHẢI: DANH SÁCH TÀI LIỆU --- */}
      <div className="flex min-h-[600px] flex-1 flex-col rounded-[32px] border border-slate-100 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b p-5 dark:border-slate-700">
          <h2 className="text-sm font-bold tracking-tight text-slate-9 leading-relaxed00 dark:text-white leading-snug">
            Danh sách tài liệu
          </h2>
          <button className="flex items-center gap-1.5 rounded-lg bg-[#22C55E] px-3 py-1.5 text-[10px] font-bold text-white transition-all hover:bg-green-600">
            <Plus size={14} /> Thêm
          </button>
        </div>

        {/* Trạng thái Trống (Empty State) */}
        <div className="flex flex-1 flex-col items-center justify-center p-12 text-center">
          <div className="relative mb-4">
            {/* Icon hộp tài liệu rỗng */}
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 dark:border-slate-600 dark:bg-slate-800">
              <Box size={48} className="text-slate-200" strokeWidth={1} />
            </div>
            {/* Bong bóng chat nhỏ */}
            <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full border border-slate-50 bg-white shadow-sm dark:bg-slate-900">
              <MessageSquare size={14} className="text-slate-300" />
            </div>
          </div>
          <p className="text-sm font-bold text-slate-4 leading-relaxed00 leading-relaxed">Trống</p>
        </div>
      </div>
    </div>
  );
};

export default ReferenceMaterials;



