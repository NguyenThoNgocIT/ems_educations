'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { studentApi } from '@/api/student';

interface Student {
  id: string;
  studentCode: string;
  personId: string;
  fullName: string;
  trainingProgramId: string;
  isActive: boolean;
  createdAt: string;
}

const PROGRAM_NAMES: Record<string, string> = {
  '40299068-e853-4123-946d-ab9e68d28971': 'CNTT - Công nghệ thông tin',
  '61c1d31f-c6ec-4d74-a62b-c4b5071608b0': 'HTTT - Hệ thống thông tin',
  'f72a21bd-32f0-404d-9ade-8fefddd218e3': 'KTPM - Kỹ thuật phần mềm',
  '0dc1f922-5360-41bf-8eff-71f5547da30c': 'QTKD - Quản trị kinh doanh',
  'b3982a4c-97a2-4b4f-be58-b0ecd2c38057': 'NN - Ngôn ngữ Anh',
};

export default function StudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await studentApi.getAll();
      const data = response?.data || response || [];
      setStudents(data);
    } catch (error) {
      toast.error('Không thể lấy danh sách sinh viên');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.studentCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
                          (filterStatus === 'active' && student.isActive) ||
                          (filterStatus === 'inactive' && !student.isActive);
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredStudents.length / rowsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleDelete = async (student: Student) => {
    try {
      await studentApi.delete(student.id);
      toast.success(`Đã xóa sinh viên ${student.fullName}`);
      await fetchStudents();
    } catch (error) {
      toast.error('Xóa sinh viên thất bại');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Quản lý sinh viên</h1>
          <p className="text-muted-foreground">Danh sách sinh viên</p>
        </div>
        <Button onClick={() => router.push('/dashboard/admin/students/create')} className="bg-primary">
          <Plus className="h-4 w-4 mr-2" />
          Thêm sinh viên
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo mã SV, họ tên..."
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
          {paginatedStudents.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              Chưa có dữ liệu sinh viên. Hãy thêm sinh viên mới.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold text-sm">Mã SV</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Họ và tên</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Chương trình</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Trạng thái</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Ngày tạo</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedStudents.map((student) => (
                      <tr key={student.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 text-sm font-medium">{student.studentCode}</td>
                        <td className="py-3 px-4 text-sm">{student.fullName || 'Chưa cập nhật'}</td>
                        <td className="py-3 px-4 text-sm">
                          {PROGRAM_NAMES[student.trainingProgramId?.toLowerCase()] || student.trainingProgramId}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <Badge variant={student.isActive ? 'default' : 'secondary'}>
                            {student.isActive ? 'Hoạt động' : 'Ngừng'}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {new Date(student.createdAt).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => router.push(`/dashboard/admin/students/${student.id}/edit`)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(student)} className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

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
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm">Trang {currentPage} / {totalPages}</span>
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}