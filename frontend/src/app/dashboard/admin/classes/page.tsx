"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight, Copy } from "lucide-react";
import { toast } from "sonner";
import { administrativeClassApi } from "@/api/administrative-class";
import { academicCohortApi } from "@/api/academic-cohort";
import { departmentApi } from "@/api/department";
import { lecturerApi } from "@/api/lecturer";
import { majorApi } from "@/api/major";
import { unwrapApiResponse } from "@/api/response";
import { request } from "@/utils/request";
import type { AcademicCohort, AdministrativeClass, Department, Major, Specialization } from "@/types/lookup";
import type { LecturerListItem } from "@/types/instructor";
import { useEffect, useMemo, useState } from "react";

const getDepartmentId = (department: Department) => department.departmentId || department.id || "";
const getMajorId = (major: Major) => major.majorId || major.id || "";
const getCohortId = (cohort: AcademicCohort) => cohort.academicCohortId || cohort.cohortId || cohort.id || "";
const getSpecializationId = (specialization: Specialization) => specialization.specializationId || specialization.id || "";
const getClassId = (item: AdministrativeClass) => item.classId || item.id || "";

const entityLabel = (code?: string, name?: string) => [code, name].filter(Boolean).join(" - ");

const getSpecializations = async (): Promise<Specialization[]> => {
  const response = await request.get("/api/v1/specializations/admin", { params: { isActive: true } });
  const data = unwrapApiResponse<any>(response);
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  return [];
};

const initialForm = {
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

export default function ClassesPage() {
  const [classes, setClasses] = useState<AdministrativeClass[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [majors, setMajors] = useState<Major[]>([]);
  const [cohorts, setCohorts] = useState<AcademicCohort[]>([]);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [lecturers, setLecturers] = useState<LecturerListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartmentId, setFilterDepartmentId] = useState("all");
  const [filterMajorId, setFilterMajorId] = useState("all");
  const [filterCohortId, setFilterCohortId] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<AdministrativeClass | null>(null);
  const [formData, setFormData] = useState(initialForm);

  const departmentMap = useMemo(
    () => new Map(departments.map((department) => [getDepartmentId(department), entityLabel(department.code, department.name)])),
    [departments],
  );
  const majorMap = useMemo(
    () => new Map(majors.map((major) => [getMajorId(major), entityLabel(major.code, major.name)])),
    [majors],
  );
  const cohortMap = useMemo(
    () => new Map(cohorts.map((cohort) => [getCohortId(cohort), entityLabel(cohort.code, cohort.name)])),
    [cohorts],
  );
  const specializationMap = useMemo(
    () =>
      new Map(
        specializations.map((specialization) => [
          getSpecializationId(specialization),
          entityLabel(specialization.code, specialization.name),
        ]),
      ),
    [specializations],
  );
  const lecturerMap = useMemo(
    () => new Map(lecturers.map((lecturer) => [lecturer.id, entityLabel(lecturer.instructorCode, lecturer.fullName)])),
    [lecturers],
  );

  const filteredMajors = useMemo(
    () => majors.filter((major) => !formData.departmentId || major.departmentId === formData.departmentId),
    [formData.departmentId, majors],
  );

  const filteredSpecializations = useMemo(
    () =>
      specializations.filter(
        (specialization) =>
          (!formData.departmentId || specialization.departmentId === formData.departmentId) &&
          (!formData.majorId || specialization.majorId === formData.majorId),
      ),
    [formData.departmentId, formData.majorId, specializations],
  );

  const loadData = async () => {
    setLoading(true);
    try {
      const [classData, departmentData, majorData, cohortData, specializationData, lecturerData] = await Promise.all([
        administrativeClassApi.getAll(),
        departmentApi.getAll({ isActive: true }),
        majorApi.getAll({ isActive: true }),
        academicCohortApi.getAll({ isActive: true }),
        getSpecializations(),
        lecturerApi.getAll().catch(() => []),
      ]);
      setClasses(classData || []);
      setDepartments(departmentData || []);
      setMajors(majorData || []);
      setCohorts(cohortData || []);
      setSpecializations(specializationData || []);
      setLecturers(lecturerData || []);
    } catch (error) {
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
  }, [searchTerm, filterDepartmentId, filterMajorId, filterCohortId, rowsPerPage]);

  const filteredClasses = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    return classes.filter((item) => {
      const departmentLabel = item.departmentName || departmentMap.get(item.departmentId || "") || "";
      const majorLabel = item.majorName || majorMap.get(item.majorId || "") || "";
      const cohortLabel = item.academicCohortName || cohortMap.get(item.academicCohortId || "") || "";
      const matchesSearch =
        !search ||
        (item.classCode || "").toLowerCase().includes(search) ||
        (item.className || "").toLowerCase().includes(search) ||
        departmentLabel.toLowerCase().includes(search) ||
        majorLabel.toLowerCase().includes(search) ||
        cohortLabel.toLowerCase().includes(search);
      const matchesDepartment = filterDepartmentId === "all" || item.departmentId === filterDepartmentId;
      const matchesMajor = filterMajorId === "all" || item.majorId === filterMajorId;
      const matchesCohort = filterCohortId === "all" || item.academicCohortId === filterCohortId;
      return matchesSearch && matchesDepartment && matchesMajor && matchesCohort;
    });
  }, [classes, cohortMap, departmentMap, filterCohortId, filterDepartmentId, filterMajorId, majorMap, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredClasses.length / rowsPerPage));
  const paginatedClasses = filteredClasses.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const setField = <K extends keyof typeof initialForm>(key: K, value: (typeof initialForm)[K]) => {
    setFormData((current) => ({ ...current, [key]: value }));
  };

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
      classPhase: item.classPhase || "FOUNDATION",
      maxSize: item.maxSize || 50,
      status: item.status || 1,
      note: item.note || "",
      isActive: item.isActive ?? true,
    });
    setModalOpen(true);
  };

  const handleDepartmentChange = (departmentId: string) => {
    setFormData((current) => ({
      ...current,
      departmentId,
      majorId: "",
      specializationId: "",
    }));
  };

  const handleMajorChange = (majorId: string) => {
    setFormData((current) => ({
      ...current,
      majorId,
      specializationId: "",
    }));
  };

  const handleSave = async () => {
    if (!formData.classCode.trim() || !formData.className.trim() || !formData.departmentId || !formData.academicCohortId) {
      toast.error("Vui lòng điền mã lớp, tên lớp, khoa và khóa đào tạo");
      return;
    }
    if (formData.classPhase === "SPECIALIZATION" && !formData.specializationId) {
      toast.error("Lớp giai đoạn chuyên ngành cần chọn chuyên ngành");
      return;
    }

    const payload: AdministrativeClass = {
      ...formData,
      classCode: formData.classCode.trim(),
      className: formData.className.trim(),
      majorId: formData.majorId || undefined,
      specializationId: formData.specializationId || undefined,
      advisorId: formData.advisorId || undefined,
      maxSize: Number(formData.maxSize) || 0,
      status: Number(formData.status) || 1,
    };

    try {
      if (editingClass) {
        await administrativeClassApi.update(getClassId(editingClass), payload);
        toast.success("Cập nhật lớp thành công");
      } else {
        await administrativeClassApi.create(payload);
        toast.success("Thêm lớp thành công");
      }
      setModalOpen(false);
      await loadData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Thao tác thất bại");
    }
  };

  const handleDelete = async (item: AdministrativeClass) => {
    const id = getClassId(item);
    if (!confirm(`Bạn có chắc muốn xóa lớp ${item.className || item.classCode}?`)) return;
    try {
      await administrativeClassApi.delete(id);
      toast.success("Xóa lớp thành công");
      await loadData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Xóa thất bại");
    }
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(`Đã copy ID: ${text.substring(0, 8)}...`);
  };

  const renderRelation = (label?: string) => label || "Chưa liên kết";

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Quản lý lớp hành chính</h1>
          <p className="text-muted-foreground">Liên kết lớp với khoa, ngành và khóa đào tạo.</p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm lớp
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_220px_220px_220px]">
            <div className="relative">
              <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder="Tìm theo mã lớp, tên lớp, khoa, ngành..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterDepartmentId}
              onChange={(event) => {
                setFilterDepartmentId(event.target.value);
                setFilterMajorId("all");
              }}
              className="rounded-md border bg-background px-3 py-2 text-sm"
            >
              <option value="all">Tất cả khoa</option>
              {departments.map((department) => {
                const id = getDepartmentId(department);
                return (
                  <option key={id} value={id}>
                    {entityLabel(department.code, department.name)}
                  </option>
                );
              })}
            </select>
            <select
              value={filterMajorId}
              onChange={(event) => setFilterMajorId(event.target.value)}
              className="rounded-md border bg-background px-3 py-2 text-sm"
            >
              <option value="all">Tất cả ngành</option>
              {majors
                .filter((major) => filterDepartmentId === "all" || major.departmentId === filterDepartmentId)
                .map((major) => {
                  const id = getMajorId(major);
                  return (
                    <option key={id} value={id}>
                      {entityLabel(major.code, major.name)}
                    </option>
                  );
                })}
            </select>
            <select
              value={filterCohortId}
              onChange={(event) => setFilterCohortId(event.target.value)}
              className="rounded-md border bg-background px-3 py-2 text-sm"
            >
              <option value="all">Tất cả khóa</option>
              {cohorts.map((cohort) => {
                const id = getCohortId(cohort);
                return (
                  <option key={id} value={id}>
                    {entityLabel(cohort.code, cohort.name)}
                  </option>
                );
              })}
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left text-sm font-semibold">ID lớp</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Mã lớp</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Tên lớp</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Khoa</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Ngành</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Khóa</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Sĩ số</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Trạng thái</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {paginatedClasses.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-muted-foreground">
                      Chưa có dữ liệu lớp phù hợp.
                    </td>
                  </tr>
                ) : (
                  paginatedClasses.map((item) => {
                    const id = getClassId(item);
                    const departmentLabel =
                      entityLabel(item.departmentCode, item.departmentName) || departmentMap.get(item.departmentId || "");
                    const majorLabel = entityLabel(item.majorCode, item.majorName) || majorMap.get(item.majorId || "");
                    const cohortLabel =
                      entityLabel(item.academicCohortCode, item.academicCohortName) || cohortMap.get(item.academicCohortId || "");

                    return (
                      <tr key={id} className="border-b hover:bg-muted/50">
                        <td className="px-4 py-3 text-sm">
                          <button className="flex items-center gap-2 font-mono text-xs text-blue-600" onClick={() => copyToClipboard(id)}>
                            {id.substring(0, 8)}...
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                        </td>
                        <td className="px-4 py-3 text-sm font-medium">{item.classCode}</td>
                        <td className="px-4 py-3 text-sm">{item.className}</td>
                        <td className="px-4 py-3 text-sm">{renderRelation(departmentLabel)}</td>
                        <td className="px-4 py-3 text-sm">{renderRelation(majorLabel)}</td>
                        <td className="px-4 py-3 text-sm">{renderRelation(cohortLabel)}</td>
                        <td className="px-4 py-3 text-sm">{item.maxSize || "-"}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`rounded-full px-2 py-1 text-xs ${item.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                            {item.isActive ? "Hoạt động" : "Không hoạt động"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => openEditDialog(item)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(item)}>
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

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">Hiển thị</span>
              <select value={rowsPerPage} onChange={(event) => setRowsPerPage(Number(event.target.value))} className="rounded border px-2 py-1 text-sm">
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span className="text-muted-foreground text-sm">trên tổng {filteredClasses.length} bản ghi</span>
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
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingClass ? "Chỉnh sửa lớp" : "Thêm lớp mới"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4 sm:grid-cols-2">
            {editingClass && (
              <div className="sm:col-span-2">
                <Label>ID lớp</Label>
                <div className="mt-1 flex items-center gap-2">
                  <Input value={getClassId(editingClass)} disabled className="bg-gray-100 font-mono text-sm" />
                  <Button type="button" size="sm" variant="outline" onClick={() => copyToClipboard(getClassId(editingClass))}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
            <div>
              <Label>Mã lớp *</Label>
              <Input value={formData.classCode} onChange={(event) => setField("classCode", event.target.value)} placeholder="VD: K15_CNTT_01" />
            </div>
            <div>
              <Label>Tên lớp *</Label>
              <Input value={formData.className} onChange={(event) => setField("className", event.target.value)} placeholder="VD: K15 - Công nghệ thông tin 01" />
            </div>
            <div>
              <Label>Khoa *</Label>
              <select value={formData.departmentId} onChange={(event) => handleDepartmentChange(event.target.value)} className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm">
                <option value="">Chọn khoa</option>
                {departments.map((department) => {
                  const id = getDepartmentId(department);
                  return (
                    <option key={id} value={id}>
                      {entityLabel(department.code, department.name)}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <Label>Ngành</Label>
              <select value={formData.majorId} onChange={(event) => handleMajorChange(event.target.value)} className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm">
                <option value="">Chọn ngành</option>
                {filteredMajors.map((major) => {
                  const id = getMajorId(major);
                  return (
                    <option key={id} value={id}>
                      {entityLabel(major.code, major.name)}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <Label>Khóa đào tạo *</Label>
              <select value={formData.academicCohortId} onChange={(event) => setField("academicCohortId", event.target.value)} className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm">
                <option value="">Chọn khóa đào tạo</option>
                {cohorts.map((cohort) => {
                  const id = getCohortId(cohort);
                  return (
                    <option key={id} value={id}>
                      {entityLabel(cohort.code, cohort.name)}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <Label>Giai đoạn lớp</Label>
              <select value={formData.classPhase} onChange={(event) => setField("classPhase", event.target.value)} className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm">
                <option value="FOUNDATION">Đại cương/cơ sở</option>
                <option value="SPECIALIZATION">Chuyên ngành</option>
              </select>
            </div>
            {formData.classPhase === "SPECIALIZATION" && (
              <div className="sm:col-span-2">
                <Label>Chuyên ngành *</Label>
                <select value={formData.specializationId} onChange={(event) => setField("specializationId", event.target.value)} className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm">
                  <option value="">Chọn chuyên ngành</option>
                  {filteredSpecializations.map((specialization) => {
                    const id = getSpecializationId(specialization);
                    return (
                      <option key={id} value={id}>
                        {specializationMap.get(id)}
                      </option>
                    );
                  })}
                </select>
              </div>
            )}
            <div>
              <Label>Cố vấn học tập</Label>
              <select value={formData.advisorId} onChange={(event) => setField("advisorId", event.target.value)} className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm">
                <option value="">Chưa gán cố vấn</option>
                {lecturers.map((lecturer) => (
                  <option key={lecturer.id} value={lecturer.id}>
                    {lecturerMap.get(lecturer.id)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Trạng thái</Label>
              <select value={formData.status} onChange={(event) => setField("status", Number(event.target.value))} className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm">
                <option value={1}>Đang học</option>
                <option value={0}>Tạm dừng</option>
                <option value={2}>Đã tốt nghiệp</option>
              </select>
            </div>
            <div>
              <Label>Sĩ số tối đa</Label>
              <Input type="number" value={formData.maxSize} onChange={(event) => setField("maxSize", Number(event.target.value) || 0)} />
            </div>
            <div className="flex items-center gap-2 pt-7">
              <input type="checkbox" id="isActive" checked={formData.isActive} onChange={(event) => setField("isActive", event.target.checked)} className="h-4 w-4" />
              <Label htmlFor="isActive" className="cursor-pointer">
                Đang hoạt động
              </Label>
            </div>
            <div className="sm:col-span-2">
              <Label>Ghi chú</Label>
              <Textarea value={formData.note} onChange={(event) => setField("note", event.target.value)} rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSave}>Lưu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
