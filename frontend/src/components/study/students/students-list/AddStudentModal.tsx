"use client";
import React from "react";
import { X } from "lucide-react";

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddStudentModal = ({ isOpen, onClose }: AddStudentModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="animate-in fade-in zoom-in w-full max-w-2xl rounded-[32px] bg-white p-8 shadow-2xl duration-200 dark:bg-slate-900">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white/90 leading-snug leading-snug">
            Thêm học viên mới
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 transition-colors hover:bg-slate-50"
          >
            <X size={24} />
          </button>
        </div>

        <form className="grid grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold tracking-widest text-slate-400">
              Họ và tên
            </label>
            <input
              type="text"
              placeholder="Nhập tên học viên"
              className="w-full rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm font-bold outline-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold tracking-widest text-slate-400">
              Số điện thoại
            </label>
            <input
              type="text"
              placeholder="09xx..."
              className="w-full rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm font-bold outline-none"
            />
          </div>
          <div className="col-span-2 space-y-1.5">
            <label className="text-[11px] font-semibold tracking-widest text-slate-400">
              Email
            </label>
            <input
              type="email"
              placeholder="example@gmail.com"
              className="w-full rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm font-bold outline-none"
            />
          </div>
          <div className="col-span-2 mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-9 leading-relaxed00"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-8 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/10 transition-all active:scale-95"
            >
              Lưu thông tin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudentModal;



