import React from 'react';
import { Modal } from "@/components/ui/modal";
import { AlertTriangle, CalendarDays, CheckCircle2, Loader2, Repeat2, UserRound } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  formData: any;
  setFormData: (data: any) => void;
  courseClasses: any[];
  courses: any[];
  rooms: any[];
  timeSlots: any[];
  lecturers: any[];
  conflicts?: Array<{ type: "room" | "lecturer" | "courseClass"; message: string }>;
  courseProgress?: { scheduled: number; required: number; remaining: number };
  saveError?: string;
  onSubmit: () => Promise<void>;
  isEditing?: boolean;
  isSubmitting?: boolean;
  onDelete?: () => Promise<void>;
}

const courseClassIdOf = (courseClass: any) => String(courseClass?.courseClassId || courseClass?.id || "");
const roomIdOf = (room: any) => String(room?.roomId || room?.id || "");
const timeSlotIdOf = (timeSlot: any) => String(timeSlot?.timeSlotId || timeSlot?.id || "");
const lecturerIdOf = (lecturer: any) => String(lecturer?.employeeId || lecturer?.id || "");

const courseClassLabel = (courseClass: any) => {
  if (!courseClass) return "";
  return `${courseClass.classCode || courseClass.courseClassName || "Chưa rõ mã lớp"} - ${courseClass.courseName || "Môn học"}`;
};

const lecturerLabel = (lecturer: any) => {
  if (!lecturer) return "";
  const code = lecturer.instructorCode || lecturer.employeeCode || "";
  return `${lecturer.fullName || lecturer.name || "Chưa rõ giảng viên"}${code ? ` (${code})` : ""}`;
};

const getDepartmentId = (item: any) => {
  return String(item?.departmentId || item?.department?.departmentId || item?.department?.id || "").trim();
};

const roomLabel = (room: any) => {
  if (!room) return "";
  return `${room.code || room.roomCode || "Không rõ mã phòng"} (${room.type || room.roomType || "Phòng học"})`;
};

const timeSlotLabel = (timeSlot: any) => {
  if (!timeSlot) return "";
  return `${timeSlot.slotCode || "Ca học"}: ${timeSlot.startTime || ""} - ${timeSlot.endTime || ""}`;
};

export default function TimetableModal({ isOpen, onClose, formData, setFormData, courseClasses, courses, rooms, timeSlots, lecturers, conflicts = [], courseProgress = { scheduled: 0, required: 0, remaining: 0 }, saveError = "", onSubmit, isEditing = false, isSubmitting = false, onDelete }: Props) {
  const selectedCourseClass = courseClasses.find((c: any) => courseClassIdOf(c) === String(formData.courseClassId));
  const selectedCourse = courses.find((course: any) => String(course.courseId || course.id) === String(selectedCourseClass?.courseId || selectedCourseClass?.id));
  const selectedLecturer = lecturers.find((l: any) => lecturerIdOf(l) === String(formData.instructorId));
  const selectedRoom = rooms.find((r: any) => roomIdOf(r) === String(formData.roomId));
  const selectedTimeSlot = timeSlots.find((t: any) => timeSlotIdOf(t) === String(formData.timeSlotId));
  const selectedCourseClassLabel = courseClassLabel(selectedCourseClass) || formData.courseClassName || "";
  const selectedLecturerLabel = lecturerLabel(selectedLecturer) || formData.instructorName || "";
  const selectedCourseClassDepartmentId =
    getDepartmentId(selectedCourseClass) ||
    getDepartmentId(selectedCourse) ||
    getDepartmentId(selectedCourseClass?.department);
  const eligibleLecturers = selectedCourseClassDepartmentId
    ? lecturers.filter((lecturer: any) => getDepartmentId(lecturer) === selectedCourseClassDepartmentId)
    : lecturers;

  React.useEffect(() => {
    if (!selectedCourseClassDepartmentId || !selectedLecturer) return;
    if (getDepartmentId(selectedLecturer) !== selectedCourseClassDepartmentId) {
      setFormData({ ...formData, instructorId: "" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCourseClassDepartmentId, selectedLecturer?.employeeId, selectedLecturer?.id]);

  const selectedRoomLabel = roomLabel(selectedRoom) || formData.roomCode || "";
  const selectedTimeSlotLabel = timeSlotLabel(selectedTimeSlot) || formData.slotCode || "";
  const hasBlockingConflict = conflicts.length > 0;
  const busyRooms = new Set(conflicts.filter((conflict) => conflict.type === "room").map(() => String(formData.roomId || "")));
  const busyLecturers = new Set(conflicts.filter((conflict) => conflict.type === "lecturer").map(() => String(formData.instructorId || "")));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[650px] p-6 lg:p-8 rounded-2xl"
    >
      <div className="flex flex-col px-1 overflow-y-auto custom-scrollbar max-h-[85vh]">
        <div className="mb-6">
          <h5 className="font-bold text-gray-900 dark:text-white text-xl flex items-center gap-2">
            <CalendarDays className="text-brand-500 h-6 w-6" />
            {isEditing ? "Chi Tiết & Chỉnh Sửa Lịch Học" : "Sắp Lịch Học Mới"}
          </h5>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">
            {isEditing ? "Cập nhật hoặc xóa buổi học phần đã xếp." : "Phân công thời gian, phòng học và giảng viên cho lớp học phần."}
          </p>
        </div>
        
        <div className="space-y-5">
          {selectedCourseClass && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 text-sm dark:border-emerald-900 dark:bg-emerald-950/20">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">
                    {selectedCourseClass.classCode || selectedCourseClass.courseClassName}
                  </div>
                  <div className="mt-0.5 text-slate-600 dark:text-slate-350">
                    {selectedCourseClass.courseName || 'Chưa có tên môn học'}
                  </div>
                </div>
                <div className="rounded-lg bg-white px-3 py-1 font-semibold text-emerald-700 shadow-sm dark:bg-slate-900 dark:text-emerald-400">
                  {selectedCourseClass.credits || 0} TC
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400 sm:grid-cols-4">
                <div>Sĩ số: {selectedCourseClass.currentStudent ?? selectedCourseClass.currentStudents ?? 0}/{selectedCourseClass.maxStudent ?? selectedCourseClass.maxStudents ?? '-'}</div>
                <div>Học kỳ: {selectedCourseClass.semesterName || selectedCourseClass.semesterCode || '-'}</div>
                <div>Bắt đầu: {selectedCourseClass.startDate || '-'}</div>
                <div>Kết thúc: {selectedCourseClass.endDate || '-'}</div>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-2 rounded-lg bg-white/70 p-3 text-xs text-slate-700 ring-1 ring-emerald-100 dark:bg-slate-950/60 dark:text-slate-200 dark:ring-emerald-900/60 sm:grid-cols-3">
                <div>
                  <div className="font-semibold text-slate-500 dark:text-slate-400">Tổng tiết</div>
                  <div className="text-base font-bold text-slate-900 dark:text-white">{courseProgress.required}</div>
                </div>
                <div>
                  <div className="font-semibold text-slate-500 dark:text-slate-400">Đã lên lịch</div>
                  <div className="text-base font-bold text-emerald-700 dark:text-emerald-300">{courseProgress.scheduled}</div>
                </div>
                <div>
                  <div className="font-semibold text-slate-500 dark:text-slate-400">Còn lại</div>
                  <div className="text-base font-bold text-amber-700 dark:text-amber-300">{courseProgress.remaining}</div>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                <Repeat2 className="h-4 w-4" />
                <span>Lặp lại mỗi tuần đến khi đủ {courseProgress.required || 0} tiết</span>
                {selectedLecturerLabel ? (
                  <>
                    <span className="text-slate-300">|</span>
                    <UserRound className="h-4 w-4" />
                    <span>{selectedLecturerLabel}</span>
                  </>
                ) : null}
              </div>
            </div>
          )}

          {/* Lớp học phần & Giảng viên */}
          {isEditing && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm dark:border-slate-700 dark:bg-slate-900/60">
              <div className="mb-2 font-bold text-slate-900 dark:text-white">Phạm vi chỉnh sửa</div>
              <div className="grid gap-2 sm:grid-cols-2">
                <label className="flex cursor-pointer items-start gap-2 rounded-lg border border-emerald-200 bg-white p-3 dark:border-emerald-900/60 dark:bg-slate-950/60">
                  <input
                    type="radio"
                    name="seriesEditMode"
                    value="ONLY_THIS"
                    checked={(formData.seriesEditMode || "ONLY_THIS") === "ONLY_THIS"}
                    onChange={() => setFormData({ ...formData, seriesEditMode: "ONLY_THIS" })}
                    className="mt-1 accent-brand-500"
                  />
                  <span>
                    <span className="block font-bold">Chỉ thay đổi buổi này</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">Các tuần sau giữ nguyên chu kỳ cũ.</span>
                  </span>
                </label>
                <label className="flex cursor-pointer items-start gap-2 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-950/60">
                  <input
                    type="radio"
                    name="seriesEditMode"
                    value="THIS_AND_FOLLOWING"
                    checked={formData.seriesEditMode === "THIS_AND_FOLLOWING"}
                    onChange={() => setFormData({ ...formData, seriesEditMode: "THIS_AND_FOLLOWING" })}
                    className="mt-1 accent-brand-500"
                  />
                  <span>
                    <span className="block font-bold">Thay đổi từ buổi này về sau</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">Cần API chuỗi, hiện chưa áp dụng tự động.</span>
                  </span>
                </label>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label>Lớp học phần <span className="text-destructive">*</span></Label>
              <Select 
                value={formData.courseClassId || ""} 
                onValueChange={(val) => {
                  const nextClass = courseClasses.find((c: any) => courseClassIdOf(c) === String(val));
                  setFormData({
                    ...formData,
                    courseClassId: val,
                    roomId: nextClass?.roomId || formData.roomId,
                    semesterId: nextClass?.semesterId || formData.semesterId,
                    instructorId: nextClass?.assignedInstructorId || formData.instructorId || "",
                    instructorName: nextClass?.assignedInstructorName || formData.instructorName || ""
                  });
                }}
              >
                <SelectTrigger className="w-full h-11 bg-gray-50/50 dark:bg-gray-800/50">
                  <SelectValue placeholder="-- Chọn lớp học phần --">{selectedCourseClassLabel}</SelectValue>
                </SelectTrigger>
                <SelectContent className="z-[9999]">
                  {courseClasses?.length > 0 ? (
                    courseClasses.map((c: any) => (
                      <SelectItem key={courseClassIdOf(c)} value={courseClassIdOf(c)}>
                        {courseClassLabel(c)}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-sm text-muted-foreground text-center">Không có lớp nào</div>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Giảng viên phụ trách <span className="text-destructive">*</span></Label>
              <Select 
                value={formData.instructorId || ""} 
                onValueChange={(val) => setFormData({...formData, instructorId: val})}
              >
                <SelectTrigger className="w-full h-11 bg-gray-50/50 dark:bg-gray-800/50">
                  <SelectValue placeholder="-- Chọn giảng viên --">{selectedLecturerLabel}</SelectValue>
                </SelectTrigger>
                <SelectContent className="z-[9999]">
                  {eligibleLecturers?.length > 0 ? (
                    eligibleLecturers.map((l: any) => (
                      <SelectItem key={lecturerIdOf(l)} value={lecturerIdOf(l)}>
                        {lecturerLabel(l)}{busyLecturers.has(lecturerIdOf(l)) ? " - Đang bận" : ""}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-sm text-muted-foreground text-center">
                      {selectedCourseClassDepartmentId ? "Không có giảng viên cùng khoa với lớp học phần" : "Chưa có dữ liệu"}
                    </div>
                  )}
                </SelectContent>
              </Select>
              {selectedCourseClassDepartmentId ? (
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  Chỉ hiển thị giảng viên cùng khoa của lớp học phần.
                </p>
              ) : null}
            </div>
          </div>

          {/* Phòng học & Ca học */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label>Phòng học <span className="text-destructive">*</span></Label>
              <Select 
                value={formData.roomId || ""} 
                onValueChange={(val) => setFormData({...formData, roomId: val})}
              >
                <SelectTrigger className="w-full h-11 bg-gray-50/50 dark:bg-gray-800/50">
                  <SelectValue placeholder="-- Chọn phòng --">{selectedRoomLabel}</SelectValue>
                </SelectTrigger>
                <SelectContent className="z-[9999]">
                  {rooms?.length > 0 ? (
                    rooms.map((r: any) => (
                      <SelectItem key={roomIdOf(r)} value={roomIdOf(r)}>
                        {roomLabel(r)}{busyRooms.has(roomIdOf(r)) ? " - Đang bận" : ""}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-sm text-muted-foreground text-center">Chưa có dữ liệu</div>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Ca học <span className="text-destructive">*</span></Label>
              <Select 
                value={formData.timeSlotId || ""} 
                onValueChange={(val) => setFormData({...formData, timeSlotId: val})}
              >
                <SelectTrigger className="w-full h-11 bg-gray-50/50 dark:bg-gray-800/50">
                  <SelectValue placeholder="-- Chọn ca học --">{selectedTimeSlotLabel}</SelectValue>
                </SelectTrigger>
                <SelectContent className="z-[9999]">
                  {timeSlots?.length > 0 ? (
                    timeSlots.map((t: any) => (
                      <SelectItem key={timeSlotIdOf(t)} value={timeSlotIdOf(t)}>
                        {timeSlotLabel(t)}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-sm text-muted-foreground text-center">Chưa có dữ liệu</div>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Ngày áp dụng, Số tiết, Hình thức */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="sm:col-span-1 space-y-2">
              <Label>Ngày học <span className="text-destructive">*</span></Label>
              <Input
                type="date"
                value={formData.date || ""}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="h-11 bg-gray-50/50 dark:bg-gray-800/50"
              />
            </div>

            <div className="sm:col-span-1 space-y-2">
              <Label>Số tiết</Label>
              <Input
                type="number"
                min="1"
                max="10"
                value={formData.numberOfPeriods || 1}
                onChange={(e) => setFormData({...formData, numberOfPeriods: parseInt(e.target.value) || 1})}
                className="h-11 bg-gray-50/50 dark:bg-gray-800/50"
              />
            </div>

            <div className="sm:col-span-1 space-y-2">
              <Label>Hình thức</Label>
              <div className="flex items-center gap-6 h-11 bg-gray-50/50 dark:bg-gray-800/50 px-4 rounded-md border border-input">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-sm text-foreground">
                  <input
                    type="radio"
                    name="mode"
                    value="LT"
                    checked={formData.mode === "LT"}
                    onChange={() => setFormData({...formData, mode: "LT"})}
                    className="accent-brand-500 w-4 h-4"
                  />
                  Lý thuyết
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-medium text-sm text-foreground">
                  <input
                    type="radio"
                    name="mode"
                    value="TH"
                    checked={formData.mode === "TH"}
                    onChange={() => setFormData({...formData, mode: "TH"})}
                    className="accent-brand-500 w-4 h-4"
                  />
                  Thực hành
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Ghi chú</Label>
            <Textarea
              value={formData.note || ""}
              onChange={(e) => setFormData({...formData, note: e.target.value})}
              rows={2}
              placeholder="Ví dụ: Cần mượn thêm máy chiếu, phòng máy tính..."
              className="resize-none bg-gray-50/50 dark:bg-gray-800/50"
            />
          </div>

          {hasBlockingConflict && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200">
              <div className="mb-2 flex items-center gap-2 font-bold">
                <AlertTriangle className="h-4 w-4" />
                Trùng lịch
              </div>
              <ul className="space-y-1">
                {conflicts.map((conflict, index) => (
                  <li key={`${conflict.type}-${index}`}>{conflict.message}</li>
                ))}
              </ul>
            </div>
          )}

          {saveError && !hasBlockingConflict && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200">
              <div className="mb-1 flex items-center gap-2 font-bold">
                <AlertTriangle className="h-4 w-4" />
                Khong the luu lich
              </div>
              <div>{saveError}</div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 mt-8 pt-5 border-t border-border">
          <div>
            {isEditing && onDelete && (
              <Button
                variant="destructive"
                onClick={onDelete}
                type="button"
                className="px-6 h-11"
              >
                Xóa Lịch học
              </Button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={onClose} type="button" className="px-6 h-11">
              Hủy bỏ
            </Button>
            <Button 
              onClick={onSubmit} 
              type="button" 
              disabled={isSubmitting || hasBlockingConflict}
              className="px-6 h-11 bg-brand-500 hover:bg-brand-600 text-white shadow-md shadow-brand-500/20"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4 mr-2" />
              )}
              {isSubmitting ? "Đang lưu..." : isEditing ? "Cập Nhật Lịch" : "Xác nhận Lịch"}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
