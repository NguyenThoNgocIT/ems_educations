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

interface StudentFormData {
  personId: string;
  studentCode: string;
  trainingProgramId: string;
  note: string;
}

interface FormErrors {
  personId?: string;
  studentCode?: string;
  trainingProgramId?: string;
}

export default function EditStudentPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  
  const [loading, setLoading] = useState<boolean>(false);
  const [pageLoading, setPageLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState<StudentFormData>({
    personId: '',
    studentCode: '',
    trainingProgramId: '',
    note: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});

  // Load dữ liệu khi có id
  useEffect(() => {
    if (id) {
      // TODO: Gọi API lấy chi tiết sinh viên
      setTimeout(() => {
        setFormData({
          personId: 'P000001',
          studentCode: 'SV0001',
          trainingProgramId: 'CNTT',
          note: 'Sinh viên năm 3'
        });
        setPageLoading(false);
      }, 500);
    }
  }, [id]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.personId.trim()) newErrors.personId = 'Vui lòng nhập mã cá nhân';
    if (!formData.studentCode.trim()) newErrors.studentCode = 'Vui lòng nhập mã sinh viên';
    if (!formData.trainingProgramId) newErrors.trainingProgramId = 'Vui lòng chọn chương trình đào tạo';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    // TODO: Gọi API cập nhật sinh viên
    setTimeout(() => {
      setLoading(false);
      toast.success('Cập nhật sinh viên thành công');
      router.push('/dashboard/admin/students');
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
          <CardTitle>Chỉnh sửa sinh viên</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label htmlFor="personId">Mã cá nhân *</Label>
                <Input
                  id="personId"
                  value={formData.personId}
                  onChange={(e) => setFormData({ ...formData, personId: e.target.value })}
                  className="mt-1.5"
                  placeholder="P000001"
                />
                {errors.personId && <p className="text-sm text-destructive mt-1">{errors.personId}</p>}
              </div>

              <div>
                <Label htmlFor="studentCode">Mã sinh viên *</Label>
                <Input
                  id="studentCode"
                  value={formData.studentCode}
                  onChange={(e) => setFormData({ ...formData, studentCode: e.target.value })}
                  className="mt-1.5"
                  placeholder="SV0001"
                />
                {errors.studentCode && <p className="text-sm text-destructive mt-1">{errors.studentCode}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="trainingProgramId">Chương trình đào tạo *</Label>
              <Select 
                value={formData.trainingProgramId} 
                onValueChange={(val) => setFormData({ ...formData, trainingProgramId: val })}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Chọn chương trình" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CNTT">Công nghệ thông tin</SelectItem>
                  <SelectItem value="KTPM">Kỹ thuật phần mềm</SelectItem>
                  <SelectItem value="HTTT">Hệ thống thông tin</SelectItem>
                  <SelectItem value="KHMT">Khoa học máy tính</SelectItem>
                </SelectContent>
              </Select>
              {errors.trainingProgramId && <p className="text-sm text-destructive mt-1">{errors.trainingProgramId}</p>}
            </div>

            <div>
              <Label htmlFor="note">Ghi chú</Label>
              <Textarea
                id="note"
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                className="mt-1.5"
                placeholder="Nhập ghi chú (nếu có)"
                rows={4}
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
              <Button type="button" variant="outline" onClick={() => router.push('/dashboard/admin/students')}>
                Hủy
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}