"use client";
import React from "react";
import { X, LayoutGrid, CheckCircle2 } from "lucide-react";

interface ClassAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCount: number; // Nhận số lượng từ component cha
}

const ClassAssignmentModal = ({
  isOpen,
  onClose,
  selectedCount,
}: ClassAssignmentModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="animate-in fade-in fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm duration-200">
      <div className="animate-in zoom-in w-full max-w-lg rounded-[32px] bg-white p-8 shadow-2xl duration-300 dark:bg-slate-900">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-600 p-2 text-white shadow-lg shadow-blue-200">
              <LayoutGrid size={20} />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white/90 leading-snug leading-snug">
              Thực hiện xếp lớp
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 transition-colors hover:bg-slate-50"
          >
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        {/* THÔNG BÁO SỐ LƯỢNG THỰC TẾ */}
        <div className="mb-8 flex items-center gap-4 rounded-[24px] border border-blue-100/50 bg-blue-50/50 p-5">
          <div className="text-3xl font-bold text-indigo-700 underline decoration-blue-200">
            {selectedCount}
          </div>
          <div className="text-sm leading-tight font-bold text-blue-700">
            Học viên đã được chọn <br /> để đưa vào lớp mới.
          </div>
        </div>

        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            alert("Đã xếp lớp thành công cho " + selectedCount + " học viên!");
            onClose();
          }}
        >
          <div className="space-y-2">
            <label className="ml-1 text-[11px] font-semibold tracking-widest text-slate-400">
              Chọn lớp học mục tiêu
            </label>
            <select
              required
              className="w-full rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold transition-all outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 dark:bg-slate-800"
            >
              <option value="">-- Danh sách lớp đang chờ --</option>
              <option value="1">Lớp Tiếng Anh 6A - Phòng 101</option>
              <option value="2">Lớp Vovinam Nâng cao - Sân 2</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 text-sm font-semibold text-slate-400 hover:text-slate-6 leading-relaxed00"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-[2] rounded-2xl bg-blue-600 py-3.5 text-sm font-semibold text-white shadow-md shadow-blue-500/10 transition-all active:scale-95"
            >
              Xác nhận xếp lớp
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClassAssignmentModal;



