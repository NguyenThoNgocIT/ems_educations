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

// Định nghĩa type cho form data
interface CourseClassFormData {
  classCode: string;
  courseId: string;
  semesterId: string;
  roomId: string;
  maxStudent: number;
  currentStudent: number;
  status: string;
  isActive: boolean;
}

interface FormErrors {
  classCode?: string;
  courseId?: string;
  semesterId?: string;
  roomId?: string;
  maxStudent?: string;
}

// Mock data cho các select options
const mockCourses = [
  { id: 'course1', name: 'Lập trình Web' },
  { id: 'course2', name: 'Cơ sở dữ liệu' },
  { id: 'course3', name: 'Mạng máy tính' },
  { id: 'course4', name: 'Trí tuệ nhân tạo' },
];

const mockSemesters = [
  { id: 'sem1', name: 'Học kỳ 1 - 2024-2025' },
  { id: 'sem2', name: 'Học kỳ 2 - 2024-2025' },
  { id: 'sem3', name: 'Học kỳ 3 - 2024-2025' },
];

const mockRooms = [
  { id: 'room1', name: 'A101' },
  { id: 'room2', name: 'A102' },
  { id: 'room3', name: 'B201' },
  { id: 'room4', name: 'Lab3' },
];

export default function CreateCourseClassPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<CourseClassFormData>({
    classCode: '',
    courseId: '',
    semesterId: '',
    roomId: '',
    maxStudent: 50,
    currentStudent: 0,
    status: 'active',
    isActive: true
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.classCode.trim()) newErrors.classCode = 'Vui lòng nhập mã lớp';
    if (!formData.courseId) newErrors.courseId = 'Vui lòng chọn môn học';
    if (!formData.semesterId) newErrors.semesterId = 'Vui lòng chọn học kỳ';
    if (!formData.roomId) newErrors.roomId = 'Vui lòng chọn phòng học';
    if (formData.maxStudent <= 0) newErrors.maxStudent = 'Sĩ số tối đa phải lớn hơn 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    // TODO: Gọi API tạo lớp học phần
    setTimeout(() => {
      setLoading(false);
      toast.success('Thêm lớp học phần thành công');
      router.push('/dashboard/admin/course-classes');
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
          <CardTitle>Thêm lớp học phần mới</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label htmlFor="classCode">Mã lớp *</Label>
                <Input
                  id="classCode"
                  value={formData.classCode}
                  onChange={(e) => setFormData({ ...formData, classCode: e.target.value })}
                  className="mt-1.5"
                  placeholder="CNTT101-01"
                />
                {errors.classCode && <p className="text-sm text-destructive mt-1">{errors.classCode}</p>}
              </div>

              <div>
                <Label htmlFor="maxStudent">Sĩ số tối đa *</Label>
                <Input
                  id="maxStudent"
                  type="number"
                  value={formData.maxStudent}
                  onChange={(e) => setFormData({ ...formData, maxStudent: parseInt(e.target.value) })}
                  className="mt-1.5"
                  placeholder="50"
                />
                {errors.maxStudent && <p className="text-sm text-destructive mt-1">{errors.maxStudent}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="courseId">Môn học *</Label>
              <Select 
                value={formData.courseId} 
                onValueChange={(val) => setFormData({ ...formData, courseId: val })}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Chọn môn học" />
                </SelectTrigger>
                <SelectContent>
                  {mockCourses.map(course => (
                    <SelectItem key={course.id} value={course.id}>{course.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.courseId && <p className="text-sm text-destructive mt-1">{errors.courseId}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label htmlFor="semesterId">Học kỳ *</Label>
                <Select 
                  value={formData.semesterId} 
                  onValueChange={(val) => setFormData({ ...formData, semesterId: val })}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Chọn học kỳ" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockSemesters.map(semester => (
                      <SelectItem key={semester.id} value={semester.id}>{semester.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.semesterId && <p className="text-sm text-destructive mt-1">{errors.semesterId}</p>}
              </div>

              <div>
                <Label htmlFor="roomId">Phòng học *</Label>
                <Select 
                  value={formData.roomId} 
                  onValueChange={(val) => setFormData({ ...formData, roomId: val })}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Chọn phòng học" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockRooms.map(room => (
                      <SelectItem key={room.id} value={room.id}>{room.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.roomId && <p className="text-sm text-destructive mt-1">{errors.roomId}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="status">Trạng thái</Label>
              <Select 
                value={formData.status} 
                onValueChange={(val) => setFormData({ ...formData, status: val })}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Đang hoạt động</SelectItem>
                  <SelectItem value="inactive">Ngừng hoạt động</SelectItem>
                  <SelectItem value="full">Đã đầy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-white" disabled={loading}>
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
              <Button type="button" variant="outline" onClick={() => router.push('/dashboard/admin/course-classes')}>
                Hủy
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}