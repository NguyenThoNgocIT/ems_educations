"use client";
import React, { useState } from "react";
import {
  X,
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface CreateNewSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStudents: any[]; // Danh sách học viên đã tích chọn từ bảng
}

const CreateNewSessionModal: React.FC<CreateNewSessionModalProps> = ({
  isOpen,
  onClose,
  selectedStudents,
}) => {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  if (!isOpen) return null;

  const daysOfWeek = [
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
    "Chủ nhật",
  ];

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="animate-in zoom-in flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl duration-200 dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-normal leading-snug">
            <PlusCircle className="text-indigo-600" size={20} /> Tạo ca học mới
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 transition-colors hover:text-slate-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="custom-scrollbar flex-1 space-y-8 overflow-y-auto p-6">
          {/* --- PHẦN 1: DANH SÁCH HỌC VIÊN ĐÃ CHỌN --- */}
          <section className="space-y-4">
            <h3 className="flex items-center gap-2 border-b pb-2 text-sm font-bold text-indigo-600 italic dark:border-slate-700 leading-tight leading-snug">
              <Users size={16} /> Danh sách học viên ({selectedStudents.length})
            </h3>
            <div className="overflow-hidden rounded-xl border dark:border-slate-700">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b bg-slate-50/50 text-[10px] font-bold text-slate-400 dark:border-slate-700 dark:bg-slate-800/30">
                    <th className="w-12 p-3 text-center">STT</th>
                    <th className="p-3">Họ tên</th>
                    <th className="p-3">Số điện thoại</th>
                    <th className="p-3">Lớp gần nhất</th>
                    <th className="p-3">Ngày đăng ký</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-slate-800">
                  {selectedStudents.map((student, index) => (
                    <tr key={student.id} className="text-xs">
                      <td className="p-3 text-center text-slate-400">
                        {index + 1}
                      </td>
                      <td className="p-3 font-bold text-slate-900 dark:text-slate-200">
                        {student.name}
                      </td>
                      <td className="p-3 font-medium text-indigo-600">
                        {student.phone}
                      </td>
                      <td className="p-3 text-slate-600">
                        {student.latestClass}
                      </td>
                      <td className="p-3 text-slate-600">
                        {student.registrationDate}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* --- PHẦN 2: THÔNG TIN CA MỚI [Dựa trên mô tả của bạn] --- */}
          <section className="space-y-4">
            <h3 className="flex items-center gap-2 border-b pb-2 text-sm font-bold text-indigo-600 italic dark:border-slate-700 leading-tight leading-snug">
              <Calendar size={16} /> Thông tin ca mới
            </h3>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Ngày trong tuần */}
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-wide text-slate-600">
                  Ngày trong tuần *
                </label>
                <div className="relative">
                  <select
                    multiple
                    className="h-32 w-full rounded-xl border bg-white p-3 text-sm outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-950"
                    onChange={(e) => {
                      const values = Array.from(
                        e.target.selectedOptions,
                        (option) => option.value,
                      );
                      setSelectedDays(values);
                    }}
                  >
                    {daysOfWeek.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {selectedDays.map((day) => (
                      <span
                        key={day}
                        className="rounded-lg border border-blue-100 bg-blue-50 px-2 py-1 text-[10px] font-bold text-indigo-700"
                      >
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Ca học */}
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-wide text-slate-600">
                  Ca học *
                </label>
                <div className="relative">
                  <select
                    disabled={selectedDays.length === 0}
                    className="w-full appearance-none rounded-xl border bg-white p-3 text-sm outline-none disabled:bg-slate-50 disabled:text-slate-3 leading-relaxed00 dark:border-slate-700 dark:bg-slate-950"
                  >
                    {selectedDays.length === 0 ? (
                      <option>Chọn thứ trước</option>
                    ) : (
                      <>
                        <option>Ca 1 (08:00 - 10:00)</option>
                        <option>Ca 2 (10:00 - 12:00)</option>
                        <option>Ca 3 (14:00 - 16:00)</option>
                        <option>Ca 4 (16:30 - 18:30)</option>
                        <option>Ca 5 (18:30 - 20:30)</option>
                      </>
                    )}
                  </select>
                  <Clock
                    className="absolute top-3.5 right-3 text-slate-400"
                    size={18}
                  />
                </div>
                {selectedDays.length === 0 && (
                  <p className="flex items-center gap-1 text-[10px] text-orange-500">
                    <AlertCircle size={12} /> Bạn cần chọn thứ trước khi chọn ca
                  </p>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex items-center justify-between border-t bg-slate-50/50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
          <div className="text-[10px] text-slate-400">
            <p>
              Hệ thống:{" "}
              <span className="font-bold text-slate-600">Quản lý đào tạo</span>
            </p>
            <p>
              Ngày thực hiện:{" "}
              <span className="font-bold text-slate-600">01/02/2026</span>
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="rounded-xl bg-red-500/10 px-6 py-2 text-xs font-bold text-red-500 transition-all hover:bg-red-500 hover:text-white"
            >
              Hủy
            </button>
            <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-2 text-xs font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 active:scale-95">
              <CheckCircle2 size={16} /> Xác nhận tạo ca
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateNewSessionModal;

// Icon bổ trợ
const PlusCircle = ({
  size,
  className,
}: {
  size: number;
  className?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v8" />
    <path d="M8 12h8" />
  </svg>
);



