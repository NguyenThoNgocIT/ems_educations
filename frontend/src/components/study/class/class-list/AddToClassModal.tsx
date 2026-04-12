"use client";
import React, { useState } from "react";
import { X, Search, Users, Check, BookOpen } from "lucide-react";

interface AddToClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStudents: any[];
}

const AddToClassModal: React.FC<AddToClassModalProps> = ({
  isOpen,
  onClose,
  selectedStudents,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  if (!isOpen) return null;

  // Dữ liệu mẫu lớp học hiện có
  const existingClasses = [
    {
      id: "L01",
      name: "English Starter - E1",
      teacher: "Ms. Lan",
      students: 12,
      max: 15,
    },
    {
      id: "L02",
      name: "IELTS Intensive - I5",
      teacher: "Mr. Smith",
      students: 8,
      max: 10,
    },
  ];

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="animate-in zoom-in w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl duration-200 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b p-5 dark:border-slate-700">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-normal leading-snug">
            Thêm vào lớp học
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6 p-6">
          {/* Tìm kiếm lớp học */}
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm tên lớp hoặc giáo viên..."
              className="w-full rounded-xl border bg-slate-50 p-3 pl-10 text-sm outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-950"
            />
            <Search
              className="absolute top-3.5 left-3 text-slate-400"
              size={18}
            />
          </div>

          <div className="custom-scrollbar max-h-60 space-y-3 overflow-y-auto">
            <label className="text-[11px] font-bold tracking-widest text-slate-400">
              Danh sách lớp phù hợp
            </label>
            {existingClasses.map((cls) => (
              <button
                key={cls.id}
                className="group flex w-full items-center justify-between rounded-xl border p-4 transition-all hover:border-indigo-500 hover:bg-blue-50/30 dark:border-slate-700"
              >
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-blue-100 p-2 text-indigo-700 dark:bg-blue-900/30">
                    <BookOpen size={20} />
                  </div>
                  <div className="text-left">
                    <h4 className="text-sm font-bold text-slate-9 leading-relaxed00 dark:text-white leading-tight leading-snug">
                      {cls.name}
                    </h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      GV: {cls.teacher} • Sĩ số: {cls.students}/{cls.max}
                    </p>
                  </div>
                </div>
                <div className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 group-hover:border-indigo-500">
                  <Check
                    size={14}
                    className="text-indigo-600 opacity-0 group-hover:opacity-100"
                  />
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between border-t bg-slate-50/50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
          <span className="text-xs text-slate-600">
            Đang chọn: <b>{selectedStudents.length} học viên</b>
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="rounded-lg px-5 py-2 text-sm font-bold text-slate-6 leading-relaxed00 hover:bg-slate-200"
            >
              Hủy
            </button>
            <button className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-bold text-white shadow-lg shadow-blue-600/20">
              Xác nhận thêm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AddToClassModal;



