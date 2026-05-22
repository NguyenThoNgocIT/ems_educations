'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';
import { courseApi, courseClassApi } from '@/api/course';
import { semesterApi } from '@/api/semester';
import { roomApi } from '@/api/room';
import { unwrapApiResponse } from '@/api/response';

interface CourseClassFormData {
  classCode: string;
  courseId: string;
  semesterId: string;
  roomId: string;
  maxStudent: number;
  currentStudent: number;
  status: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

interface FormErrors {
  classCode?: string;
  courseId?: string;
  semesterId?: string;
  maxStudent?: string;
  currentStudent?: string;
  dateRange?: string;
}

const normalizeList = (response: any) => {
  const unwrapped = unwrapApiResponse<any>(response);
  if (Array.isArray(unwrapped)) return unwrapped;
  if (Array.isArray(unwrapped?.content)) return unwrapped.content;
  if (Array.isArray(unwrapped?.data)) return unwrapped.data;
  if (Array.isArray(unwrapped?.data?.content)) return unwrapped.data.content;
  return [];
};

const getCourseId = (course: any) => course.id || course.courseId || '';
const getSemesterId = (semester: any) => semester.semesterId || semester.id || '';
const getRoomId = (room: any) => room.roomId || room.id || '';

export default function EditCourseClassPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [courses, setCourses] = useState<any[]>([]);
  const [semesters, setSemesters] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [formData, setFormData] = useState<CourseClassFormData>({
    classCode: '',
    courseId: '',
    semesterId: '',
    roomId: '',
    maxStudent: 50,
    currentStudent: 0,
    status: 'ACTIVE',
    startDate: '',
    endDate: '',
    isActive: true,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      setPageLoading(true);
      try {
        const [classRes, courseRes, semesterRes, roomRes] = await Promise.all([
          courseClassApi.getById(id),
          courseApi.getAll(),
          semesterApi.getAll({ isActive: true }),
          roomApi.getAll(),
        ]);
        const item: any = unwrapApiResponse<any>(classRes);
        setCourses(normalizeList(courseRes));
        setSemesters(normalizeList(semesterRes));
        setRooms(normalizeList(roomRes));
        setFormData({
          classCode: item.classCode || '',
          courseId: item.courseId || '',
          semesterId: item.semesterId || '',
          roomId: item.roomId || '',
          maxStudent: Number(item.maxStudent ?? 50),
          currentStudent: Number(item.currentStudent ?? 0),
          status: item.status || 'ACTIVE',
          startDate: item.startDate || '',
          endDate: item.endDate || '',
          isActive: item.isActive !== false,
        });
      } catch (error) {
        console.error(error);
        toast.error('Khong the tai thong tin lop hoc phan');
        router.push('/dashboard/admin/course-classes');
      } finally {
        setPageLoading(false);
      }
    };

    loadData();
  }, [id, router]);

  const validate = (): boolean => {
    const nextErrors: FormErrors = {};
    if (!formData.classCode.trim()) nextErrors.classCode = 'Vui long nhap ma lop';
    if (!formData.courseId) nextErrors.courseId = 'Vui long chon mon hoc';
    if (!formData.semesterId) nextErrors.semesterId = 'Vui long chon hoc ky';
    if (!Number.isFinite(formData.maxStudent) || formData.maxStudent <= 0) nextErrors.maxStudent = 'Si so toi da phai lon hon 0';
    if (formData.currentStudent < 0) nextErrors.currentStudent = 'Si so hien tai khong duoc am';
    if (formData.currentStudent > formData.maxStudent) nextErrors.currentStudent = 'Si so hien tai khong duoc vuot si so toi da';
    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      nextErrors.dateRange = 'Ngay bat dau phai nho hon hoac bang ngay ket thuc';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await courseClassApi.update(id, {
        classCode: formData.classCode.trim().toUpperCase(),
        courseId: formData.courseId,
        semesterId: formData.semesterId,
        roomId: formData.roomId || null,
        maxStudent: Number(formData.maxStudent),
        currentStudent: Number(formData.currentStudent),
        status: formData.status,
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
        isActive: formData.isActive,
      });
      toast.success('Cap nhat lop hoc phan thanh cong');
      router.push('/dashboard/admin/course-classes');
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Cap nhat lop hoc phan that bai');
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => router.back()} className="mb-2">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Quay lai
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Chinh sua lop hoc phan</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <Label htmlFor="classCode">Ma lop *</Label>
                <Input id="classCode" value={formData.classCode} onChange={(event) => setFormData({ ...formData, classCode: event.target.value })} className="mt-1.5" />
                {errors.classCode && <p className="mt-1 text-sm text-destructive">{errors.classCode}</p>}
              </div>

              <div>
                <Label htmlFor="maxStudent">Si so toi da *</Label>
                <Input id="maxStudent" type="number" min={1} value={formData.maxStudent} onChange={(event) => setFormData({ ...formData, maxStudent: Number(event.target.value) })} className="mt-1.5" />
                {errors.maxStudent && <p className="mt-1 text-sm text-destructive">{errors.maxStudent}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <Label htmlFor="currentStudent">Si so hien tai</Label>
                <Input id="currentStudent" type="number" min={0} value={formData.currentStudent} onChange={(event) => setFormData({ ...formData, currentStudent: Number(event.target.value) })} className="mt-1.5" />
                {errors.currentStudent && <p className="mt-1 text-sm text-destructive">{errors.currentStudent}</p>}
              </div>

              <div>
                <Label htmlFor="status">Trang thai</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value || 'ACTIVE' })}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Dang mo</SelectItem>
                    <SelectItem value="FULL">Da day</SelectItem>
                    <SelectItem value="INACTIVE">Da dong</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="courseId">Mon hoc *</Label>
              <Select value={formData.courseId} onValueChange={(value) => setFormData({ ...formData, courseId: value || '' })}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Chon mon hoc" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => {
                    const courseId = getCourseId(course);
                    return (
                      <SelectItem key={courseId} value={courseId}>
                        {course.code ? `${course.code} - ` : ''}{course.name || courseId}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {errors.courseId && <p className="mt-1 text-sm text-destructive">{errors.courseId}</p>}
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <Label htmlFor="semesterId">Hoc ky *</Label>
                <Select value={formData.semesterId} onValueChange={(value) => setFormData({ ...formData, semesterId: value || '' })}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Chon hoc ky" />
                  </SelectTrigger>
                  <SelectContent>
                    {semesters.map((semester) => {
                      const semesterId = getSemesterId(semester);
                      return (
                        <SelectItem key={semesterId} value={semesterId}>
                          {semester.code ? `${semester.code} - ` : ''}{semester.name || semesterId}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                {errors.semesterId && <p className="mt-1 text-sm text-destructive">{errors.semesterId}</p>}
              </div>

              <div>
                <Label htmlFor="roomId">Phong hoc</Label>
                <Select value={formData.roomId || 'none'} onValueChange={(value) => setFormData({ ...formData, roomId: !value || value === 'none' ? '' : value })}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Chon phong hoc" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Chua xep phong</SelectItem>
                    {rooms.map((room) => {
                      const roomId = getRoomId(room);
                      return (
                        <SelectItem key={roomId} value={roomId}>
                          {room.code || room.roomCode || room.name || roomId}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <Label htmlFor="startDate">Ngay bat dau</Label>
                <DatePicker id="startDate" value={formData.startDate} onChange={(value) => setFormData({ ...formData, startDate: value })} placeholder="Chon ngay" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="endDate">Ngay ket thuc</Label>
                <DatePicker id="endDate" value={formData.endDate} onChange={(value) => setFormData({ ...formData, endDate: value })} placeholder="Chon ngay" className="mt-1.5" />
              </div>
            </div>
            {errors.dateRange && <p className="text-sm text-destructive">{errors.dateRange}</p>}

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-white" disabled={loading}>
                <Save className="mr-2 h-4 w-4" />
                {loading ? 'Dang luu...' : 'Cap nhat'}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push('/dashboard/admin/course-classes')}>
                Huy
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
