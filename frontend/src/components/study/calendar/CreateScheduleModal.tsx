"use client";
import React, { useState } from "react";
import { X, Calendar as CalendarIcon, Save, Plus, Trash2 } from "lucide-react";

interface CreateScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (sessions: any[]) => void;
}

const CreateScheduleModal: React.FC<CreateScheduleModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  // --- STATE QUẢN LÝ FORM ---
  const [startDate, setStartDate] = useState("2026-01-24");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");

  // State cho việc tạo lịch hàng loạt
  const [sessions, setSessions] = useState<any[]>([]); // Danh sách buổi học sẽ được tạo

  if (!isOpen) return null;

  const daysOfWeek = [
    "Thứ Hai",
    "Thứ Ba",
    "Thứ Tư",
    "Thứ Năm",
    "Thứ Sáu",
    "Thứ Bảy",
    "Chủ Nhật",
  ];

  return (
    <div className="animate-in fade-in fixed inset-0 z-[300] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm duration-200">
      <div className="flex h-[85vh] w-full max-w-[1100px] flex-col overflow-hidden rounded-[32px] bg-white shadow-2xl dark:bg-slate-900">
        {/* --- BODY: CHIA 2 CỘT --- */}
        <div className="flex flex-1 overflow-hidden">
          {/* CỘT TRÁI: NHẬP LIỆU THÔNG TIN */}
          <div className="custom-scrollbar flex w-full flex-col gap-6 overflow-y-auto border-r bg-white p-8 md:w-[380px] dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center gap-2">
              <h2 className="text-xl leading-snug font-bold tracking-normal text-slate-900 italic dark:text-white">
                Tạo lịch học
              </h2>
            </div>

            <div className="space-y-5">
              {/* Ngày bắt đầu */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-1 text-[10px] font-bold tracking-widest text-slate-400">
                  <span className="text-red-500">*</span> Ngày bắt đầu
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-2xl border border-slate-100 bg-slate-50 p-3.5 text-sm font-bold transition-all outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-800"
                />
              </div>

              {/* Phòng học */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-widest text-slate-400">
                  Phòng học
                </label>
                <select
                  className="w-full cursor-pointer appearance-none rounded-2xl border border-slate-100 bg-slate-50 p-3.5 text-sm font-bold outline-none dark:border-slate-600 dark:bg-slate-800"
                  onChange={(e) => setSelectedRoom(e.target.value)}
                >
                  <option value="">Chọn phòng học</option>
                  <option value="L104">CS1 - L104</option>
                  <option value="L105">CS1 - L105</option>
                </select>
              </div>

              {/* Ngày trong tuần & Ca */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold tracking-widest text-red-500">
                    * Ngày trong tuần
                  </label>
                  <select className="w-full rounded-xl border bg-slate-50 p-3 text-xs font-bold outline-none dark:bg-slate-800">
                    <option>Chọn ngày trong tuần</option>
                    {daysOfWeek.map((day) => (
                      <option key={day}>{day}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold tracking-widest text-red-500">
                    * Ca
                  </label>
                  <select className="w-full rounded-xl border bg-slate-50 p-3 text-xs font-bold text-slate-400 outline-none dark:bg-slate-800">
                    <option>Chọn thứ trước</option>
                  </select>
                </div>
              </div>

              {/* Giáo viên */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-widest text-red-500">
                  * Giáo viên
                </label>
                <select
                  className="w-full cursor-pointer rounded-2xl border border-slate-100 bg-slate-50 p-3.5 text-sm font-bold outline-none dark:border-slate-600 dark:bg-slate-800"
                  onChange={(e) => setSelectedTeacher(e.target.value)}
                >
                  <option value="">Chọn giáo viên</option>
                  <option value="Trinh Le">Trinh Le</option>
                  <option value="Phan Thành Châu 1">Phan Thành Châu 1</option>
                </select>
              </div>
            </div>

            {/* Nút thêm buổi học */}
            <button className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 bg-white py-4 font-bold text-slate-400 transition-all hover:border-blue-200 hover:text-indigo-600 active:scale-95 dark:border-slate-600 dark:bg-slate-800">
              <Plus size={18} /> Thêm buổi học
            </button>

            {/* Nút chính Tạo lịch học */}
            <button className="w-full rounded-2xl bg-[#22C55E] py-4 font-bold tracking-widest text-white shadow-lg shadow-green-500/20 transition-all hover:bg-green-600 active:scale-95">
              Tạo lịch học
            </button>
          </div>

          {/* CỘT PHẢI: XEM TRƯỚC (PREVIEW) */}
          <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto bg-slate-50/40 p-12 text-center dark:bg-white/[0.02]">
            {sessions.length === 0 ? (
              <div className="animate-in zoom-in duration-300">
                <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-[32px] border border-slate-100 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
                  <CalendarIcon size={44} className="text-indigo-600" />
                </div>
                <h3 className="text-2xl leading-snug leading-tight font-bold tracking-tight text-slate-900 dark:text-slate-200">
                  Vui lòng tạo lịch
                </h3>
                <p className="text-slate-4 leading-relaxed00 mt-3 max-w-[300px] text-sm leading-relaxed font-medium">
                  Sau khi tạo, danh sách các buổi học dự kiến sẽ xuất hiện tại
                  đây để bạn kiểm tra.
                </p>
              </div>
            ) : (
              <div className="w-full space-y-4">
                {/* Render danh sách buổi học nếu có */}
              </div>
            )}
          </div>
        </div>

        {/* --- FOOTER TRONG SUỐT --- */}
        <div className="flex justify-center gap-6 border-t bg-slate-50/50 p-4 backdrop-blur-md dark:border-slate-700 dark:bg-slate-800/50">
          <button
            onClick={onClose}
            className="group flex items-center gap-2 text-xs font-bold text-slate-600 transition-all hover:text-slate-900 dark:hover:text-white"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-slate-400 group-hover:border-slate-700">
              <X size={12} strokeWidth={3} />
            </span>
            Huỷ
          </button>
          <button
            disabled={sessions.length === 0}
            className={`flex items-center gap-2 text-xs font-bold transition-all ${
              sessions.length > 0
                ? "text-indigo-700 hover:text-blue-700"
                : "cursor-not-allowed text-slate-300"
            }`}
          >
            <Save
              size={16}
              className={`rounded-md border p-1 ${sessions.length > 0 ? "border-blue-600" : "border-slate-300"}`}
            />
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateScheduleModal;
