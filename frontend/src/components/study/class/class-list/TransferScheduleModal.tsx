"use client";
import React from "react";
import { X, Send, ArrowRight, Clock } from "lucide-react";

interface TransferScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStudents: any[];
  currentSchedule: string;
}

const TransferScheduleModal: React.FC<TransferScheduleModalProps> = ({
  isOpen,
  onClose,
  selectedStudents,
  currentSchedule,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="animate-in zoom-in w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl duration-200 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b bg-slate-50/30 p-5 dark:border-slate-700">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white leading-normal leading-snug">
            <Send size={20} className="rotate-[-45deg] text-indigo-600" />{" "}
            Chuyển ca học
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-8 p-6">
          {/* Quy trình chuyển đổi */}
          <div className="flex items-center justify-between rounded-2xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
            <div className="flex-1 text-center">
              <p className="mb-1 text-[10px] font-bold text-slate-400 leading-relaxed">
                Ca hiện tại
              </p>
              <span className="text-sm font-bold text-slate-900 dark:text-slate-3 leading-relaxed00">
                {currentSchedule}
              </span>
            </div>
            <ArrowRight className="mx-4 text-blue-400" />
            <div className="flex-1 text-center">
              <p className="mb-1 text-[10px] font-bold text-indigo-600">
                Ca mới
              </p>
              <div className="relative">
                <select className="w-full cursor-pointer appearance-none border-b-2 border-indigo-500 bg-transparent p-2 text-center text-sm font-bold text-indigo-700 outline-none">
                  <option>Thứ 3 (16:30 - 18:30)</option>
                  <option>Thứ 5 (18:30 - 20:30)</option>
                  <option>Chưa xác định thời gian</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold tracking-widest text-slate-400 leading-tight leading-snug">
              Học viên được chuyển ({selectedStudents.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedStudents.map((s) => (
                <span
                  key={s.id}
                  className="rounded-full border bg-slate-50 px-3 py-1 text-[11px] font-bold text-slate-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
                >
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t p-4 dark:border-slate-700">
          <button
            onClick={onClose}
            className="rounded-lg px-6 py-2 text-sm font-bold text-slate-4 leading-relaxed00 hover:bg-slate-50"
          >
            Hủy
          </button>
          <button className="rounded-lg bg-blue-600 px-8 py-2 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 active:scale-95">
            Xác nhận chuyển
          </button>
        </div>
      </div>
    </div>
  );
};
export default TransferScheduleModal;



