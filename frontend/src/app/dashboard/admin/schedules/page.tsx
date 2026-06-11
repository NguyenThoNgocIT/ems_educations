'use client';

import dynamic from 'next/dynamic';

const TimetableBuilder = dynamic(() => import('@/components/ems/TimetableBuilder'), {
  ssr: false,
});

export default function AdminSchedulesPage() {
  return (
    <div className="space-y-6 text-[14px]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Quản lý thời khóa biểu</h1>
          <p className="mt-1 text-[14px] text-slate-500 dark:text-slate-400">
            Tạo lịch gốc cho lớp học phần dựa trên môn học, tín chỉ, phân công giảng viên, phòng và ca học.
          </p>
        </div>
      </div>

      <TimetableBuilder />
    </div>
  );
}
