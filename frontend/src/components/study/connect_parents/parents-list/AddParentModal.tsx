"use client";
import React from "react";
import { X, UserPlus } from "lucide-react";

interface AddParentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddParentModal = ({ isOpen, onClose }: AddParentModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="animate-in fade-in fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm duration-200">
      <div className="animate-in zoom-in w-full max-w-xl rounded-[32px] bg-white p-8 shadow-2xl duration-300 dark:bg-slate-900">
        <div className="mb-8 flex items-center justify-between border-b border-slate-50 pb-4 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-green-50 p-2 text-green-600">
              <UserPlus size={20} />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-snug leading-snug">
              Thêm phụ huynh mới
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 transition-colors hover:bg-slate-50"
          >
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        <form
          className="grid grid-cols-2 gap-5"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="col-span-2 space-y-1.5">
            <label className="text-[11px] font-bold tracking-widest text-slate-400">
              Họ và tên
            </label>
            <input
              type="text"
              placeholder="Nhập tên phụ huynh"
              className="w-full rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm font-bold outline-none focus:border-indigo-500 dark:bg-slate-800"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold tracking-widest text-slate-400">
              Số điện thoại
            </label>
            <input
              type="text"
              placeholder="03xx..."
              className="w-full rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm font-bold outline-none focus:border-indigo-500 dark:bg-slate-800"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold tracking-widest text-slate-400">
              Giới tính
            </label>
            <select className="w-full rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm font-bold outline-none dark:bg-slate-800">
              <option>Nam</option>
              <option>Nữ</option>
            </select>
          </div>
          <div className="col-span-2 mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-bold text-slate-6 leading-relaxed00"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="rounded-xl bg-[#22C55E] px-8 py-2.5 text-sm font-bold text-white shadow-lg shadow-green-500/20 transition-all active:scale-95"
            >
              Lưu thông tin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddParentModal;



