'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

// Định nghĩa type cho Student
interface Student {
  id: number;
  studentCode: string;
  personId: string;
  fullName: string;
  trainingProgramId: string;
  isActive: boolean;
  createdAt: string;
}

export default function StudentsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [sortColumn, setSortColumn] = useState<keyof Student>('studentCode');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  // Mock data - sẽ thay bằng API call sau
  const mockStudents: Student[] = Array.from({ length: 52 }, (_, i) => ({
    id: i + 1,
    studentCode: `SV${String(i + 1).padStart(4, '0')}`,
    personId: `P${String(i + 1).padStart(6, '0')}`,
    fullName: ['Nguyễn Văn An', 'Trần Thị Bình', 'Lê Hoàng Cường', 'Phạm Thị Dung', 'Hoàng Văn Em', 'Vũ Thị Phương', 'Đặng Văn Giang', 'Bùi Thị Hà'][i % 8],
    trainingProgramId: ['CNTT', 'KTPM', 'HTTT', 'KHMT'][i % 4],
    isActive: i % 7 !== 0,
    createdAt: new Date(2024, i % 12, (i % 28) + 1).toLocaleDateString('vi-VN')
  }));

  // Filter và sort data
  const filteredStudents = mockStudents
    .filter(student => {
      const matchesSearch = student.studentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student.personId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student.fullName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || 
                          (filterStatus === 'active' && student.isActive) ||
                          (filterStatus === 'inactive' && !student.isActive);
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      const direction = sortDirection === 'asc' ? 1 : -1;
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return aVal > bVal ? direction : -direction;
      }
      return 0;
    });

  const totalPages = Math.ceil(filteredStudents.length / rowsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleSort = (column: keyof Student) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleDelete = (student: Student) => {
    setStudentToDelete(student);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    toast.success(`Đã xóa sinh viên ${studentToDelete?.fullName}`);
    setDeleteDialogOpen(false);
    setStudentToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Quản lý sinh viên</h1>
          <p className="text-muted-foreground">Danh sách và quản lý thông tin sinh viên</p>
        </div>
        <Button onClick={() => router.push('/dashboard/admin/students/create')} className="bg-primary hover:bg-primary/90 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Thêm sinh viên
        </Button>
      </div>

      {/* Filter Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo mã SV, mã cá nhân, họ tên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="active">Đang hoạt động</SelectItem>
                <SelectItem value="inactive">Ngừng hoạt động</SelectItem>
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
                  <th 
                    className="text-left py-3 px-4 font-semibold text-sm cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('studentCode')}
                  >
                    Mã SV {sortColumn === 'studentCode' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Họ và tên</th>
                  <th 
                    className="text-left py-3 px-4 font-semibold text-sm cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('personId')}
                  >
                    Mã cá nhân {sortColumn === 'personId' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Chương trình</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Trạng thái</th>
                  <th 
                    className="text-left py-3 px-4 font-semibold text-sm cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('createdAt')}
                  >
                    Ngày tạo {sortColumn === 'createdAt' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Thao tác</th>
                </table>
              </thead>
              <tbody>
                {paginatedStudents.map((student) => (
                  <tr key={student.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 text-sm font-medium">{student.studentCode}</td>
                    <td className="py-3 px-4 text-sm">{student.fullName}</td>
                    <td className="py-3 px-4 text-sm">{student.personId}</td>
                    <td className="py-3 px-4 text-sm">{student.trainingProgramId}</td>
                    <td className="py-3 px-4 text-sm">
                      <Badge variant={student.isActive ? 'default' : 'secondary'}>
                        {student.isActive ? 'Hoạt động' : 'Ngừng'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm">{student.createdAt}</td>
                    <td className="py-3 px-4 text-sm">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/dashboard/admin/students/${student.id}`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(student)}
                          className="text-destructive hover:text-destructive"
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

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Hiển thị</span>
              <Select value={String(rowsPerPage)} onValueChange={(val) => setRowsPerPage(Number(val))}>
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
                trên tổng {filteredStudents.length} bản ghi
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
              <span className="text-sm">
                Trang {currentPage} / {totalPages}
              </span>
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa sinh viên</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa sinh viên <strong>{studentToDelete?.fullName}</strong> ({studentToDelete?.studentCode})? 
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}