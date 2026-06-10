'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { BookOpen, Edit, Plus, Search, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { academicCohortApi } from '@/api/academic-cohort';
import { courseApi } from '@/api/course';
import { majorApi } from '@/api/major';
import { semesterApi } from '@/api/semester';
import { trainingProgramApi, trainingProgramCourseApi } from '@/api/training-program';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { fixMojibakeText } from '@/utils/text';

const toArray = (value: any) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.data?.data)) return value.data.data;
  if (Array.isArray(value?.content)) return value.content;
  if (Array.isArray(value?.data?.content)) return value.data.content;
  return [];
};

const idOf = (item: any, ...keys: string[]) => {
  for (const key of keys) {
    if (item?.[key]) return String(item[key]);
  }
  return '';
};

const phaseLabel = (value?: string) => {
  const normalized = String(value || '').toUpperCase();
  if (['FOUNDATION', 'CO_SO_KHOA'].includes(normalized)) return 'Môn cơ sở khoa';
  if (['SPECIALIZED', 'CHUYEN_SAU_NGANH'].includes(normalized)) return 'Môn chuyên sâu ngành';
  if (normalized === 'ELECTIVE') return 'Môn tự chọn';
  return value || 'Chưa phân nhóm';
};

const semesterLabelOf = (item: any) => {
  if (item.semesterCode) return `${item.semesterCode}${item.semesterName ? ` - ${fixMojibakeText(item.semesterName)}` : ''}`;
  return item.semesterName ? fixMojibakeText(item.semesterName) : 'Chưa gán học kỳ';
};

export default function TrainingProgramsPage() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [majors, setMajors] = useState<any[]>([]);
  const [cohorts, setCohorts] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [semesters, setSemesters] = useState<any[]>([]);

  const [programDialogOpen, setProgramDialogOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<any>(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    majorId: '',
    academicCohortId: '',
    academicYear: '',
    departmentId: '',
    totalCredits: 0,
    description: '',
    degreeLevel: 'Đại học',
    educationType: 'Chính quy',
    durationYears: 4,
    maxDurationYears: 6,
    effectiveDate: new Date().toISOString().split('T')[0],
    isActive: true,
  });

  const [curriculumOpen, setCurriculumOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<any>(null);
  const [programCourses, setProgramCourses] = useState<any[]>([]);
  const [curriculumLoading, setCurriculumLoading] = useState(false);
  const [programCourseForm, setProgramCourseForm] = useState({
    courseId: '',
    semesterId: '',
    coursePhase: 'FOUNDATION',
    isRequired: true,
  });

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const response = await trainingProgramApi.getAll({ keyword: searchTerm, size: 100 });
      setPrograms(toArray(response).map((item: any) => ({
        ...item,
        name: fixMojibakeText(item.name || item.programName),
        programName: fixMojibakeText(item.programName || item.name),
        departmentName: fixMojibakeText(item.departmentName),
        majorName: fixMojibakeText(item.majorName),
      })));
    } catch (error) {
      console.error(error);
      toast.error('Không thể tải danh sách chương trình đào tạo');
    } finally {
      setLoading(false);
    }
  };

  const fetchMasterData = async () => {
    try {
      const [majorRes, cohortRes, courseRes, semesterRes]: any = await Promise.all([
        majorApi.getAll({ size: 100 }),
        academicCohortApi.getAll(),
        courseApi.getAll(),
        semesterApi.getAll(),
      ]);
      setMajors(toArray(majorRes));
      setCohorts(toArray(cohortRes));
      setCourses(toArray(courseRes));
      setSemesters(toArray(semesterRes));
    } catch (error) {
      console.error('Lỗi tải danh mục:', error);
      toast.error('Không thể tải đủ dữ liệu danh mục');
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, [searchTerm]);

  useEffect(() => {
    fetchMasterData();
  }, []);

  const majorLabels = useMemo(() => new Map(
    majors.map((major) => [
      idOf(major, 'majorId', 'id'),
      fixMojibakeText([major.code, major.name].filter(Boolean).join(' - ')),
    ]),
  ), [majors]);

  const cohortLabels = useMemo(() => new Map(
    cohorts.map((cohort) => [
      idOf(cohort, 'academicCohortId', 'cohortId', 'id'),
      fixMojibakeText([cohort.code, cohort.name].filter(Boolean).join(' - ')),
    ]),
  ), [cohorts]);

  const selectedProgramId = idOf(selectedProgram, 'trainingProgramId', 'id');

  const filteredCoursesForProgram = useMemo(() => {
    if (!selectedProgram) return courses;
    const departmentId = selectedProgram.departmentId;
    return courses.filter((course) => !departmentId || String(course.departmentId || '') === String(departmentId));
  }, [courses, selectedProgram]);

  const groupedProgramCourses = useMemo(() => {
    const result = new Map<string, Map<string, any[]>>();
    programCourses.forEach((item) => {
      const semesterLabel = semesterLabelOf(item);
      const phase = phaseLabel(item.coursePhase || item.groupCode);
      if (!result.has(semesterLabel)) result.set(semesterLabel, new Map());
      const phaseMap = result.get(semesterLabel)!;
      if (!phaseMap.has(phase)) phaseMap.set(phase, []);
      phaseMap.get(phase)!.push(item);
    });
    return Array.from(result.entries()).map(([semester, phaseMap]) => ({
      semester,
      groups: Array.from(phaseMap.entries()).map(([phase, items]) => ({ phase, items })),
    }));
  }, [programCourses]);

  const resetProgramForm = () => {
    setFormData({
      code: '',
      name: '',
      majorId: '',
      academicCohortId: '',
      academicYear: '',
      departmentId: '',
      totalCredits: 0,
      description: '',
      degreeLevel: 'Đại học',
      educationType: 'Chính quy',
      durationYears: 4,
      maxDurationYears: 6,
      effectiveDate: new Date().toISOString().split('T')[0],
      isActive: true,
    });
  };

  const openCreateDialog = () => {
    setEditingProgram(null);
    resetProgramForm();
    setProgramDialogOpen(true);
  };

  const openEditDialog = async (program: any) => {
    try {
      const data: any = await trainingProgramApi.getById(idOf(program, 'trainingProgramId', 'id'));
      setEditingProgram(data);
      setFormData({
        code: data.code || '',
        name: fixMojibakeText(data.name || data.programName || ''),
        majorId: data.majorId || '',
        academicCohortId: data.academicCohortId || '',
        academicYear: data.academicYear || '',
        departmentId: data.departmentId || '',
        totalCredits: data.totalCredits || 0,
        description: fixMojibakeText(data.description || ''),
        degreeLevel: data.degreeLevel || 'Đại học',
        educationType: data.educationType || 'Chính quy',
        durationYears: data.durationYears || 4,
        maxDurationYears: data.maxDurationYears || 6,
        effectiveDate: data.effectiveDate || new Date().toISOString().split('T')[0],
        isActive: data.isActive !== false,
      });
      setProgramDialogOpen(true);
    } catch (error) {
      toast.error('Không thể lấy thông tin chương trình');
    }
  };

  const saveProgram = async () => {
    const selectedMajor = majors.find((major) => idOf(major, 'majorId', 'id') === formData.majorId);
    const departmentId = formData.departmentId || selectedMajor?.departmentId || '';

    if (!formData.code || !formData.name || !formData.majorId || !formData.academicCohortId || !departmentId) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      const payload = {
        ...formData,
        departmentId,
        programCode: formData.code,
        programName: formData.name,
        admissionYear: `${new Date().getFullYear()}-01-01`,
        totalCredits: Number(formData.totalCredits),
        durationYears: Number(formData.durationYears),
        maxDurationYears: Number(formData.maxDurationYears),
        isActive: true,
      };

      if (editingProgram) {
        await trainingProgramApi.update(idOf(editingProgram, 'trainingProgramId', 'id'), payload);
        toast.success('Cập nhật chương trình thành công');
      } else {
        await trainingProgramApi.create(payload);
        toast.success('Thêm chương trình thành công');
      }
      setProgramDialogOpen(false);
      fetchPrograms();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Thao tác thất bại');
    }
  };

  const deleteProgram = async (program: any) => {
    const programId = idOf(program, 'trainingProgramId', 'id');
    const programName = fixMojibakeText(program.name || program.programName || program.code || 'này');
    if (!confirm(`Bạn có chắc muốn xóa chương trình "${programName}"?`)) return;
    try {
      await trainingProgramApi.delete(programId);
      toast.success('Xóa chương trình thành công');
      fetchPrograms();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Không thể xóa chương trình');
    }
  };

  const loadProgramCourses = async (programId: string) => {
    setCurriculumLoading(true);
    try {
      const data = await trainingProgramCourseApi.search({ trainingProgramId: programId, isActive: true });
      setProgramCourses(toArray(data).map((item: any) => ({
        ...item,
        courseName: fixMojibakeText(item.courseName),
        trainingProgramName: fixMojibakeText(item.trainingProgramName),
        semesterName: fixMojibakeText(item.semesterName),
        prerequisiteCourseName: fixMojibakeText(item.prerequisiteCourseName),
      })));
    } finally {
      setCurriculumLoading(false);
    }
  };

  const openCurriculumDialog = async (program: any) => {
    const programId = idOf(program, 'trainingProgramId', 'id');
    setSelectedProgram(program);
    setProgramCourseForm({ courseId: '', semesterId: '', coursePhase: 'FOUNDATION', isRequired: true });
    setProgramCourses([]);
    setCurriculumOpen(true);
    try {
      await loadProgramCourses(programId);
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Không thể tải môn học trong chương trình');
    }
  };

  const addProgramCourse = async () => {
    if (!selectedProgramId || !programCourseForm.courseId) {
      toast.error('Vui lòng chọn môn học');
      return;
    }
    const course = courses.find((item) => idOf(item, 'courseId', 'id') === programCourseForm.courseId);
    try {
      await trainingProgramCourseApi.create({
        trainingProgramId: selectedProgramId,
        courseId: programCourseForm.courseId,
        semesterId: programCourseForm.semesterId || undefined,
        isRequired: programCourseForm.isRequired,
        groupCode: course?.courseType || programCourseForm.coursePhase,
        credits: Number(course?.credits || 0),
        coursePhase: programCourseForm.coursePhase,
        status: 'ACTIVE',
        isActive: true,
      });
      toast.success('Đã thêm môn vào chương trình đào tạo');
      setProgramCourseForm({ courseId: '', semesterId: '', coursePhase: 'FOUNDATION', isRequired: true });
      await loadProgramCourses(selectedProgramId);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Không thể thêm môn vào chương trình');
    }
  };

  const deleteProgramCourse = async (courseId: string) => {
    if (!selectedProgramId) return;
    try {
      await trainingProgramCourseApi.delete(selectedProgramId, courseId);
      toast.success('Đã xóa môn khỏi chương trình');
      await loadProgramCourses(selectedProgramId);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Không thể xóa môn khỏi chương trình');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Chương trình đào tạo</h1>
          <p className="text-muted-foreground">
            Quản lý chương trình theo khoa, ngành, niên khóa và danh sách môn học theo từng học kỳ.
          </p>
        </div>
        <Button onClick={openCreateDialog} className="bg-green-600 hover:bg-green-700">
          <Plus className="mr-2 h-4 w-4" />
          Thêm chương trình
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm chương trình..."
              className="pl-10"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left text-sm font-semibold">Mã chương trình</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Tên chương trình</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Ngành</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Khoa</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Khóa học</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Tín chỉ</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center">Đang tải...</td>
                  </tr>
                ) : programs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center">Chưa có chương trình đào tạo nào</td>
                  </tr>
                ) : (
                  programs.map((program) => {
                    const programId = idOf(program, 'trainingProgramId', 'id');
                    return (
                      <tr key={programId} className="border-b transition-colors hover:bg-muted/50">
                        <td className="px-4 py-3 text-sm font-medium">{program.code || program.programCode}</td>
                        <td className="px-4 py-3 text-sm">{fixMojibakeText(program.name || program.programName)}</td>
                        <td className="px-4 py-3 text-sm">{fixMojibakeText(program.majorName) || majorLabels.get(program.majorId) || 'Chưa có thông tin'}</td>
                        <td className="px-4 py-3 text-sm">{fixMojibakeText(program.departmentName) || 'Chưa có thông tin'}</td>
                        <td className="px-4 py-3 text-sm">{fixMojibakeText(program.academicCohortName) || program.academicYear || cohortLabels.get(program.academicCohortId) || 'Chưa có thông tin'}</td>
                        <td className="px-4 py-3 text-sm">{program.totalCredits || 0}</td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => openCurriculumDialog(program)} title="Môn trong chương trình">
                              <BookOpen className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => openEditDialog(program)} title="Sửa chương trình">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-destructive" onClick={() => deleteProgram(program)} title="Xóa chương trình">
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
        </CardContent>
      </Card>

      <Dialog open={programDialogOpen} onOpenChange={setProgramDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingProgram ? 'Chỉnh sửa chương trình đào tạo' : 'Thêm chương trình đào tạo mới'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 py-4 md:grid-cols-2">
            <div>
              <Label>Mã chương trình *</Label>
              <Input value={formData.code} onChange={(event) => setFormData({ ...formData, code: event.target.value })} />
            </div>
            <div>
              <Label>Tên chương trình *</Label>
              <Input value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} />
            </div>
            <div>
              <Label>Ngành học *</Label>
              <select
                value={formData.majorId}
                onChange={(event) => {
                  const major = majors.find((item) => idOf(item, 'majorId', 'id') === event.target.value);
                  setFormData({ ...formData, majorId: event.target.value, departmentId: major?.departmentId || '' });
                }}
                className="w-full rounded-md border px-3 py-2"
              >
                <option value="">-- Chọn ngành --</option>
                {majors.map((major) => (
                  <option key={idOf(major, 'majorId', 'id')} value={idOf(major, 'majorId', 'id')}>
                    {major.code} - {fixMojibakeText(major.name)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Khóa học *</Label>
              <select
                value={formData.academicCohortId}
                onChange={(event) => setFormData({ ...formData, academicCohortId: event.target.value })}
                className="w-full rounded-md border px-3 py-2"
              >
                <option value="">-- Chọn khóa --</option>
                {cohorts.map((cohort) => (
                  <option key={idOf(cohort, 'academicCohortId', 'cohortId', 'id')} value={idOf(cohort, 'academicCohortId', 'cohortId', 'id')}>
                    {cohort.code} - {fixMojibakeText(cohort.name)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Năm học</Label>
              <Input value={formData.academicYear} onChange={(event) => setFormData({ ...formData, academicYear: event.target.value })} placeholder="2026-2030" />
            </div>
            <div>
              <Label>Tổng tín chỉ</Label>
              <Input type="number" value={formData.totalCredits} onChange={(event) => setFormData({ ...formData, totalCredits: parseInt(event.target.value) || 0 })} />
            </div>
            <div className="md:col-span-2">
              <Label>Mô tả</Label>
              <Textarea value={formData.description} onChange={(event) => setFormData({ ...formData, description: event.target.value })} rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProgramDialogOpen(false)}>Hủy</Button>
            <Button onClick={saveProgram} className="bg-green-600">Lưu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={curriculumOpen} onOpenChange={setCurriculumOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-5xl">
          <DialogHeader>
            <DialogTitle>
              Môn trong chương trình: {fixMojibakeText(selectedProgram?.name || selectedProgram?.programName || selectedProgram?.code)}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-3 rounded-lg border bg-muted/30 p-4 md:grid-cols-[1.5fr_1fr_1fr_auto]">
            <div>
              <Label>Môn học *</Label>
              <select
                value={programCourseForm.courseId}
                onChange={(event) => setProgramCourseForm({ ...programCourseForm, courseId: event.target.value })}
                className="w-full rounded-md border bg-background px-3 py-2"
              >
                <option value="">-- Chọn môn thuộc khoa --</option>
                {filteredCoursesForProgram.map((course) => (
                  <option key={idOf(course, 'courseId', 'id')} value={idOf(course, 'courseId', 'id')}>
                    {course.code} - {fixMojibakeText(course.name || course.courseName)} ({course.credits || 0} TC)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Học kỳ</Label>
              <select
                value={programCourseForm.semesterId}
                onChange={(event) => setProgramCourseForm({ ...programCourseForm, semesterId: event.target.value })}
                className="w-full rounded-md border bg-background px-3 py-2"
              >
                <option value="">Chưa gán học kỳ</option>
                {semesters.map((semester) => (
                  <option key={semester.semesterId} value={semester.semesterId}>
                    {semester.code} - {fixMojibakeText(semester.name)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Nhóm môn</Label>
              <select
                value={programCourseForm.coursePhase}
                onChange={(event) => setProgramCourseForm({ ...programCourseForm, coursePhase: event.target.value })}
                className="w-full rounded-md border bg-background px-3 py-2"
              >
                <option value="FOUNDATION">Môn cơ sở khoa</option>
                <option value="SPECIALIZED">Môn chuyên sâu ngành</option>
                <option value="ELECTIVE">Môn tự chọn</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button onClick={addProgramCourse} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Thêm môn
              </Button>
            </div>
          </div>

          {curriculumLoading ? (
            <div className="rounded-lg border p-8 text-center text-muted-foreground">Đang tải môn học trong chương trình...</div>
          ) : programCourses.length === 0 ? (
            <div className="rounded-lg border p-8 text-center text-muted-foreground">Chưa có môn học nào trong chương trình.</div>
          ) : (
            <div className="space-y-4">
              {groupedProgramCourses.map((semesterGroup) => (
                <div key={semesterGroup.semester} className="overflow-hidden rounded-lg border">
                  <div className="bg-slate-50 px-4 py-3 font-bold text-slate-900 dark:bg-slate-900 dark:text-white">
                    {semesterGroup.semester}
                  </div>
                  <div className="space-y-4 p-4">
                    {semesterGroup.groups.map((phaseGroup) => (
                      <div key={`${semesterGroup.semester}-${phaseGroup.phase}`} className="rounded-lg border border-slate-200">
                        <div className="flex items-center justify-between border-b bg-white px-4 py-2 dark:bg-slate-950">
                          <span className="font-semibold">{phaseGroup.phase}</span>
                          <span className="text-sm text-muted-foreground">{phaseGroup.items.length} môn</span>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b bg-muted/30">
                                <th className="px-4 py-3 text-left text-sm font-semibold">Mã môn</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Tên môn</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Tín chỉ</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Tiên quyết</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Bắt buộc</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Thao tác</th>
                              </tr>
                            </thead>
                            <tbody>
                              {phaseGroup.items.map((item) => (
                                <tr key={`${item.trainingProgramId}-${item.courseId}`} className="border-b last:border-b-0">
                                  <td className="px-4 py-3 text-sm font-semibold">{item.courseCode || item.courseId}</td>
                                  <td className="px-4 py-3 text-sm">{fixMojibakeText(item.courseName) || 'Chưa rõ tên môn'}</td>
                                  <td className="px-4 py-3 text-sm">{item.credits || '-'}</td>
                                  <td className="px-4 py-3 text-sm">
                                    {item.prerequisiteCourseCode
                                      ? `${item.prerequisiteCourseCode} - ${fixMojibakeText(item.prerequisiteCourseName)}`
                                      : 'Không'}
                                  </td>
                                  <td className="px-4 py-3 text-sm">{item.isRequired === false ? 'Không' : 'Có'}</td>
                                  <td className="px-4 py-3 text-sm">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-destructive"
                                      onClick={() => deleteProgramCourse(item.courseId)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
