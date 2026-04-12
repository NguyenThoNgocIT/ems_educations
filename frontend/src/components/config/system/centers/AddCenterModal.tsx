"use client";
import React from "react";
import { X, MapPin } from "lucide-react";

interface AddCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddCenterModal = ({ isOpen, onClose }: AddCenterModalProps) => {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("🚀 Mona System: Đã khởi tạo cơ sở trung tâm mới thành công!");
    onClose();
  };

  return (
    <div className="animate-in fade-in fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm duration-200">
      <div className="animate-in zoom-in w-full max-w-2xl rounded-[32px] bg-white p-8 shadow-2xl duration-300 dark:bg-slate-900">
        <div className="mb-8 flex items-center justify-between border-b border-slate-50 pb-4 text-slate-900 dark:border-slate-700 dark:text-white">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-50 p-2 text-indigo-700 dark:bg-blue-900/30">
              <MapPin size={20} />
            </div>
            <h2 className="text-xl font-bold tracking-tight leading-snug leading-snug">
              Thêm cơ sở trung tâm
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 transition-colors hover:bg-slate-50"
          >
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        <form className="grid grid-cols-2 gap-5" onSubmit={handleSubmit}>
          <div className="col-span-2 space-y-1.5">
            <label className="ml-1 text-[11px] font-bold tracking-widest text-slate-400">
              Tên trung tâm
            </label>
            <input
              required
              type="text"
              placeholder="Ví dụ: Mona Center - Chi nhánh 3..."
              className="w-full rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold outline-none focus:border-indigo-500 dark:bg-slate-800"
            />
          </div>

          <div className="space-y-1.5">
            <label className="ml-1 text-[11px] font-bold tracking-widest text-slate-400">
              Mã định danh
            </label>
            <input
              required
              type="text"
              placeholder="CS3"
              className="w-full rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold outline-none focus:border-indigo-500 dark:bg-slate-800"
            />
          </div>

          <div className="space-y-1.5">
            <label className="ml-1 text-[11px] font-bold tracking-widest text-slate-400">
              Số điện thoại
            </label>
            <input
              required
              type="tel"
              placeholder="090..."
              className="w-full rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold outline-none focus:border-indigo-500 dark:bg-slate-800"
            />
          </div>

          <div className="col-span-2 space-y-1.5">
            <label className="ml-1 text-[11px] font-bold tracking-widest text-slate-400">
              Địa chỉ chi tiết
            </label>
            <input
              required
              type="text"
              placeholder="Số nhà, tên đường..."
              className="w-full rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold outline-none focus:border-indigo-500 dark:bg-slate-800"
            />
          </div>

          <div className="col-span-2 mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-sm font-bold text-slate-6 leading-relaxed00"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="rounded-2xl bg-[#22C55E] px-10 py-3 text-sm font-bold text-white shadow-xl shadow-green-500/20 transition-all active:scale-95"
            >
              Lưu cơ sở
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCenterModal;



