'use client';

import { studentPortalApi } from '@/api/student-portal';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { StudentScheduleItem } from '@/types/student-portal';
import { CalendarDays, Search } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';

export default function StudentMySchedulePage() {
  const [schedules, setSchedules] = useState<StudentScheduleItem[]>([]);
  const [source, setSource] = useState<'api' | 'mock'>('mock');
  const [query, setQuery] = useState('');

  useEffect(() => {
    studentPortalApi.getMySchedule().then((payload) => {
      setSchedules(payload.data);
      setSource(payload.source);
    });
  }, []);

  const filteredSchedules = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return schedules;

    return schedules.filter((item) =>
      [item.courseCode, item.courseName, item.classCode, item.room, item.lecturer]
        .some((value) => value.toLowerCase().includes(normalized)),
    );
  }, [query, schedules]);

  return (
    <div className="flex w-full flex-col gap-5 pb-8">
      <header className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-bold text-slate-950 dark:text-white">Thời khóa biểu tuần</h1>
          <Badge variant="outline">{source === 'mock' ? 'Dữ liệu mẫu' : 'Dữ liệu hệ thống'}</Badge>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">Lịch học theo học phần đã đăng ký, phòng học và giảng viên phụ trách.</p>
      </header>

      <Card>
        <CardContent className="grid gap-4 p-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <label className="relative block w-full max-w-xl">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Tìm môn, lớp, phòng hoặc giảng viên"
              className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{filteredSchedules.length} buổi học</Badge>
            <Badge variant="outline">Tuần hiện tại</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="inline-flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-emerald-600" />
              Bảng thời khóa biểu
            </CardTitle>
            <span className="text-xs text-slate-500">Sắp theo ngày học trong tuần</span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] border-collapse text-sm">
              <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                <tr>
                  <th className="w-32 px-4 py-3">Ngày học</th>
                  <th className="w-40 px-4 py-3">Ca học</th>
                  <th className="px-4 py-3">Học phần</th>
                  <th className="w-40 px-4 py-3">Lớp</th>
                  <th className="w-32 px-4 py-3">Phòng</th>
                  <th className="w-52 px-4 py-3">Giảng viên</th>
                  <th className="w-28 px-4 py-3">Hình thức</th>
                </tr>
              </thead>
              <tbody>
                {filteredSchedules.map((item) => (
                  <tr key={item.id} className="border-t border-slate-100 align-top transition hover:bg-emerald-50/40 dark:border-slate-800 dark:hover:bg-emerald-950/10">
                    <td className="px-4 py-4">
                      <p className="font-semibold text-slate-950 dark:text-white">{item.dayLabel}</p>
                      <p className="mt-1 text-xs text-slate-500">{item.dateLabel}</p>
                    </td>
                    <td className="px-4 py-4 font-medium text-slate-700 dark:text-slate-200">{item.time}</td>
                    <td className="px-4 py-4">
                      <p className="font-semibold text-slate-950 dark:text-white">{item.courseName}</p>
                      <p className="mt-1 text-xs font-semibold uppercase text-emerald-600">{item.courseCode}</p>
                    </td>
                    <td className="px-4 py-4 text-slate-700 dark:text-slate-200">{item.classCode}</td>
                    <td className="px-4 py-4 text-slate-700 dark:text-slate-200">{item.room}</td>
                    <td className="px-4 py-4 text-slate-700 dark:text-slate-200">{item.lecturer}</td>
                    <td className="px-4 py-4"><Badge variant="outline">{item.mode}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredSchedules.length === 0 && (
            <p className="border-t border-slate-100 px-4 py-8 text-center text-sm text-slate-500 dark:border-slate-800">
              Không tìm thấy buổi học phù hợp.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
