"use client";

import React, { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, History, Layers, Search, Trash2, UserRoundCheck, Users } from "lucide-react";
import { toast } from "sonner";
import { request } from "@/utils/request";
import { clearCache } from "@/utils/cache";
import { unwrapApiResponse } from "@/api/response";
import { studentApi } from "@/api/student";
import { administrativeClassApi } from "@/api/administrative-class";
import { semesterApi } from "@/api/semester";
import type { StudentListItem } from "@/types/student";
import type { AdministrativeClass } from "@/types/lookup";
import type { Semester } from "@/api/admin-resources";

type StudentClassAssignment = {
  studentClassId?: string;
  studentId?: string;
  classId?: string;
  semesterId?: string;
  roleInClass?: string;
  status?: string;
  note?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

function getClassId(item: AdministrativeClass) {
  return item.classId || item.id || "";
}

function normalizeRows<T>(response: unknown): T[] {
  const data = unwrapApiResponse<any>(response);
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

function formatDate(value?: string) {
  if (!value) return "Chưa cập nhật";
  return new Date(value).toLocaleDateString("vi-VN");
}

function StudentClassAssignmentsContent() {
  const searchParams = useSearchParams();
  const initialClassId = searchParams.get("classId") || "";
  const [assignments, setAssignments] = useState<StudentClassAssignment[]>([]);
  const [students, setStudents] = useState<StudentListItem[]>([]);
  const [classesList, setClassesList] = useState<AdministrativeClass[]>([]);
  const [semestersList, setSemestersList] = useState<Semester[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSemesterId, setSelectedSemesterId] = useState("");
  const [selectedClassId, setSelectedClassId] = useState(initialClassId);
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [studentSearchTerm, setStudentSearchTerm] = useState("");
  const [transferNote, setTransferNote] = useState("");

  const selectedSemester = semestersList.find((semester) => semester.semesterId === selectedSemesterId);
  const selectedClass = classesList.find((item) => getClassId(item) === selectedClassId);

  const classById = useMemo(() => {
    const map = new Map<string, AdministrativeClass>();
    classesList.forEach((item) => {
      const id = getClassId(item);
      if (id) map.set(id, item);
    });
    return map;
  }, [classesList]);

  const studentById = useMemo(() => {
    const map = new Map<string, StudentListItem>();
    students.forEach((student) => {
      if (student.id) map.set(student.id, student);
      if (student.studentId) map.set(student.studentId, student);
    });
    return map;
  }, [students]);

  const assignmentsInSemester = useMemo(
    () => assignments.filter((item) => item.semesterId === selectedSemesterId),
    [assignments, selectedSemesterId],
  );

  const activeAssignmentsInSemester = useMemo(
    () => assignmentsInSemester.filter((item) => item.isActive !== false),
    [assignmentsInSemester],
  );

  const activeAssignmentByStudentId = useMemo(() => {
    const map = new Map<string, StudentClassAssignment>();
    activeAssignmentsInSemester.forEach((item) => {
      if (item.studentId) map.set(item.studentId, item);
    });
    return map;
  }, [activeAssignmentsInSemester]);

  const classSummaries = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    return classesList
      .map((item) => {
        const classId = getClassId(item);
        const members = activeAssignmentsInSemester.filter((assignment) => assignment.classId === classId);
        return { ...item, classId, studentCount: members.length };
      })
      .filter((item) => {
        if (!keyword) return true;
        return [item.classCode, item.className, item.departmentName, item.majorName, item.academicCohortName].some((value) =>
          String(value || "").toLowerCase().includes(keyword),
        );
      })
      .sort((a, b) => String(a.classCode || "").localeCompare(String(b.classCode || "")));
  }, [activeAssignmentsInSemester, classesList, searchTerm]);

  const selectedMembers = useMemo(() => {
    return activeAssignmentsInSemester
      .filter((item) => item.classId === selectedClassId)
      .map((assignment) => ({
        ...assignment,
        student: assignment.studentId ? studentById.get(assignment.studentId) : undefined,
      }))
      .sort((a, b) => String(a.student?.studentCode || "").localeCompare(String(b.student?.studentCode || "")));
  }, [activeAssignmentsInSemester, selectedClassId, studentById]);

  const selectedHistory = useMemo(() => {
    return assignmentsInSemester
      .filter((item) => item.classId === selectedClassId)
      .map((assignment) => ({
        ...assignment,
        student: assignment.studentId ? studentById.get(assignment.studentId) : undefined,
      }))
      .sort((a, b) => String(b.updatedAt || b.createdAt || "").localeCompare(String(a.updatedAt || a.createdAt || "")));
  }, [assignmentsInSemester, selectedClassId, studentById]);

  const availableStudents = useMemo(() => {
    return students.filter((student) => {
      const id = student.id || student.studentId;
      if (!id || !selectedClass) return false;

      const activeAssignment = activeAssignmentByStudentId.get(id);
      if (activeAssignment?.classId === selectedClassId) return false;

      if (selectedClass.departmentId && student.departmentId && student.departmentId !== selectedClass.departmentId) {
        return false;
      }
      if (selectedClass.majorId && student.majorId && student.majorId !== selectedClass.majorId) {
        return false;
      }
      if (selectedClass.academicCohortId && student.academicCohortId && student.academicCohortId !== selectedClass.academicCohortId) {
        return false;
      }

      return true;
    });
  }, [students, selectedClass, selectedClassId, activeAssignmentByStudentId]);

  const filteredAvailableStudents = useMemo(() => {
    const keyword = studentSearchTerm.trim().toLowerCase();
    if (!keyword) return availableStudents;
    return availableStudents.filter(
      (student) =>
        String(student.fullName || "").toLowerCase().includes(keyword) ||
        String(student.studentCode || "").toLowerCase().includes(keyword),
    );
  }, [availableStudents, studentSearchTerm]);

  const totalAssigned = activeAssignmentsInSemester.length;
  const filledClasses = classSummaries.filter((item) => item.studentCount > 0).length;

  const fetchLookups = async () => {
    setLoading(true);
    try {
      const [studentRows, classRows, semesterRows] = await Promise.all([
        studentApi.getAll(),
        administrativeClassApi.getAll({ isActive: true }),
        semesterApi.getAll(),
      ]);
      setStudents(studentRows || []);
      setClassesList(classRows || []);
      setSemestersList(semesterRows || []);

      const activeSemester = (semesterRows || []).find((item) => item.status || item.isActive) || semesterRows?.[0];
      if (!selectedSemesterId && activeSemester?.semesterId) {
        setSelectedSemesterId(activeSemester.semesterId);
      }
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải dữ liệu sinh viên, lớp hành chính và học kỳ");
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignments = async () => {
    if (!selectedSemesterId) return;
    try {
      const response = await request.get("/api/v1/student-classes/admin", {
        params: { semesterId: selectedSemesterId },
      });
      setAssignments(normalizeRows<StudentClassAssignment>(response));
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải lịch sử lớp hành chính theo học kỳ");
      setAssignments([]);
    }
  };

  useEffect(() => {
    fetchLookups();
  }, []);

  useEffect(() => {
    fetchAssignments();
  }, [selectedSemesterId]);

  useEffect(() => {
    if (initialClassId && classesList.some((item) => getClassId(item) === initialClassId)) {
      setSelectedClassId(initialClassId);
      return;
    }
    if (!selectedClassId && classSummaries.length > 0) {
      setSelectedClassId(classSummaries[0].classId);
    }
  }, [classSummaries, classesList, initialClassId, selectedClassId]);

  const openTransferModal = () => {
    if (!selectedSemesterId || !selectedClassId) {
      toast.error("Vui lòng chọn học kỳ hiệu lực và lớp hành chính đích");
      return;
    }
    setSelectedStudentIds([]);
    setStudentSearchTerm("");
    setTransferNote("");
    setTransferModalOpen(true);
  };

  const handleTransferStudents = async () => {
    if (selectedStudentIds.length === 0 || !selectedClassId || !selectedSemesterId) {
      toast.error("Vui lòng chọn ít nhất một sinh viên, lớp đích và học kỳ hiệu lực");
      return;
    }

    setSaving(true);
    const promises = selectedStudentIds.map((studentId) =>
      request.post("/api/v1/student-classes/admin", {
        studentId,
        classId: selectedClassId,
        semesterId: selectedSemesterId,
        status: "ACTIVE",
        isActive: true,
        note: transferNote || "Phân lớp/chuyển lớp hành chính",
      }),
    );

    try {
      const results = await Promise.allSettled(promises);
      const succeededCount = results.filter((result) => result.status === "fulfilled").length;
      const failedResults = results.filter((result): result is PromiseRejectedResult => result.status === "rejected");

      clearCache("students");
      await Promise.all([fetchAssignments(), fetchLookups()]);

      if (failedResults.length === 0) {
        toast.success(`Đã cập nhật lớp hành chính cho ${succeededCount} sinh viên`);
        setTransferModalOpen(false);
      } else {
        const errors = failedResults.map((result) => result.reason?.response?.data?.message || result.reason?.message || "Lỗi không xác định");
        toast.warning(`Thành công ${succeededCount}, thất bại ${failedResults.length}. ${Array.from(new Set(errors)).join("; ")}`);
        setSelectedStudentIds((current) =>
          current.filter((_, index) => results[index]?.status === "rejected"),
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi cập nhật lớp hành chính");
    } finally {
      setSaving(false);
    }
  };

  const handleCloseAssignment = async (assignmentId?: string) => {
    if (!assignmentId) return;
    if (!confirm("Đóng bản ghi phân lớp này? Sinh viên sẽ không còn active trong lớp này ở học kỳ đang xem.")) return;

    try {
      await request.delete(`/api/v1/student-classes/admin/${assignmentId}`);
      clearCache("students");
      await Promise.all([fetchAssignments(), fetchLookups()]);
      toast.success("Đã đóng bản ghi phân lớp");
    } catch {
      toast.error("Đóng bản ghi phân lớp thất bại");
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
          <Badge variant="secondary" className="mb-2 bg-primary/10 text-primary">
            Lịch sử lớp hành chính
          </Badge>
          <h1 className="text-2xl font-semibold tracking-tight">Phân lớp và chuyển lớp theo học kỳ</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Dùng cho các trường hợp phân lớp ban đầu, chuyển lớp, chuyển ngành hoặc chia lớp chuyên ngành cần lưu lịch sử theo học kỳ hiệu lực.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="min-w-[260px]">
            <Label>Học kỳ hiệu lực</Label>
            <Select
              value={selectedSemesterId}
              onValueChange={(value) => {
                setSelectedSemesterId(value);
                setSelectedClassId("");
              }}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Chọn học kỳ">
                  {selectedSemester ? selectedSemester.name || selectedSemester.code : "Chọn học kỳ"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {semestersList.filter((semester) => semester.semesterId).map((semester) => (
                  <SelectItem key={semester.semesterId} value={semester.semesterId || ""}>
                    {semester.code ? `${semester.code} - ${semester.name}` : semester.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={openTransferModal} className="mt-auto">
            <UserRoundCheck className="mr-2 h-4 w-4" />
            Chuyển/Gán lớp
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
          <p className="mt-3 text-2xl font-bold">{filledClasses}/{classesList.length}</p>
        </div>
        <div className="rounded-lg border bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Sinh viên active</p>
            <Users className="h-5 w-5 text-primary" />
          </div>
          <p className="mt-3 text-2xl font-bold">{totalAssigned}</p>
          <p className="mt-1 text-xs text-muted-foreground">Tính theo học kỳ hiệu lực đã chọn</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_440px]">
        <section className="rounded-lg border bg-card">
          <div className="border-b p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Tìm lớp hành chính, khoa, ngành, khóa..."
                className="pl-10"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="px-4 py-3 text-left font-semibold">Lớp hành chính</th>
                  <th className="px-4 py-3 text-left font-semibold">Khoa</th>
                  <th className="px-4 py-3 text-left font-semibold">Ngành / Khóa</th>
                  <th className="px-4 py-3 text-center font-semibold">Sĩ số</th>
                  <th className="px-4 py-3 text-left font-semibold">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {classSummaries.map((item) => (
                  <tr
                    key={item.classId}
                    onClick={() => setSelectedClassId(item.classId)}
                    className={`cursor-pointer border-b transition hover:bg-muted/50 ${selectedClassId === item.classId ? "bg-primary/5" : ""}`}
                  >
                    <td className="px-4 py-3">
                      <p className="font-semibold">{item.classCode || "—"}</p>
                      <p className="text-xs text-muted-foreground">{item.className || "Chưa có tên lớp"}</p>
                    </td>
                    <td className="px-4 py-3">{item.departmentName || "—"}</td>
                    <td className="px-4 py-3">
                      <p>{item.majorName || "Lớp cơ sở chung"}</p>
                      <p className="text-xs text-muted-foreground">{item.academicCohortName || item.academicCohortCode || "—"}</p>
                    </td>
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
            <p className="text-sm text-muted-foreground">Sinh viên active trong lớp</p>
            <h2 className="mt-1 text-xl font-bold">{selectedClass?.classCode || "Chọn lớp"}</h2>
            <p className="text-sm text-muted-foreground">
              {selectedClass?.className || "Chọn một lớp ở bảng bên trái để quản lý."}
            </p>
          </div>
          <div className="max-h-[700px] overflow-y-auto p-4">
            {selectedMembers.length === 0 ? (
              <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                Lớp này chưa có sinh viên active trong học kỳ đã chọn.
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
                      onClick={() => handleCloseAssignment(item.studentClassId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 border-t pt-4">
              <div className="mb-3 flex items-center gap-2">
                <History className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-semibold">Lịch sử trong học kỳ</p>
              </div>
              <div className="space-y-2">
                {selectedHistory.map((item) => (
                  <div key={`${item.studentClassId}-history`} className="rounded-md border bg-muted/20 p-3 text-sm">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium">{item.student?.fullName || item.studentId}</p>
                        <p className="text-xs text-muted-foreground">{item.student?.studentCode || "—"}</p>
                      </div>
                      <Badge variant={item.isActive === false ? "secondary" : "default"}>
                        {item.isActive === false ? "Lịch sử" : "Hiện tại"}
                      </Badge>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">Cập nhật: {formatDate(item.updatedAt || item.createdAt)}</p>
                    {item.note && <p className="mt-1 text-xs text-muted-foreground">{item.note}</p>}
                  </div>
                ))}
                {selectedHistory.length === 0 && (
                  <p className="text-sm text-muted-foreground">Chưa có lịch sử phân lớp trong học kỳ này.</p>
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>

      <Dialog open={transferModalOpen} onOpenChange={setTransferModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chuyển/Gán sinh viên vào lớp hành chính</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-muted-foreground">Học kỳ hiệu lực</p>
                <p className="font-semibold">{selectedSemester?.name || "—"}</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-muted-foreground">Lớp đích</p>
                <p className="font-semibold">{selectedClass?.classCode || "—"}</p>
              </div>
            </div>

            <div>
              <Label>Tìm sinh viên phù hợp với khoa/khóa/ngành của lớp đích</Label>
              <Input
                value={studentSearchTerm}
                onChange={(event) => setStudentSearchTerm(event.target.value)}
                placeholder="Tìm theo mã sinh viên, họ tên..."
                className="mt-1"
              />
            </div>

            <div className="max-h-[320px] space-y-1 overflow-y-auto rounded-md border bg-background p-2">
              {filteredAvailableStudents.map((student) => {
                const studentId = student.id || student.studentId || "";
                const isChecked = selectedStudentIds.includes(studentId);
                const currentAssignment = activeAssignmentByStudentId.get(studentId);
                const currentClass = currentAssignment?.classId ? classById.get(currentAssignment.classId) : undefined;
                return (
                  <label key={studentId} className="flex cursor-pointer items-center gap-3 rounded px-2 py-2 text-sm hover:bg-muted/50">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {
                        setSelectedStudentIds((current) =>
                          isChecked ? current.filter((id) => id !== studentId) : [...current, studentId],
                        );
                      }}
                      className="h-4 w-4 cursor-pointer rounded border-gray-300 text-emerald-600 focus:ring-emerald-600"
                    />
                    <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs font-semibold text-muted-foreground">
                      {student.studentCode}
                    </span>
                    <span className="min-w-0 flex-1 font-medium">{student.fullName}</span>
                    {currentClass && (
                      <span className="shrink-0 text-xs text-amber-700">Đang ở {currentClass.classCode}</span>
                    )}
                  </label>
                );
              })}
              {filteredAvailableStudents.length === 0 && (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  Không có sinh viên phù hợp hoặc tất cả đã ở lớp đích trong học kỳ này.
                </p>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Đã chọn: <strong className="text-foreground">{selectedStudentIds.length}</strong> sinh viên</span>
              <span>Bản ghi lớp cũ cùng học kỳ sẽ được đóng thành lịch sử.</span>
            </div>

            <div>
              <Label>Lý do/Ghi chú chuyển lớp</Label>
              <Textarea
                value={transferNote}
                onChange={(event) => setTransferNote(event.target.value)}
                placeholder="VD: Chuyển ngành, chia lớp chuyên ngành, điều chỉnh sĩ số..."
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTransferModalOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleTransferStudents} disabled={saving}>
              Lưu phân lớp
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function StudentClassAssignmentsPage() {
  return (
    <Suspense fallback={<div className="p-4 text-center">Đang tải...</div>}>
      <StudentClassAssignmentsContent />
    </Suspense>
  );
}
