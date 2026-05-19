'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, User, Calendar, Phone, Mail, GraduationCap, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { studentApi } from '@/api/student';
import { trainingProgramApi } from '@/api/training-program';

interface StudentFormData {
  fullName: string;
  dateOfBirth: string;
  gender: string;
  phoneNumber: string;
  contactEmail: string;
  studentCode: string;
  trainingProgramId: string;
  note: string;
  isActive: boolean;
}

interface FormErrors {
  fullName?: string;
  studentCode?: string;
  trainingProgramId?: string;
}

export default function EditStudentPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  
  const [loading, setLoading] = useState<boolean>(false);
  const [pageLoading, setPageLoading] = useState<boolean>(true);
  const [programs, setPrograms] = useState<any[]>([]);
  const [formData, setFormData] = useState<StudentFormData>({
    fullName: '',
    dateOfBirth: '',
    gender: 'male',
    phoneNumber: '',
    contactEmail: '',
    studentCode: '',
    trainingProgramId: '',
    note: '',
    isActive: true
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const [studentRes, programRes]: any = await Promise.all([
          studentApi.getById(id),
          trainingProgramApi.getAll({ size: 100 })
        ]);

        const student = studentRes?.data || studentRes;
        
        let programsList = [];
        if (programRes && Array.isArray(programRes)) {
          programsList = programRes;
        } else if (programRes && programRes.data && Array.isArray(programRes.data)) {
          programsList = programRes.data;
        } else if (programRes && programRes.content && Array.isArray(programRes.content)) {
          programsList = programRes.content;
        } else if (programRes && programRes.data?.content && Array.isArray(programRes.data.content)) {
          programsList = programRes.data.content;
        }
        setPrograms(programsList);
        
        setFormData({
          fullName: student.fullName || '',
          dateOfBirth: student.dateOfBirth || '',
          gender: student.gender || 'male',
          phoneNumber: student.phoneNumber || '',
          contactEmail: student.contactEmail || '',
          studentCode: student.studentCode || '',
          trainingProgramId: student.trainingProgramId || '',
          note: student.note || '',
          isActive: student.isActive ?? true
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

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Vui lòng nhập họ tên';
    if (!formData.studentCode.trim()) newErrors.studentCode = 'Vui lòng nhập mã sinh viên';
    if (!formData.trainingProgramId) newErrors.trainingProgramId = 'Vui lòng chọn chương trình đào tạo';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    try {
      await studentApi.update(id, formData);
      toast.success('Cập nhật sinh viên thành công');
      router.push('/dashboard/admin/students');
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Cập nhật sinh viên thất bại');
    } finally {
      setLoading(false);
    }
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

      <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Chỉnh sửa sinh viên
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section 1: Thông tin cá nhân */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center border-b pb-2">
                <User className="mr-2 h-5 w-5 text-blue-600" />
                Thông tin cá nhân
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <Label htmlFor="fullName">Họ và tên *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="mt-1.5"
                    placeholder="Nguyễn Văn A"
                  />
                  {errors.fullName && <p className="text-sm text-destructive mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <Label htmlFor="dateOfBirth">Ngày sinh</Label>
                  <div className="relative mt-1.5">
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    />
                    <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="gender">Giới tính</Label>
                  <Select 
                    value={formData.gender} 
                    onValueChange={(val) => setFormData({ ...formData, gender: val || '' })}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Chọn giới tính" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Nam</SelectItem>
                      <SelectItem value="female">Nữ</SelectItem>
                      <SelectItem value="other">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="phoneNumber">Số điện thoại</Label>
                  <div className="relative mt-1.5">
                    <Input
                      id="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      placeholder="0123456789"
                    />
                    <Phone className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="contactEmail">Email liên hệ</Label>
                  <div className="relative mt-1.5">
                    <Input
                      id="contactEmail"
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                      placeholder="example@gmail.com"
                    />
                    <Mail className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Thông tin học tập */}
            <div className="space-y-4 pt-4">
              <h3 className="text-lg font-semibold flex items-center border-b pb-2">
                <GraduationCap className="mr-2 h-5 w-5 text-green-600" />
                Thông tin học tập
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <Label htmlFor="studentCode">Mã sinh viên *</Label>
                  <Input
                    id="studentCode"
                    value={formData.studentCode}
                    onChange={(e) => setFormData({ ...formData, studentCode: e.target.value })}
                    className="mt-1.5 bg-gray-50"
                    placeholder="SV0001"
                    disabled
                  />
                  {errors.studentCode && <p className="text-sm text-destructive mt-1">{errors.studentCode}</p>}
                  <p className="text-[10px] text-gray-500 mt-1">Mã sinh viên không thể thay đổi</p>
                </div>

                <div>
                  <Label htmlFor="trainingProgramId">Chương trình đào tạo *</Label>
                  <Select 
                    value={formData.trainingProgramId} 
                    onValueChange={(val) => setFormData({ ...formData, trainingProgramId: val || '' })}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Chọn chương trình" />
                    </SelectTrigger>
                    <SelectContent>
                      {programs.map(p => (
                        <SelectItem key={p.trainingProgramId || p.programId || p.id} value={p.trainingProgramId || p.programId || p.id}>
                          {p.code || p.programCode || ''} - {p.name || p.programName || ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.trainingProgramId && <p className="text-sm text-destructive mt-1">{errors.trainingProgramId}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="isActive">Trạng thái sinh viên</Label>
                <Select 
                  value={formData.isActive ? 'active' : 'inactive'} 
                  onValueChange={(val) => setFormData({ ...formData, isActive: (val || 'active') === 'active' })}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Đang hoạt động</SelectItem>
                    <SelectItem value="inactive">Ngừng hoạt động</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="note" className="flex items-center">
                  <FileText className="mr-1 h-4 w-4" /> Ghi chú
                </Label>
                <Textarea
                  id="note"
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  className="mt-1.5"
                  placeholder="Nhập ghi chú (nếu có)"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                type="submit" 
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={loading}
              >
                {loading ? "Đang lưu..." : "💾 Cập nhật"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.push('/dashboard/admin/students')}
              >
                Hủy
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}