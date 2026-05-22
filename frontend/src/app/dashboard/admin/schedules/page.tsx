'use client';

import React from 'react';
import TimetableBuilder from '@/components/ems/TimetableBuilder';

export default function AdminSchedulesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Quản lý Thời khóa biểu</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Sắp xếp lịch học, phân công giảng viên bằng cách kéo thả lớp học.</p>
        </div>
      </div>

      <TimetableBuilder />
    </div>
  );
}