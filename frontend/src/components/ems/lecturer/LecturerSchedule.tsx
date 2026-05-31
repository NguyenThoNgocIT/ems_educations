"use client";
import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventContentArg } from "@fullcalendar/core";
import { scheduleApi } from "@/api/schedule";
import { MapPin, Users, BookOpen, AlertCircle } from 'lucide-react';
import { toast } from "sonner";
import AdjustmentModal from './AdjustmentModal';
import { useAuth } from '@/context/AuthContext';

export default function LecturerSchedule() {
  const { user } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const calendarRef = useRef<FullCalendar>(null);

  const fetchInitialData = async () => {
    if (!user?.id) return;
    try {
      const today = new Date();
      const res = await scheduleApi.getCalendar({
        instructorId: user.id,
        month: today.getMonth() + 1,
        year: today.getFullYear()
      });
      
      const calendarDays = res.data?.data || [];
      const scheduleEvents: any[] = [];

      calendarDays.forEach((day: any) => {
        day.items.forEach((item: any) => {
          const start = item.startTime ? `${day.date}T${item.startTime}` : `${day.date}T07:00:00`;
          const end = item.endTime ? `${day.date}T${item.endTime}` : `${day.date}T10:00:00`;

          scheduleEvents.push({
            id: item.id,
            title: `${item.courseClassCode} - ${item.roomCode || ''}`,
            start,
            end,
            extendedProps: {
              ...item,
              date: day.date,
              periods: item.numberOfPeriods || 3
            }
          });
        });
      });
      setEvents(scheduleEvents);
    } catch (error) {
      console.error("Lỗi khi tải lịch dạy", error);
      toast.error("Không thể tải lịch giảng dạy");
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const renderEventContent = (eventInfo: EventContentArg) => {
    const isPractical = eventInfo.event.extendedProps.mode === 'TH';
    const bgColor = isPractical ? 'bg-amber-500/10 border-amber-500 text-amber-700 dark:text-amber-400' 
      : 'bg-brand-500/10 border-brand-500 text-brand-700 dark:text-brand-400';

    return (
      <div className={`flex flex-col items-start p-2 rounded-lg w-full h-full overflow-hidden shadow-sm border-l-[4px] ${bgColor} backdrop-blur-md`}>
        <div className="text-[11px] font-bold uppercase opacity-80 mb-1 flex items-center gap-1.5">
          <MapPin size={12} />
          {eventInfo.event.extendedProps.roomCode || "Chưa xếp phòng"}
          <span className="ml-auto bg-white/50 dark:bg-black/20 px-1 rounded text-[9px]">{eventInfo.event.extendedProps.mode}</span>
        </div>
        <div className="text-xs font-semibold leading-tight line-clamp-2 mt-0.5">
          {eventInfo.event.extendedProps.courseClassName}
        </div>
        <div className="text-[10px] opacity-75 mt-auto pt-1 flex items-center gap-1.5">
          <BookOpen size={10} />
          <span className="truncate">{eventInfo.event.extendedProps.courseName || "Tên môn học"}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white/60 dark:bg-gray-900/40 backdrop-blur-xl border border-gray-200/50 dark:border-gray-800/50 rounded-2xl shadow-sm flex flex-col p-2 md:p-5 custom-calendar-wrapper min-h-[700px] overflow-x-auto w-full">
      <div className="min-w-[800px] h-full">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={events}
        eventContent={renderEventContent}
        slotMinTime="07:00:00"
        slotMaxTime="21:00:00"
        allDaySlot={false}
        hiddenDays={[0]} 
        height="100%"
        locale="vi"
        buttonText={{
          today: 'Hôm nay',
          month: 'Tháng',
          week: 'Tuần',
          day: 'Ngày'
        }}
        eventClick={(info) => {
          const props = info.event.extendedProps;
          setSelectedEvent({
            originalScheduleId: info.event.id,
            courseClassId: props.courseClassId,
            courseClassName: props.courseClassName,
            date: info.event.startStr.split('T')[0],
            timeSlotId: props.timeSlotId,
            periods: props.periods || 3,
            roomCode: props.roomCode
          });
        }}
      />
      </div>
      <AdjustmentModal 
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        eventData={selectedEvent}
        onSuccess={fetchInitialData}
      />
    </div>
  );
}
