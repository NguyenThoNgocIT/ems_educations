"use client";
import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronRight,
  UserPlus,
  ChevronLeft,
  Plus,
  Send,
  Loader2,
} from "lucide-react";
import { coursesData, studentsData } from "./data_proposed_classes";
// Đảm bảo bạn đã tạo file này từ các lượt chat trước nhé
import CreateNewSessionModal from "./CreateNewSessionModal";
import AddToClassModal from "./AddToClassModal";
import TransferScheduleModal from "./TransferScheduleModal";

const ProposedClassManagement = () => {
  // 1. Quản lý các trạng thái UI & Data
  const [selectedCourse, setSelectedCourse] = useState(coursesData[4]);
  const [selectedSchedule, setSelectedSchedule] = useState(
    "Chưa xác định thời gian",
  );
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(
    coursesData[4].id,
  );

  const [filteredStudents, setFilteredStudents] = useState(studentsData);
  const [isLoading, setIsLoading] = useState(false);

  // LOGIC QUAN TRỌNG: Quản lý chọn học viên
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);

  const [isAddClassOpen, setIsAddClassOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);

  // Hàm xử lý chọn/bỏ chọn học viên lẻ
  const toggleStudentSelection = (id: number) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  // Hàm chọn tất cả học viên đang hiển thị trong bảng
  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = filteredStudents.map((s) => s.id);
      setSelectedStudentIds(allIds);
    } else {
      setSelectedStudentIds([]);
    }
  };

  // Lấy data đầy đủ của những học viên đã chọn để truyền vào Modal
  const selectedStudentsData = studentsData.filter((s) =>
    selectedStudentIds.includes(s.id),
  );

  // 2. Logic giả lập lấy dữ liệu từ Backend
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));

      const result = studentsData.filter(
        (student) =>
          student.session === selectedSchedule ||
          selectedSchedule === "Chưa xác định thời gian",
      );

      setFilteredStudents(result);
      // Reset chọn khi đổi ca học để tránh nhầm lẫn data
      setSelectedStudentIds([]);
      setIsLoading(false);
    };

    fetchData();
  }, [selectedCourse, selectedSchedule]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 font-sans dark:bg-black">
      <div className="mx-auto flex max-w-[1600px] flex-col items-start gap-4 lg:flex-row">
        {/* --- 1. CỘT TRÁI: SIDEBAR KHÓA HỌC --- */}
        <div className="sticky top-4 w-full rounded-xl border bg-white p-4 shadow-sm lg:w-72 dark:border-slate-700 dark:bg-slate-900">
          <h2 className="mb-4 text-[13px] leading-snug font-bold tracking-wider text-slate-900 dark:text-white">
            Khóa học
          </h2>
          <div className="space-y-1">
            {coursesData.map((course) => {
              const isExpanded = expandedCourseId === course.id;
              return (
                <div key={course.id} className="space-y-1">
                  <button
                    onClick={() =>
                      setExpandedCourseId(isExpanded ? null : course.id)
                    }
                    className={`flex w-full items-center justify-between rounded-lg p-2 text-xs font-bold transition-all ${
                      selectedCourse.id === course.id
                        ? "text-indigo-700"
                        : "text-slate-900 dark:text-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <ChevronRight
                        size={14}
                        className={`text-slate-400 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                      />
                      <span>{course.name}</span>
                    </div>
                    <span className="rounded-full bg-slate-50 px-1.5 py-0.5 text-[10px] text-slate-600 dark:bg-slate-800">
                      {course.totalPending}
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="animate-in slide-in-from-top-1 space-y-1 pl-6 duration-200">
                      {course.schedules.map((s, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setSelectedCourse(course);
                            setSelectedSchedule(s.time);
                          }}
                          className={`flex w-full items-center justify-between rounded-lg p-2 text-[11px] transition-all ${
                            selectedSchedule === s.time &&
                            selectedCourse.id === course.id
                              ? "bg-blue-50 font-extrabold text-indigo-700 shadow-sm"
                              : "text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
                          }`}
                        >
                          <span className="truncate pr-2">{s.time}</span>
                          <span className="flex h-5 w-5 items-center justify-center rounded-full border bg-white text-[10px] dark:bg-slate-800">
                            {s.count}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* --- 2. CỘT PHẢI: CHI TIẾT ĐỀ XUẤT --- */}
        <div className="flex flex-1 flex-col overflow-hidden rounded-xl border bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div className="border-b p-5 dark:border-slate-700">
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row">
              <div>
                <h1 className="text-slate-9 leading-relaxed00 text-sm leading-snug font-bold dark:text-white">
                  Học viên đăng ký khóa học
                </h1>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-xs font-bold text-indigo-700 italic">
                    {selectedCourse.name}
                  </span>
                  <span className="text-[10px] text-slate-400">•</span>
                  <span className="text-[11px] font-medium text-slate-600">
                    {selectedSchedule}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() =>
                    selectedStudentIds.length > 0
                      ? setIsAddClassOpen(true)
                      : alert("Chọn học viên!")
                  }
                  className="flex items-center gap-2 rounded-lg border px-3 py-2 text-[11px] font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-600"
                >
                  <Plus size={14} /> Thêm vào lớp học
                </button>

                <button
                  onClick={() =>
                    selectedStudentIds.length > 0
                      ? setIsTransferOpen(true)
                      : alert("Chọn học viên!")
                  }
                  className="flex items-center gap-2 rounded-lg border px-3 py-2 text-[11px] font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-600"
                >
                  <Send size={14} className="rotate-[-45deg]" /> Chuyển ca
                </button>

                {/* Nút Tạo lớp từ ca: Đã được kết nối logic */}
                <button
                  onClick={() => {
                    if (selectedStudentIds.length === 0) {
                      alert("Vui lòng chọn ít nhất một học viên để tạo lớp!");
                      return;
                    }
                    setIsSessionModalOpen(true);
                  }}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-[11px] font-extrabold shadow-sm transition-all dark:border-slate-600 ${
                    selectedStudentIds.length > 0
                      ? "border-blue-600 bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-white text-slate-900 hover:border-indigo-500 dark:bg-slate-950 dark:text-white"
                  }`}
                >
                  <Plus
                    size={16}
                    className={
                      selectedStudentIds.length > 0
                        ? "text-white"
                        : "text-indigo-600"
                    }
                  />
                  Tạo lớp từ ca ({selectedStudentIds.length})
                </button>
              </div>
            </div>
          </div>

          <div className="relative min-h-[400px] overflow-x-auto">
            {isLoading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 dark:bg-black/50">
                <Loader2 className="animate-spin text-indigo-600" size={32} />
              </div>
            )}

            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b bg-slate-50/50 text-sm font-extrabold tracking-wider text-slate-900 dark:border-slate-700 dark:bg-slate-800/30 dark:text-white">
                  <th className="w-12 p-4 text-center">
                    {/* Checkbox chọn tất cả */}
                    <input
                      type="checkbox"
                      className="cursor-pointer rounded border-slate-300"
                      checked={
                        filteredStudents.length > 0 &&
                        selectedStudentIds.length === filteredStudents.length
                      }
                      onChange={(e) => toggleSelectAll(e.target.checked)}
                    />
                  </th>
                  <th className="p-4 text-center">STT</th>
                  <th className="p-4">Họ tên</th>
                  <th className="p-4">Số điện thoại</th>
                  <th className="p-4">Lớp học gần nhất</th>
                  <th className="p-4 text-center">Trạng thái lớp</th>
                  <th className="p-4">Dự kiến kết thúc</th>
                  <th className="p-4">Tư vấn phụ trách</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-slate-800">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student, index) => (
                    <tr
                      key={student.id}
                      className="group text-[13px] transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/30"
                    >
                      <td className="p-4 text-center">
                        {/* Checkbox chọn từng người */}
                        <input
                          type="checkbox"
                          className="cursor-pointer rounded"
                          checked={selectedStudentIds.includes(student.id)}
                          onChange={() => toggleStudentSelection(student.id)}
                        />
                      </td>
                      <td className="p-4 text-center font-medium text-slate-400">
                        {index + 1}
                      </td>
                      <td className="cursor-pointer p-4 font-bold tracking-tight text-indigo-600 hover:underline">
                        {student.name}
                      </td>
                      <td className="p-4 font-bold text-indigo-600">
                        {student.phone}
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-400">
                        {student.latestClass}
                      </td>
                      <td className="p-4 text-center">
                        <span className="rounded border border-blue-200 bg-blue-100 px-2 py-0.5 text-[10px] font-bold whitespace-nowrap text-indigo-700 dark:bg-blue-900/30">
                          {student.status}
                        </span>
                      </td>

                      <td className="p-4 font-medium text-slate-600">
                        {student.expectedEndDate}
                      </td>
                      <td className="p-4 font-medium text-slate-600">
                        {student.consultant}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={8}
                      className="p-10 text-center text-slate-400 italic"
                    >
                      Không tìm thấy học viên trong ca học này.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-end gap-4 border-t bg-slate-50/20 p-4 dark:border-slate-700">
            <span className="text-[11px] font-bold tracking-widest text-slate-400">
              Tổng cộng: {filteredStudents.length}
            </span>
            <div className="flex items-center gap-1">
              <button className="p-1 text-slate-400 hover:text-slate-900">
                <ChevronLeft size={18} />
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-[11px] font-bold text-indigo-700 shadow-sm">
                1
              </button>
              <button className="p-1 text-slate-400 hover:text-slate-900">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <AddToClassModal
        isOpen={isAddClassOpen}
        onClose={() => setIsAddClassOpen(false)}
        selectedStudents={selectedStudentsData}
      />
      <TransferScheduleModal
        isOpen={isTransferOpen}
        onClose={() => setIsTransferOpen(false)}
        selectedStudents={selectedStudentsData}
        currentSchedule={selectedSchedule}
      />

      {/* --- GỌI MODAL TẠO CA HỌC --- */}
      <CreateNewSessionModal
        isOpen={isSessionModalOpen}
        onClose={() => setIsSessionModalOpen(false)}
        selectedStudents={selectedStudentsData}
      />
    </div>
  );
};

export default ProposedClassManagement;
