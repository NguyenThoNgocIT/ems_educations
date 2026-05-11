"use client";
import React from "react";
import { X, AlertCircle } from "lucide-react";

interface AddWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddWarningModal = ({ isOpen, onClose }: AddWarningModalProps) => {
  if (!isOpen) return null;

  // --- HÀM XỬ LÝ LƯU CẢNH BÁO ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Giả lập logic lưu dữ liệu
    alert("🚀 Hệ thống Mona: Đã lưu cảnh báo học viên thành công!");

    // Đóng modal sau khi người dùng nhấn OK
    onClose();
  };

  return (
    <div className="animate-in fade-in fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm duration-200">
      <div className="animate-in zoom-in w-full max-w-lg rounded-[32px] bg-white p-8 shadow-2xl duration-300 dark:bg-slate-900">
        {/* Header Modal */}
        <div className="mb-8 flex items-center justify-between border-b border-slate-50 pb-4 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-amber-50 p-2 text-amber-600">
              <AlertCircle size={20} />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-snug leading-snug">
              Tạo cảnh báo mới
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 transition-colors hover:bg-slate-50"
          >
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        {/* Gắn hàm handleSubmit vào Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <label className="ml-1 text-[11px] font-bold tracking-widest text-slate-400">
              Mã học viên / Tên học viên
            </label>
            <input
              required
              type="text"
              placeholder="Nhập mã học viên (ví dụ: HV260109-1)"
              className="w-full rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold outline-none focus:border-amber-400 dark:border-slate-600 dark:bg-slate-800"
            />
          </div>

          <div className="space-y-1.5">
            <label className="ml-1 text-[11px] font-bold tracking-widest text-slate-400">
              Nội dung vi phạm / Ghi chú
            </label>
            <textarea
              required
              rows={4}
              placeholder="Nhập chi tiết nội dung cảnh báo..."
              className="w-full resize-none rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold outline-none focus:border-amber-400 dark:border-slate-600 dark:bg-slate-800"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 text-sm font-bold text-slate-600 transition-colors hover:text-slate-9 leading-relaxed00"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="flex-[2] rounded-2xl bg-[#F59E0B] py-3.5 text-sm font-bold text-white shadow-xl shadow-amber-500/20 transition-all hover:bg-amber-600 active:scale-95"
            >
              Lưu cảnh báo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddWarningModal;



