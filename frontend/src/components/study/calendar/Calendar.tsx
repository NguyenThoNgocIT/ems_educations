"use client";
import React, { useState, useRef, useEffect, useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Clock, X, Save, Calendar as CalendarIcon } from "lucide-react";
import {
  EventInput,
  DateSelectArg,
  EventClickArg,
  EventContentArg,
} from "@fullcalendar/core";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/modal";

// IMPORT CÁC COMPONENT ĐÃ TÁCH
import CalendarHeader from "./CalendarHeader";
import CreateScheduleModal from "./CreateScheduleModal";

interface CalendarEvent extends EventInput {
  extendedProps: {
    calendar: string;
    room?: string;
    teacher?: string;
  };
}

const Calendar: React.FC = () => {
  const calendarRef = useRef<FullCalendar>(null);
  const { isOpen, openModal, closeModal } = useModal();

  // --- QUẢN LÝ DỮ LIỆU LỊCH (Single Source of Truth) ---
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: "1",
      title: "Phan Thành Châu 1",
      start: "2026-01-30T11:00:00",
      end: "2026-01-30T12:00:00",
      extendedProps: {
        calendar: "Warning",
        room: "L104",
        teacher: "Phan Thành Châu 1",
      },
    },
    {
      id: "2",
      title: "Trinh Le",
      start: "2026-01-31T10:00:00",
      end: "2026-01-31T11:00:00",
      extendedProps: { calendar: "Warning", room: "L105", teacher: "Trinh Le" },
    },
    {
      id: "3",
      title: "Lớp học mới",
      start: "2026-02-10T08:00:00",
      extendedProps: { calendar: "Primary" },
    },
  ]);

  // --- QUẢN LÝ TRẠNG THÁI HỆ THỐNG ---
  const [currentRange, setCurrentRange] = useState("");
  const [viewType, setViewType] = useState("Tháng");
  const [isEditing, setIsEditing] = useState(false); // Chế độ chỉnh sửa
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateScheduleOpen, setIsCreateScheduleOpen] = useState(false);

  // --- STATE CHO FORM MODAL ---
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null,
  );
  const [eventTitle, setEventTitle] = useState("");
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [eventLevel, setEventLevel] = useState("Primary");

  // 1. Logic tính toán số buổi chưa học thực tế
  // Buổi chưa học là buổi có thời gian bắt đầu lớn hơn hiện tại (01/02/2026)
  const unlearnedSessions = useMemo(() => {
    const now = new Date();
    return events.filter((e) => {
      if (!e.start) return false;
      const startDate =
        typeof e.start === "string"
          ? new Date(e.start)
          : e.start instanceof Date
            ? e.start
            : null;
      return startDate !== null && startDate > now;
    });
  }, [events]);

  const unlearnedCount = unlearnedSessions.length;

  // 2. Logic Điều hướng & Header
  const updateTitle = () => {
    if (calendarRef.current) {
      setCurrentRange(calendarRef.current.getApi().view.title);
    }
  };

  useEffect(() => {
    updateTitle();
  }, []);

  const handlePrev = () => {
    calendarRef.current?.getApi().prev();
    updateTitle();
  };
  const handleNext = () => {
    calendarRef.current?.getApi().next();
    updateTitle();
  };
  const handleToday = () => {
    calendarRef.current?.getApi().today();
    updateTitle();
  };

  const handleViewChange = (view: string) => {
    setViewType(view);
    calendarRef.current
      ?.getApi()
      .changeView(view === "Tháng" ? "dayGridMonth" : "timeGridWeek");
    updateTitle();
  };

  const handleToggleEdit = () => setIsEditing(!isEditing);

  // 3. Logic Xoá vĩnh viễn dữ liệu
  const handleDeleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const handleConfirmDeleteAllUnlearned = () => {
    const now = new Date();
    setEvents((prev) =>
      prev.filter((e) => {
        if (!e.start) return true;
        const startDate =
          typeof e.start === "string"
            ? new Date(e.start)
            : e.start instanceof Date
              ? e.start
              : null;
        return startDate === null || startDate <= now;
      }),
    );
    setIsDeleteModalOpen(false);
    setIsEditing(false);
  };

  // 4. Logic Thêm/Sửa Event
  const handleDateSelect = (selectInfo: DateSelectArg) => {
    if (!isEditing) return; // Chỉ cho phép tạo khi ở chế độ chỉnh sửa
    setSelectedEvent(null);
    setEventTitle("");
    setEventStartDate(selectInfo.startStr.split("T")[0]);
    setEventEndDate(selectInfo.endStr.split("T")[0]);
    openModal();
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    if (!isEditing) return; // Chỉ cho phép sửa khi ở chế độ chỉnh sửa
    const ev = clickInfo.event;
    setSelectedEvent({
      id: ev.id,
      title: ev.title,
      start: ev.startStr,
      end: ev.endStr || ev.startStr,
      extendedProps: ev.extendedProps as any,
    });
    setEventTitle(ev.title);
    setEventStartDate(ev.startStr.split("T")[0]);
    setEventEndDate(
      ev.endStr ? ev.endStr.split("T")[0] : ev.startStr.split("T")[0],
    );
    openModal();
  };

  const handleSaveEvent = () => {
    if (!eventTitle) return;
    if (selectedEvent) {
      setEvents((prev) =>
        prev.map((e) =>
          e.id === selectedEvent.id
            ? {
                ...e,
                title: eventTitle,
                start: eventStartDate,
                end: eventEndDate,
                extendedProps: { ...e.extendedProps, calendar: eventLevel },
              }
            : e,
        ),
      );
    } else {
      const newEv: CalendarEvent = {
        id: Date.now().toString(),
        title: eventTitle,
        start: eventStartDate,
        end: eventEndDate,
        allDay: true,
        extendedProps: { calendar: eventLevel },
      };
      setEvents((prev) => [...prev, newEv]);
    }
    closeModal();
  };

  return (
    <div className="flex flex-col gap-5 rounded-3xl border bg-white p-6 font-sans shadow-sm dark:border-slate-700 dark:bg-slate-900">
      {/* --- HEADER TÁCH FILE --- */}
      <CalendarHeader
        currentRange={currentRange}
        viewType={viewType}
        isEditing={isEditing}
        unlearnedCount={unlearnedCount} // Truyền số lượng thực tế xuống header
        onPrev={handlePrev}
        onNext={handleNext}
        onToday={handleToday}
        onViewChange={handleViewChange}
        onToggleEdit={handleToggleEdit}
        onAddEvent={() => {
          setSelectedEvent(null);
          setEventTitle("");
          openModal();
        }}
        onDeleteUnlearned={() => setIsDeleteModalOpen(true)}
        onCreateSchedule={() => setIsCreateScheduleOpen(true)}
      />

      {/* --- LƯỚI LỊCH HỌC --- */}
      <div className="custom-calendar-lms overflow-hidden rounded-2xl border bg-[#F8FAFC] shadow-inner dark:border-slate-700">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={false}
          locale="vi"
          firstDay={1}
          dayHeaderContent={(args) => {
            const days = [
              "Chủ Nhật",
              "Thứ Hai",
              "Thứ Ba",
              "Thứ Tư",
              "Thứ Năm",
              "Thứ Sáu",
              "Thứ Bảy",
            ];
            return (
              <span className="inline-block py-2 text-[11px] font-bold tracking-widest">
                {days[args.date.getDay()]}
              </span>
            );
          }}
          events={events}
          selectable={isEditing}
          select={handleDateSelect}
          eventClick={handleEventClick}
          eventContent={(args) =>
            renderEventContent(args, isEditing, handleDeleteEvent)
          }
          height="auto"
        />
      </div>

      {/* --- HỆ THỐNG MODAL --- */}

      {/* 1. Modal Thêm/Sửa */}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[600px] overflow-hidden rounded-3xl border-none p-0 shadow-2xl"
      >
        <div className="space-y-6 p-8">
          <div className="flex items-center justify-between border-b pb-4 dark:border-slate-700">
            <h3 className="text-2xl leading-snug leading-tight font-bold tracking-normal text-slate-900 italic dark:text-white">
              {selectedEvent ? "Cập nhật thông tin" : "Thêm buổi học"}
            </h3>
          </div>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold tracking-widest text-slate-400">
                Tên buổi học
              </label>
              <input
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                type="text"
                className="w-full rounded-2xl border bg-slate-50 p-4 font-bold outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold tracking-widest text-slate-400">
                  Ngày bắt đầu
                </label>
                <input
                  value={eventStartDate}
                  onChange={(e) => setEventStartDate(e.target.value)}
                  type="date"
                  className="w-full rounded-2xl border bg-slate-50 p-4 font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold tracking-widest text-slate-400">
                  Ngày kết thúc
                </label>
                <input
                  value={eventEndDate}
                  onChange={(e) => setEventEndDate(e.target.value)}
                  type="date"
                  className="w-full rounded-2xl border bg-slate-50 p-4 font-bold"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 border-t pt-6 dark:border-slate-700">
            <button
              onClick={closeModal}
              className="text-slate-4 leading-relaxed00 rounded-2xl px-6 py-3 text-sm font-bold hover:bg-slate-50"
            >
              Hủy bỏ
            </button>
            <button
              onClick={handleSaveEvent}
              className="rounded-2xl bg-blue-600 px-10 py-3 text-sm font-bold tracking-widest text-white shadow-lg hover:bg-blue-700"
            >
              Xác nhận
            </button>
          </div>
        </div>
      </Modal>

      {/* 2. Modal Xác nhận xoá thông minh */}
      {isDeleteModalOpen && (
        <div className="animate-in fade-in fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm duration-200">
          <div className="w-full max-w-3xl space-y-6 overflow-hidden rounded-3xl bg-white p-8 shadow-2xl dark:bg-slate-900">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="text-xl leading-snug leading-tight font-bold text-slate-900 italic dark:text-white">
                Xác nhận xoá
              </h3>
              <button onClick={() => setIsDeleteModalOpen(false)}>
                <X size={24} className="text-slate-400" />
              </button>
            </div>
            <p className="text-slate-6 leading-relaxed00 text-sm leading-relaxed font-medium">
              Bạn có chắc muốn{" "}
              <span className="font-bold text-red-500">
                xoá ({unlearnedCount}) buổi chưa học
              </span>
              ?
            </p>

            <div className="custom-scrollbar grid max-h-[300px] grid-cols-1 gap-4 overflow-y-auto pr-2 md:grid-cols-2">
              {unlearnedSessions.map((session, idx) => (
                <div
                  key={session.id}
                  className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:bg-slate-800"
                >
                  <div className="rounded-xl bg-white p-3 text-indigo-700 shadow-sm">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] leading-relaxed font-bold text-slate-400">
                      Buổi {idx + 1}:{" "}
                      {new Date(session.start as string).toLocaleDateString(
                        "vi-VN",
                        {
                          weekday: "long",
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        },
                      )}
                    </p>
                    <p className="text-slate-9 leading-relaxed00 text-sm leading-relaxed font-bold">
                      {session.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 border-t pt-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="text-slate-4 leading-relaxed00 rounded-xl px-6 py-2.5 text-sm font-bold transition-all hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmDeleteAllUnlearned}
                className="rounded-xl bg-red-500 px-8 py-2.5 text-sm font-bold text-white shadow-lg shadow-red-500/20 transition-all hover:bg-red-600"
              >
                Xoá vĩnh viễn
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Modal Tạo lịch học */}
      <CreateScheduleModal
        isOpen={isCreateScheduleOpen}
        onClose={() => setIsCreateScheduleOpen(false)}
      />
    </div>
  );
};

// --- RENDER EVENT: Chỉ hiện nút xoá khi ở chế độ Edit ---
const renderEventContent = (
  eventInfo: EventContentArg,
  isEditing: boolean,
  onDelete: (id: string) => void,
) => {
  // Xác định buổi đã học hay chưa học
  const now = new Date();
  let start: Date | null = null;
  if (eventInfo.event.start instanceof Date) {
    start = eventInfo.event.start;
  } else if (typeof eventInfo.event.start === "string") {
    start = new Date(eventInfo.event.start);
  }
  const isLearned = start !== null && start <= now;
  return (
    <div className="group relative mb-1 w-full px-0.5">
      {isEditing && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(eventInfo.event.id);
          }}
          className="absolute -top-1.5 -right-1.5 z-20 rounded-full border-2 border-white bg-red-500 p-0.5 text-white shadow-md transition-transform hover:scale-125 active:scale-90"
        >
          <X size={10} strokeWidth={4} />
        </button>
      )}
      <div
        className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 bg-white p-1 shadow-sm transition-all hover:brightness-95 ${
          isLearned ? "border-green-500" : "border-orange-500"
        } ${isEditing ? "ring-2 ring-red-500/20" : ""}`}
      >
        <div
          className={`text-[10px] font-bold tracking-normal whitespace-nowrap ${
            isLearned ? "text-green-600" : "text-orange-600"
          }`}
        >
          {eventInfo.timeText || "N/A"}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
