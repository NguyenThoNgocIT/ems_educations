'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, BookOpenCheck, GraduationCap, Plus, Save, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

import { academicCohortApi } from '@/api/academic-cohort';
import { administrativeClassApi } from '@/api/administrative-class';
import { majorApi } from '@/api/major';
import { studentApi } from '@/api/student';
import { trainingProgramApi } from '@/api/training-program';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { AcademicCohort, AdministrativeClass, Major, TrainingProgram } from '@/types/lookup';
import type { StudentAdminFormData } from '@/types/student';

type FormErrors = Partial<Record<keyof StudentAdminFormData, string>>;

const isPresent = <T,>(value: T | null | undefined): value is T => value != null;
const getProgramId = (program: TrainingProgram) => program.trainingProgramId || program.programId || program.id || '';
const getProgramCode = (program: TrainingProgram) => program.code || program.programCode || 'CTDT';
const getProgramName = (program: TrainingProgram) => program.name || program.programName || 'Chương trình đào tạo';
const getMajorId = (major: Major) => major.majorId || major.id || '';
const getCohortId = (cohort: AcademicCohort) => cohort.academicCohortId || cohort.cohortId || cohort.id || '';
const getClassId = (classItem: AdministrativeClass) => classItem.classId || classItem.id || '';

export default function CreateStudentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [programs, setPrograms] = useState<TrainingProgram[]>([]);
  const [majors, setMajors] = useState<Major[]>([]);
  const [cohorts, setCohorts] = useState<AcademicCohort[]>([]);
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
    trainingProgramId: '',
    majorId: '',
    academicCohortId: '',
    classId: '',
    admissionDate: '',
    note: '',
  });

  useEffect(() => {
    const fetchLookups = async () => {
      const [programResult, majorResult, cohortResult, classResult] = await Promise.allSettled([
        trainingProgramApi.getAll({ size: 100 }),
        majorApi.getAll({ isActive: true }),
        academicCohortApi.getAll({ isActive: true }),
        administrativeClassApi.getAll({ isActive: true }),
      ]);

      if (programResult.status === 'fulfilled' && isPresent(programResult.value)) {
        setPrograms(programResult.value);
      }
      if (majorResult.status === 'fulfilled' && isPresent(majorResult.value)) {
        setMajors(majorResult.value);
      }
      if (cohortResult.status === 'fulfilled' && isPresent(cohortResult.value)) {
        setCohorts(cohortResult.value);
      }
      if (classResult.status === 'fulfilled' && isPresent(classResult.value)) {
        setClasses(classResult.value);
      }

      const requiredLookupFailed =
        programResult.status === 'rejected' ||
        majorResult.status === 'rejected' ||
        cohortResult.status === 'rejected';

      if (requiredLookupFailed) {
        console.error('Không thể tải đủ danh mục bắt buộc:', {
          programResult,
          majorResult,
          cohortResult,
        });
        toast.error('Không thể tải đủ chương trình, ngành hoặc khóa tuyển sinh');
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
      const enrollData = {
        fullName: formData.fullName,
        studentCode: formData.studentCode || undefined,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        phoneNumber: formData.phoneNumber,
        contactEmail: formData.contactEmail || generateEmail(formData.fullName),
        permanentAddress: formData.permanentAddress,
        trainingProgramId: formData.trainingProgramId,
        majorId: formData.majorId,
        academicCohortId: formData.academicCohortId,
        classId: formData.classId || undefined,
        admissionDate: formData.admissionDate || undefined,
        note: formData.note,
      };

      await studentApi.createAdmin(enrollData);
      toast.success('Thêm sinh viên thành công');
      router.push('/dashboard/admin/students');
    } catch (error: any) {
      console.error('Lỗi thêm sinh viên:', error);
      toast.error(error.response?.data?.message || 'Thêm sinh viên thất bại. API sẽ được khớp ở bước sau.');
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
              <Label htmlFor="studentCode">Mã sinh viên</Label>
              <Input
                id="studentCode"
                value={formData.studentCode}
                onChange={(e) => setField('studentCode', e.target.value)}
                className="mt-1.5 h-10"
                placeholder="Tự sinh nếu để trống"
              />
            </div>

            <div>
              <Label htmlFor="dateOfBirth">Ngày sinh *</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setField('dateOfBirth', e.target.value)}
                className="mt-1.5 h-10"
              />
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
                  <SelectValue placeholder={loadingPrograms ? 'Đang tải chương trình...' : 'Chọn chương trình đào tạo'} />
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
                  <SelectValue placeholder="Chọn ngành" />
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
                  <SelectValue placeholder="Chọn khóa" />
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
                  <SelectValue placeholder="Chọn lớp nếu có" />
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
              <Label htmlFor="admissionDate">Ngày nhập học</Label>
              <Input
                id="admissionDate"
                type="date"
                value={formData.admissionDate}
                onChange={(e) => setField('admissionDate', e.target.value)}
                className="mt-1.5 h-10"
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
