"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { request } from '@/utils/request';
import { unwrapApiResponse } from '@/api/response';
import { studentApi } from '@/api/student';
import { administrativeClassApi } from '@/api/administrative-class';
import { semesterApi } from '@/api/semester';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { StudentListItem } from '@/types/student';
import type { AdministrativeClass } from '@/types/lookup';
import type { Semester } from '@/api/admin-resources';

type StudentClassAssignment = {
  studentClassId?: string;
  studentId?: string;
  studentName?: string;
  studentCode?: string;
  classId?: string;
  className?: string;
  classCode?: string;
  semesterId?: string;
  semesterName?: string;
  academicYear?: string;
  isActive?: boolean;
  enrolledAt?: string;
  note?: string;
  roleInClass?: string;
  status?: string;
};

// Cache để tránh gọi API nhiều lần
const studentCache = new Map();
const classCache = new Map();
const semesterCache = new Map();

export default function StudentClassAssignmentsPage() {
  const [assignments, setAssignments] = useState<StudentClassAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StudentClassAssignment | null>(null);
  const [formData, setFormData] = useState({
    studentId: '',
    classId: '',
    semesterId: '',
    note: '',
    isActive: true,
  });

  const [students, setStudents] = useState<StudentListItem[]>([]);
  const [classesList, setClassesList] = useState<AdministrativeClass[]>([]);
  const [semestersList, setSemestersList] = useState<Semester[]>([]);
  const [fetchingLookups, setFetchingLookups] = useState(false);

  const fetchLookups = async () => {
    setFetchingLookups(true);
    try {
      const [studentsRes, classesRes, semestersRes] = await Promise.all([
        studentApi.getAll(),
        administrativeClassApi.getAll(),
        semesterApi.getAll()
      ]);
      setStudents(studentsRes || []);
      setClassesList(classesRes || []);
      setSemestersList(semestersRes || []);
    } catch (error) {
      console.error('Failed to fetch lookups', error);
    } finally {
      setFetchingLookups(false);
    }
  };

  useEffect(() => {
    fetchLookups();
  }, []);

  // Lấy thông tin sinh viên theo ID
  const fetchStudentInfo = async (studentId: string) => {
    if (studentCache.has(studentId)) return studentCache.get(studentId);
    try {
      const response = await request.get(`/api/v1/students/admin/${studentId}`);
      const data = unwrapApiResponse<any>(response);
      const info = { studentName: data.fullName, studentCode: data.studentCode };
      studentCache.set(studentId, info);
      return info;
    } catch {
      return { studentName: 'Chưa lấy được thông tin sinh viên', studentCode: '—' };
    }
  };

  // Lấy thông tin lớp theo ID
  const fetchClassInfo = async (classId: string) => {
    if (classCache.has(classId)) return classCache.get(classId);
    try {
      const response = await request.get(`/api/v1/classes/admin/${classId}`);
      const data = unwrapApiResponse<any>(response);
      const info = { className: data.className, classCode: data.classCode };
      classCache.set(classId, info);
      return info;
    } catch {
      return { className: 'Chưa lấy được thông tin lớp', classCode: '—' };
    }
  };

  // Lấy thông tin học kỳ theo ID
  const fetchSemesterInfo = async (semesterId: string) => {
    if (semesterCache.has(semesterId)) return semesterCache.get(semesterId);
    try {
      const response = await request.get(`/api/v1/semesters/admin/${semesterId}`);
      const data = unwrapApiResponse<any>(response);
      const info = { semesterName: data.name, academicYear: data.schoolYearName || data.schoolYearCode || '—' };
      semesterCache.set(semesterId, info);
      return info;
    } catch {
      return { semesterName: 'Chưa lấy được thông tin học kỳ', academicYear: '—' };
    }
  };

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const response = await request.get('/api/v1/student-classes/admin', {
        params: { keyword: searchTerm || undefined }
      });
      const data = unwrapApiResponse<any>(response);
      let rows = [];
      if (Array.isArray(data)) rows = data;
      else if (Array.isArray(data?.content)) rows = data.content;
      else if (Array.isArray(data?.data)) rows = data.data;
      else rows = [];

      // Enrich dữ liệu: thêm tên từ các API khác
      const enrichedRows = await Promise.all(
        rows.map(async (item: any) => {
          const [studentInfo, classInfo, semesterInfo] = await Promise.all([
            fetchStudentInfo(item.studentId),
            fetchClassInfo(item.classId),
            fetchSemesterInfo(item.semesterId)
          ]);
          return {
            ...item,
            studentName: studentInfo.studentName,
            studentCode: studentInfo.studentCode,
            className: classInfo.className,
            classCode: classInfo.classCode,
            semesterName: semesterInfo.semesterName,
            academicYear: semesterInfo.academicYear,
          };
        })
      );

      setAssignments(enrichedRows);
    } catch (error: any) {
      console.error('Fetch error:', error);
      toast.error(error.response?.data?.message || 'Không thể tải danh sách');
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [searchTerm]);

  const filteredItems = assignments.filter(item =>
    item.studentCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.classCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.className?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredItems.length / rowsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const openCreateDialog = () => {
    setEditingItem(null);
    setFormData({ studentId: '', classId: '', semesterId: '', note: '', isActive: true });
    setModalOpen(true);
  };

  const openEditDialog = (item: StudentClassAssignment) => {
    setEditingItem(item);
    setFormData({
      studentId: item.studentId || '',
      classId: item.classId || '',
      semesterId: item.semesterId || '',
      note: item.note || '',
      isActive: item.isActive ?? true,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.studentId || !formData.classId || !formData.semesterId) {
      toast.error('Vui lòng điền đầy đủ ID sinh viên, ID lớp và ID học kỳ');
      return;
    }

    try {
      if (editingItem) {
        await request.put(`/api/v1/student-classes/admin/${editingItem.studentClassId}`, formData);
        toast.success('Cập nhật thành công');
      } else {
        await request.post('/api/v1/student-classes/admin', formData);
        toast.success('Thêm phân công thành công');
      }
      setModalOpen(false);
      // Clear cache để refresh dữ liệu mới
      studentCache.clear();
      classCache.clear();
      semesterCache.clear();
      fetchAssignments();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Thao tác thất bại');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc muốn xóa phân công này?')) {
      try {
        await request.delete(`/api/v1/student-classes/admin/${id}`);
        toast.success('Xóa thành công');
        fetchAssignments();
      } catch (error) {
        toast.error('Xóa thất bại');
      }
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success(`Đã copy ${type} ID: ${text.substring(0, 8)}...`);
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
          <h1 className="text-3xl font-bold mb-2">Phân công sinh viên theo lớp và học kỳ</h1>
          <p className="text-muted-foreground">Quản lý việc gán sinh viên vào lớp hành chính theo từng học kỳ</p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm phân công
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo MSSV, tên sinh viên, tên lớp..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left text-sm font-semibold">ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">MSSV</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Họ tên</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Mã lớp</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Tên lớp</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Học kỳ</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Trạng thái</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {paginatedItems.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-muted-foreground">
                      Chưa có dữ liệu phân công. Hãy thêm mới.
                    </td>
                  </tr>
                ) : (
                  paginatedItems.map((item) => (
                    <tr key={item.studentClassId} className="border-b hover:bg-muted/50">
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs">{item.studentClassId?.substring(0, 8)}...</span>
                          <button
                            onClick={() => copyToClipboard(item.studentClassId!, 'Phân công')}
                            className="text-blue-500 hover:text-blue-700"
                            title="Copy ID"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                        </div>
                       </td>
                      <td className="px-4 py-3 text-sm font-mono text-xs">{item.studentCode || '—'}</td>
                      <td className="px-4 py-3 text-sm">{item.studentName || '—'}</td>
                      <td className="px-4 py-3 text-sm font-medium">{item.classCode || '—'}</td>
                      <td className="px-4 py-3 text-sm">{item.className || '—'}</td>
                      <td className="px-4 py-3 text-sm">{item.semesterName || '—'}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          item.isActive 
                            ? "bg-green-100 text-green-800" 
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {item.isActive ? "Đang theo học" : "Đã kết thúc"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => openEditDialog(item)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(item.studentClassId!)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Hiển thị</span>
              <select
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(Number(e.target.value))}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span className="text-sm text-muted-foreground">trên tổng {filteredItems.length} bản ghi</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">Trang {currentPage} / {totalPages || 1}</span>
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialog Thêm/Sửa */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Chỉnh sửa phân công' : 'Thêm phân công mới'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {editingItem && (
              <div>
                <Label>ID phân công</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input value={editingItem.studentClassId || ''} disabled className="bg-gray-100 font-mono text-sm flex-1" />
                  <Button type="button" size="sm" variant="outline" onClick={() => copyToClipboard(editingItem.studentClassId!, 'Phân công')}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
            <div>
              <Label>Sinh viên *</Label>
              <Select 
                value={formData.studentId} 
                onValueChange={(val) => setFormData({ ...formData, studentId: val })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Chọn sinh viên" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {students.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.studentCode} - {s.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Lớp hành chính *</Label>
              <Select 
                value={formData.classId} 
                onValueChange={(val) => setFormData({ ...formData, classId: val })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Chọn lớp" />
                </SelectTrigger>
                <SelectContent>
                  {classesList.map((c) => (
                    <SelectItem key={c.classId || (c as any).id} value={c.classId || (c as any).id}>
                      {c.classCode} - {c.className}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Học kỳ *</Label>
              <Select 
                value={formData.semesterId} 
                onValueChange={(val) => setFormData({ ...formData, semesterId: val })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Chọn học kỳ" />
                </SelectTrigger>
                <SelectContent>
                  {semestersList.map((s) => (
                    <SelectItem key={s.semesterId} value={s.semesterId}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Ghi chú</Label>
              <Textarea 
                value={formData.note} 
                onChange={(e) => setFormData({ ...formData, note: e.target.value })} 
                rows={3}
              />
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="isActive" 
                checked={formData.isActive} 
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} 
                className="w-4 h-4"
              />
              <Label htmlFor="isActive" className="cursor-pointer">Đang hoạt động</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Hủy</Button>
            <Button onClick={handleSave}>Lưu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
