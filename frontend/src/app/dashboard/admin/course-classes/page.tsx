'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { courseClassApi } from '@/api/course';

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
  isActive: boolean;
}

const getCourseClassId = (item: any) => item.id || item.courseClassId || '';

const normalizeCourseClass = (item: any): CourseClass => {
  const id = getCourseClassId(item);
  const roomLabel = item.roomName || item.roomCode || item.roomId || 'Chua xep phong';
  const courseLabel = item.courseName || item.courseCode || item.courseId || 'Chua lien ket mon hoc';
  const semesterLabel = item.semesterName || item.semesterCode || item.semesterId || 'Chua lien ket hoc ky';

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

export default function CourseClassesPage() {
  const router = useRouter();
  const [courseClasses, setCourseClasses] = useState<CourseClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSemester, setFilterSemester] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState<keyof CourseClass>('classCode');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const fetchCourseClasses = async () => {
    setLoading(true);
    try {
      const response = await courseClassApi.getAll();
      setCourseClasses((Array.isArray(response) ? response : []).map(normalizeCourseClass));
    } catch (error) {
      console.error(error);
      toast.error('Khong the lay danh sach lop hoc phan');
      setCourseClasses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseClasses();
  }, []);

  const semesters = useMemo(
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
      return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Dang mo</Badge>;
    }
    if (normalized === 'FULL') {
      return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">Da day</Badge>;
    }
    return <Badge variant="secondary">Da dong</Badge>;
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Ban co chac muon xoa lop ${name}?`)) return;

    try {
      await courseClassApi.delete(id);
      setCourseClasses((prev) => prev.filter((item) => item.id !== id));
      toast.success(`Da xoa lop ${name}`);
    } catch (error) {
      console.error(error);
      toast.error('Loi khi xoa lop hoc phan');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Quan ly lop hoc phan</h1>
          <p className="text-muted-foreground">Danh sach lop hoc phan theo mon hoc va hoc ky</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={fetchCourseClasses} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Tai lai
          </Button>
          <Button onClick={() => router.push('/dashboard/admin/course-classes/create')} className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Them lop hoc phan
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder="Tim theo ma lop, mon hoc, hoc ky..."
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
                <SelectValue placeholder="Chon hoc ky" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tat ca hoc ky</SelectItem>
                {semesters.map((semester) => (
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
                  <th className="cursor-pointer px-4 py-3 text-left text-sm font-semibold hover:bg-muted/50" onClick={() => handleSort('classCode')}>Ma lop</th>
                  <th className="cursor-pointer px-4 py-3 text-left text-sm font-semibold hover:bg-muted/50" onClick={() => handleSort('courseName')}>Mon hoc</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Hoc ky</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Phong</th>
                  <th className="cursor-pointer px-4 py-3 text-left text-sm font-semibold hover:bg-muted/50" onClick={() => handleSort('currentStudent')}>Si so</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Trang thai</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Thao tac</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-muted-foreground">Dang tai du lieu...</td>
                  </tr>
                ) : paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-muted-foreground">Chua co lop hoc phan phu hop</td>
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
                          <Button variant="ghost" size="sm" onClick={() => router.push(`/dashboard/admin/course-classes/${item.id}/edit`)}>
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
              <span className="text-muted-foreground text-sm">Hien thi</span>
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
              <span className="text-muted-foreground text-sm">tren tong {filteredData.length} ban ghi</span>
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
    </div>
  );
}
