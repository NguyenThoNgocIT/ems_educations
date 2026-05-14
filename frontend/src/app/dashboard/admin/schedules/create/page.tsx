'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';

interface ScheduleFormData {
  courseClassId: string;
  instructorId: string;
  semesterId: string;
  roomId: string;
  dayOfWeek: string;
  date: string;
  shift: string;
  timeSlotId: string;
  numberOfPeriods: number;
  status: string;
}

// Mock data cho select options
const mockCourseClasses = [
  { id: 'class1', name: 'CNTT101-01 - Lập trình Web' },
  { id: 'class2', name: 'CNTT102-01 - Cơ sở dữ liệu' },
  { id: 'class3', name: 'CNTT103-01 - Mạng máy tính' },
];

const mockInstructors = [
  { id: 'inst1', name: 'TS. Nguyễn Văn An' },
  { id: 'inst2', name: 'ThS. Trần Thị Bình' },
  { id: 'inst3', name: 'TS. Lê Văn Cường' },
];

const mockRooms = [
  { id: 'room1', name: 'A101' },
  { id: 'room2', name: 'A102' },
  { id: 'room3', name: 'B201' },
  { id: 'room4', name: 'Lab3' },
];

const mockTimeSlots = [
  { id: 'ts1', name: 'T1 (07:30-09:00)' },
  { id: 'ts2', name: 'T2 (09:15-10:45)' },
  { id: 'ts3', name: 'T3 (13:00-14:30)' },
  { id: 'ts4', name: 'T4 (14:45-16:15)' },
];

const daysOfWeek = [
  { value: 'Thứ 2', label: 'Thứ 2' },
  { value: 'Thứ 3', label: 'Thứ 3' },
  { value: 'Thứ 4', label: 'Thứ 4' },
  { value: 'Thứ 5', label: 'Thứ 5' },
  { value: 'Thứ 6', label: 'Thứ 6' },
  { value: 'Thứ 7', label: 'Thứ 7' },
  { value: 'Chủ nhật', label: 'Chủ nhật' },
];

export default function CreateSchedulePage() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<ScheduleFormData>({
    courseClassId: '',
    instructorId: '',
    semesterId: 'HK1-2024',
    roomId: '',
    dayOfWeek: '',
    date: '',
    shift: 'Sáng',
    timeSlotId: '',
    numberOfPeriods: 2,
    status: 'active'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Gọi API tạo lịch học
    setTimeout(() => {
      setLoading(false);
      toast.success('Thêm lịch học thành công');
      router.push('/dashboard/admin/schedules');
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => router.back()} className="mb-2">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Quay lại
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Thêm lịch học mới</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label htmlFor="courseClassId">Lớp học phần *</Label>
                <Select value={formData.courseClassId} onValueChange={(val) => setFormData({ ...formData, courseClassId: val })}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Chọn lớp học phần" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCourseClasses.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="instructorId">Giảng viên *</Label>
                <Select value={formData.instructorId} onValueChange={(val) => setFormData({ ...formData, instructorId: val })}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Chọn giảng viên" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockInstructors.map(i => (
                      <SelectItem key={i.id} value={i.id}>{i.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label htmlFor="roomId">Phòng học *</Label>
                <Select value={formData.roomId} onValueChange={(val) => setFormData({ ...formData, roomId: val })}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Chọn phòng học" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockRooms.map(r => (
                      <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="timeSlotId">Ca học *</Label>
                <Select value={formData.timeSlotId} onValueChange={(val) => setFormData({ ...formData, timeSlotId: val })}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Chọn ca học" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockTimeSlots.map(t => (
                      <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <Label htmlFor="dayOfWeek">Thứ *</Label>
                <Select value={formData.dayOfWeek} onValueChange={(val) => setFormData({ ...formData, dayOfWeek: val })}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Chọn thứ" />
                  </SelectTrigger>
                  <SelectContent>
                    {daysOfWeek.map(d => (
                      <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="date">Ngày học</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="numberOfPeriods">Số tiết</Label>
                <Input
                  id="numberOfPeriods"
                  type="number"
                  value={formData.numberOfPeriods}
                  onChange={(e) => setFormData({ ...formData, numberOfPeriods: parseInt(e.target.value) })}
                  className="mt-1.5"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Đang lưu...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Thêm mới
                  </span>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push('/dashboard/admin/schedules')}>
                Hủy
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}