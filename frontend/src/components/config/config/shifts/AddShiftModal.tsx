"use client";
import React from "react";
import { X, Clock } from "lucide-react";

interface AddShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddShiftModal = ({ isOpen, onClose }: AddShiftModalProps) => {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("🚀 Mona System: Đã khởi tạo ca học mới thành công!");
    onClose();
  };

  return (
    <div className="animate-in fade-in fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm duration-200">
      <div className="animate-in zoom-in w-full max-w-lg rounded-[32px] bg-white p-8 shadow-2xl duration-300 dark:bg-slate-900">
        <div className="mb-8 flex items-center justify-between border-b border-slate-50 pb-4 text-slate-900 dark:border-slate-700 dark:text-white">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-green-50 p-2 text-green-600">
              <Clock size={20} />
            </div>
            <h2 className="text-xl font-bold tracking-tight leading-snug leading-snug">
              Thiết lập ca học mới
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="ml-1 text-[10px] font-bold tracking-widest text-slate-400">
                Giờ bắt đầu
              </label>
              <input
                required
                type="time"
                className="w-full rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold text-indigo-700 outline-none focus:border-indigo-500 dark:bg-slate-800"
              />
            </div>
            <div className="space-y-2">
              <label className="ml-1 text-[10px] font-bold tracking-widest text-slate-400">
                Giờ kết thúc
              </label>
              <input
                required
                type="time"
                className="w-full rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold text-rose-500 outline-none focus:border-rose-400 dark:bg-slate-800"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="ml-1 text-[10px] font-bold tracking-widest text-slate-400">
              Tên hiển thị ca học
            </label>
            <input
              required
              type="text"
              placeholder="Ví dụ: Ca sáng 1 (08:00 - 10:00)"
              className="w-full rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold outline-none focus:border-green-400 dark:bg-slate-800"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 text-sm font-bold text-slate-4 leading-relaxed00"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-[2] rounded-2xl bg-[#22C55E] py-3.5 text-sm font-bold text-white shadow-xl shadow-green-500/20 transition-all hover:bg-green-600 active:scale-95"
            >
              Lưu ca học
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddShiftModal;



