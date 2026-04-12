"use client";
import React from "react";
import { X, CalendarPlus } from "lucide-react";

interface AddHolidayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddHolidayModal = ({ isOpen, onClose }: AddHolidayModalProps) => {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("🚀 Mona System: Đã thiết lập lịch nghỉ mới thành công!");
    onClose();
  };

  return (
    <div className="animate-in fade-in fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm duration-200">
      <div className="animate-in zoom-in w-full max-w-xl rounded-[32px] bg-white p-8 shadow-2xl duration-300 dark:bg-slate-900">
        <div className="mb-8 flex items-center justify-between border-b border-slate-50 pb-4 text-slate-900 dark:border-slate-700 dark:text-white">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-purple-50 p-2 text-purple-600">
              <CalendarPlus size={20} />
            </div>
            <h2 className="text-xl font-bold tracking-tight leading-snug leading-snug">
              Thiết lập ngày nghỉ mới
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 transition-colors hover:bg-slate-50"
          >
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <label className="ml-1 text-[11px] font-bold tracking-widest text-slate-400">
              Tên sự kiện nghỉ lễ
            </label>
            <input
              required
              type="text"
              placeholder="Ví dụ: Nghỉ lễ Quốc Khánh 2/9..."
              className="w-full rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold outline-none focus:border-purple-400 dark:bg-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="ml-1 text-[11px] font-bold tracking-widest text-slate-400">
                Bắt đầu từ
              </label>
              <input
                required
                type="date"
                className="w-full rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold text-indigo-700 outline-none dark:bg-slate-800"
              />
            </div>
            <div className="space-y-1.5">
              <label className="ml-1 text-[11px] font-bold tracking-widest text-slate-400">
                Kết thúc vào
              </label>
              <input
                required
                type="date"
                className="w-full rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold text-rose-500 outline-none dark:bg-slate-800"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="ml-1 text-[11px] font-bold tracking-widest text-slate-400">
              Phạm vi áp dụng
            </label>
            <select className="w-full rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold outline-none dark:bg-slate-800">
              <option>Toàn hệ thống</option>
              <option>1 - Tân Bình HCM</option>
              <option>CS2 - Bình Thạnh</option>
            </select>
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
              className="flex-[2] rounded-2xl bg-[#22C55E] py-3.5 text-sm font-bold text-white shadow-xl shadow-green-500/20 transition-all active:scale-95"
            >
              Lưu lịch nghỉ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHolidayModal;



