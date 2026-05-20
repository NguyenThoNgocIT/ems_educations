'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';
import { courseClassApi } from '@/api/course';

interface Student {
  id: string;
  studentCode: string;
  fullName: string;
}

interface CourseClass {
  id: string;
  classCode: string;
  courseName: string;
}

export default function CreateAttendancePage() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [courseClasses, setCourseClasses] = useState<CourseClass[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendanceStatus, setAttendanceStatus] = useState<Record<string, boolean>>({});
  const [loadingClasses, setLoadingClasses] = useState<boolean>(true);

  // Lấy danh sách lớp học phần
  useEffect(() => {
    fetchCourseClasses();
  }, []);

  const fetchCourseClasses = async () => {
    try {
      const response = await courseClassApi.getAll();
      const data = response?.data || response || [];
      setCourseClasses(data);
    } catch (error) {
      toast.error('Không thể lấy danh sách lớp học phần');
    } finally {
      setLoadingClasses(false);
    }
  };

  // Lấy danh sách sinh viên khi chọn lớp
  useEffect(() => {
    if (selectedClass) {
      fetchStudentsByClass();
    } else {
      setStudents([]);
      setAttendanceStatus({});
    }
  }, [selectedClass]);

  const fetchStudentsByClass = async () => {
    setStudents([]);
    setAttendanceStatus({});
    toast.info('Backend chưa có API điểm danh/sinh viên theo lớp học phần. Chức năng này đang chờ triển khai BE.');
  };

  const handleToggleAll = (checked: boolean) => {
    const newStatus: Record<string, boolean> = {};
    students.forEach(s => {
      newStatus[s.id] = checked;
    });
    setAttendanceStatus(newStatus);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass) {
      toast.error('Vui lòng chọn lớp học phần');
      return;
    }

    setLoading(true);
    try {
      toast.error('Chưa thể lưu điểm danh vì backend chưa có AttendanceController.');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lưu điểm danh thất bại');
    } finally {
      setLoading(false);
    }
  };

  const presentCount = Object.values(attendanceStatus).filter(v => v === true).length;
  const absentCount = students.length - presentCount;

  if (loadingClasses) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => router.back()} className="mb-2">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Quay lại
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Điểm danh theo buổi học</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label htmlFor="classId">Lớp học phần *</Label>
                <Select value={selectedClass} onValueChange={(val) => setSelectedClass(val || '')}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Chọn lớp học phần" />
                  </SelectTrigger>
                  <SelectContent>
                    {courseClasses.map(c => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.classCode} - {c.courseName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="date">Ngày học</Label>
                <Input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="mt-1.5"
                />
              </div>
            </div>

            {selectedClass && students.length > 0 && (
              <>
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleAll(true)}
                    >
                      Chọn tất cả
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleAll(false)}
                    >
                      Bỏ chọn tất cả
                    </Button>
                  </div>
                  <div className="text-sm">
                    <span className="text-green-600">Có mặt: {presentCount}</span>
                    <span className="text-red-600 ml-3">Vắng: {absentCount}</span>
                  </div>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left py-3 px-4 font-semibold text-sm">Mã SV</th>
                        <th className="text-left py-3 px-4 font-semibold text-sm">Họ và tên</th>
                        <th className="text-center py-3 px-4 font-semibold text-sm w-24">Có mặt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student) => (
                        <tr key={student.id} className="border-b hover:bg-muted/30">
                          <td className="py-3 px-4 text-sm">{student.studentCode}</td>
                          <td className="py-3 px-4 text-sm">{student.fullName}</td>
                          <td className="py-3 px-4 text-center">
                            <Checkbox
                              checked={attendanceStatus[student.id] || false}
                              onCheckedChange={(checked) => 
                                setAttendanceStatus(prev => ({ ...prev, [student.id]: checked === true }))
                              }
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {selectedClass && students.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Không có sinh viên trong lớp này
              </div>
            )}

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
                    Lưu điểm danh
                  </span>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push('/dashboard/lecturer/attendance')}>
                Hủy
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
