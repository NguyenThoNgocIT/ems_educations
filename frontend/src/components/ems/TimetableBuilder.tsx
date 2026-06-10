"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import type { AxiosResponse } from "axios";
import FullCalendar from "@fullcalendar/react";
import { Draggable, EventReceiveArg } from "@fullcalendar/interaction";
import { DateSelectArg, EventClickArg } from "@fullcalendar/core";
import { useModal } from "@/hooks/useModal";
import { scheduleApi } from "@/api/schedule";
import { courseApi, courseClassApi } from "@/api/course";
import { roomApi } from "@/api/room";
import { timeSlotApi } from "@/api/timeSlot";
import { lecturerApi } from "@/api/lecturer";
import { semesterApi } from "@/api/semester";
import { departmentApi } from "@/api/department";
import { teachingAssignmentApi } from "@/api/teaching-assignment";
import { toast } from "sonner";
import { Filter, Bot, Loader2, CalendarRange, MapPin } from "lucide-react";
import { fixMojibakeText } from "@/utils/text";

// UI Components
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import TimetableSidebar from "./timetable/TimetableSidebar";
import TimetableCalendar from "./timetable/TimetableCalendar";
import TimetableModal from "./timetable/TimetableModal";

const toArray = (value: any) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.data?.data)) return value.data.data;
  return [];
};

const courseClassIdOf = (courseClass: any) => String(courseClass?.courseClassId || courseClass?.id || "");
const roomIdOf = (room: any) => String(room?.roomId || room?.id || "");
const timeSlotIdOf = (timeSlot: any) => String(timeSlot?.timeSlotId || timeSlot?.id || "");
const lecturerIdOf = (lecturer: any) => String(lecturer?.employeeId || lecturer?.id || "");
const assignmentInstructorIdOf = (assignment: any) => String(assignment?.instructorId || "");
const assignmentCourseClassIdOf = (assignment: any) => String(assignment?.courseClassId || "");

const unwrapResponseData = (response: any) => response?.data?.data || response?.data || response || {};

const requiredPeriodsOf = (courseClass: any) => {
  const theoryHours = Number(courseClass?.theoryHours || courseClass?.course?.theoryHours || 0);
  const practiceHours = Number(courseClass?.practiceHours || courseClass?.course?.practiceHours || 0);
  const configuredHours = theoryHours + practiceHours;
  if (configuredHours > 0) {
    return Math.max(1, Math.ceil(configuredHours));
  }
  const credits = Number(courseClass?.credits || 0);
  return Math.max(1, Math.ceil((credits || 3) * 15));
};

const scheduleSaveErrorMessage = (error: any) => {
  if (error?.code === "ECONNABORTED") {
    return "API lưu lịch không phản hồi sau 12 giây. Kiểm tra backend/DB rồi thử lại.";
  }
  if (error?.response?.status === 409) {
    return (
      error?.response?.data?.message ||
      "Lịch bị trùng. Hãy đổi lớp học phần, phòng, giảng viên hoặc ca học."
    );
  }
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "Lỗi khi lưu lịch học. Có thể bị trùng lịch!"
  );
};

const timeToMinutes = (time?: string) => {
  if (!time) return Number.MAX_SAFE_INTEGER;
  const [hour = "0", minute = "0"] = time.split(":");
  return Number(hour) * 60 + Number(minute);
};

const sortTimeSlots = (slots: any[]) => {
  return [...slots].sort((a, b) => {
    const byStartTime = timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
    if (byStartTime !== 0) return byStartTime;
    return String(a.slotCode || "").localeCompare(String(b.slotCode || ""), "vi", { numeric: true });
  });
};

const getSettledValue = <T,>(result: PromiseSettledResult<T>, fallback: T) =>
  result.status === "fulfilled" ? result.value : fallback;

export default function TimetableBuilder() {
  const [events, setEvents] = useState<any[]>([]);
  const [courseClasses, setCourseClasses] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [timeSlots, setTimeSlots] = useState<any[]>([]);
  const [lecturers, setLecturers] = useState<any[]>([]);
  const [semesters, setSemesters] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("ALL");
  
  // State phục vụ tìm kiếm & lọc
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("ALL"); // ALL | LECTURER | COURSE_CLASS | ROOM
  const [filterId, setFilterId] = useState("ALL");
  const [selectedSemesterId, setSelectedSemesterId] = useState<string>("");
  
  const [isAutoScheduling, setIsAutoScheduling] = useState(false);
  const [autoScheduleStatus, setAutoScheduleStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [serverScheduleError, setServerScheduleError] = useState("");
  
  const [isEditing, setIsEditing] = useState(false);
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    courseClassId: "",
    courseClassName: "",
    seriesEditMode: "ONLY_THIS",
    roomId: "",
    roomCode: "",
    timeSlotId: "",
    slotCode: "",
    instructorId: "",
    instructorName: "",
    date: "",
    numberOfPeriods: 2,
    semesterId: "",
    note: "",
    mode: "LT",
    scheduleStatus: "PLANNED"
  });

  const calendarRef = useRef<FullCalendar>(null);
  const externalEventsRef = useRef<HTMLDivElement>(null);
  const { isOpen, openModal, closeModal } = useModal();

  const buildCalendarEvent = (
    schedule: any,
    slots: any[] = timeSlots,
    lecturerList: any[] = lecturers,
    courseClassList: any[] = courseClasses,
    courseList: any[] = courses
  ) => {
    const slot = slots.find((ts: any) => timeSlotIdOf(ts) === String(schedule.timeSlotId));
    const lecturer = lecturerList.find((entry: any) => lecturerIdOf(entry) === String(schedule.instructorId));
    const courseClass = courseClassList.find((c: any) => courseClassIdOf(c) === String(schedule.courseClassId));
    const course = courseList.find((c: any) => String(c.courseId || c.id) === String(courseClass?.courseId || courseClass?.id));

    const departmentId =
      schedule.departmentId ||
      lecturer?.departmentId ||
      courseClass?.departmentId ||
      course?.departmentId ||
      courseClass?.department?.departmentId;
    const departmentName =
      schedule.departmentName ||
      lecturer?.departmentName ||
      courseClass?.departmentName ||
      course?.departmentName ||
      courseClass?.department?.name;

    let eventDate = schedule.date;
    if (!eventDate) {
      const today = new Date();
      const currentDay = today.getDay() === 0 ? 7 : today.getDay();
      const targetDay = schedule.dayOfWeek || 1;
      const diff = targetDay - currentDay;
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + diff);
      eventDate = targetDate.toISOString().split('T')[0];
    }

    let start = eventDate;
    let end = eventDate;
    let allDay = true;

    if (slot) {
      start = `${eventDate}T${slot.startTime}`;
      end = `${eventDate}T${slot.endTime}`;
      allDay = false;
    }

    return {
      id: schedule.scheduleId,
      title: `${schedule.courseClassName || schedule.classCode || 'Lớp học'} - ${schedule.roomCode || 'Chưa xếp phòng'}`,
      start,
      end,
      allDay,
      extendedProps: {
        calendar: schedule.mode === 'TH' ? 'Warning' : 'Primary',
        instructorName: schedule.instructorName || lecturer?.fullName || lecturer?.name,
        instructorId: schedule.instructorId,
        roomCode: schedule.roomCode,
        roomId: schedule.roomId,
        courseClassName: schedule.courseClassName,
        courseName: schedule.courseName,
        courseClassId: schedule.courseClassId,
        departmentId,
        departmentName: fixMojibakeText(departmentName),
        timeSlotId: schedule.timeSlotId,
        slotCode: schedule.slotCode,
        numberOfPeriods: schedule.numberOfPeriods,
        semesterId: schedule.semesterId,
        mode: schedule.mode,
        scheduleStatus: schedule.scheduleStatus,
        isException: schedule.isException === true || String(schedule.note || "").includes("[EXCEPTION]"),
        note: schedule.note
      }
    };
  };

  const buildCalendarEventFromPayload = (scheduleId: string, payload: any) => {
    const selectedClass = courseClasses.find((c: any) => courseClassIdOf(c) === String(payload.courseClassId));
    const selectedRoom = rooms.find((r: any) => roomIdOf(r) === String(payload.roomId));
    const selectedSlot = timeSlots.find((ts: any) => timeSlotIdOf(ts) === String(payload.timeSlotId));
    const selectedLecturer = lecturers.find((l: any) => lecturerIdOf(l) === String(payload.instructorId));

    return buildCalendarEvent({
      ...payload,
      scheduleId,
      courseClassName: selectedClass?.classCode || selectedClass?.courseClassName || payload.courseClassName,
      courseName: selectedClass?.courseName || payload.courseName,
      classCode: selectedClass?.classCode,
      roomCode: selectedRoom?.code || selectedRoom?.roomCode || payload.roomCode,
      slotCode: selectedSlot?.slotCode || payload.slotCode,
      instructorName: selectedLecturer?.fullName || selectedLecturer?.name || payload.instructorName,
      departmentId:
        payload.departmentId ||
        selectedLecturer?.departmentId ||
        selectedClass?.departmentId ||
        selectedClass?.department?.departmentId,
      departmentName:
        payload.departmentName ||
        selectedLecturer?.departmentName ||
        selectedClass?.departmentName ||
        selectedClass?.department?.name
    });
  };

  // Tải danh sách học kỳ khi component mount
  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        const semestersList = await semesterApi.getAll();
        setSemesters(semestersList || []);
        if (semestersList && semestersList.length > 0) {
          const activeSem = semestersList.find((s: any) => s.status || s.isActive);
          const defaultSemId = (activeSem ? activeSem.semesterId : semestersList[0].semesterId) || "";
          setSelectedSemesterId(defaultSemId);
          setFormData(prev => ({ ...prev, semesterId: defaultSemId }));
        }
      } catch (error) {
        console.error("Failed to fetch semesters", error);
        toast.error("Không thể tải danh sách học kỳ");
      }
    };
    fetchSemesters();
  }, []);

  const fetchInitialData = async () => {
    if (!selectedSemesterId) return;
    try {
      const [schedulesResult, classesResult, roomsResult, slotsResult, lecturersResult, coursesResult, departmentsResult, assignmentsResult] = await Promise.allSettled([
        scheduleApi.getAll(),
        courseClassApi.getBySemester(selectedSemesterId),
        roomApi.getAll(),
        timeSlotApi.getAll(),
        lecturerApi.getAll(),
        courseApi.getAll(),
        departmentApi.getAll({ isActive: true }),
        teachingAssignmentApi.search({ semesterId: selectedSemesterId, isActive: true })
      ]);

      if (schedulesResult.status === "rejected") {
        throw schedulesResult.reason;
      }

      const schedulesRes = schedulesResult.value;
      const classesRes = getSettledValue<any[]>(classesResult, []);
      const roomsRes = getSettledValue<any[]>(roomsResult, []);
      const slotsRes = getSettledValue<any[]>(slotsResult, []);
      const lecturersRes = getSettledValue<any[]>(lecturersResult, lecturers);
      const coursesRes = getSettledValue<AxiosResponse<any>>(coursesResult, { data: [] } as any);
      const departmentsList = getSettledValue<any[]>(departmentsResult, []);
      const assignmentList = getSettledValue<any[]>(assignmentsResult, []);
      const listSlots = sortTimeSlots(toArray(slotsRes));
      const schedulesList = toArray(schedulesRes);
      let classesList = toArray(classesRes);
      const courseList = toArray(coursesRes);

      if (classesList.length === 0) {
        classesList = toArray(await courseClassApi.getAll());
      }
      classesList = classesList.filter((courseClass: any) =>
        !courseClass.semesterId || String(courseClass.semesterId) === String(selectedSemesterId)
      );
      
      const semesterCourseClassIds = new Set(classesList.map((courseClass: any) => courseClassIdOf(courseClass)).filter(Boolean));
      const orphanSemesterSchedules = schedulesList.filter((schedule: any) =>
        String(schedule.semesterId || "") === String(selectedSemesterId)
        && !semesterCourseClassIds.has(String(schedule.courseClassId || ""))
      );
      const semesterSchedules = schedulesList.filter((schedule: any) =>
        semesterCourseClassIds.has(String(schedule.courseClassId || ""))
        && (!schedule.semesterId || String(schedule.semesterId) === String(selectedSemesterId))
      );

      const lecturersList = toArray(lecturersRes);
      const departmentListItems = toArray(departmentsList);
      const assignments = toArray(assignmentList);
      const lecturerById = new Map<string, any>(lecturersList.map((lecturer: any) => [lecturerIdOf(lecturer), lecturer]));
      const assignmentByCourseClassId = new Map<string, any>(
        assignments.map((assignment: any) => [assignmentCourseClassIdOf(assignment), assignment])
      );
      classesList = classesList.map((courseClass: any) => {
        const assignment = assignmentByCourseClassId.get(courseClassIdOf(courseClass));
        const lecturer = assignment ? lecturerById.get(assignmentInstructorIdOf(assignment)) : null;
        return {
          ...courseClass,
          assignedInstructorId: assignment?.instructorId,
          assignedInstructorName: lecturer?.fullName || lecturer?.name,
          hasTeachingAssignment: Boolean(assignment),
        };
      });

      const scheduleEvents = semesterSchedules.map((s: any) => buildCalendarEvent(s, listSlots, lecturersList, classesList, courseList));

      console.info("[TimetableBuilder] calendar data loaded", {
        selectedSemesterId,
        schedulesTotal: schedulesList.length,
        schedulesVisible: scheduleEvents.length,
        orphanSemesterSchedules: orphanSemesterSchedules.length,
        relatedSchedules: semesterSchedules.length,
        classes: classesList.length,
        lecturers: lecturersList.length,
        assignments: assignments.length,
      });

      setEvents(scheduleEvents);
      const firstEventStart = scheduleEvents
        .map((event: any) => String(event.start || "").slice(0, 10))
        .filter(Boolean)
        .sort()[0];
      if (firstEventStart) {
        window.setTimeout(() => {
          calendarRef.current?.getApi().gotoDate(firstEventStart);
        }, 0);
      }
      setCourseClasses(classesList);
      setCourses(courseList);
      setRooms(toArray(roomsRes));
      setTimeSlots(listSlots);
      setLecturers(lecturersList);
      setDepartments(departmentListItems);

      if (lecturersResult.status === "rejected") {
        toast.warning("Danh sách giảng viên tải chậm, lịch vẫn hiển thị theo dữ liệu hiện có.");
      }
    } catch (error) {
      console.error("Failed to fetch calendar data", error);
      toast.error("Không thể tải dữ liệu thời khóa biểu");
    }
  };

  useEffect(() => {
    if (selectedSemesterId) {
      fetchInitialData();
    }
  }, [selectedSemesterId]);

  // Khởi tạo tính năng kéo thả
  useEffect(() => {
    if (externalEventsRef.current) {
      let draggable = new Draggable(externalEventsRef.current, {
        itemSelector: ".fc-event",
        eventData: function(eventEl) {
          let title = eventEl.getAttribute("data-title");
          let id = eventEl.getAttribute("data-id");
          return {
            title: title,
            id: id,
            duration: "01:00",
            extendedProps: {
              courseClassId: id
            }
          };
        }
      });

      return () => {
        draggable.destroy();
      };
    }
  }, [courseClasses]);

  // LOGIC LỌC SỰ KIỆN THEO CHẾ ĐỘ XEM
  const filteredEvents = useMemo(() => {
    let filtered = events;

    if (selectedDepartmentId && selectedDepartmentId !== "ALL") {
      filtered = filtered.filter((event) => {
        const deptId = event.extendedProps.departmentId || event.extendedProps.instructorDepartmentId || "";
        return String(deptId) === String(selectedDepartmentId);
      });
    }

    if (viewMode === "ALL" || filterId === "ALL") return filtered;
    
    return filtered.filter(event => {
      if (viewMode === "LECTURER") {
        return event.extendedProps.instructorId === filterId;
      }
      if (viewMode === "COURSE_CLASS") {
        return event.extendedProps.courseClassId === filterId;
      }
      if (viewMode === "ROOM") {
        return event.extendedProps.roomId === filterId;
      }
      return true;
    });
  }, [events, viewMode, filterId, selectedDepartmentId]);

  const scheduleConflicts = useMemo(() => {
    if (!formData.date || !formData.timeSlotId) return [];

    return events
      .filter((event) => String(event.id) !== String(editingScheduleId || ""))
      .filter((event) => {
        const eventDate = String(event.start || "").split("T")[0];
        return eventDate === formData.date && String(event.extendedProps?.timeSlotId || "") === String(formData.timeSlotId);
      })
      .flatMap((event) => {
        const props = event.extendedProps || {};
        const className = props.courseClassName || event.title || "lớp khác";
        const conflicts: Array<{ type: "room" | "lecturer" | "courseClass"; message: string }> = [];

        if (formData.courseClassId && String(props.courseClassId || "") === String(formData.courseClassId)) {
          conflicts.push({
            type: "courseClass",
            message: `${className} đã có lịch trong ca này.`,
          });
        }

        if (formData.roomId && String(props.roomId || "") === String(formData.roomId)) {
          conflicts.push({
            type: "room",
            message: `Phòng ${props.roomCode || "đã chọn"} đã có ${className} trong ca này.`,
          });
        }

        if (formData.instructorId && String(props.instructorId || "") === String(formData.instructorId)) {
          conflicts.push({
            type: "lecturer",
            message: `Giảng viên ${props.instructorName || "đã chọn"} đã dạy ${className} trong ca này.`,
          });
        }

        return conflicts;
    });
  }, [editingScheduleId, events, formData.courseClassId, formData.date, formData.instructorId, formData.roomId, formData.timeSlotId]);

  const periodProgressByClass = useMemo(() => {
    const scheduledPeriodsByClass = events.reduce((acc, event) => {
      const courseClassId = String(event.extendedProps?.courseClassId || "");
      if (!courseClassId) return acc;
      acc.set(courseClassId, (acc.get(courseClassId) || 0) + (Number(event.extendedProps?.numberOfPeriods) || 0));
      return acc;
    }, new Map<string, number>());

    return courseClasses.reduce((acc, courseClass) => {
      const courseClassId = courseClassIdOf(courseClass);
      acc.set(courseClassId, {
        scheduled: scheduledPeriodsByClass.get(courseClassId) || 0,
        required: requiredPeriodsOf(courseClass),
      });
      return acc;
    }, new Map<string, { scheduled: number; required: number }>());
  }, [courseClasses, events]);

  const completedCourseClassIds = useMemo(() => {
    return new Set(
      courseClasses
        .filter((courseClass) => {
          const progress = periodProgressByClass.get(courseClassIdOf(courseClass));
          return progress ? progress.scheduled >= progress.required : false;
        })
        .map((courseClass) => courseClassIdOf(courseClass))
    );
  }, [courseClasses, periodProgressByClass]);

  const unscheduledCourseClasses = useMemo(() => {
    return courseClasses.filter((courseClass) => !completedCourseClassIds.has(courseClassIdOf(courseClass)));
  }, [completedCourseClassIds, courseClasses]);

  const modalCourseClasses = useMemo(() => {
    if (!isEditing) return unscheduledCourseClasses;
    const selectedClass = courseClasses.find((courseClass) => courseClassIdOf(courseClass) === String(formData.courseClassId));
    if (!selectedClass) return unscheduledCourseClasses;
    return [
      selectedClass,
      ...unscheduledCourseClasses.filter((courseClass) => courseClassIdOf(courseClass) !== courseClassIdOf(selectedClass)),
    ];
  }, [courseClasses, formData.courseClassId, isEditing, unscheduledCourseClasses]);

  const selectedCourseProgress = useMemo(() => {
    const progress = periodProgressByClass.get(String(formData.courseClassId || ""));
    const scheduled = progress?.scheduled || 0;
    const required = progress?.required || 0;
    return {
      scheduled,
      required,
      remaining: Math.max(required - scheduled, 0),
    };
  }, [formData.courseClassId, periodProgressByClass]);

  const resetModalFields = () => {
    setServerScheduleError("");
    setFormData({
      courseClassId: "",
      courseClassName: "",
      seriesEditMode: "ONLY_THIS",
      roomId: "",
      roomCode: "",
      timeSlotId: "",
      slotCode: "",
      instructorId: "",
      instructorName: "",
      date: "",
      numberOfPeriods: 2,
      semesterId: selectedSemesterId,
      note: "",
      mode: "LT",
      scheduleStatus: "PLANNED"
    });
    setIsEditing(false);
    setEditingScheduleId(null);
  };

  const handleCloseModal = () => {
    closeModal();
    resetModalFields();
  };

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    resetModalFields();
    const timePart = selectInfo.startStr.includes('T') ? selectInfo.startStr.split('T')[1].substring(0, 5) : "";
    const matchedSlot = findMatchingTimeSlot(timePart, timeSlots);
    setFormData(prev => ({
      ...prev,
      date: selectInfo.startStr.split('T')[0],
      timeSlotId: matchedSlot?.timeSlotId || ""
    }));
    openModal();
  };

  const handleEventReceive = (info: EventReceiveArg) => {
    const dateStr = info.event.startStr.split('T')[0];
    const courseClassId = info.event.extendedProps.courseClassId || info.event.id;
    const timePart = info.event.startStr.includes('T') ? info.event.startStr.split('T')[1].substring(0, 5) : "";
    const matchedSlot = findMatchingTimeSlot(timePart, timeSlots);
    
    info.revert();
    
    resetModalFields();
    const selectedClass = courseClasses.find((courseClass: any) => courseClassIdOf(courseClass) === String(courseClassId));
    setFormData(prev => ({ 
      ...prev, 
      date: dateStr,
      courseClassId: courseClassId,
      timeSlotId: matchedSlot?.timeSlotId || "",
      instructorId: selectedClass?.assignedInstructorId || "",
      instructorName: selectedClass?.assignedInstructorName || "",
      roomId: selectedClass?.roomId || "",
      semesterId: selectedClass?.semesterId || selectedSemesterId,
    }));
    openModal();
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    const props = event.extendedProps;
    setServerScheduleError("");
    setFormData({
      courseClassId: props.courseClassId || "",
      courseClassName: props.courseClassName || "",
      seriesEditMode: "ONLY_THIS",
      roomId: props.roomId || "",
      roomCode: props.roomCode || "",
      timeSlotId: props.timeSlotId || "",
      slotCode: props.slotCode || "",
      instructorId: props.instructorId || "",
      instructorName: props.instructorName || "",
      date: event.startStr.split('T')[0],
      numberOfPeriods: props.numberOfPeriods || 2,
      semesterId: props.semesterId || selectedSemesterId,
      note: props.note || "",
      mode: props.mode || "LT",
      scheduleStatus: props.scheduleStatus || "PLANNED"
    });
    setEditingScheduleId(event.id);
    setIsEditing(true);
    openModal();
  };

  const handleAddSchedule = async () => {
    if (!formData.courseClassId || !formData.instructorId || !formData.roomId || !formData.timeSlotId || !formData.date) {
      toast.error("Vui lòng điền đầy đủ các trường bắt buộc");
      return;
    }
    if (isEditing && formData.seriesEditMode === "THIS_AND_FOLLOWING") {
      toast.error("Chưa hỗ trợ đổi cả chuỗi tuần sau. Mặc định chỉ thay đổi buổi này.");
      setServerScheduleError("Chưa hỗ trợ đổi cả chuỗi tuần sau. Hãy chọn 'Chỉ thay đổi buổi này'.");
      return;
    }
    if (scheduleConflicts.length > 0) {
      setServerScheduleError(scheduleConflicts[0].message);
      toast.error(scheduleConflicts[0].message);
      return;
    }
    if (isSaving) return;

    try {
      setIsSaving(true);
      setServerScheduleError("");
      const selectedClass = courseClasses.find(c => courseClassIdOf(c) === String(formData.courseClassId));
      const normalizedDate = String(formData.date).split("T")[0];
      const dateObj = new Date(`${normalizedDate}T00:00:00`);
      const jsDay = dateObj.getDay();
      const dayOfWeek = jsDay === 0 ? 7 : jsDay;

      const payload = {
        ...formData,
        date: normalizedDate,
        note: isEditing
          ? String(formData.note || "").includes("[EXCEPTION]")
            ? formData.note
            : `[EXCEPTION] ${formData.note || ""}`.trim()
          : formData.note,
        numberOfPeriods: Number(formData.numberOfPeriods) || 1,
        dayOfWeek: dayOfWeek,
        semesterId: selectedClass?.semesterId || formData.semesterId || selectedSemesterId
      };
      console.info("[TimetableBuilder] Saving schedule payload", payload);

      let savedScheduleId = editingScheduleId || "";

      if (isEditing && editingScheduleId) {
        const response = await scheduleApi.update(editingScheduleId, payload, { timeout: 12000 });
        const saved = unwrapResponseData(response);
        savedScheduleId = saved.scheduleId || editingScheduleId;
        toast.success("Cập nhật lịch học thành công!");
      } else {
        const response = await scheduleApi.create(payload, { timeout: 12000 });
        const saved = unwrapResponseData(response);
        savedScheduleId = saved.scheduleId || saved.id || "";
        toast.success("Sắp lịch học thành công!");
      }

      if (savedScheduleId) {
        const nextEvent = buildCalendarEventFromPayload(savedScheduleId, payload);
        setEvents(prev => {
          if (isEditing) {
            return prev.map(event => event.id === savedScheduleId ? nextEvent : event);
          }
          return [...prev.filter(event => event.id !== savedScheduleId), nextEvent];
        });
      }

      handleCloseModal();
      await fetchInitialData();
    } catch (error: any) {
      const message = scheduleSaveErrorMessage(error);
      if (error?.response?.status !== 409) {
        console.error("[TimetableBuilder] Failed to save schedule", error);
      } else {
        console.warn("[TimetableBuilder] Schedule conflict", error.response?.data);
      }
      setServerScheduleError(message);
      toast.error(message);
      window.alert(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSchedule = async () => {
    if (!editingScheduleId) return;
    if (!confirm("Bạn có chắc chắn muốn xóa lịch học này?")) return;
    try {
      await scheduleApi.delete(editingScheduleId);
      setEvents(prev => prev.filter(event => event.id !== editingScheduleId));
      toast.success("Xóa lịch học thành công!");
      handleCloseModal();
      void fetchInitialData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi khi xóa lịch học.");
    }
  };

  const findMatchingTimeSlot = (timeStr: string, slots: any[]) => {
    if (!timeStr) return null;
    const parseTimeToMinutes = (t: string) => {
      const parts = t.split(':').map(Number);
      return parts[0] * 60 + (parts[1] || 0);
    };
    const targetMin = parseTimeToMinutes(timeStr);
    
    let bestSlot = null;
    let minDiff = Infinity;
    
    for (const slot of slots) {
      const startMin = parseTimeToMinutes(slot.startTime);
      const endMin = parseTimeToMinutes(slot.endTime);
      if (targetMin >= startMin && targetMin < endMin) {
        return slot;
      }
      const diff = Math.abs(startMin - targetMin);
      if (diff < minDiff) {
        minDiff = diff;
        bestSlot = slot;
      }
    }
    return bestSlot;
  };

  const handleEventDropOrResize = async (info: any) => {
    const event = info.event;
    const scheduleId = event.id;
    
    const originalEvent = events.find(e => e.id === scheduleId);
    if (!originalEvent) {
      info.revert();
      return;
    }
    
    const newDate = event.startStr.split('T')[0];
    let newTimeSlotId = originalEvent.extendedProps.timeSlotId;
    
    if (event.startStr.includes('T')) {
      const timePart = event.startStr.split('T')[1].substring(0, 5); // "HH:MM"
      const matchedSlot = findMatchingTimeSlot(timePart, timeSlots);
      if (matchedSlot) {
        newTimeSlotId = matchedSlot.timeSlotId;
      }
    }
    
    const dateObj = new Date(newDate);
    const jsDay = dateObj.getDay();
    const dayOfWeek = jsDay === 0 ? 7 : jsDay;
    
    // Tính toán số tiết mới nếu bị thay đổi kích thước
    let newPeriods = originalEvent.extendedProps.numberOfPeriods;
    if (event.end && event.start) {
      const diffMs = event.end.getTime() - event.start.getTime();
      const diffMins = diffMs / (1000 * 60);
      newPeriods = Math.max(1, Math.round(diffMins / 50)); // ~50 phút một tiết
    }

    const payload = {
      scheduleId,
      courseClassId: originalEvent.extendedProps.courseClassId,
      roomId: originalEvent.extendedProps.roomId,
      timeSlotId: newTimeSlotId,
      instructorId: originalEvent.extendedProps.instructorId,
      date: newDate,
      dayOfWeek,
      numberOfPeriods: newPeriods,
      semesterId: originalEvent.extendedProps.semesterId || selectedSemesterId,
      mode: originalEvent.extendedProps.mode || "LT",
      scheduleStatus: originalEvent.extendedProps.scheduleStatus || "PLANNED",
      note: String(originalEvent.extendedProps.note || "").includes("[EXCEPTION]")
        ? originalEvent.extendedProps.note
        : `[EXCEPTION] ${originalEvent.extendedProps.note || ""}`.trim()
    };
    
    try {
      await scheduleApi.update(scheduleId, payload);
      toast.success("Đã di chuyển lịch học thành công!");
      fetchInitialData();
    } catch (error: any) {
      info.revert();
      toast.error(error.response?.data?.message || "Lỗi khi cập nhật lịch học. Có thể bị trùng lịch!");
    }
  };

  const handleViewModeChange = (val: string) => {
    setViewMode(val);
    setFilterId("ALL");
  };

  const handleAutoSchedule = async () => {
    if (!selectedSemesterId) {
      toast.error("Vui lòng chọn học kỳ");
      return;
    }
    try {
      setIsAutoScheduling(true);
      setAutoScheduleStatus("Đang xếp lịch gốc theo phân công...");
      await scheduleApi.generateAutoSchedule(selectedSemesterId);
      toast.success("Đã hoàn tất tự động xếp lịch gốc!");
      await fetchInitialData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Không thể chạy tự động xếp lịch gốc");
    } finally {
      setIsAutoScheduling(false);
      setAutoScheduleStatus("");
    }
  };

  const handleModalFormDataChange = (nextFormData: any) => {
    if (serverScheduleError) {
      setServerScheduleError("");
    }
    setFormData(nextFormData);
  };

  return (
    <div className="flex h-[calc(100vh-140px)] min-h-[680px] w-full max-w-full flex-col gap-4 overflow-hidden text-[14px]">
      {/* TOOLBAR */}
      <div className="flex-shrink-0 flex flex-wrap items-center gap-3 p-3.5 bg-white/60 dark:bg-gray-900/40 backdrop-blur-xl border border-gray-200/50 dark:border-gray-800/50 rounded-2xl shadow-sm transition-all">
        {/* Semester Selector */}
        <div className="flex min-w-0 flex-wrap items-center gap-2 px-2 text-[14px] font-semibold text-indigo-600 dark:text-indigo-400 md:border-r border-gray-200 dark:border-gray-800 pr-4">
          <CalendarRange className="w-4 h-4" />
          <span>Học kỳ:</span>
          <Select value={selectedSemesterId} onValueChange={(val) => { setSelectedSemesterId(val); setFormData(prev => ({ ...prev, semesterId: val })); }}>
            <SelectTrigger className="ml-0 h-9 w-[min(180px,calc(100vw-3rem))] bg-white dark:bg-gray-900 rounded-lg border-gray-200 dark:border-gray-700 md:ml-2">
              <SelectValue placeholder="Chọn học kỳ" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {semesters.map(sem => (
                <SelectItem key={sem.semesterId} value={sem.semesterId}>
                  {sem.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 text-[14px] font-semibold text-brand-600 dark:text-brand-400">
          <Filter className="w-4 h-4" />
          <span>Lọc theo:</span>
        </div>
        
        <Select value={viewMode} onValueChange={handleViewModeChange}>
          <SelectTrigger className="h-10 w-[min(200px,calc(100vw-3rem))] bg-white dark:bg-gray-900 rounded-xl border-gray-200 dark:border-gray-700">
            <SelectValue placeholder="Chọn chế độ xem" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="ALL">Toàn trường</SelectItem>
            <SelectItem value="LECTURER">Theo Giảng viên</SelectItem>
            <SelectItem value="COURSE_CLASS">Theo Lớp học phần</SelectItem>
            <SelectItem value="ROOM">Theo Phòng học</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedDepartmentId} onValueChange={setSelectedDepartmentId}>
          <SelectTrigger className="h-10 w-[min(260px,calc(100vw-3rem))] bg-white dark:bg-gray-900 rounded-xl border-gray-200 dark:border-gray-700">
            <SelectValue placeholder="Lọc theo khoa" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="ALL">Tất cả khoa</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept.departmentId || dept.id} value={dept.departmentId || dept.id}>
                {dept.code ? `${dept.code} - ${dept.name}` : dept.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {viewMode === "LECTURER" && (
          <Select value={filterId} onValueChange={setFilterId}>
            <SelectTrigger className="h-10 w-[min(300px,calc(100vw-3rem))] bg-white dark:bg-gray-900 rounded-xl border-gray-200 dark:border-gray-700">
              <SelectValue placeholder="-- Chọn giảng viên --" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="ALL">Tất cả giảng viên</SelectItem>
              {lecturers.map(l => (
                <SelectItem key={lecturerIdOf(l)} value={lecturerIdOf(l)}>
                  {l.fullName} ({l.instructorCode || l.employeeCode})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {viewMode === "COURSE_CLASS" && (
          <Select value={filterId} onValueChange={setFilterId}>
            <SelectTrigger className="h-10 w-[min(300px,calc(100vw-3rem))] bg-white dark:bg-gray-900 rounded-xl border-gray-200 dark:border-gray-700">
              <SelectValue placeholder="-- Chọn lớp học phần --" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="ALL">Tất cả lớp học phần</SelectItem>
              {courseClasses.map(c => (
                <SelectItem key={courseClassIdOf(c)} value={courseClassIdOf(c)}>
                  {c.classCode} - {c.courseName || 'Lớp học phần'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {viewMode === "ROOM" && (
          <Select value={filterId} onValueChange={setFilterId}>
            <SelectTrigger className="h-10 w-[min(300px,calc(100vw-3rem))] bg-white dark:bg-gray-900 rounded-xl border-gray-200 dark:border-gray-700">
              <SelectValue placeholder="-- Chọn phòng học --" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="ALL">Tất cả phòng học</SelectItem>
              {rooms.map(r => (
                <SelectItem key={roomIdOf(r)} value={roomIdOf(r)}>
                  {r.code || r.roomCode} ({r.type || r.roomType || 'Phòng'})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <div className="ml-auto min-w-fit">
          <button
            onClick={handleAutoSchedule}
            disabled={isAutoScheduling}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-medium shadow-md shadow-indigo-500/20 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isAutoScheduling ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{autoScheduleStatus}</span>
              </>
            ) : (
              <>
                <Bot className="w-5 h-5" />
                <span>Tự động xếp lịch gốc</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-hidden xl:grid-cols-[clamp(220px,20vw,300px)_minmax(0,1fr)]">
        <TimetableSidebar 
          courseClasses={courseClasses}
          completedCourseClassIds={completedCourseClassIds}
          periodProgressByClass={periodProgressByClass}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          externalEventsRef={externalEventsRef}
        />
        <TimetableCalendar 
          events={filteredEvents}
          viewMode={viewMode}
          calendarRef={calendarRef}
          onDateSelect={handleDateSelect}
          onEventClick={handleEventClick}
          onEventReceive={handleEventReceive}
          onEventDrop={handleEventDropOrResize}
          onEventResize={handleEventDropOrResize}
        />
        <TimetableModal 
          isOpen={isOpen}
          onClose={handleCloseModal}
          formData={formData}
          setFormData={handleModalFormDataChange}
          courseClasses={modalCourseClasses}
          courses={courses}
          rooms={rooms}
          timeSlots={timeSlots}
          lecturers={lecturers}
          conflicts={scheduleConflicts}
          courseProgress={selectedCourseProgress}
          saveError={serverScheduleError}
          onSubmit={handleAddSchedule}
          isEditing={isEditing}
          isSubmitting={isSaving}
          onDelete={handleDeleteSchedule}
        />
      </div>
    </div>
  );
}
