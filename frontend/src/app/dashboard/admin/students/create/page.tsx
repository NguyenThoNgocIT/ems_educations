'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, UserPlus, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { studentApi } from '@/api/student';
import { trainingProgramApi } from '@/api/training-program';


export default function CreateStudentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [programs, setPrograms] = useState<any[]>([]);
  const [fetchingPrograms, setFetchingPrograms] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    studentCode: '',
    trainingProgramId: '',
    note: '',
    dateOfBirth: '',
    gender: 'Nam',
    phoneNumber: '',
    contactEmail: ''
  });

  // Lấy danh sách chương trình đào tạo từ BE
  React.useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response: any = await trainingProgramApi.getAll({ size: 100 });
        // Kết quả từ Spring Data Page thường nằm trong field .content
        setPrograms(response.content || []);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách chương trình:', error);
        toast.error('Không thể tải danh sách chương trình đào tạo');
      } finally {
        setFetchingPrograms(false);
      }
    };
    fetchPrograms();
  }, []);

  const handleProgramChange = (value: string) => {
    setFormData({ ...formData, trainingProgramId: value });
  };

  // Tạo email tự động từ họ tên
  const generateEmail = (fullName: string) => {
    const nameParts = fullName.trim().toLowerCase().split(' ');
    const lastName = nameParts[nameParts.length - 1];
    const firstName = nameParts[0];
    return `${lastName}.${firstName}@donga.edu.vn`;
  };

  const handleFullNameChange = (name: string) => {
    setFormData({ 
      ...formData, 
      fullName: name,
      contactEmail: generateEmail(name)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName.trim()) {
      toast.error('Vui lòng nhập họ và tên');
      return;
    }
    if (!formData.studentCode.trim()) {
      toast.error('Vui lòng nhập mã sinh viên');
      return;
    }
    if (!formData.trainingProgramId) {
      toast.error('Vui lòng chọn chương trình đào tạo');
      return;
    }
    if (!formData.dateOfBirth) {
      toast.error('Vui lòng chọn ngày sinh');
      return;
    }

    setLoading(true);
    try {
      // Gọi API enroll - tự động tạo Person + Student + User
      await studentApi.enroll({
        fullName: formData.fullName,
        studentCode: formData.studentCode,
        trainingProgramId: formData.trainingProgramId,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        phoneNumber: formData.phoneNumber,
        contactEmail: formData.contactEmail || generateEmail(formData.fullName),
        note: formData.note
      });

      toast.success('Thêm sinh viên thành công');
      router.push('/dashboard/admin/students');
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Thêm sinh viên thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => router.back()} className="mb-2">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Quay lại
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            <UserPlus className="inline mr-2 h-6 w-6" />
            Thêm sinh viên mới
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Họ và tên */}
            <div>
              <Label className="font-semibold">
                Họ và tên <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formData.fullName}
                onChange={(e) => handleFullNameChange(e.target.value)}
                className="mt-1.5"
                placeholder="VD: Nguyễn Văn A"
              />
              <p className="text-xs text-gray-400 mt-1">Email: {formData.contactEmail || 'tên@donga.edu.vn'}</p>
            </div>

            {/* Mã sinh viên */}
            <div>
              <Label className="font-semibold">
                Mã sinh viên <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formData.studentCode}
                onChange={(e) => setFormData({ ...formData, studentCode: e.target.value })}
                className="mt-1.5"
                placeholder="VD: SV20240001"
              />
            </div>

            {/* Ngày sinh */}
            <div>
              <Label className="font-semibold">
                Ngày sinh <span className="text-red-500">*</span>
              </Label>
              <Input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="mt-1.5"
              />
            </div>

            {/* Giới tính */}
            <div>
              <Label className="font-semibold">Giới tính</Label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 outline-none focus:border-green-500"
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>

            {/* Chương trình đào tạo */}
            <div>
              <div className="flex items-center justify-between">
                <Label className="font-semibold">
                  Chương trình đào tạo <span className="text-red-500">*</span>
                </Label>
                <Button 
                  type="button" 
                  variant="link" 
                  className="p-0 h-auto text-xs text-green-600 hover:text-green-700"
                  onClick={() => router.push('/dashboard/admin/training-programs/create')}
                >
                  <Plus className="h-3 w-3 mr-1" /> Thêm mới chương trình
                </Button>
              </div>
              <select
                value={formData.trainingProgramId}
                onChange={(e) => handleProgramChange(e.target.value)}
                disabled={fetchingPrograms}
                className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 outline-none focus:border-green-500 disabled:bg-gray-100"
              >
                <option value="">{fetchingPrograms ? '-- Đang tải... --' : '-- Chọn chương trình --'}</option>
                {programs.map((program) => (
                  <option key={program.programId} value={program.programId}>
                    {program.programCode} - {program.programName}
                  </option>
                ))}
              </select>
            </div>

            {/* Số điện thoại */}
            <div>
              <Label>Số điện thoại</Label>
              <Input
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="mt-1.5"
                placeholder="VD: 0987654321"
              />
            </div>

            {/* Email (không bắt buộc) */}
            <div>
              <Label>Email</Label>
              <Input
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="mt-1.5"
                placeholder="Để trống sẽ tự động tạo"
              />
            </div>

            {/* Ghi chú */}
            <div>
              <Label>Ghi chú</Label>
              <Textarea
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                className="mt-1.5"
                placeholder="Nhập ghi chú (nếu có)"
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={loading}>
                {loading ? "Đang xử lý..." : "💾 LƯU & THÊM MỚI"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push('/dashboard/admin/students')}>
                Hủy bỏ
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}