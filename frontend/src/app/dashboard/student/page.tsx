'use client';

import { studentPortalApi } from '@/api/student-portal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { StudentDashboard } from '@/types/student-portal';
import type { StudentSelfResponse } from '@/types/student';
import { Award, BookOpen, CalendarDays, Clock3, GraduationCap, MapPin } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';

export default function StudentDashboardPage() {
  const [dashboard, setDashboard] = useState<StudentDashboard | null>(null);
  const [student, setStudent] = useState<StudentSelfResponse | null>(null);
  const [source, setSource] = useState<'api' | 'mock'>('mock');

  useEffect(() => {
    Promise.all([studentPortalApi.getDashboard(), studentPortalApi.getStudentProfile()]).then(([payload, profile]) => {
      setDashboard(payload.data);
      setSource(payload.source);
      setStudent(profile);
    });
  }, []);

  const academic = dashboard?.academic;
  const creditProgress = useMemo(() => {
    if (!academic) return 0;
    if (!academic.programCredits) return 0;
    return Math.min(100, Math.round((academic.accumulatedCredits / academic.programCredits) * 100));
  }, [academic]);

  return (
    <div className="flex w-full flex-col gap-5 pb-8">
      <Card className="border-emerald-100 bg-white dark:border-emerald-900/40">
        <CardContent className="grid gap-5 p-5 xl:grid-cols-[1fr_auto] xl:items-center">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{dashboard?.semesterLabel || 'Học kỳ hiện tại'}</Badge>
              <SourceBadge source={source} />
            </div>
            <h1 className="mt-3 text-2xl font-bold text-slate-950 dark:text-white">
              Xin chào, {student?.fullName || 'Nguyễn Văn B'}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              Theo dõi lịch học, tiến độ tín chỉ, kết quả gần nhất và các việc cần xử lý trong kỳ học.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button nativeButton={false} render={<Link href="/dashboard/student/my-schedule" />} size="lg">
              Xem thời khóa biểu
            </Button>
            <Button nativeButton={false} variant="outline" render={<Link href="/profile" />} size="lg">
              Cập nhật hồ sơ
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric icon={Award} label="GPA tích lũy" value={academic ? academic.cumulativeGpa.toFixed(2) : '--'} detail="Thang 4.0" />
        <Metric icon={GraduationCap} label="Tín chỉ tích lũy" value={academic ? `${academic.accumulatedCredits}/${academic.programCredits}` : '--'} detail={`${creditProgress}% chương trình`} />
        <Metric icon={BookOpen} label="GPA học kỳ" value={academic ? academic.semesterGpa.toFixed(2) : '--'} detail={academic?.semesterLabel || 'Đang tải'} />
        <Metric icon={CalendarDays} label="Lịch học tuần" value={`${dashboard?.nextSchedules.length || 0} buổi gần nhất`} detail="Xem chi tiết theo bảng" />
      </div>

      <div className="grid gap-5 2xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader className="border-b">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle>Lịch học sắp tới</CardTitle>
              <Button nativeButton={false} variant="outline" size="sm" render={<Link href="/dashboard/student/my-schedule" />}>Xem tuần</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {dashboard?.nextSchedules.map((item) => (
              <div key={item.id} className="grid gap-3 rounded-lg border border-slate-100 p-3 lg:grid-cols-[auto_1fr_auto] lg:items-center dark:border-slate-800">
                <div className="rounded-lg bg-emerald-50 px-3 py-2 text-center dark:bg-emerald-950/40">
                  <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-200">{item.dayLabel}</p>
                  <p className="text-sm font-bold text-slate-950 dark:text-white">{item.dateLabel}</p>
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-950 dark:text-white">{item.courseName}</p>
                  <p className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
                    <span>{item.classCode}</span>
                    <span className="inline-flex items-center gap-1"><Clock3 className="h-3 w-3" />{item.time}</span>
                    <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{item.room}</span>
                  </p>
                </div>
                <Badge variant="outline">{item.mode}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

function SourceBadge({ source }: { source: 'api' | 'mock' }) {
  return <Badge variant="outline">{source === 'mock' ? 'Dữ liệu mẫu' : 'Dữ liệu hệ thống'}</Badge>;
}

function Metric({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <Card size="sm">
      <CardContent className="flex min-w-0 items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-200">
          <Icon className="h-5 w-5" />
        </span>
        <span className="min-w-0">
          <span className="block truncate text-xs font-semibold uppercase text-slate-400">{label}</span>
          <span className="block truncate text-xl font-bold text-slate-950 dark:text-white">{value}</span>
          <span className="block truncate text-xs text-slate-500">{detail}</span>
        </span>
      </CardContent>
    </Card>
  );
}
