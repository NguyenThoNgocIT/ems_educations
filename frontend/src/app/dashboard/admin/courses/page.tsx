'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

// Định nghĩa type cho Course
interface Course {
  id: number;
  code: string;
  name: string;
  departmentId: string;
  courseType: string;
  credits: number;
  isActive: boolean;
}

// Mock data - sẽ thay bằng API call sau
const mockCourses: Course[] = Array.from({ length: 40 }, (_, i) => ({
  id: i + 1,
  code: `CNTT${String(i + 101).padStart(3, '0')}`,
  name: ['Lập trình Web', 'Cơ sở dữ liệu', 'Mạng máy tính', 'Trí tuệ nhân tạo', 'Hệ điều hành', 'Cấu trúc dữ liệu'][i % 6],
  departmentId: ['CNTT', 'KTPM', 'HTTT', 'KHMT', 'Kinh tế'][i % 5],
  courseType: i % 2 === 0 ? 'Bắt buộc' : 'Tự chọn',
  credits: [3, 4, 2][i % 3],
  isActive: true
}));

export default function CoursesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');

  // Filter courses
  const filteredCourses = mockCourses.filter(course => {
    const matchesSearch = course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || course.departmentId === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  const handleDelete = (id: number, name: string) => {
    // TODO: Gọi API xóa
    toast.success(`Đã xóa môn học ${name}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Quản lý môn học</h1>
          <p className="text-muted-foreground">Danh sách và quản lý môn học</p>
        </div>
        <Button onClick={() => router.push('/dashboard/admin/courses/create')} className="bg-primary hover:bg-primary/90 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Thêm môn học
        </Button>
      </div>

      {/* Filter Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Tìm kiếm theo mã môn, tên môn..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Chọn khoa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả khoa</SelectItem>
                <SelectItem value="CNTT">Công nghệ thông tin</SelectItem>
                <SelectItem value="KTPM">Kỹ thuật phần mềm</SelectItem>
                <SelectItem value="HTTT">Hệ thống thông tin</SelectItem>
                <SelectItem value="KHMT">Khoa học máy tính</SelectItem>
                <SelectItem value="Kinh tế">Kinh tế</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-sm">Mã môn</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Tên môn học</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Khoa</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Loại</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Tín chỉ</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Trạng thái</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.slice(0, 10).map((course) => (
                  <tr key={course.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 text-sm font-medium">{course.code}</td>
                    <td className="py-3 px-4 text-sm">{course.name}</td>
                    <td className="py-3 px-4 text-sm">{course.departmentId}</td>
                    <td className="py-3 px-4 text-sm">
                      <Badge variant={course.courseType === 'Bắt buộc' ? 'default' : 'secondary'}>
                        {course.courseType}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm">{course.credits}</td>
                    <td className="py-3 px-4 text-sm">
                      <Badge variant={course.isActive ? 'default' : 'secondary'}>
                        {course.isActive ? 'Hoạt động' : 'Ngừng'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => router.push(`/dashboard/admin/courses/${course.id}/edit`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(course.id, course.name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination info */}
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-muted-foreground">
              Hiển thị {Math.min(10, filteredCourses.length)} / {filteredCourses.length} bản ghi
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}