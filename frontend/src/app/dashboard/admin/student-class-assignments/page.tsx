"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, GraduationCap, Layers, Search, Trash2, UserPlus, Users } from "lucide-react";
import { toast } from "sonner";
import { request } from "@/utils/request";
import { unwrapApiResponse } from "@/api/response";
import { studentApi } from "@/api/student";
import { administrativeClassApi } from "@/api/administrative-class";
import { semesterApi } from "@/api/semester";
import { lecturerApi } from "@/api/lecturer";
import { courseClassApi } from "@/api/course";
import type { StudentListItem } from "@/types/student";
import type { AdministrativeClass } from "@/types/lookup";
import type { Semester } from "@/api/admin-resources";

type StudentClassAssignment = {
  studentClassId?: string;
  studentId?: string;
  classId?: string;
  semesterId?: string;
  note?: string;
  isActive?: boolean;
};

type CourseClass = {
  courseClassId?: string;
  id?: string;
  classCode?: string;
  code?: string;
  courseCode?: string;
  courseName?: string;
  semesterId?: string;
};

type Lecturer = {
  id?: string;
  employeeId?: string;
  instructorId?: string;
  instructorCode?: string;
  fullName?: string;
};

type CourseClassStudent = {
  studentId?: string;
  studentCode?: string;
  fullName?: string;
};

function getClassId(item: AdministrativeClass) {
  return item.classId || item.id || "";
}

function getCourseClassId(item: CourseClass) {
  return item.courseClassId || item.id || "";
}

function getLecturerId(item: Lecturer) {
  return item.instructorId || item.id || item.employeeId || "";
}

function normalizeRows<T>(response: unknown): T[] {
  const data = unwrapApiResponse<any>(response);
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

export default function StudentClassAssignmentsPage() {
  const [assignments, setAssignments] = useState<StudentClassAssignment[]>([]);
  const [students, setStudents] = useState<StudentListItem[]>([]);
  const [classesList, setClassesList] = useState<AdministrativeClass[]>([]);
  const [semestersList, setSemestersList] = useState<Semester[]>([]);
  const [courseClasses, setCourseClasses] = useState<CourseClass[]>([]);
  const [courseClassStudentIds, setCourseClassStudentIds] = useState<Set<string>>(new Set());
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSemesterId, setSelectedSemesterId] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [studentForm, setStudentForm] = useState({ studentId: "", note: "" });
  const [courseForm, setCourseForm] = useState({ courseClassId: "", instructorId: "", note: "" });
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [studentSearchTerm, setStudentSearchTerm] = useState("");
  const [selectedCourseClassIds, setSelectedCourseClassIds] = useState<string[]>([]);
  const [courseClassSearchTerm, setCourseClassSearchTerm] = useState("");
  const [teachingAssignments, setTeachingAssignments] = useState<any[]>([]);

  const selectedSemester = semestersList.find((semester) => semester.semesterId === selectedSemesterId);
  const selectedClass = classesList.find((item) => getClassId(item) === selectedClassId);

  const studentById = useMemo(() => {
    const map = new Map<string, StudentListItem>();
    students.forEach((student) => {
      if (student.id) map.set(student.id, student);
      if (student.studentId) map.set(student.studentId, student);
    });
    return map;
  }, [students]);

  const assignmentsInSemester = useMemo(
    () => assignments.filter((item) => item.semesterId === selectedSemesterId && item.isActive !== false),
    [assignments, selectedSemesterId],
  );

  const classSummaries = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    return classesList
      .map((item) => {
        const classId = getClassId(item);
        const members = assignmentsInSemester.filter((assignment) => assignment.classId === classId);
        return { ...item, classId, studentCount: members.length };
      })
      .filter((item) => {
        if (!keyword) return true;
        return [item.classCode, item.className, item.departmentName, item.majorName].some((value) =>
          String(value || "").toLowerCase().includes(keyword),
        );
      })
      .sort((a, b) => String(a.classCode || "").localeCompare(String(b.classCode || "")));
  }, [assignmentsInSemester, classesList, searchTerm]);

  const selectedMembers = useMemo(() => {
    return assignmentsInSemester
      .filter((item) => item.classId === selectedClassId)
      .map((assignment) => ({
        ...assignment,
        student: assignment.studentId ? studentById.get(assignment.studentId) : undefined,
      }))
      .sort((a, b) => String(a.student?.studentCode || "").localeCompare(String(b.student?.studentCode || "")));
  }, [assignmentsInSemester, selectedClassId, studentById]);

  const availableStudents = useMemo(() => {
    const assignedIds = new Set(assignmentsInSemester.map((item) => item.studentId).filter(Boolean));
    const hasCourseClassRoster = courseClassStudentIds.size > 0;

    return students.filter((student) => {
      const id = student.id || student.studentId;
      if (!id) return false;

      // Filter out already assigned
      if (assignedIds.has(id)) return false;

      // Filter out if not in course class roster (if roster is active)
      if (hasCourseClassRoster && !courseClassStudentIds.has(id)) return false;

      // Match selected administrative class constraints (department, major, cohort)
      if (selectedClass) {
        if (selectedClass.departmentId && student.departmentId && student.departmentId !== selectedClass.departmentId) {
          return false;
        }
        if (selectedClass.majorId && student.majorId && student.majorId !== selectedClass.majorId) {
          return false;
        }
        if (selectedClass.academicCohortId && student.academicCohortId && student.academicCohortId !== selectedClass.academicCohortId) {
          return false;
        }
      }

      return true;
    });
  }, [assignmentsInSemester, courseClassStudentIds, students, selectedClass]);

  const filteredAvailableStudents = useMemo(() => {
    const keyword = studentSearchTerm.trim().toLowerCase();
    if (!keyword) return availableStudents;
    return availableStudents.filter(
      (student) =>
        String(student.fullName || "").toLowerCase().includes(keyword) ||
        String(student.studentCode || "").toLowerCase().includes(keyword)
    );
  }, [availableStudents, studentSearchTerm]);

  const availableCourseClasses = useMemo(() => {
    return courseClasses.filter((item) => {
      const id = getCourseClassId(item);
      if (!id) return false;
      if (selectedSemesterId && item.semesterId && item.semesterId !== selectedSemesterId) {
        return false;
      }
      return true;
    });
  }, [courseClasses, selectedSemesterId]);

  const filteredAvailableCourseClasses = useMemo(() => {
    const keyword = courseClassSearchTerm.trim().toLowerCase();
    if (!keyword) return availableCourseClasses;
    return availableCourseClasses.filter((item) => {
      const nameMatch = String(item.courseName || "").toLowerCase().includes(keyword);
      const codeMatch = String(item.classCode || item.code || "").toLowerCase().includes(keyword);
      const courseCodeMatch = String(item.courseCode || "").toLowerCase().includes(keyword);
      return nameMatch || codeMatch || courseCodeMatch;
    });
  }, [availableCourseClasses, courseClassSearchTerm]);

  const totalAssigned = assignmentsInSemester.length;
  const filledClasses = classSummaries.filter((item) => item.studentCount > 0).length;

  const fetchLookups = async () => {
    setLoading(true);
    try {
      const [studentRows, classRows, semesterRows, courseClassRows, lecturerRows] = await Promise.all([
        studentApi.getAll(),
        administrativeClassApi.getAll({ isActive: true }),
        semesterApi.getAll(),
        courseClassApi.getAll(),
        lecturerApi.getAll(),
      ]);
      setStudents(studentRows || []);
      setClassesList(classRows || []);
      setSemestersList(semesterRows || []);
      setCourseClasses(courseClassRows || []);
      setLecturers(lecturerRows || []);

      const activeSemester = (semesterRows || []).find((item) => item.isActive) || semesterRows?.[0];
      if (!selectedSemesterId && activeSemester?.semesterId) {
        setSelectedSemesterId(activeSemester.semesterId);
      }
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải dữ liệu lớp, sinh viên, học kỳ");
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignments = async () => {
    try {
      const [studentClassRes, teachingRes] = await Promise.all([
        request.get("/api/v1/student-classes/admin", {
          params: { semesterId: selectedSemesterId || undefined, isActive: true },
        }),
        request.get("/api/v1/teaching-assignments/admin", {
          params: { semesterId: selectedSemesterId || undefined, isActive: true },
        }),
      ]);
      setAssignments(normalizeRows<StudentClassAssignment>(studentClassRes));
      setTeachingAssignments(normalizeRows<any>(teachingRes));
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải dữ liệu phân lớp theo học kỳ");
      setAssignments([]);
      setTeachingAssignments([]);
    }
  };

  const fetchCourseClassStudents = async () => {
    const classesInSemester = courseClasses.filter((item) => !selectedSemesterId || item.semesterId === selectedSemesterId);
    if (!selectedSemesterId || classesInSemester.length === 0) {
      setCourseClassStudentIds(new Set());
      return;
    }

    try {
      const rosters = await Promise.all(
        classesInSemester
          .map(getCourseClassId)
          .filter(Boolean)
          .map((id) => courseClassApi.getStudents(id).catch(() => [])),
      );
      const ids = new Set<string>();
      rosters.flat().forEach((student: CourseClassStudent) => {
        if (student.studentId) ids.add(student.studentId);
      });
      setCourseClassStudentIds(ids);
    } catch {
      setCourseClassStudentIds(new Set());
    }
  };

  useEffect(() => {
    fetchLookups();
  }, []);

  useEffect(() => {
    if (selectedSemesterId) fetchAssignments();
  }, [selectedSemesterId]);

  useEffect(() => {
    fetchCourseClassStudents();
  }, [courseClasses, selectedSemesterId]);

  useEffect(() => {
    if (!selectedClassId && classSummaries.length > 0) {
      setSelectedClassId(classSummaries[0].classId);
    }
  }, [classSummaries, selectedClassId]);

  const openStudentModal = () => {
    if (!selectedSemesterId || !selectedClassId) {
      toast.error("Vui lòng chọn học kỳ và lớp hành chính");
      return;
    }
    setSelectedStudentIds([]);
    setStudentSearchTerm("");
    setStudentForm({ studentId: "", note: "" });
    setStudentModalOpen(true);
  };

  const handleAssignStudent = async () => {
    if (selectedStudentIds.length === 0 || !selectedClassId || !selectedSemesterId) {
      toast.error("Vui lòng chọn ít nhất một sinh viên, lớp và học kỳ");
      return;
    }

    setSaving(true);
    
    // Call assignment for each student in parallel
    const promises = selectedStudentIds.map((studentId) =>
      request.post("/api/v1/student-classes/admin", {
        studentId,
        classId: selectedClassId,
        semesterId: selectedSemesterId,
        status: "ACTIVE",
        isActive: true,
        note: studentForm.note,
      })
    );

    try {
      const results = await Promise.allSettled(promises);
      
      const succeededCount = results.filter((r) => r.status === "fulfilled").length;
      const failedCount = results.filter((r) => r.status === "rejected").length;
      
      if (failedCount === 0) {
        toast.success(`Đã gán thành công ${succeededCount} sinh viên vào lớp hành chính`);
        setStudentModalOpen(false);
      } else {
        const errors = results
          .filter((r): r is PromiseRejectedResult => r.status === "rejected")
          .map((r) => {
            const err = r.reason;
            return err?.response?.data?.message || err?.message || "Lỗi không xác định";
          });
        const uniqueErrors = Array.from(new Set(errors));
        toast.warning(
          `Đã gán thành công ${succeededCount} sinh viên. Thất bại ${failedCount} sinh viên. Lỗi: ${uniqueErrors.join("; ")}`
        );
        
        // Retain only failed students in the selection
        const failedIds: string[] = [];
        results.forEach((res, index) => {
          if (res.status === "rejected") {
            failedIds.push(selectedStudentIds[index]);
          }
        });
        setSelectedStudentIds(failedIds);
      }
      
      fetchAssignments();
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi gán sinh viên");
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveStudent = async (assignmentId?: string) => {
    if (!assignmentId) return;
    if (!confirm("Xóa sinh viên khỏi lớp hành chính trong học kỳ này?")) return;

    try {
      await request.delete(`/api/v1/student-classes/admin/${assignmentId}`);
      toast.success("Đã xóa sinh viên khỏi lớp");
      fetchAssignments();
    } catch {
      toast.error("Xóa sinh viên khỏi lớp thất bại");
    }
  };

  const openCourseModal = () => {
    if (!selectedSemesterId || !selectedClassId) {
      toast.error("Vui lòng chọn học kỳ và lớp hành chính");
      return;
    }
    setSelectedCourseClassIds([]);
    setCourseClassSearchTerm("");
    setCourseForm({ courseClassId: "", instructorId: "", note: "" });
    setCourseModalOpen(true);
  };

  const handleAssignCourseClass = async () => {
    if (selectedCourseClassIds.length === 0 || !courseForm.instructorId || !selectedClassId || !selectedSemesterId) {
      toast.error("Vui lòng chọn ít nhất một lớp học phần và giảng viên");
      return;
    }

    const selectedLecturerId = courseForm.instructorId;
    const isAssignedToOtherClass = teachingAssignments.some(
      (ta) =>
        ta.instructorId === selectedLecturerId &&
        ta.classId !== selectedClassId &&
        ta.isActive !== false
    );
    if (isAssignedToOtherClass) {
      toast.error("Giảng viên đã được phân công phụ trách lớp hành chính khác trong học kỳ này");
      return;
    }

    setSaving(true);
    
    const promises = selectedCourseClassIds.map((courseClassId) =>
      request.post("/api/v1/teaching-assignments/admin", {
        instructorId: courseForm.instructorId,
        courseClassId,
        classId: selectedClassId,
        semesterId: selectedSemesterId,
        isActive: true,
        note: courseForm.note,
      })
    );

    try {
      const results = await Promise.allSettled(promises);
      
      const succeededCount = results.filter((r) => r.status === "fulfilled").length;
      const failedCount = results.filter((r) => r.status === "rejected").length;
      
      if (failedCount === 0) {
        toast.success(`Đã gán thành công ${succeededCount} lớp học phần cho giảng viên`);
        setCourseModalOpen(false);
      } else {
        const errors = results
          .filter((r): r is PromiseRejectedResult => r.status === "rejected")
          .map((r) => {
            const err = r.reason;
            return err?.response?.data?.message || err?.message || "Lỗi không xác định";
          });
        const uniqueErrors = Array.from(new Set(errors));
        toast.warning(
          `Đã gán thành công ${succeededCount} lớp học phần. Thất bại ${failedCount} lớp. Lỗi: ${uniqueErrors.join("; ")}`
        );
        
        // Retain only failed course classes in the selection
        const failedIds: string[] = [];
        results.forEach((res, index) => {
          if (res.status === "rejected") {
            failedIds.push(selectedCourseClassIds[index]);
          }
        });
        setSelectedCourseClassIds(failedIds);
      }
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi gán lớp học phần");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Phân lớp theo học kỳ</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sinh viên ban đầu nằm trong lớp học phần theo môn và học kỳ. Sau khi chọn hướng học, dùng màn này để chuyển/gán sang lớp hành chính.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="min-w-[240px]">
            <Label>Học kỳ</Label>
            <Select
              value={selectedSemesterId}
              onValueChange={(value) => {
                setSelectedSemesterId(value);
                setSelectedClassId("");
              }}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Chọn học kỳ">
                  {selectedSemester ? (selectedSemester.name || selectedSemester.code) : "Chọn học kỳ"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {semestersList.filter((semester) => semester.semesterId).map((semester) => (
                  <SelectItem key={semester.semesterId} value={semester.semesterId || ""}>
                    {semester.name || semester.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={openStudentModal} className="mt-auto">
            <UserPlus className="mr-2 h-4 w-4" />
            Gán sinh viên
          </Button>
          <Button onClick={openCourseModal} variant="outline" className="mt-auto">
            <BookOpen className="mr-2 h-4 w-4" />
            Gán lớp học phần
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Học kỳ đang xem</p>
            <GraduationCap className="h-5 w-5 text-primary" />
          </div>
          <p className="mt-3 text-2xl font-bold">{selectedSemester?.name || "Chưa chọn"}</p>
        </div>
        <div className="rounded-lg border bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Lớp có sinh viên</p>
            <Layers className="h-5 w-5 text-primary" />
          </div>
          <p className="mt-3 text-2xl font-bold">
            {filledClasses}/{classesList.length}
          </p>
        </div>
        <div className="rounded-lg border bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Sinh viên từ lớp học phần</p>
            <Users className="h-5 w-5 text-primary" />
          </div>
          <p className="mt-3 text-2xl font-bold">{courseClassStudentIds.size}</p>
          <p className="mt-1 text-xs text-muted-foreground">{totalAssigned} đã gán lớp hành chính</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <section className="rounded-lg border bg-card">
          <div className="border-b p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Tìm lớp hành chính, khoa, ngành..."
                className="pl-10"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="px-4 py-3 text-left font-semibold">Lớp hành chính</th>
                  <th className="px-4 py-3 text-left font-semibold">Khoa / đơn vị</th>
                  <th className="px-4 py-3 text-left font-semibold">Ngành</th>
                  <th className="px-4 py-3 text-center font-semibold">Sĩ số</th>
                  <th className="px-4 py-3 text-left font-semibold">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {classSummaries.map((item) => (
                  <tr
                    key={item.classId}
                    onClick={() => setSelectedClassId(item.classId)}
                    className={`cursor-pointer border-b transition hover:bg-muted/50 ${
                      selectedClassId === item.classId ? "bg-primary/5" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <p className="font-semibold">{item.classCode || "—"}</p>
                      <p className="text-xs text-muted-foreground">{item.className || "Chưa có tên lớp"}</p>
                    </td>
                    <td className="px-4 py-3">{item.departmentName || "—"}</td>
                    <td className="px-4 py-3">{item.majorName || "—"}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        {item.studentCount}/{item.maxSize || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {item.isActive === false ? (
                        <span className="text-xs text-muted-foreground">Ngừng hoạt động</span>
                      ) : (
                        <span className="text-xs font-medium text-emerald-700">Đang mở</span>
                      )}
                    </td>
                  </tr>
                ))}
                {classSummaries.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                      Không tìm thấy lớp hành chính phù hợp.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="rounded-lg border bg-card">
          <div className="border-b p-4">
            <p className="text-sm text-muted-foreground">Danh sách sinh viên trong lớp</p>
            <h2 className="mt-1 text-xl font-bold">{selectedClass?.classCode || "Chọn lớp"}</h2>
            <p className="text-sm text-muted-foreground">
              {selectedClass?.className || "Chọn một lớp ở bảng bên trái để quản lý."}
            </p>
          </div>
          <div className="max-h-[620px] overflow-y-auto p-4">
            {selectedMembers.length === 0 ? (
              <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                Lớp này chưa có sinh viên trong học kỳ đã chọn.
              </div>
            ) : (
              <div className="space-y-3">
                {selectedMembers.map((item) => (
                  <div key={item.studentClassId} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{item.student?.fullName || "Chưa lấy được tên"}</p>
                      <p className="text-xs text-muted-foreground">{item.student?.studentCode || item.studentId}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={() => handleRemoveStudent(item.studentClassId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>

      <Dialog open={studentModalOpen} onOpenChange={setStudentModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Gán sinh viên vào lớp hành chính</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-muted-foreground">Học kỳ</p>
                <p className="font-semibold">{selectedSemester?.name || "—"}</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-muted-foreground">Lớp</p>
                <p className="font-semibold">{selectedClass?.classCode || "—"}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label>Tìm kiếm sinh viên chưa gán lớp hành chính</Label>
                <Input
                  value={studentSearchTerm}
                  onChange={(event) => setStudentSearchTerm(event.target.value)}
                  placeholder="Tìm theo mã sinh viên, họ tên..."
                  className="mt-1"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold">
                    Danh sách sinh viên ({filteredAvailableStudents.length} sinh viên)
                  </Label>
                  {filteredAvailableStudents.length > 0 && (
                    <Button
                      type="button"
                      variant="link"
                      className="h-auto p-0 text-xs text-primary hover:no-underline"
                      onClick={() => {
                        const allIds = filteredAvailableStudents
                          .map((s) => s.id || s.studentId)
                          .filter(Boolean) as string[];
                        const allSelected = allIds.every((id) => selectedStudentIds.includes(id));
                        if (allSelected) {
                          setSelectedStudentIds((prev) => prev.filter((id) => !allIds.includes(id)));
                        } else {
                          setSelectedStudentIds((prev) => Array.from(new Set([...prev, ...allIds])));
                        }
                      }}
                    >
                      {filteredAvailableStudents
                        .map((s) => s.id || s.studentId)
                        .filter(Boolean)
                        .every((id) => selectedStudentIds.includes(id as string))
                        ? "Bỏ chọn tất cả"
                        : "Chọn tất cả"}
                    </Button>
                  )}
                </div>

                <div className="max-h-[280px] overflow-y-auto rounded-md border p-2 space-y-1 bg-background">
                  {filteredAvailableStudents.map((student) => {
                    const sId = student.id || student.studentId || "";
                    const isChecked = selectedStudentIds.includes(sId);
                    return (
                      <label
                        key={sId}
                        className="flex items-center gap-3 rounded px-2 py-1.5 hover:bg-muted/50 cursor-pointer text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            setSelectedStudentIds((prev) =>
                              isChecked ? prev.filter((id) => id !== sId) : [...prev, sId]
                            );
                          }}
                          className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-600 cursor-pointer w-4 h-4"
                        />
                        <span className="font-mono text-xs font-semibold bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                          {student.studentCode}
                        </span>
                        <span className="font-medium">{student.fullName}</span>
                      </label>
                    );
                  })}
                  {filteredAvailableStudents.length === 0 && (
                    <p className="text-center py-8 text-sm text-muted-foreground">
                      Không tìm thấy sinh viên nào phù hợp hoặc chưa gán lớp hành chính
                    </p>
                  )}
                </div>
                
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>Đã chọn: <strong className="text-foreground">{selectedStudentIds.length}</strong> sinh viên</span>
                </div>
              </div>
            </div>
            <div>
              <Label>Ghi chú</Label>
              <Textarea value={studentForm.note} onChange={(event) => setStudentForm({ ...studentForm, note: event.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStudentModalOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleAssignStudent} disabled={saving}>
              Lưu phân lớp
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={courseModalOpen} onOpenChange={setCourseModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Gán lớp học phần và giảng viên</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-4">
              <div>
                <Label>Tìm kiếm lớp học phần</Label>
                <Input
                  value={courseClassSearchTerm}
                  onChange={(event) => setCourseClassSearchTerm(event.target.value)}
                  placeholder="Tìm theo mã lớp, mã môn, tên môn..."
                  className="mt-1"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold">
                    Danh sách lớp học phần ({filteredAvailableCourseClasses.length} lớp)
                  </Label>
                  {filteredAvailableCourseClasses.length > 0 && (
                    <Button
                      type="button"
                      variant="link"
                      className="h-auto p-0 text-xs text-primary hover:no-underline"
                      onClick={() => {
                        const allIds = filteredAvailableCourseClasses
                          .map(getCourseClassId)
                          .filter(Boolean) as string[];
                        const allSelected = allIds.every((id) => selectedCourseClassIds.includes(id));
                        if (allSelected) {
                          setSelectedCourseClassIds((prev) => prev.filter((id) => !allIds.includes(id)));
                        } else {
                          setSelectedCourseClassIds((prev) => Array.from(new Set([...prev, ...allIds])));
                        }
                      }}
                    >
                      {filteredAvailableCourseClasses
                        .map(getCourseClassId)
                        .filter(Boolean)
                        .every((id) => selectedCourseClassIds.includes(id as string))
                        ? "Bỏ chọn tất cả"
                        : "Chọn tất cả"}
                    </Button>
                  )}
                </div>

                <div className="max-h-[200px] overflow-y-auto rounded-md border p-2 space-y-1 bg-background">
                  {filteredAvailableCourseClasses.map((item) => {
                    const cId = getCourseClassId(item);
                    const isChecked = selectedCourseClassIds.includes(cId);
                    return (
                      <label
                        key={cId}
                        className="flex items-center gap-3 rounded px-2 py-1.5 hover:bg-muted/50 cursor-pointer text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            setSelectedCourseClassIds((prev) =>
                              isChecked ? prev.filter((id) => id !== cId) : [...prev, cId]
                            );
                          }}
                          className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-600 cursor-pointer w-4 h-4"
                        />
                        <span className="font-mono text-xs font-semibold bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                          {item.classCode || item.code}
                        </span>
                        <span className="font-medium">{item.courseName}</span>
                      </label>
                    );
                  })}
                  {filteredAvailableCourseClasses.length === 0 && (
                    <p className="text-center py-6 text-sm text-muted-foreground">
                      Không tìm thấy lớp học phần phù hợp
                    </p>
                  )}
                </div>
                
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>Đã chọn: <strong className="text-foreground">{selectedCourseClassIds.length}</strong> lớp học phần</span>
                </div>
              </div>
            </div>
            <div>
              <Label>Giảng viên phụ trách</Label>
              <Select value={courseForm.instructorId} onValueChange={(value) => setCourseForm({ ...courseForm, instructorId: value })}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Chọn giảng viên">
                    {courseForm.instructorId
                      ? (() => {
                          const item = lecturers.find((l) => getLecturerId(l) === courseForm.instructorId);
                          return item ? `${item.instructorCode || "GV"} - ${item.fullName}` : "Chọn giảng viên";
                        })()
                      : "Chọn giảng viên"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="max-h-[320px]">
                  {lecturers
                    .filter((lecturer) => getLecturerId(lecturer))
                    .map((lecturer) => {
                      const lId = getLecturerId(lecturer);
                      const isAssignedToOtherClass = teachingAssignments.some(
                        (ta) =>
                          ta.instructorId === lId &&
                          ta.classId !== selectedClassId &&
                          ta.isActive !== false
                      );
                      return (
                        <SelectItem
                          key={lId}
                          value={lId}
                          disabled={isAssignedToOtherClass}
                        >
                          {lecturer.instructorCode || "GV"} - {lecturer.fullName}
                          {isAssignedToOtherClass ? " (Đã phụ trách lớp khác)" : ""}
                        </SelectItem>
                      );
                    })}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Ghi chú</Label>
              <Textarea value={courseForm.note} onChange={(event) => setCourseForm({ ...courseForm, note: event.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCourseModalOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleAssignCourseClass} disabled={saving}>
              Lưu phân công
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
