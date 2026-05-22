import React from 'react';
import { Modal } from "@/components/ui/modal";
import { CalendarDays, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  formData: any;
  setFormData: (data: any) => void;
  courseClasses: any[];
  rooms: any[];
  timeSlots: any[];
  lecturers: any[];
  onSubmit: () => Promise<void>;
}

export default function TimetableModal({ isOpen, onClose, formData, setFormData, courseClasses, rooms, timeSlots, lecturers, onSubmit }: Props) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[600px] p-6 lg:p-8 rounded-2xl"
    >
      <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
        <div className="mb-6">
          <h5 className="font-bold text-gray-900 dark:text-white text-xl flex items-center gap-2">
            <CalendarDays className="text-brand-500" />
            Chi tiết Lịch Học
          </h5>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Phân công giảng viên và phòng học cho lớp học phần.
          </p>
        </div>
        
        <div className="space-y-5">
          {/* Lớp học phần & Giảng viên */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Lớp học phần <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.courseClassId}
                onChange={(e) => setFormData({...formData, courseClassId: e.target.value})}
                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2 text-sm text-gray-800 focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white transition-all"
              >
                <option value="">-- Chọn lớp --</option>
                {courseClasses.map((c: any) => (
                  <option key={c.id || c.courseClassId} value={c.id || c.courseClassId}>
                    {c.classCode} - {c.courseName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Giảng viên
              </label>
              <select
                value={formData.instructorId}
                onChange={(e) => setFormData({...formData, instructorId: e.target.value})}
                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2 text-sm text-gray-800 focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white transition-all"
              >
                <option value="">-- Chọn giảng viên --</option>
                {lecturers.map((l: any) => (
                  <option key={l.employeeId} value={l.employeeId}>
                    {l.fullName || l.employeeCode}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Phòng học */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Phòng học <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.roomId}
                onChange={(e) => setFormData({...formData, roomId: e.target.value})}
                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2 text-sm text-gray-800 focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white transition-all"
              >
                <option value="">-- Chọn phòng --</option>
                {rooms.map((r: any) => (
                  <option key={r.roomId} value={r.roomId}>
                    {r.roomCode} ({r.roomType})
                  </option>
                ))}
              </select>
            </div>

            {/* Ca học */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Ca học <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.timeSlotId}
                onChange={(e) => setFormData({...formData, timeSlotId: e.target.value})}
                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2 text-sm text-gray-800 focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white transition-all"
              >
                <option value="">-- Chọn ca học --</option>
                {timeSlots.map((t: any) => (
                  <option key={t.timeSlotId} value={t.timeSlotId}>
                    {t.slotCode}: {t.startTime} - {t.endTime}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="sm:col-span-1">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Ngày áp dụng <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2 text-sm text-gray-800 focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white transition-all"
              />
            </div>

            <div className="sm:col-span-1">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Số tiết
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.numberOfPeriods}
                onChange={(e) => setFormData({...formData, numberOfPeriods: parseInt(e.target.value)})}
                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2 text-sm text-gray-800 focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white transition-all"
              />
            </div>

            <div className="sm:col-span-1">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Hình thức
              </label>
              <div className="flex items-center gap-4 h-11 bg-gray-50/50 dark:bg-gray-800/50 px-4 rounded-xl border border-gray-200 dark:border-gray-700">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-sm text-gray-700 dark:text-gray-300">
                  <input
                    type="radio"
                    name="mode"
                    value="LT"
                    checked={formData.mode === "LT"}
                    onChange={() => setFormData({...formData, mode: "LT"})}
                    className="accent-brand-500 w-4 h-4"
                  />
                  LT
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-medium text-sm text-gray-700 dark:text-gray-300">
                  <input
                    type="radio"
                    name="mode"
                    value="TH"
                    checked={formData.mode === "TH"}
                    onChange={() => setFormData({...formData, mode: "TH"})}
                    className="accent-brand-500 w-4 h-4"
                  />
                  TH
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Ghi chú
            </label>
            <textarea
              value={formData.note}
              onChange={(e) => setFormData({...formData, note: e.target.value})}
              rows={2}
              placeholder="Ví dụ: Giảng viên dùng máy chiếu..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-800 focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white transition-all resize-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 mt-8 sm:justify-end pt-5 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={onClose}
            type="button"
            className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Hủy bỏ
          </button>
          <button
            onClick={onSubmit}
            type="button"
            className="px-6 py-2.5 rounded-xl bg-brand-500 text-white font-medium hover:bg-brand-600 shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 transition-all flex items-center gap-2"
          >
            <CheckCircle2 size={18} />
            Xác nhận Lịch
          </button>
        </div>
      </div>
    </Modal>
  );
}
