"use client";
import React, { useState } from "react";
import { X, Send, Bell } from "lucide-react";

interface CreateNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateNotificationModal: React.FC<CreateNotificationModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="animate-in zoom-in flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl duration-200 dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
          <div className="flex items-center gap-2 font-bold text-indigo-700">
            <Bell size={20} /> <span>TẠO THÔNG BÁO MỚI</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 transition-colors hover:text-slate-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4 p-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900 dark:text-slate-3 leading-relaxed00">
              Tiêu đề thông báo
            </label>
            <input
              type="text"
              placeholder="Nhập tiêu đề (Ví dụ: Thông báo nghỉ lễ...)"
              className="w-full rounded-xl border bg-white p-3 transition-all outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-950"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900 dark:text-slate-3 leading-relaxed00">
              Nội dung chi tiết
            </label>
            <textarea
              placeholder="Nhập nội dung thông báo cho toàn bộ thành viên..."
              className="h-48 w-full resize-none rounded-xl border bg-white p-3 transition-all outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-950"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
          <button
            onClick={onClose}
            className="rounded-lg px-6 py-2 font-bold text-slate-600 transition-all hover:bg-slate-200"
          >
            Hủy bỏ
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-green-500 px-6 py-2 font-bold text-white shadow-lg shadow-green-500/20 transition-all hover:bg-green-600">
            <Send size={18} /> Gửi thông báo
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateNotificationModal;


