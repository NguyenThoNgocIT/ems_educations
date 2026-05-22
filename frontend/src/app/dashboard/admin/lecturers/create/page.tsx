'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { Textarea } from '@/components/ui/textarea';
import type { InstructorAdminCreateRequest, InstructorAdminFormData } from '@/types/instructor';
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

const academicRankOptions = [
  { value: 'NONE', label: 'Chưa có' },
  { value: 'LECTURER', label: 'Giảng viên' },
  { value: 'SENIOR_LECTURER', label: 'Giảng viên chính' },
  { value: 'ASSOCIATE_PROFESSOR', label: 'Phó giáo sư' },
  { value: 'PROFESSOR', label: 'Giáo sư' },
];

export default function CreateLecturerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [degrees, setDegrees] = useState<Degree[]>([]);
  const [majors, setMajors] = useState<Major[]>([]);
  const [formData, setFormData] = useState<InstructorAdminFormData>({
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
    note: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    const fetchLookups = async () => {
      try {
        const [departmentData, degreeData, majorData] = await Promise.all([
          departmentApi.getAll({ isActive: true }),
          degreeApi.getAll({ isActive: true }),
          majorApi.getAll({ isActive: true }),
        ]);

        setDepartments(departmentData);
        setDegrees(degreeData);
        setMajors(majorData);
      } catch (error) {
        console.error(error);
        toast.error('Không thể tải dữ liệu danh mục giảng viên');
      }
    };

    fetchLookups();
  }, []);

  const setField = (field: keyof InstructorAdminFormData, value: string) => {
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
      const payload: InstructorAdminCreateRequest = {
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
        departmentId: formData.departmentId,
        degreeId: formData.degreeId || undefined,
        academicRank: formData.academicRank || undefined,
        majorId: formData.majorId || undefined,
        specialization: formData.specialization || undefined,
        institution: formData.institution || undefined,
        graduationYear: formData.graduationYear ? Number(formData.graduationYear) : undefined,
      };

      await lecturerApi.create(payload);
      toast.success('Thêm giảng viên thành công');
      router.push('/dashboard/admin/lecturers');
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Thêm giảng viên thất bại');
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
              <Badge variant="outline">Giảng viên</Badge>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Thêm giảng viên mới</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Nhập đầy đủ hồ sơ cá nhân, thông tin công tác và chuyên môn để sẵn sàng kết nối API quản trị.
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
                <CardDescription>Dữ liệu dùng để tạo hồ sơ người dùng và tài khoản đăng nhập.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-5 pt-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <Label htmlFor="fullName">Họ và tên *</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setField('fullName', e.target.value)}
                className="mt-1.5 h-10"
                placeholder="VD: Nguyễn Văn An"
              />
              {errors.fullName && <p className="mt-1 text-sm text-destructive">{errors.fullName}</p>}
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
                placeholder="name@donga.edu.vn"
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
                <Briefcase className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Thông tin công tác</CardTitle>
                <CardDescription>Các trường tương ứng hồ sơ nhân sự và hồ sơ giảng viên.</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="border-primary/10 shadow-sm">
          <CardHeader className="border-b border-border/70">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Học hàm, học vị và chuyên môn</CardTitle>
                <CardDescription>Phần này khớp với nhóm trường chuyên môn của API giảng viên.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-5 pt-5 md:grid-cols-2">
            <div>
              <Label>Học vị</Label>
              <Select value={formData.degreeId} onValueChange={(value) => setField('degreeId', value || '')}>
                <SelectTrigger className="mt-1.5 h-10 w-full">
                  <SelectValue placeholder="Chọn học vị" />
                </SelectTrigger>
                <SelectContent>
                  {degrees.map((degree) => (
                    <SelectItem key={getDegreeId(degree)} value={getDegreeId(degree)}>
                      {degree.code ? `${degree.code} - ${degree.name}` : degree.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Học hàm</Label>
              <Select value={formData.academicRank} onValueChange={(value) => setField('academicRank', value || '')}>
                <SelectTrigger className="mt-1.5 h-10 w-full">
                  <SelectValue placeholder="Chọn học hàm" />
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
                  <SelectValue placeholder="Chọn ngành chuyên môn" />
                </SelectTrigger>
                <SelectContent>
                  {majors.map((major) => (
                    <SelectItem key={getMajorId(major)} value={getMajorId(major)}>
                      {major.code ? `${major.code} - ${major.name}` : major.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="specialization">Chuyên ngành sâu</Label>
              <Input
                id="specialization"
                value={formData.specialization}
                onChange={(e) => setField('specialization', e.target.value)}
                className="mt-1.5 h-10"
                placeholder="VD: Công nghệ phần mềm"
              />
            </div>

            <div>
              <Label htmlFor="institution">Cơ sở đào tạo</Label>
              <Input
                id="institution"
                value={formData.institution}
                onChange={(e) => setField('institution', e.target.value)}
                className="mt-1.5 h-10"
                placeholder="VD: Đại học Đông Á"
              />
            </div>

            <div>
              <Label htmlFor="graduationYear">Năm tốt nghiệp</Label>
              <Input
                id="graduationYear"
                type="number"
                value={formData.graduationYear}
                onChange={(e) => setField('graduationYear', e.target.value)}
                className="mt-1.5 h-10"
                placeholder="VD: 2024"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="note">Ghi chú</Label>
              <Textarea
                id="note"
                value={formData.note}
                onChange={(e) => setField('note', e.target.value)}
                className="mt-1.5 min-h-24"
                placeholder="Nhập ghi chú nội bộ nếu có"
              />
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
                Lưu giảng viên
              </span>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
