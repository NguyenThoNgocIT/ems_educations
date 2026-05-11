"use client";
import React, { useRef, useState } from "react";
import { X, Plus, ChevronDown, XCircle, Bookmark } from "lucide-react";

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  isOpen,
  onClose,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setCoverPreview(url);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="animate-in zoom-in w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl duration-200 dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-snug leading-snug">
            Thông tin nhóm
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 transition-colors hover:text-slate-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-6 p-6">
          {/* Mục Ảnh bìa */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-900 italic dark:text-slate-3 leading-relaxed00">
              Ảnh bìa
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative flex h-48 w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 transition-all hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800/50"
            >
              {coverPreview ? (
                <img
                  src={coverPreview}
                  alt="cover preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <Plus size={32} className="text-slate-300 leading-relaxed" />
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
            </div>
          </div>

          {/* Mục Lớp học */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-900 dark:text-slate-3 leading-relaxed00">
              <span className="mr-1 text-red-500">*</span>Lớp học
            </label>
            <div className="relative">
              <select className="w-full appearance-none rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-4 leading-relaxed00 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900">
                <option value="">Lớp học</option>
                <option value="1">DE-30.10.2025</option>
                <option value="2">IELTS 4.5 - 5.5</option>
              </select>
              <ChevronDown
                size={18}
                className="pointer-events-none absolute top-3.5 right-3 text-slate-400"
              />
            </div>
          </div>

          {/* Mục Tên nhóm */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-900 dark:text-slate-3 leading-relaxed00">
              <span className="mr-1 text-red-500">*</span>Tên nhóm
            </label>
            <input
              type="text"
              placeholder="Tên nhóm"
              className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900"
            />
          </div>
        </div>

        {/* Footer: Các nút bấm */}
        <div className="flex justify-end gap-3 border-t p-4 dark:border-slate-700">
          <button
            onClick={onClose}
            className="flex items-center gap-2 rounded-lg bg-red-500/90 px-6 py-2 font-bold text-white transition-all hover:bg-red-600"
          >
            <XCircle size={18} /> Hủy
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-blue-500 px-6 py-2 font-bold text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-600">
            <Bookmark size={18} /> Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;


