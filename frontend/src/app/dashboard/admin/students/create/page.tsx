'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, BookOpenCheck, GraduationCap, Plus, Save, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

import { academicCohortApi } from '@/api/academic-cohort';
import { administrativeClassApi } from '@/api/administrative-class';
import { departmentApi } from '@/api/department';
import { majorApi } from '@/api/major';
import { semesterApi } from '@/api/semester';
import { studentApi } from '@/api/student';
import { trainingProgramApi } from '@/api/training-program';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { AcademicCohort, AdministrativeClass, Department, Major, TrainingProgram } from '@/types/lookup';
import type { Semester } from '@/api/admin-resources';
import type { StudentAdminFormData } from '@/types/student';

type FormErrors = Partial<Record<keyof StudentAdminFormData, string>>;

const isPresent = <T,>(value: T | null | undefined): value is T => value != null;
const getProgramId = (program: TrainingProgram) => program.trainingProgramId || program.programId || program.id || '';
const getProgramCode = (program: TrainingProgram) => program.code || program.programCode || 'CTDT';
const getProgramName = (program: TrainingProgram) => program.name || program.programName || 'Chương trình đào tạo';
const getDepartmentId = (department: Department) => department.departmentId || department.id || '';
const getDepartmentName = (department: Department) => department.name || 'Khoa/Bộ môn';
const getMajorId = (major: Major) => major.majorId || major.id || '';
const getCohortId = (cohort: AcademicCohort) => cohort.academicCohortId || cohort.cohortId || cohort.id || '';
const getSemesterId = (semester: Semester) => semester.semesterId || '';
const getSemesterName = (semester: Semester) => semester.name || 'Học kỳ';
const getClassId = (classItem: AdministrativeClass) => classItem.classId || classItem.id || '';

export default function CreateStudentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [programs, setPrograms] = useState<TrainingProgram[]>([]);
  const [majors, setMajors] = useState<Major[]>([]);
  const [cohorts, setCohorts] = useState<AcademicCohort[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [classes, setClasses] = useState<AdministrativeClass[]>([]);
  const [loadingPrograms, setLoadingPrograms] = useState(true);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<StudentAdminFormData>({
    fullName: '',
    studentCode: '',
    dateOfBirth: '',
    gender: 'Nam',
    phoneNumber: '',
    contactEmail: '',
    permanentAddress: '',
    departmentId: '',
    trainingProgramId: '',
    majorId: '',
    academicCohortId: '',
    classId: '',
    semesterId: '',
    admissionDate: '',
    note: '',
  });

  useEffect(() => {
    const fetchLookups = async () => {
      const [departmentResult, programResult, majorResult, cohortResult, semesterResult, classResult] = await Promise.allSettled([
        departmentApi.getAll({ isActive: true }),
        trainingProgramApi.getAll({ size: 100 }),
        majorApi.getAll({ isActive: true }),
        academicCohortApi.getAll({ isActive: true }),
        semesterApi.getAll({ isActive: true }),
        administrativeClassApi.getAll({ isActive: true }),
      ]);

      if (departmentResult.status === 'fulfilled' && isPresent(departmentResult.value)) {
        setDepartments(departmentResult.value);
      }
      if (programResult.status === 'fulfilled' && isPresent(programResult.value)) {
        setPrograms(programResult.value);
      }
      if (majorResult.status === 'fulfilled' && isPresent(majorResult.value)) {
        setMajors(majorResult.value);
      }
      if (cohortResult.status === 'fulfilled' && isPresent(cohortResult.value)) {
        setCohorts(cohortResult.value);
      }
      if (semesterResult.status === 'fulfilled' && isPresent(semesterResult.value)) {
        setSemesters(semesterResult.value);
      }
      if (classResult.status === 'fulfilled' && isPresent(classResult.value)) {
        setClasses(classResult.value);
      }

      const requiredLookupFailed =
        departmentResult.status === 'rejected' ||
        programResult.status === 'rejected' ||
        majorResult.status === 'rejected' ||
        cohortResult.status === 'rejected';

      if (requiredLookupFailed) {
        console.error('Không thể tải đủ danh mục bắt buộc:', {
          departmentResult,
          programResult,
          majorResult,
          cohortResult,
        });
        toast.error('Không thể tải đủ khoa, chương trình, ngành hoặc khóa tuyển sinh');
      }

      if (semesterResult.status === 'rejected') {
        console.warn('Không thể tải học kỳ, có thể không chọn lớp:', semesterResult.reason);
        toast.warning('Chưa tải được danh sách học kỳ. Nếu chọn lớp phải chọn học kỳ.');
      }

      if (classResult.status === 'rejected') {
        console.warn('Không thể tải lớp quản lý, vẫn có thể tạo sinh viên không chọn lớp:', classResult.reason);
        toast.warning('Chưa tải được danh sách lớp quản lý. Có thể bỏ trống trường lớp.');
      }

      setLoadingPrograms(false);
    };

    fetchLookups();
  }, []);

  const selectedProgram = useMemo(
    () => programs.find((program) => getProgramId(program) === formData.trainingProgramId),
    [formData.trainingProgramId, programs],
  );

  const selectedDepartment = useMemo(
    () => departments.find((dept) => getDepartmentId(dept) === formData.departmentId),
    [formData.departmentId, departments],
  );

  const selectedMajor = useMemo(
    () => majors.find((major) => getMajorId(major) === formData.majorId),
    [formData.majorId, majors],
  );

  const selectedCohort = useMemo(
    () => cohorts.find((cohort) => getCohortId(cohort) === formData.academicCohortId),
    [formData.academicCohortId, cohorts],
  );

  const selectedSemester = useMemo(
    () => semesters.find((semester) => getSemesterId(semester) === formData.semesterId),
    [formData.semesterId, semesters],
  );

  const selectedClass = useMemo(
    () => classes.find((classItem) => getClassId(classItem) === formData.classId),
    [formData.classId, classes],
  );

  const renderSelectLabel = (label: string | undefined, placeholder: string) => (
    <span className={label ? 'truncate' : 'truncate text-muted-foreground'}>
      {label || placeholder}
    </span>
  );

  const majorLabel = selectedMajor ? (selectedMajor.code ? `${selectedMajor.code} - ${selectedMajor.name || ''}` : selectedMajor.name || '') : '';
  const departmentLabel = selectedDepartment ? getDepartmentName(selectedDepartment) : '';
  const cohortLabel = selectedCohort ? (selectedCohort.code ? `${selectedCohort.code} - ${selectedCohort.name || ''}` : selectedCohort.name || '') : '';
  const semesterLabel = selectedSemester ? (selectedSemester.code ? `${selectedSemester.code} - ${getSemesterName(selectedSemester) || ''}` : getSemesterName(selectedSemester) || '') : '';
  const classLabel = selectedClass
    ? (selectedClass.classCode ? `${selectedClass.classCode} - ${selectedClass.className || ''}` : selectedClass.className || '')
    : '';

  const setField = (field: keyof StudentAdminFormData, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const generateEmail = (fullName: string) => {
    if (!fullName.trim()) return '';

    const nameParts = fullName.trim().toLowerCase().split(/\s+/);
    const lastName = nameParts[nameParts.length - 1];
    const firstName = nameParts[0];
    return `${lastName}.${firstName}@donga.edu.vn`;
  };

  const handleFullNameChange = (name: string) => {
    setFormData((current) => ({
      ...current,
      fullName: name,
      contactEmail: current.contactEmail || generateEmail(name),
    }));
    setErrors((current) => ({ ...current, fullName: undefined }));
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

  const validate = () => {
    const nextErrors: FormErrors = {};

    if (!formData.fullName.trim()) nextErrors.fullName = 'Vui lòng nhập họ và tên';
    if (!formData.dateOfBirth) nextErrors.dateOfBirth = 'Vui lòng chọn ngày sinh';
    if (!formData.departmentId) nextErrors.departmentId = 'Vui lòng chọn khoa';
    if (!formData.trainingProgramId) nextErrors.trainingProgramId = 'Vui lòng chọn chương trình đào tạo';
    if (!formData.majorId) nextErrors.majorId = 'Vui lòng chọn ngành';
    if (!formData.academicCohortId) nextErrors.academicCohortId = 'Vui lòng chọn khóa tuyển sinh';
    if (formData.classId && !formData.semesterId) nextErrors.semesterId = 'Vui lòng chọn học kỳ khi chọn lớp quản lý';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const enrollData = {
        fullName: formData.fullName,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        phoneNumber: formData.phoneNumber,
        contactEmail: formData.contactEmail || generateEmail(formData.fullName),
        permanentAddress: formData.permanentAddress,
        departmentId: formData.departmentId,
        trainingProgramId: formData.trainingProgramId,
        majorId: formData.majorId,
        academicCohortId: formData.academicCohortId,
        classId: formData.classId || undefined,
        semesterId: formData.semesterId || undefined,
        admissionDate: formData.admissionDate || undefined,
        note: formData.note,
      };

      console.log('Request payload:', JSON.stringify(enrollData, null, 2));
      await studentApi.createAdmin(enrollData);
      toast.success('Thêm sinh viên thành công');
      router.push('/dashboard/admin/students');
    } catch (error: any) {
      console.error('Lỗi thêm sinh viên:', error);
      console.error('Response data:', error.response?.data);
      
      // Extract detailed error message from backend
      let errorMessage = 'Thêm sinh viên thất bại';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        // Handle field-level validation errors
        const errors = error.response.data.errors;
        if (Array.isArray(errors)) {
          errorMessage = errors.map((e: any) => e.message || e).join('; ');
        } else if (typeof errors === 'object') {
          errorMessage = Object.entries(errors)
            .map(([field, msg]) => `${field}: ${msg}`)
            .join('; ');
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

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
              <Badge variant="outline">Sinh viên</Badge>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Thêm sinh viên mới</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Biểu mẫu đã gom đủ các nhóm dữ liệu cần cho hồ sơ người học, chương trình đào tạo và lớp quản lý.
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
                <CardDescription>Dữ liệu dùng để tạo hồ sơ người dùng và tài khoản sinh viên.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-5 pt-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <Label htmlFor="fullName">Họ và tên *</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleFullNameChange(e.target.value)}
                className="mt-1.5 h-10"
                placeholder="VD: Nguyễn Văn A"
              />
              {errors.fullName && <p className="mt-1 text-sm text-destructive">{errors.fullName}</p>}
              <p className="mt-1 text-xs text-muted-foreground">
                Email gợi ý: {formData.contactEmail || 'ten.ho@donga.edu.vn'}
              </p>
            </div>

            <div>
              <Label htmlFor="dateOfBirth">Ngày sinh *</Label>
              <DatePicker
                id="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={(value) => setField('dateOfBirth', value)}
                placeholder="Chọn ngày sinh"
                className="mt-1.5"
              />
              {errors.dateOfBirth && <p className="mt-1 text-sm text-destructive">{errors.dateOfBirth}</p>}
            </div>

            <div>
              <Label>Giới tính</Label>
              <Select value={formData.gender} onValueChange={(value) => setField('gender', value || '')}>
                <SelectTrigger className="mt-1.5 h-10 w-full">
                  {renderSelectLabel(formData.gender, 'Chọn giới tính')}
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
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => setField('phoneNumber', e.target.value)}
                className="mt-1.5 h-10"
                placeholder="VD: 0987654321"
              />
            </div>

            <div>
              <Label htmlFor="contactEmail">Email liên hệ</Label>
              <Input
                id="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setField('contactEmail', e.target.value)}
                className="mt-1.5 h-10"
                placeholder="Để trống sẽ tự động gợi ý"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="permanentAddress">Địa chỉ thường trú</Label>
              <Textarea
                id="permanentAddress"
                value={formData.permanentAddress}
                onChange={(e) => setField('permanentAddress', e.target.value)}
                className="mt-1.5 min-h-24"
                placeholder="Nhập địa chỉ thường trú"
              />
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
                <CardDescription>Các trường bắt buộc để API tạo hồ sơ sinh viên hợp lệ.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-5 pt-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <Label>Khoa/Bộ môn *</Label>
              <Select value={formData.departmentId} onValueChange={(value) => setField('departmentId', value || '')}>
                <SelectTrigger className="mt-1.5 h-10 w-full">
                  {renderSelectLabel(departmentLabel, 'Chọn khoa/bộ môn')}
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={getDepartmentId(dept)} value={getDepartmentId(dept)}>
                      {getDepartmentName(dept)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.departmentId && <p className="mt-1 text-sm text-destructive">{errors.departmentId}</p>}
            </div>

            <div className="md:col-span-2">
              <div className="mb-1.5 flex items-center justify-between gap-3">
                <Label>Chương trình đào tạo *</Label>
                <Button
                  type="button"
                  variant="link"
                  className="h-auto p-0 text-xs text-primary"
                  onClick={() => router.push('/dashboard/admin/training-programs/create')}
                >
                  <Plus className="mr-1 h-3.5 w-3.5" />
                  Thêm chương trình
                </Button>
              </div>
              <Select value={formData.trainingProgramId} onValueChange={handleProgramChange}>
                <SelectTrigger className="h-10 w-full">
                  {renderSelectLabel(
                    selectedProgram ? `${getProgramCode(selectedProgram)} - ${getProgramName(selectedProgram)}` : '',
                    loadingPrograms ? 'Đang tải chương trình...' : 'Chọn chương trình đào tạo',
                  )}
                </SelectTrigger>
                <SelectContent>
                  {programs.map((program) => (
                    <SelectItem key={getProgramId(program)} value={getProgramId(program)}>
                      {getProgramCode(program)} - {getProgramName(program)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.trainingProgramId && <p className="mt-1 text-sm text-destructive">{errors.trainingProgramId}</p>}
              {!loadingPrograms && programs.length === 0 && (
                <p className="mt-1 text-xs text-amber-600">
                  Chưa có dữ liệu chương trình đào tạo từ API. Có thể nhập các trường còn lại và khớp API ở bước sau.
                </p>
              )}
            </div>

            <div>
              <Label>Ngành *</Label>
              <Select value={formData.majorId} onValueChange={(value) => setField('majorId', value || '')}>
                <SelectTrigger className="mt-1.5 h-10 w-full">
                  {renderSelectLabel(majorLabel, 'Chọn ngành')}
                </SelectTrigger>
                <SelectContent>
                  {majors.map((major) => (
                    <SelectItem key={getMajorId(major)} value={getMajorId(major)}>
                      {major.code ? `${major.code} - ${major.name}` : major.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.majorId && <p className="mt-1 text-sm text-destructive">{errors.majorId}</p>}
            </div>

            <div>
              <Label>Khóa tuyển sinh *</Label>
              <Select value={formData.academicCohortId} onValueChange={(value) => setField('academicCohortId', value || '')}>
                <SelectTrigger className="mt-1.5 h-10 w-full">
                  {renderSelectLabel(cohortLabel, 'Chọn khóa')}
                </SelectTrigger>
                <SelectContent>
                  {cohorts.map((cohort) => (
                    <SelectItem key={getCohortId(cohort)} value={getCohortId(cohort)}>
                      {cohort.code ? `${cohort.code} - ${cohort.name}` : cohort.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.academicCohortId && <p className="mt-1 text-sm text-destructive">{errors.academicCohortId}</p>}
            </div>

            <div>
              <Label>Lớp quản lý</Label>
              <Select value={formData.classId} onValueChange={(value) => setField('classId', value || '')}>
                <SelectTrigger className="mt-1.5 h-10 w-full">
                  {renderSelectLabel(classLabel, 'Chọn lớp nếu có')}
                </SelectTrigger>
                <SelectContent>
                  {classes.map((classItem) => (
                    <SelectItem key={getClassId(classItem)} value={getClassId(classItem)}>
                      {classItem.classCode ? `${classItem.classCode} - ${classItem.className}` : classItem.className}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="semesterId">Học kỳ {formData.classId ? '*' : ''}</Label>
              <Select value={formData.semesterId} onValueChange={(value) => setField('semesterId', value || '')}>
                <SelectTrigger className="mt-1.5 h-10 w-full">
                  {renderSelectLabel(semesterLabel, 'Chọn học kỳ nếu có lớp')}
                </SelectTrigger>
                <SelectContent>
                  {semesters.map((semester) => (
                    <SelectItem key={getSemesterId(semester)} value={getSemesterId(semester)}>
                      {semester.code ? `${semester.code} - ${getSemesterName(semester)}` : getSemesterName(semester)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formData.classId && !formData.semesterId && (
                <p className="mt-1 text-sm text-destructive">Học kỳ bắt buộc khi chọn lớp quản lý</p>
              )}
            </div>

            <div>
              <Label htmlFor="admissionDate">Ngày nhập học</Label>
              <DatePicker
                id="admissionDate"
                value={formData.admissionDate}
                onChange={(value) => setField('admissionDate', value)}
                placeholder="Chọn ngày nhập học"
                className="mt-1.5"
              />
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
                <CardDescription>Thông tin bổ sung cho phòng đào tạo khi cần rà soát.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-5">
            <Label htmlFor="note">Ghi chú</Label>
            <Textarea
              id="note"
              value={formData.note}
              onChange={(e) => setField('note', e.target.value)}
              className="mt-1.5 min-h-28"
              placeholder="Nhập ghi chú nếu có"
            />
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
                Lưu sinh viên
              </span>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
