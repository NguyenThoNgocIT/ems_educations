'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';
import { studentApi } from '@/api/student';

interface StudentFormData {
  personId: string;
  studentCode: string;
  trainingProgramId: string;
  note: string;
}

const PROGRAM_OPTIONS = [
  { value: '40299068-E853-4123-946D-AB9E68D28971', label: '💻 Công nghệ thông tin (CNTT)' },
  { value: '61C1D31F-C6EC-4D74-A62B-C4B5071608B0', label: '📊 Hệ thống thông tin (HTTT)' },
  { value: 'F72A21BD-32F0-404D-9ADE-8FEFDDD218E3', label: '⚙️ Kỹ thuật phần mềm (KTPM)' },
  { value: '0DC1F922-5360-41BF-8EFF-71F5547DA30C', label: '📈 Quản trị kinh doanh (QTKD)' },
  { value: 'B3982A4C-97A2-4B4F-BE58-B0ECD2C38057', label: '🌐 Ngôn ngữ Anh (NN)' },
];

export default function CreateStudentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    personId: '40299068-E853-4123-946D-AB9E68D28971', // Mã ngành tự động điền
    studentCode: '',
    trainingProgramId: '40299068-E853-4123-946D-AB9E68D28971', // Công Nghệ Thông Tin
    note: ''
  });

  // Khi chọn ngành: tự động điền mã ngành vào ô personId
  const handleProgramChange = (value: string) => {
    setFormData({
      ...formData,
      trainingProgramId: value,
      personId: value  // tự động điền mã ngành
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentCode.trim()) {
      toast.error('Vui lòng nhập mã sinh viên');
      return;
    }

    setLoading(true);
    try {
      await studentApi.create(formData);
      toast.success('Thêm sinh viên thành công');
      router.push('/dashboard/admin/students');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Thêm sinh viên thất bại');
    } finally {
      setLoading(false);
    }
  };

  // Lấy tên hiển thị cho ô chương trình đào tạo
  const getSelectedLabel = () => {
    const found = PROGRAM_OPTIONS.find(p => p.value === formData.trainingProgramId);
    return found?.label || 'Công Nghệ Thông Tin';
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => router.back()} className="mb-2">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Quay lại
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">➕ Thêm sinh viên mới</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Mã ngành - TỰ ĐỘNG ĐIỀN */}
            <div>
              <Label className="font-semibold">
                Mã ngành <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formData.personId}
                className="mt-1.5 bg-gray-100 text-gray-600"
                placeholder="40299068-E853-4123-946D-AB9E68D28971"
                readOnly
              />
            </div>

            {/* Chương trình đào tạo - HIỂN THỊ TÊN */}
            <div>
              <Label className="font-semibold">
                Chương trình đào tạo <span className="text-red-500">*</span>
              </Label>
              <Input
                value="Công Nghệ Thông Tin"
                className="mt-1.5 bg-gray-100 text-gray-600"
                readOnly
              />
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

            {/* Nút bấm */}
            <div className="flex gap-3 pt-4">
              <Button 
                type="submit" 
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-semibold"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Đang xử lý...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    💾 LƯU & THÊM MỚI
                  </span>
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.push('/dashboard/admin/students')}
              >
                Hủy bỏ
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}