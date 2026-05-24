'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { DatePicker } from '@/components/ui/date-picker';
import { Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight, RefreshCw, Save } from 'lucide-react';
import { toast } from 'sonner';
import { courseApi, courseClassApi } from '@/api/course';
import { semesterApi } from '@/api/semester';
import { roomApi } from '@/api/room';
import { unwrapApiResponse } from '@/api/response';

interface CourseClass {
  id: string;
  courseClassId?: string;
  classCode: string;
  courseId?: string;
  courseCode?: string;
  courseName: string;
  semesterId?: string;
  semesterName: string;
  roomId?: string;
  roomCode?: string;
  roomName: string;
  maxStudent: number;
  currentStudent: number;
  status: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

interface FormErrors {
  classCode?: string;
  courseId?: string;
  semesterId?: string;
  maxStudent?: string;
  currentStudent?: string;
  dateRange?: string;
}

const getCourseClassId = (item: any) => item.id || item.courseClassId || '';

const normalizeCourseClass = (item: any): CourseClass => {
  const id = getCourseClassId(item);
  const roomLabel = item.roomName || item.roomCode || 'Chưa xếp phòng';
  const courseLabel = item.courseName || item.courseCode || 'Chưa liên kết môn học';
  const semesterLabel = item.semesterName || item.semesterCode || 'Chưa liên kết học kỳ';

  return {
    ...item,
    id,
    courseClassId: item.courseClassId || id,
    classCode: item.classCode || item.code || '',
    courseName: courseLabel,
    semesterName: semesterLabel,
    roomName: roomLabel,
    maxStudent: Number(item.maxStudent ?? item.maxStudents ?? 0),
    currentStudent: Number(item.currentStudent ?? item.currentEnrollment ?? 0),
    status: item.status || (item.isActive === false ? 'INACTIVE' : 'ACTIVE'),
    isActive: item.isActive !== false,
  };
};

const normalizeList = (response: any) => {
  const unwrapped = unwrapApiResponse<any>(response);
  if (Array.isArray(unwrapped)) return unwrapped;
  if (Array.isArray(unwrapped?.content)) return unwrapped.content;
  if (Array.isArray(unwrapped?.data)) return unwrapped.data;
  if (Array.isArray(unwrapped?.data?.content)) return unwrapped.data.content;
  return [];
};

const getCourseId = (course: any) => course.id || course.courseId || '';
const getSemesterId = (semester: any) => semester.semesterId || semester.id || '';
const getRoomId = (room: any) => room.roomId || room.id || '';

export default function CourseClassesPage() {
  const [courseClasses, setCourseClasses] = useState<CourseClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSemester, setFilterSemester] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState<keyof CourseClass>('classCode');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Dialog & Form states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<CourseClass | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [fetchingLookups, setFetchingLookups] = useState(false);
  
  const [courses, setCourses] = useState<any[]>([]);
  const [semesters, setSemesters] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    classCode: '',
    courseId: '',
    semesterId: '',
    roomId: '',
    maxStudent: 50,
    currentStudent: 0,
    status: 'ACTIVE',
    startDate: '',
    endDate: '',
    isActive: true,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const fetchCourseClasses = async () => {
    setLoading(true);
    try {
      const response = await courseClassApi.getAll();
      setCourseClasses((Array.isArray(response) ? response : []).map(normalizeCourseClass));
    } catch (error) {
      console.error(error);
      toast.error('Không thể lấy danh sách lớp học phần');
      setCourseClasses([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchLookups = async () => {
    setFetchingLookups(true);
    try {
      const [courseRes, semesterRes, roomRes] = await Promise.all([
        courseApi.getAll(),
        semesterApi.getAll({ isActive: true }),
        roomApi.getAll(),
      ]);
      setCourses(normalizeList(courseRes));
      setSemesters(normalizeList(semesterRes));
      setRooms(normalizeList(roomRes));
    } catch (error) {
      console.error(error);
      toast.error('Không thể tải danh sách danh mục');
    } finally {
      setFetchingLookups(false);
    }
  };

  useEffect(() => {
    fetchCourseClasses();
    fetchLookups();
  }, []);

  const semestersList = useMemo(
    () => Array.from(new Set(courseClasses.map((item) => item.semesterName).filter(Boolean))),
    [courseClasses],
  );

  const filteredData = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    const direction = sortDirection === 'asc' ? 1 : -1;

    return courseClasses
      .filter((item) => {
        const matchesSearch =
          !search ||
          item.classCode.toLowerCase().includes(search) ||
          item.courseName.toLowerCase().includes(search) ||
          item.semesterName.toLowerCase().includes(search);
        const matchesSemester = filterSemester === 'all' || item.semesterName === filterSemester;
        return matchesSearch && matchesSemester;
      })
      .sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return (aVal - bVal) * direction;
        }
        return String(aVal ?? '').localeCompare(String(bVal ?? '')) * direction;
      });
  }, [courseClasses, filterSemester, searchTerm, sortColumn, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));
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
    const normalized = status?.toUpperCase();
    if (normalized === 'ACTIVE' || normalized === 'OPEN') {
      return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Đang mở</Badge>;
    }
    if (normalized === 'FULL') {
      return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">Đã đầy</Badge>;
    }
    return <Badge variant="secondary">Đã đóng</Badge>;
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa lớp ${name}?`)) return;

    try {
      await courseClassApi.delete(id);
      setCourseClasses((prev) => prev.filter((item) => item.id !== id));
      toast.success(`Đã xóa lớp ${name}`);
    } catch (error) {
      console.error(error);
      toast.error('Lỗi khi xóa lớp học phần');
    }
  };

  const handleOpenModal = (classItem?: CourseClass) => {
    setErrors({});
    if (classItem) {
      setEditingClass(classItem);
      setFormData({
        classCode: classItem.classCode || '',
        courseId: classItem.courseId || '',
        semesterId: classItem.semesterId || '',
        roomId: classItem.roomId || '',
        maxStudent: classItem.maxStudent ?? 50,
        currentStudent: classItem.currentStudent ?? 0,
        status: classItem.status || 'ACTIVE',
        startDate: classItem.startDate || '',
        endDate: classItem.endDate || '',
        isActive: classItem.isActive,
      });
    } else {
      setEditingClass(null);
      setFormData({
        classCode: '',
        courseId: '',
        semesterId: '',
        roomId: '',
        maxStudent: 50,
        currentStudent: 0,
        status: 'ACTIVE',
        startDate: '',
        endDate: '',
        isActive: true,
      });
    }
    setModalOpen(true);
  };

  const validate = (): boolean => {
    const nextErrors: FormErrors = {};
    if (!formData.classCode.trim()) nextErrors.classCode = 'Vui lòng nhập mã lớp';
    if (!formData.courseId) nextErrors.courseId = 'Vui lòng chọn môn học';
    if (!formData.semesterId) nextErrors.semesterId = 'Vui lòng chọn học kỳ';
    if (!Number.isFinite(formData.maxStudent) || formData.maxStudent <= 0) {
      nextErrors.maxStudent = 'Sĩ số tối đa phải lớn hơn 0';
    }
    if (formData.currentStudent < 0) {
      nextErrors.currentStudent = 'Sĩ số hiện tại không được âm';
    }
    if (formData.currentStudent > formData.maxStudent) {
      nextErrors.currentStudent = 'Sĩ số hiện tại không được vượt quá sĩ số tối đa';
    }
    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      nextErrors.dateRange = 'Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSaveLoading(true);
    try {
      const payload = {
        classCode: formData.classCode.trim().toUpperCase(),
        courseId: formData.courseId,
        semesterId: formData.semesterId,
        roomId: formData.roomId || null,
        maxStudent: Number(formData.maxStudent),
        currentStudent: Number(formData.currentStudent),
        status: formData.status,
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
        isActive: formData.isActive,
      };

      if (editingClass) {
        await courseClassApi.update(editingClass.id, payload);
        toast.success('Cập nhật lớp học phần thành công');
      } else {
        await courseClassApi.create(payload);
        toast.success('Thêm lớp học phần thành công');
      }
      setModalOpen(false);
      fetchCourseClasses();
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Thao tác thất bại');
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Quản lý lớp học phần</h1>
          <p className="text-muted-foreground">Danh sách lớp học phần theo môn học và học kỳ</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={fetchCourseClasses} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Tải lại
          </Button>
          <Button onClick={() => handleOpenModal()} className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Thêm lớp học phần
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder="Tìm theo mã lớp, môn học, học kỳ..."
                className="pl-10"
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <Select
              value={filterSemester}
              onValueChange={(value) => {
                setFilterSemester(value || 'all');
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-56">
                <SelectValue placeholder="Chọn học kỳ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả học kỳ</SelectItem>
                {semestersList.map((semester) => (
                  <SelectItem key={semester} value={semester}>
                    {semester}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="cursor-pointer px-4 py-3 text-left text-sm font-semibold hover:bg-muted/50" onClick={() => handleSort('classCode')}>Mã lớp</th>
                  <th className="cursor-pointer px-4 py-3 text-left text-sm font-semibold hover:bg-muted/50" onClick={() => handleSort('courseName')}>Môn học</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Học kỳ</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Phòng</th>
                  <th className="cursor-pointer px-4 py-3 text-left text-sm font-semibold hover:bg-muted/50" onClick={() => handleSort('currentStudent')}>Sĩ số</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Trạng thái</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-muted-foreground">Đang tải dữ liệu...</td>
                  </tr>
                ) : paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-muted-foreground">Chưa có lớp học phần phù hợp</td>
                  </tr>
                ) : (
                  paginatedData.map((item) => (
                    <tr key={item.id} className="border-b transition-colors hover:bg-muted/50">
                      <td className="px-4 py-3 text-sm font-medium">{item.classCode}</td>
                      <td className="px-4 py-3 text-sm">{item.courseName}</td>
                      <td className="px-4 py-3 text-sm">{item.semesterName}</td>
                      <td className="px-4 py-3 text-sm">{item.roomName}</td>
                      <td className="px-4 py-3 text-sm">{item.currentStudent}/{item.maxStudent}</td>
                      <td className="px-4 py-3 text-sm">{getStatusBadge(item.status)}</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleOpenModal(item)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(item.id, item.classCode)}>
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

          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">Hiển thị</span>
              <Select
                value={String(rowsPerPage)}
                onValueChange={(value) => {
                  setRowsPerPage(Number(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-muted-foreground text-sm">trên tổng {filteredData.length} bản ghi</span>
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
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingClass ? 'Chỉnh sửa lớp học phần' : 'Thêm lớp học phần mới'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 py-2">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="classCode">Mã lớp *</Label>
                <Input
                  id="classCode"
                  value={formData.classCode}
                  onChange={(event) => setFormData({ ...formData, classCode: event.target.value })}
                  className="mt-1.5"
                  placeholder="VD: INT3306-01"
                  required
                />
                {errors.classCode && <p className="mt-1 text-xs text-destructive">{errors.classCode}</p>}
              </div>

              <div>
                <Label htmlFor="maxStudent">Sĩ số tối đa *</Label>
                <Input
                  id="maxStudent"
                  type="number"
                  min={1}
                  value={formData.maxStudent}
                  onChange={(event) => setFormData({ ...formData, maxStudent: Number(event.target.value) })}
                  className="mt-1.5"
                  required
                />
                {errors.maxStudent && <p className="mt-1 text-xs text-destructive">{errors.maxStudent}</p>}
              </div>
            </div>

            {editingClass && (
              <div>
                <Label htmlFor="currentStudent">Sĩ số hiện tại *</Label>
                <Input
                  id="currentStudent"
                  type="number"
                  min={0}
                  value={formData.currentStudent}
                  onChange={(event) => setFormData({ ...formData, currentStudent: Number(event.target.value) })}
                  className="mt-1.5"
                  required
                />
                {errors.currentStudent && <p className="mt-1 text-xs text-destructive">{errors.currentStudent}</p>}
              </div>
            )}

            <div>
              <Label htmlFor="courseId">Môn học *</Label>
              <Select value={formData.courseId} onValueChange={(value) => setFormData({ ...formData, courseId: value || '' })} disabled={fetchingLookups}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder={fetchingLookups ? 'Đang tải môn học...' : 'Chọn môn học'} />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => {
                    const id = getCourseId(course);
                    return (
                      <SelectItem key={id} value={id}>
                        {course.code ? `${course.code} - ` : ''}{course.name || course.courseName || 'Chưa có tên'}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {errors.courseId && <p className="mt-1 text-xs text-destructive">{errors.courseId}</p>}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="semesterId">Học kỳ *</Label>
                <Select value={formData.semesterId} onValueChange={(value) => setFormData({ ...formData, semesterId: value || '' })} disabled={fetchingLookups}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder={fetchingLookups ? 'Đang tải học kỳ...' : 'Chọn học kỳ'} />
                  </SelectTrigger>
                  <SelectContent>
                    {semesters.map((semester) => {
                      const id = getSemesterId(semester);
                      return (
                        <SelectItem key={id} value={id}>
                          {semester.code ? `${semester.code} - ` : ''}{semester.name || 'Chưa có tên'}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                {errors.semesterId && <p className="mt-1 text-xs text-destructive">{errors.semesterId}</p>}
              </div>

              <div>
                <Label htmlFor="roomId">Phòng học</Label>
                <Select value={formData.roomId || 'none'} onValueChange={(value) => setFormData({ ...formData, roomId: !value || value === 'none' ? '' : value })} disabled={fetchingLookups}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder={fetchingLookups ? 'Đang tải phòng...' : 'Chọn phòng học'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Chưa xếp phòng</SelectItem>
                    {rooms.map((room) => {
                      const id = getRoomId(room);
                      return (
                        <SelectItem key={id} value={id}>
                          {room.code || room.roomCode || room.name || 'Chưa có tên'}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <Label htmlFor="startDate">Ngày bắt đầu</Label>
                <DatePicker
                  id="startDate"
                  value={formData.startDate}
                  onChange={(value) => setFormData({ ...formData, startDate: value })}
                  placeholder="Chọn ngày"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="endDate">Ngày kết thúc</Label>
                <DatePicker
                  id="endDate"
                  value={formData.endDate}
                  onChange={(value) => setFormData({ ...formData, endDate: value })}
                  placeholder="Chọn ngày"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="status">Trạng thái</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value || 'ACTIVE' })}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Đang mở (Active)</SelectItem>
                    <SelectItem value="FULL">Đã đầy (Full)</SelectItem>
                    <SelectItem value="INACTIVE">Đã đóng (Inactive)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {errors.dateRange && <p className="mt-1 text-xs text-destructive">{errors.dateRange}</p>}

            <div className="flex items-center justify-between pt-2">
              <Label htmlFor="isActive">Kích hoạt hoạt động</Label>
              <button
                type="button"
                id="isActive"
                onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  formData.isActive ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-800'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    formData.isActive ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                Hủy
              </Button>
              <Button type="submit" disabled={saveLoading} className="bg-primary hover:bg-primary/90">
                {saveLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Đang lưu...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Lưu
                  </span>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
