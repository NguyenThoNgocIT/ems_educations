"use client";
import React from "react";
import { X, Save, ShieldCheck } from "lucide-react";

interface CreatePromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreatePromotionModal: React.FC<CreatePromotionModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="animate-in zoom-in w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl duration-200 dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800/50">
          <div className="flex items-center gap-2 font-bold tracking-tight text-green-600">
            <ShieldCheck size={20} /> <span>Thêm gói khuyến mãi mới</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 transition-colors hover:text-slate-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs font-bold tracking-wide text-slate-600">
              Mã khuyến mãi *
            </label>
            <input
              type="text"
              placeholder="Ví dụ: KM2026"
              className="w-full rounded-xl border bg-white p-3 font-bold outline-none focus:ring-2 focus:ring-green-500/20 dark:border-slate-700 dark:bg-slate-950"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold tracking-wide text-slate-600">
              Loại khuyến mãi *
            </label>
            <select className="w-full rounded-xl border bg-white p-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-950">
              <option>Giảm theo %</option>
              <option>Giảm theo số tiền</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold tracking-wide text-slate-600">
              Giá trị giảm *
            </label>
            <input
              type="text"
              placeholder="0"
              className="w-full rounded-xl border p-3 text-sm font-bold text-indigo-600 dark:border-slate-700"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold tracking-wide text-slate-600">
              Giảm tối đa
            </label>
            <input
              type="text"
              placeholder="2,000,000"
              className="w-full rounded-xl border p-3 text-sm dark:border-slate-700"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold tracking-wide text-slate-600">
              Số lượng mã
            </label>
            <input
              type="number"
              placeholder="100"
              className="w-full rounded-xl border p-3 text-sm dark:border-slate-700"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold tracking-wide text-slate-600">
              Ngày hết hạn *
            </label>
            <input
              type="date"
              className="w-full rounded-xl border p-3 text-sm dark:border-slate-700"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
          <button
            onClick={onClose}
            className="rounded-lg px-6 py-2 font-bold text-slate-600 transition-all hover:bg-slate-200"
          >
            Hủy
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-green-500 px-8 py-2 font-bold text-white shadow-lg shadow-green-500/20 transition-all hover:bg-green-600">
            <Save size={18} /> Lưu gói
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePromotionModal;

