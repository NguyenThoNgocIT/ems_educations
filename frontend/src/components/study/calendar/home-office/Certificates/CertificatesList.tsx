"use client";
import React from "react";
import { ChevronDown } from "lucide-react";

const CertificateConfig = () => {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-8 font-sans shadow-sm dark:border-slate-700 dark:bg-slate-900">
      {/* --- TIÊU ĐỀ --- */}
      <h2 className="mb-8 border-b pb-4 text-lg font-bold tracking-tight text-slate-900 italic dark:text-white/90 leading-normal leading-snug">
        Cấu hình mẫu chứng chỉ
      </h2>

      {/* --- FORM CẤU HÌNH --- */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-x-12 gap-y-6 md:grid-cols-2">
          {/* Cột Trái */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="flex gap-1 text-[13px] font-bold text-slate-900 dark:text-slate-300">
                <span className="text-red-500">*</span> Mẫu chứng chỉ
              </label>
              <div className="relative">
                <select className="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white p-3 text-sm font-medium transition-all outline-none focus:ring-2 focus:ring-indigo-500/10 dark:border-slate-600 dark:bg-slate-800">
                  <option value=""></option>
                </select>
                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex gap-1 text-[13px] font-bold text-slate-900 dark:text-slate-300">
                <span className="text-red-500">*</span> Khóa học
              </label>
              <input
                type="text"
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm font-medium transition-all outline-none focus:ring-2 focus:ring-indigo-500/10 dark:border-slate-600 dark:bg-slate-800"
              />
            </div>
          </div>

          {/* Cột Phải */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="flex gap-1 text-[13px] font-bold text-slate-900 dark:text-slate-300">
                <span className="text-red-500">*</span> Tên chứng chỉ
              </label>
              <input
                type="text"
                defaultValue="Certificate"
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm font-medium transition-all outline-none focus:ring-2 focus:ring-indigo-500/10 dark:border-slate-600 dark:bg-slate-800"
              />
            </div>

            <div className="space-y-2">
              <label className="flex gap-1 text-[13px] font-bold text-slate-900 dark:text-slate-300">
                <span className="text-red-500">*</span> Lời mở đầu
              </label>
              <input
                type="text"
                defaultValue="This is to ceritffy that"
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm font-medium transition-all outline-none focus:ring-2 focus:ring-indigo-500/10 dark:border-slate-600 dark:bg-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Nội dung (Full width) */}
        <div className="space-y-2">
          <label className="flex gap-1 text-[13px] font-bold text-slate-900 dark:text-slate-300">
            <span className="text-red-500">*</span> Nội dung
          </label>
          <textarea
            rows={5}
            className="w-full resize-none rounded-2xl border border-slate-200 bg-white p-4 text-sm font-medium transition-all outline-none focus:ring-2 focus:ring-indigo-500/10 dark:border-slate-600 dark:bg-slate-800"
          />
        </div>

        {/* --- NÚT LƯU CĂN GIỮA --- */}
        <div className="flex justify-center pt-4">
          <button className="rounded-xl border border-slate-200 bg-white px-10 py-2.5 text-sm font-bold text-slate-900 shadow-sm transition-all hover:bg-slate-50 active:scale-95 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-2 leading-relaxed00">
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default CertificateConfig;


