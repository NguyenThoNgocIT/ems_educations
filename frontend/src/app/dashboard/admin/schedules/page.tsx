// TODO: Chuy?n d?i t? code AI Hosting
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Calendar as CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';

// Định nghĩa type cho Schedule
interface Schedule {
  id: string;
  courseClassId: string;
  courseClassName: string;
  courseName: string;
  instructorId: string;
  instructorName: string;
  semesterId: string;
  roomId: string;
  roomName: string;
  dayOfWeek: string;
  date: string;
  shift: string;
  timeSlotId: string;
  timeSlotName: string;
  numberOfPeriods: number;
  status: string;
}

// Mock data - sẽ thay bằng API call sau
const mockSchedules: Schedule[] = [
  {
    id: '1',
    courseClassId: 'class1',
    courseClassName: 'CNTT101-01',
    courseName: 'Lập trình Web',
    instructorId: 'inst1',
    instructorName: 'TS. Nguyễn Văn An',
    semesterId: 'HK1-2024',
    roomId: 'room1',
    roomName: 'A101',
    dayOfWeek: 'Thứ 2',
    date: '2024-01-15',
    shift: 'Sáng',
    timeSlotId: 'ts1',
    timeSlotName: 'T1 (07:30-09:00)',
    numberOfPeriods: 2,
    status: 'active'
  },
  {
    id: '2',
    courseClassId: 'class2',
    courseClassName: 'CNTT102-01',
    courseName: 'Cơ sở dữ liệu',
    instructorId: 'inst2',
    instructorName: 'ThS. Trần Thị Bình',
    semesterId: 'HK1-2024',
    roomId: 'room2',
    roomName: 'A102',
    dayOfWeek: 'Thứ 2',
    date: '2024-01-15',
    shift: 'Chiều',
    timeSlotId: 'ts3',
    timeSlotName: 'T3 (13:00-14:30)',
    numberOfPeriods: 2,
    status: 'active'
  },
  {
    id: '3',
    courseClassId: 'class3',
    courseClassName: 'CNTT103-01',
    courseName: 'Mạng máy tính',
    instructorId: 'inst3',
    instructorName: 'TS. Lê Văn Cường',
    semesterId: 'HK1-2024',
    roomId: 'room3',
    roomName: 'B201',
    dayOfWeek: 'Thứ 3',
    date: '2024-01-16',
    shift: 'Sáng',
    timeSlotId: 'ts1',
    timeSlotName: 'T1 (07:30-09:00)',
    numberOfPeriods: 2,
    status: 'active'
  },
  {
    id: '4',
    courseClassId: 'class4',
    courseClassName: 'CNTT104-01',
    courseName: 'Trí tuệ nhân tạo',
    instructorId: 'inst4',
    instructorName: 'PGS. Phạm Thị Dung',
    semesterId: 'HK1-2024',
    roomId: 'room4',
    roomName: 'Lab3',
    dayOfWeek: 'Thứ 4',
    date: '2024-01-17',
    shift: 'Sáng',
    timeSlotId: 'ts2',
    timeSlotName: 'T2 (09:15-10:45)',
    numberOfPeriods: 2,
    status: 'active'
  },
  {
    id: '5',
    courseClassId: 'class5',
    courseClassName: 'CNTT101-02',
    courseName: 'Lập trình Web',
    instructorId: 'inst1',
    instructorName: 'TS. Nguyễn Văn An',
    semesterId: 'HK1-2024',
    roomId: 'room5',
    roomName: 'C301',
    dayOfWeek: 'Thứ 5',
    date: '2024-01-18',
    shift: 'Chiều',
    timeSlotId: 'ts4',
    timeSlotName: 'T4 (14:45-16:15)',
    numberOfPeriods: 2,
    status: 'active'
  },
];

const daysOfWeek = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];

export default function SchedulePage() {
  const router = useRouter();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [filterSemester, setFilterSemester] = useState<string>('HK1-2024');

  useEffect(() => {
    // TODO: Gọi API lấy danh sách lịch học
    setSchedules(mockSchedules);
  }, []);

  // Group schedules by day
  const groupedSchedules = daysOfWeek.reduce((acc, day) => {
    acc[day] = schedules.filter(s => s.dayOfWeek === day && s.semesterId === filterSemester);
    return acc;
  }, {} as Record<string, Schedule[]>);

  const handleEdit = (id: string) => {
    router.push(`/dashboard/admin/schedules/${id}/edit`);
  };

  const handleAdd = () => {
    router.push('/dashboard/admin/schedules/create');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <CalendarIcon className="h-8 w-8 text-primary" />
            Thời khóa biểu
          </h1>
          <p className="text-muted-foreground">Quản lý lịch học theo tuần</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Select value={filterSemester} onValueChange={setFilterSemester}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Chọn học kỳ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="HK1-2024">Học kỳ 1 - 2024</SelectItem>
              <SelectItem value="HK2-2024">Học kỳ 2 - 2024</SelectItem>
              <SelectItem value="HK1-2025">Học kỳ 1 - 2025</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleAdd} className="bg-primary hover:bg-primary/90 whitespace-nowrap">
            <Plus className="h-4 w-4 mr-2" />
            Thêm lịch học
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
        {daysOfWeek.map((day) => (
          <div key={day} className="flex flex-col gap-3">
            <div className="bg-muted py-2 px-4 rounded-lg text-center font-semibold border border-border">
              {day}
            </div>
            <div className="flex flex-col gap-3 min-h-[200px]">
              {groupedSchedules[day]?.length > 0 ? (
                groupedSchedules[day].map((schedule) => (
                  <Card 
                    key={schedule.id} 
                    className="cursor-pointer hover:border-primary transition-colors" 
                    onClick={() => handleEdit(schedule.id)}
                  >
                    <CardContent className="p-3 text-sm">
                      <div className="font-bold text-primary mb-1">{schedule.courseClassName}</div>
                      <div className="text-xs text-muted-foreground mb-1">{schedule.timeSlotName}</div>
                      <div className="text-xs font-medium">{schedule.roomName}</div>
                      <div className="text-xs text-muted-foreground mt-1 truncate">{schedule.instructorName}</div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="flex-1 border-2 border-dashed border-border rounded-lg flex items-center justify-center p-4 text-muted-foreground text-sm text-center">
                  Trống
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}