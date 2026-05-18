'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';

// Định nghĩa type cho form data
interface LecturerFormData {
  instructorCode: string;
  employeeCode: string;
  departmentId: string;
  degreeId: string;
  isActive: boolean;
}

interface FormErrors {
  instructorCode?: string;
  employeeCode?: string;
  departmentId?: string;
  degreeId?: string;
}

export default function CreateLecturerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<LecturerFormData>({
    instructorCode: '',
    employeeCode: '',
    departmentId: '',
    degreeId: '',
    isActive: true
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.instructorCode.trim()) newErrors.instructorCode = 'Vui lòng nhập mã giảng viên';
    if (!formData.employeeCode.trim()) newErrors.employeeCode = 'Vui lòng nhập mã nhân viên';
    if (!formData.departmentId) newErrors.departmentId = 'Vui lòng chọn khoa';
    if (!formData.degreeId) newErrors.degreeId = 'Vui lòng chọn học vị';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    // TODO: Gọi API tạo giảng viên
    setTimeout(() => {
      setLoading(false);
      toast.success('Thêm giảng viên thành công');
      router.push('/dashboard/admin/lecturers');
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => router.back()} className="mb-2">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Quay lại
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Thêm giảng viên mới</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label htmlFor="instructorCode">Mã giảng viên *</Label>
                <Input
                  id="instructorCode"
                  value={formData.instructorCode}
                  onChange={(e) => setFormData({ ...formData, instructorCode: e.target.value })}
                  className="mt-1.5"
                  placeholder="GV0001"
                />
                {errors.instructorCode && <p className="text-sm text-destructive mt-1">{errors.instructorCode}</p>}
              </div>

              <div>
                <Label htmlFor="employeeCode">Mã nhân viên *</Label>
                <Input
                  id="employeeCode"
                  value={formData.employeeCode}
                  onChange={(e) => setFormData({ ...formData, employeeCode: e.target.value })}
                  className="mt-1.5"
                  placeholder="NV0001"
                />
                {errors.employeeCode && <p className="text-sm text-destructive mt-1">{errors.employeeCode}</p>}
              </div>

              <div>
                <Label htmlFor="departmentId">Khoa *</Label>
                <Select 
                  value={formData.departmentId} 
                  onValueChange={(val) => setFormData({ ...formData, departmentId: val })}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Chọn khoa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Khoa CNTT">Công nghệ thông tin</SelectItem>
                    <SelectItem value="Khoa KTPM">Kỹ thuật phần mềm</SelectItem>
                    <SelectItem value="Khoa HTTT">Hệ thống thông tin</SelectItem>
                    <SelectItem value="Khoa KHMT">Khoa học máy tính</SelectItem>
                    <SelectItem value="Khoa Kinh tế">Kinh tế</SelectItem>
                    <SelectItem value="Khoa Ngoại ngữ">Ngoại ngữ</SelectItem>
                  </SelectContent>
                </Select>
                {errors.departmentId && <p className="text-sm text-destructive mt-1">{errors.departmentId}</p>}
              </div>

              <div>
                <Label htmlFor="degreeId">Học vị *</Label>
                <Select 
                  value={formData.degreeId} 
                  onValueChange={(val) => setFormData({ ...formData, degreeId: val })}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Chọn học vị" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tiến sĩ">Tiến sĩ</SelectItem>
                    <SelectItem value="Phó giáo sư">Phó giáo sư</SelectItem>
                    <SelectItem value="Thạc sĩ">Thạc sĩ</SelectItem>
                    <SelectItem value="Cử nhân">Cử nhân</SelectItem>
                  </SelectContent>
                </Select>
                {errors.degreeId && <p className="text-sm text-destructive mt-1">{errors.degreeId}</p>}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-white" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Đang lưu...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Thêm mới
                  </span>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push('/dashboard/admin/lecturers')}>
                Hủy
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}