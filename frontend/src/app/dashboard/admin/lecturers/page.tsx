'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Trash2, FileText, UserCheck } from 'lucide-react';
import { toast } from 'sonner';
import { lecturerApi } from '@/api/lecturer';

// Định nghĩa type cho Lecturer
interface Lecturer {
  id: string;
  instructorCode: string;
  fullName: string;
  employeeCode: string;
  departmentId: string;
  degreeId: string;
  isActive: boolean;
}

const mockLecturers: Lecturer[] = [];

export default function LecturersPage() {
  const router = useRouter();
  const { user } = useAuth();
  const userRole = user?.role || 'admin';
  
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    async function fetchLecturers() {
      try {
        const response = await lecturerApi.getAll();
        setLecturers(response || []);
      } catch (error) {
        console.error(error);
        toast.error('Không thể lấy danh sách giảng viên');
      }
    }
    fetchLecturers();
  }, []);

  // Filter lecturers
  const filteredLecturers = lecturers.filter(lecturer => {
    const matchesSearch = lecturer.instructorCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          lecturer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          lecturer.employeeCode.toLowerCase().includes(searchTerm.toLowerCase());
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Quản lý giảng viên</h1>
          <p className="text-muted-foreground">Danh sách và quản lý thông tin giảng viên</p>
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
            <Button onClick={() => router.push('/dashboard/admin/lecturers/create')} className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Thêm giảng viên
            </Button>
          )}
        </div>
      </div>

      {/* Filter Card */}
      <Card>
        <CardHeader>
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
            <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value)}>
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left py-3 px-4 font-semibold text-sm">Mã GV</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Họ và tên</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Mã NV</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Khoa</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Học vị</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Trạng thái</th>
                  {userRole === 'admin' && <th className="text-left py-3 px-4 font-semibold text-sm">Thao tác</th>}
                </tr>
              </thead>
              <tbody>
                {filteredLecturers.map((lecturer) => (
                  <tr key={lecturer.id} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 text-sm font-medium">{lecturer.instructorCode}</td>
                    <td className="py-3 px-4 text-sm">{lecturer.fullName}</td>
                    <td className="py-3 px-4 text-sm">{lecturer.employeeCode}</td>
                    <td className="py-3 px-4 text-sm">{lecturer.departmentId}</td>
                    <td className="py-3 px-4 text-sm">{lecturer.degreeId}</td>
                    <td className="py-3 px-4 text-sm">
                      <Badge variant={lecturer.isActive ? 'default' : 'secondary'}>
                        {lecturer.isActive ? 'Hoạt động' : 'Ngừng'}
                      </Badge>
                    </td>
                    {userRole === 'admin' && (
                      <td className="py-3 px-4 text-sm">
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => router.push(`/dashboard/admin/lecturers/${lecturer.id}/edit`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDelete(lecturer.id, lecturer.fullName)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}