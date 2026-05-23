import React from 'react';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { EventReceiveArg } from "@fullcalendar/interaction";
import { DateSelectArg, EventClickArg, EventContentArg } from "@fullcalendar/core";
import { MapPin, Users, Clock } from 'lucide-react'; // Thêm icon Clock

interface Props {
  events: any[];
  calendarRef: React.RefObject<FullCalendar | null>;
  onDateSelect: (info: DateSelectArg) => void;
  onEventClick: (info: EventClickArg) => void;
  onEventReceive: (info: EventReceiveArg) => void;
}

export default function TimetableCalendar({ events, calendarRef, onDateSelect, onEventClick, onEventReceive }: Props) {
  const renderEventContent = (eventInfo: EventContentArg) => {
    // Nhận diện trạng thái trùng lịch từ Dữ liệu (Component cha truyền vào)
    const isConflict = eventInfo.event.extendedProps.isConflict === true; 
    
    // Đổi màu tùy thuộc vào tính chất (Lý thuyết, Thực hành, hay Trùng lịch)
    let bgColor = 'bg-brand-500/10 border-brand-500 text-brand-700 dark:text-brand-400';
    if (isConflict) {
      bgColor = 'bg-red-500/10 border-red-500 text-red-700 dark:text-red-400';
    } else if (eventInfo.event.extendedProps.calendar === 'Warning') {
      bgColor = 'bg-amber-500/10 border-amber-500 text-amber-700 dark:text-amber-400';
    }

    return (
      <div className={`flex flex-col items-start p-1.5 rounded-md w-full h-full overflow-hidden shadow-sm border-l-[3px] ${bgColor} backdrop-blur-sm transition-all hover:brightness-95 cursor-pointer`}>
        <div className="flex w-full items-center justify-between gap-1 mb-0.5">
          <div className="text-[10px] font-bold uppercase opacity-80 flex items-center gap-1 truncate">
            <MapPin size={10} className="shrink-0" />
            <span className="truncate">{eventInfo.event.extendedProps.roomCode || "Chưa xếp phòng"}</span>
          </div>
          {eventInfo.timeText && (
             <div className="text-[9px] font-medium opacity-70 flex items-center gap-0.5 shrink-0">
               <Clock size={8} />
               {eventInfo.timeText}
             </div>
          )}
        </div>
        
        <div className="text-xs font-semibold leading-tight line-clamp-2 mt-0.5">
          {eventInfo.event.extendedProps.courseClassName}
        </div>
        
        {eventInfo.event.extendedProps.instructorName && (
          <div className="text-[10px] opacity-75 mt-auto pt-1 flex items-center gap-1 w-full">
            <Users size={10} className="shrink-0" />
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
        slotMaxTime="21:30:00"
        allDaySlot={false} // Quan trọng: Tắt vùng All-day để sự kiện rớt đúng vào khung giờ
        height="100%"
        locale="vi"
        buttonText={{
          today: 'Hôm nay',
          month: 'Tháng',
          week: 'Tuần',
          day: 'Ngày'
        }}
        // Tùy chỉnh hiển thị thời gian trục dọc
        slotLabelFormat={{
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }}
      />
    </div>
  );
}