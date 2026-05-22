"use client";
import React, { useState, useRef, useEffect } from "react";
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

import TimetableSidebar from "./timetable/TimetableSidebar";
import TimetableCalendar from "./timetable/TimetableCalendar";
import TimetableModal from "./timetable/TimetableModal";

export default function TimetableBuilder() {
  const [events, setEvents] = useState<any[]>([]);
  const [courseClasses, setCourseClasses] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [timeSlots, setTimeSlots] = useState<any[]>([]);
  const [lecturers, setLecturers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
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
          roomCode: s.roomCode,
          courseClassName: s.courseClassName
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

  return (
    <div className="flex h-[calc(100vh-130px)] gap-6 overflow-hidden">
      <TimetableSidebar 
        courseClasses={courseClasses}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        externalEventsRef={externalEventsRef}
      />
      <TimetableCalendar 
        events={events}
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
  );
}
