"use client";
import React from "react";
import { X, ArrowUpToLine, FileSpreadsheet } from "lucide-react";

const ImportStaffModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="animate-in fade-in fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm duration-200">
      <div className="animate-in zoom-in w-full max-w-lg rounded-[32px] bg-white p-8 shadow-2xl duration-300 dark:bg-slate-900">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-50 p-2 text-indigo-700">
              <ArrowUpToLine size={20} />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-snug leading-snug">
              Import nhân sự
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-slate-50"
          >
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        <div className="flex cursor-pointer flex-col items-center justify-center rounded-[28px] border-2 border-dashed border-slate-100 bg-slate-50 p-10 transition-colors hover:bg-blue-50/50 dark:bg-slate-800/50">
          <FileSpreadsheet size={48} className="mb-4 text-blue-400" />
          <p className="text-sm font-bold text-slate-6 leading-relaxed00 leading-relaxed">
            Kéo thả file Excel (.xlsx) vào đây
          </p>
          <p className="mt-1 text-[10px] font-bold text-slate-400 leading-relaxed">
            Dung lượng tối đa 10MB
          </p>
        </div>

        <div className="mt-8 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 text-sm font-bold text-slate-4 leading-relaxed00"
          >
            Đóng
          </button>
          <button
            onClick={() => {
              alert("Đã tải lên file thành công!");
              onClose();
            }}
            className="flex-1 rounded-2xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-500/20 transition-all active:scale-95"
          >
            Bắt đầu Import
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportStaffModal;



