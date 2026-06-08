import React from 'react';
import { Search, CalendarDays, Clock, Users } from 'lucide-react';
import { Input } from "@/components/ui/input";

interface Props {
  courseClasses: any[];
  completedCourseClassIds?: Set<string>;
  periodProgressByClass?: Map<string, { scheduled: number; required: number }>;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  externalEventsRef: React.RefObject<HTMLDivElement | null>;
}

const courseClassIdOf = (courseClass: any) => String(courseClass?.courseClassId || courseClass?.id || "");

export default function TimetableSidebar({
  courseClasses,
  completedCourseClassIds = new Set(),
  periodProgressByClass = new Map(),
  searchTerm,
  setSearchTerm,
  externalEventsRef,
}: Props) {
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const filteredClasses = courseClasses.filter((courseClass) => {
    const matchesSearch =
      !normalizedSearchTerm ||
      courseClass.courseName?.toLowerCase().includes(normalizedSearchTerm) ||
      courseClass.classCode?.toLowerCase().includes(normalizedSearchTerm);

    return matchesSearch && !completedCourseClassIds.has(courseClassIdOf(courseClass));
  });

  return (
    <div className="flex min-h-[220px] w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-white/60 text-[14px] shadow-sm backdrop-blur-xl dark:bg-gray-900/40 xl:min-h-0">
      <div className="border-b border-border bg-white/40 p-4 dark:bg-gray-900/40">
        <h2 className="flex items-center gap-2 text-[14px] font-bold text-foreground">
          <CalendarDays className="text-brand-500" size={20} />
          Lớp chưa có lịch
        </h2>

        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <Input
            type="text"
            placeholder="Tìm môn học, mã lớp..."
            className="h-10 bg-background/50 pl-9 text-[14px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div
        className="custom-scrollbar flex-1 space-y-3 overflow-y-auto p-4"
        ref={externalEventsRef}
      >
        {filteredClasses.length === 0 ? (
          <div className="py-10 text-center text-[14px] text-muted-foreground">
            Không còn lớp chưa có lịch.
          </div>
        ) : (
          filteredClasses.map((courseClass) => {
            const courseClassId = courseClassIdOf(courseClass);
            const progress = periodProgressByClass.get(courseClassId) || { scheduled: 0, required: 0 };

            return (
              <div
                key={courseClassId}
                className="fc-event group relative cursor-grab rounded-xl border border-border bg-card p-3 shadow-sm transition-all duration-200 hover:border-brand-400 hover:shadow-md active:cursor-grabbing dark:hover:border-brand-500/50"
                data-id={courseClassId}
                data-title={`${courseClass.classCode} - ${courseClass.courseName}`}
              >
                <div className="mb-1 flex items-start justify-between">
                  <span className="rounded bg-brand-50 px-2 py-0.5 text-[13px] font-bold text-brand-600 dark:bg-brand-500/20 dark:text-brand-400">
                    {courseClass.classCode}
                  </span>
                  <span className="flex items-center gap-1 text-[13px] text-muted-foreground">
                    <Clock size={12} /> {courseClass.credits || 3} TC
                  </span>
                </div>
                <h3 className="mt-2 line-clamp-2 text-[14px] font-semibold text-foreground">
                  {courseClass.courseName}
                </h3>
                <div className="mt-2 flex items-center justify-between gap-2 text-[13px] text-muted-foreground">
                  <span className="flex min-w-0 items-center gap-1.5">
                    <Users size={13} className="shrink-0" />
                    <span className="truncate">{courseClass.currentStudents || 0}/{courseClass.maxStudents || 40} Sinh viên</span>
                  </span>
                  <span className="shrink-0 rounded-md bg-emerald-50 px-2 py-0.5 text-[12px] font-bold text-emerald-700 ring-1 ring-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20">
                    {progress.scheduled}/{progress.required} tiết
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
