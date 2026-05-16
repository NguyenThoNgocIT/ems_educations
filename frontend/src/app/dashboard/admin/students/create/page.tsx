'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, UserPlus, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { studentApi } from '@/api/student';
import { trainingProgramApi } from '@/api/training-program';
import Select from 'react-select';

interface TrainingProgram {
  programId: string;      // Đồng bộ theo cấu trúc API trả về từ main
  programCode: string;    // Đồng bộ theo cấu trúc API trả về từ main
  programName: string;    // Đồng bộ theo cấu trúc API trả về từ main
}

interface SelectOption {
  value: string;
  label: string;
}

export default function CreateStudentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [programs, setPrograms] = useState<TrainingProgram[]>([]);
  const [loadingPrograms, setLoadingPrograms] = useState(true);
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

  // Lấy danh sách chương trình đào tạo từ API tập trung
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response: any = await trainingProgramApi.getAll({ size: 100 });
        // Kết quả từ Spring Data Page thường nằm trong trường .content
        setPrograms(response.content || response || []);
      } catch (error) {
        console.error('Không thể lấy danh sách chương trình:', error);
        toast.error('Không thể tải danh sách chương trình đào tạo');
      } finally {
        setLoadingPrograms(false);
      }
    };
    fetchPrograms();
  }, []);

  // Chuyển đổi sang định dạng của react-select để hiển thị kiếm tìm xịn sò
  const programOptions: SelectOption[] = programs.map(program => ({
    value: program.programId,
    label: `${program.programCode} - ${program.programName}`
  }));

  const handleProgramChange = (option: SelectOption | null) => {
    setFormData({ ...formData, trainingProgramId: option?.value || '' });
  };

  const generateEmail = (fullName: string) => {
    if (!fullName.trim()) return '';
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
      const enrollData = {
        fullName: formData.fullName,
        studentCode: formData.studentCode,
        trainingProgramId: formData.trainingProgramId,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        phoneNumber: formData.phoneNumber,
        contactEmail: formData.contactEmail || generateEmail(formData.fullName),
        note: formData.note
      };
      
      await studentApi.enroll(enrollData);
      toast.success('Thêm sinh viên thành công');
      router.push('/dashboard/admin/students');
    } catch (error: any) {
      console.error('❌ Lỗi:', error);
      toast.error(error.response?.data?.message || 'Thêm sinh viên thất bại');
    } finally {
      setLoading(false);
    }
  };

  if (loadingPrograms) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Tùy chỉnh phong cách giao diện của react-select phù hợp với Tailwind CSS hệ thống
  const customStyles = {
    control: (base: any) => ({
      ...base,
      borderRadius: '0.5rem',
      borderColor: '#e5e7eb',
      backgroundColor: 'white',
      padding: '2px 0',
      boxShadow: 'none',
      '&:hover': { borderColor: '#e5e7eb' },
      '&:focus-within': { borderColor: '#006633', boxShadow: '0 0 0 2px rgba(0,102,51,0.2)' }
    }),
    menu: (base: any) => ({
      ...base,
      borderRadius: '0.5rem',
      overflow: 'hidden',
      zIndex: 9999
    }),
    menuList: (base: any) => ({
      ...base,
      maxHeight: '200px',
      overflowY: 'auto'
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isFocused ? '#f3f4f6' : 'white',
      color: '#1f2937',
      cursor: 'pointer',
      '&:active': { backgroundColor: '#e5e7eb' }
    })
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
              <p className="text-xs text-gray-400 mt-1">
                Email: {formData.contactEmail || 'tên@donga.edu.vn'}
              </p>
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
                className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>

            {/* Chương trình đào tạo */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
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
              <Select
                options={programOptions}
                onChange={handleProgramChange}
                placeholder="-- Chọn chương trình --"
                isClearable
                styles={customStyles}
                menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
                maxMenuHeight={200}
              />
              {programs.length === 0 && (
                <p className="text-xs text-yellow-500 mt-1">
                  Không có chương trình đào tạo nào. Vui lòng thêm chương trình trước.
                </p>
              )}
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

            {/* Email liên hệ */}
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