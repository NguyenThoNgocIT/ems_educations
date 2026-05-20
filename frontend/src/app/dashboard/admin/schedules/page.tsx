'use client';

import React from 'react';
import Calendar from '@/components/ems/Calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminSchedulesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Quản lý Thời khóa biểu</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Xem và sắp xếp lịch học, lịch kiểm tra cho toàn trường.</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Calendar />
        </CardContent>
      </Card>
    </div>
  );
}