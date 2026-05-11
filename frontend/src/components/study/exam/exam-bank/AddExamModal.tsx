"use client";
import React from "react";
import { X, FilePlus2, Timer, ClipboardList } from "lucide-react";

interface AddExamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddExamModal = ({ isOpen, onClose }: AddExamModalProps) => {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("🚀 Hệ thống Mona: Đã tạo đề thi mới thành công!");
    onClose();
  };

  return (
    <div className="animate-in fade-in fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm duration-200">
      <div className="animate-in zoom-in w-full max-w-xl rounded-[32px] bg-white p-8 shadow-2xl duration-300 dark:bg-slate-900">
        <div className="mb-8 flex items-center justify-between border-b border-slate-50 pb-4 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-green-50 p-2 text-green-600">
              <FilePlus2 size={20} />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-snug leading-snug">
              Tạo đề thi mới
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 transition-colors hover:bg-slate-50"
          >
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <label className="ml-1 text-[11px] font-bold tracking-widest text-slate-400">
              Tiêu đề đề thi
            </label>
            <input
              required
              type="text"
              placeholder="Ví dụ: Kiểm tra cuối kỳ IELTS Reading..."
              className="w-full rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold outline-none focus:border-green-400 dark:border-slate-600 dark:bg-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="ml-1 flex items-center gap-2 text-[11px] font-bold tracking-widest text-slate-400">
                <ClipboardList size={12} /> Số câu hỏi
              </label>
              <input
                required
                type="number"
                placeholder="40"
                className="w-full rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold outline-none focus:border-green-400 dark:bg-slate-800"
              />
            </div>
            <div className="space-y-1.5">
              <label className="ml-1 flex items-center gap-2 text-[11px] font-bold tracking-widest text-slate-400">
                <Timer size={12} /> Thời gian (phút)
              </label>
              <input
                required
                type="text"
                placeholder="60"
                className="w-full rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold outline-none focus:border-green-400 dark:bg-slate-800"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 text-sm font-bold text-slate-600 hover:text-slate-9 leading-relaxed00"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="flex-[2] rounded-2xl bg-[#22C55E] py-3.5 text-sm font-bold text-white shadow-xl shadow-green-500/20 transition-all hover:bg-green-600 active:scale-95"
            >
              Lưu đề thi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExamModal;



