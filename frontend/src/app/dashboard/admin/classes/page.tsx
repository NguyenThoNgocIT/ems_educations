"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { academicCohortApi } from "@/api/academic-cohort";
import { administrativeClassApi } from "@/api/administrative-class";
import { departmentApi } from "@/api/department";
import { lecturerApi } from "@/api/lecturer";
import { majorApi } from "@/api/major";
import { unwrapApiResponse } from "@/api/response";
import { studentApi } from "@/api/student";
import { request } from "@/utils/request";
import type { AcademicCohort, AdministrativeClass, Department, Major, Specialization } from "@/types/lookup";
import type { LecturerListItem } from "@/types/instructor";
import type { StudentListItem } from "@/types/student";
import {
  ArrowRightLeft,
  Building2,
  ChevronLeft,
  ChevronRight,
  Edit,
  GraduationCap,
  Layers,
  Plus,
  Search,
  Trash2,
  UserCheck,
  Users,
} from "lucide-react";
import { toast } from "sonner";

type ClassFormData = {
  classCode: string;
  className: string;
  departmentId: string;
  majorId: string;
  specializationId: string;
  academicCohortId: string;
  advisorId: string;
  classPhase: "FOUNDATION" | "SPECIALIZATION";
  maxSize: number;
  status: number;
  note: string;
  isActive: boolean;
};

const initialForm: ClassFormData = {
  classCode: "",
  className: "",
  departmentId: "",
  majorId: "",
  specializationId: "",
  academicCohortId: "",
  advisorId: "",
  classPhase: "FOUNDATION",
  maxSize: 50,
  status: 1,
  note: "",
  isActive: true,
};

const getDepartmentId = (department: Department) => department.departmentId || department.id || "";
const getMajorId = (major: Major) => major.majorId || major.id || "";
const getCohortId = (cohort: AcademicCohort) => cohort.academicCohortId || cohort.cohortId || cohort.id || "";
const getSpecializationId = (specialization: Specialization) => specialization.specializationId || specialization.id || "";
const getClassId = (item: AdministrativeClass) => item.classId || item.id || "";
const getLecturerId = (lecturer: LecturerListItem) => lecturer.employeeId || lecturer.id || "";
const labelOf = (code?: string, name?: string) => [code, name].filter(Boolean).join(" - ");

const getSpecializations = async (): Promise<Specialization[]> => {
  const response = await request.get("/api/v1/specializations/admin", { params: { isActive: true } });
  const data = unwrapApiResponse<any>(response);
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  return [];
};

const phaseLabel = (phase?: string) => (phase === "SPECIALIZATION" ? "Chuyên ngành" : "Cơ sở chung");
const statusLabel = (status?: number) => {
  if (status === 0) return "Tạm dừng";
  if (status === 2) return "Đã kết thúc";
  return "Đang mở";
};

export default function ClassesPage() {
  const router = useRouter();
  const [classes, setClasses] = useState<AdministrativeClass[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [majors, setMajors] = useState<Major[]>([]);
  const [cohorts, setCohorts] = useState<AcademicCohort[]>([]);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [lecturers, setLecturers] = useState<LecturerListItem[]>([]);
  const [students, setStudents] = useState<StudentListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartmentId, setFilterDepartmentId] = useState("all");
  const [filterMajorId, setFilterMajorId] = useState("all");
  const [filterCohortId, setFilterCohortId] = useState("all");
  const [filterPhase, setFilterPhase] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<AdministrativeClass | null>(null);
  const [viewingClass, setViewingClass] = useState<AdministrativeClass | null>(null);
  const [studentSearchTerm, setStudentSearchTerm] = useState("");
  const [formData, setFormData] = useState<ClassFormData>(initialForm);

  const departmentMap = useMemo(
    () => new Map(departments.map((item) => [getDepartmentId(item), item])),
    [departments],
  );
  const majorMap = useMemo(
    () => new Map(majors.map((item) => [getMajorId(item), item])),
    [majors],
  );
  const cohortMap = useMemo(
    () => new Map(cohorts.map((item) => [getCohortId(item), item])),
    [cohorts],
  );
  const specializationMap = useMemo(
    () => new Map(specializations.map((item) => [getSpecializationId(item), item])),
    [specializations],
  );
  const advisorClassById = useMemo(() => {
    const map = new Map<string, AdministrativeClass>();
    classes.forEach((item) => {
      if (item.advisorId && item.isActive !== false) map.set(item.advisorId, item);
    });
    return map;
  }, [classes]);
  const studentsByClassId = useMemo(() => {
    const map = new Map<string, StudentListItem[]>();
    students.forEach((student) => {
      if (!student.classId) return;
      map.set(student.classId, [...(map.get(student.classId) ?? []), student]);
    });
    return map;
  }, [students]);

  const filteredMajorsForForm = useMemo(
    () => majors.filter((major) => !formData.departmentId || major.departmentId === formData.departmentId),
    [formData.departmentId, majors],
  );
  const filteredSpecializationsForForm = useMemo(
    () =>
      specializations.filter(
        (item) =>
          (!formData.departmentId || item.departmentId === formData.departmentId) &&
          (!formData.majorId || item.majorId === formData.majorId),
      ),
    [formData.departmentId, formData.majorId, specializations],
  );
  const availableAdvisors = useMemo(() => {
    const editingId = editingClass ? getClassId(editingClass) : "";
    return lecturers.filter((lecturer) => {
      if (formData.departmentId && lecturer.departmentId && lecturer.departmentId !== formData.departmentId) return false;
      const assignedClass = advisorClassById.get(getLecturerId(lecturer));
      return !assignedClass || getClassId(assignedClass) === editingId;
    });
  }, [advisorClassById, editingClass, formData.departmentId, lecturers]);

  const filteredClasses = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    return classes
      .filter((item) => {
        const departmentLabel = labelOf(item.departmentCode, item.departmentName) || labelOf(departmentMap.get(item.departmentId || "")?.code, departmentMap.get(item.departmentId || "")?.name);
        const majorLabel = labelOf(item.majorCode, item.majorName) || labelOf(majorMap.get(item.majorId || "")?.code, majorMap.get(item.majorId || "")?.name);
        const cohortLabel = labelOf(item.academicCohortCode, item.academicCohortName) || labelOf(cohortMap.get(item.academicCohortId || "")?.code, cohortMap.get(item.academicCohortId || "")?.name);
        const matchesSearch =
          !search ||
          [item.classCode, item.className, departmentLabel, majorLabel, cohortLabel, item.advisorName]
            .some((value) => String(value || "").toLowerCase().includes(search));
        const matchesDepartment = filterDepartmentId === "all" || item.departmentId === filterDepartmentId;
        const matchesMajor = filterMajorId === "all" || item.majorId === filterMajorId;
        const matchesCohort = filterCohortId === "all" || item.academicCohortId === filterCohortId;
        const matchesPhase = filterPhase === "all" || (item.classPhase || "FOUNDATION") === filterPhase;
        return matchesSearch && matchesDepartment && matchesMajor && matchesCohort && matchesPhase;
      })
      .sort((a, b) => String(a.classCode || "").localeCompare(String(b.classCode || "")));
  }, [classes, cohortMap, departmentMap, filterCohortId, filterDepartmentId, filterMajorId, filterPhase, majorMap, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredClasses.length / rowsPerPage));
  const paginatedClasses = filteredClasses.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const summary = useMemo(() => {
    const foundation = classes.filter((item) => (item.classPhase || "FOUNDATION") !== "SPECIALIZATION").length;
    const specialization = classes.filter((item) => item.classPhase === "SPECIALIZATION").length;
    const active = classes.filter((item) => item.isActive !== false).length;
    const assignedAdvisors = classes.filter((item) => !!item.advisorId && item.isActive !== false).length;
    return { foundation, specialization, active, assignedAdvisors };
  }, [classes]);

  const viewingClassStudents = useMemo(() => {
    if (!viewingClass) return [];
    const rows = studentsByClassId.get(getClassId(viewingClass)) ?? [];
    const search = studentSearchTerm.trim().toLowerCase();
    if (!search) return rows;
    return rows.filter((student) =>
      [student.studentCode, student.fullName, student.contactEmail, student.phoneNumber].some((value) =>
        String(value || "").toLowerCase().includes(search),
      ),
    );
  }, [studentSearchTerm, studentsByClassId, viewingClass]);

  const setField = <K extends keyof ClassFormData>(key: K, value: ClassFormData[K]) => {
    setFormData((current) => ({ ...current, [key]: value }));
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [classRows, departmentRows, majorRows, cohortRows, specializationRows, lecturerRows, studentRows] = await Promise.all([
        administrativeClassApi.getAll({ isActive: true }),
        departmentApi.getAll({ isActive: true }),
        majorApi.getAll({ isActive: true }),
        academicCohortApi.getAll({ isActive: true }),
        getSpecializations(),
        lecturerApi.getAll().catch(() => []),
        studentApi.getAll().catch(() => []),
      ]);
      setClasses(classRows || []);
      setDepartments(departmentRows || []);
      setMajors(majorRows || []);
      setCohorts(cohortRows || []);
      setSpecializations(specializationRows || []);
      setLecturers(lecturerRows || []);
      setStudents(studentRows || []);
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải dữ liệu lớp hành chính");
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterDepartmentId, filterMajorId, filterCohortId, filterPhase, rowsPerPage]);

  const openCreateDialog = () => {
    setEditingClass(null);
    setFormData(initialForm);
    setModalOpen(true);
  };

  const openEditDialog = (item: AdministrativeClass) => {
    setEditingClass(item);
    setFormData({
      classCode: item.classCode || "",
      className: item.className || "",
      departmentId: item.departmentId || "",
      majorId: item.majorId || "",
      specializationId: item.specializationId || "",
      academicCohortId: item.academicCohortId || "",
      advisorId: item.advisorId || "",
      classPhase: item.classPhase === "SPECIALIZATION" ? "SPECIALIZATION" : "FOUNDATION",
      maxSize: item.maxSize || 50,
      status: item.status ?? 1,
      note: item.note || "",
      isActive: item.isActive ?? true,
    });
    setModalOpen(true);
  };

  const openStudentDialog = (item: AdministrativeClass) => {
    setViewingClass(item);
    setStudentSearchTerm("");
    setStudentModalOpen(true);
  };

  const handleDepartmentChange = (departmentId: string) => {
    setFormData((current) => ({
      ...current,
      departmentId,
      majorId: "",
      specializationId: "",
      advisorId: "",
    }));
  };

  const handlePhaseChange = (phase: "FOUNDATION" | "SPECIALIZATION") => {
    setFormData((current) => ({
      ...current,
      classPhase: phase,
      majorId: phase === "FOUNDATION" ? "" : current.majorId,
      specializationId: "",
    }));
  };

  const handleMajorChange = (majorId: string) => {
    setFormData((current) => ({ ...current, majorId, specializationId: "" }));
  };

  const validateForm = () => {
    if (!formData.classCode.trim() || !formData.className.trim()) {
      toast.error("Vui lòng nhập mã lớp và tên lớp");
      return false;
    }
    if (!formData.departmentId || !formData.academicCohortId) {
      toast.error("Vui lòng chọn khoa và khóa tuyển sinh");
      return false;
    }
    if (formData.classPhase === "SPECIALIZATION" && (!formData.majorId || !formData.specializationId)) {
      toast.error("Lớp chuyên ngành phải chọn ngành và chuyên ngành");
      return false;
    }
    if (Number(formData.maxSize) <= 0) {
      toast.error("Sĩ số tối đa phải lớn hơn 0");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const payload: AdministrativeClass = {
      classCode: formData.classCode.trim().toUpperCase(),
      className: formData.className.trim(),
      departmentId: formData.departmentId,
      academicCohortId: formData.academicCohortId,
      majorId: (formData.classPhase === "SPECIALIZATION" ? formData.majorId : null) as any,
      specializationId: (formData.classPhase === "SPECIALIZATION" ? formData.specializationId : null) as any,
      advisorId: (formData.advisorId || null) as any,
      classPhase: formData.classPhase,
      maxSize: Number(formData.maxSize),
      status: Number(formData.status),
      note: formData.note || undefined,
      isActive: formData.isActive,
    };

    setSaving(true);
    try {
      if (editingClass) {
        await administrativeClassApi.update(getClassId(editingClass), payload);
        toast.success("Cập nhật lớp hành chính thành công");
      } else {
        await administrativeClassApi.create(payload);
        toast.success("Tạo lớp hành chính thành công");
      }
      setModalOpen(false);
      await loadData();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Không thể lưu lớp hành chính");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: AdministrativeClass) => {
    const id = getClassId(item);
    const members = studentsByClassId.get(id) ?? [];
    if (members.length > 0) {
      toast.error("Lớp đang có sinh viên hiện tại, hãy chuyển sinh viên sang lớp khác trước khi ngừng hoạt động");
      return;
    }
    if (!confirm(`Ngừng hoạt động lớp ${item.classCode || item.className}?`)) return;

    try {
      await administrativeClassApi.delete(id);
      toast.success("Đã ngừng hoạt động lớp hành chính");
      await loadData();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Không thể ngừng hoạt động lớp");
    }
  };

  const navigateToClassHistory = (item: AdministrativeClass) => {
    router.push(`/dashboard/admin/student-class-assignments?classId=${getClassId(item)}`);
    setStudentModalOpen(false);
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
            Lớp hành chính
          </Badge>
          <h1 className="text-2xl font-semibold tracking-tight">Quản lý lớp hành chính</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Tạo lớp theo khoa, khóa tuyển sinh và giai đoạn đào tạo. Sinh viên được thêm/chuyển lớp qua màn lịch sử lớp hành chính.
          </p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm lớp hành chính
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Đang hoạt động</CardDescription>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Layers className="h-5 w-5 text-primary" />
              {summary.active}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Lớp cơ sở chung</CardDescription>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Building2 className="h-5 w-5 text-primary" />
              {summary.foundation}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Lớp chuyên ngành</CardDescription>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <GraduationCap className="h-5 w-5 text-primary" />
              {summary.specialization}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Đã gán cố vấn</CardDescription>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <UserCheck className="h-5 w-5 text-primary" />
              {summary.assignedAdvisors}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader className="space-y-4">
          <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(260px,1fr)_220px_220px_220px_200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Tìm mã lớp, tên lớp, khoa, ngành, cố vấn..."
                className="pl-10"
              />
            </div>
            <Select
              value={filterDepartmentId}
              onValueChange={(value) => {
                setFilterDepartmentId(value);
                setFilterMajorId("all");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tất cả khoa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả khoa</SelectItem>
                {departments.map((department) => {
                  const id = getDepartmentId(department);
                  return <SelectItem key={id} value={id}>{labelOf(department.code, department.name)}</SelectItem>;
                })}
              </SelectContent>
            </Select>
            <Select value={filterMajorId} onValueChange={setFilterMajorId}>
              <SelectTrigger>
                <SelectValue placeholder="Tất cả ngành" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả ngành</SelectItem>
                {majors
                  .filter((major) => filterDepartmentId === "all" || major.departmentId === filterDepartmentId)
                  .map((major) => {
                    const id = getMajorId(major);
                    return <SelectItem key={id} value={id}>{labelOf(major.code, major.name)}</SelectItem>;
                  })}
              </SelectContent>
            </Select>
            <Select value={filterCohortId} onValueChange={setFilterCohortId}>
              <SelectTrigger>
                <SelectValue placeholder="Tất cả khóa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả khóa</SelectItem>
                {cohorts.map((cohort) => {
                  const id = getCohortId(cohort);
                  return <SelectItem key={id} value={id}>{labelOf(cohort.code, cohort.name)}</SelectItem>;
                })}
              </SelectContent>
            </Select>
            <Select value={filterPhase} onValueChange={setFilterPhase}>
              <SelectTrigger>
                <SelectValue placeholder="Tất cả giai đoạn" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả giai đoạn</SelectItem>
                <SelectItem value="FOUNDATION">Cơ sở chung</SelectItem>
                <SelectItem value="SPECIALIZATION">Chuyên ngành</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full min-w-[1120px] text-sm">
              <thead className="bg-muted/40">
                <tr className="border-b">
                  <th className="px-4 py-3 text-left font-semibold">Lớp hành chính</th>
                  <th className="px-4 py-3 text-left font-semibold">Giai đoạn</th>
                  <th className="px-4 py-3 text-left font-semibold">Khoa</th>
                  <th className="px-4 py-3 text-left font-semibold">Ngành / chuyên ngành</th>
                  <th className="px-4 py-3 text-left font-semibold">Khóa</th>
                  <th className="px-4 py-3 text-left font-semibold">Cố vấn</th>
                  <th className="px-4 py-3 text-center font-semibold">Sĩ số</th>
                  <th className="px-4 py-3 text-left font-semibold">Trạng thái</th>
                  <th className="px-4 py-3 text-right font-semibold">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {paginatedClasses.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-10 text-center text-muted-foreground">
                      Không tìm thấy lớp hành chính phù hợp.
                    </td>
                  </tr>
                ) : (
                  paginatedClasses.map((item) => {
                    const id = getClassId(item);
                    const department = departmentMap.get(item.departmentId || "");
                    const major = majorMap.get(item.majorId || "");
                    const specialization = specializationMap.get(item.specializationId || "");
                    const cohort = cohortMap.get(item.academicCohortId || "");
                    const members = studentsByClassId.get(id) ?? [];
                    return (
                      <tr key={id} className="border-b last:border-0 hover:bg-muted/40">
                        <td className="px-4 py-3">
                          <p className="font-semibold">{item.classCode}</p>
                          <p className="text-xs text-muted-foreground">{item.className}</p>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={item.classPhase === "SPECIALIZATION" ? "default" : "secondary"}>
                            {phaseLabel(item.classPhase)}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">{labelOf(item.departmentCode, item.departmentName) || labelOf(department?.code, department?.name) || "—"}</td>
                        <td className="px-4 py-3">
                          <p>{labelOf(item.majorCode, item.majorName) || labelOf(major?.code, major?.name) || "Lớp cơ sở chung"}</p>
                          {item.classPhase === "SPECIALIZATION" && (
                            <p className="text-xs text-muted-foreground">
                              {labelOf(item.specializationCode, item.specializationName) || labelOf(specialization?.code, specialization?.name) || "Chưa có chuyên ngành"}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-3">{labelOf(item.academicCohortCode, item.academicCohortName) || labelOf(cohort?.code, cohort?.name) || "—"}</td>
                        <td className="px-4 py-3">
                          {item.advisorName ? (
                            <>
                              <p className="font-medium">{item.advisorName}</p>
                              <p className="text-xs text-muted-foreground">{item.advisorCode}</p>
                            </>
                          ) : (
                            <span className="text-muted-foreground">Chưa gán</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button type="button" onClick={() => openStudentDialog(item)} className="font-semibold text-emerald-700 hover:underline">
                            {members.length}/{item.maxSize || "—"}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="space-y-1">
                            <Badge variant={item.isActive === false ? "secondary" : "default"}>
                              {item.isActive === false ? "Ngừng hoạt động" : "Hoạt động"}
                            </Badge>
                            <p className="text-xs text-muted-foreground">{statusLabel(item.status)}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => openStudentDialog(item)} title="Xem sinh viên">
                              <Users className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => navigateToClassHistory(item)} title="Chuyển/Gán lớp">
                              <ArrowRightLeft className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => openEditDialog(item)} title="Sửa lớp">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(item)} title="Ngừng hoạt động">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Hiển thị</span>
              <Select value={String(rowsPerPage)} onValueChange={(value) => setRowsPerPage(Number(value || 10))}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground">trên tổng {filteredClasses.length} lớp</span>
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

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editingClass ? "Cập nhật lớp hành chính" : "Tạo lớp hành chính"}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Mã lớp *</Label>
                <Input
                  value={formData.classCode}
                  onChange={(event) => setField("classCode", event.target.value)}
                  placeholder="VD: K26-CNTT-01"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Tên lớp *</Label>
                <Input
                  value={formData.className}
                  onChange={(event) => setField("className", event.target.value)}
                  placeholder="VD: K26 Công nghệ thông tin 01"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Khoa *</Label>
                <Select value={formData.departmentId} onValueChange={handleDepartmentChange}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Chọn khoa" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((department) => {
                      const id = getDepartmentId(department);
                      return <SelectItem key={id} value={id}>{labelOf(department.code, department.name)}</SelectItem>;
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Khóa tuyển sinh *</Label>
                <Select value={formData.academicCohortId} onValueChange={(value) => setField("academicCohortId", value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Chọn khóa tuyển sinh" />
                  </SelectTrigger>
                  <SelectContent>
                    {cohorts.map((cohort) => {
                      const id = getCohortId(cohort);
                      return <SelectItem key={id} value={id}>{labelOf(cohort.code, cohort.name)}</SelectItem>;
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Giai đoạn lớp</Label>
              <Select value={formData.classPhase} onValueChange={(value) => handlePhaseChange(value as ClassFormData["classPhase"])}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FOUNDATION">Cơ sở chung theo khoa</SelectItem>
                  <SelectItem value="SPECIALIZATION">Chuyên ngành sau phân ngành</SelectItem>
                </SelectContent>
              </Select>
              <p className="mt-1 text-xs text-muted-foreground">
                Lớp cơ sở dùng khi sinh viên học chung theo khoa. Lớp chuyên ngành dùng sau khi sinh viên chọn ngành/chuyên ngành.
              </p>
            </div>

            {formData.classPhase === "SPECIALIZATION" && (
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Ngành *</Label>
                  <Select value={formData.majorId} onValueChange={handleMajorChange} disabled={!formData.departmentId}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder={formData.departmentId ? "Chọn ngành" : "Chọn khoa trước"} />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredMajorsForForm.map((major) => {
                        const id = getMajorId(major);
                        return <SelectItem key={id} value={id}>{labelOf(major.code, major.name)}</SelectItem>;
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Chuyên ngành *</Label>
                  <Select value={formData.specializationId} onValueChange={(value) => setField("specializationId", value)} disabled={!formData.majorId}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder={formData.majorId ? "Chọn chuyên ngành" : "Chọn ngành trước"} />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredSpecializationsForForm.map((specialization) => {
                        const id = getSpecializationId(specialization);
                        return <SelectItem key={id} value={id}>{labelOf(specialization.code, specialization.name)}</SelectItem>;
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Cố vấn học tập</Label>
                <Select value={formData.advisorId || "none"} onValueChange={(value) => setField("advisorId", value === "none" ? "" : value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Chưa gán cố vấn" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Chưa gán cố vấn</SelectItem>
                    {availableAdvisors.map((lecturer) => {
                      const lecturerId = getLecturerId(lecturer);
                      const assignedClass = advisorClassById.get(lecturerId);
                      return (
                        <SelectItem key={lecturerId} value={lecturerId}>
                          {labelOf(lecturer.instructorCode, lecturer.fullName)}
                          {assignedClass ? ` - đang cố vấn ${assignedClass.classCode}` : ""}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <p className="mt-1 text-xs text-muted-foreground">Một giảng viên cố vấn chỉ được gán cho một lớp hành chính đang hoạt động.</p>
              </div>
              <div>
                <Label>Sĩ số tối đa *</Label>
                <Input
                  type="number"
                  min={1}
                  value={formData.maxSize}
                  onChange={(event) => setField("maxSize", Number(event.target.value) || 0)}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Trạng thái vận hành</Label>
                <Select value={String(formData.status)} onValueChange={(value) => setField("status", Number(value))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Đang mở</SelectItem>
                    <SelectItem value="0">Tạm dừng</SelectItem>
                    <SelectItem value="2">Đã kết thúc</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 pt-7">
                <input
                  id="class-active"
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(event) => setField("isActive", event.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="class-active" className="cursor-pointer">Lớp đang hoạt động</Label>
              </div>
            </div>

            <div>
              <Label>Ghi chú</Label>
              <Textarea
                value={formData.note}
                onChange={(event) => setField("note", event.target.value)}
                placeholder="Nhập ghi chú nếu có"
                className="mt-1"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Hủy</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Đang lưu..." : "Lưu lớp"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={studentModalOpen} onOpenChange={setStudentModalOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-5xl">
          <DialogHeader>
            <DialogTitle>Sinh viên hiện tại của lớp {viewingClass?.classCode}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-semibold">{viewingClass?.className}</p>
                <p className="text-sm text-muted-foreground">
                  {viewingClassStudents.length}/{studentsByClassId.get(getClassId(viewingClass || {}))?.length || 0} sinh viên phù hợp bộ lọc
                </p>
              </div>
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={studentSearchTerm}
                  onChange={(event) => setStudentSearchTerm(event.target.value)}
                  placeholder="Tìm mã, tên, email, số điện thoại..."
                  className="pl-10"
                />
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full min-w-[760px] text-sm">
                <thead className="bg-muted/40">
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left font-semibold">Mã sinh viên</th>
                    <th className="px-4 py-3 text-left font-semibold">Họ tên</th>
                    <th className="px-4 py-3 text-left font-semibold">Email đào tạo</th>
                    <th className="px-4 py-3 text-left font-semibold">Số điện thoại</th>
                    <th className="px-4 py-3 text-left font-semibold">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {viewingClassStudents.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                        Chưa có sinh viên hiện tại trong lớp này.
                      </td>
                    </tr>
                  ) : (
                    viewingClassStudents.map((student) => (
                      <tr key={student.id} className="border-b last:border-0 hover:bg-muted/40">
                        <td className="px-4 py-3 font-semibold text-emerald-700">{student.studentCode || "—"}</td>
                        <td className="px-4 py-3">{student.fullName || "—"}</td>
                        <td className="px-4 py-3">{student.contactEmail || "—"}</td>
                        <td className="px-4 py-3">{student.phoneNumber || "—"}</td>
                        <td className="px-4 py-3">
                          <Badge variant={student.isActive === false ? "secondary" : "default"}>
                            {student.isActive === false ? "Ngừng học" : "Đang học"}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStudentModalOpen(false)}>Đóng</Button>
            {viewingClass && (
              <Button onClick={() => navigateToClassHistory(viewingClass)}>
                <ArrowRightLeft className="mr-2 h-4 w-4" />
                Chuyển/Gán sinh viên
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
