// TODO: Chuy?n d?i t? code AI Hosting
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, FileText } from 'lucide-react';
import { toast } from 'sonner';

// Định nghĩa type
interface GradeRecord {
  id: string;
  studentCode: string;
  studentName: string;
  courseClassId: string;
  courseClassName: string;
  attendanceScore: number;
  midtermScore: number;
  finalScore: number;
  totalScore: number;
}

interface CourseClass {
  id: string;
  classCode: string;
  courseName: string;
}

// Mock data - sẽ thay bằng API call sau
const mockGrades: GradeRecord[] = [
  {
    id: '1',
    studentCode: 'SV001',
    studentName: 'Nguyễn Văn A',
    courseClassId: 'class1',
    courseClassName: 'CNTT101-01 - Lập trình Web',
    attendanceScore: 9.5,
    midtermScore: 8.0,
    finalScore: 8.5,
    totalScore: 8.4
  },
  {
    id: '2',
    studentCode: 'SV002',
    studentName: 'Trần Thị B',
    courseClassId: 'class1',
    courseClassName: 'CNTT101-01 - Lập trình Web',
    attendanceScore: 8.5,
    midtermScore: 7.5,
    finalScore: 8.0,
    totalScore: 7.9
  },
  {
    id: '3',
    studentCode: 'SV003',
    studentName: 'Lê Văn C',
    courseClassId: 'class1',
    courseClassName: 'CNTT101-01 - Lập trình Web',
    attendanceScore: 7.0,
    midtermScore: 6.5,
    finalScore: 7.5,
    totalScore: 7.2
  },
  {
    id: '4',
    studentCode: 'SV004',
    studentName: 'Phạm Thị D',
    courseClassId: 'class2',
    courseClassName: 'CNTT102-01 - Cơ sở dữ liệu',
    attendanceScore: 9.0,
    midtermScore: 8.5,
    finalScore: 9.0,
    totalScore: 8.8
  },
];

const mockCourseClasses: CourseClass[] = [
  { id: 'class1', classCode: 'CNTT101-01', courseName: 'Lập trình Web' },
  { id: 'class2', classCode: 'CNTT102-01', courseName: 'Cơ sở dữ liệu' },
  { id: 'class3', classCode: 'CNTT103-01', courseName: 'Mạng máy tính' },
];

export default function GradeInputPage() {
  const router = useRouter();
  const [grades, setGrades] = useState<GradeRecord[]>([]);
  const [courseClasses, setCourseClasses] = useState<CourseClass[]>([]);
  const [filterClass, setFilterClass] = useState<string>('all');

  useEffect(() => {
    // TODO: Gọi API lấy dữ liệu điểm
    setGrades(mockGrades);
    setCourseClasses(mockCourseClasses);
  }, []);

  const filteredGrades = filterClass === 'all' 
    ? grades 
    : grades.filter(g => g.courseClassId === filterClass);

  const getScoreColor = (score: number) => {
    if (score >= 8.5) return 'text-green-600 font-bold';
    if (score >= 7.0) return 'text-blue-600';
    if (score >= 5.0) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <FileText className="h-8 w-8 text-primary" />
            Nhập điểm
          </h1>
          <p className="text-muted-foreground">Quản lý điểm số sinh viên</p>
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
        </div>
      </div>

      {/* Grades Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left py-4 px-6 font-semibold text-sm">Mã SV</th>
                  <th className="text-left py-4 px-6 font-semibold text-sm">Họ và tên</th>
                  <th className="text-left py-4 px-6 font-semibold text-sm">Lớp học phần</th>
                  <th className="text-center py-4 px-6 font-semibold text-sm">Chuyên cần (10%)</th>
                  <th className="text-center py-4 px-6 font-semibold text-sm">Giữa kỳ (30%)</th>
                  <th className="text-center py-4 px-6 font-semibold text-sm">Cuối kỳ (60%)</th>
                  <th className="text-center py-4 px-6 font-semibold text-sm">Tổng kết</th>
                  <th className="text-center py-4 px-6 font-semibold text-sm">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredGrades.map((grade) => (
                  <tr key={grade.id} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="py-4 px-6 text-sm font-medium">{grade.studentCode}</td>
                    <td className="py-4 px-6 text-sm">{grade.studentName}</td>
                    <td className="py-4 px-6 text-sm">{grade.courseClassName}</td>
                    <td className="py-4 px-6 text-sm text-center">{grade.attendanceScore}</td>
                    <td className="py-4 px-6 text-sm text-center">{grade.midtermScore}</td>
                    <td className="py-4 px-6 text-sm text-center">{grade.finalScore}</td>
                    <td className={`py-4 px-6 text-sm text-center ${getScoreColor(grade.totalScore)}`}>
                      {grade.totalScore}
                    </td>
                    <td className="py-4 px-6 text-sm text-center">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => router.push(`/dashboard/lecturer/enter-grades/${grade.id}/edit`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </td>
                  <tr>
                ))}
                {filteredGrades.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-muted-foreground">
                      Không có dữ liệu điểm
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