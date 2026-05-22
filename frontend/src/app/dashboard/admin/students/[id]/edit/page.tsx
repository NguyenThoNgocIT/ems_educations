'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, BookOpenCheck, GraduationCap, Save, UserPlus, Copy } from 'lucide-react';
import { toast } from 'sonner';

import { academicCohortApi } from '@/api/academic-cohort';
import { administrativeClassApi } from '@/api/administrative-class';
import { majorApi } from '@/api/major';
import { studentApi } from '@/api/student';
import { trainingProgramApi } from '@/api/training-program';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import type { AcademicCohort, AdministrativeClass, Major, TrainingProgram } from '@/types/lookup';
import type { StudentAdminFormData, StudentAdminUpdateRequest } from '@/types/student';

type FormErrors = Partial<Record<keyof StudentAdminFormData, string>>;

const getProgramId = (program: TrainingProgram) => program.trainingProgramId || program.programId || program.id || '';
const getProgramCode = (program: TrainingProgram) => program.code || program.programCode || 'CTDT';
const getProgramName = (program: TrainingProgram) => program.name || program.programName || 'Chương trình đào tạo';
const getMajorId = (major: Major) => major.majorId || major.id || '';
const getCohortId = (cohort: AcademicCohort) => cohort.academicCohortId || cohort.cohortId || cohort.id || '';
const getClassId = (classItem: AdministrativeClass) => classItem.classId || classItem.id || '';
const toDateInputValue = (value?: string) => (value ? value.slice(0, 10) : '');
const hasValue = <T,>(items: T[], value: string, getId: (item: T) => string) =>
  Boolean(value) && items.some((item) => getId(item) === value);
const isPresent = <T,>(value: T | null | undefined): value is T => value != null;
const mergeUnique = <T,>(current: T[], incoming: T[], getId: (item: T) => string) => {
  const seen = new Set(current.map(getId).filter(Boolean));
  const next = [...current];

  incoming.forEach((item) => {
    const id = getId(item);
    if (id && !seen.has(id)) {
      seen.add(id);
      next.push(item);
    }
  });

  return next;
};

export default function EditStudentPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState<boolean>(false);
  const [pageLoading, setPageLoading] = useState<boolean>(true);
  const [programs, setPrograms] = useState<TrainingProgram[]>([]);
  const [majors, setMajors] = useState<Major[]>([]);
  const [cohorts, setCohorts] = useState<AcademicCohort[]>([]);
  const [classes, setClasses] = useState<AdministrativeClass[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<StudentAdminFormData>({
    fullName: '',
    studentCode: '',
    dateOfBirth: '',
    gender: 'Nam',
    departmentId: '',
    semesterId: '',
    phoneNumber: '',
    contactEmail: '',
    permanentAddress: '',
    trainingProgramId: '',
    majorId: '',
    academicCohortId: '',
    classId: '',
    admissionDate: '',
    isActive: true,
    note: '',
  });

  const getProgramLabel = (value: string) => {
    const program = programs.find((item) => getProgramId(item) === value);
    return program ? `${getProgramCode(program)} - ${getProgramName(program)}` : '';
  };

  const getMajorLabel = (value: string) => {
    const major = majors.find((item) => getMajorId(item) === value);
    return major ? (major.code ? `${major.code} - ${major.name || ''}` : major.name || '') : '';
  };

  const getCohortLabel = (value: string) => {
    const cohort = cohorts.find((item) => getCohortId(item) === value);
    return cohort ? (cohort.code ? `${cohort.code} - ${cohort.name || ''}` : cohort.name || '') : '';
  };

  const getClassLabel = (value: string) => {
    const classItem = classes.find((item) => getClassId(item) === value);
    return classItem ? (classItem.classCode ? `${classItem.classCode} - ${classItem.className || ''}` : classItem.className || '') : '';
  };

  const renderSelectLabel = (label: string, placeholder: string) => (
    <span className={label ? 'truncate' : 'truncate text-muted-foreground'}>
      {label || placeholder}
    </span>
  );

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        const student = await studentApi.getById(id);
        setFormData({
          fullName: student.fullName || '',
          studentCode: student.studentCode || '',
          dateOfBirth: toDateInputValue(student.dateOfBirth),
          departmentId: (student as any).departmentId || '',
          semesterId: (student as any).semesterId || '',
          gender: student.gender || 'Nam',
          phoneNumber: student.phoneNumber || '',
          contactEmail: student.contactEmail || '',
          permanentAddress: student.permanentAddress || '',
          trainingProgramId: student.trainingProgramId || '',
          majorId: student.majorId || '',
          academicCohortId: student.academicCohortId || '',
          classId: student.classId || '',
          admissionDate: toDateInputValue(student.admissionDate),
          isActive: student.isActive ?? true,
          note: student.note || '',
        });
      } catch (error) {
        console.error(error);
        toast.error('Không thể tải dữ liệu sinh viên');
      } finally {
        setPageLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchLookups = async () => {
      const [programResult, majorResult, cohortResult, classResult] = await Promise.allSettled([
        trainingProgramApi.getAll({ size: 100 }),
        majorApi.getAll({ isActive: true }),
        academicCohortApi.getAll({ isActive: true }),
        administrativeClassApi.getAll({ isActive: true }),
      ]);

      if (programResult.status === 'fulfilled') {
        setPrograms((current) => mergeUnique(current, programResult.value, getProgramId));
      }
      if (majorResult.status === 'fulfilled') {
        setMajors((current) => mergeUnique(current, majorResult.value, getMajorId));
      }
      if (cohortResult.status === 'fulfilled') {
        setCohorts((current) => mergeUnique(current, cohortResult.value, getCohortId));
      }
      if (classResult.status === 'fulfilled') {
        setClasses((current) => mergeUnique(current, classResult.value, getClassId));
      }

      if (
        programResult.status === 'rejected' ||
        majorResult.status === 'rejected' ||
        cohortResult.status === 'rejected' ||
        classResult.status === 'rejected'
      ) {
        console.error('Không thể tải đầy đủ danh mục sinh viên', {
          programResult,
          majorResult,
          cohortResult,
          classResult,
        });
        toast.warning('Đã tải hồ sơ, nhưng một số danh mục chọn chưa tải được');
      }
    };

    fetchLookups();
  }, []);

  useEffect(() => {
    const fetchCurrentLookupLabels = async () => {
      const [programResult, majorResult, cohortResult, classResult] = await Promise.allSettled([
        formData.trainingProgramId && !hasValue(programs, formData.trainingProgramId, getProgramId)
          ? trainingProgramApi.getById(formData.trainingProgramId)
          : Promise.resolve(null),
        formData.majorId && !hasValue(majors, formData.majorId, getMajorId)
          ? majorApi.getById(formData.majorId)
          : Promise.resolve(null),
        formData.academicCohortId && !hasValue(cohorts, formData.academicCohortId, getCohortId)
          ? academicCohortApi.getById(formData.academicCohortId)
          : Promise.resolve(null),
        formData.classId && !hasValue(classes, formData.classId, getClassId)
          ? administrativeClassApi.getById(formData.classId)
          : Promise.resolve(null),
      ]);

      if (programResult.status === 'fulfilled') {
        const program = programResult.value;
        if (isPresent(program)) {
          setPrograms((current) => mergeUnique(current, [program], getProgramId));
        }
      }
      if (majorResult.status === 'fulfilled') {
        const major = majorResult.value;
        if (isPresent(major)) {
          setMajors((current) => mergeUnique(current, [major], getMajorId));
        }
      }
      if (cohortResult.status === 'fulfilled') {
        const cohort = cohortResult.value;
        if (isPresent(cohort)) {
          setCohorts((current) => mergeUnique(current, [cohort], getCohortId));
        }
      }
      if (classResult.status === 'fulfilled') {
        const classItem = classResult.value;
        if (isPresent(classItem)) {
          setClasses((current) => mergeUnique(current, [classItem], getClassId));
        }
      }
    };

    fetchCurrentLookupLabels();
  }, [
    formData.trainingProgramId,
    formData.majorId,
    formData.academicCohortId,
    formData.classId,
    programs,
    majors,
    cohorts,
    classes,
  ]);

  const selectedProgram = useMemo(
    () => programs.find((program) => getProgramId(program) === formData.trainingProgramId),
    [formData.trainingProgramId, programs],
  );

  const setField = (field: keyof StudentAdminFormData, value: string | boolean) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleProgramChange = (programId: string | null) => {
    if (!programId) {
      setField('trainingProgramId', '');
      return;
    }

    const program = programs.find((item) => getProgramId(item) === programId);
    setFormData((current) => ({
      ...current,
      trainingProgramId: programId,
      majorId: program?.majorId || current.majorId,
      academicCohortId: program?.academicCohortId || current.academicCohortId,
    }));
    setErrors((current) => ({ ...current, trainingProgramId: undefined }));
  };

  const validate = (): boolean => {
    const nextErrors: FormErrors = {};

    if (!formData.fullName.trim()) nextErrors.fullName = 'Vui lòng nhập họ và tên';
    if (!formData.dateOfBirth) nextErrors.dateOfBirth = 'Vui lòng chọn ngày sinh';
    if (!formData.trainingProgramId) nextErrors.trainingProgramId = 'Vui lòng chọn chương trình đào tạo';
    if (!formData.majorId) nextErrors.majorId = 'Vui lòng chọn ngành';
    if (!formData.academicCohortId) nextErrors.academicCohortId = 'Vui lòng chọn khóa tuyển sinh';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const payload: StudentAdminUpdateRequest = {
        fullName: formData.fullName,
        studentCode: formData.studentCode || undefined,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        phoneNumber: formData.phoneNumber || undefined,
        contactEmail: formData.contactEmail || undefined,
        permanentAddress: formData.permanentAddress || undefined,
        trainingProgramId: formData.trainingProgramId,
        majorId: formData.majorId,
        academicCohortId: formData.academicCohortId,
        classId: formData.classId || undefined,
        admissionDate: formData.admissionDate || undefined,
        isActive: formData.isActive,
        note: formData.note || undefined,
      };

      await studentApi.update(id, payload);
      toast.success('Cập nhật sinh viên thành công');
      router.push('/dashboard/admin/students');
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Cập nhật sinh viên thất bại. API sẽ được khớp ở bước sau.');
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3">
          <Button variant="ghost" onClick={() => router.back()} className="w-fit px-2 text-muted-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                Quản trị đào tạo
              </Badge>
              <Badge variant={formData.isActive ? 'default' : 'secondary'}>
                {formData.isActive ? 'Đang học' : 'Ngừng học'}
              </Badge>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Chỉnh sửa sinh viên</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Cập nhật hồ sơ cá nhân, chương trình học và trạng thái đào tạo của sinh viên.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Card className="border-primary/10 shadow-sm">
          <CardHeader className="border-b border-border/70">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <UserPlus className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Thông tin cá nhân</CardTitle>
                <CardDescription>Thông tin định danh và liên hệ của sinh viên.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-5 pt-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <Label htmlFor="fullName">Họ và tên *</Label>
              <Input id="fullName" value={formData.fullName} onChange={(e) => setField('fullName', e.target.value)} className="mt-1.5 h-10" />
              {errors.fullName && <p className="mt-1 text-sm text-destructive">{errors.fullName}</p>}
            </div>

            <div>
              <Label htmlFor="studentCode">Mã sinh viên</Label>
              <Input id="studentCode" value={formData.studentCode} onChange={(e) => setField('studentCode', e.target.value)} className="mt-1.5 h-10" />
            </div>

            {/* Student ID removed from edit form per request */}

            <div>
              <Label htmlFor="dateOfBirth">Ngày sinh *</Label>
              <DatePicker id="dateOfBirth" value={formData.dateOfBirth} onChange={(value) => setField('dateOfBirth', value)} placeholder="Chọn ngày sinh" className="mt-1.5" />
              {errors.dateOfBirth && <p className="mt-1 text-sm text-destructive">{errors.dateOfBirth}</p>}
            </div>

            <div>
              <Label>Giới tính</Label>
              <Select value={formData.gender} onValueChange={(value) => setField('gender', value || '')}>
                <SelectTrigger className="mt-1.5 h-10 w-full">
                  <SelectValue placeholder="Chọn giới tính" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nam">Nam</SelectItem>
                  <SelectItem value="Nữ">Nữ</SelectItem>
                  <SelectItem value="Khác">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="phoneNumber">Số điện thoại</Label>
              <Input id="phoneNumber" value={formData.phoneNumber} onChange={(e) => setField('phoneNumber', e.target.value)} className="mt-1.5 h-10" />
            </div>

            <div>
              <Label htmlFor="contactEmail">Email liên hệ</Label>
              <Input id="contactEmail" type="email" value={formData.contactEmail} onChange={(e) => setField('contactEmail', e.target.value)} className="mt-1.5 h-10" />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="permanentAddress">Địa chỉ thường trú</Label>
              <Textarea id="permanentAddress" value={formData.permanentAddress} onChange={(e) => setField('permanentAddress', e.target.value)} className="mt-1.5 min-h-24" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/10 shadow-sm">
          <CardHeader className="border-b border-border/70">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Chương trình học</CardTitle>
                <CardDescription>Thông tin học vụ chính của sinh viên.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-5 pt-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <Label>Chương trình đào tạo *</Label>
              <Select value={formData.trainingProgramId} onValueChange={handleProgramChange}>
                <SelectTrigger className="mt-1.5 h-10 w-full">
                  {renderSelectLabel(getProgramLabel(formData.trainingProgramId), 'Chọn chương trình đào tạo')}
                </SelectTrigger>
                <SelectContent>
                  {programs.map((program) => (
                    <SelectItem key={getProgramId(program)} value={getProgramId(program)}>
                      {getProgramCode(program)} - {getProgramName(program)}
                    </SelectItem>
                  ))}
                  {formData.trainingProgramId && !hasValue(programs, formData.trainingProgramId, getProgramId) && (
                    <SelectItem value={formData.trainingProgramId}>Đang tải chương trình hiện tại</SelectItem>
                  )}
                </SelectContent>
              </Select>
              {errors.trainingProgramId && <p className="mt-1 text-sm text-destructive">{errors.trainingProgramId}</p>}
            </div>

            <div>
              <Label>Ngành *</Label>
              <Select value={formData.majorId} onValueChange={(value) => setField('majorId', value || '')}>
                <SelectTrigger className="mt-1.5 h-10 w-full">
                  {renderSelectLabel(getMajorLabel(formData.majorId), 'Chọn ngành')}
                </SelectTrigger>
                <SelectContent>
                  {majors.map((major) => (
                    <SelectItem key={getMajorId(major)} value={getMajorId(major)}>
                      {major.code ? `${major.code} - ${major.name}` : major.name}
                    </SelectItem>
                  ))}
                  {formData.majorId && !hasValue(majors, formData.majorId, getMajorId) && (
                    <SelectItem value={formData.majorId}>Đang tải ngành hiện tại</SelectItem>
                  )}
                </SelectContent>
              </Select>
              {errors.majorId && <p className="mt-1 text-sm text-destructive">{errors.majorId}</p>}
            </div>

            <div>
              <Label>Khóa tuyển sinh *</Label>
              <Select value={formData.academicCohortId} onValueChange={(value) => setField('academicCohortId', value || '')}>
                <SelectTrigger className="mt-1.5 h-10 w-full">
                  {renderSelectLabel(getCohortLabel(formData.academicCohortId), 'Chọn khóa')}
                </SelectTrigger>
                <SelectContent>
                  {cohorts.map((cohort) => (
                    <SelectItem key={getCohortId(cohort)} value={getCohortId(cohort)}>
                      {cohort.code ? `${cohort.code} - ${cohort.name}` : cohort.name}
                    </SelectItem>
                  ))}
                  {formData.academicCohortId && !hasValue(cohorts, formData.academicCohortId, getCohortId) && (
                    <SelectItem value={formData.academicCohortId}>Đang tải khóa hiện tại</SelectItem>
                  )}
                </SelectContent>
              </Select>
              {errors.academicCohortId && <p className="mt-1 text-sm text-destructive">{errors.academicCohortId}</p>}
            </div>

            <div>
              <Label>Lớp quản lý</Label>
              <Select value={formData.classId} onValueChange={(value) => setField('classId', value || '')}>
                <SelectTrigger className="mt-1.5 h-10 w-full">
                  {renderSelectLabel(getClassLabel(formData.classId), 'Chọn lớp nếu có')}
                </SelectTrigger>
                <SelectContent>
                  {classes.map((classItem) => (
                    <SelectItem key={getClassId(classItem)} value={getClassId(classItem)}>
                      {classItem.classCode ? `${classItem.classCode} - ${classItem.className}` : classItem.className}
                    </SelectItem>
                  ))}
                  {formData.classId && !hasValue(classes, formData.classId, getClassId) && (
                    <SelectItem value={formData.classId}>Đang tải lớp hiện tại</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="admissionDate">Ngày nhập học</Label>
              <DatePicker id="admissionDate" value={formData.admissionDate} onChange={(value) => setField('admissionDate', value)} placeholder="Chọn ngày nhập học" className="mt-1.5" />
            </div>

            <div>
              <Label>Trạng thái</Label>
              <Select value={formData.isActive ? 'active' : 'inactive'} onValueChange={(value) => setField('isActive', (value || 'active') === 'active')}>
                <SelectTrigger className="mt-1.5 h-10 w-full">
                  {renderSelectLabel(formData.isActive ? 'Đang học' : 'Ngừng học', 'Chọn trạng thái')}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Đang học</SelectItem>
                  <SelectItem value="inactive">Ngừng học</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedProgram && (
              <div className="md:col-span-2 rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm text-primary">
                Đã chọn: {getProgramCode(selectedProgram)} - {getProgramName(selectedProgram)}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-primary/10 shadow-sm">
          <CardHeader className="border-b border-border/70">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <BookOpenCheck className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Ghi chú hồ sơ</CardTitle>
                <CardDescription>Thông tin bổ sung phục vụ rà soát hồ sơ sinh viên.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-5">
            <Label htmlFor="note">Ghi chú</Label>
            <Textarea id="note" value={formData.note} onChange={(e) => setField('note', e.target.value)} className="mt-1.5 min-h-28" />
          </CardContent>
        </Card>

        <div className="sticky bottom-4 z-10 flex flex-col-reverse gap-3 rounded-xl border bg-background/95 p-3 shadow-lg backdrop-blur sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={() => router.push('/dashboard/admin/students')} className="h-10">
            Hủy bỏ
          </Button>
          <Button type="submit" disabled={loading} className="h-10 bg-primary text-primary-foreground hover:bg-primary/90">
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                Đang lưu
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Cập nhật sinh viên
              </span>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
