'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { studentApi } from '@/api/student';
import { trainingProgramApi } from '@/api/training-program';

interface Student {
  id: string;
  studentCode: string;
  personId: string;
  fullName: string;
  trainingProgramId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

// Hàm tính năm đào tạo dựa trên ngày tạo
const getTrainingYear = (createdAt: string): string => {
  const createdDate = new Date(createdAt);
  const currentDate = new Date();
  const yearDiff = currentDate.getFullYear() - createdDate.getFullYear();
  
  if (yearDiff >= 5) return 'Đã tốt nghiệp';
  if (yearDiff >= 4) return 'Sinh viên năm 5';
  if (yearDiff >= 3) return 'Sinh viên năm 4';
  if (yearDiff >= 2) return 'Sinh viên năm 3';
  if (yearDiff >= 1) return 'Sinh viên năm 2';
  return 'Sinh viên năm 1';
};

// Hàm tính thời gian còn lại (5 năm kể từ ngày tạo)
const getRemainingTime = (createdAt: string): string => {
  const createdDate = new Date(createdAt);
  const expiryDate = new Date(createdDate);
  expiryDate.setFullYear(expiryDate.getFullYear() + 5);
  const currentDate = new Date();
  
  if (currentDate > expiryDate) return 'Đã hết hạn';
  
  const diffTime = expiryDate.getTime() - currentDate.getTime();
  const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30));
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffMonths >= 12) return `${Math.floor(diffMonths / 12)} năm ${diffMonths % 12} tháng`;
  if (diffMonths >= 1) return `${diffMonths} tháng`;
  return `${diffDays} ngày`;
};

export default function StudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [programs, setPrograms] = useState<any[]>([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [studentRes, programRes]: any = await Promise.all([
        studentApi.getAll(),
        trainingProgramApi.getAll({ size: 100 })
      ]);
      
      const studentData = studentRes?.data || studentRes || [];
      setStudents(studentData);
      setPrograms(programRes.content || []);
    } catch (error) {
      toast.error('Không thể lấy dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleReactivate = async (student: Student) => {
    try {
      await studentApi.update(student.id, { isActive: true });
      toast.success(`Đã kích hoạt sinh viên ${student.fullName}`);
      await fetchData();
    } catch (error) {
      toast.error('Kích hoạt thất bại');
    }
  };

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
      await fetchData();
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
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Quản lý sinh viên</h1>
          <p className="text-gray-500 dark:text-gray-400">Danh sách sinh viên</p>
        </div>
        <Button onClick={() => router.push('/dashboard/admin/students/create')} className="bg-green-600 hover:bg-green-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Thêm sinh viên
        </Button>
      </div>

      <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm theo mã SV, họ tên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              />
            </div>
            <Select value={filterStatus} onValueChange={(val) => setFilterStatus(val || 'all')}>
              <SelectTrigger className="w-full sm:w-48 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
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
            <div className="text-center py-10 text-gray-500">
              Chưa có dữ liệu sinh viên. Hãy thêm sinh viên mới.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                      <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700 dark:text-gray-300">Mã SV</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700 dark:text-gray-300">Họ và tên</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700 dark:text-gray-300">Chương trình</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700 dark:text-gray-300">Năm học</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700 dark:text-gray-300">Thời gian còn lại</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700 dark:text-gray-300">Trạng thái</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700 dark:text-gray-300">Ngày tạo</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700 dark:text-gray-300">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedStudents.map((student) => (
                      <tr key={student.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="py-3 px-4 text-sm font-medium">{student.studentCode}</td>
                        <td className="py-3 px-4 text-sm">{student.fullName || 'Chưa cập nhật'}</td>
                        <td className="py-3 px-4 text-sm">
                          {programs.find(p => p.programId === student.trainingProgramId)?.programName || student.trainingProgramId}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                            {getTrainingYear(student.createdAt)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                            ⏳ {getRemainingTime(student.createdAt)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {student.isActive ? (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">
                              ● Hoạt động
                            </span>
                          ) : (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800">
                              ● Ngừng hoạt động
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-500 dark:text-gray-400">
                          {new Date(student.createdAt).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => router.push(`/dashboard/admin/students/${student.id}/edit`)}
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            {!student.isActive && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleReactivate(student)}
                                className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-400"
                              >
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                            )}
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDelete(student)} 
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400"
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

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Hiển thị</span>
                  <Select value={String(rowsPerPage)} onValueChange={(val) => setRowsPerPage(Number(val || 10))}>
                    <SelectTrigger className="w-20 bg-white dark:bg-gray-800">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-gray-500">
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