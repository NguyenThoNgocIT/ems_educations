'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';

interface CourseFormData {
  code: string;
  name: string;
  nameEn: string;
  departmentId: string;
  courseType: string;
  credits: number;
  theoryHours: number;
  practiceHours: number;
  selfStudyHours: number;
  description: string;
  isActive: boolean;
}

interface FormErrors {
  code?: string;
  name?: string;
  departmentId?: string;
  credits?: string;
}

// Mock data - sẽ thay bằng API call sau
const mockCourseData: Record<string, CourseFormData> = {
  '1': {
    code: 'CNTT101',
    name: 'Lập trình Web',
    nameEn: 'Web Programming',
    departmentId: 'CNTT',
    courseType: 'Bắt buộc',
    credits: 3,
    theoryHours: 30,
    practiceHours: 30,
    selfStudyHours: 60,
    description: 'Môn học lập trình Web cơ bản',
    isActive: true
  },
  '2': {
    code: 'CNTT102',
    name: 'Cơ sở dữ liệu',
    nameEn: 'Database Systems',
    departmentId: 'CNTT',
    courseType: 'Bắt buộc',
    credits: 4,
    theoryHours: 45,
    practiceHours: 30,
    selfStudyHours: 90,
    description: 'Thiết kế và quản trị CSDL',
    isActive: true
  }
};

export default function EditCoursePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState<boolean>(false);
  const [pageLoading, setPageLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState<CourseFormData>({
    code: '',
    name: '',
    nameEn: '',
    departmentId: '',
    courseType: 'Bắt buộc',
    credits: 3,
    theoryHours: 0,
    practiceHours: 0,
    selfStudyHours: 0,
    description: '',
    isActive: true
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (id) {
      // TODO: Gọi API lấy chi tiết môn học
      setTimeout(() => {
        const data = mockCourseData[id] || {
          code: 'CNTT000',
          name: 'Môn học mẫu',
          nameEn: 'Sample Course',
          departmentId: 'CNTT',
          courseType: 'Bắt buộc',
          credits: 3,
          theoryHours: 30,
          practiceHours: 30,
          selfStudyHours: 60,
          description: '',
          isActive: true
        };
        setFormData(data);
        setPageLoading(false);
      }, 500);
    }
  }, [id]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.code.trim()) newErrors.code = 'Vui lòng nhập mã môn học';
    if (!formData.name.trim()) newErrors.name = 'Vui lòng nhập tên môn học';
    if (!formData.departmentId) newErrors.departmentId = 'Vui lòng chọn khoa';
    if (formData.credits <= 0) newErrors.credits = 'Số tín chỉ phải lớn hơn 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    // TODO: Gọi API cập nhật môn học
    setTimeout(() => {
      setLoading(false);
      toast.success('Cập nhật môn học thành công');
      router.push('/dashboard/admin/courses');
    }, 1000);
  };

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => router.back()} className="mb-2">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Quay lại
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Chỉnh sửa môn học</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label htmlFor="code">Mã môn học *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="mt-1.5"
                  placeholder="CNTT101"
                />
                {errors.code && <p className="text-sm text-destructive mt-1">{errors.code}</p>}
              </div>

              <div>
                <Label htmlFor="credits">Số tín chỉ *</Label>
                <Input
                  id="credits"
                  type="number"
                  value={formData.credits}
                  onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })}
                  className="mt-1.5"
                  placeholder="3"
                />
                {errors.credits && <p className="text-sm text-destructive mt-1">{errors.credits}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="name">Tên môn học *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1.5"
                placeholder="Lập trình Web"
              />
              {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
            </div>

            <div>
              <Label htmlFor="nameEn">Tên môn học (tiếng Anh)</Label>
              <Input
                id="nameEn"
                value={formData.nameEn}
                onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                className="mt-1.5"
                placeholder="Web Programming"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                    <SelectItem value="CNTT">Công nghệ thông tin</SelectItem>
                    <SelectItem value="KTPM">Kỹ thuật phần mềm</SelectItem>
                    <SelectItem value="HTTT">Hệ thống thông tin</SelectItem>
                    <SelectItem value="KHMT">Khoa học máy tính</SelectItem>
                    <SelectItem value="Kinh tế">Kinh tế</SelectItem>
                  </SelectContent>
                </Select>
                {errors.departmentId && <p className="text-sm text-destructive mt-1">{errors.departmentId}</p>}
              </div>

              <div>
                <Label htmlFor="courseType">Loại môn học</Label>
                <Select 
                  value={formData.courseType} 
                  onValueChange={(val) => setFormData({ ...formData, courseType: val })}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bắt buộc">Bắt buộc</SelectItem>
                    <SelectItem value="Tự chọn">Tự chọn</SelectItem>
                    <SelectItem value="Thực tập">Thực tập</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <Label htmlFor="theoryHours">Số tiết lý thuyết</Label>
                <Input
                  id="theoryHours"
                  type="number"
                  value={formData.theoryHours}
                  onChange={(e) => setFormData({ ...formData, theoryHours: parseInt(e.target.value) })}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="practiceHours">Số tiết thực hành</Label>
                <Input
                  id="practiceHours"
                  type="number"
                  value={formData.practiceHours}
                  onChange={(e) => setFormData({ ...formData, practiceHours: parseInt(e.target.value) })}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="selfStudyHours">Số giờ tự học</Label>
                <Input
                  id="selfStudyHours"
                  type="number"
                  value={formData.selfStudyHours}
                  onChange={(e) => setFormData({ ...formData, selfStudyHours: parseInt(e.target.value) })}
                  className="mt-1.5"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1.5"
                rows={4}
                placeholder="Nhập mô tả chi tiết về môn học..."
              />
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
                    Cập nhật
                  </span>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push('/dashboard/admin/courses')}>
                Hủy
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}