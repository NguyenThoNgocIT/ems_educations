'use client';

import React from 'react';
import Calendar from '@/components/ems/Calendar';
import { Card, CardContent } from '@/components/ui/card';

export default function StudentMySchedulePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Thời khóa biểu của tôi</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Theo dõi lịch học và sự kiện quan trọng trong học kỳ.</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Calendar />
        </CardContent>
      </Card>
    </div>
  );
}
