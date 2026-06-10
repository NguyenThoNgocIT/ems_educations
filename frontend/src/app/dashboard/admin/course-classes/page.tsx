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
import { Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight, RefreshCw, Save, Users, ArrowRightLeft, UserCheck, CalendarClock } from 'lucide-react';
import { toast } from 'sonner';
import { courseApi, courseClassApi } from '@/api/course';
import { departmentApi } from '@/api/department';
import { semesterApi } from '@/api/semester';
import { roomApi } from '@/api/room';
import { lecturerApi } from '@/api/lecturer';
import { scheduleApi } from '@/api/schedule';
import { administrativeClassApi } from '@/api/administrative-class';
import { teachingAssignmentApi, type TeachingAssignmentResponse } from '@/api/teaching-assignment';
import { studentApi } from '@/api/student';
import { unwrapApiResponse } from '@/api/response';
import type { AdministrativeClass, Department } from '@/types/lookup';
import type { StudentListItem } from '@/types/student';
import { fixMojibakeText } from '@/utils/text';

interface CourseClass {
  id: string;
  courseClassId?: string;
  classCode: string;
  courseId?: string;
  courseCode?: string;
  courseName: string;
  semesterId?: string;
  semesterCode?: string;
  semesterName: string;
  roomId?: string;
  roomCode?: string;
  roomName: string;
  credits?: number;
  theoryHours?: number;
  practiceHours?: number;
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

interface CourseClassStudent {
  courseRegistrationId?: string;
  studentId?: string;
  studentCode?: string;
  fullName?: string;
  contactEmail?: string;
  phoneNumber?: string;
  registrationType?: number;
  status?: number;
  isPaid?: boolean;
  registeredAt?: string;
}

interface ClassScheduleRow {
  scheduleId?: string;
  date?: string;
  dayOfWeek?: number;
  slotCode?: string;
  roomCode?: string;
  instructorName?: string;
  numberOfPeriods?: number;
  mode?: string;
  scheduleStatus?: string;
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
    courseCode: fixMojibakeText(item.courseCode),
    courseName: fixMojibakeText(courseLabel),
    semesterCode: item.semesterCode,
    semesterName: fixMojibakeText(semesterLabel),
    roomName: fixMojibakeText(roomLabel),
    credits: Number(item.credits ?? 0),
    theoryHours: Number(item.theoryHours ?? 0),
    practiceHours: Number(item.practiceHours ?? 0),
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
const getDepartmentId = (department: Department) => department.departmentId || department.id || '';
const getSemesterId = (semester: any) => semester.semesterId || semester.id || '';
const getRoomId = (room: any) => room.roomId || room.id || '';
const getAdminClassId = (classItem: AdministrativeClass) => classItem.classId || classItem.id || '';
const getLecturerId = (lecturer: any) => lecturer.employeeId || lecturer.id || '';

export default function CourseClassesPage() {
  const [courseClasses, setCourseClasses] = useState<CourseClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterSemester, setFilterSemester] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState<keyof CourseClass>('classCode');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedClass, setSelectedClass] = useState<CourseClass | null>(null);
  const [classStudents, setClassStudents] = useState<CourseClassStudent[]>([]);
  const [classSchedules, setClassSchedules] = useState<ClassScheduleRow[]>([]);
  const [classAssignments, setClassAssignments] = useState<TeachingAssignmentResponse[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [transferringStudent, setTransferringStudent] = useState<CourseClassStudent | null>(null);
  const [targetCourseClassId, setTargetCourseClassId] = useState('');
  const [transferLoading, setTransferLoading] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);
  const [editingAssignmentId, setEditingAssignmentId] = useState('');
  const [addStudentLoading, setAddStudentLoading] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState('');

  // Dialog & Form states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<CourseClass | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [fetchingLookups, setFetchingLookups] = useState(false);
  
  const [courses, setCourses] = useState<any[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [semesters, setSemesters] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [lecturers, setLecturers] = useState<any[]>([]);
  const [students, setStudents] = useState<StudentListItem[]>([]);
  const [administrativeClasses, setAdministrativeClasses] = useState<AdministrativeClass[]>([]);
  const [assignmentForm, setAssignmentForm] = useState({
    instructorId: '',
    classId: '',
    note: '',
  });

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
      const [courseRes, departmentRes, semesterRes, roomRes, lecturerRes, adminClassRes, studentRes] = await Promise.all([
        courseApi.getAll(),
        departmentApi.getAll({ isActive: true }),
        semesterApi.getAll({ isActive: true }),
        roomApi.getAll(),
        lecturerApi.getAll(),
        administrativeClassApi.getAll({ isActive: true }),
        studentApi.getAll(),
      ]);
      setCourses(normalizeList(courseRes));
      setDepartments(departmentRes || []);
      setSemesters(normalizeList(semesterRes));
      setRooms(normalizeList(roomRes));
      setLecturers(Array.isArray(lecturerRes) ? lecturerRes : []);
      setAdministrativeClasses(Array.isArray(adminClassRes) ? adminClassRes : []);
      setStudents(Array.isArray(studentRes) ? studentRes : []);
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

  const courseMap = useMemo(() => {
    const map = new Map<string, any>();
    courses.forEach((course) => {
      const id = getCourseId(course);
      if (id) map.set(id, course);
    });
    return map;
  }, [courses]);

  const departmentMap = useMemo(() => {
    const map = new Map<string, Department>();
    departments.forEach((department) => {
      const id = getDepartmentId(department);
      if (id) map.set(id, department);
    });
    return map;
  }, [departments]);

  const semesterMap = useMemo(() => {
    const map = new Map<string, any>();
    semesters.forEach((semester) => {
      const id = getSemesterId(semester);
      if (id) map.set(id, semester);
    });
    return map;
  }, [semesters]);

  const lecturerMap = useMemo(() => {
    const map = new Map<string, any>();
    lecturers.forEach((lecturer) => {
      const id = getLecturerId(lecturer);
      if (id) map.set(id, lecturer);
    });
    return map;
  }, [lecturers]);

  const administrativeClassMap = useMemo(() => {
    const map = new Map<string, AdministrativeClass>();
    administrativeClasses.forEach((classItem) => {
      const id = getAdminClassId(classItem);
      if (id) map.set(id, classItem);
    });
    return map;
  }, [administrativeClasses]);

  const getCourseDepartmentId = (item: CourseClass) => {
    const course = item.courseId ? courseMap.get(item.courseId) : null;
    return String(course?.departmentId || item.courseCode?.split('-')[0] || '');
  };

  const getDepartmentLabel = (item: CourseClass) => {
    const departmentId = getCourseDepartmentId(item);
    const department = departmentMap.get(departmentId);
    return fixMojibakeText([department?.code, department?.name].filter(Boolean).join(' - ') || departmentId || 'Chưa rõ khoa');
  };

  const filteredData = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    const direction = sortDirection === 'asc' ? 1 : -1;

    return courseClasses
      .filter((item) => {
        const matchesSearch =
          !search ||
          item.classCode.toLowerCase().includes(search) ||
          item.courseName.toLowerCase().includes(search) ||
          item.semesterName.toLowerCase().includes(search) ||
          getDepartmentLabel(item).toLowerCase().includes(search);
        const matchesDepartment = filterDepartment === 'all' || getCourseDepartmentId(item) === filterDepartment;
        const matchesSemester = filterSemester === 'all' || item.semesterName === filterSemester;
        return matchesSearch && matchesDepartment && matchesSemester;
      })
      .sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return (aVal - bVal) * direction;
        }
        return String(aVal ?? '').localeCompare(String(bVal ?? '')) * direction;
      });
  }, [courseClasses, courseMap, departmentMap, filterDepartment, filterSemester, searchTerm, sortColumn, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));
  const paginatedData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const transferTargets = useMemo(() => {
    if (!selectedClass) return [];
    return courseClasses.filter((item) =>
      item.id !== selectedClass.id &&
      item.courseId === selectedClass.courseId &&
      item.semesterId === selectedClass.semesterId &&
      item.isActive !== false,
    );
  }, [courseClasses, selectedClass]);

  const availableStudents = useMemo(() => {
    const selectedStudentIds = new Set(classStudents.map((student) => student.studentId).filter(Boolean));
    const selectedCourse = selectedClass?.courseId ? courseMap.get(selectedClass.courseId) : null;
    return students.filter((student) => {
      if (!student.studentId || selectedStudentIds.has(student.studentId)) return false;
      if (selectedCourse?.departmentId && student.departmentId && selectedCourse.departmentId !== student.departmentId) return false;
      return true;
    });
  }, [classStudents, courseMap, selectedClass?.courseId, students]);

  const formatDateInput = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const parseDateInput = (value?: string) => {
    if (!value) return null;
    const parsed = new Date(`${value}T00:00:00`);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  };

  const addDays = (value: string, days: number) => {
    const date = parseDateInput(value);
    if (!date) return '';
    date.setDate(date.getDate() + days);
    return formatDateInput(date);
  };

  const getCourseTotalPeriods = (courseId: string) => {
    const course = courseMap.get(courseId);
    const theoryHours = Number(course?.theoryHours ?? 0);
    const practiceHours = Number(course?.practiceHours ?? 0);
    const configuredPeriods = theoryHours + practiceHours;
    if (configuredPeriods > 0) return Math.ceil(configuredPeriods);
    return Math.max(1, Math.ceil(Number(course?.credits ?? 0) * 15));
  };

  const getPlannedDateRange = (courseId: string, semesterId: string, currentStartDate?: string) => {
    const semester = semesterMap.get(semesterId);
    const startDate = currentStartDate || semester?.startDate || '';
    if (!courseId || !startDate) return { startDate, endDate: '' };
    const weeks = Math.max(1, Math.ceil(getCourseTotalPeriods(courseId) / 3));
    let endDate = addDays(startDate, (weeks - 1) * 7);
    if (semester?.endDate && endDate && endDate > semester.endDate) {
      endDate = semester.endDate;
    }
    return { startDate, endDate };
  };

  const updateCourseClassPlanning = (updates: Partial<typeof formData>) => {
    setFormData((current) => {
      const next = { ...current, ...updates };
      const shouldRecalculate = Boolean(next.courseId && next.semesterId) && (!editingClass || updates.courseId || updates.semesterId || !next.endDate);
      if (!shouldRecalculate) return next;
      const planned = getPlannedDateRange(next.courseId, next.semesterId, next.startDate);
      return {
        ...next,
        startDate: next.startDate || planned.startDate,
        endDate: planned.endDate || next.endDate,
      };
    });
  };

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

  const getRegistrationStatus = (status?: number) => {
    if (status === 1) return 'Đã đăng ký';
    if (status === 2) return 'Đã hủy';
    if (status === 3) return 'Hoàn tất';
    return status == null ? 'Không rõ' : `Trạng thái ${status}`;
  };

  const handleSelectClass = async (item: CourseClass) => {
    setSelectedClass(item);
    setStudentsLoading(true);
    setDetailsLoading(true);
    setAssignmentForm({ instructorId: '', classId: '', note: '' });
    setEditingAssignmentId('');
    setSelectedStudentId('');
    try {
      const [rows, assignments, schedules] = await Promise.all([
        courseClassApi.getStudents(item.id),
        teachingAssignmentApi.search({ courseClassId: item.id, semesterId: item.semesterId }),
        scheduleApi.getByCourseClass(item.id),
      ]);
      setClassStudents(Array.isArray(rows) ? rows : []);
      setClassAssignments(Array.isArray(assignments) ? assignments : []);
      setClassSchedules(normalizeList(schedules));
    } catch (error) {
      console.error(error);
      toast.error('Không thể tải danh sách sinh viên của lớp học phần');
      setClassStudents([]);
      setClassAssignments([]);
      setClassSchedules([]);
    } finally {
      setStudentsLoading(false);
      setDetailsLoading(false);
    }
  };

  const refreshSelectedClassDetails = async () => {
    if (selectedClass) {
      await handleSelectClass(selectedClass);
    }
  };

  const resetAssignmentForm = () => {
    setEditingAssignmentId('');
    setAssignmentForm({ instructorId: '', classId: '', note: '' });
  };

  const handleEditAssignment = (assignment: TeachingAssignmentResponse) => {
    setEditingAssignmentId(assignment.assignmentId);
    setAssignmentForm({
      instructorId: assignment.instructorId || '',
      classId: assignment.classId || '',
      note: assignment.note || '',
    });
  };

  const handleAssignInstructor = async () => {
    if (!selectedClass) return;
    if (!assignmentForm.instructorId || !assignmentForm.classId) {
      toast.error('Vui lòng chọn giảng viên và lớp hành chính phụ trách');
      return;
    }

    setAssignLoading(true);
    try {
      const payload = {
        instructorId: assignmentForm.instructorId,
        courseClassId: selectedClass.id,
        classId: assignmentForm.classId,
        semesterId: selectedClass.semesterId || '',
        note: assignmentForm.note.trim() || undefined,
        isActive: true,
      };
      if (editingAssignmentId) {
        await teachingAssignmentApi.update(editingAssignmentId, payload);
        toast.success('Đã cập nhật phân công giảng dạy');
      } else {
        await teachingAssignmentApi.assign(payload);
        toast.success('Đã phân công giảng viên cho lớp học phần');
      }
      resetAssignmentForm();
      await refreshSelectedClassDetails();
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Phân công giảng dạy thất bại');
    } finally {
      setAssignLoading(false);
    }
  };

  const handleDeleteAssignment = async (assignment: TeachingAssignmentResponse) => {
    if (!confirm('Hủy phân công giảng viên phụ trách lớp học phần này?')) return;
    setAssignLoading(true);
    try {
      await teachingAssignmentApi.delete(assignment.assignmentId);
      toast.success('Đã hủy phân công giảng dạy');
      resetAssignmentForm();
      await refreshSelectedClassDetails();
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Hủy phân công giảng dạy thất bại');
    } finally {
      setAssignLoading(false);
    }
  };

  const handleAddStudentToCourseClass = async () => {
    if (!selectedClass) return;
    if (!selectedStudentId) {
      toast.error('Vui lòng chọn sinh viên cần thêm vào lớp học phần');
      return;
    }

    setAddStudentLoading(true);
    try {
      await courseClassApi.addStudent(selectedClass.id, {
        studentId: selectedStudentId,
        registrationType: 0,
        status: 1,
        isPaid: false,
      });
      toast.success('Đã thêm sinh viên vào lớp học phần');
      setSelectedStudentId('');
      await fetchCourseClasses();
      await refreshSelectedClassDetails();
    } catch (error: any) {
      const responseData = error.response?.data;
      console.error('Course class add student failed', { responseData, status: error.response?.status });
      toast.error(responseData?.message || responseData?.error || 'Thêm sinh viên vào lớp học phần thất bại');
    } finally {
      setAddStudentLoading(false);
    }
  };

  const openTransferModal = (student: CourseClassStudent) => {
    if (!student.courseRegistrationId) {
      toast.error('Không tìm thấy mã đăng ký học phần của sinh viên');
      return;
    }
    setTransferringStudent(student);
    setTargetCourseClassId('');
    setTransferModalOpen(true);
  };

  const handleTransferStudent = async () => {
    if (!selectedClass || !transferringStudent?.courseRegistrationId || !targetCourseClassId) {
      toast.error('Vui lòng chọn lớp học phần chuyển đến');
      return;
    }

    setTransferLoading(true);
    try {
      await courseClassApi.transferStudent(transferringStudent.courseRegistrationId, targetCourseClassId);
      toast.success('Đã chuyển sinh viên sang lớp học phần mới');
      setTransferModalOpen(false);
      await fetchCourseClasses();
      await handleSelectClass(selectedClass);
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Chuyển lớp học phần thất bại');
    } finally {
      setTransferLoading(false);
    }
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
    if (editingClass && editingClass.currentStudent > formData.maxStudent) {
      nextErrors.maxStudent = 'Sĩ số tối đa không được nhỏ hơn số sinh viên hiện có';
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

      {selectedClass && (
        <div className="grid gap-4 xl:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="flex items-center gap-2 text-xl font-bold">
                    <UserCheck className="h-5 w-5 text-primary" />
                    Phân công giảng dạy
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Chọn giảng viên phụ trách lớp học phần {selectedClass.classCode}.
                  </p>
                </div>
                <Badge variant="secondary">{classAssignments.length} phân công</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <Label>Giảng viên</Label>
                  <Select
                    value={assignmentForm.instructorId}
                    onValueChange={(value) => setAssignmentForm((prev) => ({ ...prev, instructorId: value }))}
                    disabled={fetchingLookups || assignLoading}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Chọn giảng viên" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[320px]">
                      {lecturers.map((lecturer) => {
                        const id = getLecturerId(lecturer);
                        return (
                          <SelectItem key={id} value={id}>
                            {fixMojibakeText(lecturer.fullName || lecturer.name || 'Giảng viên')} ({lecturer.instructorCode || lecturer.employeeCode || 'chưa có mã'})
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Lớp hành chính phụ trách</Label>
                  <Select
                    value={assignmentForm.classId}
                    onValueChange={(value) => setAssignmentForm((prev) => ({ ...prev, classId: value }))}
                    disabled={fetchingLookups || assignLoading}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Chọn lớp hành chính" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[320px]">
                      {administrativeClasses.map((classItem) => {
                        const id = getAdminClassId(classItem);
                        return (
                          <SelectItem key={id} value={id}>
                            {fixMojibakeText(classItem.classCode || (classItem as any).className || (classItem as any).name || id)}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Ghi chú</Label>
                <Input
                  value={assignmentForm.note}
                  onChange={(event) => setAssignmentForm((prev) => ({ ...prev, note: event.target.value }))}
                  placeholder="VD: Phụ trách lý thuyết chính"
                  className="mt-1.5"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button onClick={handleAssignInstructor} disabled={assignLoading || detailsLoading}>
                  <UserCheck className="mr-2 h-4 w-4" />
                  {assignLoading ? 'Đang lưu...' : editingAssignmentId ? 'Cập nhật phân công' : 'Lưu phân công'}
                </Button>
                {editingAssignmentId && (
                  <Button type="button" variant="outline" onClick={resetAssignmentForm} disabled={assignLoading}>
                    Hủy sửa
                  </Button>
                )}
              </div>

              <div className="rounded-lg border">
                {classAssignments.length === 0 ? (
                  <div className="p-4 text-sm text-muted-foreground">Chưa có giảng viên được phân công cho lớp học phần này.</div>
                ) : (
                  classAssignments.map((assignment) => {
                    const lecturer = lecturerMap.get(assignment.instructorId);
                    const adminClass = administrativeClassMap.get(assignment.classId);
                    return (
                      <div key={assignment.assignmentId} className="flex flex-col gap-3 border-b p-4 last:border-b-0 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="font-semibold">
                            {fixMojibakeText(lecturer?.fullName || lecturer?.name || assignment.instructorId)}
                          </p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            Lớp hành chính: {fixMojibakeText(adminClass?.classCode || (adminClass as any)?.className || (adminClass as any)?.name || assignment.classId)}
                          </p>
                          {assignment.note && <p className="mt-1 text-sm">{fixMojibakeText(assignment.note)}</p>}
                        </div>
                        <div className="flex gap-2">
                          <Button type="button" variant="outline" size="sm" onClick={() => handleEditAssignment(assignment)} disabled={assignLoading}>
                            <Edit className="mr-1 h-4 w-4" />
                            Sửa
                          </Button>
                          <Button type="button" variant="outline" size="sm" className="text-destructive" onClick={() => handleDeleteAssignment(assignment)} disabled={assignLoading}>
                            <Trash2 className="mr-1 h-4 w-4" />
                            Hủy
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="flex items-center gap-2 text-xl font-bold">
                    <CalendarClock className="h-5 w-5 text-primary" />
                    Lịch gốc của lớp học phần
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Lịch cố định được dùng làm nền; nghỉ, bù, tăng tiết sẽ đi qua yêu cầu điều chỉnh.
                  </p>
                </div>
                <Badge variant="secondary">{classSchedules.length} buổi</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {detailsLoading ? (
                <div className="py-8 text-center text-sm text-muted-foreground">Đang tải lịch gốc...</div>
              ) : classSchedules.length === 0 ? (
                <div className="rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground">
                  Chưa có lịch gốc. Vào trang Thời khóa biểu để xếp lịch cho lớp học phần này.
                </div>
              ) : (
                <div className="space-y-2">
                  {classSchedules.map((schedule) => (
                    <div key={schedule.scheduleId} className="grid gap-2 rounded-lg border p-3 text-sm md:grid-cols-[120px_1fr_120px]">
                      <div className="font-semibold">{schedule.date || `Thứ ${schedule.dayOfWeek || ''}`}</div>
                      <div>
                        <p className="font-medium">{fixMojibakeText(schedule.instructorName || 'Chưa rõ giảng viên')}</p>
                        <p className="text-muted-foreground">
                          {schedule.slotCode || 'Chưa rõ ca'} · {schedule.numberOfPeriods || 0} tiết · {schedule.mode || 'LT'}
                        </p>
                      </div>
                      <div className="text-right font-semibold text-primary">{schedule.roomCode || 'Chưa phòng'}</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_260px_220px]">
            <div className="relative flex-1">
              <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder="Tìm theo mã lớp, môn học, khoa, học kỳ..."
                className="pl-10"
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <Select
              value={filterDepartment}
              onValueChange={(value) => {
                setFilterDepartment(value || 'all');
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn khoa/đơn vị" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả khoa/đơn vị</SelectItem>
                {departments.map((department) => {
                  const id = getDepartmentId(department);
                  return (
                    <SelectItem key={id} value={id}>
                      {[department.code, department.name].filter(Boolean).join(' - ') || id}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <Select
              value={filterSemester}
              onValueChange={(value) => {
                setFilterSemester(value || 'all');
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full">
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
                  <th className="px-4 py-3 text-left text-sm font-semibold">Khoa</th>
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
                    <td colSpan={8} className="py-10 text-center text-muted-foreground">Đang tải dữ liệu...</td>
                  </tr>
                ) : paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-10 text-center text-muted-foreground">Chưa có lớp học phần phù hợp</td>
                  </tr>
                ) : (
                  paginatedData.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => handleSelectClass(item)}
                      className={`cursor-pointer border-b transition-colors hover:bg-muted/50 ${
                        selectedClass?.id === item.id ? 'bg-primary/5' : ''
                      }`}
                    >
                      <td className="px-4 py-3 text-sm font-medium">{item.classCode}</td>
                      <td className="px-4 py-3 text-sm">{getDepartmentLabel(item)}</td>
                      <td className="px-4 py-3 text-sm">{item.courseName}</td>
                      <td className="px-4 py-3 text-sm">{item.semesterName}</td>
                      <td className="px-4 py-3 text-sm">{item.roomName}</td>
                      <td className="px-4 py-3 text-sm">{item.currentStudent}/{item.maxStudent}</td>
                      <td className="px-4 py-3 text-sm">{getStatusBadge(item.status)}</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(event) => {
                              event.stopPropagation();
                              handleOpenModal(item);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive"
                            onClick={(event) => {
                              event.stopPropagation();
                              handleDelete(item.id, item.classCode);
                            }}
                          >
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

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold">Danh sách sinh viên lớp học phần</h2>
              <p className="text-sm text-muted-foreground">
                {selectedClass
                  ? `${selectedClass.classCode} - ${selectedClass.courseName}`
                  : 'Nhấn vào một lớp học phần ở bảng trên để xem sinh viên đăng ký thật.'}
              </p>
            </div>
            {selectedClass && (
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                <Users className="h-4 w-4" />
                {classStudents.length}/{selectedClass.maxStudent}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {selectedClass && (
            <div className="mb-4 grid gap-3 rounded-lg border bg-muted/30 p-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
              <div>
                <Label>Thêm sinh viên vào lớp học phần</Label>
                <Select
                  value={selectedStudentId}
                  onValueChange={setSelectedStudentId}
                  disabled={addStudentLoading || availableStudents.length === 0}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder={availableStudents.length === 0 ? 'Không còn sinh viên phù hợp' : 'Chọn sinh viên'} />
                  </SelectTrigger>
                  <SelectContent className="max-h-[320px]">
                    {availableStudents.map((student) => (
                      <SelectItem key={student.studentId} value={student.studentId}>
                        {student.studentCode || 'Chưa có mã'} - {fixMojibakeText(student.fullName || 'Sinh viên')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="mt-1 text-xs text-muted-foreground">
                  Hệ thống sẽ kiểm tra chương trình đào tạo, trùng môn, trùng lịch và sĩ số trước khi thêm.
                </p>
              </div>
              <Button onClick={handleAddStudentToCourseClass} disabled={addStudentLoading || !selectedStudentId}>
                <Users className="mr-2 h-4 w-4" />
                {addStudentLoading ? 'Đang thêm...' : 'Thêm sinh viên'}
              </Button>
            </div>
          )}
          {!selectedClass ? (
            <div className="rounded-lg border border-dashed py-10 text-center text-sm text-muted-foreground">
              Chưa chọn lớp học phần.
            </div>
          ) : studentsLoading ? (
            <div className="py-10 text-center text-sm text-muted-foreground">Đang tải danh sách sinh viên...</div>
          ) : classStudents.length === 0 ? (
            <div className="rounded-lg border border-dashed py-10 text-center text-sm text-muted-foreground">
              Lớp học phần này chưa có sinh viên đăng ký.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left text-sm font-semibold">Mã SV</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Họ tên</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">SĐT</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Trạng thái</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Thanh toán</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {classStudents.map((student) => (
                    <tr key={student.courseRegistrationId || student.studentId} className="border-b hover:bg-muted/50">
                      <td className="px-4 py-3 text-sm font-mono">{student.studentCode || '—'}</td>
                      <td className="px-4 py-3 text-sm font-medium">{student.fullName || '—'}</td>
                      <td className="px-4 py-3 text-sm">{student.contactEmail || '—'}</td>
                      <td className="px-4 py-3 text-sm">{student.phoneNumber || '—'}</td>
                      <td className="px-4 py-3 text-sm">{getRegistrationStatus(student.status)}</td>
                      <td className="px-4 py-3 text-sm">
                        {student.isPaid ? (
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Đã thanh toán</Badge>
                        ) : (
                          <Badge variant="secondary">Chưa thanh toán</Badge>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openTransferModal(student)}
                          title="Chuyển lớp học phần"
                        >
                          <ArrowRightLeft className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={transferModalOpen} onOpenChange={setTransferModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Chuyển sinh viên sang lớp học phần khác</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="rounded-lg bg-muted/50 p-3 text-sm">
              <p className="text-muted-foreground">Sinh viên</p>
              <p className="mt-1 font-semibold">
                {transferringStudent?.studentCode || '—'} - {transferringStudent?.fullName || '—'}
              </p>
              <p className="mt-2 text-muted-foreground">Lớp hiện tại</p>
              <p className="mt-1 font-semibold">
                {selectedClass?.classCode || '—'} - {selectedClass?.courseName || '—'}
              </p>
            </div>

            <div>
              <Label>Lớp học phần chuyển đến</Label>
              <Select value={targetCourseClassId} onValueChange={setTargetCourseClassId}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Chọn lớp cùng môn, cùng học kỳ" />
                </SelectTrigger>
                <SelectContent className="max-h-[320px]">
                  {transferTargets.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.classCode} - {item.currentStudent}/{item.maxStudent}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {transferTargets.length === 0 && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Chưa có lớp học phần khác cùng môn và cùng học kỳ để chuyển.
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTransferModalOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleTransferStudent} disabled={transferLoading || transferTargets.length === 0}>
              {transferLoading ? 'Đang chuyển...' : 'Chuyển lớp'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                  onChange={() => undefined}
                  className="mt-1.5"
                  disabled
                />
                <p className="mt-1 text-xs text-muted-foreground">Sĩ số được tính tự động từ danh sách sinh viên trong lớp học phần.</p>
              </div>
            )}

            <div>
              <Label htmlFor="courseId">Môn học *</Label>
              <Select value={formData.courseId} onValueChange={(value) => updateCourseClassPlanning({ courseId: value || '' })} disabled={fetchingLookups}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder={fetchingLookups ? 'Đang tải môn học...' : 'Chọn môn học'} />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => {
                    const id = getCourseId(course);
                    return (
                      <SelectItem key={id} value={id}>
                        {course.code ? `${course.code} - ` : ''}{fixMojibakeText(course.name || course.courseName || 'Chưa có tên')}
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
                <Select value={formData.semesterId} onValueChange={(value) => updateCourseClassPlanning({ semesterId: value || '' })} disabled={fetchingLookups}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder={fetchingLookups ? 'Đang tải học kỳ...' : 'Chọn học kỳ'} />
                  </SelectTrigger>
                  <SelectContent>
                    {semesters.map((semester) => {
                      const id = getSemesterId(semester);
                      return (
                        <SelectItem key={id} value={id}>
                          {semester.code ? `${semester.code} - ` : ''}{fixMojibakeText(semester.name || 'Chưa có tên')}
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
                          {fixMojibakeText(room.code || room.roomCode || room.name || 'Chưa có tên')}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <p className="mt-1 text-xs text-muted-foreground">
                  Phòng ở bước này là phòng ưu tiên. Trùng phòng theo thứ/tiết sẽ được kiểm tra khi xếp lịch gốc hoặc duyệt lịch bù.
                </p>
                {formData.roomId && (() => {
                  const room = rooms.find((item) => getRoomId(item) === formData.roomId);
                  const capacity = Number(room?.capacity ?? 0);
                  return capacity > 0 ? (
                    <p className={`mt-1 text-xs ${capacity < formData.maxStudent ? 'text-destructive' : 'text-muted-foreground'}`}>
                      Sức chứa phòng: {capacity} chỗ.
                    </p>
                  ) : null;
                })()}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <Label htmlFor="startDate">Ngày bắt đầu</Label>
                <DatePicker
                  id="startDate"
                  value={formData.startDate}
                  onChange={(value) => updateCourseClassPlanning({ startDate: value, endDate: '' })}
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
                <p className="mt-1 text-xs text-muted-foreground">
                  Tự tính theo số tiết môn học, mặc định 3 tiết/tuần; có thể chỉnh nếu kế hoạch đào tạo khác.
                </p>
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
