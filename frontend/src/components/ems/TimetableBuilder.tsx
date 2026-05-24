"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import { Draggable, EventReceiveArg } from "@fullcalendar/interaction";
import { DateSelectArg, EventClickArg } from "@fullcalendar/core";
import { useModal } from "@/hooks/useModal";
import { scheduleApi } from "@/api/schedule";
import { courseClassApi } from "@/api/course";
import { roomApi } from "@/api/room";
import { timeSlotApi } from "@/api/timeSlot";
import { lecturerApi } from "@/api/lecturer";
import { toast } from "sonner";
import { Filter, Bot, Loader2 } from "lucide-react";

// UI Components
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import TimetableSidebar from "./timetable/TimetableSidebar";
import TimetableCalendar from "./timetable/TimetableCalendar";
import TimetableModal from "./timetable/TimetableModal";

export default function TimetableBuilder() {
  const [events, setEvents] = useState<any[]>([]);
  const [courseClasses, setCourseClasses] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [timeSlots, setTimeSlots] = useState<any[]>([]);
  const [lecturers, setLecturers] = useState<any[]>([]);
  
  // State phục vụ tìm kiếm & lọc
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("ALL"); // ALL | LECTURER | COURSE_CLASS
  const [filterId, setFilterId] = useState("ALL");
  
  const [isAutoScheduling, setIsAutoScheduling] = useState(false);
  const [autoScheduleStatus, setAutoScheduleStatus] = useState("");
  
  const [formData, setFormData] = useState({
    courseClassId: "",
    roomId: "",
    timeSlotId: "",
    instructorId: "",
    date: "",
    numberOfPeriods: 2,
    semesterId: "77730894-3cf6-4f71-9c60-84ce2289c099",
    note: "",
    mode: "LT",
    scheduleStatus: "CONFIRMED"
  });

  const calendarRef = useRef<FullCalendar>(null);
  const externalEventsRef = useRef<HTMLDivElement>(null);
  const { isOpen, openModal, closeModal } = useModal();

  const fetchInitialData = async () => {
    try {
      const [schedulesRes, classesRes, roomsRes, slotsRes, lecturersRes] = await Promise.all([
        scheduleApi.getAll(),
        courseClassApi.getAll(),
        roomApi.getAll(),
        timeSlotApi.getAll(),
        lecturerApi.getAll()
      ]);

      const scheduleEvents = (schedulesRes.data?.data || schedulesRes.data || []).map((s: any) => ({
        id: s.scheduleId,
        title: `${s.courseClassName} - ${s.roomCode}`,
        start: s.date,
        allDay: true, 
        extendedProps: {
          calendar: s.mode === 'TH' ? 'Warning' : 'Primary',
          instructorName: s.instructorName,
          instructorId: s.instructorId,
          roomCode: s.roomCode,
          courseClassName: s.courseClassName,
          courseClassId: s.courseClassId, 
        }
      }));
      setEvents(scheduleEvents);
      setCourseClasses(classesRes || []);
      setRooms(roomsRes.data || roomsRes || []);
      setTimeSlots(slotsRes.data || []);
      setLecturers(Array.isArray(lecturersRes) ? lecturersRes : []);
    } catch (error) {
      console.error("Failed to fetch calendar data", error);
      toast.error("Không thể tải dữ liệu thời khóa biểu");
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

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
            create: false
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
    if (viewMode === "ALL" || filterId === "ALL") return events;
    
    return events.filter(event => {
      if (viewMode === "LECTURER") {
        return event.extendedProps.instructorId === filterId;
      }
      if (viewMode === "COURSE_CLASS") {
        return event.extendedProps.courseClassId === filterId;
      }
      return true;
    });
  }, [events, viewMode, filterId]);

  const resetModalFields = () => {
    setFormData({
      courseClassId: "",
      roomId: "",
      timeSlotId: "",
      instructorId: "",
      date: "",
      numberOfPeriods: 2,
      semesterId: "77730894-3cf6-4f71-9c60-84ce2289c099",
      note: "",
      mode: "LT",
      scheduleStatus: "CONFIRMED"
    });
  };

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    resetModalFields();
    setFormData(prev => ({ ...prev, date: selectInfo.startStr.split('T')[0] }));
    openModal();
  };

  const handleEventReceive = (info: EventReceiveArg) => {
    const dateStr = info.event.startStr.split('T')[0];
    const courseClassId = info.event.id;
    
    info.revert();
    
    resetModalFields();
    setFormData(prev => ({ 
      ...prev, 
      date: dateStr,
      courseClassId: courseClassId 
    }));
    openModal();
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    toast.info(`Lớp: ${event.extendedProps.courseClassName}\nPhòng: ${event.extendedProps.roomCode}\nGV: ${event.extendedProps.instructorName || 'Chưa phân công'}`);
  };

  const handleAddSchedule = async () => {
    if (!formData.courseClassId || !formData.roomId || !formData.timeSlotId || !formData.date) {
      toast.error("Vui lòng điền đầy đủ các trường bắt buộc");
      return;
    }

    try {
      const selectedClass = courseClasses.find(c => (c.id || c.courseClassId) === formData.courseClassId);
      const dateObj = new Date(formData.date);
      const jsDay = dateObj.getDay();
      const dayOfWeek = jsDay === 0 ? 7 : jsDay;

      const payload = {
        ...formData,
        dayOfWeek: dayOfWeek,
        semesterId: selectedClass?.semesterId || formData.semesterId
      };

      await scheduleApi.create(payload);
      toast.success("Sắp lịch học thành công!");
      closeModal();
      fetchInitialData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi khi sắp lịch học. Có thể bị trùng lịch!");
    }
  };

  const handleViewModeChange = (val: string) => {
    setViewMode(val);
    setFilterId("ALL");
  };

  const handleAutoSchedule = async () => {
    try {
      setIsAutoScheduling(true);
      setAutoScheduleStatus("Đang khởi tạo thuật toán...");
      await scheduleApi.generateAutoSchedule("77730894-3cf6-4f71-9c60-84ce2289c099"); // TODO: Use dynamic semester ID

      const interval = setInterval(async () => {
        try {
          const res = await scheduleApi.getAutoScheduleStatus("77730894-3cf6-4f71-9c60-84ce2289c099");
          const statusName = res.data?.data;
          setAutoScheduleStatus("Trạng thái: " + statusName);
          
          if (statusName === "NOT_SOLVING") {
            clearInterval(interval);
            setIsAutoScheduling(false);
            toast.success("Đã hoàn tất tự động xếp lịch!");
            fetchInitialData();
          }
        } catch (e) {
          clearInterval(interval);
          setIsAutoScheduling(false);
        }
      }, 3000);

    } catch (error: any) {
      setIsAutoScheduling(false);
      toast.error("Không thể chạy tự động xếp lịch");
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[700px] gap-5">
      {/* TOOLBAR */}
      <div className="flex-shrink-0 flex flex-wrap items-center gap-4 p-3.5 bg-white/60 dark:bg-gray-900/40 backdrop-blur-xl border border-gray-200/50 dark:border-gray-800/50 rounded-2xl shadow-sm transition-all">
        <div className="flex items-center gap-2 px-2 text-sm font-semibold text-brand-600 dark:text-brand-400">
          <Filter className="w-4 h-4" />
          <span>Bộ lọc hiển thị:</span>
        </div>
        
        <Select value={viewMode} onValueChange={handleViewModeChange}>
          <SelectTrigger className="w-[200px] h-10 bg-white dark:bg-gray-900 rounded-xl border-gray-200 dark:border-gray-700">
            <SelectValue placeholder="Chọn chế độ xem" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="ALL">Toàn trường</SelectItem>
            <SelectItem value="LECTURER">Theo Giảng viên</SelectItem>
            <SelectItem value="COURSE_CLASS">Theo Lớp học phần</SelectItem>
          </SelectContent>
        </Select>

        {viewMode === "LECTURER" && (
          <Select value={filterId} onValueChange={setFilterId}>
            <SelectTrigger className="w-[300px] h-10 bg-white dark:bg-gray-900 rounded-xl border-gray-200 dark:border-gray-700">
              <SelectValue placeholder="-- Chọn giảng viên --" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="ALL">Tất cả giảng viên</SelectItem>
              {lecturers.map(l => (
                <SelectItem key={l.id || l.employeeId} value={l.id || l.employeeId}>
                  {l.fullName} ({l.instructorCode || l.employeeCode})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {viewMode === "COURSE_CLASS" && (
          <Select value={filterId} onValueChange={setFilterId}>
            <SelectTrigger className="w-[300px] h-10 bg-white dark:bg-gray-900 rounded-xl border-gray-200 dark:border-gray-700">
              <SelectValue placeholder="-- Chọn lớp học phần --" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="ALL">Tất cả lớp học phần</SelectItem>
              {courseClasses.map(c => (
                <SelectItem key={c.id || c.courseClassId} value={c.id || c.courseClassId}>
                  {c.courseClassName || c.classCode}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <div className="ml-auto">
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
                <span>AI Xếp Lịch Tự Động</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex flex-1 gap-6 overflow-hidden">
        <TimetableSidebar 
          courseClasses={courseClasses}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          externalEventsRef={externalEventsRef}
        />
        <TimetableCalendar 
          events={filteredEvents}
          calendarRef={calendarRef}
          onDateSelect={handleDateSelect}
          onEventClick={handleEventClick}
          onEventReceive={handleEventReceive}
        />
        <TimetableModal 
          isOpen={isOpen}
          onClose={closeModal}
          formData={formData}
          setFormData={setFormData}
          courseClasses={courseClasses}
          rooms={rooms}
          timeSlots={timeSlots}
          lecturers={lecturers}
          onSubmit={handleAddSchedule}
        />
      </div>
    </div>
  );
}