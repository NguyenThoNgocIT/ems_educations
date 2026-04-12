"use client";
import React from "react";
import { X, Video } from "lucide-react";

interface AddZoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddZoomModal = ({ isOpen, onClose }: AddZoomModalProps) => {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("🚀 Mona System: Đã kết nối tài khoản Zoom mới thành công!");
    onClose();
  };

  return (
    <div className="animate-in fade-in fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm duration-200">
      <div className="animate-in zoom-in w-full max-w-xl rounded-[32px] bg-white p-8 shadow-2xl duration-300 dark:bg-slate-900">
        <div className="mb-8 flex items-center justify-between border-b border-slate-50 pb-4 dark:border-slate-700">
          <div className="flex items-center gap-3 text-slate-900 dark:text-white">
            <div className="rounded-xl bg-blue-50 p-2 text-indigo-700">
              <Video size={20} />
            </div>
            <h2 className="text-xl font-bold tracking-tight leading-snug leading-snug">
              Kết nối tài khoản Zoom
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 transition-colors hover:bg-slate-50"
          >
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <label className="ml-1 text-[11px] font-bold tracking-widest text-slate-400">
              Email tài khoản Zoom
            </label>
            <input
              required
              type="email"
              placeholder="example@gmail.com"
              className="w-full rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold outline-none focus:border-indigo-500 dark:bg-slate-800"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="ml-1 text-[11px] font-bold tracking-widest text-slate-400">
                Account ID
              </label>
              <input
                required
                type="text"
                placeholder="Nhập Account ID..."
                className="w-full rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold outline-none focus:border-indigo-500 dark:bg-slate-800"
              />
            </div>
            <div className="space-y-1.5">
              <label className="ml-1 text-[11px] font-bold tracking-widest text-slate-400">
                Client ID
              </label>
              <input
                required
                type="text"
                placeholder="Nhập Client ID..."
                className="w-full rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold outline-none focus:border-indigo-500 dark:bg-slate-800"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="ml-1 text-[11px] font-bold tracking-widest text-slate-400">
              Client Secret
            </label>
            <input
              required
              type="password"
              placeholder="••••••••••••••••"
              className="w-full rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold outline-none focus:border-indigo-500 dark:bg-slate-800"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 text-sm font-bold text-slate-6 leading-relaxed00"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="flex-[2] rounded-2xl bg-[#22C55E] py-3.5 text-sm font-bold text-white shadow-xl shadow-green-500/20 transition-all active:scale-95"
            >
              Kích hoạt kết nối
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddZoomModal;



