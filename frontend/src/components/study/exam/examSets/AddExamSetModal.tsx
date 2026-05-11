"use client";
import React from "react";
import { X, PlusCircle, Image as ImageIcon } from "lucide-react";

interface AddExamSetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddExamSetModal = ({ isOpen, onClose }: AddExamSetModalProps) => {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("🚀 Hệ thống Mona: Đã tạo bộ đề thi mới thành công!");
    onClose();
  };

  return (
    <div className="animate-in fade-in fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm duration-200">
      <div className="animate-in zoom-in w-full max-w-xl rounded-[32px] bg-white p-8 shadow-2xl duration-300 dark:bg-slate-900">
        <div className="mb-8 flex items-center justify-between border-b border-slate-50 pb-4 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-green-50 p-2 text-green-600">
              <PlusCircle size={20} />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-snug leading-snug">
              Tạo bộ đề mới
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
              Tiêu đề bộ đề
            </label>
            <input
              required
              type="text"
              placeholder="Nhập tên bộ đề thi..."
              className="w-full rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold outline-none focus:border-green-400 dark:bg-slate-800"
            />
          </div>

          <div className="space-y-1.5">
            <label className="ml-1 text-[11px] font-bold tracking-widest text-slate-400">
              Giá bán (VNĐ)
            </label>
            <input
              required
              type="text"
              placeholder="Ví dụ: 50,000"
              className="w-full rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold outline-none focus:border-green-400 dark:bg-slate-800"
            />
          </div>

          <div className="space-y-1.5">
            <label className="ml-1 text-[11px] font-bold tracking-widest text-slate-400">
              Màu chủ đạo
            </label>
            <select className="w-full rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold outline-none dark:bg-slate-800">
              <option value="bg-blue-500">Xanh dương</option>
              <option value="bg-red-700">Đỏ đậm</option>
              <option value="bg-green-600">Xanh lá</option>
            </select>
          </div>

          <div className="col-span-2">
            <label className="mb-2 ml-1 block text-[11px] font-bold tracking-widest text-slate-400">
              Ảnh bìa bộ đề
            </label>
            <div className="flex cursor-pointer flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-slate-100 bg-slate-50 p-6 transition-colors hover:bg-green-50/30 dark:bg-slate-800/50">
              <ImageIcon size={32} className="mb-2 text-slate-300" />
              <p className="text-xs font-bold text-slate-400 leading-relaxed">
                Tải lên ảnh định dạng .jpg, .png
              </p>
            </div>
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
              className="rounded-2xl bg-[#22C55E] px-10 py-3 text-sm font-bold text-white shadow-lg shadow-green-500/20 transition-all active:scale-95"
            >
              Tạo ngay
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExamSetModal;



