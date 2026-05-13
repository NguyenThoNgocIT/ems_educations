// TODO: Chuy?n d?i t? code AI Hosting
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserCheck, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';

// Định nghĩa type
interface AttendanceRecord {
  id: string;
  studentCode: string;
  studentName: string;
  courseClassId: string;
  sessions: Record<string, boolean>;
}

interface CourseClass {
  id: string;
  classCode: string;
  courseName: string;
}

// Mock data - sẽ thay bằng API call sau
const mockAttendance: AttendanceRecord[] = [
  {
    id: '1',
    studentCode: 'SV001',
    studentName: 'Nguyễn Văn A',
    courseClassId: 'class1',
    sessions: {
      session1: true, session2: true, session3: false, session4: true, session5: true,
      session6: true, session7: false, session8: true, session9: true, session10: false,
      session11: true, session12: true, session13: false, session14: true, session15: true
    }
  },
  {
    id: '2',
    studentCode: 'SV002',
    studentName: 'Trần Thị B',
    courseClassId: 'class1',
    sessions: {
      session1: true, session2: false, session3: true, session4: true, session5: false,
      session6: true, session7: true, session8: false, session9: true, session10: true,
      session11: false, session12: true, session13: true, session14: false, session15: true
    }
  },
  {
    id: '3',
    studentCode: 'SV003',
    studentName: 'Lê Văn C',
    courseClassId: 'class1',
    sessions: {
      session1: true, session2: true, session3: true, session4: false, session5: true,
      session6: false, session7: true, session8: true, session9: false, session10: true,
      session11: true, session12: false, session13: true, session14: true, session15: false
    }
  },
];

const mockCourseClasses: CourseClass[] = [
  { id: 'class1', classCode: 'CNTT101-01', courseName: 'Lập trình Web' },
  { id: 'class2', classCode: 'CNTT102-01', courseName: 'Cơ sở dữ liệu' },
  { id: 'class3', classCode: 'CNTT103-01', courseName: 'Mạng máy tính' },
];

export default function AttendancePage() {
  const router = useRouter();
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [courseClasses, setCourseClasses] = useState<CourseClass[]>([]);
  const [filterClass, setFilterClass] = useState<string>('all');

  useEffect(() => {
    // TODO: Gọi API lấy dữ liệu điểm danh
    setAttendance(mockAttendance);
    setCourseClasses(mockCourseClasses);
  }, []);

  const filteredAttendance = filterClass === 'all' 
    ? attendance 
    : attendance.filter(a => a.courseClassId === filterClass);

  const sessionCount = 15;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <UserCheck className="h-8 w-8 text-primary" />
            Điểm danh
          </h1>
          <p className="text-muted-foreground">Theo dõi chuyên cần sinh viên</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Select value={filterClass} onValueChange={setFilterClass}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Chọn lớp học phần" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả lớp</SelectItem>
              {courseClasses.map(c => (
                <SelectItem key={c.id} value={c.id}>{c.classCode} - {c.courseName}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            onClick={() => router.push('/dashboard/lecturer/attendance/create')} 
            className="bg-primary hover:bg-primary/90 whitespace-nowrap"
          >
            Điểm danh theo buổi
          </Button>
        </div>
      </div>

      {/* Attendance Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px]">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left py-4 px-4 font-semibold text-sm sticky left-0 bg-muted/50 z-10">Mã SV</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm sticky left-[100px] bg-muted/50 z-10">Họ và tên</th>
                  {Array.from({ length: sessionCount }, (_, i) => (
                    <th key={i} className="text-center py-4 px-2 font-semibold text-xs">
                      B{i + 1}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredAttendance.map((record) => (
                  <tr key={record.id} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 text-sm font-medium sticky left-0 bg-background z-10">
                      {record.studentCode}
                    </td>
                    <td className="py-3 px-4 text-sm sticky left-[100px] bg-background z-10 truncate max-w-[200px]">
                      {record.studentName}
                    </td>
                    {Array.from({ length: sessionCount }, (_, i) => {
                      const sessionKey = `session${i + 1}`;
                      const isPresent = record.sessions[sessionKey];
                      return (
                        <td key={i} className="py-3 px-2 text-center">
                          {isPresent ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500 mx-auto" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
                {filteredAttendance.length === 0 && (
                  <tr>
                    <td colSpan={sessionCount + 2} className="py-8 text-center text-muted-foreground">
                      Không có dữ liệu điểm danh
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}