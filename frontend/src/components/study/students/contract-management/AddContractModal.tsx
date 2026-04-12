"use client";
import React from "react";
import { X, FileText } from "lucide-react";

interface AddContractModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddContractModal = ({ isOpen, onClose }: AddContractModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="animate-in fade-in fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm duration-200">
      <div className="animate-in zoom-in w-full max-w-lg rounded-[32px] bg-white p-8 shadow-2xl duration-300 dark:bg-slate-900">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-snug leading-snug">
            Tạo hợp đồng mới
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold tracking-widest text-slate-400">
              Tên hợp đồng
            </label>
            <input
              type="text"
              placeholder="Nhập tên hợp đồng..."
              className="w-full rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm font-bold outline-none focus:border-indigo-500 dark:bg-slate-800"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold tracking-widest text-slate-400">
              Mã học viên (Student ID)
            </label>
            <input
              type="text"
              placeholder="Ví dụ: HV241007-2"
              className="w-full rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm font-bold outline-none focus:border-indigo-500 dark:bg-slate-800"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 text-sm font-bold text-slate-600 transition-colors hover:text-slate-9 leading-relaxed00"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all active:scale-95"
            >
              Lưu hợp đồng
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddContractModal;



