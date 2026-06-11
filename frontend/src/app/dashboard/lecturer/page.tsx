"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BookOpen, CalendarClock, CheckCircle2, ChevronRight, Clock, Info, Loader2, Users } from "lucide-react";
import { scheduleApi } from "@/api/schedule";
import { courseClassApi } from "@/api/course";
import { useAuth } from "@/context/AuthContext";
import { request } from "@/utils/request";

const toArray = (value: any) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.data?.data)) return value.data.data;
  return [];
};

const getEmployeeIdFromMe = async () => {
  const res: any = await request.get("/api/auth/me");
  return res?.employeeId || res?.data?.employeeId || res?.data?.data?.employeeId || null;
};

const formatTime = (start?: string, end?: string) => {
  const trim = (value?: string) => String(value || "").slice(0, 5);
  return `${trim(start) || "--:--"} - ${trim(end) || "--:--"}`;
};

const formatDate = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("vi-VN", { weekday: "short", day: "2-digit", month: "2-digit" }).format(date);
};

export default function LecturerDashboard() {
  const { user, updateUser } = useAuth();
  const [employeeId, setEmployeeId] = useState<string | null>((user as any)?.id || null);
  const [classes, setClasses] = useState<any[]>([]);
  const [upcomingSchedules, setUpcomingSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if ((user as any)?.id) {
      setEmployeeId((user as any).id);
      return;
    }

    if (!user) return;

    getEmployeeIdFromMe()
      .then((id) => {
        if (id) {
          setEmployeeId(id);
          updateUser({ id });
        }
      })
      .catch(() => {});
  }, [user, updateUser]);

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!employeeId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const now = new Date();
        const [classesRes, calendarRes] = await Promise.all([
          courseClassApi.getMyClasses(),
          scheduleApi.getCalendar({
            instructorId: employeeId,
            month: now.getMonth() + 1,
            year: now.getFullYear(),
          }),
        ]);

        const classRows = toArray(classesRes);
        const calendarDays = toArray(calendarRes);
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

        const schedules = calendarDays
          .flatMap((day: any) =>
            toArray(day.items).map((item: any) => ({
              ...item,
              date: day.date,
            })),
          )
          .filter((item: any) => new Date(`${item.date}T${item.startTime || "00:00:00"}`).getTime() >= todayStart)
          .sort((a: any, b: any) => {
            return new Date(`${a.date}T${a.startTime || "00:00:00"}`).getTime()
              - new Date(`${b.date}T${b.startTime || "00:00:00"}`).getTime();
          });

        setClasses(classRows);
        setUpcomingSchedules(schedules);
      } catch (error) {
        console.error("Loi khi tai dashboard giang vien", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboard();
    }
  }, [employeeId, user]);

  const stats = useMemo(() => {
    const requiredPeriods = classes.reduce((sum, item) => sum + Number(item.requiredPeriods || 0), 0);
    const taughtPeriods = classes.reduce((sum, item) => sum + Number(item.taughtPeriods || 0), 0);
    const remainingPeriods = classes.reduce((sum, item) => sum + Number(item.remainingPeriods || 0), 0);

    return {
      classesCount: classes.length,
      scheduleCount: upcomingSchedules.length,
      taughtPeriods,
      remainingPeriods,
      requiredPeriods,
    };
  }, [classes, upcomingSchedules]);

  const nextSchedules = upcomingSchedules.slice(0, 3);
  const displayName = user?.fullName || (user as any)?.name || "Giảng viên";

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Xin chào, {displayName}</h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Tổng quan lịch giảng dạy và lớp học phần đang phụ trách của bạn.
        </p>
      </div>

      {!employeeId && !loading && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
          Chưa lấy được mã giảng viên từ phiên đăng nhập. Hãy đăng xuất và đăng nhập lại để đồng bộ dữ liệu.
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={BookOpen} label="Lớp phụ trách" value={stats.classesCount} hint="Theo phân công" tone="emerald" loading={loading} />
        <StatCard icon={CalendarClock} label="Lịch sắp tới" value={stats.scheduleCount} hint="Trong tháng này" tone="sky" loading={loading} />
        <StatCard icon={CheckCircle2} label="Tiết đã dạy" value={stats.taughtPeriods} hint={`/${stats.requiredPeriods || 0} tiết yêu cầu`} tone="indigo" loading={loading} />
        <StatCard icon={Clock} label="Tiết còn lại" value={stats.remainingPeriods} hint="Cần hoàn thành" tone="amber" loading={loading} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col rounded-3xl border border-gray-200/50 bg-white/70 p-6 shadow-sm dark:border-gray-800/50 dark:bg-gray-900/40 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 dark:border-gray-800/50">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Lịch giảng dạy sắp tới</h3>
              <p className="mt-1 text-xs text-slate-500">Dữ liệu được lọc theo chính tài khoản giảng viên hiện tại.</p>
            </div>
            <Link href="/dashboard/lecturer/my-schedule" className="flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700">
              Xem lịch <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-5 flex-1 space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-12 text-slate-500">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Đang tải dữ liệu giảng viên...
              </div>
            ) : nextSchedules.length > 0 ? (
              nextSchedules.map((item, index) => (
                <div
                  key={item.id || `${item.date}-${item.timeSlotId}-${index}`}
                  className="group flex flex-col justify-between gap-4 rounded-2xl border border-gray-100 bg-gray-50/80 p-4 transition hover:border-brand-200 hover:bg-white hover:shadow-md dark:border-gray-800 dark:bg-gray-800/30 sm:flex-row sm:items-center"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex min-w-[120px] flex-col items-center justify-center rounded-xl border border-gray-100 bg-white px-3 py-2 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                      <span className="text-[11px] font-bold text-slate-500">{formatDate(item.date)}</span>
                      <span className="text-xs font-black text-brand-600">{formatTime(item.startTime, item.endTime)}</span>
                    </div>
                    <div>
                      <div className="mb-1 flex items-center gap-2">
                        <p className="text-sm font-bold text-gray-900 transition group-hover:text-brand-600 dark:text-white">
                          {item.courseClassName || item.courseClassCode || "Lớp học phần"}
                        </p>
                        <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${item.mode === "TH" ? "bg-amber-100 text-amber-700" : "bg-brand-100 text-brand-700"}`}>
                          {item.mode || "LT"}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{item.courseName || "Tên học phần"}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                    <Info size={14} className="text-brand-500" /> {item.roomCode || "Chưa xếp phòng"}
                  </span>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-12 text-center dark:border-gray-700 dark:bg-gray-800/50">
                <Clock className="mx-auto mb-3 h-10 w-10 text-gray-300" />
                <p className="font-medium text-gray-500">Chưa có lịch giảng dạy sắp tới trong tháng này</p>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-gray-200/50 bg-white/70 p-6 shadow-sm dark:border-gray-800/50 dark:bg-gray-900/40">
          <div className="border-b border-gray-100 pb-4 dark:border-gray-800/50">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Lớp nổi bật</h3>
            <p className="mt-1 text-xs text-slate-500">Các lớp có khối lượng còn lại cao.</p>
          </div>
          <div className="mt-5 space-y-4">
            {loading ? (
              <div className="py-10 text-center text-sm text-slate-500">Đang tải lớp phụ trách...</div>
            ) : classes.length > 0 ? (
              [...classes]
                .sort((a, b) => Number(b.remainingPeriods || 0) - Number(a.remainingPeriods || 0))
                .slice(0, 3)
                .map((item, index) => (
                  <Link
                    href="/dashboard/lecturer/my-classes"
                    key={item.courseClassId || index}
                    className="block rounded-2xl border border-slate-100 bg-slate-50 p-4 transition hover:border-emerald-200 hover:bg-white dark:border-slate-800 dark:bg-slate-800/40"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                        <Users className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-bold text-slate-900 dark:text-white">{item.courseClassCode || "Mã lớp"}</div>
                        <div className="mt-0.5 line-clamp-2 text-xs text-slate-500">{item.courseName || "Tên học phần"}</div>
                        <div className="mt-2 text-[11px] font-semibold text-emerald-700">
                          Còn {item.remainingPeriods || 0} tiết
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 py-10 text-center text-sm text-slate-500">
                Chưa có lớp phụ trách
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, hint, tone, loading }: { icon: any; label: string; value: number; hint: string; tone: "emerald" | "sky" | "indigo" | "amber"; loading: boolean }) {
  const toneClass = {
    emerald: "from-emerald-50 to-emerald-100 text-emerald-700",
    sky: "from-sky-50 to-sky-100 text-sky-700",
    indigo: "from-indigo-50 to-indigo-100 text-indigo-700",
    amber: "from-amber-50 to-amber-100 text-amber-700",
  }[tone];

  return (
    <div className="flex items-center justify-between rounded-3xl border border-gray-200/50 bg-white/70 p-5 shadow-sm backdrop-blur-xl transition hover:shadow-lg dark:border-gray-800/50 dark:bg-gray-900/40">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">{label}</p>
        <h4 className="mt-2 text-3xl font-black text-gray-800 dark:text-white">{loading ? "..." : value}</h4>
        <p className="mt-1 inline-block rounded-full bg-slate-50 px-2 py-0.5 text-[10px] font-semibold text-slate-500">{hint}</p>
      </div>
      <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${toneClass}`}>
        <Icon className="h-7 w-7" />
      </div>
    </div>
  );
}
