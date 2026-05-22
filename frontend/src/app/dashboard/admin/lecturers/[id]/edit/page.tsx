'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Briefcase, GraduationCap, Save, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

import { degreeApi } from '@/api/degree';
import { departmentApi } from '@/api/department';
import { lecturerApi } from '@/api/lecturer';
import { majorApi } from '@/api/major';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import type { InstructorAdminFormData, InstructorAdminUpdateRequest } from '@/types/instructor';
import type { Degree, Department, Major } from '@/types/lookup';

type FormErrors = Partial<Record<keyof InstructorAdminFormData, string>>;

const contractTypeOptions = [
  { value: 'FULL_TIME', label: 'Toàn thời gian' },
  { value: 'PART_TIME', label: 'Bán thời gian' },
  { value: 'VISITING', label: 'Thỉnh giảng' },
  { value: 'PROBATION', label: 'Thử việc' },
];

const getDepartmentId = (department: Department) => department.departmentId || department.id || '';
const getDegreeId = (degree: Degree) => degree.degreeId || degree.id || '';
const getMajorId = (major: Major) => major.majorId || major.id || '';
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

const academicRankOptions = [
  { value: 'NONE', label: 'Chưa có' },
  { value: 'LECTURER', label: 'Giảng viên' },
  { value: 'SENIOR_LECTURER', label: 'Giảng viên chính' },
  { value: 'ASSOCIATE_PROFESSOR', label: 'Phó giáo sư' },
  { value: 'PROFESSOR', label: 'Giáo sư' },
];

const defaultLecturer: InstructorAdminFormData = {
  fullName: '',
  dateOfBirth: '',
  gender: 'Nam',
  phoneNumber: '',
  contactEmail: '',
  permanentAddress: '',
  employeeCode: '',
  instructorCode: '',
  startWorkDate: '',
  endWorkDate: '',
  contractType: '',
  departmentId: '',
  degreeId: '',
  academicRank: '',
  majorId: '',
  specialization: '',
  institution: '',
  graduationYear: '',
  isActive: true,
  note: '',
};

export default function EditLecturerPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState<boolean>(false);
  const [pageLoading, setPageLoading] = useState<boolean>(true);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [degrees, setDegrees] = useState<Degree[]>([]);
  const [majors, setMajors] = useState<Major[]>([]);
  const [formData, setFormData] = useState<InstructorAdminFormData>(defaultLecturer);
  const [errors, setErrors] = useState<FormErrors>({});

  const getDepartmentLabel = (value: string) => {
    const department = departments.find((item) => getDepartmentId(item) === value);
    return department ? (department.code ? `${department.code} - ${department.name || ''}` : department.name || '') : '';
  };

  const getDegreeLabel = (value: string) => {
    const degree = degrees.find((item) => getDegreeId(item) === value);
    return degree ? (degree.code ? `${degree.code} - ${degree.name || ''}` : degree.name || '') : '';
  };

  const getMajorLabel = (value: string) => {
    const major = majors.find((item) => getMajorId(item) === value);
    return major ? (major.code ? `${major.code} - ${major.name || ''}` : major.name || '') : '';
  };

  const getContractTypeLabel = (value: string) =>
    contractTypeOptions.find((item) => item.value === value)?.label || '';

  const getAcademicRankLabel = (value: string) =>
    academicRankOptions.find((item) => item.value === value)?.label || '';

  const renderSelectLabel = (label: string, placeholder: string) => (
    <span className={label ? 'truncate' : 'truncate text-muted-foreground'}>
      {label || placeholder}
    </span>
  );

  useEffect(() => {
    const fetchLecturer = async () => {
      if (!id) return;

      try {
        const lecturer = await lecturerApi.getById(id);
        setFormData({
          fullName: lecturer.fullName || '',
          dateOfBirth: toDateInputValue(lecturer.dateOfBirth),
          gender: lecturer.gender || 'Nam',
          phoneNumber: lecturer.phoneNumber || '',
          contactEmail: lecturer.contactEmail || '',
          permanentAddress: lecturer.permanentAddress || '',
          employeeCode: lecturer.employeeCode || '',
          instructorCode: lecturer.instructorCode || '',
          startWorkDate: toDateInputValue(lecturer.startWorkDate),
          endWorkDate: toDateInputValue(lecturer.endWorkDate),
          contractType: lecturer.contractType || '',
          departmentId: lecturer.departmentId || '',
          degreeId: lecturer.degreeId || '',
          academicRank: lecturer.academicRank || '',
          majorId: lecturer.majorId || '',
          specialization: lecturer.specialization || '',
          institution: lecturer.institution || '',
          graduationYear: lecturer.graduationYear ? String(lecturer.graduationYear) : '',
          isActive: lecturer.isActive ?? true,
          note: lecturer.note || '',
        });
      } catch (error) {
        console.error(error);
        toast.error('Không thể tải dữ liệu giảng viên');
      } finally {
        setPageLoading(false);
      }
    };

    fetchLecturer();
  }, [id]);

  useEffect(() => {
    const fetchLookups = async () => {
      const [departmentResult, degreeResult, majorResult] = await Promise.allSettled([
        departmentApi.getAll({ isActive: true }),
        degreeApi.getAll({ isActive: true }),
        majorApi.getAll({ isActive: true }),
      ]);

      if (departmentResult.status === 'fulfilled') {
        setDepartments((current) => mergeUnique(current, departmentResult.value, getDepartmentId));
      }
      if (degreeResult.status === 'fulfilled') {
        setDegrees((current) => mergeUnique(current, degreeResult.value, getDegreeId));
      }
      if (majorResult.status === 'fulfilled') {
        setMajors((current) => mergeUnique(current, majorResult.value, getMajorId));
      }

      if (
        departmentResult.status === 'rejected' ||
        degreeResult.status === 'rejected' ||
        majorResult.status === 'rejected'
      ) {
        console.error('Không thể tải đầy đủ danh mục giảng viên', {
          departmentResult,
          degreeResult,
          majorResult,
        });
        toast.warning('Đã tải hồ sơ, nhưng một số danh mục chọn chưa tải được');
      }
    };

    fetchLookups();
  }, []);

  useEffect(() => {
    const fetchCurrentLookupLabels = async () => {
      const [departmentResult, degreeResult, majorResult] = await Promise.allSettled([
        formData.departmentId && !hasValue(departments, formData.departmentId, getDepartmentId)
          ? departmentApi.getById(formData.departmentId)
          : Promise.resolve(null),
        formData.degreeId && !hasValue(degrees, formData.degreeId, getDegreeId)
          ? degreeApi.getById(formData.degreeId)
          : Promise.resolve(null),
        formData.majorId && !hasValue(majors, formData.majorId, getMajorId)
          ? majorApi.getById(formData.majorId)
          : Promise.resolve(null),
      ]);

      if (departmentResult.status === 'fulfilled') {
        const department = departmentResult.value;
        if (isPresent(department)) {
          setDepartments((current) => mergeUnique(current, [department], getDepartmentId));
        }
      }
      if (degreeResult.status === 'fulfilled') {
        const degree = degreeResult.value;
        if (isPresent(degree)) {
          setDegrees((current) => mergeUnique(current, [degree], getDegreeId));
        }
      }
      if (majorResult.status === 'fulfilled') {
        const major = majorResult.value;
        if (isPresent(major)) {
          setMajors((current) => mergeUnique(current, [major], getMajorId));
        }
      }
    };

    fetchCurrentLookupLabels();
  }, [formData.departmentId, formData.degreeId, formData.majorId, departments, degrees, majors]);

  const setField = (field: keyof InstructorAdminFormData, value: string | boolean) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const validate = (): boolean => {
    const nextErrors: FormErrors = {};

    if (!formData.fullName.trim()) nextErrors.fullName = 'Vui lòng nhập họ và tên';
    if (!formData.dateOfBirth) nextErrors.dateOfBirth = 'Vui lòng chọn ngày sinh';
    if (!formData.departmentId) nextErrors.departmentId = 'Vui lòng chọn khoa/bộ môn';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const payload: InstructorAdminUpdateRequest = {
        fullName: formData.fullName,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        phoneNumber: formData.phoneNumber || undefined,
        contactEmail: formData.contactEmail || undefined,
        permanentAddress: formData.permanentAddress || undefined,
        note: formData.note || undefined,
        employeeCode: formData.employeeCode || undefined,
        instructorCode: formData.instructorCode || undefined,
        startWorkDate: formData.startWorkDate || undefined,
        endWorkDate: formData.endWorkDate || undefined,
        contractType: formData.contractType || undefined,
        departmentId: formData.departmentId || undefined,
        degreeId: formData.degreeId || undefined,
        academicRank: formData.academicRank || undefined,
        majorId: formData.majorId || undefined,
        specialization: formData.specialization || undefined,
        institution: formData.institution || undefined,
        graduationYear: formData.graduationYear ? Number(formData.graduationYear) : undefined,
        isActive: formData.isActive,
      };

      await lecturerApi.update(id, payload);
      toast.success('Cập nhật giảng viên thành công');
      router.push('/dashboard/admin/lecturers');
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Cập nhật giảng viên thất bại');
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
                {formData.isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'}
              </Badge>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Chỉnh sửa giảng viên</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Cập nhật hồ sơ giảng viên theo cấu trúc dữ liệu đầy đủ trước khi nối lại API.
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
                <CardDescription>Thông tin định danh và liên hệ của giảng viên.</CardDescription>
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
                <Briefcase className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Thông tin công tác</CardTitle>
                <CardDescription>Mã nhân sự, khoa/bộ môn, hợp đồng và trạng thái làm việc.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-5 pt-5 md:grid-cols-2">
            <div>
              <Label htmlFor="employeeCode">Mã nhân viên</Label>
              <Input id="employeeCode" value={formData.employeeCode} onChange={(e) => setField('employeeCode', e.target.value)} className="mt-1.5 h-10" />
            </div>

            <div>
              <Label htmlFor="instructorCode">Mã giảng viên</Label>
              <Input id="instructorCode" value={formData.instructorCode} onChange={(e) => setField('instructorCode', e.target.value)} className="mt-1.5 h-10" />
            </div>

            <div>
              <Label>Khoa/Bộ môn *</Label>
              <Select value={formData.departmentId} onValueChange={(value) => setField('departmentId', value || '')}>
                <SelectTrigger className="mt-1.5 h-10 w-full">
                  {renderSelectLabel(getDepartmentLabel(formData.departmentId), 'Chọn khoa/bộ môn')}
                </SelectTrigger>
                <SelectContent>
                  {departments.map((department) => (
                    <SelectItem key={getDepartmentId(department)} value={getDepartmentId(department)}>
                      {department.code ? `${department.code} - ${department.name}` : department.name}
                    </SelectItem>
                  ))}
                  {formData.departmentId && !hasValue(departments, formData.departmentId, getDepartmentId) && (
                    <SelectItem value={formData.departmentId}>Đang tải khoa hiện tại</SelectItem>
                  )}
                </SelectContent>
              </Select>
              {errors.departmentId && <p className="mt-1 text-sm text-destructive">{errors.departmentId}</p>}
            </div>

            <div>
              <Label>Loại hợp đồng</Label>
              <Select value={formData.contractType} onValueChange={(value) => setField('contractType', value || '')}>
                <SelectTrigger className="mt-1.5 h-10 w-full">
                  {renderSelectLabel(getContractTypeLabel(formData.contractType), 'Chọn loại hợp đồng')}
                </SelectTrigger>
                <SelectContent>
                  {contractTypeOptions.map((contractType) => (
                    <SelectItem key={contractType.value} value={contractType.value}>
                      {contractType.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="startWorkDate">Ngày bắt đầu làm việc</Label>
              <DatePicker id="startWorkDate" value={formData.startWorkDate} onChange={(value) => setField('startWorkDate', value)} placeholder="Chọn ngày" className="mt-1.5" />
            </div>

            <div>
              <Label htmlFor="endWorkDate">Ngày kết thúc</Label>
              <DatePicker id="endWorkDate" value={formData.endWorkDate} onChange={(value) => setField('endWorkDate', value)} placeholder="Chọn ngày" className="mt-1.5" />
            </div>

            <div>
              <Label>Trạng thái</Label>
              <Select value={formData.isActive ? 'active' : 'inactive'} onValueChange={(value) => setField('isActive', (value || 'active') === 'active')}>
                <SelectTrigger className="mt-1.5 h-10 w-full">
                  {renderSelectLabel(formData.isActive ? 'Đang hoạt động' : 'Ngừng hoạt động', 'Chọn trạng thái')}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Đang hoạt động</SelectItem>
                  <SelectItem value="inactive">Ngừng hoạt động</SelectItem>
                </SelectContent>
              </Select>
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
                <CardTitle>Học hàm, học vị và chuyên môn</CardTitle>
                <CardDescription>Thông tin phục vụ phân công giảng dạy và thống kê nhân sự.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-5 pt-5 md:grid-cols-2">
            <div>
              <Label>Học vị</Label>
              <Select value={formData.degreeId} onValueChange={(value) => setField('degreeId', value || '')}>
                <SelectTrigger className="mt-1.5 h-10 w-full">
                  {renderSelectLabel(getDegreeLabel(formData.degreeId), 'Chọn học vị')}
                </SelectTrigger>
                <SelectContent>
                  {degrees.map((degree) => (
                    <SelectItem key={getDegreeId(degree)} value={getDegreeId(degree)}>
                      {degree.code ? `${degree.code} - ${degree.name}` : degree.name}
                    </SelectItem>
                  ))}
                  {formData.degreeId && !hasValue(degrees, formData.degreeId, getDegreeId) && (
                    <SelectItem value={formData.degreeId}>Đang tải học vị hiện tại</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Học hàm</Label>
              <Select value={formData.academicRank} onValueChange={(value) => setField('academicRank', value || '')}>
                <SelectTrigger className="mt-1.5 h-10 w-full">
                  {renderSelectLabel(getAcademicRankLabel(formData.academicRank), 'Chọn học hàm')}
                </SelectTrigger>
                <SelectContent>
                  {academicRankOptions.map((rank) => (
                    <SelectItem key={rank.value} value={rank.value}>
                      {rank.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Ngành chuyên môn</Label>
              <Select value={formData.majorId} onValueChange={(value) => setField('majorId', value || '')}>
                <SelectTrigger className="mt-1.5 h-10 w-full">
                  {renderSelectLabel(getMajorLabel(formData.majorId), 'Chọn ngành chuyên môn')}
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
            </div>

            <div>
              <Label htmlFor="specialization">Chuyên ngành sâu</Label>
              <Input id="specialization" value={formData.specialization} onChange={(e) => setField('specialization', e.target.value)} className="mt-1.5 h-10" />
            </div>

            <div>
              <Label htmlFor="institution">Cơ sở đào tạo</Label>
              <Input id="institution" value={formData.institution} onChange={(e) => setField('institution', e.target.value)} className="mt-1.5 h-10" />
            </div>

            <div>
              <Label htmlFor="graduationYear">Năm tốt nghiệp</Label>
              <Input id="graduationYear" type="number" value={formData.graduationYear} onChange={(e) => setField('graduationYear', e.target.value)} className="mt-1.5 h-10" />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="note">Ghi chú</Label>
              <Textarea id="note" value={formData.note} onChange={(e) => setField('note', e.target.value)} className="mt-1.5 min-h-24" />
            </div>
          </CardContent>
        </Card>

        <div className="sticky bottom-4 z-10 flex flex-col-reverse gap-3 rounded-xl border bg-background/95 p-3 shadow-lg backdrop-blur sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={() => router.push('/dashboard/admin/lecturers')} className="h-10">
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
                Cập nhật giảng viên
              </span>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
