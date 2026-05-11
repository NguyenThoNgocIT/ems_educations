"use client";
import React, { useState } from "react";
import { X, Tag } from "lucide-react";

interface AddStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const colors = [
  "bg-blue-600",
  "bg-rose-600",
  "bg-emerald-500",
  "bg-orange-500",
  "bg-purple-500",
  "bg-slate-500",
];

const AddStatusModal = ({ isOpen, onClose }: AddStatusModalProps) => {
  const [selectedColor, setSelectedColor] = useState("bg-blue-600");
  if (!isOpen) return null;

  return (
    <div className="animate-in fade-in fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm duration-200">
      <div className="animate-in zoom-in w-full max-w-lg rounded-[32px] bg-white p-8 shadow-2xl duration-300 dark:bg-slate-900">
        <div className="mb-8 flex items-center justify-between border-b border-slate-50 pb-4 text-slate-900 dark:border-slate-700 dark:text-white">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 ${selectedColor} rounded-xl text-white shadow-lg shadow-blue-500/20`}
            >
              <Tag size={20} />
            </div>
            <h2 className="text-xl font-bold tracking-tight leading-snug leading-snug">
              Thêm trạng thái mới
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-slate-50"
          >
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            alert("🚀 Mona System: Đã lưu trạng thái khách hàng mới!");
            onClose();
          }}
        >
          <div className="space-y-1.5">
            <label className="ml-1 text-[11px] font-bold tracking-widest text-slate-400">
              Tên trạng thái
            </label>
            <input
              required
              type="text"
              placeholder="Ví dụ: Đã đóng phí, Đang cân nhắc..."
              className="w-full rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold outline-none focus:border-indigo-500 dark:bg-slate-800"
            />
          </div>

          <div className="space-y-3">
            <label className="ml-1 text-[11px] font-bold tracking-widest text-slate-400">
              Màu sắc định danh
            </label>
            <div className="flex gap-3">
              {colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedColor(c)}
                  className={`h-8 w-8 rounded-full ${c} transition-all ${selectedColor === c ? "scale-110 ring-4 ring-blue-400 ring-offset-2" : "opacity-60"}`}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 text-sm font-bold text-slate-6 leading-relaxed00"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-[2] rounded-2xl bg-[#22C55E] py-3.5 text-sm font-bold text-white shadow-xl shadow-green-500/20 transition-all active:scale-95"
            >
              Lưu trạng thái
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStatusModal;



