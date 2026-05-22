import React from 'react';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { EventReceiveArg } from "@fullcalendar/interaction";
import { DateSelectArg, EventClickArg, EventContentArg } from "@fullcalendar/core";
import { MapPin, Users } from 'lucide-react';

interface Props {
  events: any[];
  calendarRef: React.RefObject<FullCalendar | null>;
  onDateSelect: (info: DateSelectArg) => void;
  onEventClick: (info: EventClickArg) => void;
  onEventReceive: (info: EventReceiveArg) => void;
}

export default function TimetableCalendar({ events, calendarRef, onDateSelect, onEventClick, onEventReceive }: Props) {
  const renderEventContent = (eventInfo: EventContentArg) => {
    const isConflict = false; // Example to show red conflict later
    const bgColor = isConflict ? 'bg-red-500/10 border-red-500 text-red-700 dark:text-red-400' 
      : 'bg-brand-500/10 border-brand-500 text-brand-700 dark:text-brand-400';

    return (
      <div className={`flex flex-col items-start p-1.5 rounded-md w-full h-full overflow-hidden shadow-sm border-l-[3px] ${bgColor} backdrop-blur-sm`}>
        <div className="text-[10px] font-bold uppercase opacity-80 mb-0.5 flex items-center gap-1">
          <MapPin size={10} />
          {eventInfo.event.extendedProps.roomCode || "Chưa xếp phòng"}
        </div>
        <div className="text-xs font-semibold leading-tight line-clamp-2">
          {eventInfo.event.extendedProps.courseClassName}
        </div>
        {eventInfo.event.extendedProps.instructorName && (
          <div className="text-[10px] opacity-75 mt-auto pt-1 flex items-center gap-1">
            <Users size={10} />
            <span className="truncate">{eventInfo.event.extendedProps.instructorName}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 bg-white/60 dark:bg-gray-900/40 backdrop-blur-xl border border-gray-200/50 dark:border-gray-800/50 rounded-2xl shadow-sm overflow-hidden flex flex-col p-4 custom-calendar-wrapper">
      <FullCalendar
        ref={calendarRef as React.RefObject<FullCalendar>}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={events}
        selectable={true}
        droppable={true}
        select={onDateSelect}
        eventClick={onEventClick}
        eventReceive={onEventReceive}
        eventContent={renderEventContent}
        slotMinTime="07:00:00"
        slotMaxTime="21:00:00"
        allDaySlot={false}
        hiddenDays={[0]} // Hide sunday if needed, but usually university has sunday classes? Let's leave it.
        height="100%"
        locale="vi"
        buttonText={{
          today: 'Hôm nay',
          month: 'Tháng',
          week: 'Tuần',
          day: 'Ngày'
        }}
      />
    </div>
  );
}
