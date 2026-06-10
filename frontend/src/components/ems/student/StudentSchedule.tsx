"use client";

import React, { useRef, useState } from 'react';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventContentArg } from "@fullcalendar/core";
import { BookOpen, Clock, MapPin, User, X } from 'lucide-react';
import type { StudentScheduleItem } from '@/types/student-portal';
import viLocale from '@fullcalendar/core/locales/vi';

interface StudentScheduleProps {
  schedules: StudentScheduleItem[];
}

export default function StudentSchedule({ schedules }: StudentScheduleProps) {
  const [selectedEvent, setSelectedEvent] = useState<StudentScheduleItem | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const calendarRef = useRef<FullCalendar>(null);

  // Map schedules to FullCalendar events
  const events = schedules.map(item => {
    const start = item.date && item.startTime ? `${item.date}T${item.startTime}` : undefined;
    const end = item.date && item.endTime ? `${item.date}T${item.endTime}` : undefined;

    return {
      id: item.id,
      title: `${item.classCode} - ${item.room || ''}`,
      start,
      end,
      extendedProps: {
        ...item
      }
    };
  }).filter(e => e.start);

  const renderEventContent = (eventInfo: EventContentArg) => {
    const props = eventInfo.event.extendedProps as StudentScheduleItem;
    const isPractical = props.mode === 'TH';
    const isOnline = props.mode === 'Online';
    const hasRoom = !!props.room && props.room !== 'Chưa xếp phòng';
    
    let modeLabel = 'LÝ THUYẾT';
    if (isPractical) modeLabel = 'THỰC HÀNH';
    else if (isOnline) modeLabel = 'ONLINE';

    const startTime = eventInfo.event.start?.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    const endTime = eventInfo.event.end?.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    const palette = !hasRoom
      ? {
          card: 'bg-slate-100/80 border-slate-400 text-slate-700 dark:bg-slate-800/80 dark:border-slate-500 dark:text-slate-200 opacity-80',
          room: 'bg-slate-500 text-white',
          chip: 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200',
          meta: 'text-slate-500 dark:text-slate-300',
        }
      : isPractical
        ? {
            card: 'bg-amber-50/95 border-amber-600 text-amber-950 dark:bg-amber-950/40 dark:border-amber-400 dark:text-amber-100',
            room: 'bg-amber-600 text-white',
            chip: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200',
            meta: 'text-amber-700 dark:text-amber-200',
          }
        : {
            card: 'bg-emerald-50/95 border-emerald-600 text-emerald-950 dark:bg-emerald-950/40 dark:border-emerald-400 dark:text-emerald-100',
            room: 'bg-emerald-600 text-white',
            chip: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200',
            meta: 'text-emerald-700 dark:text-emerald-200',
          };

    return (
      <div className={`group flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-lg border-l-4 p-3 shadow-sm transition-all hover:shadow-md ${palette.card} ${props.isCancelled ? 'opacity-50' : ''}`}>
        <div className="mb-2 flex items-start justify-between gap-2">
          <span className={`max-w-[54%] truncate rounded-full px-2.5 py-1 text-[10px] font-bold uppercase leading-none shadow-sm ${palette.room}`}>
            {props.room || 'CHƯA XẾP'}
          </span>
          <span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold leading-none ${palette.chip}`}>
            {props.isCancelled ? 'ĐÃ HỦY' : modeLabel}
          </span>
        </div>
        <div className={`mb-1 line-clamp-2 text-xs font-bold leading-snug ${props.isCancelled ? 'line-through' : ''}`}>
          {props.classCode}
        </div>
        <div className={`mb-2 line-clamp-2 text-[10px] leading-snug opacity-80 ${props.isCancelled ? 'line-through' : ''}`}>
          {props.courseName || 'Tên môn học'}
        </div>
        <div className={`mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-semibold ${palette.meta}`}>
          <span className="flex min-w-0 items-center gap-1">
            <MapPin size={13} className="shrink-0" />
            <span className="truncate text-ellipsis">{props.room || 'Chưa có phòng học'}</span>
          </span>
          <span className="flex items-center gap-1">
            <Clock size={13} />
            {startTime}{endTime ? ` - ${endTime}` : ''}
          </span>
          <span className="flex items-center gap-1">
            <User size={13} />
            <span className="truncate text-ellipsis">{props.lecturer}</span>
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="student-schedule-calendar w-full overflow-x-auto">
      <div className="min-w-[860px] rounded-2xl border border-emerald-100 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          locales={[viLocale]}
          locale="vi"
          buttonText={{
            today: 'Hôm nay',
            month: 'Tháng',
            week: 'Tuần',
            day: 'Ngày'
          }}
          events={events}
          eventContent={renderEventContent}
          eventDisplay="block"
          editable={false}
          selectable={false}
          slotMinTime="07:00:00"
          slotMaxTime="21:00:00"
          slotDuration="01:00:00"
          slotLabelInterval="01:00:00"
          allDaySlot={false}
          height="800px"
          nowIndicator
          dayHeaderFormat={{ weekday: 'short', day: '2-digit', month: 'numeric' }}
          dayHeaderContent={(arg) => {
            const date = arg.date;
            const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
            const dayName = days[date.getDay()];
            const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`;
            return `${dayName} ${formattedDate}`;
          }}
          slotLabelFormat={{
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }}
          eventClick={(info) => {
            const props = info.event.extendedProps as StudentScheduleItem;
            setSelectedEvent(props);
            setShowDetailModal(true);
          }}
        />
      </div>

      {/* Modal chi tiết buổi học */}
      {showDetailModal && selectedEvent && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-800">
            <div className="relative p-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              <button 
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedEvent(null);
                }} 
                className="absolute right-4 top-4 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400"
              >
                <X size={20} />
              </button>
              
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg text-emerald-600">
                  <BookOpen size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Chi tiết lịch học</h2>
                  <p className="text-sm text-slate-500 font-medium">{selectedEvent.classCode}</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div className="space-y-3">
                <h3 className="font-bold text-slate-800 dark:text-slate-100 line-clamp-2">
                  {selectedEvent.courseName}
                </h3>
                
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                    <Clock size={16} className="text-emerald-500 shrink-0" />
                    <span className="font-medium">Thời gian: {selectedEvent.time}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                    <Clock size={16} className="text-emerald-500 shrink-0" />
                    <span className="font-medium">Ngày học: {selectedEvent.dateLabel} ({selectedEvent.dayLabel})</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                    <MapPin size={16} className="text-emerald-500 shrink-0" />
                    <span className="font-medium">Phòng học: {selectedEvent.room}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                    <User size={16} className="text-emerald-500 shrink-0" />
                    <span className="font-medium">Giảng viên: {selectedEvent.lecturer}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                    <BookOpen size={16} className="text-emerald-500 shrink-0" />
                    <span className="font-medium">Hình thức: {selectedEvent.mode === 'TH' ? 'Thực hành' : 'Lý thuyết'}</span>
                  </div>
                  {selectedEvent.isCancelled && (
                    <div className="rounded-lg bg-red-50 p-2.5 text-xs font-semibold text-red-600 dark:bg-red-950/20 dark:text-red-400">
                      Buổi học này đã bị hủy bỏ.
                    </div>
                  )}
                  {selectedEvent.overrideType && (
                    <div className="rounded-lg bg-blue-50 p-2.5 text-xs font-semibold text-blue-600 dark:bg-blue-950/20 dark:text-blue-400">
                      Lịch học thay đổi: {selectedEvent.overrideType === 'MAKEUP' ? 'Học bù' : (selectedEvent.overrideType === 'EXTRA' ? 'Tăng tiết' : 'Đổi phòng')}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedEvent(null);
                  }}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 rounded-xl text-sm font-semibold transition"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .student-schedule-calendar .fc {
          --fc-border-color: #dbe7e2;
          --fc-today-bg-color: rgba(16, 185, 129, 0.08);
          color: #0f172a;
          font-family: inherit;
        }

        .dark .student-schedule-calendar .fc {
          --fc-border-color: #334155;
          --fc-today-bg-color: rgba(52, 211, 153, 0.1);
          color: #e2e8f0;
        }

        .student-schedule-calendar .fc .fc-toolbar.fc-header-toolbar {
          align-items: center;
          gap: 1rem;
          margin: 0;
          padding: 1.5rem;
        }

        .student-schedule-calendar .fc-toolbar-title {
          color: #0f172a;
          font-size: 1.25rem !important;
          font-weight: 700 !important;
          letter-spacing: 0;
        }

        .dark .student-schedule-calendar .fc-toolbar-title {
          color: #f8fafc;
        }

        .student-schedule-calendar .fc-button-group {
          gap: 0.25rem;
          border: 1px solid #dbe7e2;
          border-radius: 0.75rem;
          background: #edf4ff;
          padding: 0.25rem;
        }

        .dark .student-schedule-calendar .fc-button-group {
          border-color: #334155;
          background: #0f172a;
        }

        .student-schedule-calendar .fc .fc-button {
          height: 2.5rem;
          border: 0 !important;
          border-radius: 0.5rem !important;
          background: transparent !important;
          box-shadow: none !important;
          color: #475569 !important;
          font-size: 0.875rem;
          font-weight: 700;
          text-transform: none;
        }

        .student-schedule-calendar .fc .fc-button:hover {
          background: #d9eaff !important;
          color: #0f172a !important;
        }

        .student-schedule-calendar .fc .fc-button-active {
          background: #ffffff !important;
          color: #059669 !important;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.12) !important;
        }

        .dark .student-schedule-calendar .fc .fc-button {
          color: #cbd5e1 !important;
        }

        .dark .student-schedule-calendar .fc .fc-button:hover,
        .dark .student-schedule-calendar .fc .fc-button-active {
          background: #1e293b !important;
          color: #34d399 !important;
        }

        .student-schedule-calendar .fc .fc-today-button {
          border: 1px solid #dbe7e2 !important;
          border-radius: 0.75rem !important;
          background: #ffffff !important;
          padding: 0.55rem 1.25rem !important;
          color: #0f172a !important;
        }

        .dark .student-schedule-calendar .fc .fc-today-button {
          border-color: #334155 !important;
          background: #0f172a !important;
          color: #e2e8f0 !important;
        }

        .student-schedule-calendar .fc-theme-standard .fc-scrollgrid {
          border: 0;
          border-top: 1px solid var(--fc-border-color);
        }

        .student-schedule-calendar .fc-theme-standard th {
          background: #edf4ff;
          border-color: var(--fc-border-color) !important;
          text-align: center !important;
        }

        .dark .student-schedule-calendar .fc-theme-standard th {
          background: #0f172a;
        }

        .student-schedule-calendar .fc .fc-col-header-cell-cushion {
          display: block;
          padding: 0.85rem 0.5rem !important;
          color: #64748b;
          font-size: 0.78rem;
          font-weight: 800;
          text-transform: uppercase;
        }

        .student-schedule-calendar .fc .fc-day-today .fc-col-header-cell-cushion {
          color: #059669;
        }

        .student-schedule-calendar .fc-timegrid-axis {
          background: #ffffff;
        }

        .dark .student-schedule-calendar .fc-timegrid-axis {
          background: #0f172a;
        }

        .student-schedule-calendar .fc-timegrid-slot {
          height: 100px;
        }

        .student-schedule-calendar .fc-direction-ltr .fc-timegrid-slot-label-frame,
        .student-schedule-calendar .fc .fc-timegrid-axis-cushion {
          padding: 0.5rem 0.75rem !important;
          color: #475569;
          font-size: 0.875rem;
          font-weight: 800;
        }

        .dark .student-schedule-calendar .fc-direction-ltr .fc-timegrid-slot-label-frame,
        .dark .student-schedule-calendar .fc .fc-timegrid-axis-cushion {
          color: #cbd5e1;
        }

        .student-schedule-calendar .fc-v-event,
        .student-schedule-calendar .fc-h-event {
          border: 0 !important;
          background: transparent !important;
          box-shadow: none !important;
        }

        .student-schedule-calendar .fc-timegrid-event,
        .student-schedule-calendar .fc-daygrid-event {
          margin: 3px 4px;
        }

        .student-schedule-calendar .fc-event-main {
          height: 100%;
          color: inherit !important;
        }

        .student-schedule-calendar .fc-timegrid-now-indicator-line {
          border-color: #059669;
        }

        .student-schedule-calendar .fc-timegrid-now-indicator-arrow {
          border-left-color: #059669;
          border-right-color: #059669;
        }

        @media (max-width: 767px) {
          .student-schedule-calendar .fc .fc-toolbar.fc-header-toolbar {
            align-items: stretch;
            padding: 1rem;
          }

          .student-schedule-calendar .fc-toolbar-title {
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}
