'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

// Định nghĩa type
interface CourseClass {
  id: number;
  classCode: string;
  courseId: string;
  courseName: string;
  semesterId: string;
  semesterName: string;
  roomId: string;
  roomName: string;
  maxStudent: number;
  currentStudent: number;
  status: string;
  isActive: boolean;
}

// Mock data
const mockCourseClasses: CourseClass[] = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  classCode: `CNTT${String(101 + i).padStart(3, '0')}-${String(i % 3 + 1).padStart(2, '0')}`,
  courseId: `course_${i + 1}`,
  courseName: ['Lập trình Web', 'Cơ sở dữ liệu', 'Mạng máy tính', 'Trí tuệ nhân tạo'][i % 4],
  semesterId: `sem_${Math.floor(i / 10) + 1}`,
  semesterName: [`Học kỳ 1 - 2024-2025`, `Học kỳ 2 - 2024-2025`][Math.floor(i / 10) % 2],
  roomId: `room_${i + 1}`,
  roomName: ['A101', 'A102', 'B201', 'Lab3', 'C301'][i % 5],
  maxStudent: 50,
  currentStudent: 35 + (i % 15),
  status: i % 10 === 0 ? 'full' : i % 7 === 0 ? 'inactive' : 'active',
  isActive: i % 7 !== 0
}));

export default function CourseClassesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterSemester, setFilterSemester] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [sortColumn, setSortColumn] = useState<keyof CourseClass>('classCode');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Lấy danh sách semester unique cho filter
  const semesters = [...new Set(mockCourseClasses.map(c => c.semesterName))];

  // Filter
  let filteredData = mockCourseClasses.filter(item => {
    const matchesSearch = item.classCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.courseName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSemester = filterSemester === 'all' || item.semesterName === filterSemester;
    return matchesSearch && matchesSemester;
  });

  // Sort
  filteredData = [...filteredData].sort((a, b) => {
    const aVal = a[sortColumn];
    const bVal = b[sortColumn];
    const direction = sortDirection === 'asc' ? 1 : -1;
    if (aVal < bVal) return -direction;
    if (aVal > bVal) return direction;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handleSort = (column: keyof CourseClass) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Đang mở</Badge>;
      case 'full':
        return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">Đã đầy</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Đã đóng</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleDelete = (id: number, name: string) => {
    toast.success(`Đã xóa lớp ${name}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Quản lý lớp học phần</h1>
          <p className="text-muted-foreground">Danh sách các lớp học phần theo từng môn học</p>
        </div>
        <Button onClick={() => router.push('/dashboard/admin/course-classes/create')} className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Thêm lớp học phần
        </Button>
      </div>

      {/* Filter Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo mã lớp, tên môn học..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <Select value={filterSemester} onValueChange={(val) => {
              setFilterSemester(val);
              setCurrentPage(1);
            }}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Chọn học kỳ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả học kỳ</SelectItem>
                {semesters.map(sem => (
                  <SelectItem key={sem} value={sem}>{sem}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-sm cursor-pointer hover:bg-muted/50" onClick={() => handleSort('classCode')}>
                    Mã lớp {sortColumn === 'classCode' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-sm cursor-pointer hover:bg-muted/50" onClick={() => handleSort('courseName')}>
                    Môn học {sortColumn === 'courseName' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Học kỳ</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Phòng</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm cursor-pointer hover:bg-muted/50" onClick={() => handleSort('currentStudent')}>
                    Sĩ số {sortColumn === 'currentStudent' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Trạng thái</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 text-sm font-medium">{item.classCode}</td>
                    <td className="py-3 px-4 text-sm">{item.courseName}</td>
                    <td className="py-3 px-4 text-sm">{item.semesterName}</td>
                    <td className="py-3 px-4 text-sm">{item.roomName}</td>
                    <td className="py-3 px-4 text-sm">{item.currentStudent}/{item.maxStudent}</td>
                    <td className="py-3 px-4 text-sm">{getStatusBadge(item.status)}</td>
                    <td className="py-3 px-4 text-sm">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => router.push(`/dashboard/admin/course-classes/${item.id}/edit`)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(item.id, item.classCode)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Hiển thị</span>
              <Select value={String(rowsPerPage)} onValueChange={(val) => {
                setRowsPerPage(Number(val));
                setCurrentPage(1);
              }}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground">
                trên tổng {filteredData.length} bản ghi
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">Trang {currentPage} / {totalPages}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}