'use client';

import dynamic from 'next/dynamic';

const TimetableBuilder = dynamic(() => import('@/components/ems/TimetableBuilder'), {
  ssr: false,
});

const workflowSteps = [
  ['1', 'Mở lớp học phần', 'Chọn môn học, học kỳ, sĩ số và khoảng thời gian học.'],
  ['2', 'Gán sinh viên', 'Sinh viên có trong lớp học phần mới nhìn thấy lịch học.'],
  ['3', 'Phân công giảng viên', 'Giảng viên được phân công mới nhận lịch dạy.'],
  ['4', 'Xếp lịch gốc', 'Hệ thống chia số tiết theo tín chỉ và kiểm tra trùng phòng, trùng giảng viên, trùng lớp.'],
];

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

      <div className="grid gap-3 rounded-xl border bg-white/70 p-4 text-sm shadow-sm dark:bg-slate-900/50 md:grid-cols-4">
        {workflowSteps.map(([step, title, desc]) => (
          <div key={step} className="flex gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
              {step}
            </span>
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">{title}</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <TimetableBuilder />
    </div>
  );
}
