"use client";
import React from "react";
import { X, Upload, FileText } from "lucide-react";

interface AddDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddDocumentModal = ({ isOpen, onClose }: AddDocumentModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="animate-in fade-in fixed inset-0 z-[150] flex items-center justify-center bg-black/40 backdrop-blur-sm duration-200">
      <div className="animate-in zoom-in w-full max-w-2xl rounded-[32px] bg-white p-8 shadow-2xl duration-300 dark:bg-slate-900">
        {/* Header Modal */}
        <div className="mb-8 flex items-center justify-between border-b border-slate-50 pb-4 dark:border-slate-700">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-snug leading-snug">
            Tải lên tài liệu mới
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        <form
          className="grid grid-cols-2 gap-6"
          onSubmit={(e) => e.preventDefault()}
        >
          {/* Tên tài liệu */}
          <div className="col-span-2 space-y-2">
            <label className="text-[11px] font-bold tracking-widest text-slate-400">
              Tên tài liệu / Giáo trình
            </label>
            <input
              type="text"
              placeholder="Ví dụ: Giáo trình IELTS Listening..."
              className="w-full rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm font-bold outline-none focus:border-indigo-500 dark:border-slate-600 dark:bg-slate-800"
            />
          </div>

          {/* Phân loại */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold tracking-widest text-slate-400">
              Phân loại
            </label>
            <select className="w-full rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm font-bold outline-none dark:border-slate-600 dark:bg-slate-800">
              <option>Giáo trình</option>
              <option>Đề thi mẫu</option>
              <option>Tài liệu hướng dẫn</option>
            </select>
          </div>

          {/* Trạng thái */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold tracking-widest text-slate-400">
              Trạng thái hiển thị
            </label>
            <select className="w-full rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm font-bold outline-none dark:border-slate-600 dark:bg-slate-800">
              <option>Công khai</option>
              <option>Nội bộ</option>
            </select>
          </div>

          {/* Khu vực Upload File */}
          <div className="col-span-2">
            <label className="mb-2 block text-[11px] font-bold tracking-widest text-slate-400">
              Tệp tin đính kèm
            </label>
            <div className="flex cursor-pointer flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-slate-200 bg-slate-50 p-8 transition-colors hover:bg-blue-50/30 dark:border-slate-600 dark:bg-slate-800/50">
              <Upload size={32} className="mb-2 text-indigo-600" />
              <p className="text-sm font-bold text-slate-600 dark:text-slate-3 leading-relaxed00 leading-relaxed">
                Nhấn để chọn hoặc kéo thả file vào đây
              </p>
              <p className="mt-1 text-[10px] font-bold text-slate-400 leading-relaxed">
                Hỗ trợ PDF, DOCX, ZIP (Tối đa 50MB)
              </p>
            </div>
          </div>

          {/* Nút thao tác */}
          <div className="col-span-2 mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-9 leading-relaxed00"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-10 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700 active:scale-95"
            >
              Lưu tài liệu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDocumentModal;



