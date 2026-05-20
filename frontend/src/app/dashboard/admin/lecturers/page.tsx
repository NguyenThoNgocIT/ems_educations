'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Edit, Trash2, FileText, UserCheck } from 'lucide-react';
import { toast } from 'sonner';
import { lecturerApi } from '@/api/lecturer';
import type { LecturerListItem } from '@/types/instructor';

export default function LecturersPage() {
  const router = useRouter();
  const { user } = useAuth();
  const userRole = user?.role || 'admin';
  
  const [lecturers, setLecturers] = useState<LecturerListItem[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    async function fetchLecturers() {
      try {
        const response: any = await lecturerApi.getAll();
        const listData = Array.isArray(response) ? response : (response?.data || []);
        setLecturers(listData);
      } catch (error) {
        console.error(error);
        toast.error('Không thể lấy danh sách giảng viên');
      }
    }
    fetchLecturers();
  }, []);

  // Filter lecturers
  const filteredLecturers = lecturers.filter(lecturer => {
    const matchesSearch = (lecturer.instructorCode || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (lecturer.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (lecturer.employeeCode || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
                          (filterStatus === 'active' && lecturer.isActive) ||
                          (filterStatus === 'inactive' && !lecturer.isActive);
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id: string, name: string) => {
    try {
      await lecturerApi.delete(id);
      setLecturers((prev) => prev.filter((lecturer) => lecturer.id !== id));
      toast.success(`Đã xóa giảng viên ${name}`);
    } catch (error) {
      console.error(error);
      toast.error('Xóa giảng viên thất bại');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Badge variant="secondary" className="mb-2 bg-primary/10 text-primary">
            Nhân sự đào tạo
          </Badge>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Quản lý giảng viên</h1>
          <p className="mt-1 text-sm text-muted-foreground">Danh sách và quản lý thông tin giảng viên</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {userRole === 'lecturer' && (
            <>
              <Button variant="outline" onClick={() => router.push('/dashboard/lecturer/enter-grades')}>
                <FileText className="h-4 w-4 mr-2" />
                Nhập điểm
              </Button>
              <Button variant="outline" onClick={() => router.push('/dashboard/lecturer/attendance')}>
                <UserCheck className="h-4 w-4 mr-2" />
                Điểm danh
              </Button>
            </>
          )}
          {userRole === 'admin' && (
            <Button onClick={() => router.push('/dashboard/admin/lecturers/create')} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Thêm giảng viên
            </Button>
          )}
        </div>
      </div>

      <Card className="border-primary/10 shadow-sm">
        <CardHeader className="border-b border-border/70">
          <CardTitle>Bộ lọc dữ liệu</CardTitle>
          <CardDescription>Tìm nhanh theo mã, họ tên hoặc trạng thái giảng viên.</CardDescription>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Tìm kiếm theo mã GV, họ tên, mã NV..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value || 'all')}>
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
          {filteredLecturers.length === 0 ? (
            <div className="flex min-h-48 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
              Chưa có dữ liệu giảng viên phù hợp.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Mã GV</TableHead>
                  <TableHead>Họ và tên</TableHead>
                  <TableHead>Mã NV</TableHead>
                  <TableHead>Khoa</TableHead>
                  <TableHead>Học vị</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  {userRole === 'admin' && <TableHead className="text-right">Thao tác</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLecturers.map((lecturer) => (
                  <TableRow key={lecturer.id}>
                    <TableCell className="font-medium">{lecturer.instructorCode}</TableCell>
                    <TableCell>{lecturer.fullName}</TableCell>
                    <TableCell>{lecturer.employeeCode}</TableCell>
                    <TableCell>{lecturer.departmentId}</TableCell>
                    <TableCell>{lecturer.degreeId}</TableCell>
                    <TableCell>
                      <Badge variant={lecturer.isActive ? 'default' : 'secondary'} className={lecturer.isActive ? '' : 'text-muted-foreground'}>
                        {lecturer.isActive ? 'Hoạt động' : 'Ngừng'}
                      </Badge>
                    </TableCell>
                    {userRole === 'admin' && (
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon-sm"
                            onClick={() => router.push(`/dashboard/admin/lecturers/${lecturer.id}/edit`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon-sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDelete(lecturer.id, lecturer.fullName || lecturer.instructorCode || 'giảng viên')}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
