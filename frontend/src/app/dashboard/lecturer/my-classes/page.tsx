'use client';

import React from 'react';
import LecturerClassList from '@/components/ems/lecturer/LecturerClassList';

export default function LecturerMyClassesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Lớp của tôi</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Danh sách các lớp học phần bạn đang phụ trách trong học kỳ này.</p>
      </div>

      <LecturerClassList />
    </div>
  );
}
