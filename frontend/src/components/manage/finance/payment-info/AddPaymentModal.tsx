"use client";
import React from "react";
import { X, CircleDollarSign } from "lucide-react";

const AddPaymentModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="animate-in fade-in fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm duration-200">
      <div className="animate-in zoom-in w-full max-w-xl rounded-[32px] bg-white p-8 shadow-2xl duration-300 dark:bg-slate-900">
        <div className="mb-8 flex items-center justify-between border-b border-slate-50 pb-4 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600">
              <CircleDollarSign size={20} />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-snug leading-snug">
              Tạo phiếu thu mới
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
          onSubmit={(e) => {
            e.preventDefault();
            alert("Đã tạo phiếu thu thành công!");
            onClose();
          }}
        >
          <div className="col-span-2 space-y-1.5">
            <label className="ml-1 text-[11px] font-bold tracking-widest text-slate-400">
              Người nộp tiền / Học viên
            </label>
            <input
              required
              type="text"
              placeholder="Nhập tên hoặc mã học viên..."
              className="w-full rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold outline-none focus:border-emerald-400 dark:bg-slate-800"
            />
          </div>
          <div className="space-y-1.5">
            <label className="ml-1 text-[11px] font-bold tracking-widest text-slate-400">
              Số tiền thu
            </label>
            <input
              required
              type="number"
              placeholder="VND"
              className="w-full rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold outline-none focus:border-emerald-400 dark:bg-slate-800"
            />
          </div>
          <div className="space-y-1.5">
            <label className="ml-1 text-[11px] font-bold tracking-widest text-slate-400">
              Hình thức
            </label>
            <select className="w-full rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold outline-none dark:bg-slate-800">
              <option>Tiền mặt</option>
              <option>Chuyển khoản</option>
            </select>
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
              Xác nhận thu tiền
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPaymentModal;



